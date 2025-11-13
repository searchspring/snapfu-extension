import { getHostnameFromUrl, getHostnameConfig, setHostnameConfig } from '../utilities/utilities';
import { LocalData } from '../types/storage';

/**
 * Removes CSP meta tags from the document to prevent Content Security Policy restrictions.
 * This function is called when the extension is enabled for the current tab.
 */
function removeCSPMetaTags() {
	// Find all meta tags with http-equiv="Content-Security-Policy"
	const cspMetaTags = document.querySelectorAll('meta[http-equiv]');

	cspMetaTags.forEach((metaTag) => {
		const httpEquiv = metaTag.getAttribute('http-equiv');
		if (httpEquiv && httpEquiv.toLowerCase() === 'content-security-policy') {
			metaTag.remove();
		}
	});
}

/**
 * Sets up a MutationObserver to watch for dynamically added CSP meta tags.
 * If any are detected, they are immediately removed.
 * Returns the observer so it can be disconnected later if needed.
 */
function observeCSPMetaTags(): MutationObserver {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				// Check if the added node is a meta tag
				if (node.nodeName === 'META') {
					const metaElement = node as HTMLMetaElement;
					const httpEquiv = metaElement.getAttribute('http-equiv');
					if (httpEquiv && httpEquiv.toLowerCase() === 'content-security-policy') {
						metaElement.remove();
					}
				}

				// Check if the added node contains meta tags (e.g., a container with children)
				if (node instanceof Element) {
					const cspMetas = node.querySelectorAll('meta[http-equiv]');
					cspMetas.forEach((metaTag) => {
						const httpEquiv = metaTag.getAttribute('http-equiv');
						if (httpEquiv && httpEquiv.toLowerCase() === 'content-security-policy') {
							metaTag.remove();
						}
					});
				}
			});
		});
	});

	// Observe the entire document for added nodes
	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});

	return observer;
}

/**
 * Attempts to detect the location of an existing Snap integration script.
 * Searches the main document and iframes to find where the original bundle is located.
 * Returns both the CSS selector for injection target and the script element itself.
 */
function detectScriptLocationAndElement(): { injectionTarget: string; scriptElement: HTMLScriptElement | null } {
	const snapScriptSelector = 'script[id^=searchspring], script[id^=athos], script[src*="snapui.searchspring.io"], script[src*="snapui.athoscommerce.io"]';

	// Helper to get parent selector
	const getParentSelector = (element: Element | null): string => {
		if (!element || !element.parentElement) {
			return 'html';
		}

		const parent = element.parentElement;

		// Check if parent is body or head
		if (parent.tagName.toLowerCase() === 'body') {
			return 'body';
		}
		if (parent.tagName.toLowerCase() === 'head') {
			return 'head';
		}

		// For other elements, try to build a unique selector
		if (parent.id) {
			return `#${parent.id}`;
		}

		if (parent.className) {
			const classes = parent.className
				.trim()
				.split(/\s+/)
				.filter((c) => c.length > 0);
			if (classes.length > 0) {
				return `${parent.tagName.toLowerCase()}.${classes[0]}`;
			}
		}

		return parent.tagName.toLowerCase();
	};

	// Check main document
	const mainScript = document.querySelector(snapScriptSelector) as HTMLScriptElement;
	if (mainScript) {
		return {
			injectionTarget: getParentSelector(mainScript),
			scriptElement: mainScript,
		};
	}

	// Check iframes
	const iframes = Array.from(document.querySelectorAll('iframe'));
	for (const iframe of iframes) {
		try {
			const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
			if (!iframeDoc) continue;

			const iframeScript = iframeDoc.querySelector(snapScriptSelector) as HTMLScriptElement;
			if (iframeScript) {
				// Build iframe selector
				let iframeSelector = 'iframe';
				if (iframe.id) {
					iframeSelector = `iframe#${iframe.id}`;
				} else if (iframe.className) {
					const classes = iframe.className
						.trim()
						.split(/\s+/)
						.filter((c) => c.length > 0);
					if (classes.length > 0) {
						iframeSelector = `iframe.${classes[0]}`;
					}
				}

				const parentSelector = getParentSelector(iframeScript);
				return {
					injectionTarget: `${iframeSelector} >>> ${parentSelector}`,
					scriptElement: iframeScript,
				};
			}

			// Check nested iframes (one level deep)
			const nestedIframes = Array.from(iframeDoc.querySelectorAll('iframe'));
			for (const nestedIframe of nestedIframes) {
				try {
					const nestedDoc = nestedIframe.contentDocument || nestedIframe.contentWindow?.document;
					if (!nestedDoc) continue;

					const nestedScript = nestedDoc.querySelector(snapScriptSelector) as HTMLScriptElement;
					if (nestedScript) {
						// Build outer iframe selector
						let outerSelector = 'iframe';
						if (iframe.id) {
							outerSelector = `iframe#${iframe.id}`;
						} else if (iframe.className) {
							const classes = iframe.className
								.trim()
								.split(/\s+/)
								.filter((c) => c.length > 0);
							if (classes.length > 0) {
								outerSelector = `iframe.${classes[0]}`;
							}
						}

						// Build inner iframe selector
						let innerSelector = 'iframe';
						if (nestedIframe.id) {
							innerSelector = `iframe#${nestedIframe.id}`;
						} else if (nestedIframe.className) {
							const classes = nestedIframe.className
								.trim()
								.split(/\s+/)
								.filter((c) => c.length > 0);
							if (classes.length > 0) {
								innerSelector = `iframe.${classes[0]}`;
							}
						}

						const parentSelector = getParentSelector(nestedScript);
						return {
							injectionTarget: `${outerSelector} >>> ${innerSelector} >>> ${parentSelector}`,
							scriptElement: nestedScript,
						};
					}
				} catch (error) {
					// Cross-origin or other error - skip this nested iframe
					continue;
				}
			}
		} catch (error) {
			// Cross-origin or other error - skip this iframe
			continue;
		}
	}

	// No script found
	return {
		injectionTarget: '',
		scriptElement: null,
	};
}

async function injectCode(src: string, enabled: boolean) {
	const hostname = getHostnameFromUrl(window.location.href);

	if (!hostname) {
		return;
	}

	const hostnameConfig = await getHostnameConfig(hostname);

	// Always detect the original script to get the original bundle URL
	const { scriptElement: detectedScript } = detectScriptLocationAndElement();
	const originalBundleUrl = detectedScript?.getAttribute('src') || '';

	// Store the integration URL (either original or configured) regardless of enabled state
	try {
		const tabId = await new Promise<number>((resolve, reject) => {
			chrome.runtime.sendMessage({ text: 'getTabId' }, (response) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve(response);
				}
			});
		});

		if (tabId) {
			const key = String(tabId);
			const existing = await chrome.storage.local.get(key);

			// If enabled, use the configured URL; otherwise use the original URL from the page
			
			// Create full URL for originalBundleUrl if it's relative
			const fullOriginalBundleUrl = new URL(originalBundleUrl, window.location.origin).href;

			const integrationUrl = enabled ? hostnameConfig.bundle.url : fullOriginalBundleUrl;

			// Only store if we have a URL
			if (integrationUrl) {
				await chrome.storage.local.set({
					[key]: {
						...existing[key],
						integrationUrl: integrationUrl,
					},
				});
			}
		}
	} catch (error) {
		// Silently catching errors
	}

	if (enabled) {
		const scriptUrl = hostnameConfig.bundle.url;
		const context = hostnameConfig.bundle.context;
		const mergeContextOption = hostnameConfig.bundle.mergeContext;
		let injectionTarget = hostnameConfig.bundle.injectionTarget;

		// Detect the integration script location (we already detected the script element above)
		const { injectionTarget: detectedTarget } = detectScriptLocationAndElement();

		// If injection target is not set, use the detected location ONLY if it's in an iframe (contains >>>)
		if (!injectionTarget || injectionTarget.trim() === '') {
			if (detectedTarget && detectedTarget.includes('>>>')) {
				// Save the detected iframe location for future use
				injectionTarget = detectedTarget;
				hostnameConfig.bundle.injectionTarget = detectedTarget;
				await setHostnameConfig(hostname, hostnameConfig);
			}
		}

		// Use the detected script if available, otherwise search again
		let script = detectedScript;
		if (!script) {
			const scripts = Array.from(document.querySelectorAll('script[id^=searchspring], script[id^=athos], script[src*="snapui.searchspring.io"], script[src*="snapui.athoscommerce.io"]'));
			// Grab context from scripts (get the one with most content)
			script = scripts
				.sort((a, b) => {
					// Order them by innerHTML (so that popped script has innerHTML)
					return a.innerHTML.length - b.innerHTML.length;
				})
				.pop() as HTMLScriptElement;
		}

		// Read the current context BEFORE potentially clearing it
		const currentContext = script?.innerHTML;

		// Remove contexts if not merging
		if (!mergeContextOption) {
			const scripts = Array.from(document.querySelectorAll('script[id^=searchspring], script[id^=athos], script[src*="snapui.searchspring.io"], script[src*="snapui.athoscommerce.io"]'));
			scripts.forEach((s) => {
				s.innerHTML = '';
			});
		}

		// Check if the script has src and if the siteId is found in the src
		let siteIdContext = '';
		const siteIdMatches = script?.getAttribute('src')?.match(/.*snapui\.(searchspring|athoscommerce)\.io\/([a-zA-Z0-9]{6})\//);
		if (siteIdMatches && siteIdMatches.length > 2) {
			siteIdContext = `siteId = "${siteIdMatches[2]}";\n`;
		}

		// Grab attributes from script (if found)
		const integrationAttributes = Object.values(script?.attributes || {}).reduce((attrs: Record<string, string>, attr) => {
			const blocklist = ['id', 'src', 'type', 'defer', 'async'];
			const name = attr.nodeName;
			const value = script?.getAttribute(name);
			if (value && !blocklist.includes(name)) attrs[name] = value;
			return attrs;
		}, {});

		// Merge script context if configured
		let scriptContext = siteIdContext ? siteIdContext + context : context;
		if (mergeContextOption && currentContext && currentContext.trim()) {
			scriptContext = currentContext + '\n' + scriptContext;
		}

		if (scriptUrl) {
			const script = document.createElement('script');
			script.src = src;
			script.id = 'snapfu-script';
			script.setAttribute('url', scriptUrl);
			script.setAttribute('injectionTarget', injectionTarget);

			// Add element attributes from integration script (if found)
			Object.keys(integrationAttributes).forEach((key) => {
				script.setAttribute(key, integrationAttributes[key]);
			});

			if (scriptContext) {
				script.innerHTML = scriptContext;
			}
			(document.head || document.documentElement).appendChild(script);
		}
	}
}

function addScript(src: string) {
	if (src) {
		const script = document.createElement('script');
		script.src = src;
		script.id = 'snapfu-scraper';

		(document.head || document.documentElement).appendChild(script);
	}
}

// Async iife
(async function () {
	// Workaround to get the tabId from a content script
	try {
		chrome.runtime.sendMessage({ text: 'getTabId' }, async (tabId) => {
			// Check if extension context is still valid
			if (chrome.runtime.lastError) {
				return;
			}

			try {
				const key = String(tabId);
				const existing = await chrome.storage.local.get(key);

				// Always clear scrape data on page load, preserving only the enabled state
				const enabled = existing[key]?.enabled ?? false;
				await chrome.storage.local.set({
					[key]: { enabled },
				});

				document.addEventListener('snapfu-scrape', async (event) => {
					const data: LocalData = (event as CustomEvent).detail;
					try {
						const key = String(tabId);
						const existing = await chrome.storage.local.get(key);

						// Get existing enabled state or default to false
						const enabled = existing[key]?.enabled ?? false;

						// Preserve existing error if present and no version found
						const existingError = existing[key]?.error;

						// Preserve the integrationUrl that was set earlier
						const integrationUrl = existing[key]?.integrationUrl;

						// Save scrape data with enabled state (and preserve error if no version)
						await chrome.storage.local.set({
							[key]: {
								...data,
								enabled,
								// Preserve the integration URL
								...(integrationUrl ? { integrationUrl } : {}),
								// Keep the error if we still don't have a version
								...(existingError && !data.version
									? {
											error: existingError,
									  }
									: {}),
							},
						});
					} catch (error) {
						// Silently catching invalidated extension context
					}
				});
				
				// Listen for script loading errors from loader.ts
				document.addEventListener('snapfu-script-error', async (event) => {
					const errorData = (event as CustomEvent).detail;
					try {
						const key = String(tabId);
						const existing = await chrome.storage.local.get(key);

						// Get existing enabled state or default to false
						const enabled = existing[key]?.enabled ?? false;

						// Save error information with enabled state
						await chrome.storage.local.set({
							[key]: {
								...existing[key],
								enabled,
								error: errorData.error,
								timestamp: errorData.timestamp,
							},
						});
					} catch (error) {
						// Silently catching invalidated extension context
					}
				});
			} catch (error) {
				// Silently catching invalidated extension context
			}
		});
	} catch (error) {
		// Silently catching invalidated extension context
	}

	try {
		const loaderUrl = chrome.runtime.getURL('/js/loader.js');
		const scraperUrl = chrome.runtime.getURL('/js/scraper.js');

		// Get the enabled state for this tab
		chrome.runtime.sendMessage({ text: 'getTabEnabled' }, (response) => {
			if (chrome.runtime.lastError || !response) {
				return;
			}
			const enabled = response.enabled || false;

			// If enabled, remove CSP meta tags and set up observer
			if (enabled) {
				removeCSPMetaTags();
				observeCSPMetaTags();
			}

			injectCode(loaderUrl, enabled);
		});

		addScript(scraperUrl);
	} catch (error) {
		// Silently catching invalidated extension context
	}
})();

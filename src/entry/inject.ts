import { getHostnameFromUrl, getHostnameConfig } from '../utilities/utilities';
import { LocalData } from '../types/storage';

async function injectCode(src: string, enabled: boolean) {
	const hostname = getHostnameFromUrl(window.location.href);
	
	if (!hostname) {
		return;
	}

	const hostnameConfig = await getHostnameConfig(hostname);
	
	if (enabled) {
		const forceInject = hostnameConfig.forceInjection;
		const scriptUrl = hostnameConfig.bundle.url;
		const context = hostnameConfig.bundle.context;
		const mergeContextOption = hostnameConfig.bundle.mergeContext;

		const scripts = Array.from(document.querySelectorAll('script[id^=searchspring], script[src*="snapui.searchspring.io"]'));

		// Remove contexts if not merging
		if (!mergeContextOption) {
			scripts.forEach((script) => {
				script.innerHTML = '';
			});
		}

		// Grab context from scripts (get the one with most content)
		const script = scripts
			.sort((a, b) => {
				// Order them by innerHTML (so that popped script has innerHTML)
				return a.innerHTML.length - b.innerHTML.length;
			})
			.pop() as HTMLScriptElement;

		const currentContext = script?.innerHTML;

		// Check if the script has src and if the siteId is found in the src
		let siteIdContext = '';
		const siteIdMatches = script?.getAttribute('src')?.match(/.*snapui.searchspring.io\/([a-zA-Z0-9]{6})\//);
		if (siteIdMatches && siteIdMatches.length > 1) {
			siteIdContext = `siteId = "${siteIdMatches[1]}";\n`;
		}

		// Grab attributes from script (if found)
		const integrationAttributes = Object.values(script?.attributes || {}).reduce((attrs: Record<string, string>, attr) => {
			const blocklist = ['id', 'src', 'type', 'defer', 'async'];
			const name = attr.nodeName;
			const value = script.getAttribute(name);
			if (value && !blocklist.includes(name)) attrs[name] = value;
			return attrs;
		}, {});

		// Merge script context if configured
		let scriptContext = siteIdContext ? siteIdContext + context : context;
		if (mergeContextOption && currentContext) {
			scriptContext = currentContext + '\n' + scriptContext;
		}

		if (scriptUrl) {
			const script = document.createElement('script');
			script.src = src;
			script.id = 'snapfu-script';
			script.setAttribute('url', scriptUrl);
			script.setAttribute('force-inject', `${Boolean(forceInject)}`);

			// Add element attributes from integration script (if found)
			Object.keys(integrationAttributes).forEach((key) => {
				script.setAttribute(key, integrationAttributes[key]);
			});

			if (scriptContext){
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
					[key]: { enabled }
				});

				document.addEventListener('snapfu-scrape', async (event) => {
					const data: LocalData = (event as CustomEvent).detail;
					try {
						const key = String(tabId);
						const existing = await chrome.storage.local.get(key);
						
						// Get existing enabled state or default to false
						const enabled = existing[key]?.enabled ?? false;
						
						// Save scrape data with enabled state
						await chrome.storage.local.set({
							[key]: { ...data, enabled }
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
			injectCode(loaderUrl, enabled);
		});
		
		addScript(scraperUrl);
	} catch (error) {
		// Silently catching invalidated extension context
	}
})();

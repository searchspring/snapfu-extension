import { StoredData, HostnameConfig } from '@/types/storage';
import { getConfig, getCurrentTabId, getTabEnabled, getHostnameFromUrl } from '../utilities/utilities';

// Mutex to prevent concurrent rule updates
let isUpdatingRules = false;
let pendingRuleUpdate: Promise<void> | null = null;

// Clear any old dynamic rules from previous versions (we now use session rules)
chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
	if (existingRules.length > 0) {
		const ruleIds = existingRules.map((rule) => rule.id);
		chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: ruleIds,
			addRules: [],
		});
	}
});

// Update the extension icon and set intercepts
update();

// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener(async (_changes, area) => {
	if (area === 'sync') {
		try {
			// Hostname configs changed - update intercepts
			await update();
		} catch (error) {
			// Silently catching invalidated extension context
		}
	}

	// Watch for enabled state changes in local storage to update intercepts
	if (area === 'local') {
		try {
			let shouldUpdateIntercepts = false;

			// Check if any tab's enabled state changed
			for (const key in _changes) {
				const tabId = Number(key);
				if (!isNaN(tabId) && _changes[key].newValue?.enabled !== undefined) {
					shouldUpdateIntercepts = true;
					// Update icon immediately when enabled state changes
					await updateIconForTab(tabId);
				}
			}

			// Update intercepts if any tab's enabled state changed
			if (shouldUpdateIntercepts) {
				await checkForIntercepts(await getConfig());
			}
		} catch (error) {
			// Silently catching invalidated extension context
		}
	}
});

// Watch for tab changes to update icon
chrome.tabs.onActivated.addListener(async (activeInfo) => {
	try {
		await updateIconForTab(activeInfo.tabId);
	} catch (error) {
		// Silently catching invalidated extension context
	}
});

// Watch for tab URL changes and page loads to update icon
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
	// When the URL changes (new navigation committed), check sticky mode and auto-enable
	// if another tab already has this hostname active. This must happen before resources
	// are fetched so the declarativeNetRequest rules are in place in time.
	if (changeInfo.url) {
		try {
			const newHostname = getHostnameFromUrl(changeInfo.url);
			if (newHostname) {
				const config = await getConfig();
				const hostnameConfig = config.hostnameConfigs[newHostname];
				if (hostnameConfig && config.autoEnable) {
					// Find any other tab that has this hostname enabled
					const allLocal = await chrome.storage.local.get(null);
					const hostnameIsActive = Object.entries(allLocal).some(([key, value]) => {
						const otherTabId = Number(key);
						return !isNaN(otherTabId) && otherTabId !== tabId && (value as any)?.enabled === true && (value as any)?.hostname === newHostname;
					});

					if (hostnameIsActive) {
						const existingRules = await chrome.declarativeNetRequest.getSessionRules();
						const startId = existingRules.reduce((max, r) => Math.max(max, r.id), 0) + 1;
						const quickRules = buildTabRules(tabId, newHostname, hostnameConfig, startId);
						await chrome.declarativeNetRequest.updateSessionRules({ addRules: quickRules, removeRuleIds: [] });

						// Write storage after rules are in place.
						// This triggers storage.onChanged → full checkForIntercepts reconciliation.
						await chrome.storage.local.set({
							[String(tabId)]: { enabled: true, hostname: newHostname },
						});
					}
				}
			}
		} catch (error) {
			// Silently catching invalidated extension context
		}
	}

	// Update icon on URL change or when page starts loading (not just when complete)
	// This ensures icon updates immediately when page reload starts
	if (changeInfo.url || changeInfo.status === 'loading' || changeInfo.status === 'complete') {
		try {
			await updateIconForTab(tabId);
		} catch (error) {
			// Silently catching invalidated extension context
		}
	}
});

// Clean up storage when tabs are closed
chrome.tabs.onRemoved.addListener(async (tabId) => {
	try {
		const key = String(tabId);
		await chrome.storage.local.remove(key);
	} catch (error) {
		// Silently catching invalidated extension context
	}
});

async function update() {
	const config = await getConfig();

	await checkForIntercepts(config);

	// Update icon for current tab
	const tabIdStr = await getCurrentTabId();
	if (tabIdStr) {
		await updateIconForTab(Number(tabIdStr));
	}
}

async function updateIconForTab(tabId: number) {
	try {
		const tab = await chrome.tabs.get(tabId);
		if (!tab.url) return;

		const hostname = getHostnameFromUrl(tab.url);
		if (!hostname) return;

		const enabled = await getTabEnabled(tabId);

		// Select icons based on enabled state
		const iconPaths = enabled
			? {
					'48': '/assets/icons/athos-icon-on-48.png',
					'128': '/assets/icons/athos-icon-on-128.png',
			  }
			: {
					'48': '/assets/icons/athos-icon-48.png',
					'128': '/assets/icons/athos-icon-128.png',
			  };

		await chrome.action.setIcon({ path: iconPaths, tabId });
	} catch (error) {
		// Tab may have been closed, or extension context invalidated - silently ignore
		if (chrome.runtime.lastError) {
			void chrome.runtime.lastError;
		}
		return;
	}
}

async function checkForIntercepts(config: StoredData) {
	// Prevent concurrent rule updates by using a mutex
	if (isUpdatingRules) {
		// If an update is already in progress, wait for it and then start a new one
		if (pendingRuleUpdate) {
			await pendingRuleUpdate;
		}
	}

	// Set the lock
	isUpdatingRules = true;
	pendingRuleUpdate = performRuleUpdate(config);

	try {
		await pendingRuleUpdate;
	} finally {
		isUpdatingRules = false;
		pendingRuleUpdate = null;
	}
}

async function performRuleUpdate(config: StoredData) {
	const rules: chrome.declarativeNetRequest.Rule[] = [];
	let ruleId = 1;

	// Get all tabs and create per-tab rules for enabled tabs
	const tabs = await chrome.tabs.query({});

	for (const tab of tabs) {
		if (!tab.id || !tab.url) continue;

		const tabId = tab.id;
		const hostname = getHostnameFromUrl(tab.url);
		if (!hostname) continue;

		const enabled = await getTabEnabled(tabId);
		if (!enabled) continue;

		const hostnameConfig = config.hostnameConfigs[hostname];
		if (!hostnameConfig) continue;

		const tabRules = buildTabRules(tabId, hostname, hostnameConfig, ruleId);
		ruleId += tabRules.length;
		rules.push(...tabRules);
	}

	const existingRules = await chrome.declarativeNetRequest.getSessionRules();
	await chrome.declarativeNetRequest.updateSessionRules({
		addRules: rules,
		removeRuleIds: existingRules.map((r) => r.id),
	});
}

function buildTabRules(tabId: number, hostname: string, hostnameConfig: HostnameConfig, startId: number): chrome.declarativeNetRequest.Rule[] {
	const rules: chrome.declarativeNetRequest.Rule[] = [];
	let id = startId;

	const rawIntercepts = (hostnameConfig.intercepts || '').split('\n').filter((a) => a.trim().length > 0);

	rawIntercepts.forEach((intercept) => {
		rules.push({
			id: id++,
			priority: 1,
			action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
			condition: {
				urlFilter: intercept,
				tabIds: [tabId],
				initiatorDomains: [hostname],
				resourceTypes: [chrome.declarativeNetRequest.ResourceType.SCRIPT],
			},
		});
	});

	if (hostnameConfig.bundle.url) {
		rules.push({
			id: id++,
			priority: 2,
			action: { type: chrome.declarativeNetRequest.RuleActionType.ALLOW },
			condition: {
				urlFilter: hostnameConfig.bundle.url,
				tabIds: [tabId],
				resourceTypes: [chrome.declarativeNetRequest.ResourceType.SCRIPT],
			},
		});
	}

	rules.push({
		id: id++,
		priority: 1,
		action: {
			type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
			responseHeaders: [
				{ header: 'content-security-policy', operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
				{ header: 'content-security-policy-report-only', operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
			],
		},
		condition: {
			urlFilter: `*://${hostname}/*`,
			tabIds: [tabId],
			resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME, chrome.declarativeNetRequest.ResourceType.SUB_FRAME],
		},
	});

	return rules;
}

// Message handler for content scripts
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse): boolean {
	if (msg.text == 'getTabId' && sender?.tab?.id) {
		sendResponse(sender.tab.id);
		return false;
	}

	if (msg.text == 'getTabEnabled' && sender?.tab?.id) {
		getTabEnabled(sender.tab.id).then((enabled) => {
			sendResponse({ enabled });
		});
		return true; // Indicates async response
	}

	return false;
});

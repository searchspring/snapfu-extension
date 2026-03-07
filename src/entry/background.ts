import { StoredData } from '@/types/storage';
import { getConfig, getCurrentTabId, getTabEnabled, getHostnameFromUrl } from '../utilities/utilities';

// Mutex to prevent concurrent rule updates
let isUpdatingRules = false;
let pendingRuleUpdate: Promise<void> | null = null;

// Clear any old dynamic rules from previous versions (we now use session rules)
chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
	if (existingRules.length > 0) {
		const ruleIds = existingRules.map(rule => rule.id);
		chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: ruleIds,
			addRules: []
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
				'128': '/assets/icons/athos-icon-on-128.png'
			}
			: {
				'48': '/assets/icons/athos-icon-48.png',
				'128': '/assets/icons/athos-icon-128.png'
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
	// Simple sequential IDs starting from 1 - no collisions since we serialize updates
	let ruleId = 1;

	// Get all tabs and create per-tab rules for enabled tabs
	const tabs = await chrome.tabs.query({});
	
	for (const tab of tabs) {
		if (!tab.id || !tab.url) continue;
		
		const tabId = tab.id; // tab.id is guaranteed to be defined here
		const hostname = getHostnameFromUrl(tab.url);
		if (!hostname) continue;
		
		const enabled = await getTabEnabled(tabId);
		
		if (!enabled) continue;
		
		const hostnameConfig = config.hostnameConfigs[hostname];
		if (!hostnameConfig) {
			continue;
		}
		
		const rawIntercepts = (hostnameConfig.intercepts || '')
			.split('\n')
			.filter((a) => a.trim().length > 0);

		// Block the original bundles specified in intercepts - scoped to this specific tab and
		// hostname so that navigating to a new domain doesn't block that domain's bundle.
		rawIntercepts.forEach((intercept) => {
			rules.push({
				id: ruleId++,
				priority: 1,
				action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
				condition: { 
					urlFilter: intercept,
					tabIds: [tabId],
					initiatorDomains: [hostname],
					resourceTypes: [chrome.declarativeNetRequest.ResourceType.SCRIPT] 
				},
			});
		});

		// Allow the custom bundle URL (higher priority overrides blocks) - scoped to this specific tab
		if (hostnameConfig.bundle.url) {
			rules.push({
				id: ruleId++,
				priority: 2,
				action: { type: chrome.declarativeNetRequest.RuleActionType.ALLOW },
				condition: { 
					urlFilter: hostnameConfig.bundle.url,
					tabIds: [tabId],
					resourceTypes: [chrome.declarativeNetRequest.ResourceType.SCRIPT] 
				},
			});
		}

		// Remove CSP headers for this tab
		rules.push({
			id: ruleId++,
			priority: 1,
			action: { 
				type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
				responseHeaders: [
					{ header: "content-security-policy", operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
					{ header: "content-security-policy-report-only", operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
				],
			},
			condition: { 
				urlFilter: `*://${hostname}/*`,
				tabIds: [tabId],
				resourceTypes: [
					chrome.declarativeNetRequest.ResourceType.MAIN_FRAME, 
					chrome.declarativeNetRequest.ResourceType.SUB_FRAME
				] 
			},
		});
	}

	return new Promise<void>((resolve) => {
		try {
			chrome.declarativeNetRequest.getSessionRules((existingRules) => {
				const existingRulesToRemove = existingRules.map((rule) => rule.id);
				chrome.declarativeNetRequest.updateSessionRules(
					{
						addRules: rules,
						removeRuleIds: existingRulesToRemove,
					},
					() => {
						resolve();
					}
				);
			});
		} catch (error) {
			// Silently catching invalidated extension context
			resolve();
		}
	});
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


import { StoredData } from '@/types/storage';
import { getConfig, getCurrentTabId } from '../utilities/utilities';

// update the extension icon and set intercepts
update();

// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener(async (_changes, area) => {
	if (area === 'sync') {
		try {
			// clear local storage
			chrome.storage.local.clear();

			await update();
			await reloadCurrentTab();
		} catch (error) {
			// silently catching invalidated extension context
		}
	}
});

async function update() {
	const config = await getConfig();

	await checkForIntercepts(config);
	updateIcon(config);
}

function updateIcon(config: StoredData) {
	// set the extension icon if enabled
	try {
		if (config.settings.enabled) {
			chrome.action.setIcon({
				path: {
					'48': '../assets/icons/snapfu48_on.png',
					'128': '../assets/icons/snapfu128_on.png',
				},
			});
		} else {
			chrome.action.setIcon({
				path: {
					'48': '../assets/icons/snapfu48.png',
					'128': '../assets/icons/snapfu128.png',
				},
			});
		}
	} catch (error) {
		// silently catching invalidated extension context
	}
}

function checkForIntercepts(config: StoredData) {
	const rawIntercepts = config.settings.intercepts.split('\n')?.filter((a) => (a.length ? a.trim() : false));
	const intercepts: chrome.declarativeNetRequest.Rule[] = rawIntercepts.map((intercept, index) => ({
		id: index + 1,
		priority: index + 1,
		action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
		condition: { urlFilter: intercept, resourceTypes: ['script'] },
	}));

	// add intercept allow for bundle URL
	if (config.bundle.url) {
		intercepts.push({
			id: intercepts.length + 1,
			priority: intercepts.length + 1,
			action: { type: chrome.declarativeNetRequest.RuleActionType.ALLOW },
			condition: { urlFilter: config.bundle.url, resourceTypes: [chrome.declarativeNetRequest.ResourceType.SCRIPT] },
		});
	}

	// Remove CSP headers to allow localhost script injection
	if (config.settings.enabled) {
		intercepts.push({
			id: intercepts.length + 2,
			priority: intercepts.length + 2,
			action: { 
				type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
				responseHeaders: [
					{ header: "content-security-policy", operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
				],
			},
			condition: { urlFilter: "*", resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME, chrome.declarativeNetRequest.ResourceType.SUB_FRAME] },
		});
	}

	return new Promise<void>((resolve) => {
		try {
			chrome.declarativeNetRequest.getDynamicRules((rules) => {
				const existingRulesToRemove = rules.map((rule) => rule.id);
				const addRules = config.settings.enabled ? intercepts : [];
				chrome.declarativeNetRequest.updateDynamicRules(
					{
						addRules: addRules,
						removeRuleIds: existingRulesToRemove || [],
					},
					() => {
						resolve();
					}
				);
			});
		} catch (error) {
			// silently catching invalidated extension context
			resolve();
		}
	});
}

async function reloadCurrentTab() {
	try {
		const id = await getCurrentTabId();
		if (id) {
			return chrome.tabs.reload(Number(id));
		}
	} catch (error) {
		// silently catching invalidated extension context
	}
}

// workaround to get the tabId from a content script
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse): void {
	if (msg.text == 'getTabId' && sender?.tab?.id) {
		sendResponse(sender.tab.id);
	}
});

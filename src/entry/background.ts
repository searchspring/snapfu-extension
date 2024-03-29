import { StoredData } from '@/types/storage';
import { getConfig, getCurrentTabId } from '../utilities/utilities';

// update the extension icon and set intercepts
update();

// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener(async (_changes, area) => {
	if (area === 'sync') {
		// clear local storage
		chrome.storage.local.clear();

		update();
		reloadCurrentTab();
	}
});

async function update() {
	const config = await getConfig();

	checkForIntercepts(config);
	updateIcon(config);
}

function updateIcon(config: StoredData) {
	// set the extension icon if enabled
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

	//  ** modifying the response headers to remove the csp is no longer supported. 
	// intercepts.push({
	// 	id: intercepts.length + 2,
	// 	priority: 1,
	// 	action: { 
	// 		type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
	// 		responseHeaders: [
	// 			{ header: "content-security-policy", operation: chrome.declarativeNetRequest.HeaderOperation.SET, value: "" },
	// 		],
	// 	},
	// 	condition: { urlFilter: "*", resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME] },
	// })

	chrome.declarativeNetRequest.getDynamicRules((rules) => {
		const existingRulesToRemove = rules.map((rule) => rule.id);
		const addRules = config.settings.enabled ? intercepts : [];
		chrome.declarativeNetRequest.updateDynamicRules({
			addRules: addRules,
			removeRuleIds: existingRulesToRemove || [],
		});
	});
}

async function reloadCurrentTab() {
	const id = await getCurrentTabId();
	if (id) {
		return chrome.tabs.reload(Number(id));
	}
}

// workaround to get the tabId from a content script
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse): void {
	if (msg.text == 'getTabId' && sender?.tab?.id) {
		sendResponse(sender.tab.id);
	}
});

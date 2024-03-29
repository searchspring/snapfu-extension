import { getConfig } from '../utilities/utilities';
import { LocalData } from '../types/storage';

async function injectCode(src: string) {
	const config = await getConfig();
	if (config.settings.enabled) {
		const scriptUrl = config.bundle.url;
		const context = config.bundle.context;
		const mergeContextOption = config.bundle.mergeContext;

		const scripts = Array.from(document.querySelectorAll('script[id^=searchspring], script[src*="snapui.searchspring.io"]'));

		// remove contexts if not merging
		if (!mergeContextOption) {
			scripts.forEach((script) => {
				script.innerHTML = '';
			});
		}

		// grab context from scripts (get the one with most content)
		const script = scripts
			.sort((a, b) => {
				// order them by innerHTML (so that popped script has innerHTML)
				return a.innerHTML.length - b.innerHTML.length;
			})
			.pop() as HTMLScriptElement;

		const currentContext = script?.innerHTML;

		// grab attributes from script (if found)
		const integrationAttributes = Object.values(script?.attributes || {}).reduce((attrs: Record<string, string>, attr) => {
			const blocklist = ['id', 'src', 'type', 'defer', 'async'];
			const name = attr.nodeName;
			const value = script.getAttribute(name);
			if (value && !blocklist.includes(name)) attrs[name] = value;
			return attrs;
		}, {});

		// merge script context if configured
		let scriptContext = context;
		if (mergeContextOption && currentContext) {
			scriptContext = currentContext + '\n' + context;
		}

		if (scriptUrl) {
			const script = document.createElement('script');
			script.src = src;
			script.id = 'snapfu-script';
			script.setAttribute('url', scriptUrl);
			
			// add element attributes from integration script (if found)
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

// async iife
(async function () {
	// workaround to get the tabId from a content script
	chrome.runtime.sendMessage({ text: 'getTabId' }, async (tabId) => {
		const data = await chrome.storage.local.get();
		if (tabId && data[tabId]) {
			delete data[tabId];
		}
		await chrome.storage.local.set(data);

		document.addEventListener('snapfu-scrape', async (event) => {
			const data: LocalData = (event as CustomEvent).detail;
			const storedData = await chrome.storage.local.get();
			if (tabId) {
				storedData[tabId] = data;
				// save it to chrome local storage...
				chrome.storage.local.set(storedData);
			}
		});
	});

	injectCode(chrome.runtime.getURL('/js/loader.js'));
	addScript(chrome.runtime.getURL('/js/scraper.js'));
})();

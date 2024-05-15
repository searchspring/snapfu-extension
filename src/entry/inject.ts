import { getConfig } from '../utilities/utilities';
import { LocalData } from '../types/storage';

async function injectCode(src: string) {
	const config = await getConfig();
	if (config.settings.enabled) {
		const scriptUrl = config.bundle.url;
		const context = config.bundle.context;
		const mergeContextOption = config.bundle.mergeContext;

		const scripts = Array.from(document.querySelectorAll('script[id^=searchspring], script[src*="snapui.searchspring.io"], script[src*="searchspring.catalog.js"]'));

		// remove contexts if not merging
		if (!mergeContextOption) {
			scripts.forEach((script) => {
				if(checkV3Script(script)){
					const attrsToKeep = ['id', 'src', 'type', 'defer', 'async', 'hide-content'];
					Object.entries(script.attributes)
						.map(attr=>attr[1].name)
						.filter(attr=>!attrsToKeep.includes(attr))
						.forEach(attr=>script.removeAttribute(attr))
				} else {
					script.innerHTML = '';
				}
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

		const oldScript = script;

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

			const isV3Script = checkV3Script(oldScript);
			if(isV3Script){
				script.setAttribute('url', oldScript.getAttribute('src') + '&snapfu'); //'&snapfu' evades default network intercept
				oldScript.setAttribute('external', scriptUrl); //scriptURL is now the local angular.js resource
				script.setAttribute('external', scriptUrl);
			} else {
				script.setAttribute('url', scriptUrl);
			}
			
			// add element attributes from integration script (if found)
			Object.keys(integrationAttributes).forEach((key) => {
				script.setAttribute(key, integrationAttributes[key]);
			});

			if (scriptContext){
				script.innerHTML = scriptContext;

				// add script context as inline attributes on new v3 script if applicable
				if(isV3Script){
					const contextObj = getContextFromString(scriptContext);
					const mergedContextObj = {...oldScript, ...contextObj};
					Object.keys(mergedContextObj).forEach((key) => {
						const value = (typeof mergedContextObj[key] == 'object') ? JSON.stringify(mergedContextObj[key]) : mergedContextObj[key];
						script.setAttribute(key, value);
						oldScript.setAttribute(key, value);
					});
				}
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

// convert context variables to an object for v3 scripts
function getContextFromString(contextString : string) {
	// find starting & ending indicies of new context variables
	const indicies : number[] = [];
	const parts = contextString.split(/(\n|;)/);
	parts.forEach((part,i) => {
		if(part.includes('=')) indicies.push(i);
	});

	// extract variables and transform into JSON strings
	const variables = [];
	for(let i = 0; i < indicies.length; i++) {
		const tokens = parts.slice(indicies[i], indicies[i+1]).join('').split("="); //[name, value]
		variables.push(`"${tokens[0].trim()}" : ${tokens[1].trim().replaceAll('\'','"').replaceAll(/\w+(?=\s*?:)/g,'"$&"')}`); // "name" : "value"
	}

	return JSON.parse(`{${variables.map((v)=>{return v.replaceAll(/(\n|;)/g,"")}).join()}}`);
}

function checkV3Script(script : Element) {
	return script && script.getAttribute('src')?.includes('searchspring.catalog.js')
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

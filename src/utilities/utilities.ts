import { StoredData } from '../types/storage';

export const defaultConfig: StoredData = {
	settings: {
		enabled: false,
		intercepts: `*://snapui.searchspring.io/*/bundle.js*
*://cdn.searchspring.net/search/v3/js/searchspring.catalog.js*
*://cdn.searchspring.net/search/v3/lts/searchspring.catalog.js*`,
		forceInjection: false,
	},
	bundle: {
		url: 'https://localhost:3333/bundle.js',
		context: `shopper = {
  id: 'snapdev'
};`,
		mergeContext: true,
	},
};

export const setConfig = (data: StoredData): void => {
	chrome.storage.sync.set(data);
};

export const resetConfig = (): void => {
	setConfig(defaultConfig);
};

export const getConfig = async (): Promise<StoredData> => {
	const storedData = (await chrome.storage.sync.get()) as StoredData;
	return typeof storedData?.bundle?.url != 'undefined' ? storedData : defaultConfig;
};

// deep compare function
export const deepCompare = (x: any, y: any): boolean => {
	if (x === y) return true;

	if (typeof x !== typeof y) return false;

	if (typeof x === 'object') {
		if (Array.isArray(x) && Array.isArray(y)) {
			if (x.length !== y.length) return false;
			for (let i = 0; i < x.length; i++) {
				if (!deepCompare(x[i], y[i])) return false;
			}
			return true;
		} else {
			const xKeys = Object.keys(x);
			const yKeys = Object.keys(y);
			if (xKeys.length !== yKeys.length) return false;
			for (const key of xKeys) {
				if (!yKeys.includes(key) || !deepCompare(x[key], y[key])) return false;
			}
			return true;
		}
	}

	return false;
};

export const getCurrentTabId = async (): Promise<string | undefined> => {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return `${tab.id}` || undefined;
};

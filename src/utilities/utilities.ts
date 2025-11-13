import { StoredData, HostnameConfig } from '../types/storage';

export const defaultHostnameConfig: HostnameConfig = {
	intercepts: `*://snapui.athoscommerce.io/*/bundle.js*\n*://snapui.searchspring.io/*/bundle.js*`,
	bundle: {
		url: 'https://localhost:3333/bundle.js',
		context: `shopper = {
  id: 'snapdev'
};`,
		mergeContext: true,
		injectionTarget: '',
	},
	integrationCollapsed: false,
};

export const defaultConfig: StoredData = {
	hostnameConfigs: {},
};

export const setConfig = async (data: StoredData): Promise<void> => {
	try {
		await chrome.storage.sync.set(data);
	} catch (error) {
		// Silently catching invalidated extension context
	}
};

export const getConfig = async (): Promise<StoredData> => {
	try {
		const storedData = await chrome.storage.sync.get();
		if (Object.keys(storedData).length === 0) {
			return defaultConfig;
		}
		return storedData as StoredData;
	} catch (error) {
		return defaultConfig;
	}
};

// Get hostname from URL
export const getHostnameFromUrl = (url: string): string | null => {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname;
	} catch (error) {
		return null;
	}
};

// Get current tab's hostname
export const getCurrentHostname = async (): Promise<string | null> => {
	try {
		const queryOptions = { active: true, currentWindow: true };
		const [tab] = await chrome.tabs.query(queryOptions);
		if (tab.url) {
			return getHostnameFromUrl(tab.url);
		}
		return null;
	} catch (error) {
		return null;
	}
};

// Get hostname config
export const getHostnameConfig = async (hostname: string): Promise<HostnameConfig> => {
	const config = await getConfig();
	return config.hostnameConfigs[hostname] || JSON.parse(JSON.stringify(defaultHostnameConfig));
};

// Set hostname config
export const setHostnameConfig = async (hostname: string, hostnameConfig: HostnameConfig): Promise<void> => {
	const config = await getConfig();
	config.hostnameConfigs[hostname] = hostnameConfig;
	await setConfig(config);
};

// Get hostname config for a specific tab
export const getTabHostnameConfig = async (tabId: number): Promise<{ hostname: string | null; config: HostnameConfig }> => {
	try {
		const tab = await chrome.tabs.get(tabId);
		if (tab.url) {
			const hostname = getHostnameFromUrl(tab.url);
			if (hostname) {
				const config = await getHostnameConfig(hostname);
				return { hostname, config };
			}
		}
	} catch (error) {
		// Tab may have been closed - silently ignore
	}
	return { hostname: null, config: JSON.parse(JSON.stringify(defaultHostnameConfig)) };
};

// Get per-tab enabled state from local storage
export const getTabEnabled = async (tabId: number): Promise<boolean> => {
	try {
		const key = String(tabId);
		const data = await chrome.storage.local.get(key);
		const tabData = data[key];
		return tabData?.enabled ?? false; // default to false
	} catch (error) {
		return false;
	}
};

// Set per-tab enabled state in local storage
export const setTabEnabled = async (tabId: number, enabled: boolean): Promise<void> => {
	try {
		const key = String(tabId);
		const existing = await chrome.storage.local.get(key);
		await chrome.storage.local.set({
			[key]: {
				...existing[key],
				enabled,
			}
		});
	} catch (error) {
		// Silently catching errors
	}
};

// Deep compare function
export const deepCompare = <T>(x: T, y: T): boolean => {
	if (x === y) return true;

	if (x === null || y === null) return false;
	if (x === undefined || y === undefined) return false;

	if (typeof x !== typeof y) return false;

	if (typeof x === 'object' && typeof y === 'object') {
		if (Array.isArray(x) && Array.isArray(y)) {
			if (x.length !== y.length) return false;
			for (let i = 0; i < x.length; i++) {
				if (!deepCompare(x[i], y[i])) return false;
			}
			return true;
		}
		
		if (Array.isArray(x) || Array.isArray(y)) return false;
		
		const xKeys = Object.keys(x);
		const yKeys = Object.keys(y);
		if (xKeys.length !== yKeys.length) return false;
		
		for (const key of xKeys) {
			if (!yKeys.includes(key)) return false;
			if (!deepCompare((x as any)[key], (y as any)[key])) return false;
		}
		return true;
	}

	return false;
};

export const getCurrentTabId = async (): Promise<string | undefined> => {
	try {
		const queryOptions = { active: true, currentWindow: true };
		const [tab] = await chrome.tabs.query(queryOptions);
		if (tab?.id) {
			return `${tab.id}`;
		}
		return undefined;
	} catch (error) {
		return undefined;
	}
};

// Safely reload a tab, handling the case where it might have been closed
export const safeReloadTab = async (tabId: number): Promise<boolean> => {
	try {
		// First check if the tab still exists
		await chrome.tabs.get(tabId);
		// If no error, the tab exists, so reload it
		await chrome.tabs.reload(tabId);
		return true;
	} catch (error) {
		// Tab doesn't exist or can't be reloaded - silently ignore
		if (chrome.runtime.lastError) {
			// Clear the lastError
			void chrome.runtime.lastError;
		}
		return false;
	}
};

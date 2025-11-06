// Per-hostname settings (shared across all tabs with same hostname)
export type HostnameConfig = {
	intercepts: string;
	forceInjection?: boolean;
	bundle: {
		url: string;
		mergeContext: boolean;
		context: string;
	};
};

// Main storage structure (chrome.storage.sync)
export type StoredData = {
	hostnameConfigs: {
		[hostname: string]: HostnameConfig;
	};
};

export type ControllerInfo = any;

// Per-tab data (chrome.storage.local)
export type LocalData = {
	timestamp?: number;
	version?: string;
	controllers?: ControllerInfo[];
	context?: {
		[variable: string]: any;
	};
	enabled?: boolean; // Per-tab enabled state
};

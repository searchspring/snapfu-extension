// Per-hostname settings (shared across all tabs with same hostname)
export type HostnameConfig = {
	intercepts: string;
	bundle: {
		url: string;
		mergeContext: boolean;
		context: string;
		injectionTarget: string;
	};
	integrationCollapsed: boolean;
};

// Type for any value that can be found within HostnameConfig
export type HostnameConfigValue = string | boolean | HostnameConfig['bundle'] | HostnameConfig;

// Main storage structure (chrome.storage.sync)
export type StoredData = {
	hostnameConfigs: {
		[hostname: string]: HostnameConfig;
	};
};

export type ControllerInfo = {
	id: string;
	type: string;
	store: {
		loaded: boolean;
		results: unknown[];
		pagination?: {
			defaultPageSize: number;
			page: number;
			pageSize: number;
			totalPages: number;
			totalResults: number;
		};
	};
	collapsed: boolean;
	config?: {
		globals?: {
			data: Record<string, any>;
			collapsed: boolean;
		};
		plugins?: number;
		settings?: {
			data: Record<string, any>;
			collapsed: boolean;
		};
	};
};

// Per-tab data (chrome.storage.local)
export type LocalData = {
	timestamp?: number;
	version?: string;
	controllers?: ControllerInfo[];
	context?: {
		[variable: string]: unknown;
	};
	enabled?: boolean; // Per-tab enabled state
	hostname?: string; // The hostname active when enabled state was last set
	integrationUrl?: string; // The bundle URL that was used to load the integration
	error?: {
		message: string;
		details?: string;
		url?: string;
	};
};

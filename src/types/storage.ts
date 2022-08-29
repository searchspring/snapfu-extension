export type StoredData = {
	settings: {
		enabled: boolean;
		intercepts: string;
	};
	bundle: {
		url: string;
		mergeContext: boolean;
		context: string;
	};
};

export type ControllerInfo = any;

export type LocalData = {
	timestamp?: number;
	version?: string;
	controllers?: ControllerInfo[];
	context?: {
		[variable: string]: any;
	};
};

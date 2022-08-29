export type commands = addScriptCommand;

export type addScriptCommand = {
	command: 'addScript';
	options: {
		url: string;
	};
};

export type addContentCommand = {
	command: 'addContent';
	options: {
		port: string;
		bundle: string;
		local: boolean;
	};
};

import { LocalData, ControllerInfo } from '../types/storage';

const SCRAPE_INTERVAL = 1000;

declare global {
	interface Window {
		searchspring?: any;
	}
}

let data: LocalData = {};
let timeElapsed = 0;

setInterval(() => {
	timeElapsed += SCRAPE_INTERVAL;
	const iframeBlockList = ['google.com'];
	let browserGlobalSpace: Window | null | undefined = window;
	if (!browserGlobalSpace?.searchspring) {
		try {
			// If we don't find searchspring global on window try looking in iframes
			const iframes = document.querySelectorAll('iframe');

			browserGlobalSpace = Array.from(iframes)
				.filter((iframe) => iframeBlockList.filter((domain) => iframe?.src.includes(domain))?.length == 0)
				.filter((iframe) => iframe.src?.includes(window.location.host))
				.filter((iframe) => iframe.contentWindow?.searchspring)
				?.pop()?.contentWindow;
		} catch (err) {
			// Do nothing
		}
	}

	if (browserGlobalSpace?.searchspring) {
		const searchspring = browserGlobalSpace.searchspring;
		const { controller, version, context } = searchspring;
		const controllerIds = Object.keys(controller || {});
		const controllers: ControllerInfo[] = controllerIds.map((controllerId) => {
			const { type, store, config } = controller[controllerId];
			const results = store.results;
			
			// Extract config details
			let configDetails;
			if (config) {
				// Count plugins
				let pluginCount;
				if (config.plugins && Array.isArray(config.plugins)) {
					pluginCount = config.plugins.filter((plugin: any) => Array.isArray(plugin)).length;
					if (pluginCount === 0) {
						pluginCount = undefined;
					}
				}
				
				configDetails = {
					globals: config.globals ? { data: config.globals, collapsed: true } : undefined,
					plugins: pluginCount,
					settings: config.settings ? { data: config.settings, collapsed: true } : undefined,
				};
				
				// Remove undefined properties
				if (!configDetails.globals) delete configDetails.globals;
				if (!configDetails.plugins) delete configDetails.plugins;
				if (!configDetails.settings) delete configDetails.settings;
				
				// If all properties are undefined, set configDetails to undefined
				if (Object.keys(configDetails).length === 0) {
					configDetails = undefined;
				}
			}
			
			return {
				id: controllerId,
				type,
				store: {
					loaded: store.loaded,
					results: results ? new Array(results.length) : [],
				},
				collapsed: true,
				config: configDetails,
			};
		});

		const newData = {
			controllers,
			version,
			context,
		};

		const controllersAreTheSame = controllers.every((controller, index) => {
			const controller2 = data.controllers && data.controllers[index];

			if (!controller2) return false;
			
			const basicPropsMatch = 
				controller.id === controller2.id &&
				controller.type === controller2.type &&
				controller.store.loaded === controller2.store.loaded &&
				controller.store.results.length === controller2.store.results.length;
			
			// Deep comparison for config
			const configMatch = JSON.stringify(controller.config) === JSON.stringify(controller2.config);
			
			return basicPropsMatch && configMatch;
		});

		const versionsAreTheSame = data.version === newData.version;

		const resultsChanged = !controllersAreTheSame || !versionsAreTheSame;

		// Only send event when details have changed
		if (newData.version != data.version || newData.controllers?.length != data.controllers?.length || resultsChanged) {
			data = newData;
			timeElapsed = 0; // Reset timeout when we find an integration
			const payload = { timestamp: Date.now(), ...data };
			const event = new CustomEvent('snapfu-scrape', { detail: JSON.parse(JSON.stringify(payload)) });
			document.dispatchEvent(event);
		}
	} else if (timeElapsed >= 5000) {
		// After 5 seconds of not finding an integration, send empty event
		// This won't overwrite errors because inject.ts preserves existing errors
		const payload = { timestamp: Date.now() };
		const event = new CustomEvent('snapfu-scrape', { detail: JSON.parse(JSON.stringify(payload)) });
		document.dispatchEvent(event);
		timeElapsed = 0; // Reset to avoid sending this repeatedly
	}
}, SCRAPE_INTERVAL);

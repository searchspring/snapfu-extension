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
	if (timeElapsed > 5000 && !data.version) {
		// giving up scraping and nothing found
		const event = new CustomEvent('snapfu-scrape', { detail: { timestamp: Date.now() } });
		document.dispatchEvent(event);
	}

	let browserGlobalSpace: Window | null | undefined = window;
	if (!browserGlobalSpace?.searchspring) {
		// if we don't find searchspring global on window try looking in iframes
		const iframes = document.querySelectorAll('iframe');
		browserGlobalSpace = Array.from(iframes)
			.filter((iframe) => iframe.src?.includes(window.location.host))
			.filter((iframe) => iframe.contentWindow?.searchspring)
			?.pop()?.contentWindow;
	}

	if (browserGlobalSpace?.searchspring) {
		const searchspring = browserGlobalSpace.searchspring;
		const { controller, version, context } = searchspring;
		const controllerIds = Object.keys(controller || {});
		const controllers: ControllerInfo[] = controllerIds.map((controllerId) => {
			const { type, store } = controller[controllerId];
			const results = store.results;
			return {
				id: controllerId,
				type,
				store: {
					loaded: store.loaded,
					results: results ? new Array(results.length) : [],
				},
				collapsed: true,
			};
		});

		const newData = {
			controllers,
			version,
			context,
		};

		const controllersAreTheSame = controllers.every((controller, index) => {
			const controller2 = data.controllers && data.controllers[index];

			return (
				controller2 &&
				controller.id === controller2.id &&
				controller.type === controller2.type &&
				controller.store.loaded === controller2.store.loaded &&
				controller.store.results.length === controller2.store.results.length
			);
		});

		const versionsAreTheSame = data.version === newData.version;

		const resultsChanged = !controllersAreTheSame || !versionsAreTheSame;

		// only send event when details have changed
		if (newData.version != data.version || newData.controllers?.length != data.controllers?.length || resultsChanged) {
			data = newData;
			const payload = { timestamp: Date.now(), ...data };
			const event = new CustomEvent('snapfu-scrape', { detail: JSON.parse(JSON.stringify(payload)) });
			document.dispatchEvent(event);
		}
	}
}, SCRAPE_INTERVAL);

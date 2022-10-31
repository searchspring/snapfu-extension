const loadScript = document.getElementById('snapfu-script');
const context = loadScript?.innerText || '';
const url = loadScript?.getAttribute('url');

const script = document.createElement('script');
script.id = 'searchspring-snapfu-script';
script.src = url || '';
script.innerHTML = context.trim();

let count = 0;
const CHECK_DELAY = 1000;
const MAX_COUNT = 60;

const locateAndInject = () => {
	count++;
	// try to find the integration script block and inject in same parent if found
	let browserGlobalSpace: Window | null | undefined = window;
	const snapScriptSelector = 'script[id^=searchspring], script[src*="snapui.searchspring.io"]';
	const snapScript = browserGlobalSpace.document.querySelector(snapScriptSelector);

	if (!snapScript) {
		browserGlobalSpace = undefined;
		const iframes = document.querySelectorAll('iframe');
		browserGlobalSpace = Array.from(iframes)
			.filter((iframe) => {
				const snapElements = iframe.contentDocument?.querySelector(snapScriptSelector);
				return snapElements;
			})
			?.pop()?.contentWindow;
	}

	if (browserGlobalSpace) {
		setTimeout(() => {
			browserGlobalSpace!.document.documentElement?.appendChild(script);
		}, CHECK_DELAY);
	} else {
		if (count <= MAX_COUNT) {
			setTimeout(locateAndInject, CHECK_DELAY);
		}
	}
};

locateAndInject();

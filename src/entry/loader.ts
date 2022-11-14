const loadScript = document.getElementById('snapfu-script');
const context = loadScript?.innerText || '';
const url = loadScript?.getAttribute('url');

const script = document.createElement('script');
script.id = 'searchspring-snapfu-script';
script.src = url || '';
script.innerHTML = context.trim();

const CHECK_DELAY = 4000;
const locateAndInject = () => {
	
	setInterval(() => {
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

		const snapfuScript = browserGlobalSpace?.document.querySelector('#searchspring-snapfu-script');	
		if (browserGlobalSpace && snapfuScript === null) {
			browserGlobalSpace.document.documentElement?.appendChild(script);
		}
		
	}, CHECK_DELAY);
};

locateAndInject();

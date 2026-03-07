const loadScript = document.getElementById('snapfu-script');
const context = loadScript?.innerText || '';
const url = loadScript?.getAttribute('url');
const injectionTarget = loadScript?.getAttribute('injectionTarget') || '';

const script = document.createElement('script');
script.id = 'snapfu-script';
script.src = url || '';
script.innerHTML = context.trim();

// Add error handler to capture script loading failures
script.addEventListener('error', () => {
	// Build error message and details separately
	const errorMessage = 'Failed to load bundle!';
	let errorDetails = '';
	
	// Add context-specific hints based on the URL
	if (url?.includes('localhost') || url?.includes('127.0.0.1')) {
		errorDetails = 'Check certificate is trusted and local network access is allowed';
	} else if (url?.startsWith('https://')) {
		errorDetails = 'Check network connection and CORS/CSP settings';
	} else if (url?.startsWith('http://')) {
		errorDetails = 'Mixed content blocked? Try HTTPS';
	}
	
	// Dispatch a custom event to notify inject.ts of the error
	const errorEvent = new CustomEvent('snapfu-script-error', {
		detail: {
			error: {
				message: errorMessage,
				details: errorDetails,
				url: url
			},
			url: url,
			timestamp: Date.now()
		}
	});
	document.dispatchEvent(errorEvent);
});

/**
 * Find the target element for script injection based on a CSS selector.
 * Supports nested iframes using a special syntax: "iframe >>> nested-selector"
 * Multiple iframe levels: "iframe.outer >>> iframe.inner >>> div.target"
 * 
 * @param selector - CSS selector string, optionally with >>> for iframe traversal
 * @returns The target element and whether an error occurred
 */
function findInjectionTarget(selector: string): { element: Element | null; hadError: boolean } {
	// If no selector provided, use default location (no error)
	if (!selector || selector.trim() === '' || selector === 'undefined') {
		return { element: window.document.documentElement, hadError: false };
	}

	// Split by >>> to handle iframe traversal
	const parts = selector.split('>>>').map(s => s.trim());
	
	let currentDocument: Document = window.document;
	let targetElement: Element | null = null;

	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		
		if (i === parts.length - 1) {
			// Last part - this is our target element
			targetElement = currentDocument.querySelector(part);
			break;
		} else {
			// Intermediate part - should be an iframe
			const iframe = currentDocument.querySelector(part) as HTMLIFrameElement;
			
			if (!iframe) {
				return { element: null, hadError: true };
			}

			try {
				// Try to access the iframe's content document
				const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
				
				if (!iframeDoc) {
					return { element: null, hadError: true };
				}

				currentDocument = iframeDoc;
			} catch (error) {
				return { element: null, hadError: true };
			}
		}
	}

	if (!targetElement) {
		return { element: null, hadError: true };
	}

	return { element: targetElement, hadError: false };
}

// Find the injection target
const { element: targetElement, hadError } = findInjectionTarget(injectionTarget);

// Inject the script into the target location
if (targetElement) {
	targetElement.appendChild(script);
} else if (hadError) {
	window.document.documentElement?.appendChild(script);
}


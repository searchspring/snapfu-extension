import { StoredData } from '../types/storage';

export const defaultConfig: StoredData = {
	settings: {
		enabled: false,
		intercepts: `*://snapui.searchspring.io/*/bundle.js*
*://cdn.searchspring.net/search/v3/js/searchspring.catalog.js*
*://cdn.searchspring.net/search/v3/lts/searchspring.catalog.js*`,
	},
	bundle: {
		url: 'https://localhost:3333/bundle.js',
		context: `shopper = {
  id: 'snapdev'
};`,
		mergeContext: true,
	},
};

export const setConfig = (data: StoredData): void => {
	chrome.storage.sync.set(data);
};

export const resetConfig = (): void => {
	setConfig(defaultConfig);
};

export const getConfig = async (): Promise<StoredData> => {
	const storedData = (await chrome.storage.sync.get()) as StoredData;
	return typeof storedData?.bundle?.url != 'undefined' ? storedData : defaultConfig;
};

export const deepCompare = (...args: any[]) => {
	let i, l, leftChain: any, rightChain: any;

	function compare2Objects(x: any, y: any) {
		let p;

		// remember that NaN === NaN returns false
		// and isNaN(undefined) returns true
		if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
			return true;
		}

		// Compare primitives and functions.
		// Check if both arguments link to the same object.
		// Especially useful on the step where we compare prototypes
		if (x === y) {
			return true;
		}

		// Works in case when functions are created in constructor.
		// Comparing dates is a common scenario. Another built-ins?
		// We can even handle functions passed across iframes
		if (
			(typeof x === 'function' && typeof y === 'function') ||
			(x instanceof Date && y instanceof Date) ||
			(x instanceof RegExp && y instanceof RegExp) ||
			(x instanceof String && y instanceof String) ||
			(x instanceof Number && y instanceof Number)
		) {
			return x.toString() === y.toString();
		}

		// At last checking prototypes as good as we can
		if (!(x instanceof Object && y instanceof Object)) {
			return false;
		}

		// eslint-disable-next-line no-prototype-builtins
		if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
			return false;
		}

		if (x.constructor !== y.constructor) {
			return false;
		}

		if (x.prototype !== y.prototype) {
			return false;
		}

		// Check for infinitive linking loops
		if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
			return false;
		}

		// Quick checking of one object being a subset of another.
		// todo: cache the structure of arguments[0] for performance
		for (p in y) {
			// eslint-disable-next-line no-prototype-builtins
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false;
			} else if (typeof y[p] !== typeof x[p]) {
				return false;
			}
		}

		for (p in x) {
			// eslint-disable-next-line no-prototype-builtins
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false;
			} else if (typeof y[p] !== typeof x[p]) {
				return false;
			}

			switch (typeof x[p]) {
				case 'object':
				case 'function':
					leftChain.push(x);
					rightChain.push(y);

					if (!compare2Objects(x[p], y[p])) {
						return false;
					}

					leftChain.pop();
					rightChain.pop();
					break;

				default:
					if (x[p] !== y[p]) {
						return false;
					}
					break;
			}
		}

		return true;
	}

	if (args.length < 1) {
		return true; //Die silently? Don't know how to handle such case, please help...
		// throw "Need two or more arguments to compare";
	}

	for (i = 1, l = args.length; i < l; i++) {
		leftChain = []; //Todo: this can be cached
		rightChain = [];

		if (!compare2Objects(args[0], args[i])) {
			return false;
		}
	}

	return true;
};

export const getCurrentTabId = async (): Promise<string | undefined> => {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return `${tab.id}` || undefined;
};

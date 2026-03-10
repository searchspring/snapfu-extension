(function () {
	'use strict';
	const e = {
			intercepts: '*://snapui.athoscommerce.io/*/bundle.js*\n*://snapui.searchspring.io/*/bundle.js*',
			bundle: { url: 'https://localhost:3333/bundle.js', context: "shopper = {\n  id: 'snapdev'\n};", mergeContext: !0, injectionTarget: '' },
			integrationCollapsed: !1,
		},
		t = { hostnameConfigs: {}, autoEnable: !1 },
		n = async (e) => {
			try {
				await chrome.storage.sync.set(e);
			} catch (t) {}
		},
		r = async () => {
			try {
				const e = await chrome.storage.sync.get();
				return 0 === Object.keys(e).length ? t : e;
			} catch (e) {
				return t;
			}
		},
		o = (e) => {
			try {
				const t = new URL(e);
				return t.hostname;
			} catch (t) {
				return null;
			}
		},
		c = async (t) => {
			const n = await r();
			return n.hostnameConfigs[t] || JSON.parse(JSON.stringify(e));
		},
		s = async (e, t) => {
			const o = await r();
			(o.hostnameConfigs[e] = t), await n(o);
		},
		i =
			'script[id=searchspring-context], script[id=athos-context], script[src*="snapui.searchspring.io"][src$="bundle.js"], script[src*="snapui.athoscommerce.io"][src$="bundle.js"]';
	function a() {
		const e = document.querySelectorAll('meta[http-equiv]');
		e.forEach((e) => {
			const t = e.getAttribute('http-equiv');
			t && 'content-security-policy' === t.toLowerCase() && e.remove();
		});
	}
	function l() {
		const e = new MutationObserver((e) => {
			e.forEach((e) => {
				e.addedNodes.forEach((e) => {
					if ('META' === e.nodeName) {
						const t = e,
							n = t.getAttribute('http-equiv');
						n && 'content-security-policy' === n.toLowerCase() && t.remove();
					}
					if (e instanceof Element) {
						const t = e.querySelectorAll('meta[http-equiv]');
						t.forEach((e) => {
							const t = e.getAttribute('http-equiv');
							t && 'content-security-policy' === t.toLowerCase() && e.remove();
						});
					}
				});
			});
		});
		return e.observe(document.documentElement, { childList: !0, subtree: !0 }), e;
	}
	function m() {
		const e = (e) => {
				if (!e || !e.parentElement) return 'html';
				const t = e.parentElement;
				if ('body' === t.tagName.toLowerCase()) return 'body';
				if ('head' === t.tagName.toLowerCase()) return 'head';
				if (t.id) return `#${t.id}`;
				if (t.className) {
					const e = t.className
						.trim()
						.split(/\s+/)
						.filter((e) => e.length > 0);
					if (e.length > 0) return `${t.tagName.toLowerCase()}.${e[0]}`;
				}
				return t.tagName.toLowerCase();
			},
			t = document.querySelector(i);
		if (t) return { injectionTarget: e(t), scriptElement: t };
		const n = Array.from(document.querySelectorAll('iframe'));
		for (const o of n)
			try {
				const t = o.contentDocument || o.contentWindow?.document;
				if (!t) continue;
				const n = t.querySelector(i);
				if (n) {
					let t = 'iframe';
					if (o.id) t = `iframe#${o.id}`;
					else if (o.className) {
						const e = o.className
							.trim()
							.split(/\s+/)
							.filter((e) => e.length > 0);
						e.length > 0 && (t = `iframe.${e[0]}`);
					}
					const r = e(n);
					return { injectionTarget: `${t} >>> ${r}`, scriptElement: n };
				}
				const c = Array.from(t.querySelectorAll('iframe'));
				for (const s of c)
					try {
						const t = s.contentDocument || s.contentWindow?.document;
						if (!t) continue;
						const n = t.querySelector(i);
						if (n) {
							let t = 'iframe';
							if (o.id) t = `iframe#${o.id}`;
							else if (o.className) {
								const e = o.className
									.trim()
									.split(/\s+/)
									.filter((e) => e.length > 0);
								e.length > 0 && (t = `iframe.${e[0]}`);
							}
							let r = 'iframe';
							if (s.id) r = `iframe#${s.id}`;
							else if (s.className) {
								const e = s.className
									.trim()
									.split(/\s+/)
									.filter((e) => e.length > 0);
								e.length > 0 && (r = `iframe.${e[0]}`);
							}
							const c = e(n);
							return { injectionTarget: `${t} >>> ${r} >>> ${c}`, scriptElement: n };
						}
					} catch (r) {
						continue;
					}
			} catch (r) {
				continue;
			}
		return { injectionTarget: '', scriptElement: null };
	}
	async function u(e, t) {
		const n = o(window.location.href);
		if (!n) return;
		const r = await c(n),
			{ scriptElement: a } = m(),
			l = a?.getAttribute('src') || '';
		try {
			const e = await new Promise((e, t) => {
				chrome.runtime.sendMessage({ text: 'getTabId' }, (n) => {
					chrome.runtime.lastError ? t(chrome.runtime.lastError) : e(n);
				});
			});
			if (e) {
				const n = String(e),
					o = await chrome.storage.local.get(n),
					c = new URL(l, window.location.origin).href,
					s = t ? r.bundle.url : c;
				s && (await chrome.storage.local.set({ [n]: { ...o[n], integrationUrl: s } }));
			}
		} catch (u) {}
		if (t) {
			const t = r.bundle.url,
				o = r.bundle.context,
				c = r.bundle.mergeContext;
			let l = r.bundle.injectionTarget;
			const { injectionTarget: u } = m();
			(l && '' !== l.trim()) || (u && u.includes('>>>') && ((l = u), (r.bundle.injectionTarget = u), await s(n, r)));
			let d = a;
			if (!d) {
				const e = Array.from(document.querySelectorAll(i));
				d = e.sort((e, t) => e.innerHTML.length - t.innerHTML.length).pop();
			}
			const h = d?.innerHTML;
			if (!c) {
				const e = Array.from(document.querySelectorAll(i));
				e.forEach((e) => {
					e.innerHTML = '';
				});
			}
			let f = '';
			const g = d?.getAttribute('src')?.match(/.*snapui\.(searchspring|athoscommerce)\.io\/([a-zA-Z0-9]{6})\//);
			g && g.length > 2 && (f = `siteId = "${g[2]}";\n`);
			const p = Object.values(d?.attributes || {}).reduce((e, t) => {
				const n = ['id', 'src', 'type', 'defer', 'async'],
					r = t.nodeName,
					o = d?.getAttribute(r);
				return o && !n.includes(r) && (e[r] = o), e;
			}, {});
			let y = f ? f + o : o;
			if ((c && h && h.trim() && (y = h + '\n' + y), t)) {
				const n = document.createElement('script');
				(n.src = e),
					(n.id = 'searchspring-snapfu-script'),
					n.setAttribute('url', t),
					n.setAttribute('injectionTarget', l),
					Object.keys(p).forEach((e) => {
						n.setAttribute(e, p[e]);
					}),
					y && (n.innerHTML = y),
					(document.head || document.documentElement).appendChild(n);
			}
		}
	}
	function d(e) {
		if (e) {
			const t = document.createElement('script');
			(t.src = e), (t.id = 'snapfu-scraper'), (document.head || document.documentElement).appendChild(t);
		}
	}
	(async function () {
		try {
			chrome.runtime.sendMessage({ text: 'getTabId' }, async (e) => {
				if (!chrome.runtime.lastError)
					try {
						const t = String(e),
							n = await chrome.storage.local.get(t),
							r = o(window.location.href),
							c = n[t]?.hostname,
							s = c === r && (n[t]?.enabled ?? !1),
							i = r || c;
						await chrome.storage.local.set({ [t]: { enabled: s, ...(i ? { hostname: i } : {}) } }),
							document.addEventListener('snapfu-scrape', async (t) => {
								const n = t.detail;
								try {
									const t = String(e),
										r = await chrome.storage.local.get(t),
										o = r[t]?.enabled ?? !1,
										c = r[t]?.error,
										s = r[t]?.integrationUrl,
										i = r[t]?.hostname;
									await chrome.storage.local.set({
										[t]: {
											...n,
											enabled: o,
											...(i ? { hostname: i } : {}),
											...(s ? { integrationUrl: s } : {}),
											...(c && !n.version ? { error: c } : {}),
										},
									});
								} catch (r) {}
							}),
							document.addEventListener('snapfu-script-error', async (t) => {
								const n = t.detail;
								try {
									const t = String(e),
										r = await chrome.storage.local.get(t),
										o = r[t]?.enabled ?? !1;
									await chrome.storage.local.set({ [t]: { ...r[t], enabled: o, error: n.error, timestamp: n.timestamp } });
								} catch (r) {}
							}),
							s && (a(), l()),
							u(chrome.runtime.getURL('/js/loader.js'), s);
					} catch (t) {}
			});
		} catch (e) {}
		try {
			d(chrome.runtime.getURL('/js/scraper.js'));
		} catch (e) {}
	})();
})();

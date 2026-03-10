(function () {
	'use strict';
	const e = 1e3;
	let t = {},
		s = 0,
		n = !1;
	setInterval(() => {
		s += e;
		const o = ['google.com'];
		let r = window;
		if (!r?.searchspring && !r?.athos)
			try {
				const e = document.querySelectorAll('iframe'),
					t = Array.from(e)
						.filter((e) => 0 == o.filter((t) => e?.src.includes(t))?.length)
						.filter((e) => e.src?.includes(window.location.host))
						.filter((e) => e.contentWindow?.searchspring || e.contentWindow?.athos);
				t.length > 1 &&
					!n &&
					((n = !0), console.warn('Multiple iframes with searchspring or athos detected. This may cause unexpected behavior.', t)),
					(r = t.pop()?.contentWindow);
			} catch (i) {}
		if (r?.searchspring || r?.athos) {
			const e = r.searchspring || r.athos,
				n = r.searchspring ? 'searchspring' : 'athos',
				{ controller: o, version: i, context: l } = e,
				a = Object.keys(o || {}),
				c = a.map((e) => {
					const { type: t, store: s, config: n } = o[e],
						r = s.results;
					let i;
					if (n) {
						let e = 0;
						n.plugins && Array.isArray(n.plugins) && (e = n.plugins.filter((e) => Array.isArray(e)).length),
							(i = {
								globals: n.globals ? { data: n.globals, collapsed: !0 } : void 0,
								plugins: e,
								settings: n.settings ? { data: n.settings, collapsed: !0 } : void 0,
							}),
							i.globals || delete i.globals,
							i.settings || delete i.settings,
							0 === Object.keys(i).length && (i = void 0);
					}
					return {
						id: e,
						type: t,
						store: { loaded: s.loaded, results: r ? new Array(r.length) : [], pagination: s.pagination },
						collapsed: !0,
						config: i,
					};
				}),
				g = { controllers: c, version: i, context: l, organization: n },
				d = c.every((e, s) => {
					const n = t.controllers && t.controllers[s];
					if (!n) return !1;
					const o = e.id === n.id && e.type === n.type && e.store.loaded === n.store.loaded && e.store.results.length === n.store.results.length,
						r = JSON.stringify(e.config) === JSON.stringify(n.config),
						i = JSON.stringify(e.store.pagination) === JSON.stringify(n.store.pagination);
					return o && r && i;
				}),
				p = t.version === g.version,
				h = !d || !p;
			if (g.version != t.version || g.controllers?.length != t.controllers?.length || h) {
				(t = g), (s = 0);
				const e = { timestamp: Date.now(), ...t },
					n = new CustomEvent('snapfu-scrape', { detail: JSON.parse(JSON.stringify(e)) });
				document.dispatchEvent(n);
			}
		} else if (s >= 5e3) {
			const e = { timestamp: Date.now() },
				t = new CustomEvent('snapfu-scrape', { detail: JSON.parse(JSON.stringify(e)) });
			document.dispatchEvent(t), (s = 0);
		}
	}, e);
})();

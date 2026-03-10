(function () {
	'use strict';
	const e = { hostnameConfigs: {}, autoEnable: !1 },
		t = async () => {
			try {
				const t = await chrome.storage.sync.get();
				return 0 === Object.keys(t).length ? e : t;
			} catch (t) {
				return e;
			}
		},
		a = (e) => {
			try {
				const t = new URL(e);
				return t.hostname;
			} catch (t) {
				return null;
			}
		},
		n = async (e) => {
			try {
				const t = String(e),
					a = await chrome.storage.local.get(t),
					n = a[t];
				return n?.enabled ?? !1;
			} catch (t) {
				return !1;
			}
		},
		r = async () => {
			try {
				const e = { active: !0, currentWindow: !0 },
					[t] = await chrome.tabs.query(e);
				return t?.id ? `${t.id}` : void 0;
			} catch (e) {
				return;
			}
		};
	let o = !1,
		c = null;
	async function s() {
		const e = await t();
		await u(e);
		const a = await r();
		a && (await i(Number(a)));
	}
	async function i(e) {
		try {
			const t = await chrome.tabs.get(e);
			if (!t.url) return;
			const r = a(t.url);
			if (!r) return;
			const o = await n(e),
				c = o
					? { 48: '/assets/icons/athos-icon-on-48.png', 128: '/assets/icons/athos-icon-on-128.png' }
					: { 48: '/assets/icons/athos-icon-48.png', 128: '/assets/icons/athos-icon-128.png' };
			await chrome.action.setIcon({ path: c, tabId: e });
		} catch (t) {
			return void (chrome.runtime.lastError && chrome.runtime.lastError);
		}
	}
	async function u(e) {
		o && c && (await c), (o = !0), (c = l(e));
		try {
			await c;
		} finally {
			(o = !1), (c = null);
		}
	}
	async function l(e) {
		const t = [];
		let r = 1;
		const o = await chrome.tabs.query({});
		for (const s of o) {
			if (!s.id || !s.url) continue;
			const o = s.id,
				c = a(s.url);
			if (!c) continue;
			const i = await n(o);
			if (!i) continue;
			const u = e.hostnameConfigs[c];
			if (!u) continue;
			const l = d(o, c, u, r);
			(r += l.length), t.push(...l);
		}
		const c = await chrome.declarativeNetRequest.getSessionRules();
		await chrome.declarativeNetRequest.updateSessionRules({ addRules: t, removeRuleIds: c.map((e) => e.id) });
	}
	function d(e, t, a, n) {
		const r = [];
		let o = n;
		const c = (a.intercepts || '').split('\n').filter((e) => e.trim().length > 0);
		return (
			c.forEach((a) => {
				r.push({
					id: o++,
					priority: 1,
					action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
					condition: { urlFilter: a, tabIds: [e], initiatorDomains: [t], resourceTypes: [chrome.declarativeNetRequest.ResourceType.SCRIPT] },
				});
			}),
			a.bundle.url &&
				r.push({
					id: o++,
					priority: 2,
					action: { type: chrome.declarativeNetRequest.RuleActionType.ALLOW },
					condition: { urlFilter: a.bundle.url, tabIds: [e], resourceTypes: [chrome.declarativeNetRequest.ResourceType.SCRIPT] },
				}),
			r.push({
				id: o++,
				priority: 1,
				action: {
					type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
					responseHeaders: [
						{ header: 'content-security-policy', operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
						{ header: 'content-security-policy-report-only', operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
					],
				},
				condition: {
					urlFilter: `*://${t}/*`,
					tabIds: [e],
					resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME, chrome.declarativeNetRequest.ResourceType.SUB_FRAME],
				},
			}),
			r
		);
	}
	chrome.declarativeNetRequest.getDynamicRules((e) => {
		if (e.length > 0) {
			const t = e.map((e) => e.id);
			chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: t, addRules: [] });
		}
	}),
		s(),
		chrome.storage.onChanged.addListener(async (e, a) => {
			if ('sync' === a)
				try {
					await s();
				} catch (n) {}
			if ('local' === a)
				try {
					let a = !1;
					for (const t in e) {
						const n = Number(t);
						isNaN(n) || void 0 === e[t].newValue?.enabled || ((a = !0), await i(n));
					}
					a && (await u(await t()));
				} catch (n) {}
		}),
		chrome.tabs.onActivated.addListener(async (e) => {
			try {
				await i(e.tabId);
			} catch (t) {}
		}),
		chrome.tabs.onUpdated.addListener(async (e, n) => {
			if (n.url)
				try {
					const r = a(n.url);
					if (r) {
						const a = await t(),
							n = a.hostnameConfigs[r];
						if (n && a.autoEnable) {
							const t = await chrome.storage.local.get(null),
								a = Object.entries(t).some(([t, a]) => {
									const n = Number(t);
									return !isNaN(n) && n !== e && !0 === a?.enabled && a?.hostname === r;
								});
							if (a) {
								const t = await chrome.declarativeNetRequest.getSessionRules(),
									a = t.reduce((e, t) => Math.max(e, t.id), 0) + 1,
									o = d(e, r, n, a);
								await chrome.declarativeNetRequest.updateSessionRules({ addRules: o, removeRuleIds: [] }),
									await chrome.storage.local.set({ [String(e)]: { enabled: !0, hostname: r } });
							}
						}
					}
				} catch (r) {}
			if (n.url || 'loading' === n.status || 'complete' === n.status)
				try {
					await i(e);
				} catch (r) {}
		}),
		chrome.tabs.onRemoved.addListener(async (e) => {
			try {
				const t = String(e);
				await chrome.storage.local.remove(t);
			} catch (t) {}
		}),
		chrome.runtime.onMessage.addListener(function (e, t, a) {
			return 'getTabId' == e.text && t?.tab?.id
				? (a(t.tab.id), !1)
				: !('getTabEnabled' != e.text || !t?.tab?.id) &&
						(n(t.tab.id).then((e) => {
							a({ enabled: e });
						}),
						!0);
		});
})();

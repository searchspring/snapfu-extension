(function () {
	'use strict';
	var e = {
			356: function (e, t, n) {
				var a = n(963),
					o = { i8: '1.7.0' },
					s = n(252),
					i = n(577),
					l = n(262),
					r = n.p + 'img/athos-logo-text--white.svg';
				const c = (e) => ((0, s.dD)('data-v-5a38561a'), (e = e()), (0, s.Cn)(), e),
					g = { class: 'logo-container' },
					u = c(() =>
						(0, s._)(
							'path',
							{
								class: 'brick brick-1',
								d: 'M40,13.34c0,2.87-2.1,5.2-4.7,5.2h-10.42c-3.66,0-5.9-4.42-4.02-7.9l4.37-8.11c.86-1.57,2.37-2.53,4.02-2.53h6.03c2.59,0,4.7,2.34,4.7,5.2l.02,8.14Z',
							},
							null,
							-1
						)
					),
					d = c(() =>
						(0, s._)(
							'path',
							{
								class: 'brick brick-2',
								d: 'M40,34.79c0,2.87-2.1,5.2-4.7,5.2h-10.42c-3.66,0-5.9-4.42-4.02-7.9l4.37-8.11c.86-1.57,2.37-2.53,4.02-2.53h6.03c2.59,0,4.7,2.34,4.7,5.2l.02,8.14Z',
							},
							null,
							-1
						)
					),
					f = c(() =>
						(0, s._)(
							'path',
							{
								class: 'brick brick-3',
								d: 'M0,5.2C0,2.34,2.1,0,4.7,0h10.42c3.66,0,5.9,4.42,4.02,7.9l-4.37,8.11c-.86,1.57-2.37,2.53-4.02,2.53h-6.03C2.12,18.54.02,16.21.02,13.34l-.02-8.14Z',
							},
							null,
							-1
						)
					),
					p = c(() =>
						(0, s._)(
							'path',
							{
								class: 'brick brick-4',
								d: 'M0,26.66c0-2.87,2.1-5.2,4.7-5.2h10.42c3.66,0,5.9,4.42,4.02,7.9l-4.37,8.11c-.86,1.57-2.37,2.53-4.02,2.53h-6.03C2.12,40,.02,37.66.02,34.8l-.02-8.14Z',
							},
							null,
							-1
						)
					),
					m = [u, d, f, p],
					h = c(() => (0, s._)('img', { class: 'logo-text', src: r }, null, -1)),
					v = ['title'],
					b = { class: 'buttons' },
					w = ['title'],
					y = { key: 0, class: 'on' };
				var C = (0, s.aZ)({
						__name: 'popup-header',
						props: {
							currentHostname: null,
							hasChanges: { type: Boolean },
							enabled: { type: [Boolean, null] },
							settingsOpen: { type: Boolean },
							integrationLoading: { type: Boolean },
						},
						emits: ['save', 'toggleOnOff', 'toggleSettings'],
						setup(e, { emit: t }) {
							const n = e,
								a = (0, l.iH)(n.integrationLoading ? 'loading' : 'idle');
							return (
								(0, s.YP)(
									() => n.integrationLoading,
									(e, t) => {
										e && !t
											? (a.value = 'loading')
											: !e &&
											  t &&
											  ((a.value = 'stopping'),
											  setTimeout(() => {
													a.value = 'idle';
											  }, 600));
									}
								),
								(n, o) => {
									const l = (0, s.up)('font-awesome-icon');
									return (
										(0, s.wg)(),
										(0, s.iD)(
											'div',
											{ class: (0, i.C_)(['header', { 'settings-open': e.settingsOpen }]) },
											[
												(0, s._)('div', g, [
													((0, s.wg)(),
													(0, s.iD)(
														'svg',
														{ class: (0, i.C_)(['logo-bricks', a.value]), viewBox: '0 0 40 40', xmlns: 'http://www.w3.org/2000/svg' },
														m,
														2
													)),
													h,
												]),
												e.currentHostname
													? ((0, s.wg)(),
													  (0, s.iD)('div', { key: 0, class: 'hostname-pill', title: e.currentHostname }, (0, i.zw)(e.currentHostname), 9, v))
													: (0, s.kq)('', !0),
												(0, s._)('div', b, [
													(0, s._)(
														'div',
														{
															title: 'save changes',
															class: (0, i.C_)(['button save', { visible: e.hasChanges }]),
															onClick: o[0] || (o[0] = (e) => t('save')),
														},
														[(0, s.Wm)(l, { icon: 'save' })],
														2
													),
													e.currentHostname
														? ((0, s.wg)(),
														  (0, s.iD)(
																'div',
																{
																	key: 0,
																	class: (0, i.C_)(['button toggle', { on: e.enabled, loading: null === e.enabled }]),
																	title: e.enabled ? 'turn off' : 'turn on',
																	onClick: o[1] || (o[1] = (e) => t('toggleOnOff')),
																},
																[e.enabled ? ((0, s.wg)(), (0, s.iD)('span', y)) : (0, s.kq)('', !0), (0, s.Wm)(l, { icon: 'toggle-off' })],
																10,
																w
														  ))
														: (0, s.kq)('', !0),
													(0, s._)(
														'div',
														{
															title: 'settings',
															class: (0, i.C_)(['button settings', { open: e.settingsOpen }]),
															onClick: o[2] || (o[2] = (e) => t('toggleSettings')),
														},
														[(0, s.Wm)(l, { icon: 'gear' })],
														2
													),
												]),
											],
											2
										)
									);
								}
							);
						},
					}),
					k = n(744);
				const _ = (0, k.Z)(C, [['__scopeId', 'data-v-5a38561a']]);
				var D = _,
					S = n.p + 'img/github.svg';
				const O = {
						intercepts: '*://snapui.athoscommerce.io/*/bundle.js*\n*://snapui.searchspring.io/*/bundle.js*',
						bundle: { url: 'https://localhost:3333/bundle.js', context: "shopper = {\n  id: 'snapdev'\n};", mergeContext: !0, injectionTarget: '' },
						integrationCollapsed: !1,
					},
					H = { hostnameConfigs: {}, autoEnable: !1 },
					x = async (e) => {
						try {
							await chrome.storage.sync.set(e);
						} catch (t) {}
					},
					N = async () => {
						try {
							const e = await chrome.storage.sync.get();
							return 0 === Object.keys(e).length ? H : e;
						} catch (e) {
							return H;
						}
					},
					J = (e) => {
						try {
							const t = new URL(e);
							return t.hostname;
						} catch (t) {
							return null;
						}
					},
					q = async (e) => {
						const t = await N();
						return t.hostnameConfigs[e] || JSON.parse(JSON.stringify(O));
					},
					T = async (e, t) => {
						const n = await N();
						(n.hostnameConfigs[e] = t), await x(n);
					},
					j = async (e) => {
						try {
							const t = String(e),
								n = await chrome.storage.local.get(t),
								a = n[t];
							return a?.enabled ?? !1;
						} catch (t) {
							return !1;
						}
					},
					I = async (e, t) => {
						try {
							const a = String(e),
								o = await chrome.storage.local.get(a);
							let s = null;
							try {
								const t = await chrome.tabs.get(e);
								t.url && (s = J(t.url));
							} catch (n) {
								s = o[a]?.hostname ?? null;
							}
							await chrome.storage.local.set({ [a]: { ...o[a], enabled: t, ...(s ? { hostname: s } : {}) } });
						} catch (a) {}
					},
					z = (e, t) => {
						if (e === t) return !0;
						if (null === e || null === t) return !1;
						if (void 0 === e || void 0 === t) return !1;
						if (typeof e !== typeof t) return !1;
						if ('object' === typeof e && 'object' === typeof t) {
							if (Array.isArray(e) && Array.isArray(t)) {
								if (e.length !== t.length) return !1;
								for (let n = 0; n < e.length; n++) if (!z(e[n], t[n])) return !1;
								return !0;
							}
							if (Array.isArray(e) || Array.isArray(t)) return !1;
							const n = Object.keys(e),
								a = Object.keys(t);
							if (n.length !== a.length) return !1;
							for (const o of n) {
								if (!a.includes(o)) return !1;
								if (!z(e[o], t[o])) return !1;
							}
							return !0;
						}
						return !1;
					},
					U = async (e) => {
						try {
							return await chrome.tabs.get(e), await chrome.tabs.reload(e), !0;
						} catch (t) {
							return chrome.runtime.lastError && chrome.runtime.lastError, !1;
						}
					},
					R = (e) => ((0, s.dD)('data-v-40ae6353'), (e = e()), (0, s.Cn)(), e),
					L = { class: 'page-settings' },
					E = { key: 0, class: 'option intercepts' },
					W = (0, s.Uk)(' Intercepts '),
					A = R(() =>
						(0, s._)(
							'div',
							{ class: 'description' },
							'Intercepts are used for blocking network requests, primarily to prevent multiple bundles from loading.',
							-1
						)
					),
					B = { class: 'textarea-wrapper' },
					Z = ['value', 'rows'],
					P = R(() => (0, s._)('span', { class: 'resize-handle' }, null, -1)),
					F = { key: 1, class: 'option injection-target' },
					M = (0, s.Uk)(' Injection Target '),
					V = R(() =>
						(0, s._)('div', { class: 'description' }, 'CSS selector for script injection location. Leave empty for default (document root).', -1)
					),
					G = ['value'],
					Y = R(() =>
						(0, s._)(
							'div',
							{ class: 'description' },
							[
								(0, s._)('br'),
								(0, s.Uk)(' For iframes, use '),
								(0, s._)('code', null, '>>>'),
								(0, s.Uk)(' to traverse: '),
								(0, s._)('code', null, 'iframe.my-frame >>> div.target'),
								(0, s._)('br'),
								(0, s.Uk)(' For nested iframes: '),
								(0, s._)('code', null, 'iframe.outer >>> iframe.inner >>> div.target'),
							],
							-1
						)
					),
					$ = { class: 'option auto-enable' },
					Q = (0, s.Uk)(' Sync Active State '),
					K = ['title'],
					X = R(() => (0, s._)('span', { class: 'toggle-thumb' }, null, -1)),
					ee = [X],
					te = R(() =>
						(0, s._)(
							'div',
							{ class: 'description' },
							'New tabs on a configured hostname will start enabled if any other tab on that hostname is already active.',
							-1
						)
					),
					ne = { key: 2, class: 'option reset' },
					ae = (0, s.Uk)(' Reset Site '),
					oe = R(() => (0, s._)('div', { class: 'description' }, 'Reset settings for the current site back to initial values.', -1)),
					se = { class: 'option clear-all' },
					ie = { class: 'title-with-icon' },
					le = (0, s.Uk)(' Reset All '),
					re = R(() =>
						(0, s._)(
							'div',
							{ class: 'description' },
							[
								(0, s.Uk)(' Reset the extension to factory defaults.'),
								(0, s._)('br'),
								(0, s.Uk)('Clears all settings, per-tab states, and active rules across all hostnames. '),
							],
							-1
						)
					),
					ce = { key: 0, class: 'storage-viewer' },
					ge = ['value'],
					ue = { class: 'option footer' },
					de = { class: 'version' },
					fe = R(() =>
						(0, s._)(
							'a',
							{ href: 'https://github.com/athoscommerce/snapfu-extension', target: '_blank' },
							[(0, s._)('img', { class: 'github', src: S })],
							-1
						)
					);
				var pe = (0, s.aZ)({
					__name: 'popup-settings',
					props: { version: null, currentHostname: null, hostnameConfig: null, savedHostnameConfig: null, autoEnable: { type: Boolean } },
					emits: ['reset', 'resetAppConfig', 'clearAllStorage', 'update:hostnameConfig', 'toggleAutoEnable'],
					setup(e, { expose: t, emit: n }) {
						const o = e,
							r = (0, l.iH)(!1),
							c = (0, l.iH)(!1),
							g = (0, l.iH)(!1),
							u = (0, l.iH)('');
						function d(e) {
							const t = e.target,
								a = { ...o.hostnameConfig, intercepts: t.value };
							n('update:hostnameConfig', a);
						}
						function f(e) {
							const t = e.target,
								a = { ...o.hostnameConfig, bundle: { ...o.hostnameConfig.bundle, injectionTarget: t.value } };
							n('update:hostnameConfig', a);
						}
						function p(e = '', t = 'saved') {
							const n = e.split('.').filter((e) => e),
								a = 'saved' == t ? o.savedHostnameConfig : O,
								s =
									e && n.length > 0
										? n.reduce((e, t) => {
												if (e && 'object' === typeof e && null !== e && t in e) return e[t];
										  }, a)
										: a,
								i =
									e && n.length > 0
										? n.reduce((e, t) => {
												if (e && 'object' === typeof e && null !== e && t in e) return e[t];
										  }, o.hostnameConfig)
										: o.hostnameConfig;
							if ('undefined' != typeof s && 'undefined' != typeof i)
								try {
									const e = JSON.parse(JSON.stringify(s)),
										t = JSON.parse(JSON.stringify(i));
									return !z(e, t);
								} catch (l) {
									return !1;
								}
							return !1;
						}
						function m() {
							try {
								const e = JSON.parse(JSON.stringify(o.savedHostnameConfig)),
									t = JSON.parse(JSON.stringify(O));
								return !z(e, t);
							} catch (e) {
								return !1;
							}
						}
						function h(e, t = 'default') {
							n('reset', e, t);
						}
						function v() {
							r.value ? (n('resetAppConfig'), (r.value = !1)) : (r.value = !0);
						}
						function b() {
							c.value ? (n('clearAllStorage'), (c.value = !1)) : (c.value = !0);
						}
						async function w() {
							if (((g.value = !g.value), g.value))
								try {
									const e = await chrome.storage.sync.get(),
										t = e.hostnameConfigs || {};
									u.value = JSON.stringify(t, null, 2);
								} catch (e) {
									u.value = 'Error retrieving storage: ' + e;
								}
						}
						return (
							t({
								resetConfirmations: () => {
									(r.value = !1), (c.value = !1), (g.value = !1);
								},
							}),
							(t, l) => {
								const y = (0, s.up)('font-awesome-icon');
								return (
									(0, s.wg)(),
									(0, s.iD)('div', L, [
										e.currentHostname
											? ((0, s.wg)(),
											  (0, s.iD)('div', E, [
													(0, s._)('h3', null, [
														W,
														p('intercepts', 'default')
															? ((0, s.wg)(),
															  (0, s.j4)(y, {
																	key: 0,
																	class: 'reset',
																	onClick: l[0] || (l[0] = (e) => h('intercepts')),
																	icon: 'undo',
																	title: 'reset intercepts',
															  }))
															: (0, s.kq)('', !0),
													]),
													A,
													(0, s._)('div', B, [
														(0, s._)(
															'textarea',
															{
																placeholder: 'intercepts should be here...',
																required: 'true',
																spellcheck: 'false',
																value: o.hostnameConfig.intercepts,
																onInput: d,
																rows: (o.hostnameConfig.intercepts || '').split('\n').length,
															},
															null,
															40,
															Z
														),
														P,
													]),
											  ]))
											: (0, s.kq)('', !0),
										e.currentHostname
											? ((0, s.wg)(),
											  (0, s.iD)('div', F, [
													(0, s._)('h3', null, [
														M,
														p('bundle.injectionTarget', 'default')
															? ((0, s.wg)(),
															  (0, s.j4)(y, {
																	key: 0,
																	class: 'reset',
																	onClick: l[1] || (l[1] = (e) => h('bundle.injectionTarget')),
																	icon: 'undo',
																	title: 'reset injection target',
															  }))
															: (0, s.kq)('', !0),
													]),
													V,
													(0, s._)(
														'input',
														{
															value: o.hostnameConfig.bundle.injectionTarget,
															onInput: f,
															type: 'text',
															placeholder: 'e.g., body, iframe >>> head, iframe.outer >>> iframe.inner >>> body',
														},
														null,
														40,
														G
													),
													Y,
											  ]))
											: (0, s.kq)('', !0),
										(0, s._)('div', $, [
											(0, s._)('h3', null, [
												Q,
												(0, s._)(
													'button',
													{
														class: (0, i.C_)(['toggle-switch', { on: o.autoEnable }]),
														title: o.autoEnable ? 'Disable sync active state' : 'Enable sync active state',
														onClick: l[2] || (l[2] = (e) => n('toggleAutoEnable')),
													},
													ee,
													10,
													K
												),
											]),
											te,
										]),
										e.currentHostname
											? (0, s.wy)(
													((0, s.wg)(),
													(0, s.iD)(
														'div',
														ne,
														[
															(0, s._)('h3', null, [
																ae,
																(0, s._)('button', { class: 'reset-extension', onClick: v }, (0, i.zw)(r.value ? 'confirm' : 'reset'), 1),
															]),
															oe,
														],
														512
													)),
													[[a.F8, m()]]
											  )
											: (0, s.kq)('', !0),
										(0, s._)('div', se, [
											(0, s._)('h3', null, [
												(0, s._)('span', ie, [
													le,
													(0, s.Wm)(
														y,
														{
															class: (0, i.C_)(['view-storage', { active: g.value }]),
															onClick: w,
															icon: 'circle-info',
															title: 'view storage contents',
														},
														null,
														8,
														['class']
													),
												]),
												(0, s._)('button', { class: 'clear-all-button', onClick: b }, (0, i.zw)(c.value ? 'confirm' : 'reset all'), 1),
											]),
											re,
											g.value
												? ((0, s.wg)(),
												  (0, s.iD)('div', ce, [
														(0, s._)('textarea', { readonly: '', spellcheck: 'false', value: u.value, rows: '10' }, null, 8, ge),
												  ]))
												: (0, s.kq)('', !0),
										]),
										(0, s._)('div', ue, [(0, s._)('span', de, 'v' + (0, i.zw)(e.version), 1), fe]),
									])
								);
							}
						);
					},
				});
				const me = (0, k.Z)(pe, [['__scopeId', 'data-v-40ae6353']]);
				var he = me,
					ve = n.p + 'img/athos-logo-icon.svg',
					be = n.p + 'img/searchspring-logo-icon.svg';
				const we = { class: 'controller' },
					ye = { class: 'controller-header' },
					Ce = { class: 'header-left' },
					ke = { class: 'controller-id' },
					_e = { class: 'controller-stats' },
					De = { class: 'stat-value' },
					Se = { class: 'stat-label' },
					Oe = { key: 0, class: 'stat-divider' },
					He = { key: 1, class: 'stat-item results' },
					xe = { class: 'stat-value' },
					Ne = (0, s._)('span', { class: 'stat-label' }, 'res', -1),
					Je = { key: 2, class: 'stat-divider' },
					qe = { key: 3, class: 'stat-item plugins' },
					Te = { class: 'stat-value' },
					je = (0, s._)('span', { class: 'stat-label' }, 'plugins', -1),
					Ie = { key: 0, class: 'controller-details' },
					ze = ['onClick'],
					Ue = (0, s._)('div', { class: 'config-header' }, [(0, s._)('b', null, 'globals')], -1),
					Re = { key: 0 },
					Le = ['onClick'],
					Ee = (0, s._)('div', { class: 'config-header' }, [(0, s._)('b', null, 'settings')], -1),
					We = { key: 0 };
				var Ae = (0, s.aZ)({
					__name: 'popup-controller',
					props: { controller: null },
					emits: ['toggleGlobals', 'toggleSettings'],
					setup(e, { emit: t }) {
						const n = e,
							o = (0, s.Fl)(() => {
								switch (n.controller.type) {
									case 'search':
										return 'magnifying-glass';
									case 'autocomplete':
										return 'list';
									case 'finder':
										return 'location-crosshairs';
									case 'recommendation':
										return 'grip';
									default:
										return 'magnifying-glass';
								}
							}),
							r = () => {
								t('toggleGlobals');
							},
							c = () => {
								t('toggleSettings');
							};
						return (t, n) => {
							const g = (0, s.up)('font-awesome-icon');
							return (
								(0, s.wg)(),
								(0, s.iD)('div', we, [
									(0, s._)('div', ye, [
										(0, s._)('span', Ce, [
											(0, s.Wm)(g, { icon: (0, l.SU)(o) }, null, 8, ['icon']),
											(0, s._)('span', ke, (0, i.zw)(e.controller.id), 1),
										]),
										(0, s._)('span', _e, [
											(0, s._)(
												'span',
												{ class: (0, i.C_)(['stat-item status', { loaded: e.controller.store?.loaded, 'not-loaded': !e.controller.store?.loaded }]) },
												[
													(0, s._)('span', De, (0, i.zw)(e.controller.store?.loaded ? '✓' : '○'), 1),
													(0, s._)('span', Se, (0, i.zw)(e.controller.store?.loaded ? 'loaded' : 'not loaded'), 1),
												],
												2
											),
											e.controller.store?.loaded ? ((0, s.wg)(), (0, s.iD)('span', Oe, '|')) : (0, s.kq)('', !0),
											e.controller.store?.loaded
												? ((0, s.wg)(),
												  (0, s.iD)('span', He, [
														(0, s._)(
															'span',
															xe,
															(0, i.zw)(e.controller.store.results.length) +
																' ' +
																(0, i.zw)(e.controller.store?.pagination?.totalResults ? `/${e.controller.store?.pagination?.totalResults}` : ''),
															1
														),
														Ne,
												  ]))
												: (0, s.kq)('', !0),
											void 0 !== e.controller.config?.plugins ? ((0, s.wg)(), (0, s.iD)('span', Je, '|')) : (0, s.kq)('', !0),
											void 0 !== e.controller.config?.plugins
												? ((0, s.wg)(), (0, s.iD)('span', qe, [(0, s._)('span', Te, (0, i.zw)(e.controller.config.plugins), 1), je]))
												: (0, s.kq)('', !0),
										]),
									]),
									(0, s.Wm)(
										a.uT,
										{ name: 'expand' },
										{
											default: (0, s.w5)(() => [
												e.controller.collapsed
													? (0, s.kq)('', !0)
													: ((0, s.wg)(),
													  (0, s.iD)('div', Ie, [
															e.controller.config?.globals
																? ((0, s.wg)(),
																  (0, s.iD)(
																		'div',
																		{ key: 0, class: 'config-section collapsible', onClick: (0, a.iM)(r, ['stop']) },
																		[
																			Ue,
																			(0, s.Wm)(
																				a.uT,
																				{ name: 'expand' },
																				{
																					default: (0, s.w5)(() => [
																						e.controller.config.globals.collapsed
																							? (0, s.kq)('', !0)
																							: ((0, s.wg)(),
																							  (0, s.iD)('pre', Re, (0, i.zw)(JSON.stringify(e.controller.config.globals.data, null, 2)), 1)),
																					]),
																					_: 1,
																				}
																			),
																		],
																		8,
																		ze
																  ))
																: (0, s.kq)('', !0),
															e.controller.config?.settings
																? ((0, s.wg)(),
																  (0, s.iD)(
																		'div',
																		{ key: 1, class: 'config-section collapsible', onClick: (0, a.iM)(c, ['stop']) },
																		[
																			Ee,
																			(0, s.Wm)(
																				a.uT,
																				{ name: 'expand' },
																				{
																					default: (0, s.w5)(() => [
																						e.controller.config.settings.collapsed
																							? (0, s.kq)('', !0)
																							: ((0, s.wg)(),
																							  (0, s.iD)('pre', We, (0, i.zw)(JSON.stringify(e.controller.config.settings.data, null, 2)), 1)),
																					]),
																					_: 1,
																				}
																			),
																		],
																		8,
																		Le
																  ))
																: (0, s.kq)('', !0),
													  ])),
											]),
											_: 1,
										}
									),
								])
							);
						};
					},
				});
				const Be = Ae;
				var Ze = Be;
				const Pe = (e) => ((0, s.dD)('data-v-313bf364'), (e = e()), (0, s.Cn)(), e),
					Fe = { key: 0, class: 'checkbox-label' },
					Me = ['checked', 'disabled'],
					Ve = Pe(() =>
						(0, s._)(
							'span',
							{ class: 'checkbox-custom' },
							[
								(0, s._)('svg', { class: 'checkbox-icon', viewBox: '0 0 12 10', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
									(0, s._)('path', {
										d: 'M1 5L4.5 8.5L11 1.5',
										stroke: 'white',
										'stroke-width': '2.5',
										'stroke-linecap': 'round',
										'stroke-linejoin': 'round',
									}),
								]),
							],
							-1
						)
					),
					Ge = { key: 1, class: 'checkbox-label' };
				var Ye = (0, s.aZ)({
					__name: 'checkbox',
					props: {
						modelValue: { type: Boolean },
						label: null,
						labelPlacement: { default: 'left' },
						size: { default: 'medium' },
						disabled: { type: Boolean },
					},
					emits: ['update:modelValue'],
					setup(e, { emit: t }) {
						const n = e,
							a = (0, s.Fl)(() => ({ 'size-small': 'small' === n.size, 'size-medium': 'medium' === n.size, 'size-large': 'large' === n.size }));
						function o(e) {
							const n = e.target;
							t('update:modelValue', n.checked);
						}
						return (t, n) => (
							(0, s.wg)(),
							(0, s.iD)(
								'label',
								{ class: (0, i.C_)(['checkbox-wrapper', [(0, l.SU)(a), { disabled: e.disabled, 'label-right': 'right' === e.labelPlacement }]]) },
								[
									e.label && 'left' === e.labelPlacement ? ((0, s.wg)(), (0, s.iD)('span', Fe, (0, i.zw)(e.label), 1)) : (0, s.kq)('', !0),
									(0, s._)(
										'input',
										{ type: 'checkbox', checked: e.modelValue, disabled: e.disabled, onChange: o, class: 'checkbox-input' },
										null,
										40,
										Me
									),
									Ve,
									e.label && 'right' === e.labelPlacement ? ((0, s.wg)(), (0, s.iD)('span', Ge, (0, i.zw)(e.label), 1)) : (0, s.kq)('', !0),
									(0, s.WI)(t.$slots, 'default'),
								],
								2
							)
						);
					},
				});
				const $e = (0, k.Z)(Ye, [['__scopeId', 'data-v-313bf364']]);
				var Qe = $e;
				const Ke = (e) => ((0, s.dD)('data-v-0ff9440a'), (e = e()), (0, s.Cn)(), e),
					Xe = { class: 'page-config-wrapper' },
					et = { key: 0, class: 'loading-overlay' },
					tt = Ke(() => (0, s._)('div', { class: 'loading-message' }, 'Loading...', -1)),
					nt = [tt],
					at = { key: 0, class: 'option integration skeleton' },
					ot = (0, s.uE)(
						'<h3 data-v-0ff9440a><span class="integration-header-content" data-v-0ff9440a><span class="integration-title" data-v-0ff9440a><span class="skeleton-bar title-bar" data-v-0ff9440a></span></span><span class="integration-stats" data-v-0ff9440a><span class="skeleton-bar stat-bar" data-v-0ff9440a></span><span class="skeleton-bar stat-bar" data-v-0ff9440a></span><span class="skeleton-bar stat-bar" data-v-0ff9440a></span></span></span></h3>',
						1
					),
					st = [ot],
					it = { key: 1, class: 'option integration' },
					lt = { class: 'integration-header-content' },
					rt = Ke(() => (0, s._)('span', { class: 'integration-title' }, 'Snap Integration', -1)),
					ct = { class: 'integration-stats' },
					gt = { key: 0, class: 'stat-item siteid', title: 'site id' },
					ut = Ke(() => (0, s._)('span', { class: 'stat-label' }, 'ID:', -1)),
					dt = { class: 'stat-value' },
					ft = { key: 1, class: 'stat-divider' },
					pt = ['title', 'alt', 'src'],
					mt = { key: 3, class: 'stat-divider' },
					ht = { key: 4, class: 'stat-item version', title: 'snap version' },
					vt = Ke(() => (0, s._)('span', { class: 'stat-label' }, 'v', -1)),
					bt = { class: 'stat-value' },
					wt = { key: 5, class: 'stat-divider' },
					yt = { key: 6, class: 'stat-item controllers', title: 'controllers' },
					Ct = { class: 'stat-value' },
					kt = { class: 'stat-label' },
					_t = { key: 0, class: 'integration-details' },
					Dt = { key: 0, class: 'integration-url', title: 'integration URL' },
					St = { class: 'description controllers' },
					Ot = ['onClick'],
					Ht = { class: 'alert-content' },
					xt = { class: 'alert-message' },
					Nt = { key: 0 },
					Jt = { key: 0 },
					qt = { key: 1, class: 'error-url' },
					Tt = ['href'],
					jt = { key: 1 },
					It = { key: 3, class: 'alert alert-warning' },
					zt = Ke(() => (0, s._)('strong', null, 'Extension only works on website pages.', -1)),
					Ut = Ke(() => (0, s._)('br', null, null, -1)),
					Rt = (0, s.Uk)(' Please navigate to a website to use the extension. '),
					Lt = [zt, Ut, Rt],
					Et = { key: 4, class: 'option url' },
					Wt = { class: 'heading-with-buttons' },
					At = (0, s.Uk)(' Bundle URL '),
					Bt = { class: 'url-actions' },
					Zt = Ke(() => (0, s._)('div', { class: 'description' }, [(0, s.Uk)('URL of bundle to inject onto the page.'), (0, s._)('br')], -1)),
					Pt = ['value'],
					Ft = { key: 5, class: 'option context' },
					Mt = (0, s.Uk)(' Script Context '),
					Vt = Ke(() => (0, s._)('div', { class: 'description' }, 'Contextual variables to be injected with the script.', -1)),
					Gt = { class: 'textarea-tabbed' },
					Yt = { class: 'textarea-wrapper' },
					$t = ['value', 'rows'],
					Qt = { class: 'textarea-tab' };
				var Kt = (0, s.aZ)({
					__name: 'popup-config',
					props: {
						currentHostname: null,
						hostnameConfig: null,
						savedHostnameConfig: null,
						integrationDetails: null,
						integrationLoading: { type: Boolean },
						integrationCollapsed: { type: Boolean },
						enabled: { type: [Boolean, null] },
					},
					emits: ['reset', 'set', 'update:hostnameConfig', 'toggleIntegrationCollapsed', 'reloadTab'],
					setup(e, { emit: t }) {
						const n = e;
						function o(e = '', t = 'saved') {
							const a = e.split('.').filter((e) => e),
								o = 'saved' == t ? n.savedHostnameConfig : O,
								s =
									e && a.length > 0
										? a.reduce((e, t) => {
												if (e && 'object' === typeof e && null !== e && t in e) return e[t];
										  }, o)
										: o,
								i =
									e && a.length > 0
										? a.reduce((e, t) => {
												if (e && 'object' === typeof e && null !== e && t in e) return e[t];
										  }, n.hostnameConfig)
										: n.hostnameConfig;
							if ('undefined' != typeof s && 'undefined' != typeof i)
								try {
									const e = JSON.parse(JSON.stringify(s)),
										t = JSON.parse(JSON.stringify(i));
									return !z(e, t);
								} catch (l) {
									return !1;
								}
							return !1;
						}
						function r(e, n = 'default') {
							t('reset', e, n);
						}
						function c(e, n) {
							t('set', e, n);
						}
						function g(e) {
							const a = e.target,
								o = { ...n.hostnameConfig, bundle: { ...n.hostnameConfig.bundle, url: a.value } };
							t('update:hostnameConfig', o);
						}
						function u(e) {
							const a = e.target,
								o = { ...n.hostnameConfig, bundle: { ...n.hostnameConfig.bundle, context: a.value } };
							t('update:hostnameConfig', o);
						}
						function d(e) {
							const a = { ...n.hostnameConfig, bundle: { ...n.hostnameConfig.bundle, mergeContext: e } };
							t('update:hostnameConfig', a);
						}
						function f() {
							t('reloadTab');
						}
						return (n, p) => {
							const m = (0, s.up)('font-awesome-icon');
							return (
								(0, s.wg)(),
								(0, s.iD)('div', Xe, [
									e.integrationLoading ? ((0, s.wg)(), (0, s.iD)('div', et, nt)) : (0, s.kq)('', !0),
									(0, s._)(
										'div',
										{ class: (0, i.C_)(['page-config', { loading: e.integrationLoading }]) },
										[
											e.integrationLoading ? ((0, s.wg)(), (0, s.iD)('div', at, st)) : (0, s.kq)('', !0),
											!e.integrationLoading && e.integrationDetails.version
												? ((0, s.wg)(),
												  (0, s.iD)('div', it, [
														(0, s._)('h3', { onClick: p[0] || (p[0] = () => t('toggleIntegrationCollapsed')) }, [
															(0, s._)('span', lt, [
																rt,
																(0, s._)('span', ct, [
																	e.integrationDetails.context?.siteId
																		? ((0, s.wg)(),
																		  (0, s.iD)('span', gt, [ut, (0, s._)('span', dt, (0, i.zw)(e.integrationDetails.context.siteId), 1)]))
																		: (0, s.kq)('', !0),
																	e.integrationDetails.context?.siteId ? ((0, s.wg)(), (0, s.iD)('span', ft, '|')) : (0, s.kq)('', !0),
																	e.integrationDetails.organization
																		? ((0, s.wg)(),
																		  (0, s.iD)(
																				'img',
																				{
																					key: 2,
																					title: e.integrationDetails.organization,
																					alt: e.integrationDetails.organization,
																					src: 'searchspring' === e.integrationDetails.organization ? (0, l.SU)(be) : (0, l.SU)(ve),
																					class: 'org-logo',
																				},
																				null,
																				8,
																				pt
																		  ))
																		: (0, s.kq)('', !0),
																	e.integrationDetails.organization ? ((0, s.wg)(), (0, s.iD)('span', mt, '|')) : (0, s.kq)('', !0),
																	e.integrationDetails.version
																		? ((0, s.wg)(), (0, s.iD)('span', ht, [vt, (0, s._)('span', bt, (0, i.zw)(e.integrationDetails.version), 1)]))
																		: (0, s.kq)('', !0),
																	e.integrationDetails.version && e.integrationDetails.controllers?.length
																		? ((0, s.wg)(), (0, s.iD)('span', wt, '|'))
																		: (0, s.kq)('', !0),
																	e.integrationDetails.controllers?.length
																		? ((0, s.wg)(),
																		  (0, s.iD)('span', yt, [
																				(0, s._)('span', Ct, (0, i.zw)(e.integrationDetails.controllers.length), 1),
																				(0, s._)('span', kt, (0, i.zw)(1 === e.integrationDetails.controllers.length ? 'ctrl' : 'ctrls'), 1),
																		  ]))
																		: (0, s.kq)('', !0),
																]),
															]),
														]),
														(0, s.Wm)(
															a.uT,
															{ name: 'expand' },
															{
																default: (0, s.w5)(() => [
																	e.integrationCollapsed
																		? (0, s.kq)('', !0)
																		: ((0, s.wg)(),
																		  (0, s.iD)('div', _t, [
																				e.integrationDetails.integrationUrl
																					? ((0, s.wg)(), (0, s.iD)('div', Dt, (0, i.zw)(e.integrationDetails.integrationUrl), 1))
																					: (0, s.kq)('', !0),
																				(0, s._)('div', St, [
																					((0, s.wg)(!0),
																					(0, s.iD)(
																						s.HY,
																						null,
																						(0, s.Ko)(
																							e.integrationDetails.controllers,
																							(e) => (
																								(0, s.wg)(),
																								(0, s.iD)(
																									'div',
																									{ key: e.id, onClick: () => (e.collapsed = !e.collapsed), class: 'controller-wrapper' },
																									[
																										(0, s.Wm)(
																											Ze,
																											{
																												controller: e,
																												onToggleGlobals: () =>
																													e.config && e.config.globals && (e.config.globals.collapsed = !e.config.globals.collapsed),
																												onToggleSettings: () =>
																													e.config &&
																													e.config.settings &&
																													(e.config.settings.collapsed = !e.config.settings.collapsed),
																											},
																											null,
																											8,
																											['controller', 'onToggleGlobals', 'onToggleSettings']
																										),
																									],
																									8,
																									Ot
																								)
																							)
																						),
																						128
																					)),
																				]),
																		  ])),
																]),
																_: 1,
															}
														),
												  ]))
												: (0, s.kq)('', !0),
											e.integrationLoading || !e.currentHostname || e.integrationDetails.version
												? (0, s.kq)('', !0)
												: ((0, s.wg)(),
												  (0, s.iD)(
														'div',
														{ key: 2, class: (0, i.C_)({ alert: !0, 'alert-information': !e.enabled, 'alert-warning': e.enabled }) },
														[
															(0, s._)('div', Ht, [
																(0, s._)('div', xt, [
																	e.enabled
																		? ((0, s.wg)(),
																		  (0, s.iD)('div', Nt, [
																				(0, s._)(
																					'strong',
																					null,
																					(0, i.zw)(
																						e.integrationDetails.error?.message || 'Failed to load bundle. Check console for possible errors.'
																					),
																					1
																				),
																				e.integrationDetails.error?.details
																					? ((0, s.wg)(), (0, s.iD)('div', Jt, (0, i.zw)(e.integrationDetails.error.details), 1))
																					: (0, s.kq)('', !0),
																				e.integrationDetails.error?.url
																					? ((0, s.wg)(),
																					  (0, s.iD)('div', qt, [
																							(0, s._)(
																								'a',
																								{ href: e.integrationDetails.error.url, target: '_blank', rel: 'noopener noreferrer' },
																								(0, i.zw)(e.integrationDetails.error.url),
																								9,
																								Tt
																							),
																					  ]))
																					: (0, s.kq)('', !0),
																		  ]))
																		: ((0, s.wg)(), (0, s.iD)('div', jt, 'No Snap integration found.')),
																]),
																(0, s._)('button', { class: 'refresh-button', onClick: f, title: 'Reload tab' }, [
																	(0, s.Wm)(m, { icon: 'sync-alt' }),
																]),
															]),
														],
														2
												  )),
											e.currentHostname ? (0, s.kq)('', !0) : ((0, s.wg)(), (0, s.iD)('div', It, Lt)),
											e.currentHostname
												? ((0, s.wg)(),
												  (0, s.iD)('div', Et, [
														(0, s._)('h3', null, [
															(0, s._)('span', Wt, [
																At,
																(0, s._)('span', Bt, [
																	(0, s._)(
																		'button',
																		{
																			class: 'url-cdn',
																			onClick: p[1] || (p[1] = (e) => c('bundle.url', 'https://snapui.athoscommerce.io/siteid/branch/bundle.js')),
																		},
																		'cdn'
																	),
																	(0, s._)(
																		'button',
																		{ class: 'url-local', onClick: p[2] || (p[2] = (e) => c('bundle.url', 'https://localhost:3333/bundle.js')) },
																		'local'
																	),
																]),
															]),
															o('bundle.url', 'default')
																? ((0, s.wg)(),
																  (0, s.j4)(m, {
																		key: 0,
																		class: 'reset',
																		onClick: p[3] || (p[3] = (e) => r('bundle.url')),
																		icon: 'undo',
																		title: 'reset bundle URL',
																  }))
																: (0, s.kq)('', !0),
														]),
														Zt,
														(0, s._)('input', { value: e.hostnameConfig.bundle.url, onInput: g, type: 'text' }, null, 40, Pt),
												  ]))
												: (0, s.kq)('', !0),
											e.currentHostname
												? ((0, s.wg)(),
												  (0, s.iD)('div', Ft, [
														(0, s._)('h3', null, [
															Mt,
															o('bundle.context', 'default')
																? ((0, s.wg)(),
																  (0, s.j4)(m, {
																		key: 0,
																		class: 'reset',
																		onClick: p[4] || (p[4] = (e) => r('bundle.context')),
																		icon: 'undo',
																		title: 'reset context variables',
																  }))
																: (0, s.kq)('', !0),
														]),
														Vt,
														(0, s._)('div', Gt, [
															(0, s._)('div', Yt, [
																(0, s._)(
																	'textarea',
																	{
																		placeholder: 'context variables should be here...',
																		required: 'true',
																		spellcheck: 'false',
																		value: e.hostnameConfig.bundle?.context,
																		onInput: u,
																		rows: (e.hostnameConfig.bundle?.context || '').split('\n').length,
																	},
																	null,
																	40,
																	$t
																),
																(0, s._)('div', Qt, [
																	(0, s.Wm)(m, { icon: 'code-merge', class: 'merge-icon' }),
																	(0, s.Wm)(
																		Qe,
																		{
																			label: 'Merge with page context',
																			'label-placement': 'right',
																			size: 'small',
																			'model-value': e.hostnameConfig.bundle.mergeContext,
																			'onUpdate:modelValue': p[5] || (p[5] = (e) => d(e)),
																		},
																		null,
																		8,
																		['model-value']
																	),
																]),
															]),
														]),
												  ]))
												: (0, s.kq)('', !0),
										],
										2
									),
								])
							);
						};
					},
				});
				const Xt = (0, k.Z)(Kt, [['__scopeId', 'data-v-0ff9440a']]);
				var en = Xt;
				const tn = { class: 'snapfu' };
				var nn = (0, s.aZ)({
					__name: 'popup',
					props: { version: null },
					setup(e) {
						const t = e;
						let n = !1;
						const o = (0, l.iH)(null),
							r = (0, l.qj)({
								settings: { show: !1 },
								integration: { details: {}, loading: !0 },
								config: {},
								savedConfig: {},
								hostnameConfig: JSON.parse(JSON.stringify(O)),
								savedHostnameConfig: JSON.parse(JSON.stringify(O)),
								currentHostname: null,
								currentTabId: null,
								enabled: null,
							});
						async function c() {
							const e = r.hostnameConfig.bundle.url !== r.savedHostnameConfig.bundle.url,
								t = r.hostnameConfig.bundle.context !== r.savedHostnameConfig.bundle.context,
								n = r.hostnameConfig.bundle.mergeContext !== r.savedHostnameConfig.bundle.mergeContext,
								a = r.hostnameConfig.bundle.injectionTarget !== r.savedHostnameConfig.bundle.injectionTarget,
								o = r.hostnameConfig.intercepts !== r.savedHostnameConfig.intercepts,
								s = (e || t || n || a || o) && r.enabled && r.currentTabId;
							s && (await f()),
								x(r.config),
								(r.savedConfig = JSON.parse(JSON.stringify(r.config))),
								r.currentHostname && (T(r.currentHostname, r.hostnameConfig), (r.savedHostnameConfig = JSON.parse(JSON.stringify(r.hostnameConfig)))),
								s && r.currentTabId && (await U(r.currentTabId));
						}
						function g() {
							try {
								const e = JSON.parse(JSON.stringify(r.savedHostnameConfig)),
									t = JSON.parse(JSON.stringify(r.hostnameConfig));
								return !z(e, t);
							} catch (e) {
								return !1;
							}
						}
						function u(e, t = 'default') {
							const n = e.split('.').filter((e) => e),
								a = 'saved' == t ? r.savedHostnameConfig : O,
								o = n.reduce((e, t) => {
									if (e && 'object' === typeof e && null !== e && t in e) return e[t];
								}, a);
							'undefined' != typeof o &&
								n.reduce((e, t, a) => {
									if (e && 'object' === typeof e && null !== e) {
										const s = e;
										if (a != n.length - 1) return s[t];
										s[t] = JSON.parse(JSON.stringify(o));
									}
									return e;
								}, r.hostnameConfig);
						}
						function d(e, t) {
							const n = e.split('.').filter((e) => e);
							n.reduce((e, a, o) => {
								if (e && 'object' === typeof e && null !== e) {
									const s = e;
									if (o != n.length - 1) return s[a];
									s[a] = JSON.parse(JSON.stringify(t));
								}
								return e;
							}, r.hostnameConfig);
						}
						async function f() {
							(n = !0),
								(r.integration.details = {}),
								(r.integration.loading = !0),
								setTimeout(() => {
									n = !1;
								}, 500);
						}
						async function p() {
							if (!r.currentTabId || !r.currentHostname) return;
							if (null === r.enabled) return;
							const e = !r.enabled;
							r.settings.show && ((r.settings.show = !1), o.value && o.value.resetConfirmations()),
								await f(),
								(r.enabled = e),
								await I(r.currentTabId, e),
								e &&
									(await T(r.currentHostname, r.hostnameConfig),
									(r.savedHostnameConfig = JSON.parse(JSON.stringify(r.hostnameConfig))),
									await new Promise((e) => setTimeout(e, 100))),
								r.currentTabId && (await U(r.currentTabId));
						}
						function m() {
							(r.settings.show = !r.settings.show), !r.settings.show && o.value && o.value.resetConfirmations();
						}
						async function h() {
							(r.hostnameConfig.integrationCollapsed = !r.hostnameConfig.integrationCollapsed),
								(r.savedHostnameConfig.integrationCollapsed = r.hostnameConfig.integrationCollapsed),
								r.currentHostname && (await T(r.currentHostname, r.hostnameConfig));
						}
						async function v() {
							r.currentTabId && (await f(), await U(r.currentTabId));
						}
						async function b() {
							(r.config.autoEnable = !r.config.autoEnable), await x(r.config);
						}
						async function w() {
							r.enabled && r.currentTabId && (await f()),
								r.currentHostname &&
									((r.hostnameConfig = JSON.parse(JSON.stringify(O))),
									(r.savedHostnameConfig = JSON.parse(JSON.stringify(O))),
									T(r.currentHostname, r.hostnameConfig)),
								r.enabled && r.currentTabId && (await U(r.currentTabId));
						}
						async function y() {
							try {
								r.currentTabId && r.currentHostname && (await f()), await chrome.storage.sync.clear(), await chrome.storage.local.clear();
								const e = await chrome.declarativeNetRequest.getSessionRules(),
									t = e.map((e) => e.id);
								t.length > 0 && (await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: t, addRules: [] })),
									(r.config = { hostnameConfigs: {} }),
									(r.savedConfig = { hostnameConfigs: {} }),
									(r.hostnameConfig = JSON.parse(JSON.stringify(O))),
									(r.savedHostnameConfig = JSON.parse(JSON.stringify(O))),
									(r.enabled = !1),
									(r.integration.loading = !1),
									(r.settings.show = !1),
									r.currentTabId && r.currentHostname && (await U(r.currentTabId));
							} catch (e) {}
						}
						return (
							(0, s.bv)(async () => {
								let e;
								try {
									[e] = await chrome.tabs.query({ active: !0, currentWindow: !0 });
								} catch {
									return;
								}
								const t = e.id || null,
									a = e.url || '',
									o = a.startsWith('http://') || a.startsWith('https://');
								let s = null;
								try {
									const e = new URL(a);
									s = e.hostname;
								} catch {}
								const i = o ? s : null;
								(r.currentHostname = i), (r.currentTabId = t);
								const l = await N();
								(r.config = l), (r.savedConfig = JSON.parse(JSON.stringify(l)));
								const c = i ? await q(i) : JSON.parse(JSON.stringify(O));
								(r.hostnameConfig = c), (r.savedHostnameConfig = JSON.parse(JSON.stringify(c)));
								const g = !!t && (await j(t));
								if (((r.enabled = g), t)) {
									const e = await chrome.storage.local.get(String(t)),
										n = e[t];
									n?.timestamp ? ((r.integration.details = n), (r.integration.loading = !1)) : (r.integration.loading = o);
								}
								try {
									chrome.storage.onChanged.addListener(async (e, a) => {
										if (!n && t && 'local' === a)
											try {
												const n = await chrome.storage.local.get(),
													a = n[t];
												void 0 !== e[t]?.newValue?.enabled && (r.enabled = e[t].newValue.enabled),
													a?.timestamp &&
														(r.integration.details?.controllers &&
															a.controllers &&
															a.controllers.forEach((e, t) => {
																const n = r.integration.details.controllers?.[t];
																n &&
																	n.id === e.id &&
																	((e.collapsed = n.collapsed),
																	n.config?.globals && e.config?.globals && (e.config.globals.collapsed = n.config.globals.collapsed),
																	n.config?.settings && e.config?.settings && (e.config.settings.collapsed = n.config.settings.collapsed));
															}),
														(r.integration.details = a),
														(r.integration.loading = !1));
											} catch (o) {}
									});
								} catch (u) {}
							}),
							(e, n) => (
								(0, s.wg)(),
								(0, s.iD)('div', tn, [
									(0, s.Wm)(
										D,
										{
											currentHostname: r.currentHostname,
											hasChanges: g(),
											enabled: r.enabled,
											settingsOpen: r.settings.show,
											integrationLoading: r.integration.loading,
											onSave: c,
											onToggleOnOff: p,
											onToggleSettings: m,
										},
										null,
										8,
										['currentHostname', 'hasChanges', 'enabled', 'settingsOpen', 'integrationLoading']
									),
									(0, s._)(
										'div',
										{ class: (0, i.C_)(['content-container', { 'settings-active': r.settings.show }]) },
										[
											(0, s.Wm)(
												en,
												{
													currentHostname: r.currentHostname,
													hostnameConfig: r.hostnameConfig,
													savedHostnameConfig: r.savedHostnameConfig,
													integrationDetails: r.integration.details,
													integrationLoading: r.integration.loading,
													integrationCollapsed: r.hostnameConfig.integrationCollapsed,
													enabled: r.enabled,
													onReset: u,
													onSet: d,
													'onUpdate:hostnameConfig': n[0] || (n[0] = (e) => (r.hostnameConfig = e)),
													onToggleIntegrationCollapsed: h,
													onReloadTab: v,
												},
												null,
												8,
												[
													'currentHostname',
													'hostnameConfig',
													'savedHostnameConfig',
													'integrationDetails',
													'integrationLoading',
													'integrationCollapsed',
													'enabled',
												]
											),
											(0, s.wy)(
												(0, s.Wm)(
													he,
													{
														version: t.version,
														currentHostname: r.currentHostname,
														hostnameConfig: r.hostnameConfig,
														savedHostnameConfig: r.savedHostnameConfig,
														autoEnable: r.config.autoEnable ?? !1,
														onReset: u,
														onResetAppConfig: w,
														onClearAllStorage: y,
														'onUpdate:hostnameConfig': n[1] || (n[1] = (e) => (r.hostnameConfig = e)),
														onToggleAutoEnable: b,
														ref_key: 'settingsRef',
														ref: o,
													},
													null,
													8,
													['version', 'currentHostname', 'hostnameConfig', 'savedHostnameConfig', 'autoEnable']
												),
												[[a.F8, r?.settings.show]]
											),
										],
										2
									),
								])
							)
						);
					},
				});
				const an = nn;
				var on = an,
					sn = n(947),
					ln = n(810),
					rn = n(436);
				sn.vI.add(rn.gPx, rn.gr5, rn.r6l, rn.Bl_, rn.X7o, rn.Y$T, rn.Zrf, rn.TqS, rn.QR4, rn.onQ, rn.gc2, rn.DBf, rn._tD, rn.dpY, rn.d8e);
				const cn = (0, a.ri)(on, { version: o.i8 });
				cn.component('font-awesome-icon', ln.GN), cn.mount('#app');
			},
		},
		t = {};
	function n(a) {
		var o = t[a];
		if (void 0 !== o) return o.exports;
		var s = (t[a] = { exports: {} });
		return e[a](s, s.exports, n), s.exports;
	}
	(n.m = e),
		(function () {
			var e = [];
			n.O = function (t, a, o, s) {
				if (!a) {
					var i = 1 / 0;
					for (g = 0; g < e.length; g++) {
						(a = e[g][0]), (o = e[g][1]), (s = e[g][2]);
						for (var l = !0, r = 0; r < a.length; r++)
							(!1 & s || i >= s) &&
							Object.keys(n.O).every(function (e) {
								return n.O[e](a[r]);
							})
								? a.splice(r--, 1)
								: ((l = !1), s < i && (i = s));
						if (l) {
							e.splice(g--, 1);
							var c = o();
							void 0 !== c && (t = c);
						}
					}
					return t;
				}
				s = s || 0;
				for (var g = e.length; g > 0 && e[g - 1][2] > s; g--) e[g] = e[g - 1];
				e[g] = [a, o, s];
			};
		})(),
		(function () {
			n.d = function (e, t) {
				for (var a in t) n.o(t, a) && !n.o(e, a) && Object.defineProperty(e, a, { enumerable: !0, get: t[a] });
			};
		})(),
		(function () {
			n.g = (function () {
				if ('object' === typeof globalThis) return globalThis;
				try {
					return this || new Function('return this')();
				} catch (e) {
					if ('object' === typeof window) return window;
				}
			})();
		})(),
		(function () {
			n.o = function (e, t) {
				return Object.prototype.hasOwnProperty.call(e, t);
			};
		})(),
		(function () {
			n.p = '/';
		})(),
		(function () {
			var e = { 42: 0 };
			n.O.j = function (t) {
				return 0 === e[t];
			};
			var t = function (t, a) {
					var o,
						s,
						i = a[0],
						l = a[1],
						r = a[2],
						c = 0;
					if (
						i.some(function (t) {
							return 0 !== e[t];
						})
					) {
						for (o in l) n.o(l, o) && (n.m[o] = l[o]);
						if (r) var g = r(n);
					}
					for (t && t(a); c < i.length; c++) (s = i[c]), n.o(e, s) && e[s] && e[s][0](), (e[s] = 0);
					return n.O(g);
				},
				a = (self['webpackChunk_searchspring_snapfu_extension'] = self['webpackChunk_searchspring_snapfu_extension'] || []);
			a.forEach(t.bind(null, 0)), (a.push = t.bind(null, a.push.bind(a)));
		})();
	var a = n.O(void 0, [998], function () {
		return n(356);
	});
	a = n.O(a);
})();

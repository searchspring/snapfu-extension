<template>
	<div class="snapfu">
		<div class="header">
			<img class="logo" src="../assets/searchspring.svg" />
			<div v-if="state.currentHostname" class="hostname-pill" :title="state.currentHostname">
				{{ state.currentHostname }}
			</div>
			<div class="buttons">
				<div class="button save" :class="{ visible: detectChanges() }" @click="saveConfig">
					<font-awesome-icon icon="save" />
				</div>

				<div 
					class="button toggle" 
					:class="{ on: state?.enabled, disabled: isToggleDisabled(), loading: state.enabled === null }" 
					@click="toggleOnOff"
					:title="getToggleDisabledReason()"
				>
					<span v-if="state?.enabled" class="on"></span>
					<font-awesome-icon icon="toggle-off" />
				</div>

				<div class="button settings" :class="{ open: state?.settings.show }" @click="toggleAppSettings">
					<span v-if="state?.settings.show" class="open"></span>
					<font-awesome-icon icon="gear" />
				</div>
			</div>
		</div>

		<div v-if="state?.settings.show" class="page-settings">
			<div class="option intercepts">
				<h3>
					Intercepts
					<font-awesome-icon
						v-if="detectChanges('intercepts', 'default')"
						class="reset"
						@click="reset('intercepts')"
						icon="undo"
						title="reset intercepts"
					/>
				</h3>
				<div class="description">Intercepts are used for blocking network requests. This helps prevent multiple bundles from loading.</div>

				<textarea
					placeholder="intercepts should be here..."
					required="true"
					spellcheck="false"
					v-model="state.hostnameConfig.intercepts"
					:rows="(state.hostnameConfig.intercepts || '').split('\n').length"
				/>
			</div>

			<div class="option injection">
				<h3>
					Script Injection
					<font-awesome-icon
						v-if="detectChanges('forceInjection', 'default')"
						class="reset"
						@click="reset('forceInjection')"
						icon="undo"
						title="reset force injection"
					/>
				</h3>
				<div class="description">Enable script injection on any page, regardless of whether integration is present or not.</div>

				<label class="injection">
					<span>Force Injection: </span>
					<input v-model="state.hostnameConfig.forceInjection" type="checkbox" />
				</label>
			</div>

			<div class="option reset" v-if="savedConfigDiffersFromDefaults()">
				<h3>
					Restore Defaults
					<button class="reset-extension" @click="resetAppConfig">
						{{ state.settings.confirmReset ? 'confirm' : 'reset' }}
					</button>
				</h3>
				<div class="description">Reset settings for the current site back to initial values.</div>
			</div>

			<div class="option clear-all">
				<h3>
					<span class="title-with-icon">
						Restore All
						<font-awesome-icon
							class="view-storage"
							:class="{ active: state.settings.showStorage }"
							@click="toggleViewStorage"
							icon="circle-info"
							title="view storage contents"
						/>
					</span>
					<button class="clear-all-button" @click="clearAllStorage">
						{{ state.settings.confirmClearAll ? 'confirm' : 'restore all' }}
					</button>
				</h3>
				<div class="description">Reset the extension to factory defaults. Clears all settings, per-tab states, and active rules across all hostnames.</div>
				
				<div v-if="state.settings.showStorage" class="storage-viewer">
					<textarea
						readonly
						spellcheck="false"
						:value="state.settings.storageContent"
						rows="10"
					/>
				</div>
			</div>

			<div class="option footer">
				<span class="version">v{{ props.version }}</span>
				<a href="https://github.com/searchspring/snapfu-extension" target="_blank"><img class="github" src="../assets/github.svg" /></a>
			</div>
		</div>

		<div v-if="!state?.settings.show" class="page-config">
			<div v-if="state.integration.loading" class="loading-container">
				<Loading />
			</div>

			<div class="option integration" v-if="!state.integration.loading && state.integration.details.version">
				<h3 @click="() => (state.integration.collapsed = !state.integration.collapsed)">
					<span>
						<span>Snap Integration <span v-if="state.integration.details.version" class="snap-version">v{{ state.integration.details.version }}</span></span>
						<span v-if="state.integration.details.controllers?.length" class="controllers-pill">
							Controllers <span class="count-badge">{{ state.integration.details.controllers.length }}</span>
						</span>
					</span>
					<font-awesome-icon class="header-icon collapse-icon" :icon="state.integration.collapsed ? 'angle-down' : 'angle-up'" />
				</h3>

				<div class="integration-details" v-if="!state.integration.collapsed">
					<div class="description controllers">
						<div
							:key="key"
							v-for="(controller, key) in state.integration.details.controllers"
							@click="() => (controller.collapsed = !controller.collapsed)"
							class="controller-wrapper"
						>
							<Controller :controller="controller" />
						</div>
					</div>
				</div>
			</div>

			<div v-if="!state.integration.loading && !state.integration.details.version" class="no-integration-warning">
				No Snap integration found.
			</div>

			<div class="option url">
				<h3>
					Bundle URL
					<span class="url-actions">
						<button class="url-cdn" @click="set('bundle.url', 'https://snapui.searchspring.io/siteid/branch/bundle.js')">cdn</button>
						<button class="url-local" @click="set('bundle.url', 'https://localhost:3333/bundle.js')">local</button>
						<font-awesome-icon
							v-if="detectChanges('bundle.url', 'default')"
							class="reset"
							@click="reset('bundle.url')"
							icon="undo"
							title="reset bundle URL"
						/>
						<span v-else class="reset-placeholder"></span>
					</span>
				</h3>

				<div class="description">URL of bundle to inject onto the page.<br /></div>

				<input v-model="state.hostnameConfig.bundle.url" type="text" />
			</div>

			<div class="option context">
				<h3>
					Script Context
					<font-awesome-icon
						v-if="detectChanges('bundle.context', 'default')"
						class="reset"
						@click="reset('bundle.context')"
						icon="undo"
						title="reset context variables"
					/>
				</h3>

				<div class="description">Contextual variables to be injected with the script.</div>

				<textarea
					placeholder="context variables should be here..."
					required="true"
					spellcheck="false"
					v-model="state.hostnameConfig.bundle.context"
					:rows="(state.hostnameConfig.bundle?.context || '').split('\n').length"
				/>
				<label class="context-merge">
					<span>Merge context: </span>
					<input v-model="state.hostnameConfig.bundle.mergeContext" type="checkbox" />
				</label>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, onMounted, defineProps } from 'vue';
import { StoredData, HostnameConfig, LocalData } from '../types/storage';
import Controller from './controller.vue';
import Loading from './loading.vue';

import { 
	defaultHostnameConfig, 
	getConfig, 
	setConfig, 
	deepCompare, 
	getCurrentTabId, 
	getCurrentHostname,
	getHostnameConfig,
	setHostnameConfig,
	getTabEnabled,
	setTabEnabled
} from '../utilities/utilities';

const props = defineProps({
	version: String,
});

const state = reactive({
	settings: {
		show: false,
		confirmReset: false,
		confirmClearAll: false,
		showStorage: false,
		storageContent: '',
	},
	integration: {
		details: {} as LocalData,
		loading: true,
		collapsed: false,
	},
	config: {} as StoredData,
	savedConfig: {} as StoredData,
	hostnameConfig: JSON.parse(JSON.stringify(defaultHostnameConfig)) as HostnameConfig,
	savedHostnameConfig: JSON.parse(JSON.stringify(defaultHostnameConfig)) as HostnameConfig,
	currentHostname: null as string | null,
	currentTabId: null as number | null,
	enabled: null as boolean | null, // Per-tab enabled state - null until loaded
});

onMounted(async () => {
	const config = await getConfig();
	state.config = config;
	state.savedConfig = JSON.parse(JSON.stringify(config));

	// Get current hostname and its config
	const hostname = await getCurrentHostname();
	
	// Only show hostname for valid http/https URLs
	let validHostname: string | null = null;
	if (hostname) {
		try {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			const url = tab.url || '';
			if (url.startsWith('http://') || url.startsWith('https://')) {
				validHostname = hostname;
			}
		} catch {
			// If we can't get the tab URL, don't show hostname
		}
	}
	
	state.currentHostname = validHostname;
	
	if (validHostname) {
		const hostnameConfig = await getHostnameConfig(validHostname);
		state.hostnameConfig = hostnameConfig;
		state.savedHostnameConfig = JSON.parse(JSON.stringify(hostnameConfig));
	} else {
		state.hostnameConfig = JSON.parse(JSON.stringify(defaultHostnameConfig));
		state.savedHostnameConfig = JSON.parse(JSON.stringify(defaultHostnameConfig));
	}

	// Get currentTabId and enabled state
	const tabIdStr = await getCurrentTabId();
	const tabId = tabIdStr ? Number(tabIdStr) : null;
	state.currentTabId = tabId;
	
	if (tabId) {
		state.enabled = await getTabEnabled(tabId);
		
		// Check if we already have integration data for this tab
		const storedLocalData = await chrome.storage.local.get(String(tabId));
		const existingData = storedLocalData[tabId];
		if (existingData?.timestamp) {
			// We have existing data, use it and don't show loading
			state.integration.details = existingData;
			state.integration.loading = false;
		} else {
			// No existing data - check if we should show loading based on URL scheme
			if (hostname) {
				try {
					const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
					const url = tab.url || '';
					// Only load for http/https URLs (actual web pages that can be scraped)
					state.integration.loading = url.startsWith('http://') || url.startsWith('https://');
				} catch {
					state.integration.loading = false;
				}
			}
		}
	}

	// Add onChange storage listener
	try {
		chrome.storage.onChanged.addListener(async (changes, area) => {
			if (tabId && area === 'local') {
				try {
					const storedLocalData = await chrome.storage.local.get();
					const newData = storedLocalData[tabId];
					
					// Update enabled state if it changed
					if (changes[tabId]?.newValue?.enabled !== undefined) {
						state.enabled = changes[tabId].newValue.enabled;
					}
					
					// Only update if we have new data with a timestamp
					if (newData?.timestamp) {
						// Preserve collapsed state of controllers
						if (state.integration.details?.controllers && newData.controllers) {
							newData.controllers.forEach((newController: any, index: number) => {
								const existingController = state.integration.details.controllers?.[index];
								if (existingController && existingController.id === newController.id) {
									newController.collapsed = existingController.collapsed;
								}
							});
						}
						state.integration.details = newData;
						state.integration.loading = false;
					} 
					// If data was explicitly cleared (empty object with no timestamp),
					// and we previously had data, mark as loading
					else if (state.integration.details?.timestamp && newData && !newData.timestamp) {
						state.integration.loading = true;
						state.integration.details = {};
					}
					// Otherwise, keep the current state (don't force loading)
				} catch (error) {
					// Silently catching invalidated extension context
				}
			}
		});
	} catch (error) {
		// Silently catching invalidated extension context
	}
});

function saveConfig() {
	// Check if bundle URL, context, or merge context changed
	const bundleUrlChanged = state.hostnameConfig.bundle.url !== state.savedHostnameConfig.bundle.url;
	const contextChanged = state.hostnameConfig.bundle.context !== state.savedHostnameConfig.bundle.context;
	const mergeContextChanged = state.hostnameConfig.bundle.mergeContext !== state.savedHostnameConfig.bundle.mergeContext;
	
	// Save global config (which now just stores hostname configs)
	setConfig(state.config);
	state.savedConfig = JSON.parse(JSON.stringify(state.config));
	
	// Save hostname config
	if (state.currentHostname) {
		setHostnameConfig(state.currentHostname, state.hostnameConfig);
		state.savedHostnameConfig = JSON.parse(JSON.stringify(state.hostnameConfig));
	}
	
	// Reload page if bundle settings changed and extension is enabled
	if ((bundleUrlChanged || contextChanged || mergeContextChanged) && state.enabled && state.currentTabId) {
		chrome.tabs.reload(state.currentTabId);
	}
}

function detectChanges(configPath = '', location = 'saved') {
	const paths = configPath.split('.').filter(p => p);
	
	// Compare hostname-specific settings
	const configLocation = location == 'saved' ? state.savedHostnameConfig : defaultHostnameConfig;
	const savedValue = configPath && paths.length > 0
		? paths.reduce((configuration: any, path: string) => {
				if (configuration && typeof configuration[path] !== 'undefined') {
					return configuration[path];
				}
				return undefined;
		  }, configLocation)
		: configLocation;

	const value = configPath && paths.length > 0
		? paths.reduce((configuration: any, path: string) => {
				if (configuration && typeof configuration[path] !== 'undefined') {
					return configuration[path];
				}
				return undefined;
		  }, state.hostnameConfig)
		: state.hostnameConfig;

	if (typeof savedValue != 'undefined' && typeof value != 'undefined') {
		try {
			const savedValueClone = JSON.parse(JSON.stringify(savedValue));
			const valueClone = JSON.parse(JSON.stringify(value));
			return !deepCompare(savedValueClone, valueClone);
		} catch (e) {
			return false;
		}
	}

	return false;
}

function savedConfigDiffersFromDefaults() {
	try {
		const savedClone = JSON.parse(JSON.stringify(state.savedHostnameConfig));
		const defaultClone = JSON.parse(JSON.stringify(defaultHostnameConfig));
		return !deepCompare(savedClone, defaultClone);
	} catch (e) {
		return false;
	}
}

function reset(configPath: string, location = 'default') {
	const paths = configPath.split('.').filter(p => p);
	const configLocation = location == 'saved' ? state.savedHostnameConfig : defaultHostnameConfig;

	const savedValue = paths.reduce((configuration: any, path: string) => {
		if (configuration && configuration[path] !== undefined) {
			return configuration[path];
		}
		return undefined;
	}, configLocation);

	if (typeof savedValue != 'undefined') {
		paths.reduce((configuration: any, path: string, index) => {
			if (index == paths.length - 1) {
				configuration[path] = JSON.parse(JSON.stringify(savedValue));
			} else {
				return configuration[path];
			}
		}, state.hostnameConfig);
	}
}

function set(configPath: string, value: any) {
	const paths = configPath.split('.').filter(p => p);

	paths.reduce((configuration: any, path: string, index) => {
		if (index == paths.length - 1) {
			configuration[path] = JSON.parse(JSON.stringify(value));
		} else {
			return configuration[path];
		}
	}, state.hostnameConfig);
}

function isToggleDisabled(): boolean {
	// Can always disable
	if (state.enabled) return false;
	
	// Can enable if force inject is on (check saved config, not unsaved changes)
	if (state.savedHostnameConfig.forceInjection) return false;
	
	// Can enable if integration details exist (has version, not just timestamp)
	if (state.integration.details?.version) return false;
	
	// Otherwise, cannot enable
	return true;
}

function getToggleDisabledReason(): string {
	if (!isToggleDisabled()) return '';
	return 'Cannot enable: either turn on Force Injection or ensure an integration exists on the page';
}

async function toggleOnOff() {
	if (!state.currentTabId || !state.currentHostname) return;
	if (state.enabled === null) return; // Not loaded yet
	
	// Prevent enabling if disabled
	if (isToggleDisabled()) return;
	
	const newEnabled = !state.enabled;
	state.enabled = newEnabled;
	await setTabEnabled(state.currentTabId, newEnabled);
	
	// When enabling for the first time, ensure hostname config exists
	if (newEnabled) {
		// Save the current hostname config to ensure intercepts are applied
		await setHostnameConfig(state.currentHostname, state.hostnameConfig);
		state.savedHostnameConfig = JSON.parse(JSON.stringify(state.hostnameConfig));
		
		// Show loading indicator when toggling on
		state.integration.loading = true;
		state.integration.details = {};
		
		// Wait for storage changes to propagate and intercepts to be updated
		// The storage listener in background.ts will trigger intercept updates
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	
	// Reload the page to apply/remove the extension
	if (state.currentTabId) {
		chrome.tabs.reload(state.currentTabId);
	}
}

function toggleAppSettings() {
	state.settings.show = !state.settings.show;
	if (!state.settings.show) {
		state.settings.confirmReset = false;
		state.settings.confirmClearAll = false;
		state.settings.showStorage = false;
	}
}

async function toggleViewStorage() {
	state.settings.showStorage = !state.settings.showStorage;
	
	if (state.settings.showStorage) {
		try {
			const syncData = await chrome.storage.sync.get();
			
			// Only show hostnameConfigs
			const hostnameConfigs = syncData.hostnameConfigs || {};
			
			state.settings.storageContent = JSON.stringify(hostnameConfigs, null, 2);
		} catch (error) {
			state.settings.storageContent = 'Error retrieving storage: ' + error;
		}
	}
}

async function resetAppConfig() {
	if (!state.settings.confirmReset) {
		state.settings.confirmReset = true;
	} else {
		// Reset the current hostname's config to defaults
		if (state.currentHostname) {
			state.hostnameConfig = JSON.parse(JSON.stringify(defaultHostnameConfig));
			state.savedHostnameConfig = JSON.parse(JSON.stringify(defaultHostnameConfig));
			setHostnameConfig(state.currentHostname, state.hostnameConfig);
		}
		
		state.settings.confirmReset = false;
	}
}

async function clearAllStorage() {
	if (!state.settings.confirmClearAll) {
		state.settings.confirmClearAll = true;
	} else {
		try {
			// Clear all sync storage (hostname configs)
			await chrome.storage.sync.clear();
			
			// Clear all local storage (per-tab enabled states and integration details)
			await chrome.storage.local.clear();
			
			// Clear all session rules (intercepts and CSP rules)
			const sessionRules = await chrome.declarativeNetRequest.getSessionRules();
			const ruleIds = sessionRules.map(rule => rule.id);
			if (ruleIds.length > 0) {
				await chrome.declarativeNetRequest.updateSessionRules({
					removeRuleIds: ruleIds,
					addRules: []
				});
			}
			
			// Reset popup state to defaults
			state.config = { hostnameConfigs: {} };
			state.savedConfig = { hostnameConfigs: {} };
			state.hostnameConfig = JSON.parse(JSON.stringify(defaultHostnameConfig));
			state.savedHostnameConfig = JSON.parse(JSON.stringify(defaultHostnameConfig));
			state.enabled = false;
			
			state.settings.confirmClearAll = false;
			state.settings.show = false;
		} catch (error) {
			// Silently catching errors
		}
	}
}
</script>

<style lang="scss">
body {
	margin: 0;
	padding: 0;
}

.snapfu {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	margin: 0;
	padding: 0;
	min-width: 420px;
	border: 1px solid #352490;

	a {
		color: #09b4d8;
	}

	button {
		cursor: pointer;
		background: #352490;
		color: #fff;
		border-radius: 5px;
		border: none;
		padding: 5px;
		font-size: 10px;
		font-weight: bold;
	}

	textarea {
		font-family: monospace;
		font-size: 10px;
		line-height: 14px;
		padding: 5px;
		width: 100%;
		height: auto;
		resize: none;
		border-radius: 3px;
		border: 1px solid #ccc;
		box-sizing: border-box;
		outline: none;
	}

	input[type='text'] {
		font-family: monospace;
		font-size: 10px;
		padding: 5px;
		border-radius: 3px;
		border: 1px solid #ccc;
		box-sizing: border-box;
		outline: none;
	}

	.option.integration {
		background: rgba(0, 0, 0, 0.025);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 4px;
		padding: 12px;
		margin: 0;

		.snap-version {
			font-weight: normal;
			background: rgba(0, 0, 0, 0.06);
			padding: 2px 8px;
			border-radius: 12px;
			font-size: 0.9em;
			margin-left: 6px;
		}

		.controllers-pill {
			font-weight: normal;
			background: rgba(53, 36, 144, 0.1);
			padding: 2px 8px;
			border-radius: 12px;
			font-size: 0.9em;
			margin-left: 6px;
			margin-right: 12px;
			display: inline-flex;
			align-items: center;
			gap: 6px;

			.count-badge {
				background: #352490;
				color: white;
				padding: 2px 6px;
				border-radius: 10px;
				font-size: 0.85em;
				font-weight: 600;
				min-width: 18px;
				text-align: center;
			}
		}

		h3 {
			cursor: pointer;
			margin: 0;

			> span {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex: 1;
			}
		}

		.integration-details {
			margin-top: 18px;
		}

		.header-icon.collapse-icon {
			padding-right: 9px;
		}

		.description.controllers {
			padding: 0;
			margin: 0;
		}
	}

	.no-integration-warning {
		background: rgba(53, 36, 144, 0.04);
		border: 1px solid rgba(53, 36, 144, 0.15);
		padding: 12px 16px;
		border-radius: 6px;
		color: rgba(53, 36, 144, 0.75);
		font-size: 13px;
		font-weight: 500;
		margin-bottom: 15px;
	}

	.header {
		background: linear-gradient(90.68deg, #352490 0%, #4c3ce2 100%);
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;

		.logo {
			margin-left: 10px;
			height: 33px;
		}
		
		.hostname-pill {
			background: rgba(255, 255, 255, 0.2);
			color: #fff;
			padding: 5px 12px;
			border-radius: 15px;
			font-size: 11px;
			font-family: monospace;
			margin-left: 10px;
			margin-right: 10px;
			white-space: nowrap;
			flex: 1;
		}
		
		.buttons {
			display: flex;
			align-items: center;
			flex-shrink: 0;

			div {
				padding: 0px 10px;
				cursor: pointer;
			}

			.save {
				visibility: hidden;
				
				&.visible {
					visibility: visible;
					animation: pulse-save 1.5s infinite;
				}

				svg {
					color: #e11f82;
					width: 27px;
					height: 27px;
				}

				@keyframes pulse-save {
					0% {
						transform: scale(0.83);
					}

					50% {
						transform: scale(1);
					}

					100% {
						transform: scale(0.83);
					}
				}
			}

			.toggle {
				position: relative;
				&.on {
					svg {
						transform: rotate(180deg);
					}
				}
				
				&.disabled {
					opacity: 0.4;
					cursor: default;
					
					svg {
						color: #999;
					}
				}
				
				&.loading {
					opacity: 0.3;
					cursor: default;
				}

				.on {
					background: #23b5d9;
					position: absolute;
					left: 12px;
					top: 7px;
					border-radius: 10px;
					z-index: 1;
					width: 32px;
					height: 22px;
					display: block;
				}

				svg {
					color: #fff;
					position: relative;
					z-index: 2;
					width: 36px;
					height: 36px;
				}
				.text {
					padding: 10px;
				}
			}

			.settings {
				position: relative;

				.open {
					background: #e11f82;
					position: absolute;
					left: 18px;
					top: 9px;
					border-radius: 50%;
					z-index: 1;
					width: 9px;
					height: 9px;
					display: block;
				}

				svg {
					color: #fff;
					position: relative;
					z-index: 2;
					transition: all 0.3s ease-in-out;
					width: 25px;
					height: 25px;
				}

				&.open {
					svg {
						color: #352490;
						transform: rotate(30deg);
					}
				}
			}
		}
	}

	.option {
		margin-bottom: 5px;
		margin-top: 5px;

		&:not(:first-child) {
			margin-top: 20px;
		}

		h3 {
			margin: 0 0 5px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.reset {
				margin-left: 10px;
				cursor: pointer;
				color: #e11f82;
				height: 12px;
				width: 12px;
			}
		}

		.description {
			text-align: justify;
			margin-bottom: 10px;

			h4 {
				padding: 0;
				margin: 0;
			}
		}
		
		input[type='text'] {
			width: 100%;
		}
	}

	.page-settings {
		padding: 10px;

		.option.footer {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			margin-top: 10px;
			margin-bottom: 0;
			.version {
				font-size: 12px;
				font-weight: bold;
			}
			.github {
				margin-left: 5px;
				height: 14px;
				width: 14px;
			}
		}

		.option.injection {
			.injection {
				display: inline-flex;
				align-items: center;
				cursor: pointer;
			}
		}

		.option.reset {
			.reset-extension {
				background: #e11e81;
				color: white;
				&:hover {
					background: #ad1763;
				}
			}
		}

		.option.clear-all {
			.title-with-icon {
				display: flex;
				align-items: center;
				gap: 8px;
			}
			
			.view-storage {
				cursor: pointer;
				font-size: 14px;
				color: #666;
				transition: color 0.2s;
				
				&:hover {
					color: #333;
				}
				
				&.active {
					color: #e11f82;
				}
			}
			
			.clear-all-button {
				background: #d84c31;
				color: white;
				&:hover {
					background: #a83a24;
				}
			}
			
			.storage-viewer {
				margin-top: 10px;
				
				textarea {
					width: 100%;
					font-family: 'Courier New', monospace;
					font-size: 11px;
					border: 1px solid #ddd;
					border-radius: 4px;
					padding: 8px;
					resize: vertical;
					background: #f9f9f9;
					max-height: 300px;
					overflow-y: auto;
				}
			}
		}
	}

	.page-config {
		position: relative;
		background: #fff;
		padding: 10px;

		&.disabled {
			filter: blur(1.5px);
			pointer-events: none;
			z-index: 1;
		}

		.overlay {
			background: #d4cfff;
			opacity: 0.5;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			z-index: 3;

			svg {
				display: none;
				transform: rotate(90deg);
				color: #e11f82;
				opacity: 0.2;
				height: 120px;
				width: 120px;
			}
		}

		.option.url {
			.url-actions {
				display: inline-flex;
				align-items: center;
				gap: 5px;
			}
			
			button {
				margin-left: 0;
				&.url-cdn {
					background-color: #d84c31;
				}
				&.url-local {
					background-color: #1d6ca1;
				}
			}
			
			.reset-placeholder {
				display: inline-block;
				width: 12px;
				margin-left: 10px;
			}
		}

		.option.context {
			.context-merge {
				display: inline-flex;
				align-items: center;
				cursor: pointer;
			}
		}
	}
}
</style>

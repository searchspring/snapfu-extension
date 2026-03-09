<template>
	<div class="snapfu">
		<PopupHeader
			:currentHostname="state.currentHostname"
			:hasChanges="detectChanges()"
			:enabled="state.enabled"
			:settingsOpen="state.settings.show"
			:integrationLoading="state.integration.loading"
			@save="saveConfig"
			@toggleOnOff="toggleOnOff"
			@toggleSettings="toggleAppSettings"
		/>

		<div class="content-container" :class="{ 'settings-active': state.settings.show }">
			<PopupConfig
				:currentHostname="state.currentHostname"
				:hostnameConfig="state.hostnameConfig"
				:savedHostnameConfig="state.savedHostnameConfig"
				:integrationDetails="state.integration.details"
				:integrationLoading="state.integration.loading"
				:integrationCollapsed="state.hostnameConfig.integrationCollapsed"
				:enabled="state.enabled"
				@reset="reset"
				@set="set"
				@update:hostnameConfig="(value: HostnameConfig) => state.hostnameConfig = value"
				@toggleIntegrationCollapsed="toggleIntegrationCollapsed"
				@reloadTab="reloadCurrentTab"
			/>
			<PopupSettings
				v-show="state?.settings.show"
				:version="props.version"
				:currentHostname="state.currentHostname"
				:hostnameConfig="state.hostnameConfig"
				:savedHostnameConfig="state.savedHostnameConfig"
				:autoEnable="state.config.autoEnable ?? false"
				@reset="reset"
				@resetAppConfig="resetAppConfig"
				@clearAllStorage="clearAllStorage"
				@update:hostnameConfig="(value: HostnameConfig) => state.hostnameConfig = value"
				@toggleAutoEnable="toggleAutoEnable"
				ref="settingsRef"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, onMounted, defineProps, ref } from 'vue';
import { StoredData, HostnameConfig, LocalData, HostnameConfigValue, ControllerInfo } from '../types/storage';
import PopupHeader from './popup/popup-header.vue';
import PopupSettings from './popup/popup-settings.vue';
import PopupConfig from './popup/popup-config.vue';

import {
	defaultHostnameConfig,
	getConfig,
	setConfig,
	deepCompare,
	getHostnameConfig,
	setHostnameConfig,
	getTabEnabled,
	setTabEnabled,
	safeReloadTab,
} from '../utilities/utilities';

const props = defineProps<{
	version: string;
}>();

let ignoringStorageUpdates = false;

const settingsRef = ref<InstanceType<typeof PopupSettings> | null>(null);

const state = reactive({
	settings: {
		show: false,
	},
	integration: {
		details: {} as LocalData,
		loading: true,
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
	// Get tab info once and derive everything from it
	let tab;
	try {
		[tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	} catch {
		// Can't get tab info
		return;
	}

	const tabId = tab.id || null;
	const url = tab.url || '';
	const isHttpUrl = url.startsWith('http://') || url.startsWith('https://');

	// Extract hostname from URL directly instead of using getCurrentHostname
	let hostname: string | null = null;
	try {
		const urlObj = new URL(url);
		hostname = urlObj.hostname;
	} catch {
		// Invalid URL
	}

	const validHostname = isHttpUrl ? hostname : null;
	state.currentHostname = validHostname;
	state.currentTabId = tabId;

	// Fetch data sequentially (parallel loading causes rendering issues)
	const config = await getConfig();
	state.config = config;
	state.savedConfig = JSON.parse(JSON.stringify(config));

	// Get hostname config
	const hostnameConfig = validHostname ? await getHostnameConfig(validHostname) : JSON.parse(JSON.stringify(defaultHostnameConfig));
	state.hostnameConfig = hostnameConfig;
	state.savedHostnameConfig = JSON.parse(JSON.stringify(hostnameConfig));

	// Get enabled state
	const enabled = tabId ? await getTabEnabled(tabId) : false;
	state.enabled = enabled;

	// Set integration details if available
	if (tabId) {
		const localData = await chrome.storage.local.get(String(tabId));
		const existingData = (localData as any)[tabId];
		if (existingData?.timestamp) {
			// We have existing data, use it and don't show loading
			state.integration.details = existingData;
			state.integration.loading = false;
		} else {
			// No existing data - show loading only for http/https URLs
			state.integration.loading = isHttpUrl;
		}
	}

	// Add onChange storage listener
	try {
		chrome.storage.onChanged.addListener(async (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
			if (ignoringStorageUpdates) return; // Skip updates during toggle operation

			if (tabId && area === 'local') {
				try {
					const storedLocalData = await chrome.storage.local.get();
					const newData = storedLocalData[tabId];

					// Update enabled state if it changed
					if (changes[tabId]?.newValue?.enabled !== undefined) {
						state.enabled = changes[tabId].newValue.enabled;
					}

					// Whenever we get data with a timestamp, exit loading state
					// This includes: successful integration found, error occurred, or "not found" after timeout
					if (newData?.timestamp) {
						// Preserve collapsed state of controllers and config sections
						if (state.integration.details?.controllers && newData.controllers) {
							newData.controllers.forEach((newController: ControllerInfo, index: number) => {
								const existingController = state.integration.details.controllers?.[index];
								if (existingController && existingController.id === newController.id) {
									newController.collapsed = existingController.collapsed;

									// Preserve config collapsed states
									if (existingController.config?.globals && newController.config?.globals) {
										newController.config.globals.collapsed = existingController.config.globals.collapsed;
									}
									if (existingController.config?.settings && newController.config?.settings) {
										newController.config.settings.collapsed = existingController.config.settings.collapsed;
									}
								}
							});
						}
						state.integration.details = newData;
						state.integration.loading = false; // Always exit loading when we get a result
					}
				} catch (error) {
					// Silently catching invalidated extension context
				}
			}
		});
	} catch (error) {
		// Silently catching invalidated extension context
	}
});

async function saveConfig() {
	// Check if bundle URL, context, merge context, or injection target changed
	const bundleUrlChanged = state.hostnameConfig.bundle.url !== state.savedHostnameConfig.bundle.url;
	const contextChanged = state.hostnameConfig.bundle.context !== state.savedHostnameConfig.bundle.context;
	const mergeContextChanged = state.hostnameConfig.bundle.mergeContext !== state.savedHostnameConfig.bundle.mergeContext;
	const injectionTargetChanged = state.hostnameConfig.bundle.injectionTarget !== state.savedHostnameConfig.bundle.injectionTarget;

	// Check if intercepts changed (requires reload to update declarativeNetRequest rules)
	const interceptsChanged = state.hostnameConfig.intercepts !== state.savedHostnameConfig.intercepts;

	const needsReload =
		(bundleUrlChanged || contextChanged || mergeContextChanged || injectionTargetChanged || interceptsChanged) && state.enabled && state.currentTabId;

	// Prepare for reload before saving changes
	if (needsReload) {
		await prepareForReload();
	}

	// Save global config (which now just stores hostname configs)
	setConfig(state.config);
	state.savedConfig = JSON.parse(JSON.stringify(state.config));

	// Save hostname config
	if (state.currentHostname) {
		setHostnameConfig(state.currentHostname, state.hostnameConfig);
		state.savedHostnameConfig = JSON.parse(JSON.stringify(state.hostnameConfig));
	}

	// Reload page if bundle settings or intercepts changed and extension is enabled
	if (needsReload && state.currentTabId) {
		await safeReloadTab(state.currentTabId);
	}
}

function detectChanges() {
	try {
		const savedClone = JSON.parse(JSON.stringify(state.savedHostnameConfig));
		const currentClone = JSON.parse(JSON.stringify(state.hostnameConfig));
		return !deepCompare(savedClone, currentClone);
	} catch (e) {
		return false;
	}
}

function reset(configPath: string, location = 'default') {
	const paths = configPath.split('.').filter((p) => p);
	const configLocation = location == 'saved' ? state.savedHostnameConfig : defaultHostnameConfig;

	const savedValue: HostnameConfigValue | undefined = paths.reduce<HostnameConfigValue | undefined>((configuration, path: string) => {
		if (configuration && typeof configuration === 'object' && configuration !== null && path in configuration) {
			return (configuration as Record<string, HostnameConfigValue>)[path];
		}
		return undefined;
	}, configLocation);

	if (typeof savedValue != 'undefined') {
		paths.reduce<HostnameConfigValue | undefined>((configuration, path: string, index) => {
			if (configuration && typeof configuration === 'object' && configuration !== null) {
				const config = configuration as Record<string, HostnameConfigValue>;
				if (index == paths.length - 1) {
					config[path] = JSON.parse(JSON.stringify(savedValue));
				} else {
					return config[path];
				}
			}
			return configuration;
		}, state.hostnameConfig);
	}
}

function set(configPath: string, value: HostnameConfigValue | undefined) {
	const paths = configPath.split('.').filter((p) => p);

	paths.reduce<HostnameConfigValue | undefined>((configuration, path: string, index) => {
		if (configuration && typeof configuration === 'object' && configuration !== null) {
			const config = configuration as Record<string, HostnameConfigValue>;
			if (index == paths.length - 1) {
				config[path] = JSON.parse(JSON.stringify(value));
			} else {
				return config[path];
			}
		}
		return configuration;
	}, state.hostnameConfig);
}

/**
 * Prepares the popup state for a page reload by entering loading state
 * and preventing storage update interference. Call this before reloading
 * the tab when extension settings change.
 */
async function prepareForReload() {
	// Ignore storage updates during reload to prevent interference
	ignoringStorageUpdates = true;

	// Clear existing data and enter loading state
	state.integration.details = {};
	state.integration.loading = true;

	// Re-enable storage updates after reload completes
	// Use a timeout to allow the page to start reloading
	setTimeout(() => {
		ignoringStorageUpdates = false;
	}, 500);
}

async function toggleOnOff() {
	if (!state.currentTabId || !state.currentHostname) return;
	if (state.enabled === null) return; // Not loaded yet

	const newEnabled = !state.enabled;

	// Close settings if open
	if (state.settings.show) {
		state.settings.show = false;
		if (settingsRef.value) {
			settingsRef.value.resetConfirmations();
		}
	}

	// Prepare for reload
	await prepareForReload();

	// Update enabled state
	state.enabled = newEnabled;
	await setTabEnabled(state.currentTabId, newEnabled);

	// When enabling, ensure hostname config exists
	if (newEnabled) {
		await setHostnameConfig(state.currentHostname, state.hostnameConfig);
		state.savedHostnameConfig = JSON.parse(JSON.stringify(state.hostnameConfig));

		// Wait for storage changes to propagate and intercepts to be updated
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	// Reload the page
	if (state.currentTabId) {
		await safeReloadTab(state.currentTabId);
	}
}

function toggleAppSettings() {
	state.settings.show = !state.settings.show;
	if (!state.settings.show && settingsRef.value) {
		settingsRef.value.resetConfirmations();
	}
}

async function toggleIntegrationCollapsed() {
	// Toggle the collapsed state
	state.hostnameConfig.integrationCollapsed = !state.hostnameConfig.integrationCollapsed;

	// Update saved state immediately to prevent flash of unsaved changes indicator
	state.savedHostnameConfig.integrationCollapsed = state.hostnameConfig.integrationCollapsed;

	// Auto-save this preference without triggering a reload
	if (state.currentHostname) {
		await setHostnameConfig(state.currentHostname, state.hostnameConfig);
	}
}

async function reloadCurrentTab() {
	if (state.currentTabId) {
		await prepareForReload();
		await safeReloadTab(state.currentTabId);
	}
}

// Auto-saves — no page reload required
async function toggleAutoEnable() {
	state.config.autoEnable = !(state.config.autoEnable ?? false);
	await setConfig(state.config);
}

async function resetAppConfig() {
	// Prepare for reload before making changes
	if (state.enabled && state.currentTabId) {
		await prepareForReload();
	}

	// Reset the current hostname's config to defaults
	if (state.currentHostname) {
		state.hostnameConfig = JSON.parse(JSON.stringify(defaultHostnameConfig));
		state.savedHostnameConfig = JSON.parse(JSON.stringify(defaultHostnameConfig));
		setHostnameConfig(state.currentHostname, state.hostnameConfig);
	}

	// Reload the current tab to apply changes (only if extension is enabled)
	if (state.enabled && state.currentTabId) {
		await safeReloadTab(state.currentTabId);
	}
}

async function clearAllStorage() {
	try {
		// Only prepare for reload if we have a valid tab with hostname
		if (state.currentTabId && state.currentHostname) {
			await prepareForReload();
		}

		// Clear all sync storage (hostname configs)
		await chrome.storage.sync.clear();

		// Clear all local storage (per-tab enabled states and integration details)
		await chrome.storage.local.clear();

		// Clear all session rules (intercepts and CSP rules)
		const sessionRules = await chrome.declarativeNetRequest.getSessionRules();
		const ruleIds = sessionRules.map((rule) => rule.id);
		if (ruleIds.length > 0) {
			await chrome.declarativeNetRequest.updateSessionRules({
				removeRuleIds: ruleIds,
				addRules: [],
			});
		}

		// Reset popup state to defaults
		state.config = { hostnameConfigs: {} };
		state.savedConfig = { hostnameConfigs: {} };
		state.hostnameConfig = JSON.parse(JSON.stringify(defaultHostnameConfig));
		state.savedHostnameConfig = JSON.parse(JSON.stringify(defaultHostnameConfig));
		state.enabled = false;
		state.integration.loading = false;

		state.settings.show = false;

		// Reload the current tab to apply changes (only if we have a valid hostname)
		if (state.currentTabId && state.currentHostname) {
			await safeReloadTab(state.currentTabId);
		}
	} catch (error) {
		// Silently catching errors
	}
}
</script>

<style lang="scss">
html,
body {
	margin: 0;
	padding: 0;
	overflow: hidden;
	width: fit-content;
	height: fit-content;
	max-height: 600px;
	overscroll-behavior: none;
}

#app {
	width: fit-content;
	height: fit-content;
	max-height: 600px;
}

.snapfu {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	margin: 0;
	padding: 0;
	min-width: 420px;
	width: fit-content;
	height: fit-content;
	max-height: 600px;
	border: 1px solid #2c3e50;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	a {
		color: #00aeef;
	}

	button {
		cursor: pointer;
		background: #1d4990;
		color: #fff;
		border-radius: 4px;
		border: none;
		padding: 5px 10px;
		font-size: 10px;
		font-weight: 600;
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-1px);
		}

		&:active {
			transform: translateY(0);
		}
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
		border: 1px solid #ddd;
		box-sizing: border-box;
		outline: none;
	}

	input[type='text'] {
		font-family: monospace;
		font-size: 10px;
		padding: 5px;
		border-radius: 3px;
		border: 1px solid #ddd;
		box-sizing: border-box;
		outline: none;
	}

	.content-container {
		position: relative;
		overflow-y: auto;
		overflow-x: hidden;
		flex: 1;
		min-height: 0;
		// Config panel (light): dark scrollbar
		scrollbar-width: thin;
		scrollbar-color: rgba(29, 73, 144, 0.25) transparent;

		&::-webkit-scrollbar {
			width: 5px;
		}

		&::-webkit-scrollbar-track {
			background: rgba(29, 73, 144, 0.06);
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(29, 73, 144, 0.25);

			&:hover {
				background: rgba(29, 73, 144, 0.45);
			}
		}

		// Settings panel (dark): light scrollbar
		&.settings-active {
			scrollbar-color: rgba(255, 255, 255, 0.15) transparent;

			&::-webkit-scrollbar-track {
				background: rgba(255, 255, 255, 0.05);
			}

			&::-webkit-scrollbar-thumb {
				background: rgba(255, 255, 255, 0.15);

				&:hover {
					background: rgba(255, 255, 255, 0.28);
				}
			}
		}

		.page-config-wrapper,
		.page-settings {
			width: 100%;
			box-sizing: border-box;
		}

		&.settings-active {
			.page-config-wrapper {
				display: none !important;
			}
		}

		&:not(.settings-active) {
			.page-settings {
				display: none !important;
			}
		}
	}
}
</style>

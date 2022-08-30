<template>
	<div class="snapfu">
		<div class="header">
			<img class="logo" src="../assets/searchspring.svg" />
			<div class="buttons">
				<div v-if="detectChanges()" class="button save" @click="saveConfig">
					<font-awesome-icon icon="save" />
				</div>

				<div class="button toggle" :class="{ on: state?.config?.settings?.enabled }" @click="toggleOnOff">
					<span v-if="state?.config?.settings?.enabled" class="on"></span>
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
						v-if="detectChanges('settings.intercepts', 'default')"
						class="reset"
						@click="reset('settings.intercepts')"
						icon="undo"
						title="reset intercepts"
					/>
				</h3>
				<div class="description">Intercepts are used for blocking network requests. This helps prevent multiple bundles from loading.</div>

				<textarea
					placeholder="intercepts should be here..."
					required="true"
					spellcheck="false"
					v-model="state.config.settings.intercepts"
					:rows="state.config.settings.intercepts.split('\n').length"
				/>
			</div>

			<div class="option reset" v-if="detectChanges('', 'default')">
				<h3>
					Restore Defaults
					<button class="reset-extension" @click="resetAppConfig">
						{{ state.settings.confirmReset ? 'confirm' : 'reset' }}
					</button>
				</h3>
				<div class="description">Set the extension settings back to initial values.</div>
			</div>

			<div class="option footer">
				<span class="version">(beta) v{{ props.version }}</span>
				<a href="https://github.com/searchspring/snapfu-extension" target="_blank"><img class="github" src="../assets/github.svg" /></a>
			</div>
		</div>

		<div v-if="!state?.settings.show && state.config?.bundle" class="page-config">
			<div class="option integration">
				<h3 @click="() => (state.integration.collapsed = !state.integration.collapsed)" v-if="!state.integration.loading">
					<span
						>Integration <span v-if="state.integration.details.version" class="snap-version">v{{ state.integration.details.version }}</span></span
					>
					<font-awesome-icon class="header-icon collapse-icon" :icon="state.integration.collapsed ? 'angle-down' : 'angle-up'" />
				</h3>

				<div v-if="state.integration.loading">loading...</div>

				<div v-if="!state.integration.loading && state.integration.details.version && !state.integration.collapsed">
					<div class="description controllers">
						<h4>
							Controllers <span v-if="state.integration.details.controllers?.length">({{ state.integration.details.controllers?.length }})</span>
						</h4>
						<div
							:key="key"
							v-for="(controller, key) in state.integration.details.controllers"
							@click="() => (controller.collapsed = !controller.collapsed)"
						>
							<Controller :controller="controller" />
						</div>
					</div>
				</div>

				<div v-if="state.integration.loading === false && !state.integration.details.version && !state.integration.collapsed" class="description">
					No Snap integration found.
				</div>
			</div>

			<div v-if="state?.config?.settings?.enabled" class="option url">
				<h3>
					Bundle URL
					<span>
						<button class="url-cdn" @click="set('bundle.url', 'https://snapui.searchspring.io/siteid/branch/bundle.js')">cdn</button>
						<button class="url-local" @click="set('bundle.url', 'https://localhost:3333/bundle.js')">local</button>
					</span>
				</h3>

				<div class="description">URL of bundle to inject onto the page.<br /></div>

				<input v-model="state.config.bundle.url" type="text" />
			</div>

			<div v-if="state?.config?.settings?.enabled" class="option context">
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
					v-model="state.config.bundle.context"
					:rows="state.config.bundle.context.split('\n').length"
				/>
				<label class="context-merge">
					<span>Merge context: </span>
					<input v-model="state.config.bundle.mergeContext" type="checkbox" />
				</label>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, onMounted, defineProps } from 'vue';
import { StoredData, LocalData } from '../types/storage';
import Controller from './controller.vue';

import { defaultConfig, getConfig, setConfig, resetConfig, deepCompare, getCurrentTabId } from '../utilities/utilities';

const props = defineProps({
	version: String,
});

const state = reactive({
	settings: {
		show: false,
		confirmReset: false,
	},
	integration: {
		details: {} as LocalData,
		loading: true,
		collapsed: false,
	},
	config: {} as StoredData,
	savedConfig: {} as StoredData,
});

onMounted(async () => {
	const config = await getConfig();
	state.config = config;
	state.savedConfig = JSON.parse(JSON.stringify(config));

	// get currentTabId
	const tabId = await getCurrentTabId();

	const storedLocalData = await chrome.storage.local.get();
	if (tabId) {
		state.integration.details = storedLocalData[tabId];
		if (state.integration.details?.timestamp) {
			state.integration.loading = false;
		}
	}

	// add onChange storage listener
	chrome.storage.onChanged.addListener(async (changes, area) => {
		if (tabId && area === 'local') {
			const storedLocalData = await chrome.storage.local.get();
			state.integration.details = storedLocalData[tabId];
			if (state.integration.details?.timestamp) {
				state.integration.loading = false;
			} else {
				state.integration.loading = true;
				state.integration.details = {};
			}
		}
	});
});

function saveConfig() {
	setConfig(state.config);
	state.savedConfig = JSON.parse(JSON.stringify(state.config));
}

function detectChanges(configPath = '', location = 'saved') {
	const paths = configPath.split('.');
	const configLocation = location == 'saved' ? state.savedConfig : defaultConfig;

	const savedValue = configPath
		? paths.reduce((configuration: any, path: string) => {
				if (configuration[path as keyof StoredData]) {
					return configuration[path as keyof StoredData];
				}
		  }, configLocation)
		: configLocation;

	const value = configPath
		? paths.reduce((configuration: any, path: string) => {
				if (configuration[path as keyof StoredData]) {
					return configuration[path as keyof StoredData];
				}
		  }, state.config)
		: state.config;

	if (typeof savedValue != 'undefined') {
		// determine if something changed
		try {
			// clones config to avoid mutation
			const savedValueClone = JSON.parse(JSON.stringify(savedValue));
			const valueClone = JSON.parse(JSON.stringify(value || {}));

			if (!configPath) {
				// ignore on/off state
				delete savedValueClone.settings.enabled;
				delete valueClone.settings.enabled;
			}

			return !deepCompare(savedValueClone, valueClone);
		} catch (e) {
			// initial state
			return false;
		}
	}

	return false;
}

function reset(configPath: string, location = 'default') {
	const paths = configPath.split('.');
	const configLocation = location == 'saved' ? state.savedConfig : defaultConfig;

	const savedValue = paths.reduce((configuration: any, path: string) => {
		if (configuration[path as keyof StoredData]) {
			return configuration[path as keyof StoredData];
		}
	}, configLocation);

	if (typeof savedValue != 'undefined') {
		paths.reduce((configuration: any, path: string, index) => {
			if (index == paths.length - 1) {
				configuration[path as keyof StoredData] = JSON.parse(JSON.stringify(savedValue));
			} else {
				return configuration[path as keyof StoredData];
			}
		}, state.config);
	}
}

function set(configPath: string, value: any) {
	const paths = configPath.split('.');

	paths.reduce((configuration: any, path: string, index) => {
		if (index == paths.length - 1) {
			configuration[path as keyof StoredData] = JSON.parse(JSON.stringify(value));
		} else {
			return configuration[path as keyof StoredData];
		}
	}, state.config);
}

function toggleOnOff() {
	const currentStatus = state.config.settings.enabled;
	state.config = JSON.parse(JSON.stringify(state.savedConfig));
	state.config.settings.enabled = !currentStatus;
	saveConfig();
}

function toggleAppSettings() {
	state.settings.show = !state.settings.show;
	if (!state.settings.show) {
		state.settings.confirmReset = false;
	}
}

async function resetAppConfig() {
	if (!state.settings.confirmReset) {
		state.settings.confirmReset = true;
	} else {
		resetConfig();

		// reload state
		state.config = await getConfig();
		state.savedConfig = JSON.parse(JSON.stringify(state.config));
		state.settings.confirmReset = false;
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

	.integration {
		.snap-version {
			font-weight: normal;
		}

		h3 {
			cursor: pointer;
		}

		.header-icon.collapse-icon {
			padding-right: 9px;
		}
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
		.buttons {
			display: flex;
			align-items: center;

			div {
				padding: 0px 10px;
				cursor: pointer;
			}

			.save {
				animation: pulse-save 1.5s infinite;

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
			margin-top: 30px;
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

		.option.reset {
			.reset-extension {
				background: #e11e81;
				color: white;
				&:hover {
					background: #ad1763;
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
			button {
				margin-left: 5px;
				&.url-cdn {
					background-color: #d84c31;
				}
				&.url-local {
					background-color: #1d6ca1;
				}
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

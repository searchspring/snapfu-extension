<template>
	<div class="page-settings">
		<div v-if="currentHostname" class="option intercepts">
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
			<div class="description">Intercepts are used for blocking network requests, primarily to prevent multiple bundles from loading.</div>

			<div class="textarea-wrapper">
				<textarea
					placeholder="intercepts should be here..."
					required="true"
					spellcheck="false"
					:value="props.hostnameConfig.intercepts"
					@input="updateIntercepts"
					:rows="(props.hostnameConfig.intercepts || '').split('\n').length"
				/>
				<span class="resize-handle" />
			</div>
		</div>

		<div v-if="currentHostname" class="option injection-target">
			<h3>
				Injection Target
				<font-awesome-icon
					v-if="detectChanges('bundle.injectionTarget', 'default')"
					class="reset"
					@click="reset('bundle.injectionTarget')"
					icon="undo"
					title="reset injection target"
				/>
			</h3>

			<div class="description">CSS selector for script injection location. Leave empty for default (document root).</div>

			<input
				:value="props.hostnameConfig.bundle.injectionTarget"
				@input="updateInjectionTarget"
				type="text"
				placeholder="e.g., body, iframe >>> head, iframe.outer >>> iframe.inner >>> body"
			/>

			<div class="description">
				<br />
				For iframes, use <code>&gt;&gt;&gt;</code> to traverse: <code>iframe.my-frame &gt;&gt;&gt; div.target</code><br />
				For nested iframes: <code>iframe.outer &gt;&gt;&gt; iframe.inner &gt;&gt;&gt; div.target</code>
			</div>
		</div>

		<div class="option auto-enable">
			<h3>
				Sync Active State
				<button
					class="toggle-switch"
					:class="{ on: props.autoEnable }"
					:title="props.autoEnable ? 'Disable sync active state' : 'Enable sync active state'"
					@click="emit('toggleAutoEnable')"
				>
					<span class="toggle-thumb" />
				</button>
			</h3>
			<div class="description">New tabs on a configured hostname will start enabled if any other tab on that hostname is already active.</div>
		</div>

		<div v-if="currentHostname" class="option reset" v-show="savedConfigDiffersFromDefaults()">
			<h3>
				Reset Site
				<button class="reset-extension" @click="handleResetAppConfig">
					{{ confirmReset ? 'confirm' : 'reset' }}
				</button>
			</h3>
			<div class="description">Reset settings for the current site back to initial values.</div>
		</div>

		<div class="option clear-all">
			<h3>
				<span class="title-with-icon">
					Reset All
					<font-awesome-icon
						class="view-storage"
						:class="{ active: showStorage }"
						@click="toggleViewStorage"
						icon="circle-info"
						title="view storage contents"
					/>
				</span>
				<button class="clear-all-button" @click="handleClearAllStorage">
					{{ confirmClearAll ? 'confirm' : 'reset all' }}
				</button>
			</h3>
			<div class="description">
				Reset the extension to factory defaults.<br />Clears all settings, per-tab states, and active rules across all hostnames.
			</div>

			<div v-if="showStorage" class="storage-viewer">
				<textarea readonly spellcheck="false" :value="storageContent" rows="10" />
			</div>
		</div>

		<div class="option footer">
			<span class="version">v{{ version }}</span>
			<a href="https://github.com/searchspring/snapfu-extension" target="_blank"><img class="github" src="../../assets/github.svg" /></a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, defineExpose } from 'vue';
import { HostnameConfig, HostnameConfigValue } from '../../types/storage';
import { defaultHostnameConfig, deepCompare } from '../../utilities/utilities';

const props = defineProps<{
	version: string;
	currentHostname: string | null;
	hostnameConfig: HostnameConfig;
	savedHostnameConfig: HostnameConfig;
	autoEnable: boolean;
}>();

const emit = defineEmits<{
	(e: 'reset', configPath: string, location?: string): void;
	(e: 'resetAppConfig'): void;
	(e: 'clearAllStorage'): void;
	(e: 'update:hostnameConfig', value: HostnameConfig): void;
	(e: 'toggleAutoEnable'): void;
}>();

const confirmReset = ref(false);
const confirmClearAll = ref(false);
const showStorage = ref(false);
const storageContent = ref('');

// Update functions for two-way binding
function updateIntercepts(event: Event) {
	const target = event.target as HTMLTextAreaElement;
	const updated = { ...props.hostnameConfig, intercepts: target.value };
	emit('update:hostnameConfig', updated);
}

function updateInjectionTarget(event: Event) {
	const target = event.target as HTMLInputElement;
	const updated = {
		...props.hostnameConfig,
		bundle: { ...props.hostnameConfig.bundle, injectionTarget: target.value },
	};
	emit('update:hostnameConfig', updated);
}

function detectChanges(configPath = '', location = 'saved') {
	const paths = configPath.split('.').filter((p) => p);

	const configLocation = location == 'saved' ? props.savedHostnameConfig : defaultHostnameConfig;
	const savedValue: HostnameConfigValue | undefined =
		configPath && paths.length > 0
			? paths.reduce<HostnameConfigValue | undefined>((configuration, path: string) => {
					if (configuration && typeof configuration === 'object' && configuration !== null && path in configuration) {
						return (configuration as Record<string, HostnameConfigValue>)[path];
					}
					return undefined;
			  }, configLocation)
			: configLocation;

	const value: HostnameConfigValue | undefined =
		configPath && paths.length > 0
			? paths.reduce<HostnameConfigValue | undefined>((configuration, path: string) => {
					if (configuration && typeof configuration === 'object' && configuration !== null && path in configuration) {
						return (configuration as Record<string, HostnameConfigValue>)[path];
					}
					return undefined;
			  }, props.hostnameConfig)
			: props.hostnameConfig;

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
		const savedClone = JSON.parse(JSON.stringify(props.savedHostnameConfig));
		const defaultClone = JSON.parse(JSON.stringify(defaultHostnameConfig));
		return !deepCompare(savedClone, defaultClone);
	} catch (e) {
		return false;
	}
}

function reset(configPath: string, location = 'default') {
	emit('reset', configPath, location);
}

function handleResetAppConfig() {
	if (!confirmReset.value) {
		confirmReset.value = true;
	} else {
		emit('resetAppConfig');
		confirmReset.value = false;
	}
}

function handleClearAllStorage() {
	if (!confirmClearAll.value) {
		confirmClearAll.value = true;
	} else {
		emit('clearAllStorage');
		confirmClearAll.value = false;
	}
}

async function toggleViewStorage() {
	showStorage.value = !showStorage.value;

	if (showStorage.value) {
		try {
			const syncData = await chrome.storage.sync.get();
			const hostnameConfigs = syncData.hostnameConfigs || {};
			storageContent.value = JSON.stringify(hostnameConfigs, null, 2);
		} catch (error) {
			storageContent.value = 'Error retrieving storage: ' + error;
		}
	}
}

// Reset confirmations when component is hidden
defineExpose({
	resetConfirmations: () => {
		confirmReset.value = false;
		confirmClearAll.value = false;
		showStorage.value = false;
	},
});
</script>

<style lang="scss" scoped>
.page-settings {
	padding: 10px;
	background: linear-gradient(135deg, #151e29 0%, #0b1929 100%);
	color: #e8eef3;
	z-index: 10;

	.option {
		margin-bottom: 5px;
		padding: 12px;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 6px;
		border: 1px solid rgba(255, 255, 255, 0.08);

		&:not(:first-child) {
			margin-top: 15px;
		}

		h3 {
			margin: 0 0 8px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #ffffff;
			font-size: 14px;

			.reset {
				cursor: pointer;
				color: #e7743d;
				height: 12px;
				width: 12px;
				transition: all 0.2s ease;

				&:hover {
					transform: translateY(-1px);
					filter: drop-shadow(0 2px 4px rgba(231, 116, 60, 0.5));
				}
			}
		}

		.description {
			text-align: justify;
			margin-bottom: 5px;
			color: #b0bcc9;
			max-width: 85%;

			code {
				background: rgba(0, 174, 239, 0.15);
				color: #5ed1b3;
				padding: 2px 4px;
				border-radius: 3px;
			}

			h4 {
				padding: 0;
				margin: 0;
				color: #e8eef3;
			}
		}

		input[type='text'] {
			width: 100%;
			background: rgba(0, 0, 0, 0.2);
			color: #e8eef3;
			border: 1px solid rgba(255, 255, 255, 0.1);

			&::placeholder {
				color: #6b7c8f;
			}

			&:focus {
				border-color: #5ed1b3;
				background: rgba(0, 0, 0, 0.25);
				outline: none;
			}
		}

		textarea {
			background: rgba(0, 0, 0, 0.2);
			color: #e8eef3;
			border: 1px solid rgba(255, 255, 255, 0.1);

			&::placeholder {
				color: #6b7c8f;
			}

			&:focus {
				border-color: #5ed1b3;
				background: rgba(0, 0, 0, 0.25);
				outline: none;
			}
		}
	}

	.option.footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top: 20px;
		margin-bottom: 0;
		background: transparent;
		border: none;
		padding: 8px;
		.version {
			font-size: 12px;
			font-weight: bold;
			color: #888;
		}
		.github {
			margin-left: 5px;
			height: 14px;
			width: 14px;
			filter: brightness(0) invert(1);
			opacity: 0.6;
			transition: all 0.2s ease;

			&:hover {
				transform: scale(1.1);
				opacity: 1;
			}
		}
	}

	.option.injection {
		.injection {
			display: inline-flex;
			align-items: center;
			cursor: pointer;
		}
	}

	.option.intercepts {
		.textarea-wrapper {
			position: relative;
			display: block;

			textarea {
				resize: vertical;
				min-height: 48px;
				overflow-y: auto;

				// Hide the browser's native resize grip
				&::-webkit-resizer {
					display: none;
				}
			}

			.resize-handle {
				position: absolute;
				bottom: 6px;
				right: 1px;
				width: 10px;
				height: 10px;
				pointer-events: none;
				opacity: 0.35;
				background: linear-gradient(135deg, transparent 54%, #5ed1b3 54%, #5ed1b3 66%, transparent 66%),
					linear-gradient(135deg, transparent 78%, #5ed1b3 78%, #5ed1b3 90%, transparent 90%);
				transition: opacity 0.2s ease;
			}
		}
	}

	.option.auto-enable {
		.toggle-switch {
			position: relative;
			display: inline-flex;
			align-items: center;
			width: 34px;
			height: 18px;
			background: rgba(255, 255, 255, 0.15);
			border: 1px solid rgba(255, 255, 255, 0.2);
			border-radius: 9px;
			padding: 0;
			cursor: pointer;
			transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
			flex-shrink: 0;

			&:hover {
				transform: scale(1.08);
				box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
			}

			&.on {
				background: #685c39;
				border-color: #ffc107;

				.toggle-thumb {
					background: #ffc107;
				}

				&:hover {
					transform: scale(1.08);
				}
			}

			.toggle-thumb {
				position: absolute;
				left: 2px;
				width: 12px;
				height: 12px;
				background: #aaa;
				border-radius: 50%;
				transition: transform 0.2s ease;
			}

			&.on .toggle-thumb {
				transform: translateX(16px);
			}
		}
	}

	.option.reset {
		.reset-extension {
			background: #1d4990;
			color: white;
			border: 1px solid rgba(37, 88, 176, 0.5);
			border-radius: 4px;
			padding: 5px 10px;
			font-size: 10px;
			font-weight: 600;
			transition: all 0.2s ease;

			&:hover {
				background: #2558b0;
				border-color: #4a7bc8;
				transform: translateY(-1px);
				box-shadow: 0 2px 4px rgba(74, 123, 200, 0.5);
			}

			&:active {
				transform: translateY(0);
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
			color: #6b7c8f;
			transition: color 0.2s, transform 0.2s;

			&:hover {
				color: #b0bcc9;
				transform: scale(1.1);
			}

			&.active {
				color: #5ed1b3;
			}
		}

		.clear-all-button {
			background: #d4556a;
			color: white;
			border: 1px solid rgba(242, 100, 124, 0.3);
			border-radius: 4px;
			padding: 5px 10px;
			font-size: 10px;
			font-weight: 600;
			transition: all 0.2s ease;

			&:hover {
				background: #f2647c;
				border-color: #f2647c;
				transform: translateY(-1px);
				box-shadow: 0 2px 4px rgba(242, 100, 124, 0.5);
			}

			&:active {
				transform: translateY(0);
			}
		}

		.storage-viewer {
			margin-top: 10px;

			textarea {
				width: 100%;
				font-family: 'Courier New', monospace;
				font-size: 11px;
				border: 1px solid rgba(255, 255, 255, 0.1);
				border-radius: 4px;
				padding: 8px;
				resize: vertical;
				background: rgba(0, 0, 0, 0.3);
				color: #e8eef3;
				max-height: 300px;
				overflow-y: auto;
			}
		}
	}
}
</style>

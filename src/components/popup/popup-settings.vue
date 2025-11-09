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
			<div class="description">Intercepts are used for blocking network requests. This helps prevent multiple bundles from loading.</div>

			<textarea
				placeholder="intercepts should be here..."
				required="true"
				spellcheck="false"
				:value="props.hostnameConfig.intercepts"
				@input="updateIntercepts"
				:rows="(props.hostnameConfig.intercepts || '').split('\n').length"
			/>
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

			<div class="description">
				CSS selector for script injection location. Leave empty for default (document root).<br />
				For iframes, use <code>&gt;&gt;&gt;</code> to traverse: <code>iframe.my-frame &gt;&gt;&gt; div.target</code><br />
				For nested iframes: <code>iframe.outer &gt;&gt;&gt; iframe.inner &gt;&gt;&gt; div.target</code>
			</div>

			<input 
				:value="props.hostnameConfig.bundle.injectionTarget"
				@input="updateInjectionTarget"
				type="text" 
				placeholder="e.g., body, iframe >>> head, iframe.outer >>> iframe.inner >>> body"
			/>
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
			<div class="description">Reset the extension to factory defaults.<br />Clears all settings, per-tab states, and active rules across all hostnames.</div>
			
			<div v-if="showStorage" class="storage-viewer">
				<textarea
					readonly
					spellcheck="false"
					:value="storageContent"
					rows="10"
				/>
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
}>();

const emit = defineEmits<{
	(e: 'reset', configPath: string, location?: string): void;
	(e: 'resetAppConfig'): void;
	(e: 'clearAllStorage'): void;
	(e: 'update:hostnameConfig', value: HostnameConfig): void;
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
		bundle: { ...props.hostnameConfig.bundle, injectionTarget: target.value }
	};
	emit('update:hostnameConfig', updated);
}

function detectChanges(configPath = '', location = 'saved') {
	const paths = configPath.split('.').filter(p => p);
	
	const configLocation = location == 'saved' ? props.savedHostnameConfig : defaultHostnameConfig;
	const savedValue: HostnameConfigValue | undefined = configPath && paths.length > 0
		? paths.reduce<HostnameConfigValue | undefined>((configuration, path: string) => {
				if (configuration && typeof configuration === 'object' && configuration !== null && path in configuration) {
					return (configuration as Record<string, HostnameConfigValue>)[path];
				}
				return undefined;
		  }, configLocation)
		: configLocation;

	const value: HostnameConfigValue | undefined = configPath && paths.length > 0
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
	}
});
</script>

<style lang="scss" scoped>
.page-settings {
	padding: 10px;
	background: #1a1a2e;
	color: #e0e0e0;
	z-index: 10;

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
			color: #ffffff;

			.reset {
				cursor: pointer;
				color: #f2647c;
				height: 12px;
				width: 12px;
				transition: all 0.2s ease;
				
				&:hover {
					transform: translateY(-1px);
					filter: drop-shadow(0 2px 4px rgba(242, 100, 124, 0.3));
				}
			}
		}

		.description {
			text-align: justify;
			margin-bottom: 5px;
			color: #b8b8b8;

			code {
				background: #2a2a3e;
				color: #00AEEF;
				padding: 2px 4px;
				border-radius: 3px;
			}

			h4 {
				padding: 0;
				margin: 0;
				color: #e0e0e0;
			}
		}
		
		input[type='text'] {
			width: 100%;
			background: #2a2a3e;
			color: #e0e0e0;
			border: 1px solid #3a3a4e;
			
			&::placeholder {
				color: #666;
			}

			&:focus {
				border-color: #00AEEF;
				outline: none;
			}
		}

		textarea {
			background: #2a2a3e;
			color: #e0e0e0;
			border: 1px solid #3a3a4e;
			
			&::placeholder {
				color: #666;
			}

			&:focus {
				border-color: #00AEEF;
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
			
			&:hover {
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

	.option.reset {
		.reset-extension {
			background: #4a7f9e;
			color: white;
			border: 1px solid #5a94b3;
			font-weight: 600;
			transition: all 0.2s ease;
			
			&:hover {
				background: #5a94b3;
				transform: translateY(-1px);
				box-shadow: 0 2px 4px rgba(90, 148, 179, 0.5);
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
			color: #888;
			transition: color 0.2s;
			
			&:hover {
				color: #b8b8b8;
			}
			
			&.active {
				color: #00AEEF;
			}
		}
		
		.clear-all-button {
			background: #c23a2a;
			color: white;
			border: 1px solid #e74c3c;
			font-weight: 600;
			transition: all 0.2s ease;
			
			&:hover {
				background: #e74c3c;
				transform: translateY(-1px);
				box-shadow: 0 2px 4px rgba(231, 76, 60, 0.5);
			}
		}
		
		.storage-viewer {
			margin-top: 10px;
			
			textarea {
				width: 100%;
				font-family: 'Courier New', monospace;
				font-size: 11px;
				border: 1px solid #3a3a4e;
				border-radius: 4px;
				padding: 8px;
				resize: vertical;
				background: #2a2a3e;
				color: #e0e0e0;
				max-height: 300px;
				overflow-y: auto;
			}
		}
	}
}
</style>

<template>
	<div class="page-config-wrapper">
		<div v-if="integrationLoading" class="loading-overlay">
			<div class="loading-message">loading...</div>
		</div>

		<div class="page-config" :class="{ loading: integrationLoading }">
			<!-- Skeleton loading state -->
			<div v-if="integrationLoading" class="option integration skeleton">
				<h3>
					<span class="integration-header-content">
						<span class="integration-title">
							<span class="skeleton-bar title-bar"></span>
						</span>
						<span class="integration-stats">
							<span class="skeleton-bar stat-bar"></span>
							<span class="skeleton-bar stat-bar"></span>
							<span class="skeleton-bar stat-bar"></span>
						</span>
					</span>
				</h3>
			</div>

			<!-- Loaded state -->
			<div class="option integration" v-if="!integrationLoading && integrationDetails.version">
				<h3 @click="() => emit('toggleIntegrationCollapsed')">
					<span class="integration-header-content">
						<span class="integration-title">Snap Integration</span>
						<span class="integration-stats">
							<span v-if="integrationDetails.context?.siteId" class="stat-item siteid">
								<span class="stat-label">ID:</span>
								<span class="stat-value">{{ integrationDetails.context.siteId }}</span>
							</span>
							<span v-if="integrationDetails.version" class="stat-divider">|</span>
							<span v-if="integrationDetails.version" class="stat-item version">
								<span class="stat-label">v</span>
								<span class="stat-value">{{ integrationDetails.version }}</span>
							</span>
							<span v-if="integrationDetails.controllers?.length" class="stat-divider">|</span>
							<span v-if="integrationDetails.controllers?.length" class="stat-item controllers">
								<span class="stat-value">{{ integrationDetails.controllers.length }}</span>
								<span class="stat-label">{{ integrationDetails.controllers.length === 1 ? 'ctrl' : 'ctrls' }}</span>
							</span>
						</span>
					</span>
				</h3>

				<transition name="expand">
					<div class="integration-details" v-if="!integrationCollapsed">
						<div class="description controllers">
							<div :key="key" v-for="(controller, key) in integrationDetails.controllers"
								@click="() => (controller.collapsed = !controller.collapsed)" class="controller-wrapper">
								<PopupController :controller="controller"
									@toggleGlobals="() => controller.config && controller.config.globals && (controller.config.globals.collapsed = !controller.config.globals.collapsed)"
									@toggleSettings="() => controller.config && controller.config.settings && (controller.config.settings.collapsed = !controller.config.settings.collapsed)" />
							</div>
						</div>
					</div>
				</transition>
			</div>

			<div v-if="!integrationLoading && currentHostname && !integrationDetails.version"
				:class="{ 'alert-information': !enabled, 'alert-warning': enabled }">
				<div v-if="enabled">
					<strong>{{ integrationDetails.error?.message || 'Failed to load bundle. Check console for possible errors.'
					}}</strong>
					<div v-if="integrationDetails.error?.details">{{ integrationDetails.error.details }}</div>
				</div>
				<div v-else>
					No Snap integration found.
				</div>
			</div>

			<div v-if="!currentHostname" class="alert-warning">
				Extension only works on website pages. Please navigate to a website to use the extension.
			</div>

			<div v-if="currentHostname" class="option url">
				<h3>
					<span class="heading-with-buttons">
						Bundle URL
						<span class="url-actions">
							<button class="url-cdn"
								@click="set('bundle.url', 'https://snapui.searchspring.io/siteid/branch/bundle.js')">cdn</button>
							<button class="url-local" @click="set('bundle.url', 'https://localhost:3333/bundle.js')">local</button>
						</span>
					</span>
					<font-awesome-icon v-if="detectChanges('bundle.url', 'default')" class="reset" @click="reset('bundle.url')"
						icon="undo" title="reset bundle URL" />
				</h3>

				<div class="description">URL of bundle to inject onto the page.<br /></div>

				<input :value="hostnameConfig.bundle.url" @input="updateBundleUrl" type="text" />
			</div>

			<div v-if="currentHostname" class="option context">
				<h3>
					Script Context
					<font-awesome-icon v-if="detectChanges('bundle.context', 'default')" class="reset"
						@click="reset('bundle.context')" icon="undo" title="reset context variables" />
				</h3>

				<div class="description">Contextual variables to be injected with the script.</div>

				<div class="textarea-tabbed">
				<div class="textarea-wrapper">
					<textarea placeholder="context variables should be here..." required="true" spellcheck="false"
						:value="hostnameConfig.bundle?.context" @input="updateContext"
						:rows="(hostnameConfig.bundle?.context || '').split('\n').length" />

					<div class="textarea-tab">
						<font-awesome-icon icon="code-merge" class="merge-icon" />
						<Checkbox label="Merge with existing context" label-placement="right" size="small"
							:model-value="hostnameConfig.bundle.mergeContext"
							@update:model-value="(value: boolean) => updateMergeContextValue(value)" />
					</div>
				</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { HostnameConfig, LocalData, HostnameConfigValue } from '../../types/storage';
import { defaultHostnameConfig, deepCompare } from '../../utilities/utilities';
import PopupController from './popup-controller.vue';
import Checkbox from '../shared/checkbox.vue';

const props = defineProps<{
	currentHostname: string | null;
	hostnameConfig: HostnameConfig;
	savedHostnameConfig: HostnameConfig;
	integrationDetails: LocalData;
	integrationLoading: boolean;
	integrationCollapsed: boolean;
	enabled: boolean | null;
}>();

const emit = defineEmits<{
	(e: 'reset', configPath: string, location?: string): void;
	(e: 'set', configPath: string, value: HostnameConfigValue | undefined): void;
	(e: 'update:hostnameConfig', value: HostnameConfig): void;
	(e: 'toggleIntegrationCollapsed'): void;
}>();

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

function reset(configPath: string, location = 'default') {
	emit('reset', configPath, location);
}

function set(configPath: string, value: HostnameConfigValue | undefined) {
	emit('set', configPath, value);
}

function updateBundleUrl(event: Event) {
	const target = event.target as HTMLInputElement;
	const updated = {
		...props.hostnameConfig,
		bundle: { ...props.hostnameConfig.bundle, url: target.value }
	};
	emit('update:hostnameConfig', updated);
}

function updateContext(event: Event) {
	const target = event.target as HTMLTextAreaElement;
	const updated = {
		...props.hostnameConfig,
		bundle: { ...props.hostnameConfig.bundle, context: target.value }
	};
	emit('update:hostnameConfig', updated);
}

function updateMergeContextValue(checked: boolean) {
	const updated = {
		...props.hostnameConfig,
		bundle: { ...props.hostnameConfig.bundle, mergeContext: checked }
	};
	emit('update:hostnameConfig', updated);
}
</script>

<style lang="scss" scoped>
.page-config-wrapper {
	position: relative;

	.loading-overlay {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
		pointer-events: none;

		.loading-message {
			opacity: 0.7;
			background: rgba(29, 73, 144, 0.95);
			color: white;
			padding: 10px 16px;
			border-radius: 4px;
			font-size: 12px;
			font-weight: 900;
			box-shadow: 0 4px 12px rgba(29, 73, 144, 0.3);
			animation: gentlePulse 2s ease-in-out infinite;
			backdrop-filter: blur(10px);
			margin-bottom: 40px;
		}
	}

	@keyframes gentlePulse {

		0%,
		100% {
			transform: scale(1);
			box-shadow: 0 4px 12px rgba(29, 73, 144, 0.3);
		}

		50% {
			transform: scale(1.06);
			box-shadow: 0 6px 16px rgba(29, 73, 144, 0);
		}
	}
}

.page-config {
	position: relative;
	background: #fff;
	padding: 10px;

	&.loading {
		pointer-events: none;
		opacity: 0.3;
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

			h4 {
				padding: 0;
				margin: 0;
			}
		}

		input[type='text'] {
			width: 100%;
		}
	}

	.option.integration {
		background: rgba(0, 0, 0, 0.03);
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 12px;
		margin: 0;

		&.skeleton {
			border: 1px solid rgba(0, 0, 0, 0.3);
			pointer-events: none;

			h3 {
				cursor: default;
			}

			.skeleton-bar {
				display: inline-block;
				background: rgba(0, 0, 0, 0.3);
				border-radius: 2px;

				&.title-bar {
					width: 120px;
					height: 16px;
				}

				&.stat-bar {
					width: 50px;
					height: 16px;
				}
			}
		}

		.integration-header-content {
			display: flex;
			align-items: center;
			flex: 1;
			gap: 12px;
		}

		.integration-title {
			font-weight: 600;
			font-size: 14px;
			font-family: 'Avenir', Helvetica, Arial, sans-serif;
		}

		.integration-stats {
			display: inline-flex;
			align-items: center;
			gap: 10px;
			font-size: 11px;
			font-family: 'Avenir', Helvetica, Arial, sans-serif;
			background: rgba(255, 255, 255, 0.5);
			padding: 4px 10px;
			border-radius: 2px;
			border-left: 3px solid transparent;
		}

		.stat-item {
			display: inline-flex;
			align-items: center;
			gap: 3px;
			white-space: nowrap;

			&.siteid {
				.stat-label {
					color: #666;
					font-weight: 500;
				}

				.stat-value {
					color: #e91e63;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.5px;
				}
			}

			&.version {
				.stat-label {
					color: #666;
					font-weight: 500;
				}

				.stat-value {
					color: #e74c3c;
					font-weight: 700;
				}
			}

			&.controllers {
				.stat-value {
					background: #1D4990;
					color: white;
					font-weight: 700;
					padding: 1px 6px;
					border-radius: 2px;
					min-width: 18px;
					text-align: center;
				}

				.stat-label {
					color: #1D4990;
					font-weight: 500;
					font-size: 0.95em;
				}
			}
		}

		.stat-divider {
			color: rgba(0, 0, 0, 0.2);
			font-weight: 300;
		}

		h3 {
			cursor: pointer;
			margin: 0;

			>span {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex: 1;
			}
		}

		.integration-details {
			margin-top: 18px;
		}



		.description.controllers {
			padding: 0;
			margin: 0;
		}
	}

	.alert-information {
		background: rgba(29, 73, 144, 0.04);
		border: 1px solid rgba(29, 73, 144, 0.15);
		padding: 12px 16px;
		border-radius: 4px;
		color: rgba(29, 73, 144, 0.75);
		font-size: 13px;
		font-weight: 500;
		margin-bottom: 15px;
	}

	.alert-warning {
		background: rgb(225 31 31 / 12%);
		border: 1px solid rgb(225 31 31 / 20%);
		padding: 12px 16px;
		border-radius: 4px;
		color: rgb(225 31 31 / 85%);
		font-size: 13px;
		font-weight: 500;
		line-height: 1.5;
	}

	.option.url {
		h3 {
			.heading-with-buttons {
				display: flex;
				align-items: center;
				gap: 8px;
			}
		}

		.url-actions {
			display: inline-flex;
			align-items: center;
			gap: 5px;
		}

		button {
			margin-left: 0;
			font-size: 9px;
			padding: 3px 8px;
			font-weight: 600;
			transition: all 0.2s ease;
			border: 1px solid;

			&.url-cdn {
				background: #f39c12;
				color: white;
				border-color: #e67e22;

				&:hover {
					background: #e67e22;
					transform: translateY(-1px);
					box-shadow: 0 2px 4px rgba(243, 156, 18, 0.3);
				}
			}

			&.url-local {
				background: #6ab04c;
				color: white;
				border-color: #5a9a3f;

				&:hover {
					background: #5a9a3f;
					transform: translateY(-1px);
					box-shadow: 0 2px 4px rgba(106, 176, 76, 0.3);
				}
			}
		}
	}

	.textarea-tabbed {
		display: flow-root;
		margin-bottom: 10px;

		.textarea-wrapper {
			position: relative;
			margin-bottom: 30px;

			textarea {
				border-bottom-right-radius: 0;
			}

			.textarea-tab {
				position: absolute;
				bottom: -30px;
				margin: 0;
				right: 0;
				padding: 8px 10px;
				background: linear-gradient(135deg, rgba(29, 73, 144, 0.04) 0%, rgba(29, 73, 144, 0.02) 100%);
				border: 1px solid rgba(29, 73, 144, 0.12);
				border-radius: 4px;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				display: flex;
				align-items: center;
				gap: 8px;
				transition: all 0.2s ease;

				&:hover {
					background: linear-gradient(135deg, rgba(29, 73, 144, 0.06) 0%, rgba(29, 73, 144, 0.03) 100%);
					border-color: rgba(29, 73, 144, 0.2);

					.merge-icon {
						color: #1D4990;
						transform: scale(1.05);
					}
				}

				.merge-icon {
					color: #4c76c8;
					font-size: 14px;
					flex-shrink: 0;
					transition: all 0.2s ease;
				}
			}
		}
	}

	// Expand transition for collapsible sections
	.expand-enter-active {
		transition: opacity 0.25s ease, transform 0.25s ease;
		overflow: hidden;
	}

	.expand-leave-active {
		transition: opacity 0.2s ease, transform 0.2s ease;
		overflow: hidden;
	}

	.expand-enter-from {
		opacity: 0;
		transform: translateY(-5px);
	}

	.expand-leave-to {
		opacity: 0;
		transform: translateY(-5px);
	}

	.expand-enter-to,
	.expand-leave-from {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>

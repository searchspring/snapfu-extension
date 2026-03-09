<template>
	<div class="controller">
		<div class="controller-header">
			<span class="header-left">
				<font-awesome-icon :icon="controllerIcon" />
				<span class="controller-id">{{ controller.id }}</span>
			</span>
			<span class="controller-stats">
				<span class="stat-item status" :class="{ loaded: controller.store?.loaded, 'not-loaded': !controller.store?.loaded }">
					<span class="stat-value">{{ controller.store?.loaded ? '✓' : '○' }}</span>
					<span class="stat-label">{{ controller.store?.loaded ? 'loaded' : 'not loaded' }}</span>
				</span>
				<span v-if="controller.store?.loaded" class="stat-divider">|</span>
				<span v-if="controller.store?.loaded" class="stat-item results">
					<span class="stat-value"
						>{{ controller.store.results.length }}
						{{ controller.store?.pagination?.totalResults ? `/${controller.store?.pagination?.totalResults}` : '' }}</span
					>
					<span class="stat-label">res</span>
				</span>

				<span v-if="controller.config?.plugins !== undefined" class="stat-divider">|</span>
				<span v-if="controller.config?.plugins !== undefined" class="stat-item plugins">
					<span class="stat-value">{{ controller.config.plugins }}</span>
					<span class="stat-label">plugins</span>
				</span>
			</span>
		</div>

		<transition name="expand">
			<div v-if="!controller.collapsed" class="controller-details">
				<div v-if="controller.config?.globals" class="config-section collapsible" @click.stop="handleToggleGlobals">
					<div class="config-header">
						<b>globals</b>
					</div>
					<transition name="expand">
						<pre v-if="!controller.config.globals.collapsed">{{ JSON.stringify(controller.config.globals.data, null, 2) }}</pre>
					</transition>
				</div>

				<div v-if="controller.config?.settings" class="config-section collapsible" @click.stop="handleToggleSettings">
					<div class="config-header">
						<b>settings</b>
					</div>
					<transition name="expand">
						<pre v-if="!controller.config.settings.collapsed">{{ JSON.stringify(controller.config.settings.data, null, 2) }}</pre>
					</transition>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits } from 'vue';

const props = defineProps<{
	controller: {
		type: string;
		collapsed: boolean;
		id: string;
		store: Record<string, any>;
		config?: {
			globals?: {
				data: Record<string, any>;
				collapsed: boolean;
			};
			plugins?: number;
			settings?: {
				data: Record<string, any>;
				collapsed: boolean;
			};
		};
	};
}>();

const emit = defineEmits<{
	(e: 'toggleGlobals'): void;
	(e: 'toggleSettings'): void;
}>();

const controllerIcon = computed(() => {
	switch (props.controller.type) {
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
});

const handleToggleGlobals = () => {
	emit('toggleGlobals');
};

const handleToggleSettings = () => {
	emit('toggleSettings');
};
</script>

<style lang="scss">
.controller {
	border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	padding: 10px;
	background: rgba(0, 0, 0, 0.03);
	border-radius: 4px;
	margin-bottom: 10px;

	.controller-wrapper:last-child & {
		margin-bottom: 0;
	}

	.controller-header {
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;

		.header-left {
			display: flex;
			align-items: center;
			gap: 10px;
			flex: 1;
			min-width: 0;
		}

		.controller-id {
			display: inline-block;
			font-size: 13px;
			font-family: 'Avenir', Helvetica, Arial, sans-serif;
			white-space: nowrap;
			font-weight: 600;
		}

		.controller-stats {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			font-size: 11px;
			font-family: 'Avenir', Helvetica, Arial, sans-serif;
			border-radius: 2px;
		}

		.stat-item {
			display: inline-flex;
			align-items: center;
			gap: 3px;
			white-space: nowrap;

			&.status {
				.stat-value {
					font-size: 1.1em;
					font-weight: 700;
				}

				&.loaded {
					.stat-value {
						color: #27ae60;
					}
					.stat-label {
						color: #27ae60;
						font-weight: 500;
					}
				}

				&.not-loaded {
					.stat-value {
						color: #95a5a6;
					}
					.stat-label {
						color: #95a5a6;
						font-weight: 400;
					}
				}
			}

			&.results {
				.stat-value {
					background: #1d4990;
					color: white;
					font-weight: 700;
					padding: 1px 5px;
					border-radius: 2px;
					min-width: 16px;
					text-align: center;
				}
				.stat-label {
					color: #1d4990;
					font-weight: 500;
				}
			}

			&.plugins {
				.stat-value {
					background: #00aeef;
					color: white;
					font-weight: 700;
					padding: 1px 5px;
					border-radius: 2px;
					min-width: 16px;
					text-align: center;
				}
				.stat-label {
					color: #00aeef;
					font-weight: 500;
				}
			}
		}

		.stat-divider {
			color: rgba(0, 0, 0, 0.2);
			font-weight: 300;
		}
	}

	.controller-details {
		display: block;
		padding-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 6px;

		> div {
			display: flex;
			align-items: center;
			background: rgba(0, 0, 0, 0.05);
			padding: 6px 10px;
			border-radius: 4px;
			font-size: 12px;

			b {
				min-width: 60px;
				display: inline-block;
				color: rgba(0, 0, 0, 0.6);
				font-weight: 600;
				text-transform: uppercase;
				font-size: 10px;
				font-family: 'Avenir', Helvetica, Arial, sans-serif;
				letter-spacing: 0.8px;
			}

			&.config-section {
				flex-direction: column;
				align-items: flex-start;
				padding: 0;
				background: transparent;

				&.collapsible {
					cursor: pointer;
					background: rgba(0, 0, 0, 0.05);

					.config-header {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 6px 10px 6px 20px;
						box-sizing: border-box;

						b {
							margin: 0;
						}
					}
				}

				pre {
					width: 100%;
					margin: 0;
					padding: 10px 10px 10px 20px;
					background: rgba(0, 0, 0, 0.03);
					border-radius: 0 0 4px 4px;
					border-top: 1px solid rgba(0, 0, 0, 0.08);
					font-size: 9px;
					font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
					overflow-x: auto;
					overflow-y: auto;
					max-height: 300px;
					white-space: pre;
					word-wrap: normal;
					box-sizing: border-box;
				}
			}
		}
	}

	// Expand transition for collapsible sections
	.expand-enter-active {
		transition: opacity 0.2s ease, transform 0.2s ease;
		overflow: hidden;
	}

	.expand-leave-active {
		transition: opacity 0.15s ease, transform 0.15s ease;
		overflow: hidden;
	}

	.expand-enter-from {
		opacity: 0;
		transform: translateY(-3px);
	}

	.expand-leave-to {
		opacity: 0;
		transform: translateY(-3px);
	}

	.expand-enter-to,
	.expand-leave-from {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>

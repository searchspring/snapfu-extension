<template>
	<div class="header" :class="{ 'settings-open': settingsOpen }">
		<div class="logo-container">
			<svg class="logo-bricks" :class="animationState" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
				<path
					class="brick brick-1"
					d="M40,13.34c0,2.87-2.1,5.2-4.7,5.2h-10.42c-3.66,0-5.9-4.42-4.02-7.9l4.37-8.11c.86-1.57,2.37-2.53,4.02-2.53h6.03c2.59,0,4.7,2.34,4.7,5.2l.02,8.14Z"
				/>
				<path
					class="brick brick-2"
					d="M40,34.79c0,2.87-2.1,5.2-4.7,5.2h-10.42c-3.66,0-5.9-4.42-4.02-7.9l4.37-8.11c.86-1.57,2.37-2.53,4.02-2.53h6.03c2.59,0,4.7,2.34,4.7,5.2l.02,8.14Z"
				/>
				<path
					class="brick brick-3"
					d="M0,5.2C0,2.34,2.1,0,4.7,0h10.42c3.66,0,5.9,4.42,4.02,7.9l-4.37,8.11c-.86,1.57-2.37,2.53-4.02,2.53h-6.03C2.12,18.54.02,16.21.02,13.34l-.02-8.14Z"
				/>
				<path
					class="brick brick-4"
					d="M0,26.66c0-2.87,2.1-5.2,4.7-5.2h10.42c3.66,0,5.9,4.42,4.02,7.9l-4.37,8.11c-.86,1.57-2.37,2.53-4.02,2.53h-6.03C2.12,40,.02,37.66.02,34.8l-.02-8.14Z"
				/>
			</svg>
			<img class="logo-text" src="../../assets/athos-text.svg" />
		</div>
		<div v-if="currentHostname" class="hostname-pill" :title="currentHostname">
			{{ currentHostname }}
		</div>
		<div class="buttons">
			<div title="save changes" class="button save" :class="{ visible: hasChanges }" @click="emit('save')">
				<font-awesome-icon icon="save" />
			</div>

			<div
				class="button toggle"
				:title="enabled ? 'turn off' : 'turn on'"
				v-if="currentHostname"
				:class="{ on: enabled, loading: enabled === null }"
				@click="emit('toggleOnOff')"
			>
				<span v-if="enabled" class="on"></span>
				<font-awesome-icon icon="toggle-off" />
			</div>

			<div title="settings" class="button settings" :class="{ open: settingsOpen }" @click="emit('toggleSettings')">
				<font-awesome-icon icon="gear" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps<{
	currentHostname: string | null;
	hasChanges: boolean;
	enabled: boolean | null;
	settingsOpen: boolean;
	integrationLoading?: boolean;
}>();

const emit = defineEmits<{
	(e: 'save'): void;
	(e: 'toggleOnOff'): void;
	(e: 'toggleSettings'): void;
}>();

// Animation states: 'idle' | 'loading' | 'stopping'
const animationState = ref<string>(props.integrationLoading ? 'loading' : 'idle');

watch(
	() => props.integrationLoading,
	(newVal, oldVal) => {
		if (newVal && !oldVal) {
			// Starting animation
			animationState.value = 'loading';
		} else if (!newVal && oldVal) {
			// Stopping animation - transition to stopping state
			animationState.value = 'stopping';
			// After stopping animation completes, return to idle
			setTimeout(() => {
				animationState.value = 'idle';
			}, 600); // Match this to the stopping animation duration
		}
	}
);
</script>

<style lang="scss" scoped>
.header {
	position: relative;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: center;
	padding: 10px 5px;
	height: 30px;
	flex-shrink: 0;
	overflow: hidden;
	border-bottom: 1px solid #f2647cbd;
	transition: background 0.6s cubic-bezier(0.4, 0, 0.2, 1);

	// Base gradient (pink) - always visible
	background: linear-gradient(45deg, #1d4990 0%, #f2647c 100%);

	&.settings-open {
		background: linear-gradient(45deg, #1d4990 0%, #5ed1b3 100%);
		border-bottom-color: rgba(94, 209, 179, 0.3);
	}

	// Ensure all child elements are above the gradient layers
	> * {
		position: relative;
		z-index: 1;
	}

	.logo-container {
		margin-left: 5px;
		margin-right: 47px;
		height: 30px;
		display: flex;
		align-items: center;
	}

	.logo-bricks {
		width: 30px;
		height: 30px;
		flex-shrink: 0;

		.brick {
			fill: #fff;
			transform-origin: center;
			transform: scale(1);
			opacity: 1;
		}

		&.idle {
			.brick {
				// Default state - no animation
				transform: scale(1);
				opacity: 1;
			}
		}

		&.loading {
			.brick {
				animation: brickPulse 1.6s ease-in-out infinite;

				&.brick-1 {
					animation-delay: 0s;
				}

				&.brick-2 {
					animation-delay: 0.2s;
				}

				&.brick-3 {
					animation-delay: 0.4s;
				}

				&.brick-4 {
					animation-delay: 0.6s;
				}
			}
		}

		&.stopping {
			.brick {
				animation: brickReturn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

				&.brick-1 {
					animation-delay: 0s;
				}

				&.brick-2 {
					animation-delay: 0.05s;
				}

				&.brick-3 {
					animation-delay: 0.1s;
				}

				&.brick-4 {
					animation-delay: 0.15s;
				}
			}
		}
	}

	.logo-text {
		height: 28px;
	}

	.hostname-pill {
		background: rgba(255, 255, 255, 0.2);
		color: #fff;
		padding: 5px 12px;
		border-radius: 15px;
		font-size: 11px;
		font-family: monospace;
		margin: 0 10px;
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
			transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

			&.visible {
				visibility: visible;
				animation: pulse-save 1.5s infinite;
			}

			&:hover {
				transform: scale(1.1);
				animation-play-state: paused;
			}

			svg {
				color: #ffc107;
				width: 27px;
				height: 27px;
				transition: filter 0.2s ease;
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
			transition: transform 0.2s ease;

			&.on {
				svg {
					transform: rotate(180deg);
				}
			}

			&.loading {
				opacity: 0.3;
				cursor: default;
			}

			&:not(.loading):hover {
				transform: scale(1.1);

				.on {
					box-shadow: 0 2px 8px rgba(0, 174, 239, 0.4);
				}
			}

			.on {
				background: #00aeef;
				position: absolute;
				left: 12px;
				top: 7px;
				border-radius: 10px;
				z-index: 1;
				width: 32px;
				height: 22px;
				display: block;
				transition: box-shadow 0.2s ease;
			}

			svg {
				color: #fff;
				position: relative;
				z-index: 2;
				width: 36px;
				height: 36px;
				transition: filter 0.2s ease;
			}

			.text {
				padding: 10px;
			}
		}

		.settings {
			position: relative;
			transition: transform 0.2s ease;

			&:hover {
				transform: scale(1.1);

				&:not(.open) svg {
					transform: rotate(-15deg);
				}
			}

			svg {
				color: #fff;
				position: relative;
				z-index: 2;
				transition: all 0.2s ease;
				width: 25px;
				height: 25px;
			}

			&.open {
				svg {
					color: #1f7388;
					filter: drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.1));
					animation: gear-spin-pulse 28s linear infinite;
				}

				&:hover {
					.open {
						animation-play-state: paused;
					}

					svg {
						animation-play-state: paused;
					}
				}
			}
		}
	}

	@keyframes brickPulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}

		50% {
			transform: scale(0.7);
			opacity: 0.4;
		}
	}

	@keyframes gear-spin-pulse {
		0% {
			transform: rotate(0deg) scale(1);
		}

		25% {
			transform: rotate(90deg) scale(1.15);
		}

		50% {
			transform: rotate(180deg) scale(1.2);
		}

		75% {
			transform: rotate(270deg) scale(1.15);
		}

		100% {
			transform: rotate(360deg) scale(1);
		}
	}

	@keyframes brickReturn {
		0% {
			// Start from wherever the brick currently is
		}

		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
}
</style>

<template>
	<label class="checkbox-wrapper" :class="[sizeClasses, { disabled, 'label-right': labelPlacement === 'right' }]">
		<span v-if="label && labelPlacement === 'left'" class="checkbox-label">{{ label }}</span>
		<input
			type="checkbox"
			:checked="modelValue"
			:disabled="disabled"
			@change="handleChange"
			class="checkbox-input"
		/>
		<span class="checkbox-custom">
			<svg class="checkbox-icon" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M1 5L4.5 8.5L11 1.5"
					stroke="white"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
		<span v-if="label && labelPlacement === 'right'" class="checkbox-label">{{ label }}</span>
		<slot></slot>
	</label>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults, computed } from 'vue';

interface Props {
	modelValue: boolean;
	label?: string;
	labelPlacement?: 'left' | 'right';
	size?: 'small' | 'medium' | 'large';
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	labelPlacement: 'left',
	size: 'medium'
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();

const sizeClasses = computed(() => {
	return {
		'size-small': props.size === 'small',
		'size-medium': props.size === 'medium',
		'size-large': props.size === 'large'
	};
});

function handleChange(event: Event) {
	const target = event.target as HTMLInputElement;
	emit('update:modelValue', target.checked);
}
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
	display: inline-flex;
	align-items: center;
	cursor: pointer;
	user-select: none;
	position: relative;
	gap: 6px;

	&.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.checkbox-input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;

		&:checked + .checkbox-custom {
			background: #1D4990;
			border-color: #1D4990;

			.checkbox-icon {
				opacity: 1;
				transform: scale(1);
			}
		}

		&:not(:checked) + .checkbox-custom {
			background: #fff;
			border-color: #d1d5db;

			.checkbox-icon {
				opacity: 0;
				transform: scale(0.5);
			}
		}

		&:focus + .checkbox-custom {
			outline: none;
		}

		&:hover:not(:disabled) + .checkbox-custom {
			border-color: #1D4990;
		}

		&:checked:hover:not(:disabled) + .checkbox-custom {
			background: #163a73;
			border-color: #163a73;
		}

		&:disabled + .checkbox-custom {
			cursor: not-allowed;
			background: #f5f5f5;
			border-color: #e5e7eb;
		}
	}

	.checkbox-custom {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border: 1.5px solid #d1d5db;
		border-radius: 2px;
		transition: all 0.15s ease;
		flex-shrink: 0;

		.checkbox-icon {
			width: 10px;
			height: 8px;
			transition: all 0.1s ease;
		}
	}

	.checkbox-label {
		margin-left: 0;
		font-size: 12px;
		color: #374151;
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		line-height: 1.4;
	}

	// Size variants
	&.size-small {
		gap: 5px;

		.checkbox-custom {
			width: 14px;
			height: 14px;
			border-width: 1.5px;
			border-radius: 2px;

			.checkbox-icon {
				width: 9px;
				height: 7px;
			}
		}

		.checkbox-label {
			font-size: 11px;
		}
	}

	&.size-medium {
		gap: 6px;

		.checkbox-custom {
			width: 16px;
			height: 16px;
			border-width: 1.5px;
			border-radius: 2px;

			.checkbox-icon {
				width: 10px;
				height: 8px;
			}
		}

		.checkbox-label {
			font-size: 12px;
		}
	}

	&.size-large {
		gap: 7px;

		.checkbox-custom {
			width: 18px;
			height: 18px;
			border-width: 2px;
			border-radius: 3px;

			.checkbox-icon {
				width: 11px;
				height: 9px;
			}
		}

		.checkbox-label {
			font-size: 13px;
		}
	}
}
</style>

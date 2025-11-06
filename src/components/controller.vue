<template>
	<div class="controller">
		<div class="controller-header">
			<span>
				<font-awesome-icon :icon="controllerIcon" />
				<span class="controller-id">{{ controller.id }}</span>
			</span>
			<font-awesome-icon class="collapse-icon" :icon="controller.collapsed ? 'angle-down' : 'angle-up'" />
		</div>

		<div v-if="!controller.collapsed" class="controller-details">
			<div><b>type:</b> {{ controller.type }}</div>
			<div><b>loaded:</b> {{ controller.store?.loaded }}</div>
			<div><b>results:</b> {{ controller.store.results.length }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
const props = defineProps<{
	controller: {
		type: string;
		collapsed: boolean;
		id: string;
		store: Record<string, any>;
	};
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

		.controller-id {
			display: inline-block;
			padding: 0px 10px;
			font-size: 13px;
			font-family: monospace;
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
				letter-spacing: 0.5px;
			}
		}
	}
}
</style>

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
	border-bottom: 1px solid #ccc;
	padding: 10px;

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
		padding-left: 22px;
		padding-top: 10px;

		& b {
			min-width: 45px;
			display: inline-block;
		}
	}
}
</style>

<template>
	<div class="loading-container">
		<div class="spinner">
			<div class="block"></div>
			<div class="block"></div>
			<div class="block"></div>
			<div class="block"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.loading-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20px 0;

	.spinner {
		display: flex;
		gap: 5px;

		.block {
			width: 12px;
			height: 12px;
			border-radius: 2px;
			animation: pulse 1.2s ease-in-out infinite;

			&:nth-child(1) {
				background: #352490;
				animation-delay: 0s;
			}

			&:nth-child(2) {
				background: #4c3ce2;
				animation-delay: 0.15s;
			}

			&:nth-child(3) {
				background: #e11f82;
				animation-delay: 0.3s;
			}

			&:nth-child(4) {
				background: #4c3ce2;
				animation-delay: 0.45s;
			}
		}
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(0.5);
			opacity: 0.5;
		}
	}
}
</style>

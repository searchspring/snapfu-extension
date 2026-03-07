<template>
	<div class="loading-container">
		<svg class="athos-logo-loader" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.loading-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20px 0;

	.athos-logo-loader {
		width: 40px;
		height: 40px;
		// opacity: 0.3;

		.brick {
			animation: brickPulse 1.6s ease-in-out infinite;
			transform-origin: center;

			&.brick-1 {
				fill: #1d4990;
				animation-delay: 0s;
			}

			&.brick-2 {
				fill: #00aeef;
				animation-delay: 0.2s;
			}

			&.brick-3 {
				fill: #00aeef;
				animation-delay: 0.4s;
			}

			&.brick-4 {
				fill: #1d4990;
				animation-delay: 0.6s;
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
}
</style>

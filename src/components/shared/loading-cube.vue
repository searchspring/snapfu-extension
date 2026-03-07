<template>
	<div class="loading-container">
		<div class="cube-scene">
			<div class="cube" :style="{ animationDuration: `${speed}s` }">
				<div class="cube-face front">
					<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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
				<div class="cube-face back">
					<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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
							d="M0,26.66c0-2.87,2.1-5.2,4.7-5.2h10.42c3.66,0,5.9,4.42,4.02,7.9l-4.37,8.11c-.86,1.57-2.37,2.53,4.02,2.53h-6.03C2.12,40,.02,37.66.02,34.8l-.02-8.14Z"
						/>
					</svg>
				</div>
				<div class="cube-face right">
					<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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
							d="M0,26.66c0-2.87,2.1-5.2,4.7-5.2h10.42c3.66,0,5.9,4.42,4.02,7.9l-4.37,8.11c-.86-1.57-2.37-2.53-4.02-2.53h-6.03C2.12,40,.02,37.66.02,34.8l-.02-8.14Z"
						/>
					</svg>
				</div>
				<div class="cube-face left">
					<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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
				<div class="cube-face top">
					<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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
				<div class="cube-face bottom">
					<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface Props {
	speed?: number;
}

withDefaults(defineProps<Props>(), {
	speed: 3,
});
</script>

<style lang="scss" scoped>
.loading-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20px 0;
	perspective: 1000px;

	.cube-scene {
		width: 40px;
		height: 40px;
		position: relative;
	}

	.cube {
		width: 100%;
		height: 100%;
		position: relative;
		transform-style: preserve-3d;
		animation: rotateCube infinite linear;

		.cube-face {
			position: absolute;
			width: 40px;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: white;
			border: 1px solid rgba(0, 0, 0, 0.1);
			box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
			border-radius: 3px;

			svg {
				width: 28px;
				height: 28px;
				filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));

				.brick {
					filter: drop-shadow(0 -0.5px 0.5px rgba(0, 0, 0, 0.15));
				}
			}

			&.front {
				transform: rotateY(0deg) translateZ(20px);
				.brick-1 {
					fill: #1d4990;
				} // top-right
				.brick-2 {
					fill: #00aeef;
				} // bottom-right
				.brick-3 {
					fill: #00aeef;
				} // top-left
				.brick-4 {
					fill: #1d4990;
				} // bottom-left
			}

			&.back {
				transform: rotateY(180deg) translateZ(20px);
				.brick-1 {
					fill: #00aeef;
				} // top-left (when viewed from back)
				.brick-2 {
					fill: #1d4990;
				} // bottom-left
				.brick-3 {
					fill: #1d4990;
				} // top-right
				.brick-4 {
					fill: #00aeef;
				} // bottom-right
			}

			&.right {
				transform: rotateY(90deg) translateZ(20px);
				.brick-1 {
					fill: #00aeef;
				} // top-right (connects to back top-left)
				.brick-2 {
					fill: #1d4990;
				} // bottom-right
				.brick-3 {
					fill: #1d4990;
				} // top-left (connects to front top-right)
				.brick-4 {
					fill: #00aeef;
				} // bottom-left
			}

			&.left {
				transform: rotateY(-90deg) translateZ(20px);
				.brick-1 {
					fill: #1d4990;
				} // top-right (connects to front top-left)
				.brick-2 {
					fill: #00aeef;
				} // bottom-right
				.brick-3 {
					fill: #00aeef;
				} // top-left (connects to back top-right)
				.brick-4 {
					fill: #1d4990;
				} // bottom-left
			}

			&.top {
				transform: rotateX(90deg) translateZ(20px);
				.brick-1 {
					fill: #1d4990;
				} // back-right
				.brick-2 {
					fill: #00aeef;
				} // front-right
				.brick-3 {
					fill: #00aeef;
				} // back-left
				.brick-4 {
					fill: #1d4990;
				} // front-left
			}

			&.bottom {
				transform: rotateX(-90deg) translateZ(20px);
				.brick-1 {
					fill: #00aeef;
				} // front-right
				.brick-2 {
					fill: #1d4990;
				} // back-right
				.brick-3 {
					fill: #1d4990;
				} // front-left
				.brick-4 {
					fill: #00aeef;
				} // back-left
			}
		}
	}

	@keyframes rotateCube {
		0% {
			transform: rotateX(0deg) rotateY(0deg);
		}
		100% {
			transform: rotateX(360deg) rotateY(360deg);
		}
	}
}
</style>

# Checkbox Component

A stylized checkbox component that matches the Snapfu extension design aesthetic.

## Features

- Custom-styled checkbox with smooth animations
- Hover and focus states with shadow effects
- Gradient background when checked (#1D4990 primary color)
- Disabled state support
- Optional label text or slot content
- v-model support for two-way binding

## Usage

### Basic Usage

```vue
<template>
	<Checkbox v-model="isChecked" label="Enable feature" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Checkbox from '../shared/checkbox.vue';

const isChecked = ref(false);
</script>
```

### Size Variants

The checkbox comes in three sizes: `small`, `medium` (default), and `large`:

```vue
<template>
	<!-- Small (14×14px) -->
	<Checkbox v-model="isChecked" label="Small checkbox" size="small" />

	<!-- Medium (16×16px - default) -->
	<Checkbox v-model="isChecked" label="Medium checkbox" />

	<!-- Large (18×18px) -->
	<Checkbox v-model="isChecked" label="Large checkbox" size="large" />
</template>
```

### Label Placement

By default, the label appears to the left of the checkbox. You can change this with the `labelPlacement` prop:

```vue
<template>
	<!-- Label on the left (default) -->
	<Checkbox v-model="isChecked" label="Enable feature:" />

	<!-- Label on the right -->
	<Checkbox v-model="isChecked" label="Enable feature" label-placement="right" />
</template>
```

### With Slot Content

```vue
<template>
	<Checkbox v-model="mergeContext">
		<span>Merge context</span>
	</Checkbox>
</template>
```

### Disabled State

```vue
<template>
	<Checkbox v-model="isChecked" label="Disabled option" :disabled="true" />
</template>
```

### Using @update:model-value

```vue
<template>
	<Checkbox :model-value="config.enabled" @update:model-value="handleChange" />
</template>

<script setup lang="ts">
function handleChange(value: boolean) {
	// Handle the change
	console.log('Checkbox changed to:', value);
}
</script>
```

## Props

| Prop             | Type                             | Required | Default     | Description                                                            |
| ---------------- | -------------------------------- | -------- | ----------- | ---------------------------------------------------------------------- |
| `modelValue`     | `boolean`                        | Yes      | -           | The checked state of the checkbox                                      |
| `label`          | `string`                         | No       | `undefined` | Optional label text to display next to checkbox                        |
| `labelPlacement` | `'left' \| 'right'`              | No       | `'left'`    | Position of the label relative to the checkbox                         |
| `size`           | `'small' \| 'medium' \| 'large'` | No       | `'medium'`  | Size of the checkbox (small: 14×14px, medium: 16×16px, large: 18×18px) |
| `disabled`       | `boolean`                        | No       | `false`     | Whether the checkbox is disabled                                       |

## Events

| Event               | Payload   | Description                         |
| ------------------- | --------- | ----------------------------------- |
| `update:modelValue` | `boolean` | Emitted when checkbox state changes |

## Styling

The component uses a flat, modern design with the extension's color palette:

- Primary color: `#1D4990` (blue) - solid, no gradient
- Unchecked border: `#d1d5db` (neutral gray)
- Text color: `#374151` (dark gray)
- Border radius: `2px` (minimal, modern)
- Size: `16px × 16px` (compact)
- Font size: `12px` (matches surrounding text)

The checkbox includes:

- Flat design aesthetic with no shadows or elevation
- Smooth scale animation for the checkmark
- Focus outline for accessibility
- Hover state with darker blue on checked state
- Fast transitions (0.1s-0.15s) for responsive feel

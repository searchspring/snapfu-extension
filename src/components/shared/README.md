# Shared Components

This directory contains reusable UI components that can be used throughout the Snapfu extension, not limited to specific views.

## Components

### Checkbox (`checkbox.vue`)

A flat, modern checkbox component with smooth animations and the extension's design aesthetic.

**Features:**
- Custom SVG checkmark icon
- Flat solid color background when checked (no gradients)
- Compact 16×16px size that aligns well with text
- Hover and focus states with accessibility support
- v-model support
- Optional label with configurable placement (left or right)
- Slot content support

**Usage:**
```vue
<Checkbox v-model="isChecked" label="Enable feature:" />
<Checkbox v-model="isChecked" label="Enable feature" label-placement="right" />
```

See [CHECKBOX_USAGE.md](./CHECKBOX_USAGE.md) for detailed documentation.

---

### Loading Pulse (`loading-pulse.vue`)

An animated logo loader using pulsing brick animations.

**Features:**
- Athos logo with sequential brick pulse animation
- Uses extension color palette (#1D4990, #00AEEF)
- Configurable animation timing

**Usage:**
```vue
<LoadingPulse />
```

**Sizing:**
- Small: 14×14px with 11px font
- Medium: 16×16px with 12px font (default)
- Large: 18×18px with 13px font

**Styling:**
- Width: 40px × 40px
- Animation: 1.6s ease-in-out infinite
- Staggered delays: 0s, 0.2s, 0.4s, 0.6s

---

### Loading Cube (`loading-cube.vue`)

A 3D rotating cube loader featuring the Athos logo on all faces.

**Features:**
- Full 3D cube rotation animation
- Logo appears on all 6 faces
- Configurable rotation speed
- CSS 3D transforms with perspective

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `speed` | `number` | `3` | Animation duration in seconds |

**Usage:**
```vue
<LoadingCube />
<LoadingCube :speed="5" />
```

**Styling:**
- Width: 40px × 40px
- 3D perspective: 1000px
- Infinite rotation on X and Y axes
- Face colors alternate between #1D4990 and #00AEEF

---

## Design Guidelines

All shared components follow the extension's design system:

**Colors:**
- Primary Blue: `#1D4990`
- Light Blue: `#00AEEF` / `#4c76c8`
- Accent Pink: `#f2647c`
- Text: `#2c3e50`

**Typography:**
- Font Family: 'Avenir', Helvetica, Arial, sans-serif
- Font smoothing: antialiased

**Animations:**
- Easing: `ease`, `ease-in-out`, or cubic-bezier for natural motion
- Duration: 0.15s - 0.25s for interactions, longer for loaders
- Transforms: Use translateY, scale for micro-interactions

**Spacing:**
- Border radius: 3px for small elements
- Padding: Consistent multiples of 5px
- Gaps: 5px, 8px, 10px, 12px

## Adding New Shared Components

When creating new shared components:

1. **Name:** Use simple, descriptive names without prefixes (e.g., `button.vue`, not `popup-button.vue`)
2. **Props:** Define clear TypeScript interfaces
3. **Events:** Use standard v-model patterns where applicable
4. **Styling:** Use scoped SCSS and follow the design system
5. **Documentation:** Add usage examples in comments or separate docs
6. **Accessibility:** Include proper ARIA attributes and keyboard support

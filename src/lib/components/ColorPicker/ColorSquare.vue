<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  hue: number
  saturation: number
  luminance: number
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:saturation': [value: number]
  'update:luminance': [value: number]
  'commit': []
}>()

const el = ref<HTMLDivElement>()

const squareStyle = computed(() => ({
  '--picker-hue': `${props.hue}`,
}))

const crosshairStyle = computed(() => ({
  left: `${props.saturation}%`,
  top: `${100 - props.luminance}%`,
}))

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n))
}

function positionFromEvent(e: PointerEvent) {
  if (!el.value || props.disabled) return
  const rect = el.value.getBoundingClientRect()
  const x = clamp(((e.clientX - rect.left) / rect.width) * 100)
  const y = clamp(((e.clientY - rect.top) / rect.height) * 100)
  // y is inverted: 0 = top (100% luminance), 100 = bottom (0% luminance)
  emit('update:saturation', x)
  emit('update:luminance', clamp(100 - y))
}

let isDragging = false

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return
  isDragging = true
  el.value?.setPointerCapture(e.pointerId)
  positionFromEvent(e)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging || props.disabled) return
  positionFromEvent(e)
}

function onPointerUp() {
  if (!isDragging) return
  isDragging = false
  emit('commit')
}

function onKeyDown(e: KeyboardEvent) {
  if (props.disabled) return
  const step = e.shiftKey ? 1 : 10
  let newS = props.saturation
  let newL = props.luminance

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      newL = clamp(newL + step)
      break
    case 'ArrowDown':
      e.preventDefault()
      newL = clamp(newL - step)
      break
    case 'ArrowLeft':
      e.preventDefault()
      newS = clamp(newS - step)
      break
    case 'ArrowRight':
      e.preventDefault()
      newS = clamp(newS + step)
      break
    default:
      return
  }

  emit('update:saturation', newS)
  emit('update:luminance', newL)
  emit('commit')
}
</script>

<template>
  <div
    ref="el"
    class="colorSquare"
    :class="{ colorSquareDisabled: disabled }"
    :style="squareStyle"
    role="slider"
    aria-label="Saturation and lightness"
    :aria-valuetext="`Saturation ${saturation}%, Lightness ${luminance}%`"
    :tabindex="disabled ? -1 : 0"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @keydown="onKeyDown"
  >
    <div class="crosshair" :style="crosshairStyle" />
  </div>
</template>

<style scoped>
.colorSquare {
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: calc(var(--agala-radius) - 4px);
  border: var(--agala-border-width) solid hsl(var(--agala-border));
  cursor: crosshair;
  user-select: none;
  outline: none;
  background:
    linear-gradient(to top, #000, transparent),
    linear-gradient(to right, #fff, hsl(var(--picker-hue), 100%, 50%));
}

.colorSquare:focus-visible {
  box-shadow: 0 0 0 2px hsl(var(--agala-background)),
              0 0 0 4px hsl(var(--agala-ring));
}

.colorSquareDisabled {
  opacity: 0.5;
  pointer-events: none;
}

.crosshair {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  transform: translate(-50%, -50%);
}
</style>

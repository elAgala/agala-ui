<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'commit': []
}>()

const el = ref<HTMLDivElement>()

function clampHue(n: number): number {
  return Math.max(0, Math.min(360, n))
}

function hueFromEvent(e: PointerEvent) {
  if (!el.value || props.disabled) return
  const rect = el.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  emit('update:modelValue', clampHue(x * 360))
}

let isDragging = false

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return
  isDragging = true
  el.value?.setPointerCapture(e.pointerId)
  hueFromEvent(e)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging || props.disabled) return
  hueFromEvent(e)
}

function onPointerUp() {
  if (!isDragging) return
  isDragging = false
  emit('commit')
}

function onKeyDown(e: KeyboardEvent) {
  if (props.disabled) return
  let newH = props.modelValue

  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      e.preventDefault()
      newH = clampHue(newH - 5)
      break
    case 'ArrowRight':
    case 'ArrowUp':
      e.preventDefault()
      newH = clampHue(newH + 5)
      break
    case 'PageDown':
      e.preventDefault()
      newH = clampHue(newH - 30)
      break
    case 'PageUp':
      e.preventDefault()
      newH = clampHue(newH + 30)
      break
    case 'Home':
      e.preventDefault()
      newH = 0
      break
    case 'End':
      e.preventDefault()
      newH = 360
      break
    default:
      return
  }

  emit('update:modelValue', newH)
  emit('commit')
}

const thumbLeft = () => `${(props.modelValue / 360) * 100}%`
</script>

<template>
  <div
    ref="el"
    class="hueSlider"
    :class="{ hueSliderDisabled: disabled }"
    role="slider"
    aria-label="Hue"
    :aria-valuenow="modelValue"
    aria-valuemin="0"
    aria-valuemax="360"
    :tabindex="disabled ? -1 : 0"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @keydown="onKeyDown"
  >
    <div class="hueThumb" :style="{ left: thumbLeft() }" />
  </div>
</template>

<style scoped>
.hueSlider {
  position: relative;
  width: 100%;
  height: 12px;
  border-radius: 9999px;
  border: var(--agala-border-width) solid hsl(var(--agala-border));
  cursor: pointer;
  user-select: none;
  outline: none;
  background: linear-gradient(
    to right,
    hsl(0, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  );
}

.hueSlider:focus-visible {
  box-shadow: 0 0 0 2px hsl(var(--agala-background)),
              0 0 0 4px hsl(var(--agala-ring));
}

.hueSliderDisabled {
  opacity: 0.5;
  pointer-events: none;
}

.hueThumb {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #fff;
  box-shadow: var(--agala-shadow-sm);
  pointer-events: none;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>

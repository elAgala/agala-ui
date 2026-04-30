<script setup lang="ts">
import { ref } from 'vue'
import type { TooltipProps } from './types'

let _id = 0

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  delay: 300,
})

const tooltipId = `agala-tooltip-${++_id}`
const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function show() {
  timer = setTimeout(() => { visible.value = true }, props.delay)
}

function hide() {
  if (timer) { clearTimeout(timer); timer = null }
  visible.value = false
}
</script>

<template>
  <div
    class="tooltipWrapper"
    :class="props.class"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />

    <Transition name="tooltip">
      <div
        v-if="visible"
        :id="tooltipId"
        :class="['tooltip', `tooltip-${placement}`]"
        role="tooltip"
      >
        {{ content }}
        <span :class="['arrow', `arrow-${placement}`]" aria-hidden="true" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tooltipWrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tooltip {
  position: absolute;
  z-index: var(--agala-z-dropdown);
  padding: 0.375rem 0.625rem;
  background-color: hsl(var(--agala-foreground));
  color: hsl(var(--agala-background));
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-sm);
  line-height: var(--agala-line-height-normal);
  border-radius: var(--agala-radius-sm);
  white-space: nowrap;
  pointer-events: none;
  box-shadow: var(--agala-shadow-md);
}

/* Placement */
.tooltip-top    { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.tooltip-bottom { top: calc(100% + 8px);    left: 50%; transform: translateX(-50%); }
.tooltip-left   { right: calc(100% + 8px);  top: 50%;  transform: translateY(-50%); }
.tooltip-right  { left: calc(100% + 8px);   top: 50%;  transform: translateY(-50%); }

/* Arrow */
.arrow {
  position: absolute;
  width: 0;
  height: 0;
}

.arrow-top {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid hsl(var(--agala-foreground));
}

.arrow-bottom {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid hsl(var(--agala-foreground));
}

.arrow-left {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid hsl(var(--agala-foreground));
}

.arrow-right {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid hsl(var(--agala-foreground));
}

/* Transition */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity var(--agala-transition-fast);
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { AgalaIcon } from '../AgalaIcon'
import type { DevEnvBannerProps } from './types'

const props = withDefaults(defineProps<DevEnvBannerProps>(), {
  text: 'ATENCIÓN: Esto es un ambiente inestable de desarrollo',
})

const el = useTemplateRef('banner')

function close() {
  el.value?.remove()
}
</script>

<template>
  <div ref="banner" :class="['banner', props.class]">
    <span class="text">{{ text }}</span>
    <button
      type="button"
      class="closeBtn"
      aria-label="Cerrar aviso"
      @click="close"
    >
      <AgalaIcon name="x" :size="16" />
    </button>
  </div>
</template>

<style scoped>
.banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 1rem;
  background: hsl(var(--agala-warning));
  color: hsl(var(--agala-warning-foreground));
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-sm);
  font-weight: var(--agala-font-weight-semibold);
  text-align: center;
}

.text {
  padding-right: 1.5rem;
}

.closeBtn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: var(--agala-radius-sm);
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background-color var(--agala-transition-fast);
}

.closeBtn:hover {
  background-color: hsl(var(--agala-warning-foreground) / 0.15);
}

.closeBtn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-warning-foreground) / 0.4);
}
</style>

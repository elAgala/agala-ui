<script setup lang="ts">
import { ref, computed } from 'vue'
import { AgalaIcon } from '../AgalaIcon'
import type { AvatarProps, AvatarSize } from './types'

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
})

const imgError = ref(false)

const sizeMap: Record<AvatarSize, string> = {
  xs: 'avatarXs',
  sm: 'avatarSm',
  md: 'avatarMd',
  lg: 'avatarLg',
  xl: 'avatarXl',
}

const iconSizeMap: Record<AvatarSize, number> = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
}

const cls = computed(() => [
  'avatar',
  sizeMap[props.size],
  props.class,
].filter(Boolean).join(' '))

const iconSize = computed(() => iconSizeMap[props.size])
const displayFallback = computed(() => props.fallback?.slice(0, 2).toUpperCase() || '')
</script>

<template>
  <span :class="cls">
    <img
      v-if="src && !imgError"
      :src="src"
      :alt="alt"
      class="avatarImg"
      @error="imgError = true"
    />
    <span v-else-if="displayFallback" class="avatarFallback" aria-hidden="true">
      {{ displayFallback }}
    </span>
    <AgalaIcon v-else name="user" :size="iconSize" aria-hidden="true" />
  </span>
</template>

<style scoped>
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: hsl(var(--agala-muted));
  color: hsl(var(--agala-muted-foreground));
  overflow: hidden;
  flex-shrink: 0;
  font-family: var(--agala-font-sans);
  font-weight: var(--agala-font-weight-medium);
  border: var(--agala-border-width) solid hsl(var(--agala-border));
}

.avatarImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatarFallback {
  line-height: 1;
  text-transform: uppercase;
}

/* Sizes */
.avatarXs { width: 1.5rem;  height: 1.5rem;  font-size: 0.5rem; }
.avatarSm { width: 2rem;    height: 2rem;    font-size: var(--agala-font-size-sm); }
.avatarMd { width: 2.5rem;  height: 2.5rem;  font-size: var(--agala-font-size-base); }
.avatarLg { width: 3rem;    height: 3rem;    font-size: var(--agala-font-size-lg); }
.avatarXl { width: 4rem;    height: 4rem;    font-size: 1.25rem; }
</style>

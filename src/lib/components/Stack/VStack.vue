<script setup lang="ts">
import Stack from './Stack.vue'
import type { StackProps } from './types'

const props = defineProps<Omit<StackProps, 'direction'>>()
</script>

<template>
  <Stack v-bind="props" direction="vertical">
    <slot />
  </Stack>
</template>

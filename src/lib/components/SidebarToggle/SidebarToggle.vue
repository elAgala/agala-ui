<script setup lang="ts">
import Button from '../Button/Button.vue'
import { AgalaIcon } from '../AgalaIcon'
import type { SidebarToggleProps } from './types'

withDefaults(defineProps<SidebarToggleProps>(), {
  ariaLabel: 'Toggle sidebar',
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    :aria-expanded="ariaExpanded"
    :aria-controls="ariaControls"
    :aria-label="ariaLabel"
    @click="$emit('click')"
  >
    <AgalaIcon name="panel-left" :size="18" />
  </Button>
</template>

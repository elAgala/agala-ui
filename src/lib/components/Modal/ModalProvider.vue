<script setup lang="ts">
import { computed } from 'vue'
import { modalManager, renderModalEntry } from './ModalManager'

const top = computed(() => {
  const modals = modalManager.modals
  return modals[modals.length - 1]
})
</script>

<template>
  <Teleport to="body" v-if="top">
    <component :is="renderModalEntry(top)" />
  </Teleport>
</template>

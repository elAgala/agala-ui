<script setup lang="ts">
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="$props.class" style="display: flex; align-items: center; justify-content: center">
    <slot />
  </div>
</template>

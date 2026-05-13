<script setup lang="ts">
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="$props.class" style="flex: 1; min-width: 0; min-height: 0" />
</template>

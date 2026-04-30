<script setup lang="ts">
import Toast from './Toast.vue'
import { toastManager } from './ToastManager'
</script>

<template>
  <Teleport to="body">
    <div class="toastContainer" aria-label="Notifications">
      <Toast
        v-for="toast in toastManager.state.toasts"
        :key="toast.id"
        :toast="toast"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.toastContainer {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: var(--agala-z-modal);
  pointer-events: none;
}

.toastContainer > :deep(*) {
  pointer-events: auto;
}
</style>

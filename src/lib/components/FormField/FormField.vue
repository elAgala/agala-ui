<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  helper?: string
  error?: string
  disabled?: boolean
  htmlFor?: string
  required?: boolean
}>(), {
  disabled: false,
  required: false,
})

const labelCls = computed(() => [
  'label',
  props.disabled ? 'labelDisabled' : undefined,
].filter(Boolean).join(' '))
</script>

<template>
  <div class="field">
    <label
      v-if="label"
      :for="htmlFor"
      :class="labelCls"
    >
      {{ label }}
      <span v-if="required" class="required" aria-hidden="true"> *</span>
    </label>
    <slot />
    <p v-if="error" class="errorText">{{ error }}</p>
    <p v-else-if="helper" class="helperText">{{ helper }}</p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.label {
  font-size: var(--agala-font-size-sm);
  font-weight: var(--agala-font-weight-medium);
  color: hsl(var(--agala-foreground));
  line-height: 1;
}

.labelDisabled {
  color: hsl(var(--agala-muted-foreground));
}

.required {
  color: hsl(var(--agala-danger));
}

.helperText {
  font-size: var(--agala-font-size-sm);
  color: hsl(var(--agala-muted-foreground));
  line-height: var(--agala-line-height-normal);
  margin: 0;
}

.errorText {
  font-size: var(--agala-font-size-sm);
  color: hsl(var(--agala-danger));
  line-height: var(--agala-line-height-normal);
  margin: 0;
}
</style>

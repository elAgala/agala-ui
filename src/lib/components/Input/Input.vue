<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { AgalaIcon } from '../AgalaIcon'
import type { InputVariant, InputSize } from './types'

const props = withDefaults(defineProps<{
  modelValue?: string
  size?: InputSize
  variant?: InputVariant
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  readonly?: boolean
  iconStart?: boolean
  iconEnd?: boolean
  type?: string
  placeholder?: string
  wrapperClass?: string
  class?: string
}>(), {
  size: 'md',
  variant: 'default',
  error: false,
  disabled: false,
  readonly: false,
  iconStart: false,
  iconEnd: false,
  type: 'text',
  wrapperClass: '',
  class: '',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const effectiveType = computed(() => {
  if (props.type === 'password' && showPassword.value) return 'text'
  return props.type
})

const endIconName = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'eye-off' : 'eye'
  return 'search'
})

function handleEndIconClick() {
  if (props.type === 'password' && inputRef.value) {
    const value = inputRef.value.value
    showPassword.value = !showPassword.value
    // Changing input type resets the value in the DOM (browser behavior).
    // Restore it after Vue reconciles.
    if (value) {
      nextTick(() => {
        if (inputRef.value) inputRef.value.value = value
      })
    }
  }
}

const sizeMap: Record<InputSize, string> = {
  sm: 'inputSm',
  md: 'inputMd',
  lg: 'inputLg',
}

const cls = computed(() => [
  'input',
  sizeMap[props.size],
  props.iconStart ? 'hasIconStart' : undefined,
  props.iconEnd ? 'hasIconEnd' : undefined,
  props.error ? 'inputError' : undefined,
  props.readonly ? 'inputReadonly' : undefined,
  props.class,
].filter(Boolean).join(' '))
</script>

<template>
  <div class="inputWrapper" :class="$props.wrapperClass">
    <div class="field">
      <span v-if="iconStart" class="iconStart" aria-hidden="true">
        <AgalaIcon name="search" :size="14" />
      </span>
      <input
        ref="inputRef"
        :class="cls"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="error"
        :type="effectiveType"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span
        v-if="iconEnd"
        class="iconEnd"
        :class="{ iconEndClickable: type === 'password' }"
        :aria-label="type === 'password' ? (showPassword ? 'Hide password' : 'Show password') : undefined"
        :role="type === 'password' ? 'button' : undefined"
        :tabindex="type === 'password' ? 0 : undefined"
        aria-hidden="false"
        @click="handleEndIconClick"
        @keydown.enter.prevent="handleEndIconClick"
        @keydown.space.prevent="handleEndIconClick"
      >
        <AgalaIcon :name="endIconName" :size="14" />
      </span>
    </div>
    <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.inputWrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.field {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  height: var(--agala-height-md);
  border: var(--agala-border-width) solid hsl(var(--agala-input));
  border-radius: calc(var(--agala-radius) - 2px);
  background-color: hsl(var(--agala-input-background, var(--agala-background)));
  color: hsl(var(--agala-foreground));
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-base);
  line-height: var(--agala-line-height-normal);
  padding: 0 0.75rem;
  transition:
    border-color var(--agala-transition-fast),
    box-shadow var(--agala-transition-fast);
  outline: none;
}

.input::placeholder {
  color: hsl(var(--agala-muted-foreground));
}

.input:focus {
  border-color: hsl(var(--agala-ring));
  box-shadow:
    0 0 0 1px hsl(var(--agala-background)),
    0 0 0 3px hsl(var(--agala-ring) / 0.2);
}

.input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: hsl(var(--agala-muted));
}

.inputReadonly {
  cursor: default;
}

/* Error */
.inputError {
  border-color: hsl(var(--agala-danger));
}
.inputError:focus {
  border-color: hsl(var(--agala-danger));
  box-shadow:
    0 0 0 1px hsl(var(--agala-background)),
    0 0 0 3px hsl(var(--agala-danger) / 0.2);
}

/* Icons */
.iconStart {
  position: absolute;
  left: 0.625rem;
  color: hsl(var(--agala-muted-foreground));
  pointer-events: none;
  display: inline-flex;
  align-items: center;
}

.iconEnd {
  position: absolute;
  right: 0.625rem;
  color: hsl(var(--agala-muted-foreground));
  display: inline-flex;
  align-items: center;
}

.iconEndClickable {
  cursor: pointer;
}
.iconEndClickable:hover {
  color: hsl(var(--agala-foreground));
}

.hasIconStart {
  padding-left: 2.25rem;
}

.hasIconEnd {
  padding-right: 2.25rem;
}

/* Sizes */
.inputSm {
  height: var(--agala-height-sm);
  font-size: var(--agala-font-size-sm);
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}
.inputSm.hasIconStart { padding-left: 2rem; }
.inputSm.hasIconEnd   { padding-right: 2rem; }

.inputMd {
  height: var(--agala-height-md);
}

.inputLg {
  height: var(--agala-height-lg);
  font-size: var(--agala-font-size-lg);
  padding-left: 1rem;
  padding-right: 1rem;
}
.inputLg.hasIconStart { padding-left: 2.5rem; }
.inputLg.hasIconEnd   { padding-right: 2.5rem; }

/* Error text */
.errorMessage {
  font-size: var(--agala-font-size-sm);
  color: hsl(var(--agala-danger));
  line-height: var(--agala-line-height-normal);
}
</style>

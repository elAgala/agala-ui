export type ColorPickerSize = 'sm' | 'md' | 'lg'

export interface ColorPickerProps {
  modelValue?: string
  size?: ColorPickerSize
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  placeholder?: string
  clearable?: boolean
  class?: string
}

export interface ColorPickerEmits {
  'update:modelValue': [value: string]
}

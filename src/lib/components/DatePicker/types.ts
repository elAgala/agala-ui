export type DatePickerSize = 'sm' | 'md' | 'lg'

export interface DatePickerProps {
  modelValue?: string
  size?: DatePickerSize
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  placeholder?: string
  min?: string
  max?: string
  clearable?: boolean
  class?: string
}

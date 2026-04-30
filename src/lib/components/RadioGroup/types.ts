export type RadioOrientation = 'vertical' | 'horizontal'

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupProps {
  modelValue?: string
  options: RadioOption[]
  orientation?: RadioOrientation
  disabled?: boolean
  error?: boolean
  class?: string
}

export type InputVariant = 'default' | 'ghost'
export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps {
  modelValue?: string
  size?: InputSize
  variant?: InputVariant
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  readonly?: boolean
  iconStart?: string
  iconEnd?: string
  type?: string
  placeholder?: string
}

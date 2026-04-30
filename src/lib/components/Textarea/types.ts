export type TextareaResize = 'none' | 'vertical' | 'both'

export interface TextareaProps {
  modelValue?: string
  rows?: number
  resize?: TextareaResize
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  placeholder?: string
  class?: string
}

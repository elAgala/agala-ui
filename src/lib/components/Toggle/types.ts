export type ToggleSize = 'sm' | 'md' | 'lg'

export interface ToggleProps {
  modelValue?: boolean
  size?: ToggleSize
  disabled?: boolean
  class?: string
}

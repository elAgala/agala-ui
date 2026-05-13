export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  block?: boolean
  icon?: string
  disabled?: boolean
  class?: string
}

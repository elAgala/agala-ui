export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'subtle' | 'success' | 'warning' | 'danger'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  color?: string
  class?: string
}

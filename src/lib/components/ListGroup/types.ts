export type ListGroupRadius = 'none' | 'sm' | 'md' | 'lg'

export interface ListGroupProps {
  gap?: string
  borderless?: boolean
  dividers?: boolean
  class?: string
}

export type ListGroupItemVariant = 'default' | 'danger'

export interface ListGroupItemProps {
  label: string
  subtitle?: string
  icon?: string
  badge?: string | number
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  disabled?: boolean
  variant?: ListGroupItemVariant
  radius?: ListGroupRadius
  actionIcon?: string
  class?: string
}

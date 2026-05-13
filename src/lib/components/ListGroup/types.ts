export interface ListGroupProps {
  gap?: string
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
  class?: string
}

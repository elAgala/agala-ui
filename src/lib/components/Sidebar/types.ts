export interface SidebarProps {
  collapsed?: boolean
  width?: string
  collapsedWidth?: string
  class?: string
}

export interface SidebarGroupProps {
  label?: string
  class?: string
}

export type SidebarItemBadgeVariant = 'default' | 'warning' | 'danger' | 'success'

export type SidebarItemDotVariant = 'primary' | 'danger' | 'warning' | 'success'

import type { IconName } from '../AgalaIcon/types'

export interface SidebarItemProps {
  icon?: IconName
  label?: string
  active?: boolean
  badge?: string | number
  badgeVariant?: SidebarItemBadgeVariant
  dot?: boolean
  dotVariant?: SidebarItemDotVariant
  disabled?: boolean
  class?: string
}

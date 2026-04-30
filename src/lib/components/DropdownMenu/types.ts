import type { IconName } from '../AgalaIcon/types'

export type DropdownMenuPlacement = 'bottom-start' | 'bottom-end'
export type DropdownMenuItemVariant = 'default' | 'danger'

export interface DropdownMenuItem {
  label?: string
  icon?: IconName
  variant?: DropdownMenuItemVariant
  disabled?: boolean
  separator?: boolean
  onClick?: () => void
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[]
  placement?: DropdownMenuPlacement
  class?: string
}

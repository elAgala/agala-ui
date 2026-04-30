export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerProps {
  open: boolean
  title?: string
  placement?: DrawerPlacement
  size?: string
  dismissible?: boolean
  escapeCloses?: boolean
  class?: string
}

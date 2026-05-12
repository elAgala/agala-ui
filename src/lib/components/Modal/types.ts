export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalOptions {
  size?: ModalSize
  title?: string
  dismissible?: boolean
  escapeCloses?: boolean
  hideHeader?: boolean
}

export type ModalResult = { confirmed: true } | { confirmed: false }

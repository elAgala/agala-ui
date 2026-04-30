export type ToastVariant = 'default' | 'success' | 'warning' | 'danger'

export interface ToastOptions {
  message: string
  variant?: ToastVariant
  duration?: number
  action?: { label: string; onClick: () => void }
}

export interface ToastItem extends ToastOptions {
  id: string
  variant: ToastVariant
  duration: number
  leaving: boolean
}

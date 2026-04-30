export type ProgressVariant = 'linear' | 'circular'
export type ProgressSize = 'sm' | 'md' | 'lg'
export type ProgressColor = 'primary' | 'success' | 'warning' | 'danger'

export interface ProgressProps {
  value?: number
  variant?: ProgressVariant
  size?: ProgressSize
  color?: ProgressColor
  indeterminate?: boolean
  class?: string
}

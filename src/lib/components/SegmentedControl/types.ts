export type SegmentedControlVariant = 'primary' | 'danger' | 'success' | 'warning' | 'info'

export type SegmentedControlSize = 'sm' | 'md' | 'lg'

export interface SegmentedControlOption {
  value: string
  label: string
  variant?: SegmentedControlVariant
  disabled?: boolean
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[]
  modelValue: string
  size?: SegmentedControlSize
  disabled?: boolean
  class?: string
}

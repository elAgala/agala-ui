export type SkeletonVariant = 'line' | 'circle' | 'rect'

export interface SkeletonProps {
  width?: string
  height?: string
  variant?: SkeletonVariant
  class?: string
}

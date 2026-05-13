export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: string
  shape?: 'circle' | 'rounded' | 'square'
  class?: string
}

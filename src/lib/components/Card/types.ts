export type CardPadding = 'none' | 'sm' | 'md' | 'lg'
export type CardAccent = 'top' | 'left' | 'right' | 'bottom'

export interface CardProps {
  padding?: CardPadding
  class?: string
  accent?: CardAccent
  accentColor?: string
}

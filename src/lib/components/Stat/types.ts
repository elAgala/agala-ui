export type StatTrend = 'up' | 'down' | 'neutral'

export interface StatProps {
  label: string
  value: string | number
  trend?: number
  trendLabel?: string
  class?: string
}

export type StatTrend = 'up' | 'down' | 'neutral'

export interface StatProps {
  label: string
  value: string | number
  trend?: number
  trendLabel?: string
  bordered?: boolean
  labelTransform?: string
  class?: string
}

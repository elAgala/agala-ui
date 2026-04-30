export interface TabItem {
  value: string
  label: string
  disabled?: boolean
}

export interface TabsProps {
  modelValue: string
  tabs: TabItem[]
  class?: string
}

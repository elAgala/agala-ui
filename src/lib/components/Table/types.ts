export type SortDir = 'asc' | 'desc'
export type ColumnAlign = 'left' | 'center' | 'right'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: ColumnAlign
}

export interface TableProps {
  columns: TableColumn[]
  rows: Record<string, unknown>[]
  selectable?: boolean
  selectedRows?: string[]
  sortKey?: string
  sortDir?: SortDir
  loading?: boolean
  emptyMessage?: string
  rowKey?: string
  class?: string
}

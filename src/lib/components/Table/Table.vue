<script setup lang="ts">
import { computed } from 'vue'
import { Checkbox } from '../Checkbox'
import { AgalaIcon } from '../AgalaIcon'
import type { TableColumn, TableProps, SortDir, ColumnAlign } from './types'

const props = withDefaults(defineProps<TableProps>(), {
  selectable: false,
  loading: false,
  emptyMessage: 'No data available.',
  rowKey: 'id',
})

const emit = defineEmits<{
  'update:selectedRows': [value: string[]]
  'update:sortKey': [value: string]
  'update:sortDir': [value: SortDir]
  'row-click': [row: Record<string, unknown>]
}>()

/* ─── Selection ─── */
const selectedSet = computed(() => new Set(props.selectedRows ?? []))

const allSelected = computed(() =>
  props.rows.length > 0 &&
  props.rows.every(r => selectedSet.value.has(String(r[props.rowKey])))
)

const someSelected = computed(() =>
  props.rows.some(r => selectedSet.value.has(String(r[props.rowKey]))) &&
  !allSelected.value
)

function toggleRow(key: string) {
  const current = [...(props.selectedRows ?? [])]
  const idx = current.indexOf(key)
  if (idx > -1) current.splice(idx, 1)
  else current.push(key)
  emit('update:selectedRows', current)
}

function toggleAll() {
  if (allSelected.value) {
    emit('update:selectedRows', [])
  } else {
    emit('update:selectedRows', props.rows.map(r => String(r[props.rowKey])))
  }
}

/* ─── Sort ─── */
function toggleSort(key: string) {
  if (props.sortKey === key) {
    emit('update:sortDir', props.sortDir === 'asc' ? 'desc' : 'asc')
  } else {
    emit('update:sortKey', key)
    emit('update:sortDir', 'asc')
  }
}

function sortIconName(key: string) {
  if (props.sortKey !== key) return 'arrow-down' as const
  return props.sortDir === 'asc' ? 'arrow-up' as const : 'arrow-down' as const
}

/* ─── Alignment ─── */
const alignMap: Record<ColumnAlign, string> = {
  left:   'alignLeft',
  center: 'alignCenter',
  right:  'alignRight',
}

function thCls(col: TableColumn) {
  return ['th', col.align ? alignMap[col.align] : undefined].filter(Boolean).join(' ')
}

function tdCls(col: TableColumn) {
  return ['td', col.align ? alignMap[col.align] : undefined].filter(Boolean).join(' ')
}

const colSpan = computed(() => props.columns.length + (props.selectable ? 1 : 0))
</script>

<template>
  <div class="tableWrapper" :class="props.class">
    <table class="table">
      <thead class="thead">
        <tr class="trHead">
          <th v-if="selectable" class="th thCheck">
            <Checkbox
              :model-value="allSelected"
              :indeterminate="someSelected"
              @update:model-value="toggleAll"
            />
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="thCls(col)"
            :style="col.width ? { width: col.width } : undefined"
          >
            <button v-if="col.sortable" class="sortBtn" @click="toggleSort(col.key)">
              {{ col.label }}
              <AgalaIcon
                :name="sortIconName(col.key)"
                :size="12"
                :class="['sortIcon', sortKey === col.key ? 'sortIconActive' : undefined].filter(Boolean).join(' ')"
              />
            </button>
            <span v-else>{{ col.label }}</span>
          </th>
        </tr>
      </thead>

      <tbody class="tbody">
        <!-- Loading skeleton rows -->
        <template v-if="loading">
          <tr v-for="i in 5" :key="i" class="trLoading">
            <td v-if="selectable" class="td tdCheck">
              <span class="skeletonBox" style="width: 1rem; height: 1rem; border-radius: calc(var(--agala-radius) * 0.5);" />
            </td>
            <td v-for="col in columns" :key="col.key" class="td">
              <span class="skeletonLine" :style="{ width: Math.random() > 0.5 ? '70%' : '50%' }" />
            </td>
          </tr>
        </template>

        <!-- Empty state -->
        <tr v-else-if="rows.length === 0">
          <td :colspan="colSpan" class="td tdEmpty">
            <slot name="empty">{{ emptyMessage }}</slot>
          </td>
        </tr>

        <!-- Data rows -->
        <template v-else>
          <tr
            v-for="row in rows"
            :key="String(row[rowKey])"
            class="tr"
            @click="emit('row-click', row)"
          >
            <td v-if="selectable" class="td tdCheck" @click.stop>
              <Checkbox
                :model-value="selectedSet.has(String(row[rowKey]))"
                @update:model-value="toggleRow(String(row[rowKey]))"
              />
            </td>
            <td v-for="col in columns" :key="col.key" :class="tdCls(col)">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div v-if="$slots.footer" class="tableFooter">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.tableWrapper {
  width: 100%;
  overflow-x: auto;
  border: var(--agala-table-border, var(--agala-border-width) solid hsl(var(--agala-border)));
  border-radius: var(--agala-table-radius, var(--agala-radius));
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-base);
}

/* Head */
.thead {
  background: var(--agala-table-header-bg, hsl(var(--agala-muted) / 0.5));
}

.trHead {
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
}

.th {
  padding: var(--agala-table-header-cell-padding, 0.625rem 1rem);
  text-align: left;
  font-size: var(--agala-table-header-font-size, var(--agala-font-size-sm));
  font-weight: var(--agala-table-header-weight, var(--agala-font-weight-semibold));
  color: var(--agala-table-header-color, hsl(var(--agala-muted-foreground)));
  white-space: nowrap;
}

.thCheck {
  width: 2.5rem;
  padding-left: 1rem;
  padding-right: 0.5rem;
}

/* Sort button */
.sortBtn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  cursor: pointer;
  white-space: nowrap;
}

.sortBtn:hover {
  color: hsl(var(--agala-foreground));
}

.sortIcon {
  opacity: 0.3;
  transition: opacity var(--agala-transition-fast);
}

.sortIconActive {
  opacity: 1;
  color: hsl(var(--agala-primary));
}

/* Body */
.tr {
  border-bottom: var(--agala-table-row-border, var(--agala-border-width) solid hsl(var(--agala-border)));
  transition: background-color var(--agala-transition-fast);
  cursor: default;
}

.tr:last-child {
  border-bottom: none;
}

.tr:hover {
  background: var(--agala-table-row-hover-bg, hsl(var(--agala-accent) / 0.5));
}

.td {
  padding: var(--agala-table-cell-padding, 0.75rem 1rem);
  font-size: var(--agala-table-cell-size, var(--agala-font-size-base));
  color: var(--agala-table-cell-color, hsl(var(--agala-foreground)));
  line-height: var(--agala-table-cell-line-height, var(--agala-line-height-normal));
  vertical-align: middle;
}

.tdCheck {
  width: 2.5rem;
  padding-left: 1rem;
  padding-right: 0.5rem;
}

.tdEmpty {
  text-align: center;
  color: var(--agala-table-empty-color, hsl(var(--agala-muted-foreground)));
  padding: var(--agala-table-empty-padding, 3rem 1rem);
}

/* Alignment */
.alignLeft   { text-align: left; }
.alignCenter { text-align: center; }
.alignRight  { text-align: right; }

/* Loading skeleton */
.trLoading {
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
}

.skeletonLine,
.skeletonBox {
  display: inline-block;
  height: 0.875rem;
  background: linear-gradient(
    90deg,
    hsl(var(--agala-muted)) 25%,
    hsl(var(--agala-border)) 50%,
    hsl(var(--agala-muted)) 75%
  );
  background-size: 200% 100%;
  border-radius: var(--agala-radius-sm);
  animation: shimmer 1.5s infinite;
}

.skeletonLine { width: 60%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Footer (pagination) */
.tableFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: var(--agala-table-footer-padding, 0.75rem 1rem);
  border-top: var(--agala-table-footer-border, var(--agala-border-width) solid hsl(var(--agala-border)));
  background: var(--agala-table-footer-bg, hsl(var(--agala-muted) / 0.3));
}
</style>

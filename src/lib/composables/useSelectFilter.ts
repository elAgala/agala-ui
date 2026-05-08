import { computed } from 'vue'
import type { SelectOption } from '../components/Select'

/**
 * Filters options by label and determines if the "create" option should be shown.
 */
export function useSelectFilter(
  query: { value: string },
  options: { value: SelectOption[] },
  labelKey: string = 'label'
) {
  const filteredOptions = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return options.value
    return options.value.filter((o) =>
      String(o[labelKey] ?? o.label).toLowerCase().includes(q)
    )
  })

  const exactMatch = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return false
    return options.value.some(
      (o) => String(o[labelKey] ?? o.label).toLowerCase() === q
    )
  })

  const showCreateOption = computed(() => {
    const q = query.value.trim()
    return q.length > 0 && !exactMatch.value
  })

  const createOptionLabel = computed(() => {
    const q = query.value.trim()
    return q ? `Crear "${q}"` : ''
  })

  return {
    filteredOptions,
    showCreateOption,
    createOptionLabel,
  }
}

import { computed } from 'vue'
import type { Ref } from 'vue'

export interface ChipItem {
  label: string
  value: string
}

/**
 * Builds chip data from selected values, handling phantom values (values
 * that exist in modelValue but not in options).
 */
export function useChipDisplay(
  modelValue: Ref<string[]>,
  options: { value: Array<Record<string, unknown>> },
  labelKey: string = 'label',
  idKey: string = 'value',
  maxDisplayed: number = 3,
  createdLabels?: Ref<Map<string, string>>
) {
  const chips = computed<ChipItem[]>(() => {
    return modelValue.value.map((val) => {
      const opt = options.value.find(
        (o) => String(o[idKey] ?? o['value']) === String(val)
      )
      return {
        label: opt
          ? String(opt[labelKey] ?? opt['label'] ?? val)
          : (createdLabels?.value.get(val) ?? String(val)),
        value: String(val),
      }
    })
  })

  const visibleChips = computed(() => chips.value.slice(0, maxDisplayed))
  const remainingCount = computed(() =>
    Math.max(0, chips.value.length - maxDisplayed)
  )

  function removeChip(value: string) {
    const idx = modelValue.value.findIndex(
      (v) => String(v) === String(value)
    )
    if (idx !== -1) {
      const updated = [...modelValue.value]
      updated.splice(idx, 1)
      modelValue.value = updated
    }
  }

  return {
    chips,
    visibleChips,
    remainingCount,
    removeChip,
  }
}

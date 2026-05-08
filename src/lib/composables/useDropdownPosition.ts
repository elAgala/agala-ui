import { type Ref, computed } from 'vue'

/**
 * Returns reactive dropdown positioning style based on the trigger element.
 * Position is fixed so it escapes overflow containers.
 */
export function useDropdownPosition(triggerRef: Ref<HTMLElement | undefined>) {
  const dropdownStyle = computed(() => {
    if (!triggerRef.value) return {}
    const rect = triggerRef.value.getBoundingClientRect()
    return {
      position: 'fixed' as const,
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    }
  })
  return { dropdownStyle }
}

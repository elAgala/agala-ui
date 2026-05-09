import { type Ref, ref } from 'vue'

/**
 * Returns reactive dropdown positioning style based on the trigger element.
 * Position is fixed so it escapes overflow containers.
 *
 * ⚠️  IMPORTANT: Position must be recomputed imperatively (via `recompute()`)
 *     inside `nextTick` when opening the dropdown. Do NOT use `computed()`
 *     for layout reads — element references don't change when elements move,
 *     so Vue's computed caching returns stale coordinates.
 */
export function useDropdownPosition(
  triggerRef: Ref<HTMLElement | undefined>,
  opts: { width?: 'trigger' | 'auto' } = {}
) {
  const dropdownStyle = ref<Record<string, string>>({
    position: 'fixed',
  })

  function recompute() {
    if (!triggerRef.value) return
    const rect = triggerRef.value.getBoundingClientRect()
    const style: Record<string, string> = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
    }
    if (opts.width !== 'auto') {
      style.width = `${rect.width}px`
    }
    dropdownStyle.value = style
  }

  return { dropdownStyle, recompute }
}

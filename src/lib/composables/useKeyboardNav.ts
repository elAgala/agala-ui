import { type Ref } from 'vue'

export interface FlatItem {
  type: 'option' | 'create'
  label: string
  value: string
  disabled?: boolean
}

/**
 * Keyboard navigation handler for a flat list of items.
 * Handles ArrowUp/Down, Enter, Escape, Backspace, Tab, Home/End.
 */
export function useKeyboardNav(
  flatItems: { value: FlatItem[] },
  highlightedIdx: Ref<number>,
  isOpen: Ref<boolean>,
  callbacks: {
    onSelect: (idx: number) => void
    onCreate: (idx: number) => void
    onClose: () => void
    onRemoveLast?: () => void
  }
) {
  function findNextIndex(dir: 1 | -1): number {
    let i = highlightedIdx.value
    for (let attempts = 0; attempts < flatItems.value.length; attempts++) {
      i += dir
      if (i < 0 || i >= flatItems.value.length) break
      const item = flatItems.value[i]
      if (!item.disabled) return i
    }
    return highlightedIdx.value
  }

  function findFirstEnabled(): number {
    return flatItems.value.findIndex((item) => !item.disabled)
  }

  function findLastEnabled(): number {
    return flatItems.value.findLastIndex((item) => !item.disabled)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!isOpen.value) return

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        highlightedIdx.value = findNextIndex(1)
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        highlightedIdx.value = findNextIndex(-1)
        break
      }
      case 'Home': {
        e.preventDefault()
        const first = findFirstEnabled()
        if (first >= 0) highlightedIdx.value = first
        break
      }
      case 'End': {
        e.preventDefault()
        const last = findLastEnabled()
        if (last >= 0) highlightedIdx.value = last
        break
      }
      case 'Enter': {
        e.preventDefault()
        const item = flatItems.value[highlightedIdx.value]
        if (!item || item.disabled) break
        if (item.type === 'create') {
          callbacks.onCreate(highlightedIdx.value)
        } else {
          callbacks.onSelect(highlightedIdx.value)
        }
        break
      }
      case 'Escape': {
        e.preventDefault()
        callbacks.onClose()
        break
      }
      case 'Tab': {
        callbacks.onClose()
        break
      }
      case 'Backspace': {
        if (callbacks.onRemoveLast) {
          callbacks.onRemoveLast()
        }
        break
      }
    }
  }

  return { handleKeyDown }
}

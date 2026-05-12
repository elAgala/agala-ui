import { watch, type Ref } from 'vue'

/**
 * Shared popover behavior: click-outside close, scroll close, resize reposition.
 *
 * Must be called inside a component's `<script setup>` block.
 *
 * @param isOpen       Reactive ref controlling popover visibility
 * @param wrapperRef   Ref to the trigger/wrapper element
 * @param floatingRef  Ref to the floating popover element
 * @param close        Callback to close the popover
 * @param recompute    Callback to recompute position (from useDropdownPosition)
 */
export function usePopoverBehavior(
  isOpen: Ref<boolean>,
  wrapperRef: Ref<HTMLElement | undefined | null>,
  floatingRef: Ref<HTMLElement | undefined | null>,
  close: () => void,
  recompute: () => void,
) {
  watch(isOpen, (open) => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        !wrapperRef.value?.contains(target) &&
        !floatingRef.value?.contains(target)
      ) {
        close()
      }
    }

    const handleScroll = (e: Event) => {
      if (!floatingRef.value?.contains(e.target as Node)) {
        close()
      }
    }

    const handleResize = () => recompute()

    document.addEventListener('mousedown', handleClick)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    watch(isOpen, (newOpen) => {
      if (!newOpen) {
        document.removeEventListener('mousedown', handleClick)
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleResize)
      }
    }, { once: true })
  })
}

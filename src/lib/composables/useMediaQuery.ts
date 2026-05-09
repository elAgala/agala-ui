import { ref, onUnmounted, type Ref } from 'vue'

/**
 * Lightweight composable that wraps `window.matchMedia`.
 * Returns a reactive `matches` ref that updates when the media query changes.
 *
 * @example
 * const { matches: isMobile } = useMediaQuery('(max-width: 639px)')
 */
export function useMediaQuery(query: string): { matches: Ref<boolean> } {
  const matches = ref(false)
  let mql: MediaQueryList | null = null

  function handler(event: MediaQueryListEvent) {
    matches.value = event.matches
  }

  if (typeof window !== 'undefined') {
    mql = window.matchMedia(query)
    matches.value = mql.matches
    mql.addEventListener('change', handler)
  }

  onUnmounted(() => {
    mql?.removeEventListener('change', handler)
  })

  return { matches }
}

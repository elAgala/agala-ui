import { reactive } from 'vue'
import type { ToastOptions, ToastItem } from './types'

const LEAVE_DURATION = 300
const MAX_TOASTS = 5

const state = reactive<{ toasts: ToastItem[] }>({ toasts: [] })

function show(options: ToastOptions): string {
  const id = Math.random().toString(36).slice(2)
  const item: ToastItem = {
    ...options,
    id,
    variant: options.variant ?? 'default',
    duration: options.duration ?? 4000,
    leaving: false,
  }

  if (state.toasts.length >= MAX_TOASTS) {
    dismiss(state.toasts[0].id)
  }

  state.toasts.push(item)

  if (item.duration > 0) {
    setTimeout(() => dismiss(id), item.duration)
  }

  return id
}

function dismiss(id: string) {
  const toast = state.toasts.find(t => t.id === id)
  if (!toast || toast.leaving) return
  toast.leaving = true
  setTimeout(() => {
    const idx = state.toasts.findIndex(t => t.id === id)
    if (idx !== -1) state.toasts.splice(idx, 1)
  }, LEAVE_DURATION)
}

export const toastManager = { state, show, dismiss }

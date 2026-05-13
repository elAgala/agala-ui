import { reactive, h, markRaw, type VNode, type Component } from 'vue'
import Modal from './Modal.vue'
import type { ModalResult, ModalOptions } from './types'

export interface ModalEntry<P = Record<string, unknown>> {
  id: number
  component: Component
  props: P
  options: ModalOptions
  resolve: (result: ModalResult) => void
}

const state = reactive<{
  modals: ModalEntry[]
}>({
  modals: [],
})

class ModalManagerImpl {
  private _idCounter = 0

  /**
   * Open a modal imperatively with a Vue component.
   * Returns a Promise that resolves when the modal is closed.
   *
   * @example
   * const result = await modalManager.open(MyConfirmDialog, {
   *   props: { message: 'Delete?' },
   *   size: 'sm',
   * })
   * if (result.confirmed) { … }
   */
  open<P extends Record<string, unknown>>(
    component: Component,
    options: ModalOptions & { props?: P } = {}
  ): Promise<ModalResult> {
    return new Promise((resolve) => {
      const id = ++this._idCounter
      const entry: ModalEntry<P> = {
        id,
        component: markRaw(component),
        props: options.props ?? ({} as P),
        options: {
          size: options.size,
          title: options.title,
          dismissible: options.dismissible,
          escapeCloses: options.escapeCloses,
          hideHeader: options.hideHeader,
        },
        resolve,
      }
      state.modals.push(entry as ModalEntry)
    })
  }

  /** Close the top-most modal */
  close(result: ModalResult = { confirmed: false }) {
    const current = state.modals[state.modals.length - 1]
    if (!current) return
    current.resolve(result)
    state.modals.pop()
  }

  /** Close all modals */
  closeAll(result: ModalResult = { confirmed: false }) {
    while (state.modals.length > 0) {
      const current = state.modals[state.modals.length - 1]
      current.resolve(result)
      state.modals.pop()
    }
  }

  get modals() {
    return state.modals
  }
}

export const modalManager = new ModalManagerImpl()

/** Helper to render a modal entry with its component */
export function renderModalEntry(entry: ModalEntry): VNode {
  return h(Modal, {
    open: true,
    title: entry.options.title,
    size: entry.options.size,
    dismissible: entry.options.dismissible,
    escapeCloses: entry.options.escapeCloses,
    hideHeader: entry.options.hideHeader,
    onClose: () => modalManager.close({ confirmed: false }),
  }, {
    default: () => h(entry.component, entry.props),
  })
}

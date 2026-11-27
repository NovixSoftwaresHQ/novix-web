import { useEffect, useRef } from 'react'
import { focusMain } from '../lib/focusMain.js'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

// Shared by all dialogs. One can open while another is still closing (mobile menu, then enquiry popup),
// so the page is unlocked only when the last one has gone.
let openDialogs = 0
let overflowBefore = ''
function lockScroll() {
  if (openDialogs++ === 0) {
    overflowBefore = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  return () => {
    if (--openDialogs === 0) document.body.style.overflow = overflowBefore
  }
}

/** Dialog behaviour: scroll lock, focus trap, Escape to close and focus restore. */
export function useDialog(open, onClose) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return undefined
    const dialog = ref.current
    const previous = document.activeElement
    const unlock = lockScroll()

    const items = () =>
      [...(dialog?.querySelectorAll(FOCUSABLE) ?? [])].filter((el) => !el.closest('[inert]') && el.offsetParent)
    const frame = requestAnimationFrame(() => {
      const target = dialog?.querySelector('[data-autofocus]') ?? items()[0]
      target?.focus()
    })

    // True while focus is in a different dialog, which then looks after the keyboard itself.
    const focusIsInAnotherDialog = () => {
      const other = document.activeElement?.closest?.('[role="dialog"]')
      return Boolean(other) && other !== dialog
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeRef.current()
      if (event.key !== 'Tab' || focusIsInAnotherDialog()) return
      const list = items()
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      const inside = dialog.contains(document.activeElement)
      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      unlock()
      // Hand focus back only if this dialog still has it: never take it from a dialog opened in its place.
      const active = document.activeElement
      if (active && active !== document.body && active.isConnected && !dialog?.contains(active)) return
      if (!previous || previous === document.body) return
      if (previous.isConnected) previous.focus({ preventScroll: true })
      else focusMain()
    }
  }, [open])

  return ref
}

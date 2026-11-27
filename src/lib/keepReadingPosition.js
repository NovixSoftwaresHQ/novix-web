// Development only. The dev server sometimes has to reload the whole page (a config change, a server restart, some
// code changes). Most pages render after the browser has already tried to restore the scroll position, so you would
// land back at the top. This puts you back where you were reading. The built site does not need it: its HTML is
// prerendered, and the browser restores the position by itself.
const KEY = 'dev:reading-position'
const GIVE_UP_AFTER_MS = 5000

export function keepReadingPosition() {
  const path = window.location.pathname
  let waitingFor = null // the position still to be restored, if any

  // If another reload comes before we got there, pass the same position on.
  window.addEventListener('pagehide', () => {
    sessionStorage.setItem(KEY, JSON.stringify({ path: window.location.pathname, y: waitingFor ?? Math.round(window.scrollY) }))
  })

  const saved = JSON.parse(sessionStorage.getItem(KEY) ?? 'null')
  sessionStorage.removeItem(KEY)
  const [navigation] = performance.getEntriesByType('navigation')
  if (navigation?.type !== 'reload' || saved?.path !== path || !saved.y) return

  waitingFor = saved.y
  // If the reader starts moving first, leave them be.
  for (const type of ['wheel', 'touchstart', 'keydown', 'mousedown']) {
    window.addEventListener(type, () => { waitingFor = null }, { once: true, passive: true })
  }
  const started = performance.now()
  const restore = () => {
    if (waitingFor === null) return
    const tallEnough = document.documentElement.scrollHeight - window.innerHeight >= waitingFor
    if (tallEnough || performance.now() - started > GIVE_UP_AFTER_MS) {
      window.scrollTo({ top: waitingFor, behavior: 'instant' })
      waitingFor = null
      return
    }
    requestAnimationFrame(restore)
  }
  requestAnimationFrame(restore)
}

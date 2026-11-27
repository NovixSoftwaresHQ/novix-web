import { useEffect, useLayoutEffect, useRef } from 'react'

/*
 * Scroll reveals that cannot lose content: nothing is hidden in the HTML. After the app has loaded, an element
 * that is still below the screen is held back until it is scrolled to. With no JavaScript, no
 * IntersectionObserver or reduced motion, everything is simply visible. Styles: [data-reveal-state] in index.css.
 */
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
const WATCHDOG_MS = 2000

let observer = null
let heard = false // a working observer reports as soon as it starts watching
function sharedObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      heard = true
      let step = 0 // items arriving together follow one another, up to a short limit
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.style.setProperty('--reveal-step', Math.min(step++, 5))
        entry.target.dataset.revealState = 'in'
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -40px 0px' },
  )
  return observer
}

export function useReveal() {
  const ref = useRef(null)
  useBrowserLayoutEffect(() => {
    const element = ref.current
    if (!element || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    if (element.getBoundingClientRect().top < window.innerHeight) return undefined // already in view: leave it
    element.dataset.revealState = 'pending'
    const watching = sharedObserver()
    watching.observe(element)
    // If the observer never reports at all, show the content rather than risk leaving it hidden.
    const watchdog = setTimeout(() => {
      if (!heard) delete element.dataset.revealState
    }, WATCHDOG_MS)
    return () => {
      clearTimeout(watchdog)
      watching.unobserve(element)
      delete element.dataset.revealState
    }
  }, [])
  return ref
}

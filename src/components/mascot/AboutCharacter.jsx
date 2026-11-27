import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

const AboutCharacterRive = lazy(() => import('./AboutCharacterRive.jsx'))

// A failed download of the animation code must never take the page down: the poster simply stays.
class KeepPoster extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/**
 * Decorative character for "Who we are". The still poster is always there and reserves the space.
 * The live version is loaded only near the viewport, on wide screens with a mouse or trackpad,
 * and never for reduced-motion visitors.
 */
export default function AboutCharacter({ className = '' }) {
  const capable = useMediaQuery('(min-width: 768px) and (hover: hover) and (pointer: fine)')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [slot, setSlot] = useState(null)
  const [near, setNear] = useState(false)
  const [failed, setFailed] = useState(false)
  const [showing, setShowing] = useState(false)
  const enabled = capable && !reduced && !failed

  useEffect(() => {
    if (!slot || !enabled || near) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setNear(true),
      { rootMargin: '200px' },
    )
    observer.observe(slot)
    return () => observer.disconnect()
  }, [slot, enabled, near])

  useEffect(() => {
    if (!enabled) setShowing(false)
  }, [enabled])

  const fail = useCallback(() => {
    setShowing(false)
    setFailed(true)
  }, [])

  return (
    <div ref={setSlot} data-mascot="about" aria-hidden="true" className={`mascot-slot mascot-art ${className}`}>
      <img
        src="/mascot/character-neutral.png"
        alt=""
        width="140"
        height="140"
        decoding="async"
        className={`h-full w-full ${showing ? 'invisible' : ''}`}
      />
      {enabled && near && (
        <div className={showing ? undefined : 'invisible'}>
          <KeepPoster>
            <Suspense fallback={null}>
              <AboutCharacterRive slot={slot} onShowing={setShowing} onFail={fail} />
            </Suspense>
          </KeepPoster>
        </div>
      )}
    </div>
  )
}

// Loaded on demand (see AboutCharacter). Everything here, including the engine, is served by this site.
import { RuntimeLoader, useRive } from '@rive-app/react-canvas-lite'
import fallbackWasmUrl from '@rive-app/canvas-lite/rive_fallback.wasm?url'
import wasmUrl from '@rive-app/canvas-lite/rive.wasm?url'
import { useCallback, useEffect, useRef, useState } from 'react'
import { approach, close, NEUTRAL, regionOffset, returnAt, returnStart, targetFor, TURN_MS } from '../../lib/mascot/follow.js'
import { useMascot } from './MascotProvider.jsx'

// By default the runtime falls back to a public CDN; point both locations at local files instead.
RuntimeLoader.setWasmUrl(wasmUrl)
RuntimeLoader.setWasmFallbackUrl(fallbackWasmUrl)

// Names read from the file itself. It has pointer listeners, not pointer inputs.
const FILE = { src: '/mascot/novix-character.riv', artboard: 'Artboard', stateMachine: 'State Machine 1' }
const WARM_UP_MS = 1300 // the file's one-second blink plays out behind the poster
const LOAD_TIMEOUT_MS = 10000
const ARTBOARD = 1000

/**
 * @param slot       element whose box is the artwork (used for pointer distance and visibility)
 * @param onShowing  true while the live canvas should replace the poster
 * @param onFail     keep the poster for good
 */
export default function AboutCharacterRive({ slot, onShowing, onFail }) {
  const { owner } = useMascot()
  const host = useRef(null)
  const [ready, setReady] = useState(false)
  const { rive, RiveComponent } = useRive(
    { ...FILE, autoplay: true, onLoadError: onFail },
    { shouldUseIntersectionObserver: false }, // visibility is handled below, so nothing restarts by itself
  )

  useEffect(() => {
    if (ready) return undefined
    const timeout = setTimeout(onFail, LOAD_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [ready, onFail])

  useEffect(() => {
    if (!rive) return undefined
    const timer = setTimeout(() => {
      rive.pause()
      setReady(true)
      host.current.dataset.state = 'rest'
    }, WARM_UP_MS)
    return () => clearTimeout(timer)
  }, [rive])

  const setState = useCallback((state) => {
    if (host.current) host.current.dataset.state = state // for tests and debugging
  }, [])

  useEffect(() => {
    if (!ready || !rive || !slot) return undefined
    const canvas = host.current.querySelector('canvas')
    if (!canvas) return undefined

    let mode = 'rest' // rest | resync | follow | hold | return
    let side = 'left'
    let current = { ...NEUTRAL }
    let target = { ...NEUTRAL }
    let atNeutral = true // false once a pose other than neutral is left on the canvas
    let onScreen = false
    let frame = 0
    let timer = 0
    let last = 0
    let pointer = null

    // The file's own pointer listeners are on the canvas; give them the smoothed, clamped position.
    // Browsers cut synthetic mouse coordinates to whole pixels, so round to the nearest one here.
    const send = (point) => {
      const box = canvas.getBoundingClientRect()
      canvas.dispatchEvent(new MouseEvent('mousemove', {
        clientX: Math.round(box.left + (point.x * box.width) / ARTBOARD),
        clientY: Math.round(box.top + (point.y * box.height) / ARTBOARD),
      }))
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      frame = 0
    }
    const enter = (next) => {
      mode = next
      setState(next)
    }
    const rest = () => {
      stop()
      rive.pause()
      owner.release('about')
    }

    // Pointer stopped inside the region: let a turn finish, then freeze on this pose.
    const hold = () => {
      enter('hold')
      timer = setTimeout(rest, TURN_MS + 60)
    }

    const followFrame = (now) => {
      const delta = last ? Math.min(now - last, 64) : 16
      last = now
      current = approach(current, target, delta)
      send(current)
      if (close(current, target)) {
        frame = 0
        hold()
      } else frame = requestAnimationFrame(followFrame)
    }

    const startReturn = () => {
      if (mode === 'rest' || mode === 'return') return
      if (mode === 'resync') return reset()
      stop()
      if (!owner.claim('about')) return reset()
      enter('return')
      rive.play()
      const from = returnStart(current)
      let began = null
      const step = (now) => {
        began ??= now
        const point = returnAt(from, now - began)
        current = { x: point.x, y: point.y }
        send(current)
        if (!point.done) {
          frame = requestAnimationFrame(step)
          return
        }
        // The pose is neutral again: swap to the identical poster and stop.
        timer = setTimeout(() => {
          side = 'left'
          atNeutral = true
          onShowing(false)
          enter('rest')
          rest()
        }, 40)
      }
      frame = requestAnimationFrame(step)
    }

    // Immediate stop (offscreen or hidden tab). The poster covers whatever the canvas holds.
    function reset() {
      stop()
      if (mode !== 'rest') atNeutral = false
      onShowing(false)
      enter('rest')
      rive.pause()
      owner.release('about')
    }

    const move = () => {
      const offset = pointer && regionOffset(pointer.x, pointer.y, slot.getBoundingClientRect())
      if (!offset) return startReturn()
      const next = targetFor(offset.nx, offset.ny, side)
      side = next.side
      target = { x: next.x, y: next.y }
      if (mode === 'follow' || mode === 'resync') return undefined
      if (!owner.claim('about')) return undefined
      stop()
      rive.play()
      last = 0
      const begin = () => {
        onShowing(true)
        enter('follow')
        frame = requestAnimationFrame(followFrame)
      }
      if (atNeutral || mode === 'hold' || mode === 'return') {
        atNeutral = false
        begin()
      } else {
        // The canvas still holds an old pose: bring it back to neutral behind the poster first.
        enter('resync')
        current = { ...NEUTRAL }
        send(current)
        timer = setTimeout(() => {
          atNeutral = false
          begin()
        }, TURN_MS + 60)
      }
      return undefined
    }

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return
      pointer = { x: event.clientX, y: event.clientY }
      move()
    }
    const onPointerGone = () => {
      pointer = null
      startReturn()
    }
    // Scrolling can carry the artwork away from a still pointer.
    const onScroll = () => {
      if (mode === 'rest' || !pointer) return
      if (!regionOffset(pointer.x, pointer.y, slot.getBoundingClientRect())) startReturn()
    }

    let listening = false
    const listen = (on) => {
      if (on === listening) return
      listening = on
      const method = on ? 'addEventListener' : 'removeEventListener'
      window[method]('pointermove', onPointerMove, { passive: true })
      window[method]('scroll', onScroll, { passive: true })
      window[method]('blur', onPointerGone)
      document.documentElement[method]('pointerleave', onPointerGone)
    }
    const refresh = () => {
      const active = onScreen && document.visibilityState === 'visible'
      listen(active)
      if (!active) {
        pointer = null
        reset()
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      refresh()
    })
    observer.observe(slot)
    document.addEventListener('visibilitychange', refresh)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', refresh)
      listen(false)
      stop()
      owner.release('about')
      onShowing(false)
    }
  }, [ready, rive, slot, owner, onShowing, setState])

  return (
    <div ref={host} data-state="loading" className="mascot-canvas">
      <RiveComponent aria-hidden="true" />
    </div>
  )
}

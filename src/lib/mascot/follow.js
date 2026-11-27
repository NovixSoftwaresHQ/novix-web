// Maps a pointer near the About character onto the Rive file's own pointer listeners.
// Coordinates are artboard units of the character artboard (1000 x 1000).

/** The file's starting target position: pointing here reproduces its opening pose. */
export const NEUTRAL = { x: 482.5, y: 142.5 }
/** The file switches between its two facing directions where x crosses 500. */
export const TURN_X = 500
/** A small part of the supported range, measured to stay gentle and inside the crop. */
export const LIMITS = { minX: 442.5, maxX: 555, minY: 122.5, maxY: 187.5 }
/** Interaction square around the artwork, in CSS pixels. */
export const REGION = 220
export const SMOOTHING_MS = 62 // reaches 95% of a new target in about 190ms
export const RETURN_MS = 300
export const TURN_MS = 300 // left/right transition in the adapted file

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/** nx and ny are -1..1 across the region. `side` is remembered so the head doesn't flicker at the middle. */
export function targetFor(nx, ny, side) {
  const x = clamp(nx, -1, 1)
  const y = clamp(ny, -1, 1)
  const nextSide = x > 0.3 ? 'right' : x < 0.1 ? 'left' : side
  return {
    side: nextSide,
    x: nextSide === 'left' ? NEUTRAL.x + Math.min(x, 0.1) * 40 : 505 + Math.max(x, 0) * 50,
    y: NEUTRAL.y + y * (y < 0 ? 20 : 45),
  }
}

/** Pointer position relative to the artwork centre, or null when outside the region. */
export function regionOffset(pointerX, pointerY, rect) {
  const half = REGION / 2
  const dx = pointerX - (rect.left + rect.width / 2)
  const dy = pointerY - (rect.top + rect.height / 2)
  if (Math.abs(dx) > half || Math.abs(dy) > half) return null
  return { nx: dx / half, ny: dy / half }
}

/** Frame-rate independent exponential easing. */
export function approach(current, target, deltaMs, smoothing = SMOOTHING_MS) {
  const k = 1 - Math.exp(-deltaMs / smoothing)
  return { x: current.x + (target.x - current.x) * k, y: current.y + (target.y - current.y) * k }
}

export const close = (a, b, tolerance = 0.6) => Math.abs(a.x - b.x) < tolerance && Math.abs(a.y - b.y) < tolerance

/** Start of the return: if facing right, cross back at once so the turn finishes within the return. */
export const returnStart = (current) => ({ x: Math.min(current.x, TURN_X - 1), y: current.y })

export function returnAt(from, elapsedMs) {
  const t = clamp(elapsedMs / RETURN_MS, 0, 1)
  const eased = 1 - (1 - t) ** 3
  return { x: from.x + (NEUTRAL.x - from.x) * eased, y: from.y + (NEUTRAL.y - from.y) * eased, done: t >= 1 }
}

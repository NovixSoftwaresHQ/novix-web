// Where is there room on screen? Pure geometry, plus one function that reads the page.
// A "span" is [left, right] in viewport pixels.

// What the robot must not walk over: controls, media, boxed panels, the About character and lines of text.
const SOLID =
  'a[href],button,input,select,textarea,summary,label,img,video,canvas,iframe,svg,table,figure,[role="button"],[role="dialog"],[data-mascot="about"],.card,.rounded-card,.rounded-panel'

/** Sorts spans and joins any that touch or overlap. */
export function mergeSpans(spans) {
  const merged = []
  for (const [left, right] of [...spans].sort((a, b) => a[0] - b[0])) {
    const last = merged.at(-1)
    if (last && left <= last[1]) last[1] = Math.max(last[1], right)
    else merged.push([left, right])
  }
  return merged
}

/** The stretches of [0, viewport] that no occupied span touches. */
export function freeSpans(occupied, viewport) {
  const free = []
  let from = 0
  for (const [left, right] of mergeSpans(occupied)) {
    if (left > from) free.push([from, Math.min(left, viewport)])
    from = Math.max(from, right)
    if (from >= viewport) break
  }
  if (from < viewport) free.push([from, viewport])
  return free
}

export const isClear = (occupied, left, right) => occupied.every(([a, b]) => b <= left || a >= right)

// The furthest left and right that something `width` wide can stand inside a free stretch, away from the screen edges.
const standingRange = ([from, to], viewport, width, edge) => [Math.max(from, edge), Math.min(to, viewport - edge) - width]

/**
 * A stroll from `x` (the walker's left side) that stays on clear ground: it never leaves the free stretch the
 * walker is standing in. Returns where to walk to, at least `min` away, or null when there is no room.
 */
export function chooseStroll(occupied, viewport, x, width, { min = 60, max = 340, edge = 8, random = Math.random } = {}) {
  const stretch = freeSpans(occupied, viewport).find(([from, to]) => from <= x + 0.5 && x + width <= to + 0.5)
  if (!stretch) return null
  const [lowest, highest] = standingRange(stretch, viewport, width, edge)
  const options = [[-1, x - lowest], [1, highest - x]].filter(([, room]) => room >= min)
  if (options.length === 0) return null
  // Usually the roomier side, sometimes the other one.
  options.sort((a, b) => b[1] - a[1])
  const [direction, room] = options.length > 1 && random() < 0.3 ? options[1] : options[0]
  return x + direction * Math.min(room, min + random() * (max - min))
}

/**
 * For a walker that is covering something: the closest place where it would cover nothing.
 * Null when it covers nothing already, or no free place is wide enough and within `reach`.
 */
export function nearestClearSpot(occupied, viewport, x, width, { edge = 8, reach = 700 } = {}) {
  if (isClear(occupied, x, x + width)) return null
  let best = null
  for (const stretch of freeSpans(occupied, viewport)) {
    const [lowest, highest] = standingRange(stretch, viewport, width, edge)
    if (highest < lowest) continue
    const spot = Math.min(highest, Math.max(lowest, x))
    if (best === null || Math.abs(spot - x) < Math.abs(best - x)) best = spot
  }
  return best !== null && Math.abs(best - x) <= reach ? best : null
}

/** Reads the page: the spans taken by content anywhere between the heights `top` and `bottom`, padded a little. */
export function occupiedSpans(top, bottom, { root = document.body, pad = 4 } = {}) {
  const spans = []
  const inBand = (rect) => rect.width > 0 && rect.height > 0 && rect.bottom > top && rect.top < bottom
  const ignored = (element) =>
    element.closest('[data-mascot="robot"], .sr-only, script, style, noscript') !== null || getComputedStyle(element).visibility === 'hidden'
  const add = (rect) => spans.push([rect.left - pad, rect.right + pad])

  for (const element of root.querySelectorAll(SOLID)) {
    const rect = element.getBoundingClientRect()
    if (inBand(rect) && !ignored(element)) add(rect)
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.data.trim() || !node.parentElement) continue
    range.selectNodeContents(node)
    const rects = [...range.getClientRects()].filter(inBand)
    if (rects.length && !ignored(node.parentElement)) rects.forEach(add)
  }
  return mergeSpans(spans)
}

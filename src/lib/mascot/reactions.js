// When the robot reacts to the visitor. No DOM or React here, so it can be tested on its own.

/**
 * It nods off after this long with no mouse, keyboard or scrolling. It first finishes what it is doing (a flight
 * takes up to about 6s) and then yawns (1.8s), so it is asleep 20 to 30 seconds after the visitor stops.
 */
export const NAP_MS = { min: 20000, max: 22000 }
export const napDelay = (random = Math.random) => NAP_MS.min + random() * (NAP_MS.max - NAP_MS.min)

/**
 * Peekaboo: once right after it arrives, then again at random times, this far apart (ms). A random one also
 * waits until nothing is holding it back and the page has been still for a moment.
 */
export const PEEK_MS = { min: 12000, max: 35000 }
export const peekDelay = (random = Math.random) => PEEK_MS.min + random() * (PEEK_MS.max - PEEK_MS.min)

/** Which bottom corner a random peekaboo comes out of: usually the other one, so it changes sides; sometimes its own. */
export const SWITCH_CHANCE = 0.65
export const otherSide = (side) => (side === 'left' ? 'right' : 'left')
export const peekCorner = (side, random = Math.random) => (random() < SWITCH_CHANCE ? otherSide(side) : side)

/** It waves when the visitor comes back to a tab they left for at least this long, once the page is in view. */
export const WELCOME = { awayMs: 3000, delayMs: 400 }

/**
 * Dizzy: the pointer circles it quickly. Feed it the pointer's offset from the robot's middle and the time;
 * it returns true once the pointer has gone round `turns` times in one direction within `windowMs`.
 * `.noticing(now)` is true while someone seems to be starting to circle it, so that it can stand still and watch.
 */
export function createOrbitDetector({ near = 20, far = 260, turns = 2, windowMs = 2200, restMs = 8000, noticeTurns = 0.4, noticeMs = 400 } = {}) {
  let steps = [] // [time, change of angle]
  let lastAngle = null
  let restUntil = 0
  const reset = () => {
    steps = []
    lastAngle = null
  }
  // Going back and forth cancels out, so only real circling adds up.
  const turned = () => Math.abs(steps.reduce((sum, [, change]) => sum + change, 0)) / (2 * Math.PI)
  const detect = (dx, dy, now) => {
    const distance = Math.hypot(dx, dy)
    if (distance < near || distance > far) {
      reset()
      return false
    }
    const angle = Math.atan2(dy, dx)
    if (lastAngle !== null) {
      let change = angle - lastAngle
      if (change > Math.PI) change -= 2 * Math.PI
      if (change < -Math.PI) change += 2 * Math.PI
      steps.push([now, change])
    }
    lastAngle = angle
    while (steps.length && now - steps[0][0] > windowMs) steps.shift()
    if (turned() < turns || now < restUntil) return false
    restUntil = now + restMs
    reset()
    return true
  }
  detect.noticing = (now) => now >= restUntil && steps.length > 0 && now - steps.at(-1)[0] < noticeMs && turned() >= noticeTurns
  return detect
}

/** The secret word: true when its letters are typed in a row, with no long gap between them. */
export function createWordDetector(word = 'hello', { gapMs = 3000 } = {}) {
  let typed = ''
  let last = 0
  const detect = (key, now) => {
    if (key.length !== 1) return false
    if (now - last > gapMs) typed = ''
    last = now
    typed = (typed + key.toLowerCase()).slice(-word.length)
    if (typed !== word) return false
    typed = ''
    return true
  }
  /** Forget what has been typed, for example when typing moves into a form. */
  detect.reset = () => {
    typed = ''
  }
  return detect
}

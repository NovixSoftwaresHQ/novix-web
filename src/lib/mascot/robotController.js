// Rules for when the robot is on screen. No DOM or React here, so it can be tested with a fake clock.
export const ROBOT = { delayMs: 1500, byeMs: 700 }

const realClock = {
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (id) => clearTimeout(id),
}

/**
 * Phases: waiting → visible → leaving → done.
 * The robot arrives shortly after the website loads and stays, on every page, until it is clicked.
 * `memory` remembers a click for as long as the website stays open: moving between pages keeps the robot away,
 * and refreshing brings it back. `onGone` runs once after a click, when the goodbye is over and the robot has left.
 */
export function createRobotController({ memory = { dismissed: false }, onChange = () => {}, onGone = () => {}, clock = realClock }) {
  const context = { eligibleDevice: false, pageVisible: true, blocked: false, reducedMotion: false }
  let phase = memory.dismissed ? 'done' : 'waiting'
  let timer = null

  const stopTimer = () => {
    if (timer !== null) clock.clearTimeout(timer)
    timer = null
  }
  const wake = (fn, ms) => {
    stopTimer()
    timer = clock.setTimeout(() => {
      timer = null
      fn()
    }, ms)
  }
  const setPhase = (next) => {
    phase = next
    onChange(next)
  }
  // It should be seen arriving: not behind a menu or dialog, and not in a background tab.
  const canArrive = () => context.eligibleDevice && context.pageVisible && !context.blocked
  // Only a click leads here.
  const finish = () => {
    stopTimer()
    setPhase('done')
    onGone()
  }

  function evaluate() {
    if (phase === 'waiting') {
      if (!canArrive()) stopTimer()
      else if (timer === null) wake(() => setPhase('visible'), ROBOT.delayMs)
    } else if (phase === 'visible' && !context.eligibleDevice) {
      setPhase('waiting') // the window became too small: it comes back when there is room again
    } else if (phase === 'leaving' && !context.eligibleDevice) {
      finish()
    }
  }

  return {
    setContext(patch) {
      Object.assign(context, patch)
      evaluate()
    },
    /** The visitor clicked it. */
    dismiss() {
      if (phase !== 'visible') return
      memory.dismissed = true
      if (context.reducedMotion) return finish()
      setPhase('leaving')
      wake(finish, ROBOT.byeMs)
    },
    destroy: stopTimer,
    phase: () => phase,
  }
}

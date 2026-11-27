import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createRobotController, ROBOT } from '../src/lib/mascot/robotController.js'

function fakeClock() {
  let now = 0
  let nextId = 1
  const timers = new Map()
  return {
    setTimeout: (fn, ms) => (timers.set(nextId, { at: now + ms, fn }), nextId++),
    clearTimeout: (id) => timers.delete(id),
    advance(ms) {
      const end = now + ms
      for (;;) {
        const due = [...timers].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0]
        if (!due) break
        timers.delete(due[0])
        now = due[1].at
        due[1].fn()
      }
      now = end
    },
    pending: () => timers.size,
  }
}

// `memory` is what lasts while the website stays open. A refresh starts with a new one.
function setup({ memory = { dismissed: false }, context = {} } = {}) {
  const clock = fakeClock()
  const changes = []
  const gone = [] // each time the follow-up (the contact popup) is asked for, and the phase at that moment
  const robot = createRobotController({
    memory,
    clock,
    onChange: (phase) => changes.push(phase),
    onGone: () => gone.push(robot.phase()),
  })
  robot.setContext({ eligibleDevice: true, pageVisible: true, blocked: false, ...context })
  return { robot, clock, changes, gone, memory }
}

const arrive = (s) => s.clock.advance(ROBOT.delayMs)
const HOUR = 60 * 60 * 1000

test('arrives one and a half seconds after the website loads', () => {
  const s = setup()
  assert.equal(ROBOT.delayMs, 1500)
  s.clock.advance(1499)
  assert.equal(s.robot.phase(), 'waiting')
  s.clock.advance(1)
  assert.equal(s.robot.phase(), 'visible')
})

test('stays until clicked: no timer runs while it waits for the click', () => {
  const s = setup()
  arrive(s)
  assert.equal(s.clock.pending(), 0)
  s.clock.advance(HOUR)
  assert.equal(s.robot.phase(), 'visible')
})

for (const [name, off, on] of [
  ['a menu or dialog is open', { blocked: true }, { blocked: false }],
  ['the tab is hidden', { pageVisible: false }, { pageVisible: true }],
]) {
  test(`does not arrive while ${name}, then arrives shortly afterwards`, () => {
    const s = setup()
    s.clock.advance(1000)
    s.robot.setContext(off)
    s.clock.advance(HOUR)
    assert.equal(s.robot.phase(), 'waiting')
    assert.equal(s.clock.pending(), 0)
    s.robot.setContext(on)
    arrive(s)
    assert.equal(s.robot.phase(), 'visible')
  })

  test(`once there, it stays when ${name}`, () => {
    const s = setup()
    arrive(s)
    s.robot.setContext(off)
    s.robot.setContext(on)
    assert.equal(s.robot.phase(), 'visible')
    assert.deepEqual(s.changes, ['visible'])
  })
}

test('unrelated context updates do not restart the wait', () => {
  const s = setup()
  s.clock.advance(1000)
  s.robot.setContext({ reducedMotion: false })
  s.clock.advance(500)
  assert.equal(s.robot.phase(), 'visible')
})

test('is away while the window is too small, and comes back afterwards', () => {
  const s = setup()
  arrive(s)
  s.robot.setContext({ eligibleDevice: false })
  s.clock.advance(HOUR)
  assert.equal(s.robot.phase(), 'waiting')
  s.robot.setContext({ eligibleDevice: true })
  arrive(s)
  assert.equal(s.robot.phase(), 'visible')
})

test('a click sends it away with a short goodbye', () => {
  const s = setup()
  arrive(s)
  s.robot.dismiss()
  assert.equal(s.robot.phase(), 'leaving')
  assert.equal(s.memory.dismissed, true)
  s.clock.advance(ROBOT.byeMs - 1)
  assert.equal(s.robot.phase(), 'leaving')
  s.clock.advance(1)
  assert.equal(s.robot.phase(), 'done')
  assert.equal(s.clock.pending(), 0)
})

test('a second click during the goodbye changes nothing', () => {
  const s = setup()
  arrive(s)
  s.robot.dismiss()
  s.clock.advance(300)
  s.robot.dismiss()
  s.clock.advance(ROBOT.byeMs - 300)
  assert.equal(s.robot.phase(), 'done')
})

test('after a click it stays away while the website stays open, even if everything is set up again', () => {
  const memory = { dismissed: false }
  const first = setup({ memory })
  arrive(first)
  first.robot.dismiss()
  first.clock.advance(HOUR)
  first.robot.destroy()
  const again = setup({ memory })
  again.clock.advance(HOUR)
  assert.equal(again.robot.phase(), 'done')
})

test('a refresh brings it back', () => {
  const before = setup()
  arrive(before)
  before.robot.dismiss()
  const refreshed = setup() // a refreshed website starts with nothing remembered
  arrive(refreshed)
  assert.equal(refreshed.robot.phase(), 'visible')
})

test('reduced motion: a click removes it at once', () => {
  const s = setup({ context: { reducedMotion: true } })
  arrive(s)
  s.robot.dismiss()
  assert.equal(s.robot.phase(), 'done')
  assert.ok(!s.changes.includes('leaving'))
})

test('the window shrinking during the goodbye finishes it', () => {
  const s = setup()
  arrive(s)
  s.robot.dismiss()
  s.robot.setContext({ eligibleDevice: false })
  assert.equal(s.robot.phase(), 'done')
  assert.equal(s.clock.pending(), 0)
})

test('after a click, the follow-up runs once, only when the goodbye is over', () => {
  const s = setup()
  arrive(s)
  assert.deepEqual(s.gone, [])
  s.robot.dismiss()
  s.robot.dismiss() // a double click
  s.clock.advance(ROBOT.byeMs - 1)
  assert.deepEqual(s.gone, [])
  s.clock.advance(1)
  assert.deepEqual(s.gone, ['done'])
  s.clock.advance(HOUR)
  assert.deepEqual(s.gone, ['done'])
})

test('reduced motion: the follow-up runs at once', () => {
  const s = setup({ context: { reducedMotion: true } })
  arrive(s)
  s.robot.dismiss()
  assert.deepEqual(s.gone, ['done'])
})

test('no follow-up without a click: waiting, arriving, a small window, a later visit', () => {
  const s = setup()
  s.robot.dismiss() // before it has arrived
  arrive(s)
  s.robot.setContext({ eligibleDevice: false })
  s.robot.setContext({ eligibleDevice: true })
  arrive(s)
  s.robot.destroy()
  const later = setup({ memory: { dismissed: true } })
  later.clock.advance(HOUR)
  assert.deepEqual([...s.gone, ...later.gone], [])
})

test('if the window shrinks during the goodbye, the click still gets its follow-up, once', () => {
  const s = setup()
  arrive(s)
  s.robot.dismiss()
  s.robot.setContext({ eligibleDevice: false })
  s.clock.advance(HOUR)
  assert.deepEqual(s.gone, ['done'])
})

test('does nothing on ineligible devices', () => {
  const s = setup({ context: { eligibleDevice: false } })
  s.clock.advance(HOUR)
  assert.equal(s.robot.phase(), 'waiting')
  assert.equal(s.clock.pending(), 0)
})

test('destroy clears timers', () => {
  const s = setup()
  s.clock.advance(100)
  s.robot.destroy()
  assert.equal(s.clock.pending(), 0)
})

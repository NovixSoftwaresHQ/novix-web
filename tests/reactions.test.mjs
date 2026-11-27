import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createOrbitDetector, createWordDetector, napDelay, NAP_MS, otherSide, peekCorner, peekDelay, PEEK_MS, SWITCH_CHANCE,
} from '../src/lib/mascot/reactions.js'

// Moves the pointer round the robot: `turns` full circles in `ms`, in 24 steps per turn.
const circle = (detect, { turns, ms, radius = 70, from = 1000, direction = 1 }) => {
  const steps = Math.ceil(turns * 24)
  let fired = 0
  for (let i = 0; i <= steps; i++) {
    const angle = direction * (i / 24) * 2 * Math.PI
    if (detect(radius * Math.cos(angle), radius * Math.sin(angle), from + (ms * i) / steps)) fired++
  }
  return fired
}

test('the nap timer starts at 20 to 22 seconds, leaving room to finish an action and yawn within 30', () => {
  assert.equal(napDelay(() => 0), 20000)
  assert.equal(napDelay(() => 0.999999) < 22000.001, true)
  const longestAction = 4600 // a full flight
  const pauseAndYawn = 1200 + 1800
  assert.equal(NAP_MS.max + longestAction + pauseAndYawn <= 30000, true)
})

test('two quick circles in either direction make it dizzy, once', () => {
  assert.equal(circle(createOrbitDetector(), { turns: 2.2, ms: 1600 }), 1)
  assert.equal(circle(createOrbitDetector(), { turns: 2.2, ms: 1600, direction: -1 }), 1)
})

test('slow circles, one circle, or circling far away do nothing', () => {
  assert.equal(circle(createOrbitDetector(), { turns: 4, ms: 12000 }), 0)
  assert.equal(circle(createOrbitDetector(), { turns: 1.4, ms: 900 }), 0)
  assert.equal(circle(createOrbitDetector(), { turns: 3, ms: 1800, radius: 400 }), 0)
  assert.equal(circle(createOrbitDetector(), { turns: 3, ms: 1800, radius: 8 }), 0)
})

test('waving the pointer back and forth past it does nothing', () => {
  const detect = createOrbitDetector()
  let fired = 0
  for (let i = 0; i < 200; i++) {
    const angle = Math.sin(i / 3) * 1.4 // swings to and fro through part of a circle
    if (detect(70 * Math.cos(angle), 70 * Math.sin(angle), 1000 + i * 10)) fired++
  }
  assert.equal(fired, 0)
})

test('it notices circling that has just started, and stops noticing when the pointer stops', () => {
  const detect = createOrbitDetector()
  assert.equal(circle(detect, { turns: 0.5, ms: 350, from: 1000 }), 0)
  assert.equal(detect.noticing(1400), true)
  assert.equal(detect.noticing(2200), false)
  const swinging = createOrbitDetector()
  for (let i = 0; i < 60; i++) swinging(70 * Math.cos(Math.sin(i / 3) * 0.6), 70 * Math.sin(Math.sin(i / 3) * 0.6), 1000 + i * 10)
  assert.equal(swinging.noticing(1600), false)
})

test('after being dizzy it needs a rest before it can be dizzy again', () => {
  const detect = createOrbitDetector()
  assert.equal(circle(detect, { turns: 2.2, ms: 1600, from: 1000 }), 1)
  assert.equal(circle(detect, { turns: 2.2, ms: 1600, from: 3000 }), 0)
  assert.equal(circle(detect, { turns: 2.2, ms: 1600, from: 12000 }), 1)
})

test('typing hello, in any case, is heard once', () => {
  const hear = createWordDetector()
  const heard = [...'Say HeLLo'].map((key, i) => hear(key, 1000 + i * 200))
  assert.deepEqual(heard.filter(Boolean).length, 1)
  assert.equal(heard.at(-1), true)
})

test('long pauses, other keys and a reset break the word', () => {
  const slow = createWordDetector()
  assert.equal([...'hel'].map((k, i) => slow(k, 1000 + i * 100)).includes(true), false)
  assert.equal([...'lo'].map((k, i) => slow(k, 9000 + i * 100)).includes(true), false)
  const interrupted = createWordDetector()
  for (const [i, k] of [...'hell'].entries()) interrupted(k, 1000 + i * 100)
  interrupted.reset()
  assert.equal(interrupted('o', 1500), false)
  const named = createWordDetector()
  assert.equal(['h', 'e', 'Shift', 'l', 'l', 'o'].map((k, i) => named(k, 1000 + i * 100)).at(-1), true)
  assert.equal([...'helo'].map((k, i) => createWordDetector()(k, 1000 + i)).includes(true), false)
})

test('random peekaboos come 12 to 35 seconds apart', () => {
  assert.deepEqual(PEEK_MS, { min: 12000, max: 35000 })
  assert.equal(peekDelay(() => 0), 12000)
  assert.equal(peekDelay(() => 0.5), 23500)
  assert.ok(peekDelay(() => 0.9999) < 35000)
  const delays = Array.from({ length: 200 }, () => peekDelay())
  assert.ok(delays.every((ms) => ms >= PEEK_MS.min && ms < PEEK_MS.max))
  assert.ok(new Set(delays.map((ms) => Math.round(ms / 1000))).size > 10, 'they vary')
})

test('a random peekaboo usually changes sides, and sometimes comes out of its own corner', () => {
  assert.equal(otherSide('left'), 'right')
  assert.equal(otherSide('right'), 'left')
  assert.equal(peekCorner('left', () => 0), 'right')
  assert.equal(peekCorner('right', () => SWITCH_CHANCE - 0.01), 'left')
  assert.equal(peekCorner('left', () => SWITCH_CHANCE), 'left')
  assert.equal(peekCorner('right', () => 0.99), 'right')
})

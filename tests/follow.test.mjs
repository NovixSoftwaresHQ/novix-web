import assert from 'node:assert/strict'
import { test } from 'node:test'
import { approach, close, LIMITS, NEUTRAL, REGION, regionOffset, RETURN_MS, returnAt, returnStart, targetFor, TURN_X } from '../src/lib/mascot/follow.js'

const rect = { left: 100, top: 100, width: 140, height: 140 } // centre (170, 170)

test('only the 220px square around the artwork reacts', () => {
  assert.equal(REGION, 220)
  assert.deepEqual(regionOffset(170, 170, rect), { nx: 0, ny: 0 })
  assert.ok(regionOffset(280, 280, rect))
  assert.equal(regionOffset(281, 170, rect), null)
  assert.equal(regionOffset(170, 59, rect), null)
  assert.equal(regionOffset(900, 500, rect), null)
})

test('movement is clamped to the small tested range, even for wild input', () => {
  let side = 'left'
  for (const nx of [-9, -1, -0.5, 0, 0.2, 0.5, 1, 9])
    for (const ny of [-9, -1, 0, 1, 9]) {
      const t = targetFor(nx, ny, side)
      side = t.side
      assert.ok(t.x >= LIMITS.minX && t.x <= LIMITS.maxX, `x ${t.x}`)
      assert.ok(t.y >= LIMITS.minY && t.y <= LIMITS.maxY, `y ${t.y}`)
    }
})

test('a centred pointer is the neutral pose', () => {
  const t = targetFor(0, 0, 'left')
  assert.deepEqual([t.x, t.y], [NEUTRAL.x, NEUTRAL.y])
})

test('facing has hysteresis and each side stays on its own side of the turn line', () => {
  assert.equal(targetFor(0.2, 0, 'left').side, 'left')
  assert.equal(targetFor(0.2, 0, 'right').side, 'right')
  assert.equal(targetFor(0.31, 0, 'left').side, 'right')
  assert.equal(targetFor(0.09, 0, 'right').side, 'left')
  assert.ok(targetFor(1, 0, 'left').x > TURN_X)
  assert.ok(targetFor(0.2, 0, 'left').x < TURN_X)
  assert.ok(targetFor(0.2, 0, 'right').x > TURN_X)
})

test('smoothing reaches 95% of a new target in 150–250ms at any frame rate', () => {
  for (const frame of [8, 16.7, 33]) {
    let position = { x: 0, y: 0 }
    let time = 0
    while (position.x < 95) {
      position = approach(position, { x: 100, y: 0 }, frame)
      time += frame
    }
    assert.ok(time >= 150 && time <= 250, `${time}ms at ${frame}ms frames`)
  }
})

test('return reaches the neutral pose in 300ms and starts the turn back immediately', () => {
  assert.equal(RETURN_MS, 300)
  const from = returnStart({ x: 555, y: 180 })
  assert.ok(from.x < TURN_X)
  assert.equal(returnAt(from, 150).done, false)
  const end = returnAt(from, 300)
  assert.ok(end.done && close(end, NEUTRAL, 0.001))
})

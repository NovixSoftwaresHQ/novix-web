// Where the robot may walk. Spans are [left, right] in pixels.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chooseStroll, freeSpans, isClear, mergeSpans, nearestClearSpot } from '../src/lib/mascot/space.js'

const WIDTH = 86 // the part of the robot's box that the drawing fills
const middle = () => 0.5

test('merges spans that overlap or touch, in order', () => {
  assert.deepEqual(mergeSpans([[300, 400], [10, 50], [40, 90], [90, 100]]), [[10, 100], [300, 400]])
})

test('free spans are what is left of the screen', () => {
  assert.deepEqual(freeSpans([[120, 1350]], 1470), [[0, 120], [1350, 1470]])
  assert.deepEqual(freeSpans([], 800), [[0, 800]])
  assert.deepEqual(freeSpans([[-10, 900]], 800), [])
})

test('clear means touching no content', () => {
  assert.ok(isClear([[200, 300]], 100, 200))
  assert.ok(!isClear([[200, 300]], 150, 201))
})

test('a stroll goes at least 60px and never into content', () => {
  const content = [[600, 900]]
  for (const random of [0, 0.2, 0.5, 0.99]) {
    const to = chooseStroll(content, 1280, 16, WIDTH, { random: () => random })
    assert.ok(to !== null && Math.abs(to - 16) >= 60, String(to))
    assert.ok(isClear(content, to, to + WIDTH) && to >= 8, String(to))
    assert.ok(isClear(content, Math.min(to, 16), Math.max(to, 16) + WIDTH), 'the whole path is clear')
  }
})

test('from the middle of an open floor it can go either way and stays on screen', () => {
  const ways = new Set()
  for (const random of [0.1, 0.9]) {
    const to = chooseStroll([], 1280, 600, WIDTH, { random: () => random })
    ways.add(Math.sign(to - 600))
    assert.ok(to >= 8 && to + WIDTH <= 1272)
  }
  assert.equal(ways.size, 2)
})

test('no stroll in a narrow margin, or while standing on content', () => {
  assert.equal(chooseStroll([[123, 1347]], 1470, 16, WIDTH, { random: middle }), null)
  assert.equal(chooseStroll([[32, 400]], 1280, 16, WIDTH, { random: middle }), null)
})

test('a wide margin is room to walk', () => {
  const to = chooseStroll([[348, 1572]], 1920, 16, WIDTH, { random: middle })
  assert.ok(to > 76 && to + WIDTH <= 348)
})

test('covering content, it picks the nearest clear spot wide enough', () => {
  const content = [[32, 400], [700, 1200]]
  assert.equal(nearestClearSpot(content, 1280, 16, WIDTH), 400)
  assert.equal(nearestClearSpot(content, 1280, 650, WIDTH), 700 - WIDTH)
})

test('it stays put when already clear, when nothing is wide enough, or when the spot is too far', () => {
  assert.equal(nearestClearSpot([[300, 500]], 1280, 16, WIDTH), null)
  assert.equal(nearestClearSpot([[0, 1280]], 1280, 16, WIDTH), null)
  assert.equal(nearestClearSpot([[0, 1100]], 1280, 16, WIDTH), null)
  assert.equal(nearestClearSpot([[0, 1100]], 1280, 16, WIDTH, { reach: 2000 }), 1100)
})

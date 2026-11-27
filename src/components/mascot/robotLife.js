// The robot's life between clicks: it moves about when there is room, does something in between, watches the
// pointer, and keeps still while the visitor points at it. It lives in a bottom corner, on the left or the right,
// and never stays on top of content: if something comes under it, it ducks below the window and comes back up
// somewhere clear (the other corner, if that one is free), or stays down until there is room.
// Now and then it plays peekaboo: once when it arrives, then at random times, from either corner.
// It works on the element directly, so React does not re-render for each action. index.css animates
// data-action, data-walking, data-flying and data-sleeping, and slides it away for data-tucked.
// It also reacts to the visitor: it naps when nothing happens, gets dizzy when the pointer circles it, waves
// when they come back to the tab, and dances when they type "hello". The rules are in lib/mascot/reactions.js.
import {
  createOrbitDetector, createWordDetector, napDelay, otherSide, peekCorner, peekDelay, WELCOME,
} from '../../lib/mascot/reactions.js'
import { chooseStroll, isClear, nearestClearSpot, occupiedSpans } from '../../lib/mascot/space.js'

// What it does between moves, in order. The bigger ones are skipped while there is no room around it.
const TRICKS = ['wave', 'dance', 'blink', 'jump', 'look', 'flip', 'blink', 'tilt', 'hop']
const DURATION = {
  greet: 2000, blink: 320, look: 1600, wave: 1400, tilt: 900, hop: 700, dance: 2400, jump: 1000, flip: 1100,
  welcome: 1800, secret: 3200, 'secret-small': 3200, dizzy: 2600, wake: 900, yawn: 1800,
}
// px of clear space
const NEEDS = { dance: { side: 14, up: 12 }, jump: { side: 0, up: 48 }, flip: { side: 18, up: 56 }, secret: { side: 18, up: 28 } }
const PAUSE_MS = 1200
const SPEED = { walk: 95, fly: 160, land: 340 } // px per second
const FLY_HEIGHTS = [240, 170, 110]
const HEADROOM = 84 // it never flies up behind the site header
const QUIET_AFTER_SCROLL_MS = 500
const NEW_PAGE_MS = 900 // time for a new page to draw before looking for room on it
const CONTENT_QUIET_MS = 400 // after the page changes height (an answer opening, a filter)
const TUCK_MS = 320 // matches the slide in index.css
const CHECK_AGAIN_MS = 100
const SLACK = 1 // px
const EDGE = 8
const INSET = 0.09 // the drawing does not fill the sides of its box
const FIELDS = 'input, select, textarea, [contenteditable="true"]'
// How long each part of a peekaboo takes (ms). How often, and from which corner, is in reactions.js.
const PEEKABOO = { walkMs: 650, goneMs: 350, popMs: 550, coverMs: 550, booMs: 1100, leaveMs: 380 }
const TROT = 0.3 // px per ms: its fastest walk off for a peekaboo, from further along the bottom
const CALM_MS = 3000 // a random peekaboo waits until nothing has held it back for this long
// Kept while the visitor moves around the site. A refresh starts again.
let homeSide = 'left' // the bottom corner it lives in
let openingPlayed = false
let nextPeekAt = 0

/**
 * @param isHeld true while something else should have the visitor's attention
 * @param still for reduced motion: no walking, flying or tricks, but it still keeps off the content
 */
export function startRobotLife(element, { isHeld = () => false, still = false } = {}) {
  const readPosition = () => {
    const value = getComputedStyle(element).translate
    const [x = 0, y = 0] = value === 'none' ? [] : value.split(' ').map(parseFloat)
    return [x, y]
  }
  let [x, y] = readPosition() // offsets from its place in a bottom corner (data-side says which)
  element.dataset.side = homeSide
  let stopped = false
  let pointed = false
  let rising = false
  let landNow = false
  let haltMotion = null
  let endPause = () => {}
  let quietUntil = 0
  let settleTimer = 0
  let lookFrame = 0
  let unsettled = false // the page moved: check for content under it as soon as things are still
  let special = null // a reaction to the visitor is playing: the routine waits for it
  let lastActivity = Date.now()
  let napAfter = napDelay()
  let hiddenSince = null
  let welcomeTimer = 0
  const circled = createOrbitDetector()
  const hello = createWordDetector('hello')
  let showingOff = !still && !openingPlayed // the opening peekaboo is still to come, or playing
  let cutShort = false // the page moved during a random peekaboo
  let pointer = null
  let step = 0
  let moves = 0
  let tricks = 0
  let lastMove = null
  const timers = new Set()

  const wait = (ms) =>
    new Promise((resolve) => {
      const id = setTimeout(() => {
        timers.delete(id)
        resolve()
      }, ms)
      timers.add(id)
    })
  // A pause that scrolling or a new page can cut short.
  const pause = (ms) =>
    new Promise((resolve) => {
      endPause = resolve
      wait(ms).then(resolve)
    })

  const place = (nextX, nextY) => {
    x = nextX
    y = nextY
    element.style.translate = `${x}px ${y}px`
  }
  // Where it is now, narrowed to the part of its box that the drawing fills.
  const stance = () => {
    if (!haltMotion) [x, y] = readPosition() // the page is the record of where it stands
    const style = getComputedStyle(element)
    const { offsetWidth: width, offsetHeight: height } = element
    const boxLeft = element.offsetLeft + x // where the CSS puts it (either side), plus how far it has moved
    const top = window.innerHeight - parseFloat(style.bottom) - height + y
    return { boxLeft, width, top, bottom: top + height, left: boxLeft + width * INSET, right: boxLeft + width * (1 - INSET) }
  }
  const screenWidth = () => document.documentElement.clientWidth
  // After a resize it may be off the screen. Its own corner is always allowed, even where that hugs the edge.
  const keepOnScreen = () => {
    const { boxLeft, width } = stance()
    const home = boxLeft - x
    const fit = Math.min(Math.max(home, screenWidth() - EDGE - width), Math.max(Math.min(home, EDGE), boxLeft))
    if (fit !== boxLeft) place(x + fit - boxLeft, y)
  }

  // ---- room ----
  const hasRoom = ({ side, up }) => {
    const here = stance()
    return isClear(occupiedSpans(here.top - up, here.bottom), here.left - side, here.right + side)
  }
  const targetAlongBottom = (choose, occupied) => {
    const here = stance()
    const edge = EDGE + here.width * INSET // keeps the whole box on screen, not just the drawing
    const to = choose(occupied ?? occupiedSpans(here.top, here.bottom), screenWidth(), here.left, here.right - here.left, { edge })
    return to === null ? null : x + (to - here.left)
  }
  const flightHeight = () => {
    const here = stance()
    return FLY_HEIGHTS.find((height) => here.top - height >= HEADROOM && isClear(occupiedSpans(here.top - height, here.bottom), here.left, here.right))
  }

  // ---- never over content ----
  // A pixel of slack: standing exactly at the edge of a gap, rounding must not count as covering.
  // (Content is already measured with a 4px margin.)
  const isCovering = () => {
    const here = stance()
    return !isClear(occupiedSpans(here.top, here.bottom), here.left + SLACK, here.right - SLACK)
  }
  const setSide = (side) => {
    homeSide = side
    element.dataset.side = side
  }
  // Would it cover nothing at home in this corner? (In a narrow side margin, home hugs the screen edge, closer
  // than it would stroll. Both corners keep the same distance from their edge.)
  const cornerClear = (side, occupied) => {
    const here = stance()
    const home = here.boxLeft - x
    const gap = homeSide === 'left' ? home : screenWidth() - home - here.width
    const boxLeft = side === 'left' ? gap : screenWidth() - gap - here.width
    return isClear(occupied ?? occupiedSpans(here.top, here.bottom), boxLeft + here.width * INSET + SLACK, boxLeft + here.width * (1 - INSET) - SLACK)
  }
  // Where it can stand covering nothing: its own corner, else the other corner, else the nearest clear place
  // along the bottom. Null when there is none.
  const findRoom = () => {
    const here = stance()
    const occupied = occupiedSpans(here.top, here.bottom)
    const side = [homeSide, otherSide(homeSide)].find((corner) => cornerClear(corner, occupied))
    if (side) return { side, to: 0 }
    const to = targetAlongBottom(
      (spans, viewport, from, width, options) => nearestClearSpot(spans, viewport, from, width, { ...options, reach: Infinity }),
      occupied,
    )
    return to === null ? null : { side: homeSide, to }
  }
  const goTo = ({ side, to }) => {
    setSide(side)
    place(to, y)
  }
  // In the empty margin beside the page's column, scrolling cannot bring anything under it.
  const inMargin = () => {
    const column = document.querySelector('main .container-page')
    if (!column) return false
    const box = column.getBoundingClientRect()
    const { paddingLeft, paddingRight } = getComputedStyle(column)
    const here = stance()
    return here.right + 4 <= box.left + parseFloat(paddingLeft) || here.left - 4 >= box.right - parseFloat(paddingRight)
  }
  const isTucked = () => element.dataset.tucked !== undefined
  const tuck = ({ instant = false } = {}) => {
    if (instant) element.dataset.instant = ''
    element.dataset.tucked = ''
  }
  const untuck = () => {
    if (!isTucked()) return
    delete element.dataset.instant
    void element.offsetWidth // so that it slides back up
    delete element.dataset.tucked
  }
  // Called before it has been painted: it pops up somewhere clear, or waits out of sight.
  const arrive = () => {
    if (!isCovering()) return
    const room = findRoom()
    if (room === null) tuck({ instant: true })
    else goTo(room)
  }
  /** Gets it off any content. Resolves true when it is up with nothing under it. */
  const settle = async () => {
    if (pointed || !isCovering()) {
      untuck()
      return true
    }
    const wasUp = !isTucked()
    tuck()
    if (wasUp) await wait(TUCK_MS) // out of sight before it moves, so it never crosses the content
    const room = stopped ? null : findRoom()
    if (room === null) return false
    goTo(room)
    untuck()
    return true
  }

  // ---- eyes ----
  const lookAt = (lookX, lookY) => {
    element.style.setProperty('--look-x', lookX)
    element.style.setProperty('--look-y', lookY)
  }
  const lookAhead = () => {
    element.style.removeProperty('--look-x')
    element.style.removeProperty('--look-y')
  }
  const followPointer = () => {
    lookFrame = 0
    const box = element.getBoundingClientRect()
    const dx = pointer.x - (box.left + box.width / 2)
    // Circling it quickly makes it dizzy. As soon as the circling starts, it stands still to watch.
    const time = performance.now()
    if (circled(dx, pointer.y - (box.top + box.height / 2), time)) react('dizzy')
    else if (circled.noticing(time) && element.dataset.walking && special !== 'peekaboo') halt()
    if (element.dataset.walking || isHeld()) return
    const dy = pointer.y - (box.top + box.height * 0.35) // eye level
    const distance = Math.hypot(dx, dy)
    const scale = distance ? Math.min(1, distance / 160) / distance : 0
    lookAt((dx * scale).toFixed(2), (dy * scale).toFixed(2))
  }

  // ---- doing things ----
  const typing = () => document.activeElement?.matches?.(FIELDS) ?? false
  const held = () => pointed || document.hidden || typing() || isHeld() || special !== null || circled.noticing(performance.now())
  const outOfSight = () => isTucked() || element.dataset.ducked !== undefined

  const play = async (name, hold = wait) => {
    delete element.dataset.action
    void element.offsetWidth // lets the same action play twice running
    element.dataset.action = name
    await hold(DURATION[name])
    if (element.dataset.action === name) delete element.dataset.action
  }

  // One straight movement. Resolves true on arrival, false if halted on the way.
  const move = (toX, toY, speed, easing = 'linear') => {
    const distance = Math.hypot(toX - x, toY - y)
    if (distance < 1) return Promise.resolve(true)
    return new Promise((resolve) => {
      const animation = element.animate([{ translate: `${x}px ${y}px` }, { translate: `${toX}px ${toY}px` }], {
        duration: (distance / speed) * 1000,
        easing,
        fill: 'forwards',
      })
      const end = (arrived) => {
        place(...(arrived ? [toX, toY] : readPosition()))
        animation.cancel()
        haltMotion = null
        resolve(arrived)
      }
      haltMotion = () => end(false)
      animation.onfinish = () => end(true)
    })
  }
  const halt = () => haltMotion?.()

  // ---- reactions to the visitor ----
  // One at a time, and only while it is in view and nothing else has the visitor's attention. It stops walking
  // to react (a flight hovers), and the routine waits until it has finished. None with reduced motion.
  const react = async (name) => {
    if (stopped || still || showingOff || special || outOfSight() || isHeld()) return
    special = name
    halt()
    await play(name)
    special = null
  }
  const isAsleep = () => element.dataset.sleeping !== undefined
  const postponePeek = (ms) => {
    nextPeekAt = Math.max(nextPeekAt, Date.now() + ms)
  }
  const nap = async () => {
    const since = lastActivity
    await play('yawn', pause)
    // Woken during the yawn, or something else came up: stay awake.
    if (stopped || lastActivity !== since || held() || outOfSight() || Date.now() < quietUntil) return
    lookAhead()
    element.dataset.sleeping = ''
  }
  const wake = ({ startled = true } = {}) => {
    if (!isAsleep()) return
    delete element.dataset.sleeping
    napAfter = napDelay()
    postponePeek(CALM_MS) // not the moment it wakes
    endPause()
    if (startled) react('wake')
  }
  // Anything the visitor does. A sleeping robot wakes, with a startled blink unless they only scrolled.
  const active = ({ startle = true } = {}) => {
    lastActivity = Date.now()
    if (element.dataset.action === 'yawn') {
      delete element.dataset.action
      endPause()
    }
    wake({ startled: startle })
  }

  const walk = async (toX, speed = SPEED.walk) => {
    element.dataset.walking = toX > x ? 'right' : 'left'
    lookAt(toX > x ? 0.9 : -0.9, 0)
    await move(toX, y, speed)
    delete element.dataset.walking
    lookAhead()
  }

  // Like move(), but a flight cannot simply stop in mid-air: while held it hovers, then carries on.
  const glide = async (toY, speed) => {
    while (!stopped) {
      while (!stopped && held()) await wait(200)
      if (rising && landNow) return
      if (await move(x, toY, speed, 'ease-in-out')) return
    }
  }
  const fly = async (height) => {
    element.dataset.flying = ''
    landNow = false
    rising = true
    await glide(-height, SPEED.fly)
    rising = false
    if (!landNow && !stopped) await play('look', pause)
    await glide(0, landNow ? SPEED.land : SPEED.fly)
    delete element.dataset.flying
  }

  // ---- peekaboo ----
  // It gets out of sight, comes out of a bottom corner with its hands over its eyes, opens them ("boo!"), ducks
  // back and walks in on that side: that is also how it moves between left and right. The first, as soon as it
  // arrives, goes off to the left and comes out on the right. It waits while the visitor points at it or types,
  // while a menu or popup is open, and in another tab. A random one gives way to scrolling and to form filling.
  const heldBack = () => pointed || document.hidden || typing() || isHeld()
  const interrupted = () => stopped || cutShort
  const whenFree = async () => {
    while (!interrupted() && heldBack()) await wait(200)
  }
  const rest = async (ms) => {
    await wait(ms)
    await whenFree()
  }
  // One leg of it. If something stops it halfway, it carries on from there.
  const travel = async (toX, toY, ms, { easing = 'linear', facing } = {}) => {
    const speed = Math.hypot(toX - x, toY - y) / (ms / 1000) || 1
    while (!interrupted()) {
      await whenFree()
      if (interrupted()) return
      if (facing) element.dataset.walking = facing
      const arrived = await move(toX, toY, speed, easing)
      if (facing) delete element.dataset.walking
      if (arrived) return
    }
  }
  // Where the legs end for its current side, as offsets from home. Measured each time, in case the window changed.
  const legs = () => {
    const { boxLeft, width } = stance()
    const home = boxLeft - x
    const height = element.offsetHeight
    const screen = screenWidth()
    const left = homeSide === 'left'
    return {
      offEdge: (left ? -width - 8 : screen + 8) - home, // just past the edge of the screen
      peekX: (left ? -width * 0.6 : screen - width * 0.4) - home, // leaning out of the corner, head showing
      peekY: height * 0.2,
      beyondX: (left ? -width * 1.3 : screen + width * 0.3) - home, // out of sight past the corner
      beyondY: height * 0.8,
    }
  }
  const wayOutClear = () => {
    const here = stance()
    const [from, to] = homeSide === 'left' ? [0, here.right] : [here.left, screenWidth()]
    return isClear(occupiedSpans(here.top, here.bottom), from + SLACK, to - SLACK)
  }
  const offScreen = (on) => element.toggleAttribute('data-away', on) // and then hidden from the keyboard too
  // Changes it without the slide and tilt transitions. Only ever while it is out of sight.
  const atOnce = (change) => {
    element.dataset.instant = ''
    change()
    void element.offsetWidth
    delete element.dataset.instant
  }
  const standUp = () => {
    delete element.dataset.peek
    delete element.dataset.boo
  }
  const hideAndSeek = async (corner, { opening }) => {
    // Out of sight first (unless it already is): off its side of the screen, or straight down if that way
    // would cross content.
    if (!isTucked()) {
      if (opening || wayOutClear()) {
        const { offEdge } = legs()
        lookAt(homeSide === 'left' ? -0.9 : 0.9, 0)
        await travel(offEdge, 0, Math.max(PEEKABOO.walkMs, Math.min(2400, Math.abs(offEdge - x) / TROT)), { facing: homeSide })
      } else {
        tuck()
        await wait(TUCK_MS)
      }
    }
    if (interrupted()) return
    offScreen(true)
    atOnce(() => delete element.dataset.tucked)
    lookAhead()
    await rest(PEEKABOO.goneMs)
    if (interrupted()) return
    // Out of the corner, hiding its eyes...
    setSide(corner)
    let leg = legs()
    atOnce(() => {
      element.dataset.peek = corner
      element.dataset.boo = 'cover'
      place(leg.beyondX, leg.beyondY)
    })
    offScreen(false)
    await travel(leg.peekX, leg.peekY, PEEKABOO.popMs, { easing: 'cubic-bezier(.2, .9, .3, 1.25)' })
    await rest(PEEKABOO.coverMs)
    if (interrupted()) return
    element.dataset.boo = 'open' // boo!
    lookAt(corner === 'left' ? 0.8 : -0.8, -0.3)
    await rest(PEEKABOO.booMs)
    if (interrupted()) return
    leg = legs()
    await travel(leg.beyondX, leg.beyondY, PEEKABOO.leaveMs, { easing: 'ease-in' })
    if (interrupted()) return
    // ...and home on that side: walking in if its corner is free. If not, it looks for room as usual.
    offScreen(true)
    atOnce(standUp)
    lookAhead()
    if (!cornerClear(corner)) return
    place(legs().offEdge, 0)
    offScreen(false)
    lookAt(corner === 'left' ? 0.9 : -0.9, 0)
    await travel(0, 0, PEEKABOO.walkMs, { facing: corner === 'left' ? 'right' : 'left' })
    lookAhead()
  }
  const peekaboo = async (corner, { opening = false } = {}) => {
    special = 'peekaboo'
    cutShort = false
    element.dataset.peekaboo = ''
    await hideAndSeek(corner, { opening })
    if (stopped) return
    const home = !cutShort && !element.hasAttribute('data-away') && x === 0 && y === 0
    if (!home) {
      // It gave way, or its corner is taken: fully out of sight, then to its place, to come up when there is room.
      if (!element.hasAttribute('data-away')) {
        tuck()
        await wait(TUCK_MS)
        if (stopped) return
      }
      atOnce(() => {
        element.dataset.tucked = ''
        standUp()
        place(0, 0)
      })
      offScreen(false)
      lookAhead()
      unsettled = true
    }
    delete element.dataset.peekaboo
    // Come to rest off any content. If the page is on the move, get out of its way and find room once it is still.
    if (!cutShort && Date.now() >= quietUntil) await settle()
    else if (!cutShort && !inMargin()) {
      tuck()
      unsettled = true
    }
    special = null
    nextPeekAt = Date.now() + peekDelay()
  }
  const filmPlaying = () => [...document.querySelectorAll('video')].some((video) => !video.paused)

  // Walks when it can. Every third move, or when the bottom is crowded, it flies up an empty column instead.
  const roam = async () => {
    const stroll = targetAlongBottom(chooseStroll)
    // With nowhere to walk, it does not fly every single time.
    const mayFly = stroll !== null ? moves % 3 === 2 : lastMove !== 'fly'
    const height = mayFly ? flightHeight() : undefined
    if (height !== undefined) {
      lastMove = 'fly'
      moves += 1
      return fly(height)
    }
    if (stroll !== null) {
      lastMove = 'walk'
      moves += 1
      return walk(stroll)
    }
    lastMove = null
    return doTrick()
  }
  // Tricks can be cut short by scrolling, so that it gets out of the way without waiting for them to end.
  const doTrick = () => {
    for (let tries = 0; tries < TRICKS.length; tries += 1) {
      const name = TRICKS[tricks++ % TRICKS.length]
      if (!NEEDS[name] || hasRoom(NEEDS[name])) return play(name, pause)
    }
    return play('blink', pause)
  }

  const live = async () => {
    // For the opening peekaboo it greets from home even over content; keeping off it resumes right after.
    if (showingOff) untuck()
    else arrive()
    let greeted = still
    if (!greeted && !isTucked()) {
      greeted = true
      await play('greet')
    }
    if (showingOff && !stopped) {
      await peekaboo('right', { opening: true })
      if (stopped) return
      showingOff = false
      openingPlayed = true
      lastActivity = Date.now() // the show is not quiet time: no nap straight after it
    }
    while (!stopped) {
      // Hidden after the page moved: look again soon. In view, it keeps its usual rhythm.
      await pause(unsettled && isTucked() ? CHECK_AGAIN_MS : PAUSE_MS)
      if (stopped) return
      if (held()) postponePeek(CALM_MS)
      if (held() || isAsleep() || Date.now() < quietUntil) continue
      keepOnScreen()
      // Keeping off the content comes first.
      unsettled = false
      const clear = await settle()
      if (stopped || still || held()) continue
      const sleepy = Date.now() - lastActivity >= napAfter
      // A random peekaboo, from hiding too; not when it is due a nap, and not over a film that is playing.
      if (!sleepy && Date.now() >= nextPeekAt && !filmPlaying()) {
        await peekaboo(peekCorner(homeSide))
        continue
      }
      if (!clear) continue
      if (!greeted) {
        greeted = true
        await play('greet')
      } else if (sleepy) await nap()
      else if (step++ % 2 === 0) await roam()
      else await doTrick()
    }
  }

  // ---- what interrupts it ----
  const inRandomPeek = () => !showingOff && element.dataset.peekaboo !== undefined
  const giveWay = () => {
    cutShort = true
    tuck()
    halt()
  }
  // Someone starting to fill in a form: a random peekaboo makes way at once.
  const onFocusIn = (event) => {
    if (inRandomPeek() && event.target instanceof Element && event.target.matches(FIELDS)) giveWay()
  }
  // The page moved under it: get out of the way (unless it is in the margin), come down from any flight,
  // then look for room as soon as things are still.
  const pageMoved = (quietMs) => {
    wake({ startled: false }) // asleep, it could not get out of the way
    postponePeek(CALM_MS)
    // A random peekaboo leans in over the page, so it gives way even where standing would stay in the margin.
    const randomPeek = inRandomPeek()
    if (!showingOff && Date.now() >= quietUntil && !pointed && !isTucked() && (randomPeek || !inMargin())) {
      if (randomPeek) giveWay()
      else {
        tuck()
        if (element.dataset.walking) halt()
      }
    }
    unsettled = true
    quietUntil = Date.now() + quietMs
    if (element.dataset.flying !== undefined && !landNow) {
      landNow = true
      if (rising) halt()
      endPause()
    }
    clearTimeout(settleTimer)
    settleTimer = setTimeout(() => endPause(), quietMs + 20)
  }
  const onScroll = () => {
    active({ startle: false })
    pageMoved(QUIET_AFTER_SCROLL_MS)
  }
  const onResize = () => {
    halt()
    if (!showingOff && special !== 'peekaboo') keepOnScreen() // in a peekaboo it is meant to go off screen
    pageMoved(QUIET_AFTER_SCROLL_MS)
  }
  const onPointerMove = (event) => {
    active()
    if (still) return // reduced motion: its eyes stay put
    pointer = { x: event.clientX, y: event.clientY }
    if (!lookFrame) lookFrame = requestAnimationFrame(followPointer)
  }
  const onKeyDown = (event) => {
    active()
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (event.target instanceof Element && event.target.closest(`${FIELDS}, form`)) hello.reset()
    // Typing "hello" anywhere outside a form starts the secret dance.
    else if (hello(event.key, Date.now())) react(hasRoom(NEEDS.secret) ? 'secret' : 'secret-small')
  }
  const onPointerDown = () => active()
  const onWheel = () => active({ startle: false })
  // Pointed at or focused, it stops where it is, so it is easy to click.
  const onPointed = () => {
    pointed = true
    halt()
  }
  const onUnpointed = () => {
    pointed = element.contains(document.activeElement) && document.activeElement.matches(':focus-visible')
  }
  const onVisibility = () => {
    if (document.hidden) {
      hiddenSince = Date.now()
      halt()
      return
    }
    const away = hiddenSince === null ? 0 : Date.now() - hiddenSince
    hiddenSince = null
    active({ startle: false }) // coming back counts, so it does not nod off the moment you return
    if (away < WELCOME.awayMs) return
    postponePeek(CALM_MS)
    clearTimeout(welcomeTimer)
    welcomeTimer = setTimeout(() => react('welcome'), WELCOME.delayMs)
  }

  const listeners = [
    [window, 'scroll', onScroll],
    [window, 'resize', onResize],
    [window, 'pointermove', onPointerMove],
    [window, 'pointerdown', onPointerDown],
    [window, 'wheel', onWheel],
    [window, 'keydown', onKeyDown],
    [document, 'focusin', onFocusIn],
    [document.documentElement, 'pointerleave', lookAhead],
    [element, 'pointerenter', onPointed],
    [element, 'pointerleave', onUnpointed],
    [element, 'focusin', onPointed],
    [element, 'focusout', onUnpointed],
    [document, 'visibilitychange', onVisibility],
  ]
  listeners.forEach(([target, type, handler]) => target.addEventListener(type, handler, { passive: true }))
  // Restarted while it was off screen (the show interrupted by a setting changing): bring it home.
  {
    const { boxLeft, width, top } = stance()
    if (boxLeft + width < 0 || boxLeft > screenWidth() || top > window.innerHeight - 20) place(0, 0)
  }
  // Content can also move without scrolling.
  let height = document.body.offsetHeight
  const sizes = new ResizeObserver(() => {
    if (document.body.offsetHeight === height) return
    height = document.body.offsetHeight
    pageMoved(CONTENT_QUIET_MS)
  })
  sizes.observe(document.body)
  live()

  return {
    /** A menu or dialog opened. */
    hold: () => {
      wake({ startled: false })
      halt()
    },
    pageChanged: () => pageMoved(NEW_PAGE_MS),
    /** Stops everything and leaves it standing (or hovering) where it is. */
    stop() {
      stopped = true
      halt()
      timers.forEach(clearTimeout)
      timers.clear()
      clearTimeout(settleTimer)
      clearTimeout(welcomeTimer)
      cancelAnimationFrame(lookFrame)
      sizes.disconnect()
      listeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler))
      delete element.dataset.tucked
      delete element.dataset.instant
      delete element.dataset.action
      delete element.dataset.walking
      delete element.dataset.flying
      delete element.dataset.sleeping
      delete element.dataset.peekaboo
      standUp()
      offScreen(false)
      lookAhead()
    },
  }
}

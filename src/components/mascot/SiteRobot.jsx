import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { enquiryLabel } from '../../data/companyData.js'
import { focusMain } from '../../lib/focusMain.js'
import { useMascot } from './MascotProvider.jsx'
import RobotArt from './RobotArt.jsx'
import { startRobotLife } from './robotLife.js'

const isField = (node) =>
  node instanceof Element && !node.closest('[data-mascot]') && node.matches('input, select, textarea, [contenteditable="true"]')

/** While the visitor types in a form the robot is covering, it ducks below the edge of the window. */
function useDuckWhileTyping(rootRef) {
  useEffect(() => {
    const element = rootRef.current
    let frame = 0
    const check = () => {
      frame = 0
      const field = document.activeElement
      let covering = false
      if (isField(field)) {
        const form = (field.closest('form') ?? field).getBoundingClientRect()
        const robot = element.getBoundingClientRect() // ducking moves only what is inside, so this stays put
        covering = form.left < robot.right && form.right > robot.left && form.top < robot.bottom && form.bottom > robot.top
      }
      element.toggleAttribute('data-ducked', covering)
    }
    const soon = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    // Some browsers send no focus event when a field is removed, so moving the pointer rechecks too.
    const onPointerMove = () => {
      if (element.hasAttribute('data-ducked')) soon()
    }
    const listeners = [
      [document, 'focusin', soon],
      [document, 'focusout', soon],
      [window, 'scroll', soon],
      [window, 'resize', soon],
      [window, 'pointermove', onPointerMove],
    ]
    listeners.forEach(([target, type, handler]) => target.addEventListener(type, handler, { passive: true }))
    return () => {
      cancelAnimationFrame(frame)
      listeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler))
    }
  }, [rootRef])
}

// Mounted only while the robot is on screen. The whole robot is a button: it leaves, then the contact popup opens.
function Robot({ leaving }) {
  const { controller, owner, reducedMotion, blocked } = useMascot()
  const { pathname } = useLocation()
  const root = useRef(null)
  const button = useRef(null)
  const life = useRef(null)
  const blockedNow = useRef(blocked)
  const cameFrom = useRef(null)
  const usedKeyboard = useRef(false)

  useEffect(() => {
    if (leaving) return undefined
    // It rests behind menus and dialogs, and while the About character is following the pointer.
    // With reduced motion it stays still, but still keeps off the content.
    life.current = startRobotLife(root.current, { isHeld: () => blockedNow.current || owner.current() === 'about', still: reducedMotion })
    return () => {
      life.current.stop()
      life.current = null
    }
  }, [leaving, reducedMotion, owner])

  useEffect(() => {
    blockedNow.current = blocked
    if (blocked) life.current?.hold()
  }, [blocked])

  useEffect(() => {
    life.current?.pageChanged()
  }, [pathname])

  useDuckWhileTyping(root)

  // If the robot goes away while it has focus, put focus back where it was.
  useLayoutEffect(() => {
    const node = button.current
    return () => {
      if (document.activeElement !== node) return
      const previous = cameFrom.current
      if (previous?.isConnected && previous !== document.body) previous.focus({ preventScroll: true })
      else if (usedKeyboard.current) focusMain()
    }
  }, [])

  return (
    // The box lets clicks through to the page; only the drawing itself takes them.
    <div ref={root} data-mascot="robot" data-phase={leaving ? 'leaving' : 'visible'} data-still={reducedMotion ? '' : undefined} className="mascot-robot">
      <button
        ref={button}
        type="button"
        aria-label={enquiryLabel}
        aria-haspopup="dialog"
        title={enquiryLabel}
        onFocus={(event) => {
          cameFrom.current = event.relatedTarget
          usedKeyboard.current = event.currentTarget.matches(':focus-visible')
        }}
        onClick={() => controller.dismiss()}
        className="robot-button"
      >
        <RobotArt className="mascot-art robot-art" />
      </button>
    </div>
  )
}

export default function SiteRobot() {
  const { robotPhase } = useMascot()
  if (robotPhase !== 'visible' && robotPhase !== 'leaving') return null
  return <Robot leaving={robotPhase === 'leaving'} />
}

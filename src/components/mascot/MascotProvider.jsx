import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useConsultation } from '../../context/ConsultationContext.jsx'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { createAnimationOwner } from '../../lib/mascot/animationOwner.js'
import { createRobotController } from '../../lib/mascot/robotController.js'

const MascotContext = createContext(null)

// Module level, so they survive any remount. Kept only in memory: a click on the robot is remembered while the
// visitor moves around the site, and forgotten when they refresh.
const owner = createAnimationOwner()
const memory = { dismissed: false }

// The popup that opens after a click on the robot. The context is sent with the enquiry.
const ROBOT_ENQUIRY = { context: 'Robot button' }

/**
 * Shared controller for both mascots. Lives in the site layout, so its state outlasts route changes.
 * Menus and drawers report themselves with useMascotBlocker().
 */
export function MascotProvider({ children }) {
  const { request, openConsultation } = useConsultation()
  const eligibleDevice = useMediaQuery('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [controller, setController] = useState(null)
  const [robotPhase, setRobotPhase] = useState('waiting')
  const [blockers, setBlockers] = useState(() => new Set())
  const [pageVisible, setPageVisible] = useState(true)

  const setBlocker = useCallback((id, active) => {
    setBlockers((current) => {
      if (current.has(id) === active) return current
      const next = new Set(current)
      if (active) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  useEffect(() => {
    const instance = createRobotController({ memory, onChange: setRobotPhase, onGone: () => openConsultation(ROBOT_ENQUIRY) })
    setController(instance)
    setRobotPhase(instance.phase())
    return () => instance.destroy()
  }, [openConsultation])

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const blocked = Boolean(request) || blockers.size > 0

  useEffect(() => {
    controller?.setContext({ eligibleDevice, reducedMotion, pageVisible, blocked })
  }, [controller, eligibleDevice, reducedMotion, pageVisible, blocked])

  const value = { owner, controller, robotPhase, reducedMotion, blocked, setBlocker }
  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>
}

export function useMascot() {
  const context = useContext(MascotContext)
  if (!context) throw new Error('useMascot must be used inside <MascotProvider>')
  return context
}

/** Call from anything that covers the page (menus, drawers): the robot rests while it is open. */
export function useMascotBlocker(id, active) {
  const { setBlocker } = useMascot()
  useEffect(() => {
    setBlocker(id, active)
    return () => setBlocker(id, false)
  }, [id, active, setBlocker])
}

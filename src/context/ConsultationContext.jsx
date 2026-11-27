import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ConsultationContext = createContext(null)

/** Every "Discuss your project" button calls openConsultation({ topic, service, context }). `context` says where from. */
export function ConsultationProvider({ children }) {
  const [request, setRequest] = useState(null)
  const openConsultation = useCallback((options = {}) => setRequest(options), [])
  const closeConsultation = useCallback(() => setRequest(null), [])
  const value = useMemo(
    () => ({ request, openConsultation, closeConsultation }),
    [request, openConsultation, closeConsultation],
  )
  return <ConsultationContext.Provider value={value}>{children}</ConsultationContext.Provider>
}

export function useConsultation() {
  const context = useContext(ConsultationContext)
  if (!context) throw new Error('useConsultation must be used inside <ConsultationProvider>')
  return context
}

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useConsultation } from '../../context/ConsultationContext.jsx'
import { enquiryLabel, serviceOptions } from '../../data/companyData.js'
import { useDialog } from '../../hooks/useDialog.js'
import LeadForm from '../forms/LeadForm.jsx'
import { EASE } from '../ui/MotionWrapper.jsx'

// Mounted only while open, so the form resets every time it closes.
function ModalPanel({ request, onClose }) {
  const ref = useDialog(true, onClose)
  const uid = useId()
  // A product or service enquiry preselects its own name in the dropdown.
  const options = request.topic ? [request.topic, ...serviceOptions] : serviceOptions

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-title`}
      aria-describedby={`${uid}-intro`}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.24, ease: EASE }}
      className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-panel border border-edge bg-surface shadow-lift sm:rounded-panel"
    >
      <div aria-hidden="true" className="h-0.5 bg-primary/60" />
      <div className="p-6 sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-4 grid h-11 w-11 place-items-center rounded-control text-body transition hover:bg-raised hover:text-heading">
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
        <h2 id={`${uid}-title`} className="heading-section pr-12 text-2xl">{enquiryLabel}</h2>
        <p id={`${uid}-intro`} className="mb-5 mt-2 text-sm leading-6">
          {request.topic && <>About: <span className="font-semibold text-heading">{request.topic}</span>. </>}
          Your email and a short summary are enough to start.
        </p>
        <LeadForm
          autoFocus
          options={options}
          defaultService={request.topic ?? request.service}
          context={request.context ?? enquiryLabel}
          topic={request.topic}
          onDone={onClose}
        />
      </div>
    </motion.div>
  )
}

export default function ConsultationModal() {
  const { request, closeConsultation } = useConsultation()
  const { pathname } = useLocation()
  const lastPath = useRef(pathname)

  // Moving to another page (the browser's Back button, say) closes the dialog.
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    closeConsultation()
  }, [pathname, closeConsultation])

  return (
    <AnimatePresence>
      {request && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            aria-hidden="true"
            onClick={closeConsultation}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm dark:bg-black/75"
          />
          <ModalPanel request={request} onClose={closeConsultation} />
        </div>
      )}
    </AnimatePresence>
  )
}

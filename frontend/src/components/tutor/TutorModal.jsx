import React, { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { modalBackdrop, modalPanel } from '../../lib/motion'
import ModalPortal from '../ModalPortal'

export default function TutorModal({ open, title, onClose, children, footer }) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <ModalPortal>
          <motion.div
            className="tutor-modal-backdrop tutor-modal-backdrop--motion"
            role="presentation"
            onClick={onClose}
            variants={modalBackdrop}
            initial={reduceMotion ? false : 'initial'}
            animate="animate"
            exit="exit"
          >
            <motion.div
              className="tutor-modal tutor-modal--motion"
              role="dialog"
              aria-modal="true"
              aria-labelledby="tutor-modal-title"
              onClick={(event) => event.stopPropagation()}
              variants={modalPanel}
              initial={reduceMotion ? false : 'initial'}
              animate="animate"
              exit="exit"
            >
            <header className="tutor-modal-header">
              <h2 id="tutor-modal-title">{title}</h2>
              <button
                type="button"
                className="tutor-modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </header>
            <div className="tutor-modal-body">{children}</div>
            {footer && <footer className="tutor-modal-footer">{footer}</footer>}
            </motion.div>
          </motion.div>
        </ModalPortal>
      )}
    </AnimatePresence>
  )
}

export function FormField({ label, htmlFor, children, hint }) {
  return (
    <div className="tutor-form-field">
      <label className="tutor-form-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <span className="tutor-form-hint">{hint}</span>}
    </div>
  )
}

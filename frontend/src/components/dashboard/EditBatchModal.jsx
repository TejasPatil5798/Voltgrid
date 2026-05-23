import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import ModalPortal from '../ModalPortal'

function Field({ label, htmlFor, children }) {
  return (
    <label className="dash-batch-field" htmlFor={htmlFor}>
      <span className="dash-batch-field-label">{label}</span>
      {children}
    </label>
  )
}

export default function EditBatchModal({ open, form, submitting, onClose, onChange, onSubmit }) {
  return (
    <AnimatePresence>
      {open && (
        <ModalPortal>
          <motion.div
            className="dash-schedule-modal-overlay"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="dash-schedule-modal dash-batch-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-batch-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="dash-schedule-modal-head">
              <h2 id="edit-batch-title">Edit batch</h2>
              <button type="button" className="dash-schedule-modal-close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </header>
            <form className="dash-schedule-modal-form" onSubmit={onSubmit}>
              <Field label="Batch name" htmlFor="edit-batch-name">
                <input
                  id="edit-batch-name"
                  className="form-input"
                  required
                  value={form.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                />
              </Field>
              <Field label="Subject / course" htmlFor="edit-batch-subject">
                <input
                  id="edit-batch-subject"
                  className="form-input"
                  value={form.subject}
                  onChange={(e) => onChange({ subject: e.target.value })}
                />
              </Field>
              <Field label="Description" htmlFor="edit-batch-desc">
                <textarea
                  id="edit-batch-desc"
                  className="form-input"
                  rows={3}
                  value={form.description}
                  onChange={(e) => onChange({ description: e.target.value })}
                />
              </Field>
              <footer className="dash-schedule-modal-footer">
                <button type="button" className="btn dash-btn-muted" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save changes'}
                </button>
              </footer>
            </form>
          </motion.div>
        </motion.div>
        </ModalPortal>
      )}
    </AnimatePresence>
  )
}

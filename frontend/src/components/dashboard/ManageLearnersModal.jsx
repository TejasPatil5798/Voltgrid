import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import ModalPortal from '../ModalPortal'
import BatchLearnerManager from './batch/BatchLearnerManager'

export default function ManageLearnersModal({
  open,
  batch,
  learners,
  submitting,
  onClose,
  onAddLearner,
  onRemoveLearner,
}) {
  if (!batch) return null

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
              className="dash-schedule-modal dash-batch-modal dash-batch-modal--dual"
              role="dialog"
              aria-modal="true"
              aria-labelledby="manage-batch-learners-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <header className="dash-schedule-modal-head">
                <div>
                  <h2 id="manage-batch-learners-title">Manage learners</h2>
                  <p className="dash-batch-modal-sub">Add or remove learners for this batch</p>
                </div>
                <button type="button" className="dash-schedule-modal-close" onClick={onClose} aria-label="Close">
                  <X size={20} />
                </button>
              </header>

              <BatchLearnerManager
                batch={batch}
                learners={learners}
                submitting={submitting}
                onAddLearner={onAddLearner}
                onRemoveLearner={onRemoveLearner}
              />

              <footer className="dash-schedule-modal-footer">
                <button type="button" className="btn btn-primary" onClick={onClose}>
                  Done
                </button>
              </footer>
            </motion.div>
          </motion.div>
        </ModalPortal>
      )}
    </AnimatePresence>
  )
}

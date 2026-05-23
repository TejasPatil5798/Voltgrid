import React from 'react'
import { motion } from 'framer-motion'
import TransferButton from './TransferButton'

export default function LearnerCard({
  learner,
  action,
  onTransfer,
  disabled,
  layoutId,
  exitDirection,
}) {
  const exitX = exitDirection === 'left' ? -48 : exitDirection === 'right' ? 48 : 0

  return (
    <motion.li
      className="dash-learner-card dash-card-lift"
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, x: action === 'add' ? 24 : -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: exitX, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {action === 'add' && (
        <TransferButton direction="add" onClick={onTransfer} disabled={disabled} />
      )}
      <div className="dash-learner-card-body">
        <strong>{learner.name || 'Learner'}</strong>
        {learner.email && <span className="dash-learner-card-email">{learner.email}</span>}
        {learner.course && <span className="dash-learner-card-course">{learner.course}</span>}
      </div>
      {action === 'remove' && (
        <TransferButton direction="remove" onClick={onTransfer} disabled={disabled} />
      )}
    </motion.li>
  )
}

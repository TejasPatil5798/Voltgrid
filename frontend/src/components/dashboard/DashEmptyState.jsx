import React from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/motion'

export default function DashEmptyState({
  icon = 'fa-inbox',
  title,
  message,
  action,
  compact = false,
  className = '',
}) {
  const classes = ['dash-empty', compact && 'dash-empty--compact', className]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.div
      className={classes}
      role="status"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <span className="dash-empty-icon" aria-hidden="true">
        <i className={`fas ${icon}`} />
      </span>
      {title && <h3 className="dash-empty-title">{title}</h3>}
      {message && <p className="dash-empty-message">{message}</p>}
      {action && <div className="dash-empty-action">{action}</div>}
    </motion.div>
  )
}

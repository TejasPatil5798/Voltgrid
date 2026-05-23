import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_SMOOTH } from '../lib/motion'

export default function AnimatedProgressBar({
  value,
  label,
  barClassName = 'dash-progress-bar',
  cellClassName = 'dash-progress-cell',
  pctClassName = 'dash-progress-pct',
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={cellClassName}>
      <div
        className={barClassName}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `${value}% complete`}
      >
        <motion.span
          className="dash-progress-fill"
          initial={{ width: reduceMotion ? `${value}%` : '0%' }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.1, ease: EASE_SMOOTH }}
        />
      </div>
      <span className={pctClassName}>{value}%</span>
    </div>
  )
}

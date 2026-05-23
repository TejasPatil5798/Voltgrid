import React from 'react'
import { motion } from 'framer-motion'

export default function TypingIndicator({ label = 'Typing' }) {
  return (
    <motion.div
      className="dash-msg-typing"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      aria-live="polite"
    >
      <span className="dash-msg-typing-label">{label}</span>
      <span className="dash-msg-typing-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </motion.div>
  )
}

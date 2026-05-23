import React from 'react'
import { motion } from 'framer-motion'
import { Check, CheckCheck } from 'lucide-react'

export default function MessageBubble({ message }) {
  const isSelf = message.self

  return (
    <motion.li
      className={`dash-msg-bubble${isSelf ? ' dash-msg-bubble--self' : ''}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {!isSelf && <span className="dash-msg-bubble-from">{message.from}</span>}
      <p>{message.text}</p>
      <div className="dash-msg-bubble-meta">
        <time>{message.time}</time>
        {isSelf && (
          <span className="dash-msg-bubble-status" aria-label={message.read ? 'Read' : 'Sent'}>
            {message.read ? <CheckCheck size={14} /> : <Check size={14} />}
          </span>
        )}
      </div>
    </motion.li>
  )
}

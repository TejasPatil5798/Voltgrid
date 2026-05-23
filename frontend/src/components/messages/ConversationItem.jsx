import React from 'react'
import { motion } from 'framer-motion'
import { getInitials } from '../../lib/messageUtils'

export default function ConversationItem({ conversation, active, onSelect }) {
  const unread = conversation.unreadCount || (conversation.unread ? 1 : 0)
  const name = conversation.peerName || conversation.from

  return (
    <li>
      <motion.button
        type="button"
        className={`dash-msg-conv-item${active ? ' dash-msg-conv-item--active' : ''}${
          unread ? ' dash-msg-conv-item--unread' : ''
        }`}
        onClick={() => onSelect?.(conversation)}
        whileTap={{ scale: 0.99 }}
      >
        <span className="dash-msg-avatar" aria-hidden="true">
          {getInitials(name)}
        </span>
        <span className="dash-msg-conv-body">
          <span className="dash-msg-conv-top">
            <strong className="dash-msg-conv-name">{name || 'Unknown'}</strong>
            <time>{conversation.time}</time>
          </span>
          <span className="dash-msg-conv-role">
            {conversation.peerRole === 'tutor' ? 'Tutor' : 'Learner'}
            {conversation.course ? ` · ${conversation.course}` : ''}
          </span>
          <span className="dash-msg-conv-preview">{conversation.preview}</span>
        </span>
        {unread > 0 && (
          <span className="dash-msg-conv-badge" aria-label={`${unread} unread`}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </motion.button>
    </li>
  )
}

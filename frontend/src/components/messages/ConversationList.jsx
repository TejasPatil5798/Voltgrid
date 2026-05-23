import React from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import ConversationItem from './ConversationItem'
import DashEmptyState from '../dashboard/DashEmptyState'
import { DashListSkeleton } from '../dashboard/DashSkeleton'
import { filterConversations } from '../../lib/messageUtils'

export default function ConversationList({
  conversations,
  loading,
  selectedId,
  search,
  onSearchChange,
  onSelect,
  variant = 'tutor',
}) {
  const filtered = filterConversations(conversations, search)

  return (
    <aside className="dash-msg-sidebar" aria-label="Conversations">
      <div className="dash-msg-search-wrap">
        <Search size={16} className="dash-msg-search-icon" aria-hidden="true" />
        <input
          type="search"
          className="form-input dash-msg-search"
          placeholder="Search conversations…"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          aria-label="Search conversations"
        />
      </div>

      {loading ? (
        <DashListSkeleton count={4} />
      ) : filtered.length === 0 ? (
        <DashEmptyState
          compact
          icon="fa-comments"
          title={search ? 'No matches' : 'No conversations yet'}
          message={
            search
              ? 'Try a different search term.'
              : variant === 'tutor'
                ? 'Messages from your learners will appear here.'
                : 'Start chatting with your assigned tutor.'
          }
        />
      ) : (
        <motion.ul
          className="dash-msg-conv-list"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28 }}
        >
          {filtered.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              active={selectedId === conversation.id}
              onSelect={onSelect}
            />
          ))}
        </motion.ul>
      )}
    </aside>
  )
}

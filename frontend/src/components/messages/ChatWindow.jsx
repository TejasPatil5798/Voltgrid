import React from 'react'
import { AnimatePresence } from 'framer-motion'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'
import EmptyChatState from './EmptyChatState'
import { getInitials } from '../../lib/messageUtils'

export default function ChatWindow({
  conversation,
  messages,
  loading,
  draft,
  sending,
  peerTyping,
  threadRef,
  onThreadScroll,
  variant = 'tutor',
  onDraftChange,
  onSend,
}) {
  if (!conversation) {
    return (
      <section className="dash-msg-chat">
        <EmptyChatState />
      </section>
    )
  }

  const name = conversation.peerName || conversation.from

  return (
    <section className="dash-msg-chat" aria-label="Chat">
      <header className="dash-msg-chat-head">
        <span className="dash-msg-avatar dash-msg-avatar--lg" aria-hidden="true">
          {getInitials(name)}
        </span>
        <div className="dash-msg-chat-head-copy">
          <h3 className="dash-msg-chat-peer-name">{name || 'Conversation'}</h3>
          <p>
            {conversation.peerRole === 'tutor' ? 'Tutor' : 'Learner'}
            {conversation.course ? ` · ${conversation.course}` : ''}
          </p>
        </div>
      </header>

      <ul
        ref={threadRef}
        className="dash-msg-chat-thread"
        aria-live="polite"
        onScroll={onThreadScroll}
      >
        {loading ? (
          <li className="dash-msg-chat-loading">Loading messages…</li>
        ) : messages.length === 0 ? (
          <li className="dash-msg-chat-loading">No messages yet. Say hello!</li>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        <AnimatePresence>
          {peerTyping && (
            <li key="typing">
              <TypingIndicator label={variant === 'tutor' ? 'You are typing…' : 'Typing…'} />
            </li>
          )}
        </AnimatePresence>
      </ul>

      <MessageInput
        id={`${variant}-chat-input`}
        value={draft}
        onChange={onDraftChange}
        onSend={onSend}
        sending={sending}
        placeholder={
          variant === 'tutor' ? 'Reply to your learner…' : 'Message your tutor…'
        }
      />
    </section>
  )
}

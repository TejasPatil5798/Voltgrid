import React from 'react'
import { Send } from 'lucide-react'
import DashEmptyState from './DashEmptyState'
import { DashListSkeleton } from './DashSkeleton'

export default function DashboardMessagesChat({
  variant = 'tutor',
  threads = [],
  selectedThread,
  threadMessages = [],
  threadLoading = false,
  loading = false,
  draft = '',
  sending = false,
  onSelectThread,
  onDraftChange,
  onSend,
}) {
  const isTutor = variant === 'tutor'

  function handleSubmit(event) {
    event.preventDefault()
    if (!draft.trim() || sending || !selectedThread) return
    onSend?.(draft.trim())
  }

  return (
    <div className={`dash-messages-chat dash-messages-chat--${variant}`}>
      <aside className="dash-messages-chat-sidebar" aria-label="Conversations">
        {loading ? (
          <DashListSkeleton count={4} />
        ) : threads.length === 0 ? (
          <DashEmptyState
            compact
            icon="fa-comments"
            title="No conversations yet"
            message={
              isTutor
                ? 'When learners message you, threads will appear here.'
                : 'Send a message to your tutor to start a conversation.'
            }
          />
        ) : (
          <ul className="dash-messages-thread-list">
            {threads.map((thread) => {
              const active = selectedThread?.id === thread.id
              return (
                <li key={thread.id}>
                  <button
                    type="button"
                    className={`dash-messages-thread-btn${active ? ' dash-messages-thread-btn--active' : ''}${
                      thread.unread ? ' dash-messages-thread-btn--unread' : ''
                    }`}
                    onClick={() => onSelectThread?.(thread)}
                  >
                    <span className="dash-messages-thread-top">
                      <strong>{thread.from}</strong>
                      <time>{thread.time}</time>
                    </span>
                    {thread.course && (
                      <span className="dash-messages-thread-course">{thread.course}</span>
                    )}
                    <span className="dash-messages-thread-preview">{thread.preview}</span>
                    {thread.unread && <span className="dash-messages-thread-badge">New</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </aside>

      <section className="dash-messages-chat-main" aria-label="Chat">
        {!selectedThread ? (
          <DashEmptyState
            compact
            icon="fa-message"
            title="Select a conversation"
            message="Choose a thread from the list to view messages and reply."
          />
        ) : (
          <>
            <header className="dash-messages-chat-head">
              <div>
                <h3>{selectedThread.from}</h3>
                {selectedThread.course && <p>{selectedThread.course}</p>}
              </div>
            </header>

            <ul className="dash-messages-chat-thread" aria-live="polite">
              {threadLoading ? (
                <li className="dash-messages-chat-loading">Loading messages…</li>
              ) : threadMessages.length === 0 ? (
                <li className="dash-messages-chat-loading">No messages in this thread yet.</li>
              ) : (
                threadMessages.map((message) => (
                  <li
                    key={message.id}
                    className={`dash-messages-bubble${
                      message.self ? ' dash-messages-bubble--self' : ''
                    }`}
                  >
                    <span className="dash-messages-bubble-from">{message.from}</span>
                    <p>{message.text}</p>
                    <time>{message.time}</time>
                  </li>
                ))
              )}
            </ul>

            <form className="dash-messages-chat-form" onSubmit={handleSubmit}>
              <label className="visually-hidden" htmlFor={`${variant}-chat-input`}>
                Type your message
              </label>
              <textarea
                id={`${variant}-chat-input`}
                className="form-input dash-messages-chat-input"
                rows={3}
                placeholder={isTutor ? 'Reply to your learner…' : 'Ask your tutor a question…'}
                value={draft}
                onChange={(e) => onDraftChange?.(e.target.value)}
                disabled={sending}
              />
              <button
                type="submit"
                className="btn btn-primary dash-messages-chat-send"
                disabled={sending || !draft.trim()}
              >
                <Send size={16} aria-hidden="true" />
                {sending ? 'Sending…' : 'Send'}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}

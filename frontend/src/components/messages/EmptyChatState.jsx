import React from 'react'
import { MessageSquare } from 'lucide-react'

export default function EmptyChatState({
  title = 'Select a conversation',
  message = 'Choose a thread from the list to view messages and reply.',
}) {
  return (
    <div className="dash-msg-empty">
      <span className="dash-msg-empty-icon" aria-hidden="true">
        <MessageSquare size={40} strokeWidth={1.5} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}

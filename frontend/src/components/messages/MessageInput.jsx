import React from 'react'
import { motion } from 'framer-motion'
import { Paperclip, Send } from 'lucide-react'

export default function MessageInput({
  id = 'chat-input',
  value,
  onChange,
  onSend,
  sending = false,
  disabled = false,
  placeholder = 'Type a message…',
}) {
  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (value.trim() && !sending && !disabled) onSend?.(value.trim())
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (value.trim() && !sending && !disabled) onSend?.(value.trim())
  }

  return (
    <form className="dash-msg-input-form" onSubmit={handleSubmit}>
      <button
        type="button"
        className="dash-msg-attach-btn"
        disabled
        title="Attachments coming soon"
        aria-label="Attach file (coming soon)"
      >
        <Paperclip size={18} aria-hidden="true" />
      </button>
      <label className="visually-hidden" htmlFor={id}>
        Message
      </label>
      <textarea
        id={id}
        className="form-input dash-msg-input-field"
        rows={2}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={sending || disabled}
      />
      <motion.button
        type="submit"
        className="btn btn-primary dash-msg-send-btn"
        disabled={sending || disabled || !value.trim()}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <Send size={16} aria-hidden="true" />
        {sending ? 'Sending…' : 'Send'}
      </motion.button>
    </form>
  )
}

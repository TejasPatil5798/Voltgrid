import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import NotificationDropdown from './NotificationDropdown'

export default function NotificationBell({
  notifications,
  unreadCount,
  onMarkAllRead,
  loading = false,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  async function handleMarkAll() {
    await onMarkAllRead()
    setOpen(false)
  }

  return (
    <div className={`dash-notif-bell-wrap ${className}`.trim()} ref={wrapRef}>
      <motion.button
        type="button"
        className="dash-notif-bell-btn"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
      >
        <Bell size={20} strokeWidth={2} aria-hidden="true" />
        {unreadCount > 0 && (
          <motion.span
            className="dash-notif-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            aria-hidden="true"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <NotificationDropdown
        open={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAll}
        loading={loading}
      />
    </div>
  )
}

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCheck } from 'lucide-react'

export default function NotificationDropdown({
  open,
  onClose,
  notifications,
  unreadCount,
  onMarkAllRead,
  loading,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="dash-notif-backdrop"
            aria-label="Close notifications"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="dash-notif-dropdown"
            role="dialog"
            aria-label="Notifications"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="dash-notif-dropdown-head">
              <div className="dash-notif-dropdown-title">
                <Bell size={18} aria-hidden="true" />
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <span className="dash-notif-dropdown-count">{unreadCount} new</span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="dash-notif-mark-all"
                  onClick={onMarkAllRead}
                  disabled={loading}
                >
                  <CheckCheck size={16} aria-hidden="true" />
                  Mark all as read
                </button>
              )}
            </div>

            <ul className="dash-notif-list">
              {loading && (
                <li className="dash-notif-empty">Loading notifications…</li>
              )}
              {!loading && notifications.length === 0 && (
                <li className="dash-notif-empty">You&apos;re all caught up.</li>
              )}
              {!loading &&
                notifications.map((item) => (
                  <li
                    key={item.id}
                    className={`dash-notif-item${item.read ? '' : ' dash-notif-item--unread'}`}
                  >
                    <div className="dash-notif-item-head">
                      <strong>{item.title}</strong>
                      <time>{item.time}</time>
                    </div>
                    <p>{item.message}</p>
                  </li>
                ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

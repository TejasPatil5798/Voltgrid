import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { dashboardPathForRole, getCurrentUser, isLoggedIn } from '../../lib/auth'
import { fetchMessageUnreadCountSafe, POLL_MS } from '../../lib/messagingApi'

export default function MessageNotificationBadge({ className = '' }) {
  const user = getCurrentUser()
  const loggedIn = isLoggedIn() && user?.role
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!loggedIn || (user.role !== 'tutor' && user.role !== 'learner')) return undefined

    async function load() {
      const res = await fetchMessageUnreadCountSafe()
      setCount(res.count ?? 0)
    }

    load()
    const id = window.setInterval(load, POLL_MS)
    return () => window.clearInterval(id)
  }, [loggedIn, user?.role])

  if (!loggedIn || (user.role !== 'tutor' && user.role !== 'learner')) return null

  const to = `${dashboardPathForRole(user.role)}?tab=messages`

  return (
    <Link
      to={to}
      className={`dash-msg-nav-link ${className}`.trim()}
      aria-label={`Messages${count ? `, ${count} unread` : ''}`}
    >
      <motion.span className="dash-msg-nav-icon" whileTap={{ scale: 0.94 }}>
        <MessageCircle size={20} strokeWidth={2} aria-hidden="true" />
        {count > 0 && (
          <motion.span
            className="dash-msg-nav-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            aria-hidden="true"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </motion.span>
    </Link>
  )
}

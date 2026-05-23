function relativeTime(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(date).toLocaleDateString('en-IN')
}

export function formatThreadMessages(rows, selfRole, peerDisplayName) {
  const selfRoles =
    selfRole === 'learner' ? ['learner', 'student'] : selfRole === 'tutor' ? ['tutor'] : [selfRole]
  const peerLabel = peerDisplayName?.trim() || ''

  return (rows || []).map((msg) => {
    const isSelf = selfRoles.includes(msg.fromRole)
    const read = !!(msg.read || msg.readAt)
    const fallbackPeer =
      msg.fromRole === 'tutor' ? 'Tutor' : msg.studentName || msg.senderName || 'Learner'
    return {
      id: msg._id?.toString?.() || msg.id,
      text: msg.text,
      fromRole: msg.fromRole,
      self: isSelf,
      from: isSelf ? 'You' : peerLabel || fallbackPeer,
      time: msg.time || relativeTime(msg.createdAt),
      createdAt: msg.createdAt,
      read,
      readAt: msg.readAt,
      status: isSelf ? (read ? 'read' : 'sent') : undefined,
    }
  })
}

export function filterConversations(conversations, query) {
  const q = query.trim().toLowerCase()
  if (!q) return conversations
  return conversations.filter((c) => {
    const haystack = [c.peerName, c.from, c.course, c.preview, c.peerRole]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function getInitials(name) {
  const parts = String(name || '?')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

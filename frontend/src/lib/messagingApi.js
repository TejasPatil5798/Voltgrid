import { getRole, ROLES } from './auth'
import {
  fetchLearnerMessages,
  fetchLearnerMessageThread,
  sendLearnerMessage,
  fetchLearnerMessagesSafe,
} from './learnerApi'
import { fetchMessages, fetchMessageThread, replyToMessage } from './tutorApi'
import { apiUrl } from './api'
import { getToken } from './auth'

const POLL_MS = 12000

export { POLL_MS }

export function fetchMessageUnreadCount() {
  const role = getRole()
  const path =
    role === ROLES.tutor
      ? '/api/tutor/messages/unread-count'
      : '/api/learner/messages/unread-count'
  const token = getToken()
  if (!token) return Promise.resolve({ success: true, count: 0 })

  return fetch(apiUrl(path), {
    headers: { Authorization: 'Bearer ' + token },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) throw new Error(data.error)
      return data
    })
}

export async function fetchConversationsSafe() {
  const role = getRole()
  try {
    if (role === ROLES.tutor) return await fetchMessages()
    if (role === ROLES.learner) return await fetchLearnerMessagesSafe()
    return { success: true, data: [] }
  } catch {
    return { success: true, data: [], source: 'mock' }
  }
}

export async function fetchConversationThread(conversation) {
  const role = getRole()
  if (!conversation?.id) return { success: true, data: [] }

  if (role === ROLES.tutor) {
    return fetchMessageThread(
      conversation.id,
      conversation.studentId,
    )
  }
  return fetchLearnerMessageThread(conversation.id, conversation.tutorId)
}

export async function sendChatMessage({ conversation, text }) {
  const role = getRole()
  const body = {
    text,
    threadId: conversation.id || conversation.threadId,
    courseId: conversation.courseId,
    courseTitle: conversation.course,
  }

  if (role === ROLES.tutor) {
    return replyToMessage({
      ...body,
      studentId: conversation.studentId,
    })
  }
  return sendLearnerMessage({
    ...body,
    tutorId: conversation.tutorId,
  })
}

export async function fetchMessageUnreadCountSafe() {
  try {
    return await fetchMessageUnreadCount()
  } catch {
    return { success: true, count: 0, source: 'mock' }
  }
}

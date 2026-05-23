import { apiUrl } from './api'
import { getToken } from './auth'
import {
  MOCK_NOTIFICATIONS_LEARNER,
  MOCK_SCHEDULE_LEARNER,
} from './mockScheduleData'

async function learnerFetch(path, options = {}) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((data && data.error) || res.statusText || 'Request failed')
  }
  return data
}

export function fetchLearnerDashboard() {
  return learnerFetch('/api/learner/dashboard')
}

export function fetchLearnerCourses() {
  return learnerFetch('/api/learner/courses')
}

export function fetchLearnerBatches() {
  return learnerFetch('/api/learner/batches')
}

export function fetchLearnerMessages() {
  return learnerFetch('/api/learner/messages')
}

export function fetchLearnerMessageThread(threadId, tutorId) {
  const qs = tutorId ? '?tutorId=' + encodeURIComponent(tutorId) : ''
  return learnerFetch('/api/learner/messages/' + encodeURIComponent(threadId) + qs)
}

export function fetchLearnerMessageUnreadCount() {
  return learnerFetch('/api/learner/messages/unread-count')
}

export function sendLearnerMessage(body) {
  return learnerFetch('/api/learner/messages', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function fetchLearnerSchedule(params = {}) {
  const qs = new URLSearchParams()
  if (params.from) qs.set('from', params.from)
  if (params.to) qs.set('to', params.to)
  const query = qs.toString()
  return learnerFetch('/api/learner/schedule' + (query ? `?${query}` : ''))
}

export function fetchLearnerNotifications() {
  return learnerFetch('/api/learner/notifications')
}

export function markAllLearnerNotificationsRead() {
  return learnerFetch('/api/learner/notifications/read-all', { method: 'PATCH' })
}

/** Use API with mock fallback for development without MongoDB */
const MOCK_ENROLLED_COURSES = [
  {
    id: 'ec1',
    title: 'Power Systems Protection',
    tutor: 'Dr. Rajesh Kumar',
    progress: 78,
    modulesDone: 6,
    modulesTotal: 8,
    batch: '',
    readOnly: true,
  },
  {
    id: 'ec2',
    title: 'Grid Operations & Control',
    tutor: 'Ms. Ananya Desai',
    progress: 62,
    modulesDone: 4,
    modulesTotal: 6,
    batch: '',
    readOnly: true,
  },
]

export async function fetchLearnerCoursesSafe() {
  try {
    return await fetchLearnerCourses()
  } catch {
    return { success: true, data: MOCK_ENROLLED_COURSES, source: 'mock' }
  }
}

export async function fetchLearnerBatchesSafe() {
  try {
    return await fetchLearnerBatches()
  } catch {
    return { success: true, data: [], source: 'mock' }
  }
}

export async function fetchLearnerMessagesSafe() {
  try {
    return await fetchLearnerMessages()
  } catch {
    return { success: true, data: [], source: 'mock' }
  }
}

export async function fetchLearnerScheduleSafe(params) {
  try {
    return await fetchLearnerSchedule(params)
  } catch {
    return { success: true, data: MOCK_SCHEDULE_LEARNER, source: 'mock' }
  }
}

export async function fetchLearnerNotificationsSafe() {
  try {
    return await fetchLearnerNotifications()
  } catch {
    return {
      success: true,
      data: MOCK_NOTIFICATIONS_LEARNER,
      unreadCount: MOCK_NOTIFICATIONS_LEARNER.filter((n) => !n.read).length,
      source: 'mock',
    }
  }
}

export async function markAllLearnerNotificationsReadSafe() {
  try {
    return await markAllLearnerNotificationsRead()
  } catch {
    return { success: true, source: 'mock' }
  }
}

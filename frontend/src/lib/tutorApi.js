import { apiUrl } from './api'
import { getRole, getToken, ROLES } from './auth'

async function tutorFetch(path, options = {}) {
  if (getRole() !== ROLES.tutor) {
    throw new Error('Only tutors can manage courses and batches.')
  }
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

export function fetchTutorDashboard() {
  return tutorFetch('/api/tutor/dashboard')
}

export function fetchTutorCourses() {
  return tutorFetch('/api/tutor/courses')
}

export function createCourse(body) {
  return tutorFetch('/api/tutor/courses', { method: 'POST', body: JSON.stringify(body) })
}

export function updateCourse(id, body) {
  return tutorFetch('/api/tutor/courses/' + id, { method: 'PUT', body: JSON.stringify(body) })
}

export function fetchCourseContent(id) {
  return tutorFetch('/api/tutor/courses/' + id + '/content')
}

export function uploadLesson(body) {
  return tutorFetch('/api/tutor/lessons', { method: 'POST', body: JSON.stringify(body) })
}

export function uploadNote(body) {
  return tutorFetch('/api/tutor/notes', { method: 'POST', body: JSON.stringify(body) })
}

export function createAssignment(body) {
  return tutorFetch('/api/tutor/assignments', { method: 'POST', body: JSON.stringify(body) })
}

export function createQuiz(body) {
  return tutorFetch('/api/tutor/quizzes', { method: 'POST', body: JSON.stringify(body) })
}

export function fetchSchedule() {
  return tutorFetch('/api/tutor/schedule')
}

export function createScheduleItem(body) {
  return tutorFetch('/api/tutor/schedule', { method: 'POST', body: JSON.stringify(body) })
}

export function updateScheduleItem(id, body) {
  return tutorFetch('/api/tutor/schedule/' + id, { method: 'PUT', body: JSON.stringify(body) })
}

export function deleteScheduleItem(id) {
  return tutorFetch('/api/tutor/schedule/' + id, { method: 'DELETE' })
}

export function fetchTutorNotifications() {
  return tutorFetch('/api/tutor/notifications')
}

export function markAllTutorNotificationsRead() {
  return tutorFetch('/api/tutor/notifications/read-all', { method: 'PATCH' })
}

export function fetchMessages() {
  return tutorFetch('/api/tutor/messages')
}

export function fetchMessageThread(threadId, studentId) {
  const qs = studentId ? '?studentId=' + encodeURIComponent(studentId) : ''
  return tutorFetch('/api/tutor/messages/' + encodeURIComponent(threadId) + qs)
}

export function fetchTutorMessageUnreadCount() {
  return tutorFetch('/api/tutor/messages/unread-count')
}

export function replyToMessage(body) {
  return tutorFetch('/api/tutor/messages/reply', { method: 'POST', body: JSON.stringify(body) })
}

export function fetchLearners() {
  return tutorFetch('/api/tutor/learners')
}

/** All learner accounts (for batch assignment), deduped by student. */
export function fetchLearnerPool() {
  return tutorFetch('/api/tutor/learners?pool=true')
}

export function fetchBatches() {
  return tutorFetch('/api/tutor/batches')
}

export function createBatch(body) {
  return tutorFetch('/api/tutor/batches', { method: 'POST', body: JSON.stringify(body) })
}

export function updateBatch(id, body) {
  return tutorFetch('/api/tutor/batches/' + id, { method: 'PUT', body: JSON.stringify(body) })
}

export function deleteBatch(id) {
  return tutorFetch('/api/tutor/batches/' + id, { method: 'DELETE' })
}

export function addBatchLearner(batchId, studentId) {
  return tutorFetch('/api/tutor/batches/' + batchId + '/learners', {
    method: 'POST',
    body: JSON.stringify({ studentId }),
  })
}

export function removeBatchLearner(batchId, studentId) {
  return tutorFetch('/api/tutor/batches/' + batchId + '/learners/' + studentId, {
    method: 'DELETE',
  })
}

export function fetchTutorProfile() {
  return tutorFetch('/api/tutor/profile')
}

export function updateTutorProfile(body) {
  return tutorFetch('/api/tutor/profile', { method: 'PUT', body: JSON.stringify(body) })
}

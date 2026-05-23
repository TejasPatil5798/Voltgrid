import { apiUrl } from './api'
import { getToken } from './auth'

async function adminFetch(path, options = {}) {
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

export function fetchAdminUsers(role) {
  const q = role ? `?role=${encodeURIComponent(role)}` : ''
  return adminFetch('/api/admin/users' + q)
}

export function createAdminUser(body) {
  return adminFetch('/api/admin/users', { method: 'POST', body: JSON.stringify(body) })
}

export function updateAdminUser(id, body) {
  return adminFetch('/api/admin/users/' + id, { method: 'PUT', body: JSON.stringify(body) })
}

export function deleteAdminUser(id) {
  return adminFetch('/api/admin/users/' + id, { method: 'DELETE' })
}

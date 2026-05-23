const TOKEN_KEY = 'vg_token'
const USER_KEY = 'vg_user'

export const ROLES = {
  admin: 'admin',
  tutor: 'tutor',
  learner: 'learner',
}

/** @deprecated legacy role value */
export const LEGACY_LEARNER_ROLE = 'student'

export function normalizeRole(role) {
  if (role === LEGACY_LEARNER_ROLE) return ROLES.learner
  return role
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function decodeToken(token) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function getCurrentUser() {
  const stored = getStoredUser()
  if (stored?.role) {
    return { ...stored, role: normalizeRole(stored.role) }
  }
  const decoded = decodeToken(getToken())
  if (!decoded) return null
  return {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    role: normalizeRole(decoded.role),
  }
}

export function getRole() {
  return normalizeRole(getCurrentUser()?.role || null)
}

export function isLoggedIn() {
  return Boolean(getToken())
}

export function dashboardPathForRole(role) {
  switch (role) {
    case ROLES.admin:
      return '/admin'
    case ROLES.tutor:
      return '/tutor'
    case ROLES.learner:
      return '/learner'
    default:
      return '/login'
  }
}

export function roleLabel(role) {
  switch (role) {
    case ROLES.admin:
      return 'Admin'
    case ROLES.tutor:
      return 'Tutor'
    case ROLES.learner:
      return 'Learner'
    default:
      return 'User'
  }
}

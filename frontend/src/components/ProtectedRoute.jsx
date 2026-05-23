import React from 'react'
import { Navigate } from 'react-router-dom'
import { dashboardPathForRole, getRole, isLoggedIn, normalizeRole } from '../lib/auth'

export default function ProtectedRoute({ allowedRoles, children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }

  const role = getRole()
  const allowed = allowedRoles.map(normalizeRole)
  if (!role || !allowed.includes(role)) {
    const fallback = role ? dashboardPathForRole(role) : '/login'
    return <Navigate to={fallback} replace />
  }

  return children
}

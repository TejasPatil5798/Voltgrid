import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  clearSession,
  dashboardPathForRole,
  getCurrentUser,
  roleLabel,
} from '../lib/auth'

export default function UserProfileMenu({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = getCurrentUser()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    function handleClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    function handleKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  if (!user?.role) return null

  const dashboardPath = dashboardPathForRole(user.role)

  function go(path) {
    setOpen(false)
    onNavigate?.()
    navigate(path)
  }

  function handleLogout() {
    setOpen(false)
    onNavigate?.()
    clearSession()
    navigate('/login')
    window.location.reload()
  }

  return (
    <div className="user-profile-menu" ref={menuRef}>
      <button
        type="button"
        className={`user-profile-trigger${open ? ' is-open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        onClick={() => setOpen((value) => !value)}
      >
        <img src="/Favicon.png" alt="" className="user-profile-logo" width={40} height={40} />
      </button>

      {open && (
        <div className="user-profile-dropdown" role="menu">
          <div className="user-profile-dropdown-head">
            <strong>{user.name || 'Account'}</strong>
            <span>{user.email}</span>
            <span className="user-profile-role">{roleLabel(user.role)}</span>
          </div>
          <button type="button" role="menuitem" onClick={() => go('/profile')}>
            View profile
          </button>
          <button type="button" role="menuitem" onClick={() => go('/profile?edit=1')}>
            Edit profile
          </button>
          <button type="button" role="menuitem" onClick={() => go(dashboardPath)}>
            {roleLabel(user.role)} dashboard
          </button>
          <button type="button" role="menuitem" className="user-profile-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

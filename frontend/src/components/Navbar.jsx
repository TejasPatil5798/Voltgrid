import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  clearSession,
  dashboardPathForRole,
  getCurrentUser,
  isLoggedIn,
  roleLabel,
} from '../lib/auth'
import MessageNotificationBadge from './messages/MessageNotificationBadge'
import UserProfileMenu from './UserProfileMenu'

function NavLinks({ items, loggedIn, user, onNavigate, onLogout }) {
  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          onClick={onNavigate}
        >
          {item.label}
        </NavLink>
      ))}
      {loggedIn ? (
        <>
          <NavLink
            to={dashboardPathForRole(user.role)}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            onClick={onNavigate}
          >
            {roleLabel(user.role)} Dashboard
          </NavLink>
          <button type="button" className="nav-link nav-link-button" onClick={onLogout}>
            Logout
          </button>
        </>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          onClick={onNavigate}
        >
          Login
        </NavLink>
      )}
    </>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const headerBarRef = React.useRef(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const loggedIn = isLoggedIn() && user?.role

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/programs', label: 'Programs' },
    { to: '/safety', label: 'Safety' },
    { to: '/contact', label: 'Contact' },
    { to: '/experts', label: 'Experts' },
  ]

  React.useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  React.useEffect(() => {
    const bar = headerBarRef.current
    if (!bar) return undefined

    function syncHeaderHeight() {
      document.documentElement.style.setProperty('--site-header-h', `${bar.offsetHeight}px`)
    }

    syncHeaderHeight()
    const observer = new ResizeObserver(syncHeaderHeight)
    observer.observe(bar)
    window.addEventListener('resize', syncHeaderHeight)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncHeaderHeight)
    }
  }, [])

  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
  }

  function toggleMenu() {
    setMenuOpen((open) => !open)
  }

  function handleLogout() {
    clearSession()
    navigate('/login')
    window.location.reload()
  }

  return (
    <header className="site-header">
      <div className="site-header-bar" ref={headerBarRef}>
        <div className="brand-block">
          <NavLink to="/" className="brand-link" onClick={closeMenu} aria-label="Voltgrid Insights home">
            <img
              src="/Logo.jpeg"
              alt="Voltgrid Insights"
              className="brand-logo"
              width={220}
              height={64}
              decoding="async"
            />
          </NavLink>
        </div>

        <div className="site-header-actions">
          {loggedIn && (user.role === 'tutor' || user.role === 'learner') && (
            <MessageNotificationBadge className="site-header-msg" />
          )}
          <nav id="navMenu" className={'site-nav' + (menuOpen ? ' show' : '')} aria-label="Main navigation">
            <NavLinks
              items={navItems}
              loggedIn={loggedIn}
              user={user}
              onNavigate={closeMenu}
              onLogout={handleLogout}
            />
          </nav>
          {loggedIn && <UserProfileMenu onNavigate={closeMenu} />}
        </div>

        <button
          type="button"
          className={'menu-toggle' + (menuOpen ? ' is-open' : '')}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="navMenu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="site-nav-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}
    </header>
  )
}

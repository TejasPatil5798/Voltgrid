import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export default function Navbar(){
  const [menuOpen, setMenuOpen] = React.useState(false)
  const { pathname } = useLocation()
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/programs', label: 'Programs' },
    { to: '/safety', label: 'Safety' },
    { to: '/contact', label: 'Contact' },
  ]

  React.useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  function toggleMenu() {
    setMenuOpen((open) => !open)
  }

  return (
    <header className="site-header">
      <div className="brand-block">
        <NavLink to="/" className="brand-link" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">VI</span>
          <span className="brand-copy">
            <span className="logo">Voltgrid Insights</span>
            <span className="brand-tagline">Power. Precision. Performance.</span>
          </span>
        </NavLink>
      </div>
      
      <button
        type="button"
        className={"menu-toggle" + (menuOpen ? " is-open" : "")}
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-controls="navMenu"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav id="navMenu" className={"site-nav" + (menuOpen ? " show" : "")}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

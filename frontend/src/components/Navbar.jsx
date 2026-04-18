import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar(){
  const [menuOpen, setMenuOpen] = React.useState(false)
  const { pathname } = useLocation()

  React.useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  function toggleMenu() {
    setMenuOpen((open) => !open)
  }

  return (
    <header className="site-header">
      <div className="brand-block">
        <div className="logo">Voltgrid Insights</div>
        <div className="brand-tagline">Power. Precision. Performance.</div>
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
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/programs" onClick={() => setMenuOpen(false)}>Programs</Link>
        <Link to="/safety" onClick={() => setMenuOpen(false)}>Safety</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        {/* <Link to="/experts">Experts</Link> */}
        {/* <Link to="/admin">Admin</Link> */}
      </nav>
      <div className="nav-actions">
        {/* {authed ? (
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        ) : (
          <Link to="/login" className="btn btn-danger">Login</Link>
        )} */}

      </div>
    </header>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <header>
      <div>
        <div className="logo">Voltgrid Insights</div>
        <div className=''>Power. Precision. Performance.</div>
      </div>
      
      <nav id="navMenu">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/programs">Programs</Link>
        <Link to="/safety">Safety</Link>
        <Link to="/contact">Contact</Link>
        {/* <Link to="/experts">Experts</Link> */}
        {/* <Link to="/admin">Admin</Link> */}
      </nav>
      <div className="nav-actions">
        {/* {authed ? (
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        ) : (
          <Link to="/login" className="btn btn-danger">Login</Link>
        )} */}

      <div className="menu-toggle" onClick={() => document.getElementById('navMenu').classList.toggle('show')}>
        <i className="fas fa-bars"></i>
      </div>
      </div>
    </header>
  )
}

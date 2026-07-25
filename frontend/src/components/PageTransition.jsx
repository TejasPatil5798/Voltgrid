import React from 'react'
import { useLocation } from 'react-router-dom'

/** Lightweight page wrapper — avoids Framer Motion exit animations getting stuck blank. */
export default function PageTransition({ children }) {
  const location = useLocation()

  return (
    <div className="page-transition" key={location.pathname}>
      {children}
    </div>
  )
}

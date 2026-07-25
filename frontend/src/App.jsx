import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Safety from './pages/Safety'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Experts from './pages/Experts'
import Admin from './pages/Admin'
import Tutor from './pages/Tutor'
import Learner from './pages/Learner'
import { ROLES } from './lib/auth'
import { trackSiteVisit } from './lib/visitTracker'

function ScrollToTop() {
  const { pathname } = useLocation()

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default function App() {
  const location = useLocation()

  React.useEffect(() => {
    trackSiteVisit()
  }, [])

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <PageTransition>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/experts" element={<Experts />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.admin]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor"
            element={
              <ProtectedRoute allowedRoles={[ROLES.tutor]}>
                <Tutor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learner"
            element={
              <ProtectedRoute allowedRoles={[ROLES.learner]}>
                <Learner />
              </ProtectedRoute>
            }
          />
          <Route path="/student" element={<Navigate to="/learner" replace />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </PageTransition>
      <Footer />
    </div>
  )
}

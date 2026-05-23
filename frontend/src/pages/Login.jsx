import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiUrl } from '../lib/api'
import { dashboardPathForRole, setSession } from '../lib/auth'

const portalHighlights = [
  'Sign in with your assigned role — Admin, Tutor, or Learner',
  'Admins manage expert registrations and approvals',
  'Tutors and learners access their own dedicated dashboards',
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        return setError(data?.error || data?.details || `Login failed (${res.status})`)
      }
      if (!data.token || !data.user?.role) {
        return setError('Login response missing role information. Restart the backend and try again.')
      }
      setSession(data.token, data.user)
      navigate(dashboardPathForRole(data.user.role), { replace: true })
    } catch (err) {
      setError('Cannot reach the API. Start the backend on port 5000 and use the frontend dev server (port 5173).')
    }
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-panel login-panel-brand">
          <span className="section-tag">Portal Access</span>
          <h1>Login to Voltgrid Insights</h1>
          <p>
            Secure access for admins, tutors, and learners. After sign-in you are
            redirected to the dashboard for your role.
          </p>
          <div className="login-highlight-list">
            {portalHighlights.map((item) => (
              <div key={item} className="login-highlight-card">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="login-panel login-panel-form">
          <span className="section-tag">Sign In</span>
          <h2>Welcome Back</h2>
          <p className="login-copy">Enter your email and password to continue.</p>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="Email"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
            />
            <button type="submit" className="btn btn-primary login-submit">
              Login
            </button>
            {error && <p className="login-error">{error}</p>}
          </form>
        </div>
      </section>
    </main>
  )
}

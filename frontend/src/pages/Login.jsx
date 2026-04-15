import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const adminHighlights = [
  'Access expert registrations and approvals',
  'Review contact enquiries and submission details',
  'Manage training-related admin workflows securely'
]

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if(!res.ok) return setError(data?.error || 'Login failed')
      localStorage.setItem('vg_token', data.token)
      navigate('/admin')
      window.location.reload()
    }catch(err){
      setError('Network error')
    }
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-panel login-panel-brand">
          <span className="section-tag">Admin Access</span>
          <h1>Login to the Voltgrid Admin Portal</h1>
          <p>
            Secure access for reviewing registrations, managing expert approvals,
            and handling training-related administrative activity.
          </p>
          <div className="login-highlight-list">
            {adminHighlights.map((item) => (
              <div key={item} className="login-highlight-card">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="login-panel login-panel-form">
          <span className="section-tag">Sign In</span>
          <h2>Welcome Back</h2>
          <p className="login-copy">
            Enter your admin credentials to continue.
          </p>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              value={email}
              onChange={e=>setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
            />
            <input
              value={password}
              onChange={e=>setPassword(e.target.value)}
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

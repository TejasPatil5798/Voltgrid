import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  dashboardPathForRole,
  getCurrentUser,
  getToken,
  isLoggedIn,
  roleLabel,
  setSession,
} from '../lib/auth'
import { apiUrl } from '../lib/api'

export default function Profile() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const loggedIn = isLoggedIn()
  const user = getCurrentUser()
  const startInEdit = searchParams.get('edit') === '1'

  const [editing, setEditing] = useState(startInEdit)
  const [name, setName] = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loggedIn || !user?.role) {
      navigate('/login', { replace: true })
    }
  }, [loggedIn, user?.role, navigate])

  useEffect(() => {
    setEditing(startInEdit)
  }, [startInEdit])

  useEffect(() => {
    setName(user?.name || '')
  }, [user?.name])

  const initial = useMemo(
    () => (user?.name || user?.email || 'U').charAt(0).toUpperCase(),
    [user?.name, user?.email],
  )

  if (!loggedIn || !user?.role) return null

  async function handleSave(event) {
    event.preventDefault()
    setStatus(null)

    if (newPassword && newPassword !== confirmPassword) {
      setStatus({ type: 'error', text: 'New password and confirmation do not match.' })
      return
    }

    setSaving(true)
    try {
      const body = { name: name.trim() }
      if (newPassword) {
        body.currentPassword = currentPassword
        body.newPassword = newPassword
      }
      const res = await fetch(apiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + getToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus({ type: 'error', text: data.error || 'Could not update profile.' })
        return
      }
      setSession(data.token, data.user)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setEditing(false)
      setStatus({ type: 'success', text: 'Profile updated successfully.' })
      navigate('/profile', { replace: true })
    } catch {
      setStatus({ type: 'error', text: 'Cannot reach the server. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="profile-page">
      <section className="profile-shell">
        <div className="profile-hero">
          <img src="/Favicon.png" alt="" className="profile-hero-logo" width={72} height={72} />
          <div>
            <span className="section-tag">Your account</span>
            <h1>Profile</h1>
            <p>View and update your Voltgrid Insights account details.</p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-head">
            <span className="profile-avatar" aria-hidden="true">
              {initial}
            </span>
            <div>
              <h2>{user.name || 'Account'}</h2>
              <p>{user.email}</p>
              <span className="profile-role-pill">{roleLabel(user.role)}</span>
            </div>
            {!editing && (
              <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            )}
          </div>

          {!editing ? (
            <dl className="profile-details">
              <div>
                <dt>Display name</dt>
                <dd>{user.name || '—'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{roleLabel(user.role)}</dd>
              </div>
            </dl>
          ) : (
            <form className="profile-form" onSubmit={handleSave}>
              <label htmlFor="profile-name">Display name</label>
              <input
                id="profile-name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label htmlFor="profile-email">Email</label>
              <input id="profile-email" className="form-input" value={user.email || ''} disabled />

              <p className="profile-form-note">Change password (optional)</p>

              <label htmlFor="profile-current-password">Current password</label>
              <input
                id="profile-current-password"
                className="form-input"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />

              <label htmlFor="profile-new-password">New password</label>
              <input
                id="profile-new-password"
                className="form-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />

              <label htmlFor="profile-confirm-password">Confirm new password</label>
              <input
                id="profile-confirm-password"
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />

              <div className="profile-form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  className="btn"
                  disabled={saving}
                  onClick={() => {
                    setEditing(false)
                    setName(user.name || '')
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setStatus(null)
                    navigate('/profile', { replace: true })
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {status && (
            <p className={`profile-status profile-status--${status.type}`} role="status">
              {status.text}
            </p>
          )}

          <div className="profile-card-footer">
            <Link to={dashboardPathForRole(user.role)} className="btn btn-primary">
              Back to dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

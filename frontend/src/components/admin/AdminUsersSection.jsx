import React, { useEffect, useMemo, useState } from 'react'
import ModalPortal from '../ModalPortal'
import { createAdminUser, deleteAdminUser, updateAdminUser } from '../../lib/adminApi'

const EMPTY_FORM = { name: '', email: '', password: '', role: 'tutor' }

function roleLabel(role) {
  return role === 'tutor' ? 'Tutor' : 'Learner'
}

export default function AdminUsersSection({ users, loading, error, roleTab, onRoleTabChange, onRefresh }) {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => {
      const haystack = [u.name, u.email, u.role].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [users, search])

  function showNotice(msg) {
    setNotice(msg)
    window.setTimeout(() => setNotice(''), 4000)
  }

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY_FORM, role: roleTab })
    setModalOpen(true)
  }

  function openEdit(user) {
    setEditing(user)
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role === 'learner' ? 'learner' : 'tutor',
    })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  useEffect(() => {
    if (!modalOpen) return undefined
    document.body.style.overflow = 'hidden'
    function onKeyDown(event) {
      if (event.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [modalOpen])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editing) {
        const body = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        }
        if (form.password.trim()) body.password = form.password
        await updateAdminUser(editing.id, body)
        showNotice(`${roleLabel(form.role)} updated.`)
      } else {
        await createAdminUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        })
        showNotice(`${roleLabel(form.role)} account created.`)
      }
      closeModal()
      await onRefresh()
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(user) {
    const confirmed = window.confirm(
      `Remove ${roleLabel(user.role)} "${user.name || user.email}"? This cannot be undone.`,
    )
    if (!confirmed) return
    setSubmitting(true)
    try {
      await deleteAdminUser(user.id)
      showNotice('User removed.')
      await onRefresh()
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="admin-section admin-section--users" aria-labelledby="admin-users-heading">
      <details className="admin-contacts-panel admin-users-panel">
        <summary className="admin-contacts-summary">
          <div className="admin-contacts-summary-text">
            <h2 id="admin-users-heading" className="admin-section-title">
              Tutors &amp; learners
            </h2>
            <p className="admin-section-desc">
              Create portal accounts, update details, and remove access for tutors and learners.
            </p>
          </div>
          <span className="admin-section-count" aria-live="polite">
            {loading ? '…' : users.length}
          </span>
          <span className="admin-contacts-chevron" aria-hidden="true">
            ▾
          </span>
        </summary>

        <div className="admin-contacts-body admin-users-body">
          <div className="admin-users-body-head">
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              + Add {roleTab === 'tutor' ? 'tutor' : 'learner'}
            </button>
          </div>

          {notice && (
            <p className="admin-user-notice" role="status">
              {notice}
            </p>
          )}

          <div className="admin-user-tabs" role="tablist" aria-label="User type">
        <button
          type="button"
          role="tab"
          aria-selected={roleTab === 'tutor'}
          className={`admin-user-tab${roleTab === 'tutor' ? ' admin-user-tab--active' : ''}`}
          onClick={() => onRoleTabChange('tutor')}
        >
          Tutors
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={roleTab === 'learner'}
          className={`admin-user-tab${roleTab === 'learner' ? ' admin-user-tab--active' : ''}`}
          onClick={() => onRoleTabChange('learner')}
        >
          Learners
        </button>
      </div>

      <div className="admin-reg-toolbar admin-user-toolbar">
        <div className="admin-reg-toolbar-search">
          <label className="admin-reg-field-label" htmlFor="admin-user-search">
            Search
          </label>
          <div className="admin-search-wrap">
            <span className="admin-search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              id="admin-user-search"
              className="form-input admin-search"
              type="search"
              placeholder="Name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <span className="admin-section-count" aria-live="polite">
          {loading ? '…' : `${filtered.length} / ${users.length}`}
        </span>
      </div>

      {loading && (
        <div className="admin-loading-banner">
          <span className="admin-loading-spinner" />
          Loading {roleTab === 'tutor' ? 'tutors' : 'learners'}…
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert--error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="admin-empty admin-empty--compact">
          <h3>No {roleTab === 'tutor' ? 'tutors' : 'learners'} yet</h3>
          <p>Add an account so they can sign in to their dashboard.</p>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            Add {roleTab === 'tutor' ? 'tutor' : 'learner'}
          </button>
        </div>
      )}

      {!loading && users.length > 0 && filtered.length === 0 && (
        <div className="admin-empty admin-empty--compact">
          <h3>No matches</h3>
          <p>Try a different search term.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td data-label="Name">{user.name || '—'}</td>
                  <td data-label="Email">
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td data-label="Role">
                    <span className={`admin-user-role admin-user-role--${user.role}`}>
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td data-label="Created">{user.created || '—'}</td>
                  <td data-label="Actions">
                    <div className="admin-user-actions">
                      <button
                        type="button"
                        className="btn admin-btn-muted"
                        onClick={() => openEdit(user)}
                        disabled={submitting}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDelete(user)}
                        disabled={submitting}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </div>
      </details>

      {modalOpen && (
        <ModalPortal>
          <div className="admin-modal-backdrop" role="presentation" onClick={closeModal}>
            <div
              className="admin-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-user-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
            <header className="admin-modal-head">
              <h2 id="admin-user-modal-title">
                {editing ? `Edit ${roleLabel(form.role)}` : `Add ${roleLabel(form.role)}`}
              </h2>
              <button type="button" className="admin-modal-close" onClick={closeModal} aria-label="Close">
                ×
              </button>
            </header>
            <form className="admin-modal-form" onSubmit={handleSubmit}>
              <label className="admin-reg-field-label" htmlFor="admin-user-name">
                Full name
              </label>
              <input
                id="admin-user-name"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Display name"
              />

              <label className="admin-reg-field-label" htmlFor="admin-user-email">
                Email
              </label>
              <input
                id="admin-user-email"
                type="email"
                className="form-input"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />

              {!editing && (
                <>
                  <label className="admin-reg-field-label" htmlFor="admin-user-role">
                    Role
                  </label>
                  <select
                    id="admin-user-role"
                    className="form-input"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  >
                    <option value="tutor">Tutor</option>
                    <option value="learner">Learner</option>
                  </select>
                </>
              )}

              {editing && (
                <>
                  <label className="admin-reg-field-label" htmlFor="admin-user-role-edit">
                    Role
                  </label>
                  <select
                    id="admin-user-role-edit"
                    className="form-input"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  >
                    <option value="tutor">Tutor</option>
                    <option value="learner">Learner</option>
                  </select>
                </>
              )}

              <label className="admin-reg-field-label" htmlFor="admin-user-password">
                {editing ? 'New password (optional)' : 'Password'}
              </label>
              <input
                id="admin-user-password"
                type="password"
                className="form-input"
                required={!editing}
                minLength={6}
                autoComplete={editing ? 'new-password' : 'new-password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder={editing ? 'Leave blank to keep current' : 'Min. 6 characters'}
              />

              <footer className="admin-modal-footer">
                <button type="button" className="btn admin-btn-muted" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : editing ? 'Save changes' : 'Create account'}
                </button>
              </footer>
            </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </section>
  )
}

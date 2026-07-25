import React, { useEffect, useMemo, useState } from 'react'
import ImageLightbox from '../components/ImageLightbox'
import AdminUsersSection from '../components/admin/AdminUsersSection'
import { apiUrl } from '../lib/api'
import { getCurrentUser, getToken } from '../lib/auth'
import { fetchAdminUsers, fetchAdminVisits } from '../lib/adminApi'
import { GOOGLE_FORM_RESPONSES_URL, GOOGLE_FORM_VIEW_URL } from '../lib/googleForm'

function useFetch(url, token, refreshKey) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let aborted = false
    async function load() {
      if (!token) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(apiUrl(url), { headers: { Authorization: 'Bearer ' + token } })
        const d = await res.json().catch(() => null)
        if (!res.ok) {
          const msg = (d && d.error) || res.statusText || 'Request failed'
          if (!aborted) setError(msg)
        } else if (d && d.success) {
          if (!aborted) setData(d.data)
        } else if (Array.isArray(d)) {
          if (!aborted) setData(d)
        } else if (!aborted) {
          setData(d)
        }
      } catch (e) {
        if (!aborted) setError(e.message)
      } finally {
        if (!aborted) setLoading(false)
      }
    }
    load()
    return () => {
      aborted = true
    }
  }, [url, token, refreshKey])

  return { data, loading, error }
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString()
}

const PORTAL_FEATURES = [
  { icon: '◎', text: 'Review new expert submissions and profile details' },
  { icon: '✓', text: 'Approve registrations before they appear publicly' },
  { icon: '◉', text: 'Toggle active status and manage expert visibility' },
  { icon: '👤', text: 'Add, edit, and remove tutor and learner portal accounts' },
]

const STAT_ICONS = {
  total: '▣',
  approved: '✓',
  pending: '◷',
  active: '●',
  contact: '✉',
  visits: '👁',
}

function AdminStatCard({ label, value, tone, delay, hint }) {
  return (
    <div
      className={`admin-stat-card admin-stat-card--${tone}`}
      style={{ '--admin-stat-delay': `${delay}ms` }}
    >
      <span className="admin-stat-icon" aria-hidden="true">
        {STAT_ICONS[tone]}
      </span>
      <div className="admin-stat-body">
        <span className="admin-stat-label">{label}</span>
        <span className="admin-stat-value">{value}</span>
        {hint && <span className="admin-stat-hint">{hint}</span>}
      </div>
    </div>
  )
}

function AdminPortalSection({
  user,
  stats,
  contactCount,
  visitStats = { totalVisits: 0, uniqueVisitors: 0 },
  loading,
  contactsLoading,
  visitsLoading,
}) {
  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0
  const initial = (user?.name || user?.email || 'A').charAt(0).toUpperCase()
  const uniqueVisitors = visitStats?.uniqueVisitors ?? 0
  const totalVisits = visitStats?.totalVisits ?? 0

  return (
    <header className="admin-portal">
      <div className="admin-portal-pattern" aria-hidden="true" />
      <div className="admin-portal-inner">
        <div className="admin-portal-main">
          <div className="admin-portal-head">
            <span className="admin-portal-badge">
              <span className="admin-portal-badge-dot" />
              Admin Portal
            </span>
            <span className="admin-portal-live">{loading ? 'Syncing…' : 'Live dashboard'}</span>
          </div>
          <h1 className="admin-portal-title">Expert registration control center</h1>
          <p className="admin-portal-lead">
            Manage Voltgrid&apos;s expert network—review applications, approve profiles, and keep
            your public directory accurate and up to date.
          </p>
          <ul className="admin-portal-features">
            {PORTAL_FEATURES.map((item) => (
              <li key={item.text} className="admin-portal-feature">
                <span className="admin-portal-feature-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          {user && (
            <div className="admin-portal-session">
              <span className="admin-portal-avatar" aria-hidden="true">
                {initial}
              </span>
              <div className="admin-portal-session-copy">
                <span className="admin-portal-session-label">Signed in as</span>
                <strong className="admin-portal-session-name">{user.name || 'Administrator'}</strong>
                <span className="admin-portal-session-email">{user.email}</span>
              </div>
              <span className="admin-portal-role">Admin</span>
            </div>
          )}
        </div>

        <aside className="admin-portal-aside">
          <div className="admin-portal-rate">
            <div
              className="admin-portal-ring"
              style={{ '--admin-ring-pct': `${approvalRate}%` }}
              role="img"
              aria-label={`${approvalRate}% approved`}
            >
              <span className="admin-portal-ring-value">{approvalRate}%</span>
            </div>
            <div className="admin-portal-rate-copy">
              <strong>Approval rate</strong>
              <span>
                {stats.approved} of {stats.total} experts approved
              </span>
            </div>
          </div>
          <div className="admin-stats-grid">
            <AdminStatCard
              label="Total"
              value={loading ? '—' : stats.total}
              tone="total"
              delay={0}
              hint="All submissions"
            />
            <AdminStatCard
              label="Approved"
              value={loading ? '—' : stats.approved}
              tone="approved"
              delay={80}
              hint="Published-ready"
            />
            <AdminStatCard
              label="Pending"
              value={loading ? '—' : stats.pending}
              tone="pending"
              delay={160}
              hint="Awaiting review"
            />
            <AdminStatCard
              label="Active"
              value={loading ? '—' : stats.active}
              tone="active"
              delay={240}
              hint="Visible on site"
            />
            <AdminStatCard
              label="Contact Us"
              value={contactsLoading ? '—' : contactCount}
              tone="contact"
              delay={320}
              hint="Form submissions"
            />
            <AdminStatCard
              label="People visited"
              value={visitsLoading ? '—' : uniqueVisitors}
              tone="visits"
              delay={400}
              hint={`${totalVisits} total sessions`}
            />
          </div>
        </aside>
      </div>
    </header>
  )
}

function AdminSkeletonGrid() {
  return (
    <div className="admin-reg-grid admin-reg-grid--loading" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="admin-reg-card admin-reg-card--skeleton" style={{ '--admin-card-delay': `${i * 80}ms` }}>
          <div className="admin-reg-skeleton-header">
            <div className="admin-skeleton-photo admin-reg-skeleton-photo" />
            <div className="admin-skeleton-body">
              <div className="admin-skeleton-line admin-skeleton-line--lg" />
              <div className="admin-skeleton-line" />
            </div>
          </div>
          <div className="admin-skeleton-line admin-skeleton-line--short" />
          <div className="admin-skeleton-line" />
        </div>
      ))}
    </div>
  )
}

function StatusPill({ approved, active }) {
  return (
    <div className="admin-status-pills">
      <span className={`admin-pill ${approved ? 'admin-pill--approved' : 'admin-pill--pending'}`}>
        {approved ? 'Approved' : 'Pending'}
      </span>
      <span className={`admin-pill ${active === false ? 'admin-pill--inactive' : 'admin-pill--active'}`}>
        {active === false ? 'Inactive' : 'Active'}
      </span>
    </div>
  )
}

function RegDetail({ label, children }) {
  if (children == null || children === '') return null
  return (
    <div className="admin-reg-detail">
      <span className="admin-reg-detail-label">{label}</span>
      <div className="admin-reg-detail-value">{children}</div>
    </div>
  )
}

function ContactSubmissionCard({ contact: c, index, onDelete, deleting }) {
  const id = c._id || c.id
  const isGoogle = c.source === 'google_form'
  return (
    <article
      className="admin-reg-card admin-contact-card"
      style={{ '--admin-card-delay': `${index * 60}ms` }}
    >
      <header className="admin-reg-card-header">
        <div className="admin-reg-card-title-wrap">
          <h3 className="admin-reg-card-title">{c.name || 'Contact enquiry'}</h3>
          {c.email && <p className="admin-reg-card-subtitle">{c.email}</p>}
        </div>
        <span className={`admin-pill ${isGoogle ? 'admin-pill--active' : 'admin-pill--approved'}`}>
          {isGoogle ? 'Google Form' : 'Website'}
        </span>
      </header>
      {c.subject && <RegDetail label="Subject">{c.subject}</RegDetail>}
      {c.message && <RegDetail label="Message">{c.message}</RegDetail>}
      <footer className="admin-reg-footer admin-contact-footer">
        <time dateTime={c.createdAt}>Submitted {formatDate(c.createdAt)}</time>
        <button
          type="button"
          className="btn btn-danger admin-contact-delete"
          disabled={deleting || !id}
          onClick={() => onDelete?.(id, c.name)}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </footer>
    </article>
  )
}

function ExpertRegistrationCard({ registration: r, index, onPreview, onApprove, onSetActive, onRemove }) {
  const id = r._id || r.id
  const domains = Array.isArray(r.domains) ? r.domains : r.domains ? [r.domains] : []

  return (
    <article
      className="admin-reg-card"
      style={{ '--admin-card-delay': `${Math.min(index, 12) * 55}ms` }}
    >
      <header className="admin-reg-card-header">
        <button
          type="button"
          className="admin-reg-photo-btn"
          onClick={() =>
            onPreview({ src: r.profilePhotoUrl || '/experts/default.jpg', alt: r.name })
          }
          aria-label={`Open photo of ${r.name}`}
        >
          <img
            src={r.profilePhotoUrl || '/experts/default.jpg'}
            alt=""
            className="admin-reg-photo"
          />
        </button>
        <div className="admin-reg-card-intro">
          <h3 className="admin-reg-card-name">{r.name}</h3>
          <p className="admin-reg-card-meta">
            {r.title || 'Expert'}
            {r.yearsExperience ? ` · ${r.yearsExperience} yrs experience` : ''}
          </p>
          <StatusPill approved={r.approved} active={r.active} />
        </div>
      </header>

      <div className="admin-reg-card-actions">
        {r.approved ? (
          <span className="admin-reg-action-badge">Approved</span>
        ) : (
          <button type="button" onClick={() => onApprove(id)} className="btn btn-primary admin-btn-approve">
            Approve
          </button>
        )}
        <button
          type="button"
          onClick={() => onSetActive(id, r.active === false)}
          className={`btn ${r.active === false ? 'btn-primary' : 'admin-btn-muted'}`}
        >
          {r.active === false ? 'Set Active' : 'Set Inactive'}
        </button>
        <button type="button" onClick={() => onRemove(id, r.name)} className="btn btn-danger">
          Remove
        </button>
      </div>

      {domains.length > 0 && (
        <div className="admin-reg-tags" aria-label="Domains">
          {domains.map((d) => (
            <span key={d} className="admin-reg-tag">
              {d}
            </span>
          ))}
        </div>
      )}

      <div className="admin-reg-details-grid">
        <RegDetail label="Specialisation">{r.keySpecialisation}</RegDetail>
        <RegDetail label="Email">
          <a href={`mailto:${r.email}`}>{r.email}</a>
        </RegDetail>
        <RegDetail label="Contact">{r.contactNumber}</RegDetail>
        <RegDetail label="Organization">{r.organization}</RegDetail>
        {r.linkedin && (
          <RegDetail label="LinkedIn">
            <a href={r.linkedin} target="_blank" rel="noreferrer">
              View profile
            </a>
          </RegDetail>
        )}
      </div>

      {r.profileSummary && <p className="admin-reg-summary">{r.profileSummary}</p>}

      {(r.detailedExperience || r.message) && (
        <details className="admin-reg-more">
          <summary>Full profile notes</summary>
          {r.detailedExperience && (
            <div className="admin-reg-more-block">
              <strong>Experience</strong>
              <p>{r.detailedExperience}</p>
            </div>
          )}
          {r.message && (
            <div className="admin-reg-more-block">
              <strong>Message</strong>
              <p>{r.message}</p>
            </div>
          )}
        </details>
      )}

      <div className="admin-reg-consent">
        <span className="admin-consent-chip">
          {r.consentDisplay ? 'Display: Yes' : 'Display: No'}
        </span>
        <span className="admin-consent-chip">
          {r.consentAccurate ? 'Accurate' : 'Not confirmed'}
        </span>
        <span className="admin-consent-chip">
          {r.consentReviewed ? 'Terms reviewed' : 'Terms pending'}
        </span>
      </div>

      <footer className="admin-reg-footer">
        <time dateTime={r.createdAt}>Submitted {formatDate(r.createdAt)}</time>
        {r.approvedAt && <time dateTime={r.approvedAt}>Approved {formatDate(r.approvedAt)}</time>}
      </footer>
    </article>
  )
}

export default function Admin() {
  const token = getToken()
  const user = getCurrentUser()
  const [refresh, setRefresh] = useState(0)
  const [previewImage, setPreviewImage] = useState(null)
  const [search, setSearch] = useState('')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')
  const [userRoleTab, setUserRoleTab] = useState('tutor')
  const [portalUsers, setPortalUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState(null)
  const [visitStats, setVisitStats] = useState({ totalVisits: 0, uniqueVisitors: 0 })
  const [visitsLoading, setVisitsLoading] = useState(false)
  const [deletingContactId, setDeletingContactId] = useState(null)
  const regs = useFetch('/api/admin/registrations', token, refresh)
  const contacts = useFetch('/api/admin/contacts', token, refresh)

  useEffect(() => {
    let aborted = false
    async function loadVisits() {
      if (!token) return
      setVisitsLoading(true)
      try {
        const res = await fetchAdminVisits()
        if (!aborted) {
          setVisitStats({
            totalVisits: res.data?.totalVisits ?? 0,
            uniqueVisitors: res.data?.uniqueVisitors ?? 0,
          })
        }
      } catch {
        if (!aborted) setVisitStats({ totalVisits: 0, uniqueVisitors: 0 })
      } finally {
        if (!aborted) setVisitsLoading(false)
      }
    }
    loadVisits()
    return () => {
      aborted = true
    }
  }, [token, refresh])

  useEffect(() => {
    let aborted = false
    async function loadUsers() {
      if (!token) return
      setUsersLoading(true)
      setUsersError(null)
      try {
        const res = await fetchAdminUsers(userRoleTab)
        if (!aborted) setPortalUsers(res.data || [])
      } catch (e) {
        if (!aborted) setUsersError(e.message)
      } finally {
        if (!aborted) setUsersLoading(false)
      }
    }
    loadUsers()
    return () => {
      aborted = true
    }
  }, [token, userRoleTab, refresh])

  async function refreshPortalUsers() {
    const res = await fetchAdminUsers(userRoleTab)
    setPortalUsers(res.data || [])
  }

  const allRegs = Array.isArray(regs.data) ? regs.data : []
  const allContacts = Array.isArray(contacts.data) ? contacts.data : []
  const contactCount = allContacts.length

  const stats = useMemo(() => {
    const total = allRegs.length
    const approved = allRegs.filter((r) => r.approved).length
    const pending = total - approved
    const active = allRegs.filter((r) => r.active !== false).length
    return { total, approved, pending, active }
  }, [allRegs])

  const filteredRegs = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allRegs.filter((r) => {
      const haystack = [
        r.name,
        r.title,
        r.email,
        r.organization,
        r.keySpecialisation,
        Array.isArray(r.domains) ? r.domains.join(' ') : r.domains,
        r.contactNumber,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const matchesSearch = !q || haystack.includes(q)
      const matchesApproval =
        approvalFilter === 'all' ||
        (approvalFilter === 'approved' && r.approved) ||
        (approvalFilter === 'not-approved' && !r.approved)
      const matchesActive =
        activeFilter === 'all' ||
        (activeFilter === 'active' && r.active !== false) ||
        (activeFilter === 'inactive' && r.active === false)
      return matchesSearch && matchesApproval && matchesActive
    })
  }, [allRegs, search, approvalFilter, activeFilter])

  async function approve(id) {
    if (!token) return alert('Not authenticated')
    try {
      const res = await fetch(apiUrl('/api/admin/registrations/' + id + '/approve'), {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
      })
      let ok = res.ok
      let msg = ''
      try {
        const t = await res.text()
        if (t) {
          const d = JSON.parse(t)
          if (d && d.success) ok = true
          if (d && d.error) msg = d.error
        }
      } catch {
        /* ignore parse */
      }
      if (ok) setRefresh((r) => r + 1)
      else alert('Approve failed: ' + (msg || res.statusText))
    } catch (e) {
      alert('Approve failed: ' + e.message)
    }
  }

  async function setActive(id, active) {
    if (!token) return alert('Not authenticated')
    try {
      const res = await fetch(apiUrl('/api/admin/registrations/' + id + '/active'), {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.success) {
        return alert('Status update failed: ' + (data?.error || res.statusText))
      }
      setRefresh((r) => r + 1)
    } catch (e) {
      alert('Status update failed: ' + e.message)
    }
  }

  async function deleteRegistration(id, name) {
    if (!token) return alert('Not authenticated')
    const confirmed = window.confirm(
      `Remove expert registration for ${name || 'this user'} from the admin panel? The data will stay stored.`,
    )
    if (!confirmed) return
    try {
      const res = await fetch(apiUrl('/api/admin/registrations/' + id), {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.success) {
        return alert('Remove failed: ' + (data?.error || res.statusText))
      }
      setRefresh((r) => r + 1)
    } catch (e) {
      alert('Remove failed: ' + e.message)
    }
  }

  async function deleteContact(id, name) {
    if (!token) return alert('Not authenticated')
    if (!id) return alert('Missing contact id')
    const confirmed = window.confirm(
      `Delete contact submission from ${name || 'this person'}? This cannot be undone.`,
    )
    if (!confirmed) return
    setDeletingContactId(id)
    try {
      const res = await fetch(apiUrl('/api/admin/contacts/' + encodeURIComponent(id)), {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.success) {
        return alert('Delete failed: ' + (data?.error || res.statusText))
      }
      setRefresh((r) => r + 1)
    } catch (e) {
      alert('Delete failed: ' + e.message)
    } finally {
      setDeletingContactId(null)
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-page-glow" aria-hidden="true" />

      <AdminPortalSection
        user={user}
        stats={stats}
        contactCount={contactCount}
        visitStats={visitStats}
        loading={regs.loading}
        contactsLoading={contacts.loading}
        visitsLoading={visitsLoading}
      />

      <AdminUsersSection
        users={portalUsers}
        loading={usersLoading}
        error={usersError}
        roleTab={userRoleTab}
        onRoleTabChange={setUserRoleTab}
        onRefresh={refreshPortalUsers}
      />

      <section className="admin-section admin-section--contacts" aria-labelledby="admin-contact-heading">
        <details className="admin-contacts-panel" open>
          <summary className="admin-contacts-summary">
            <div className="admin-contacts-summary-text">
              <h2 id="admin-contact-heading" className="admin-section-title">
                Contact Us submissions
              </h2>
              <p className="admin-section-desc">
                Total enquiries received through the Contact page form.
              </p>
            </div>
            <span className="admin-section-count" aria-live="polite">
              {contacts.loading ? '…' : contactCount}
            </span>
            <span className="admin-contacts-chevron" aria-hidden="true">
              ▾
            </span>
          </summary>

          <div className="admin-contacts-body">
            <div className="admin-contacts-toolbar">
              <a
                href={GOOGLE_FORM_RESPONSES_URL}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary admin-google-form-btn"
              >
                View Google Form records
              </a>
              <a
                href={GOOGLE_FORM_VIEW_URL}
                target="_blank"
                rel="noreferrer"
                className="btn admin-google-form-btn-secondary"
              >
                Open Google Form
              </a>
            </div>

            {contacts.loading && (
              <div className="admin-loading-banner">
                <span className="admin-loading-spinner" />
                Loading contact submissions…
              </div>
            )}

            {contacts.error && (
              <div className="admin-alert admin-alert--error" role="alert">
                {contacts.error}
              </div>
            )}

            {!contacts.loading && !contacts.error && contactCount === 0 && (
              <div className="admin-empty admin-empty--compact">
                <h3>No contact submissions yet</h3>
                <p>New Contact Us form submissions will appear here when they are received.</p>
              </div>
            )}

            {!contacts.loading && contactCount > 0 && (
              <div className="admin-reg-grid admin-contact-grid">
                {allContacts.map((c, idx) => {
                  const id = c._id || c.id
                  return (
                    <ContactSubmissionCard
                      key={id || c.createdAt || idx}
                      contact={c}
                      index={idx}
                      onDelete={deleteContact}
                      deleting={deletingContactId === id}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </details>
      </section>

      <section className="admin-section admin-section--registrations" aria-labelledby="admin-reg-heading">
        <div className="admin-section-head">
          <div className="admin-section-head-text">
            <h2 id="admin-reg-heading" className="admin-section-title">
              Expert registrations
            </h2>
            <p className="admin-section-desc">
              Search, filter, and take action on submitted expert profiles.
            </p>
          </div>
          <span className="admin-section-count" aria-live="polite">
            {regs.loading ? '…' : `${filteredRegs.length} / ${allRegs.length}`}
          </span>
        </div>

        <div className="admin-reg-toolbar">
          <div className="admin-reg-toolbar-search">
            <label className="admin-reg-field-label" htmlFor="admin-reg-search">
              Search
            </label>
            <div className="admin-search-wrap">
              <span className="admin-search-icon" aria-hidden="true">
                ⌕
              </span>
              <input
                id="admin-reg-search"
                className="form-input admin-search"
                type="search"
                placeholder="Name, email, domain, organization…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="admin-reg-filters">
            <div className="admin-reg-filter-field">
              <label className="admin-reg-field-label" htmlFor="admin-reg-approval">
                Approval
              </label>
              <select
                id="admin-reg-approval"
                className="form-input admin-filter"
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="not-approved">Not approved</option>
              </select>
            </div>
            <div className="admin-reg-filter-field">
              <label className="admin-reg-field-label" htmlFor="admin-reg-active">
                Visibility
              </label>
              <select
                id="admin-reg-active"
                className="form-input admin-filter"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          {(search.trim() || approvalFilter !== 'all' || activeFilter !== 'all') && (
            <button
              type="button"
              className="btn admin-btn-muted admin-reg-clear"
              onClick={() => {
                setSearch('')
                setApprovalFilter('all')
                setActiveFilter('all')
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {regs.loading && (
          <div className="admin-loading-banner">
            <span className="admin-loading-spinner" />
            Loading expert registrations…
          </div>
        )}

        {regs.error && (
          <div className="admin-alert admin-alert--error" role="alert">
            {regs.error}
          </div>
        )}

        {!regs.loading && !regs.error && allRegs.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon" aria-hidden="true">
              ◇
            </div>
            <h3>No registrations yet</h3>
            <p>New expert submissions will appear here when they are received.</p>
          </div>
        )}

        {!regs.loading && allRegs.length > 0 && filteredRegs.length === 0 && (
          <div className="admin-empty admin-empty--compact">
            <h3>No matches</h3>
            <p>Try adjusting your search or filters.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setSearch('')
                setApprovalFilter('all')
                setActiveFilter('all')
              }}
            >
              Reset filters
            </button>
          </div>
        )}

        {regs.loading && <AdminSkeletonGrid />}

        {!regs.loading && filteredRegs.length > 0 && (
          <div className="admin-reg-grid">
            {filteredRegs.map((r, idx) => (
              <ExpertRegistrationCard
                key={r._id || r.id || idx}
                registration={r}
                index={idx}
                onPreview={setPreviewImage}
                onApprove={approve}
                onSetActive={setActive}
                onRemove={deleteRegistration}
              />
            ))}
          </div>
        )}
      </section>

      {previewImage && (
        <ImageLightbox
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </main>
  )
}

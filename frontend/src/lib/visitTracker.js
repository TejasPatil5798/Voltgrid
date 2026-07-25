import { apiUrl } from './api'

const VISITOR_ID_KEY = 'vg_visitor_id'
const SESSION_VISIT_KEY = 'vg_visit_session'

function createVisitorId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Record one site visit per browser session (unique people tracked via localStorage id). */
export function trackSiteVisit() {
  if (typeof window === 'undefined') return

  try {
    if (sessionStorage.getItem(SESSION_VISIT_KEY)) return

    let visitorId = localStorage.getItem(VISITOR_ID_KEY)
    if (!visitorId) {
      visitorId = createVisitorId()
      localStorage.setItem(VISITOR_ID_KEY, visitorId)
    }

    sessionStorage.setItem(SESSION_VISIT_KEY, '1')

    fetch(apiUrl('/api/analytics/visit'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
      keepalive: true,
    }).catch(() => {
      /* analytics must never block the app */
      sessionStorage.removeItem(SESSION_VISIT_KEY)
    })
  } catch {
    /* ignore storage / network errors */
  }
}

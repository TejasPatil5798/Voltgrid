export function learnerKey(learner) {
  const id = learner?.studentId || learner?.id
  return id ? String(id) : ''
}

export function matchesLearnerSearch(learner, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [learner.name, learner.email, learner.course].filter(Boolean).join(' ').toLowerCase()
  return haystack.includes(q)
}

/** One row per learner; merges enrollment rows and batch member records. */
export function buildLearnerPool(learners = [], batchStudents = []) {
  const map = new Map()

  function upsert(entry) {
    const key = learnerKey(entry)
    if (!key) return
    const prev = map.get(key)
    if (!prev) {
      map.set(key, {
        id: key,
        studentId: key,
        name: entry.name || 'Learner',
        email: entry.email || '',
        course: entry.course || '',
      })
      return
    }
    if (entry.name && (!prev.name || prev.name === 'Learner')) prev.name = entry.name
    if (entry.email) prev.email = entry.email
    if (entry.course) {
      const parts = new Set(
        `${prev.course}, ${entry.course}`
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      )
      prev.course = [...parts].join(', ')
    }
  }

  learners.forEach((l) =>
    upsert({
      studentId: l.studentId || l.id,
      name: l.name,
      email: l.email,
      course: l.course,
    }),
  )
  batchStudents.forEach((s) =>
    upsert({
      studentId: s.id,
      name: s.name,
      email: s.email,
      course: s.course,
    }),
  )

  return Array.from(map.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''))
}

export function dedupeLearners(learners) {
  return buildLearnerPool(learners, [])
}

export function resolveBatchMembers(batch, pool) {
  const ids = (batch?.studentIds || []).map(String)
  const poolMap = new Map(pool.map((l) => [l.id, l]))
  const fromStudents = new Map((batch?.students || []).map((s) => [String(s.id), s]))

  return ids.map((sid) => {
    if (poolMap.has(sid)) return poolMap.get(sid)
    if (fromStudents.has(sid)) {
      const s = fromStudents.get(sid)
      return { id: sid, studentId: sid, name: s.name, email: s.email, course: s.course }
    }
    return { id: sid, studentId: sid, name: 'Learner', email: '', course: '' }
  })
}

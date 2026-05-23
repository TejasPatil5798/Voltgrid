import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserPlus } from 'lucide-react'

export default function LearnerSelector({ learners, excludeIds = [], onAdd }) {
  const [query, setQuery] = useState('')

  const pool = useMemo(() => {
    const seen = new Set()
    return learners.filter((l) => {
      const sid = l.studentId || l.id
      if (seen.has(sid) || excludeIds.includes(sid)) return false
      seen.add(sid)
      return true
    })
  }, [learners, excludeIds])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pool
    return pool.filter((l) => {
      const haystack = [l.name, l.email, l.course].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [pool, query])

  return (
    <div className="dash-learner-selector">
      <div className="dash-learner-selector-search">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          className="form-input"
          placeholder="Search learners by name, email, or course…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ul className="dash-learner-selector-list">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <li className="dash-learner-selector-empty">No learners match your search.</li>
          )}
          {filtered.map((learner) => {
            const sid = learner.studentId || learner.id
            return (
              <motion.li
                key={sid}
                className="dash-learner-selector-item"
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
              >
                <div>
                  <strong>{learner.name}</strong>
                  {learner.email && <span>{learner.email}</span>}
                  {learner.course && <span className="dash-learner-selector-course">{learner.course}</span>}
                </div>
                <button
                  type="button"
                  className="btn btn-primary dash-learner-add-btn"
                  onClick={() => onAdd(sid)}
                >
                  <UserPlus size={16} aria-hidden="true" />
                  Add
                </button>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </div>
  )
}

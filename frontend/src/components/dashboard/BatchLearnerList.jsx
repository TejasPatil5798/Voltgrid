import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserMinus } from 'lucide-react'

export default function BatchLearnerList({ students, onRemove, emptyMessage }) {
  if (!students?.length) {
    return <p className="dash-batch-learners-empty">{emptyMessage || 'No learners in this batch yet.'}</p>
  }

  return (
    <ul className="dash-batch-learners-list">
      <AnimatePresence mode="popLayout">
        {students.map((student) => (
          <motion.li
            key={student.id}
            className="dash-batch-learner-item"
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <div>
              <strong>{student.name}</strong>
              {student.email && <span>{student.email}</span>}
            </div>
            {onRemove && (
              <button
                type="button"
                className="btn dash-btn-danger-muted"
                onClick={() => onRemove(student.id)}
              >
                <UserMinus size={16} aria-hidden="true" />
                Remove
              </button>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

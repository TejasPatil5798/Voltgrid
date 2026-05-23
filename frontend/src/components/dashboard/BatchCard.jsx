import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Pencil, Trash2, Users } from 'lucide-react'

export default function BatchCard({ batch, onEdit, onManageLearners, onDelete, isActive }) {
  return (
    <motion.article
      className={`dash-batch-card dash-card-lift${isActive ? ' dash-batch-card--active' : ''}`}
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dash-batch-card-head">
        <div>
          <h3>{batch.name}</h3>
          {batch.subject && (
            <p className="dash-batch-card-subject">
              <BookOpen size={14} aria-hidden="true" />
              {batch.subject}
            </p>
          )}
        </div>
        <span className="dash-batch-card-count">
          <Users size={14} aria-hidden="true" />
          {batch.learnerCount ?? batch.studentIds?.length ?? 0}
        </span>
      </header>
      {batch.description && <p className="dash-batch-card-desc">{batch.description}</p>}
      <footer className="dash-batch-card-foot">
        <span>
          <Calendar size={14} aria-hidden="true" />
          Created {batch.created || '—'}
        </span>
        <div className="dash-batch-card-actions">
          <button type="button" className="btn dash-btn-muted" onClick={() => onManageLearners(batch)}>
            <Users size={16} aria-hidden="true" />
            Learners
          </button>
          <button type="button" className="btn dash-btn-muted" onClick={() => onEdit(batch)}>
            <Pencil size={16} aria-hidden="true" />
            Edit
          </button>
          <button type="button" className="btn dash-btn-danger-muted" onClick={() => onDelete(batch)}>
            <Trash2 size={16} aria-hidden="true" />
            Delete
          </button>
        </div>
      </footer>
    </motion.article>
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ExternalLink, Pencil, Trash2, User } from 'lucide-react'

export default function ScheduleCard({
  item,
  readOnly = false,
  onEdit,
  onDelete,
  onJoin,
}) {
  return (
    <motion.article
      className={`dash-schedule-card dash-card-lift dash-schedule-card--${item.tone || 'upcoming'}`}
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dash-schedule-card-date">
        <strong>{item.dayLabel}</strong>
        <span>{item.date}</span>
      </div>
      <div className="dash-schedule-card-body">
        <span className="dash-schedule-card-time">
          <Clock size={14} aria-hidden="true" />
          {item.time}
        </span>
        <h3>{item.title}</h3>
        {item.subject && <p className="dash-schedule-card-subject">{item.subject}</p>}
        {item.course && <p className="dash-schedule-card-meta">{item.course}</p>}
        {item.batchNames?.length > 0 && (
          <p className="dash-schedule-card-batches">Batches: {item.batchNames.join(', ')}</p>
        )}
        {item.tutor && (
          <p className="dash-schedule-card-tutor">
            <User size={14} aria-hidden="true" />
            {item.tutor}
          </p>
        )}
        {item.description && (
          <p className="dash-schedule-card-desc">{item.description}</p>
        )}
        <div className="dash-schedule-card-actions">
          {item.meetingLink && (
            <a
              href={item.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary dash-schedule-join"
              onClick={onJoin}
            >
              <ExternalLink size={16} aria-hidden="true" />
              {readOnly ? 'Join class' : 'Open meeting'}
            </a>
          )}
          {!readOnly && (
            <>
              <button
                type="button"
                className="btn dash-btn-muted"
                onClick={() => onEdit?.(item)}
              >
                <Pencil size={16} aria-hidden="true" />
                Edit
              </button>
              <button
                type="button"
                className="btn dash-btn-danger-muted"
                onClick={() => onDelete?.(item)}
              >
                <Trash2 size={16} aria-hidden="true" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      <span className="dash-schedule-card-icon" aria-hidden="true">
        <Calendar size={18} />
      </span>
    </motion.article>
  )
}

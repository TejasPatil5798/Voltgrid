import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users } from 'lucide-react'
import { resolveFormStudentIds } from '../../lib/scheduleUtils'
import ModalPortal from '../ModalPortal'

function Field({ label, htmlFor, children, hint }) {
  return (
    <label className="dash-schedule-field" htmlFor={htmlFor}>
      <span className="dash-schedule-field-label">{label}</span>
      {children}
      {hint && <span className="dash-schedule-field-hint">{hint}</span>}
    </label>
  )
}

export default function ScheduleClassModal({
  open,
  title,
  form,
  courses,
  batches,
  learners,
  submitting,
  onClose,
  onChange,
  onSubmit,
  onToggleStudent,
  onToggleBatch,
}) {
  const uniqueLearners = React.useMemo(() => {
    const seen = new Set()
    return learners.filter((l) => {
      const sid = l.studentId || l.id
      if (seen.has(sid)) return false
      seen.add(sid)
      return true
    })
  }, [learners])

  const resolvedCount = resolveFormStudentIds(
    batches || [],
    form.batchIds || [],
    form.studentIds || [],
  ).length

  return (
    <AnimatePresence>
      {open && (
        <ModalPortal>
          <motion.div
            className="dash-schedule-modal-overlay"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="dash-schedule-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="schedule-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="dash-schedule-modal-head">
              <h2 id="schedule-modal-title">{title}</h2>
              <button type="button" className="dash-schedule-modal-close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </header>

            <motion.form
              className="dash-schedule-modal-form"
              onSubmit={onSubmit}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                <Field label="Class title" htmlFor="sched-title">
                  <input
                    id="sched-title"
                    className="form-input"
                    required
                    value={form.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                  />
                </Field>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                <Field label="Course / subject" htmlFor="sched-course">
                  <select
                    id="sched-course"
                    className="form-input"
                    value={form.courseId}
                    onChange={(e) => {
                      const course = courses.find((c) => (c.id || c._id) === e.target.value)
                      onChange({
                        courseId: e.target.value,
                        subject: course?.title || form.subject,
                      })
                    }}
                  >
                    <option value="">Select course</option>
                    {courses.map((c) => (
                      <option key={c.id || c._id} value={c.id || c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </Field>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                <Field label="Subject label" htmlFor="sched-subject">
                  <input
                    id="sched-subject"
                    className="form-input"
                    value={form.subject}
                    onChange={(e) => onChange({ subject: e.target.value })}
                  />
                </Field>
              </motion.div>

              <motion.div className="dash-schedule-row" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                <Field label="Date" htmlFor="sched-date">
                  <input
                    id="sched-date"
                    type="date"
                    className="form-input"
                    required
                    value={form.date}
                    onChange={(e) => onChange({ date: e.target.value })}
                  />
                </Field>
                <Field label="Start time" htmlFor="sched-start">
                  <input
                    id="sched-start"
                    type="time"
                    className="form-input"
                    required
                    value={form.startTime}
                    onChange={(e) => onChange({ startTime: e.target.value })}
                  />
                </Field>
                <Field label="End time" htmlFor="sched-end">
                  <input
                    id="sched-end"
                    type="time"
                    className="form-input"
                    required
                    value={form.endTime}
                    onChange={(e) => onChange({ endTime: e.target.value })}
                  />
                </Field>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                <Field label="Description" htmlFor="sched-desc">
                  <textarea
                    id="sched-desc"
                    className="form-input"
                    rows={3}
                    value={form.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                  />
                </Field>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                <Field label="Meeting link" htmlFor="sched-link">
                  <input
                    id="sched-link"
                    type="url"
                    className="form-input"
                    placeholder="https://meet.example.com/..."
                    value={form.meetingLink}
                    onChange={(e) => onChange({ meetingLink: e.target.value })}
                  />
                </Field>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                <span className="dash-schedule-field-label">Select batches</span>
                <div className="dash-schedule-learners">
                  {(batches || []).length === 0 && (
                    <p className="dash-schedule-field-hint">Create batches first to schedule by cohort.</p>
                  )}
                  {(batches || []).map((batch) => {
                    const checked = (form.batchIds || []).includes(batch.id)
                    return (
                      <label key={batch.id} className="dash-schedule-learner-chip dash-schedule-batch-chip">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleBatch(batch.id)}
                        />
                        <span>
                          <strong>{batch.name}</strong>
                          {batch.subject ? ` · ${batch.subject}` : ''}
                          <em> ({batch.learnerCount ?? batch.studentIds?.length ?? 0} learners)</em>
                        </span>
                      </label>
                    )
                  })}
                </div>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                <span className="dash-schedule-field-label">
                  Additional learners (optional)
                  {resolvedCount > 0 && (
                    <span className="dash-schedule-resolved-count">
                      <Users size={14} aria-hidden="true" />
                      {resolvedCount} total assigned
                    </span>
                  )}
                </span>
                <div className="dash-schedule-learners">
                  {uniqueLearners.length === 0 && (
                    <p className="dash-schedule-field-hint">No enrolled learners yet.</p>
                  )}
                  {uniqueLearners.map((learner) => {
                    const sid = learner.studentId || learner.id
                    const checked = form.studentIds.includes(sid)
                    return (
                      <label key={sid} className="dash-schedule-learner-chip">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleStudent(sid)}
                        />
                        <span>
                          {learner.name}
                          {learner.course ? ` · ${learner.course}` : ''}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </motion.div>

              <footer className="dash-schedule-modal-footer">
                <button type="button" className="btn dash-btn-muted" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save schedule'}
                </button>
              </footer>
            </motion.form>
            </motion.div>
          </motion.div>
        </ModalPortal>
      )}
    </AnimatePresence>
  )
}

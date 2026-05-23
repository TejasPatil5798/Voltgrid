import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedProgressBar from '../components/AnimatedProgressBar'
import DashboardShell, { DashSection } from '../components/DashboardShell'
import DashEmptyState from '../components/dashboard/DashEmptyState'
import {
  DashCardSkeleton,
  DashListSkeleton,
  DashStatSkeleton,
  DashTableSkeleton,
} from '../components/dashboard/DashSkeleton'
import TutorModal, { FormField } from '../components/tutor/TutorModal'
import NotificationBell from '../components/dashboard/NotificationBell'
import CalendarView from '../components/dashboard/CalendarView'
import ScheduleCard from '../components/dashboard/ScheduleCard'
import ScheduleClassModal from '../components/dashboard/ScheduleClassModal'
import BatchTab from '../components/dashboard/BatchTab'
import MessagesPage from '../components/messages/MessagesPage'
import MessageNotificationBadge from '../components/messages/MessageNotificationBadge'
import { staggerContainer, staggerItem } from '../lib/motion'
import { getCurrentUser, roleLabel, setSession, getToken } from '../lib/auth'
import {
  EMPTY_SCHEDULE_CLASS_FORM,
  scheduleToForm,
  toDateInputValue,
} from '../lib/scheduleUtils'
import {
  createAssignment,
  createCourse,
  createQuiz,
  createScheduleItem,
  deleteScheduleItem,
  fetchCourseContent,
  fetchMessages,
  fetchSchedule,
  fetchLearners,
  fetchLearnerPool,
  fetchBatches,
  fetchTutorDashboard,
  fetchTutorNotifications,
  fetchTutorProfile,
  markAllTutorNotificationsRead,
  updateCourse,
  updateScheduleItem,
  updateTutorProfile,
  uploadLesson,
  uploadNote,
} from '../lib/tutorApi'

const QUICK_ACTIONS = [
  { id: 'course', label: 'Create course', icon: 'fa-plus-circle' },
  { id: 'lesson', label: 'Upload lesson', icon: 'fa-video' },
  { id: 'notes', label: 'Upload notes', icon: 'fa-file-lines' },
  { id: 'assignment', label: 'Create assignment', icon: 'fa-clipboard-list' },
  { id: 'quiz', label: 'Create quiz', icon: 'fa-list-check' },
]

const EMPTY_COURSE_FORM = { title: '', batch: '', description: '', status: 'Draft' }
const EMPTY_LESSON_FORM = { courseId: '', title: '', videoUrl: '', description: '' }
const EMPTY_NOTE_FORM = { courseId: '', title: '', fileUrl: '', content: '' }
const EMPTY_ASSIGNMENT_FORM = { courseId: '', title: '', description: '', dueDate: '' }
const EMPTY_QUIZ_FORM = { courseId: '', title: '', maxScore: '100', question: '', options: '' }
const EMPTY_PROFILE_FORM = { name: '', expertise: '', timezone: '', weeklyHours: '', officeHours: '', nextOpenSlot: '' }

function TutorStatCard({ label, value, hint, icon, tone, delay }) {
  return (
    <div
      className={`tutor-stat-card tutor-stat-card--${tone} dash-card-lift`}
      style={{ '--tutor-stat-delay': `${delay}ms` }}
    >
      <span className="tutor-stat-icon" aria-hidden="true">
        <i className={`fas ${icon}`} />
      </span>
      <div className="tutor-stat-body">
        <span className="tutor-stat-label">{label}</span>
        <span className="tutor-stat-value">{value}</span>
        {hint && <span className="tutor-stat-hint">{hint}</span>}
      </div>
    </div>
  )
}

function CourseStatusPill({ status }) {
  const tone = status === 'Live' ? 'live' : status === 'Draft' ? 'draft' : 'scheduled'
  return <span className={`tutor-pill tutor-pill--${tone}`}>{status}</span>
}

function ProgressStatusPill({ status }) {
  const tone = status === 'On track' ? 'track' : status === 'Needs review' ? 'review' : 'risk'
  return <span className={`tutor-pill tutor-pill--${tone}`}>{status}</span>
}

export default function Tutor() {
  const user = getCurrentUser()
  const initial = (user?.name || user?.email || 'T').charAt(0).toUpperCase()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionNotice, setActionNotice] = useState('')
  const [stats, setStats] = useState(null)
  const [courses, setCourses] = useState([])
  const [schedule, setSchedule] = useState([])
  const [messages, setMessages] = useState([])
  const [learners, setLearners] = useState([])
  const [learnerPool, setLearnerPool] = useState([])
  const [batches, setBatches] = useState([])
  const [profile, setProfile] = useState(null)
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [courseContent, setCourseContent] = useState(null)
  const [modal, setModal] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [courseForm, setCourseForm] = useState(EMPTY_COURSE_FORM)
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON_FORM)
  const [noteForm, setNoteForm] = useState(EMPTY_NOTE_FORM)
  const [assignmentForm, setAssignmentForm] = useState(EMPTY_ASSIGNMENT_FORM)
  const [quizForm, setQuizForm] = useState(EMPTY_QUIZ_FORM)
  const [scheduleClassForm, setScheduleClassForm] = useState(EMPTY_SCHEDULE_CLASS_FORM)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [selectedCalDate, setSelectedCalDate] = useState(() => toDateInputValue(new Date()))
  const [notifications, setNotifications] = useState([])
  const [notifUnread, setNotifUnread] = useState(0)
  const [notifLoading, setNotifLoading] = useState(false)
  const [profileForm, setProfileForm] = useState(EMPTY_PROFILE_FORM)

  const selectedCourse = useMemo(
    () => courses.find((c) => (c.id || c._id) === selectedCourseId) || courses[0],
    [courses, selectedCourseId],
  )

  const unreadCount = messages.reduce(
    (n, m) => n + (m.unreadCount || (m.unread ? 1 : 0)),
    0,
  )

  const showNotice = useCallback((message) => {
    setActionNotice(message)
    window.setTimeout(() => setActionNotice(''), 4200)
  }, [])

  const loadDashboard = useCallback(async () => {
    if (!getToken()) {
      setError('Please sign in again.')
      setLoading(false)
      return
    }
    setError('')
    try {
      const [dashRes, scheduleRes, messagesRes, learnersRes, poolRes, batchesRes, profileRes, notifRes] =
        await Promise.all([
          fetchTutorDashboard(),
          fetchSchedule(),
          fetchMessages(),
          fetchLearners(),
          fetchLearnerPool().catch(() => ({ data: [] })),
          fetchBatches().catch(() => ({ data: [] })),
          fetchTutorProfile(),
          fetchTutorNotifications().catch(() => ({ data: [], unreadCount: 0 })),
        ])
      setStats(dashRes.data.stats)
      setCourses(dashRes.data.courses || [])
      setSchedule(scheduleRes.data || [])
      setMessages(messagesRes.data || [])
      setLearners(learnersRes.data || [])
      setLearnerPool(poolRes.data || [])
      setBatches(batchesRes.data || [])
      setProfile(profileRes.data)
      setNotifications(notifRes.data || [])
      setNotifUnread(notifRes.unreadCount ?? 0)
      setSelectedCourseId((prev) => {
        if (prev && dashRes.data.courses.some((c) => (c.id || c._id) === prev)) return prev
        return dashRes.data.courses[0]?.id || dashRes.data.courses[0]?._id || null
      })
    } catch (err) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    if (selectedCourseId) {
      setLessonForm((f) => ({ ...f, courseId: selectedCourseId }))
      setNoteForm((f) => ({ ...f, courseId: selectedCourseId }))
      setAssignmentForm((f) => ({ ...f, courseId: selectedCourseId }))
      setQuizForm((f) => ({ ...f, courseId: selectedCourseId }))
    }
  }, [selectedCourseId])

  function openQuickAction(actionId) {
    const courseId = selectedCourseId || courses[0]?.id || courses[0]?._id || ''
    if (actionId === 'course') {
      setCourseForm(EMPTY_COURSE_FORM)
      setModal('course')
      return
    }
    if (!courseId && actionId !== 'course') {
      showNotice('Create a course first, then add content to it.')
      return
    }
    if (actionId === 'lesson') {
      setLessonForm({ ...EMPTY_LESSON_FORM, courseId })
      setModal('lesson')
    } else if (actionId === 'notes') {
      setNoteForm({ ...EMPTY_NOTE_FORM, courseId })
      setModal('notes')
    } else if (actionId === 'assignment') {
      setAssignmentForm({ ...EMPTY_ASSIGNMENT_FORM, courseId })
      setModal('assignment')
    } else if (actionId === 'quiz') {
      setQuizForm({ ...EMPTY_QUIZ_FORM, courseId })
      setModal('quiz')
    }
  }

  async function handleCreateCourse(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await createCourse(courseForm)
      showNotice('Course created successfully.')
      setModal(null)
      await loadDashboard()
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEditCourse(event) {
    event.preventDefault()
    if (!selectedCourse) return
    setSubmitting(true)
    try {
      await updateCourse(selectedCourse.id || selectedCourse._id, courseForm)
      showNotice('Course outline updated.')
      setModal(null)
      await loadDashboard()
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUploadLesson(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await uploadLesson(lessonForm)
      showNotice('Lesson uploaded successfully.')
      setModal(null)
      await loadDashboard()
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUploadNote(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await uploadNote(noteForm)
      showNotice('Notes uploaded successfully.')
      setModal(null)
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreateAssignment(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await createAssignment(assignmentForm)
      showNotice('Assignment created successfully.')
      setModal(null)
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreateQuiz(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      const options = quizForm.options.split('\n').map((o) => o.trim()).filter(Boolean)
      await createQuiz({
        courseId: quizForm.courseId,
        title: quizForm.title,
        maxScore: Number(quizForm.maxScore) || 100,
        questions: quizForm.question
          ? [{ question: quizForm.question, options, correctIndex: 0 }]
          : [],
      })
      showNotice('Quiz created successfully.')
      setModal(null)
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function refreshScheduleAndNotifications() {
    const [scheduleRes, notifRes, batchesRes] = await Promise.all([
      fetchSchedule(),
      fetchTutorNotifications().catch(() => ({ data: [], unreadCount: 0 })),
      fetchBatches().catch(() => ({ data: [] })),
    ])
    setSchedule(scheduleRes.data || [])
    setNotifications(notifRes.data || [])
    setNotifUnread(notifRes.unreadCount ?? 0)
    setBatches(batchesRes.data || [])
  }

  async function refreshBatches() {
    const [batchesRes, poolRes] = await Promise.all([
      fetchBatches(),
      fetchLearnerPool().catch(() => ({ data: [] })),
    ])
    setBatches(batchesRes.data || [])
    setLearnerPool(poolRes.data || [])
  }

  function openNewSchedule() {
    setScheduleClassForm({
      ...EMPTY_SCHEDULE_CLASS_FORM,
      courseId: selectedCourseId || courses[0]?.id || courses[0]?._id || '',
      date: toDateInputValue(new Date()),
    })
    setScheduleModalOpen(true)
  }

  function openEditSchedule(item) {
    setScheduleClassForm(scheduleToForm(item))
    setScheduleModalOpen(true)
  }

  async function handleSaveSchedule(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      const payload = { ...scheduleClassForm }
      if (scheduleClassForm.id) {
        await updateScheduleItem(scheduleClassForm.id, payload)
        showNotice('Class schedule updated.')
      } else {
        await createScheduleItem(payload)
        showNotice('Class scheduled. Learners have been notified.')
      }
      setScheduleModalOpen(false)
      await refreshScheduleAndNotifications()
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCancelSchedule(item) {
    const confirmed = window.confirm(`Cancel "${item.title}"? Assigned learners will be notified.`)
    if (!confirmed) return
    setSubmitting(true)
    try {
      await deleteScheduleItem(item.id)
      showNotice('Class cancelled.')
      await refreshScheduleAndNotifications()
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleMarkAllNotificationsRead() {
    setNotifLoading(true)
    try {
      await markAllTutorNotificationsRead()
      setNotifications((list) => list.map((n) => ({ ...n, read: true })))
      setNotifUnread(0)
    } catch (err) {
      showNotice(err.message)
    } finally {
      setNotifLoading(false)
    }
  }

  function toggleScheduleStudent(studentId) {
    setScheduleClassForm((f) => {
      const has = f.studentIds.includes(studentId)
      return {
        ...f,
        studentIds: has
          ? f.studentIds.filter((id) => id !== studentId)
          : [...f.studentIds, studentId],
      }
    })
  }

  function toggleScheduleBatch(batchId) {
    setScheduleClassForm((f) => {
      const has = (f.batchIds || []).includes(batchId)
      return {
        ...f,
        batchIds: has
          ? f.batchIds.filter((id) => id !== batchId)
          : [...(f.batchIds || []), batchId],
      }
    })
  }

  async function handleOpenCourse() {
    if (!selectedCourse) return
    setSubmitting(true)
    try {
      const res = await fetchCourseContent(selectedCourse.id || selectedCourse._id)
      setCourseContent(res.data)
      setModal('courseDetail')
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleEditOutline() {
    if (!selectedCourse) return
    setCourseForm({
      title: selectedCourse.title || '',
      batch: selectedCourse.batch || '',
      description: selectedCourse.description || '',
      status: selectedCourse.status || 'Draft',
    })
    setModal('editCourse')
  }

  function openProfileEdit() {
    setProfileForm({
      name: profile?.name || user?.name || '',
      expertise: (profile?.expertise || []).join(', '),
      timezone: profile?.timezone || '',
      weeklyHours: (profile?.weeklyHours || []).join('\n'),
      officeHours: profile?.officeHours || '',
      nextOpenSlot: profile?.nextOpenSlot || '',
    })
    setModal('profile')
  }

  async function handleSaveProfile(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      const res = await updateTutorProfile(profileForm)
      setProfile(res.data)
      if (res.data.name && user) {
        setSession(getToken(), { ...user, name: res.data.name })
      }
      showNotice('Profile and availability updated.')
      setModal(null)
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const overviewStats = [
    {
      key: 'classes',
      label: "Today's Classes",
      value: loading ? '—' : String(stats?.todaysClasses ?? 0),
      hint: stats?.nextClassHint || '',
      icon: 'fa-chalkboard-user',
      tone: 'classes',
    },
    {
      key: 'learners',
      label: 'Total Learners',
      value: loading ? '—' : String(stats?.totalLearners ?? 0),
      hint: `Across ${courses.length} course${courses.length === 1 ? '' : 's'}`,
      icon: 'fa-user-graduate',
      tone: 'learners',
    },
    {
      key: 'doubts',
      label: 'Pending Doubts',
      value: loading ? '—' : String(stats?.pendingDoubts ?? 0),
      hint: unreadCount ? `${unreadCount} unread thread${unreadCount === 1 ? '' : 's'}` : 'All caught up',
      icon: 'fa-circle-question',
      tone: 'doubts',
    },
  ]

  const portal = (
    <header className="tutor-portal">
      <div className="tutor-portal-pattern" aria-hidden="true" />
      <div className="tutor-portal-inner">
        <div className="tutor-portal-main">
          <div className="tutor-portal-head">
            <span className="tutor-portal-badge">
              <span className="tutor-portal-badge-dot" />
              Tutor Portal
            </span>
            <div className="dash-portal-head-actions">
              <span className="tutor-portal-live">{loading ? 'Loading…' : 'Live dashboard'}</span>
              <MessageNotificationBadge />
              <NotificationBell
                notifications={notifications}
                unreadCount={notifUnread}
                onMarkAllRead={handleMarkAllNotificationsRead}
                loading={notifLoading}
              />
            </div>
          </div>
          <h1 className="tutor-portal-title">Teaching &amp; learner management</h1>
          <p className="tutor-portal-lead">
            Manage courses, sessions, assignments, and learner progress from one workspace.
          </p>
          {user && (
            <div className="tutor-portal-session">
              <span className="tutor-portal-avatar" aria-hidden="true">{initial}</span>
              <div className="tutor-portal-session-copy">
                <span className="tutor-portal-session-label">Signed in as</span>
                <strong className="tutor-portal-session-name">{profile?.name || user.name || 'Tutor'}</strong>
                <span className="tutor-portal-session-email">{user.email}</span>
              </div>
              <span className="tutor-portal-role">{roleLabel(user.role)}</span>
            </div>
          )}
        </div>
        {loading ? (
          <DashStatSkeleton count={3} className="tutor-stats-grid" />
        ) : (
          <div className="tutor-stats-grid" aria-label="Overview">
            {overviewStats.map((stat, index) => (
              <TutorStatCard key={stat.key} {...stat} delay={index * 70} />
            ))}
          </div>
        )}
      </div>
    </header>
  )

  const courseSelect = (
    <select
      className="form-input"
      value={lessonForm.courseId}
      onChange={(e) => {
        const id = e.target.value
        setLessonForm((f) => ({ ...f, courseId: id }))
        setNoteForm((f) => ({ ...f, courseId: id }))
        setAssignmentForm((f) => ({ ...f, courseId: id }))
        setQuizForm((f) => ({ ...f, courseId: id }))
      }}
    >
      <option value="">Select course</option>
      {courses.map((c) => (
        <option key={c.id || c._id} value={c.id || c._id}>{c.title}</option>
      ))}
    </select>
  )

  const modals = (
    <>
      <TutorModal
        open={modal === 'course'}
        title="Create course"
        onClose={() => setModal(null)}
        footer={
          <button type="submit" form="tutor-course-form" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create course'}
          </button>
        }
      >
        <form id="tutor-course-form" onSubmit={handleCreateCourse}>
          <FormField label="Title" htmlFor="course-title">
            <input id="course-title" className="form-input" required value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
          </FormField>
          <FormField label="Batch" htmlFor="course-batch">
            <input id="course-batch" className="form-input" value={courseForm.batch} onChange={(e) => setCourseForm({ ...courseForm, batch: e.target.value })} />
          </FormField>
          <FormField label="Status" htmlFor="course-status">
            <select id="course-status" className="form-input" value={courseForm.status} onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}>
              <option value="Draft">Draft</option>
              <option value="Live">Live</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </FormField>
          <FormField label="Description" htmlFor="course-desc">
            <textarea id="course-desc" className="form-input" rows={3} value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} />
          </FormField>
        </form>
      </TutorModal>

      <TutorModal open={modal === 'editCourse'} title="Edit course outline" onClose={() => setModal(null)} footer={<button type="submit" form="tutor-edit-course-form" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save changes'}</button>}>
        <form id="tutor-edit-course-form" onSubmit={handleEditCourse}>
          <FormField label="Title" htmlFor="edit-course-title"><input id="edit-course-title" className="form-input" required value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} /></FormField>
          <FormField label="Batch" htmlFor="edit-course-batch"><input id="edit-course-batch" className="form-input" value={courseForm.batch} onChange={(e) => setCourseForm({ ...courseForm, batch: e.target.value })} /></FormField>
          <FormField label="Status" htmlFor="edit-course-status"><select id="edit-course-status" className="form-input" value={courseForm.status} onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}><option value="Draft">Draft</option><option value="Live">Live</option><option value="Scheduled">Scheduled</option></select></FormField>
          <FormField label="Description" htmlFor="edit-course-desc"><textarea id="edit-course-desc" className="form-input" rows={3} value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} /></FormField>
        </form>
      </TutorModal>

      <TutorModal open={modal === 'lesson'} title="Upload lesson" onClose={() => setModal(null)} footer={<button type="submit" form="tutor-lesson-form" className="btn btn-primary" disabled={submitting}>{submitting ? 'Uploading…' : 'Upload lesson'}</button>}>
        <form id="tutor-lesson-form" onSubmit={handleUploadLesson}>
          <FormField label="Course">{courseSelect}</FormField>
          <FormField label="Lesson title" htmlFor="lesson-title"><input id="lesson-title" className="form-input" required value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} /></FormField>
          <FormField label="Video URL" htmlFor="lesson-video" hint="Paste a link to your video (YouTube, Vimeo, etc.)"><input id="lesson-video" className="form-input" type="url" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} /></FormField>
          <FormField label="Description" htmlFor="lesson-desc"><textarea id="lesson-desc" className="form-input" rows={3} value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} /></FormField>
        </form>
      </TutorModal>

      <TutorModal open={modal === 'notes'} title="Upload notes" onClose={() => setModal(null)} footer={<button type="submit" form="tutor-note-form" className="btn btn-primary" disabled={submitting}>{submitting ? 'Uploading…' : 'Upload notes'}</button>}>
        <form id="tutor-note-form" onSubmit={handleUploadNote}>
          <FormField label="Course">{courseSelect}</FormField>
          <FormField label="Notes title" htmlFor="note-title"><input id="note-title" className="form-input" required value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} /></FormField>
          <FormField label="Document URL" htmlFor="note-file"><input id="note-file" className="form-input" type="url" value={noteForm.fileUrl} onChange={(e) => setNoteForm({ ...noteForm, fileUrl: e.target.value })} /></FormField>
          <FormField label="Content" htmlFor="note-content"><textarea id="note-content" className="form-input" rows={4} value={noteForm.content} onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })} /></FormField>
        </form>
      </TutorModal>

      <TutorModal open={modal === 'assignment'} title="Create assignment" onClose={() => setModal(null)} footer={<button type="submit" form="tutor-assignment-form" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create assignment'}</button>}>
        <form id="tutor-assignment-form" onSubmit={handleCreateAssignment}>
          <FormField label="Course">{courseSelect}</FormField>
          <FormField label="Assignment title" htmlFor="assign-title"><input id="assign-title" className="form-input" required value={assignmentForm.title} onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })} /></FormField>
          <FormField label="Due date" htmlFor="assign-due"><input id="assign-due" className="form-input" type="datetime-local" required value={assignmentForm.dueDate} onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })} /></FormField>
          <FormField label="Instructions" htmlFor="assign-desc"><textarea id="assign-desc" className="form-input" rows={3} value={assignmentForm.description} onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })} /></FormField>
        </form>
      </TutorModal>

      <TutorModal open={modal === 'quiz'} title="Create quiz" onClose={() => setModal(null)} footer={<button type="submit" form="tutor-quiz-form" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create quiz'}</button>}>
        <form id="tutor-quiz-form" onSubmit={handleCreateQuiz}>
          <FormField label="Course">{courseSelect}</FormField>
          <FormField label="Quiz title" htmlFor="quiz-title"><input id="quiz-title" className="form-input" required value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} /></FormField>
          <FormField label="Max score" htmlFor="quiz-score"><input id="quiz-score" className="form-input" type="number" min="1" value={quizForm.maxScore} onChange={(e) => setQuizForm({ ...quizForm, maxScore: e.target.value })} /></FormField>
          <FormField label="Sample question" htmlFor="quiz-q"><input id="quiz-q" className="form-input" value={quizForm.question} onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })} /></FormField>
          <FormField label="Options (one per line)" htmlFor="quiz-opts"><textarea id="quiz-opts" className="form-input" rows={3} value={quizForm.options} onChange={(e) => setQuizForm({ ...quizForm, options: e.target.value })} placeholder="Option A&#10;Option B&#10;Option C" /></FormField>
        </form>
      </TutorModal>

      <TutorModal open={modal === 'courseDetail'} title={courseContent?.course?.title || 'Course content'} onClose={() => setModal(null)}>
        {courseContent && (
          <div className="tutor-course-content">
            <p>{courseContent.course.description || 'No description yet.'}</p>
            <h3>Lessons ({courseContent.lessons?.length || 0})</h3>
            <ul className="tutor-content-list">{courseContent.lessons?.map((l) => <li key={l._id}>{l.title}{l.videoUrl ? ` · ${l.videoUrl}` : ''}</li>)}</ul>
            <h3>Notes ({courseContent.notes?.length || 0})</h3>
            <ul className="tutor-content-list">{courseContent.notes?.map((n) => <li key={n._id}>{n.title}</li>)}</ul>
            <h3>Assignments ({courseContent.assignments?.length || 0})</h3>
            <ul className="tutor-content-list">{courseContent.assignments?.map((a) => <li key={a._id}>{a.title} · due {new Date(a.dueDate).toLocaleDateString()}</li>)}</ul>
            <h3>Quizzes ({courseContent.quizzes?.length || 0})</h3>
            <ul className="tutor-content-list">{courseContent.quizzes?.map((q) => <li key={q._id}>{q.title} · {q.maxScore} pts</li>)}</ul>
          </div>
        )}
      </TutorModal>

      <TutorModal open={modal === 'profile'} title="Edit profile & availability" onClose={() => setModal(null)} footer={<button type="submit" form="tutor-profile-form" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save profile'}</button>}>
        <form id="tutor-profile-form" onSubmit={handleSaveProfile}>
          <FormField label="Display name" htmlFor="prof-name"><input id="prof-name" className="form-input" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} /></FormField>
          <FormField label="Expertise (comma-separated)" htmlFor="prof-exp"><input id="prof-exp" className="form-input" value={profileForm.expertise} onChange={(e) => setProfileForm({ ...profileForm, expertise: e.target.value })} /></FormField>
          <FormField label="Timezone" htmlFor="prof-tz"><input id="prof-tz" className="form-input" value={profileForm.timezone} onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })} /></FormField>
          <FormField label="Weekly hours (one per line)" htmlFor="prof-weekly"><textarea id="prof-weekly" className="form-input" rows={2} value={profileForm.weeklyHours} onChange={(e) => setProfileForm({ ...profileForm, weeklyHours: e.target.value })} /></FormField>
          <FormField label="Office hours" htmlFor="prof-office"><input id="prof-office" className="form-input" value={profileForm.officeHours} onChange={(e) => setProfileForm({ ...profileForm, officeHours: e.target.value })} /></FormField>
          <FormField label="Next open slot" htmlFor="prof-next"><input id="prof-next" className="form-input" value={profileForm.nextOpenSlot} onChange={(e) => setProfileForm({ ...profileForm, nextOpenSlot: e.target.value })} /></FormField>
        </form>
      </TutorModal>
    </>
  )

  const overviewTab = (
    <DashSection className="tutor-section tutor-section--actions" aria-label="Quick actions" delay={0}>
      <div className="tutor-section-head">
        <div className="tutor-section-head-text">
          <h2 className="tutor-section-title">Quick actions</h2>
          <p className="tutor-section-desc">Create content and assessments for your active batches.</p>
        </div>
      </div>
      {error && <div className="tutor-alert tutor-alert--error" role="alert">{error} <button type="button" className="btn tutor-btn-muted" onClick={loadDashboard}>Retry</button></div>}
      <motion.div
        className="tutor-action-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {QUICK_ACTIONS.map((action) => (
          <motion.button
            key={action.id}
            type="button"
            className="tutor-action-btn dash-card-lift"
            variants={staggerItem}
            onClick={() => openQuickAction(action.id)}
          >
            <span className="tutor-action-btn-icon" aria-hidden="true"><i className={`fas ${action.icon}`} /></span>
            <span>{action.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </DashSection>
  )

  const coursesTab = (
    <DashSection className="tutor-section tutor-section--courses" aria-labelledby="tutor-courses-heading" delay={0}>
      <div className="tutor-section-head">
        <div className="tutor-section-head-text">
          <h2 id="tutor-courses-heading" className="tutor-section-title">Manage courses</h2>
          <p className="tutor-section-desc">View batches, module counts, and enrollment at a glance.</p>
        </div>
        <div className="tutor-section-actions">
          <span className="tutor-section-count">{courses.length} courses</span>
          <button type="button" className="btn btn-primary" onClick={() => { setCourseForm(EMPTY_COURSE_FORM); setModal('course') }}>+ New course</button>
        </div>
      </div>
      {loading ? (
        <DashCardSkeleton count={2} className="tutor-course-layout" />
      ) : courses.length === 0 ? (
        <DashEmptyState
          icon="fa-book-open"
          title="No courses yet"
          message="Create your first course to start adding lessons, assignments, and learner batches."
          action={
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setCourseForm(EMPTY_COURSE_FORM)
                setModal('course')
              }}
            >
              Create course
            </button>
          }
        />
      ) : (
        <div className="tutor-course-layout">
          <div className="tutor-course-list" role="list">
            {courses.map((course) => {
              const id = course.id || course._id
              return (
                <button key={id} type="button" role="listitem" className={`tutor-course-card dash-card-lift${selectedCourse && (selectedCourse.id || selectedCourse._id) === id ? ' tutor-course-card--active' : ''}`} onClick={() => setSelectedCourseId(id)}>
                  <div className="tutor-course-card-top"><h3>{course.title}</h3><CourseStatusPill status={course.status} /></div>
                  <p className="tutor-course-card-batch">{course.batch}</p>
                  <div className="tutor-course-card-meta">
                    <span><i className="fas fa-user-graduate" aria-hidden="true" /> {course.students} learners</span>
                    <span><i className="fas fa-layer-group" aria-hidden="true" /> {course.modules} modules</span>
                  </div>
                </button>
              )
            })}
          </div>
          {selectedCourse && (
            <aside className="tutor-course-detail dash-card-lift">
              <span className="tutor-course-detail-label">Selected course</span>
              <h3>{selectedCourse.title}</h3>
              <p>{selectedCourse.batch}</p>
              <dl className="tutor-course-detail-stats">
                <div><dt>Learners</dt><dd>{selectedCourse.students}</dd></div>
                <div><dt>Modules</dt><dd>{selectedCourse.modules}</dd></div>
                <div><dt>Status</dt><dd><CourseStatusPill status={selectedCourse.status} /></dd></div>
                <div><dt>Last updated</dt><dd>{selectedCourse.updated}</dd></div>
              </dl>
              <div className="tutor-course-detail-actions">
                <button type="button" className="btn btn-primary" onClick={handleOpenCourse} disabled={submitting}>Open course</button>
                <button type="button" className="btn tutor-btn-muted" onClick={handleEditOutline}>Edit outline</button>
              </div>
            </aside>
          )}
        </div>
      )}
    </DashSection>
  )

  const calDaySchedule = useMemo(() => {
    return schedule.filter((item) => {
      const key = item.dateKey || toDateInputValue(item.startAt)
      return key === selectedCalDate
    })
  }, [schedule, selectedCalDate])

  const scheduleTab = (
    <>
      <DashSection className="tutor-section tutor-section--calendar" aria-labelledby="tutor-calendar-heading" delay={0}>
        <div className="tutor-section-head">
          <div className="tutor-section-head-text">
            <h2 id="tutor-calendar-heading" className="tutor-section-title">Calendar &amp; schedule</h2>
            <p className="tutor-section-desc">
              Create live classes, assign learners, and manage your teaching calendar.
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={openNewSchedule}>
            + Schedule class
          </button>
        </div>

        {loading ? (
          <DashListSkeleton count={2} />
        ) : (
          <div className="dash-tutor-schedule-layout">
            <CalendarView
              items={schedule}
              selectedDateKey={selectedCalDate}
              onSelectDate={setSelectedCalDate}
            />
            <div className="dash-student-schedule-panel">
              <h3 className="dash-student-schedule-day-title">
                {selectedCalDate
                  ? new Date(selectedCalDate + 'T12:00:00').toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })
                  : 'Selected day'}
              </h3>
              {calDaySchedule.length === 0 ? (
                <DashEmptyState
                  compact
                  icon="fa-calendar-days"
                  title="No classes this day"
                  message="Schedule a class or pick another date on the calendar."
                  action={
                    <button type="button" className="btn btn-primary" onClick={openNewSchedule}>
                      Schedule class
                    </button>
                  }
                />
              ) : (
                <div className="dash-schedule-card-list">
                  {calDaySchedule.map((item) => (
                    <ScheduleCard
                      key={item.id}
                      item={item}
                      onEdit={openEditSchedule}
                      onDelete={handleCancelSchedule}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && schedule.length > 0 && (
          <section className="dash-student-upcoming" aria-label="All scheduled classes">
            <h3>All scheduled classes</h3>
            <div className="dash-schedule-card-list">
              {schedule.map((item) => (
                <ScheduleCard
                  key={item.id}
                  item={item}
                  onEdit={openEditSchedule}
                  onDelete={handleCancelSchedule}
                />
              ))}
            </div>
          </section>
        )}
      </DashSection>

    </>
  )

  const messagesTab = (
    <DashSection
      className="tutor-section tutor-section--messages"
      aria-labelledby="tutor-messages-heading"
      delay={0}
    >
      <div className="tutor-section-head">
        <div className="tutor-section-head-text">
          <h2 id="tutor-messages-heading" className="tutor-section-title">Messages</h2>
          <p className="tutor-section-desc">Chat with learners in your courses and batches.</p>
        </div>
        <span className="tutor-section-count">
          {unreadCount ? `${unreadCount} unread` : 'All caught up'}
        </span>
      </div>
      <MessagesPage variant="tutor" onNotice={showNotice} />
    </DashSection>
  )

  const learnersTab = (
      <DashSection className="tutor-section tutor-section--progress" aria-labelledby="tutor-progress-heading" delay={0}>
        <div className="tutor-section-head">
          <div className="tutor-section-head-text">
            <h2 id="tutor-progress-heading" className="tutor-section-title">Learner progress</h2>
            <p className="tutor-section-desc">Track completion and identify learners who may need support.</p>
          </div>
        </div>
      {loading ? (
        <DashTableSkeleton rows={5} />
      ) : learners.length === 0 ? (
        <DashEmptyState
          icon="fa-user-graduate"
          title="No enrolled learners yet"
          message="When learners join your courses, their progress and activity will show up here."
        />
      ) : (
        <div className="tutor-table-wrap">
          <table className="tutor-table">
            <thead><tr><th scope="col">Learner</th><th scope="col">Course</th><th scope="col">Progress</th><th scope="col">Last active</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {learners.map((row) => (
                <tr key={row.id}>
                  <td data-label="Learner">{row.name}</td>
                  <td data-label="Course">{row.course}</td>
                  <td data-label="Progress">
                    <AnimatedProgressBar value={row.progress} label={`${row.name} ${row.progress}% complete`} barClassName="tutor-progress-bar dash-progress-bar" cellClassName="tutor-progress-cell dash-progress-cell" pctClassName="tutor-progress-pct dash-progress-pct" />
                  </td>
                  <td data-label="Last active">{row.lastActive}</td>
                  <td data-label="Status"><ProgressStatusPill status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashSection>
  )

  const batchesTab = (
    <BatchTab
      batches={batches}
      learners={learnerPool}
      loading={loading}
      onRefresh={refreshBatches}
      showNotice={showNotice}
    />
  )

  const profileTab = (
    <DashSection className="tutor-section tutor-section--profile" aria-labelledby="tutor-profile-heading" delay={0}>
      <div className="tutor-section-head">
        <div className="tutor-section-head-text">
          <h2 id="tutor-profile-heading" className="tutor-section-title">Profile &amp; availability</h2>
          <p className="tutor-section-desc">Your teaching profile and when learners can reach you.</p>
        </div>
      </div>
      <div className="tutor-profile-grid">
        <div className="tutor-profile-card dash-card-lift">
          <div className="tutor-profile-header">
            <span className="tutor-profile-avatar" aria-hidden="true">{initial}</span>
            <div><h3>{profile?.name || user?.name || 'Tutor'}</h3><p>{profile?.email || user?.email}</p></div>
          </div>
          <ul className="tutor-profile-tags">{(profile?.expertise || []).map((tag) => <li key={tag}>{tag}</li>)}</ul>
          <button type="button" className="btn tutor-btn-muted" onClick={openProfileEdit}>Edit profile</button>
        </div>
        <div className="tutor-availability-card dash-card-lift">
          <h3>Availability</h3>
          <dl className="tutor-availability-list">
            <div><dt>Timezone</dt><dd>{profile?.timezone || '—'}</dd></div>
            <div><dt>Weekly hours</dt><dd>{(profile?.weeklyHours || []).map((slot) => <span key={slot} className="tutor-availability-slot">{slot}</span>)}</dd></div>
            <div><dt>Office hours</dt><dd>{profile?.officeHours || '—'}</dd></div>
            <div><dt>Next open slot</dt><dd>{profile?.nextOpenSlot || '—'}</dd></div>
          </dl>
          <button type="button" className="btn btn-primary" onClick={openProfileEdit}>Update availability</button>
        </div>
      </div>
    </DashSection>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-gauge-high', content: overviewTab },
    { id: 'courses', label: 'Courses', icon: 'fa-book-open', badge: courses.length, content: coursesTab },
    { id: 'batches', label: 'Batches', icon: 'fa-users', badge: batches.length, content: batchesTab },
    { id: 'schedule', label: 'Calendar', icon: 'fa-calendar-days', badge: schedule.length, content: scheduleTab },
    {
      id: 'messages',
      label: 'Messages',
      icon: 'fa-comments',
      badge: unreadCount || undefined,
      content: messagesTab,
    },
    { id: 'learners', label: 'Learners', icon: 'fa-user-graduate', content: learnersTab },
    { id: 'profile', label: 'Profile', icon: 'fa-user-gear', content: profileTab },
  ]

  return (
    <>
      <DashboardShell
        variant="tutor"
        portal={portal}
        tabs={tabs}
        defaultTab="overview"
        notice={actionNotice ? (
          <p className="tutor-action-notice dash-action-notice" role="status">
            <i className="fas fa-circle-info" aria-hidden="true" />{actionNotice}
          </p>
        ) : null}
      />
      {modals}

      <ScheduleClassModal
        open={scheduleModalOpen}
        title={scheduleClassForm.id ? 'Edit scheduled class' : 'Schedule a class'}
        form={scheduleClassForm}
        courses={courses}
        batches={batches}
        learners={learnerPool.length ? learnerPool : learners}
        submitting={submitting}
        onClose={() => setScheduleModalOpen(false)}
        onChange={(patch) => setScheduleClassForm((f) => ({ ...f, ...patch }))}
        onSubmit={handleSaveSchedule}
        onToggleStudent={toggleScheduleStudent}
        onToggleBatch={toggleScheduleBatch}
      />
    </>
  )
}

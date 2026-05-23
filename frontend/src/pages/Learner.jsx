import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedProgressBar from '../components/AnimatedProgressBar'
import DashboardShell, { DashSection } from '../components/DashboardShell'
import NotificationBell from '../components/dashboard/NotificationBell'
import StudentScheduleView from '../components/dashboard/StudentScheduleView'
import MessagesPage from '../components/messages/MessagesPage'
import MessageNotificationBadge from '../components/messages/MessageNotificationBadge'
import { getCurrentUser, roleLabel, getToken } from '../lib/auth'
import {
  fetchLearnerScheduleSafe,
  fetchLearnerNotificationsSafe,
  fetchLearnerCoursesSafe,
  fetchLearnerBatchesSafe,
  fetchLearnerMessageUnreadCount,
  markAllLearnerNotificationsReadSafe,
} from '../lib/learnerApi'
import { staggerContainer, staggerItem } from '../lib/motion'

const LIVE_CLASSES = [
  {
    id: 'lc1',
    dayLabel: 'Today',
    date: '22 May',
    time: '2:30 PM',
    title: 'Protection Systems Q&A',
    course: 'Power Systems Protection',
    tutor: 'Dr. Rajesh Kumar',
    tone: 'today',
  },
  {
    id: 'lc2',
    dayLabel: 'Tomorrow',
    date: '23 May',
    time: '11:00 AM',
    title: 'Grid Control Room Simulation',
    course: 'Grid Operations & Control',
    tutor: 'Ms. Ananya Desai',
    tone: 'upcoming',
  },
  {
    id: 'lc3',
    dayLabel: 'Fri',
    date: '24 May',
    time: '4:00 PM',
    title: 'Safety Case Study Review',
    course: 'Safety Compliance Fundamentals',
    tutor: 'Mr. Suresh Iyer',
    tone: 'upcoming',
  },
]

function LearnerStatCard({ label, value, hint, icon, tone, delay }) {
  return (
    <div
      className={`learner-stat-card learner-stat-card--${tone} dash-card-lift`}
      style={{ '--learner-stat-delay': `${delay}ms` }}
    >
      <span className="learner-stat-icon" aria-hidden="true">
        <i className={`fas ${icon}`} />
      </span>
      <div className="learner-stat-body">
        <span className="learner-stat-label">{label}</span>
        <span className="learner-stat-value">{value}</span>
        {hint && <span className="learner-stat-hint">{hint}</span>}
      </div>
    </div>
  )
}

export default function Learner() {
  const user = getCurrentUser()
  const initial = (user?.name || user?.email || 'S').charAt(0).toUpperCase()
  const [actionNotice, setActionNotice] = useState('')
  const [schedule, setSchedule] = useState([])
  const [scheduleLoading, setScheduleLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [batches, setBatches] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [notifUnread, setNotifUnread] = useState(0)
  const [notifLoading, setNotifLoading] = useState(false)
  const [messageUnread, setMessageUnread] = useState(0)

  const loadScheduleData = useCallback(async () => {
    if (!getToken()) {
      setScheduleLoading(false)
      return
    }
    setScheduleLoading(true)
    setCoursesLoading(true)
    try {
      const [scheduleRes, notifRes, coursesRes, batchesRes, msgUnreadRes] = await Promise.all([
        fetchLearnerScheduleSafe(),
        fetchLearnerNotificationsSafe(),
        fetchLearnerCoursesSafe(),
        fetchLearnerBatchesSafe(),
        fetchLearnerMessageUnreadCount().catch(() => ({ count: 0 })),
      ])
      setSchedule(scheduleRes.data || [])
      setNotifications(notifRes.data || [])
      setNotifUnread(notifRes.unreadCount ?? 0)
      setCourses(coursesRes.data || [])
      setBatches(batchesRes.data || [])
      setMessageUnread(msgUnreadRes.count ?? 0)
    } finally {
      setScheduleLoading(false)
      setCoursesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadScheduleData()
  }, [loadScheduleData])

  async function handleMarkAllNotificationsRead() {
    setNotifLoading(true)
    try {
      await markAllLearnerNotificationsReadSafe()
      setNotifications((list) => list.map((n) => ({ ...n, read: true })))
      setNotifUnread(0)
    } catch {
      showNotice('Could not update notifications.')
    } finally {
      setNotifLoading(false)
    }
  }

  function showNotice(message) {
    setActionNotice(message)
    window.setTimeout(() => setActionNotice(''), 4200)
  }

  const overviewStats = useMemo(() => {
    const now = Date.now()
    const upcoming = [...schedule]
      .filter((item) => new Date(item.startAt).getTime() >= now - 3600000)
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
    const nextClass = upcoming[0]
    const inProgress = courses.filter((c) => c.progress > 0 && c.progress < 100).length
    const lessonsDone = courses.reduce((sum, c) => sum + (c.modulesDone || 0), 0)

    let batchValue = '—'
    let batchHint = 'Not assigned to a batch yet'
    if (coursesLoading) {
      batchValue = '…'
      batchHint = 'Loading…'
    } else if (batches.length === 1) {
      batchValue = batches[0].name
      batchHint = batches[0].subject || batches[0].tutor || 'Your cohort'
    } else if (batches.length > 1) {
      batchValue = batches.map((b) => b.name).join(', ')
      batchHint = `${batches.length} batches assigned`
    }

    return [
      {
        key: 'courses',
        label: 'Enrolled Courses',
        value: coursesLoading ? '…' : String(courses.length),
        hint: coursesLoading
          ? 'Loading…'
          : inProgress
            ? `${inProgress} in progress`
            : courses.length
              ? 'Enrolled programs'
              : 'No courses yet',
        icon: 'fa-book-open',
        tone: 'courses',
      },
      {
        key: 'classes',
        label: 'Upcoming Classes',
        value: scheduleLoading ? '…' : String(upcoming.length),
        hint: scheduleLoading
          ? 'Loading…'
          : nextClass
            ? `${nextClass.dayLabel || 'Next'} · ${nextClass.time || ''}`.trim()
            : 'No sessions scheduled',
        icon: 'fa-video',
        tone: 'classes',
      },
      {
        key: 'batch',
        label: batches.length > 1 ? 'Your batches' : 'Your batch',
        value: batchValue,
        hint: batchHint,
        icon: 'fa-users',
        tone: 'batch',
      },
      {
        key: 'lessons',
        label: 'Completed Lessons',
        value: coursesLoading ? '…' : String(lessonsDone),
        hint: coursesLoading ? 'Loading…' : 'Across all courses',
        icon: 'fa-circle-check',
        tone: 'lessons',
      },
    ]
  }, [batches, courses, coursesLoading, schedule, scheduleLoading])

  const portal = (
      <header className="learner-portal">
        <div className="learner-portal-pattern" aria-hidden="true" />
        <div className="learner-portal-inner">
          <div className="learner-portal-main">
            <div className="learner-portal-head">
              <span className="learner-portal-badge">
                <span className="learner-portal-badge-dot" />
                Learner Portal
              </span>
              <div className="dash-portal-head-actions">
                <span className="learner-portal-live">Learning dashboard</span>
                <MessageNotificationBadge />
                <NotificationBell
                  notifications={notifications}
                  unreadCount={notifUnread}
                  onMarkAllRead={handleMarkAllNotificationsRead}
                  loading={notifLoading}
                />
              </div>
            </div>
            <h1 className="learner-portal-title">Your learning journey</h1>
            <p className="learner-portal-lead">
              Track courses, join live sessions, view your batch, and stay
              connected with your tutors — all in one place.
            </p>
            {user && (
              <div className="learner-portal-session">
                <span className="learner-portal-avatar" aria-hidden="true">
                  {initial}
                </span>
                <div className="learner-portal-session-copy">
                  <span className="learner-portal-session-label">Signed in as</span>
                  <strong className="learner-portal-session-name">
                    {user.name || 'Learner'}
                  </strong>
                  <span className="learner-portal-session-email">{user.email}</span>
                </div>
                <span className="learner-portal-role">{roleLabel(user.role)}</span>
              </div>
            )}
          </div>

          <div className="learner-stats-grid" aria-label="Overview">
            {overviewStats.map((stat, index) => (
              <LearnerStatCard key={stat.key} {...stat} delay={index * 70} />
            ))}
          </div>
        </div>
      </header>
  )

  const coursesTab = (
      <DashSection
        className="learner-section learner-section--courses"
        aria-labelledby="learner-courses-heading"
        delay={0}
      >
        <div className="learner-section-head">
          <div className="learner-section-head-text">
            <h2 id="learner-courses-heading" className="learner-section-title">
              Enrolled courses
            </h2>
            <p className="learner-section-desc">
              View-only access — your tutor manages course and batch details.
            </p>
          </div>
          <span className="learner-section-count">
            {coursesLoading ? '…' : `${courses.length} active`}
          </span>
        </div>

        <p className="learner-read-only-notice" role="status">
          <i className="fas fa-lock" aria-hidden="true" />
          You cannot edit courses or batches. Contact your tutor for changes.
        </p>

        {coursesLoading ? (
          <p className="dash-schedule-loading">Loading your courses…</p>
        ) : courses.length === 0 ? (
          <p className="learner-enrolled-empty">No enrolled courses yet.</p>
        ) : (
          <motion.div
            className="learner-enrolled-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {courses.map((course) => (
              <motion.article
                key={course.id}
                className="learner-enrolled-card learner-enrolled-card--readonly dash-card-lift"
                variants={staggerItem}
              >
                <div className="learner-enrolled-card-head">
                  <h3>{course.title}</h3>
                  <span className="learner-read-only-pill">View only</span>
                </div>
                <span className="learner-enrolled-tutor">
                  <i className="fas fa-chalkboard-user" aria-hidden="true" /> {course.tutor}
                </span>
                {course.batch && (
                  <p className="learner-enrolled-batch">
                    <i className="fas fa-layer-group" aria-hidden="true" /> {course.batch}
                  </p>
                )}
                <AnimatedProgressBar
                  value={course.progress}
                  label={`${course.title} ${course.progress}% complete`}
                  barClassName="learner-progress-bar dash-progress-bar"
                  cellClassName="learner-progress-cell dash-progress-cell"
                  pctClassName="learner-progress-pct dash-progress-pct"
                />
                <p className="learner-enrolled-meta">
                  {course.modulesDone} of {course.modulesTotal} modules complete
                </p>
              </motion.article>
            ))}
          </motion.div>
        )}

        <div className="learner-batches-block">
          <h3 className="learner-batches-title">Your batches</h3>
          <p className="learner-section-desc">
            Cohorts you belong to — managed by your tutor.
          </p>
          {coursesLoading ? (
            <p className="dash-schedule-loading">Loading batches…</p>
          ) : batches.length === 0 ? (
            <p className="learner-enrolled-empty">You are not assigned to a batch yet.</p>
          ) : (
            <ul className="learner-batch-list">
              {batches.map((batch) => (
                <li key={batch.id} className="learner-batch-item dash-card-lift">
                  <div className="learner-batch-item-head">
                    <strong>{batch.name}</strong>
                    <span className="learner-read-only-pill">View only</span>
                  </div>
                  {batch.subject && <span className="learner-batch-subject">{batch.subject}</span>}
                  <span className="learner-batch-tutor">
                    <i className="fas fa-user-tie" aria-hidden="true" /> {batch.tutor}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DashSection>
  )

  const scheduleTab = (
    <DashSection
      className="learner-section learner-section--calendar"
      aria-labelledby="learner-calendar-heading"
      delay={0}
    >
      <div className="learner-section-head">
        <div className="learner-section-head-text">
          <h2 id="learner-calendar-heading" className="learner-section-title">
            Calendar &amp; schedule
          </h2>
          <p className="learner-section-desc">
            View classes assigned to you by your tutors. You cannot edit schedules here.
          </p>
        </div>
        <span className="learner-section-count">
          {scheduleLoading ? '…' : `${schedule.length} scheduled`}
        </span>
      </div>
      <StudentScheduleView schedule={schedule} loading={scheduleLoading} />
    </DashSection>
  )

  const messagesTab = (
    <DashSection
      className="learner-section learner-section--chat"
      aria-labelledby="learner-chat-heading"
      delay={0}
    >
      <div className="learner-section-head">
        <div className="learner-section-head-text">
          <h2 id="learner-chat-heading" className="learner-section-title">
            Messages
          </h2>
          <p className="learner-section-desc">
            Chat with your assigned tutors about courses and doubts.
          </p>
        </div>
        <span className="learner-section-count">
          {messageUnread ? `${messageUnread} unread` : 'All caught up'}
        </span>
      </div>
      <MessagesPage variant="learner" onNotice={showNotice} />
    </DashSection>
  )

  const tabs = [
    {
      id: 'courses',
      label: 'My courses',
      icon: 'fa-book-open',
      badge: coursesLoading ? undefined : courses.length,
      content: coursesTab,
    },
    {
      id: 'schedule',
      label: 'Calendar',
      icon: 'fa-calendar-days',
      badge: schedule.length,
      content: scheduleTab,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: 'fa-comments',
      badge: messageUnread || undefined,
      content: messagesTab,
    },
  ]

  return (
    <DashboardShell
      variant="learner"
      portal={portal}
      tabs={tabs}
      defaultTab="courses"
      notice={
        actionNotice ? (
          <p className="learner-action-notice learner-action-notice--global dash-action-notice" role="status">
            <i className="fas fa-circle-info" aria-hidden="true" />
            {actionNotice}
          </p>
        ) : null
      }
    />
  )
}

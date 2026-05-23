import React, { useMemo, useState } from 'react'
import CalendarView from './CalendarView'
import ScheduleCard from './ScheduleCard'
import DashEmptyState from './DashEmptyState'
import { toDateInputValue } from '../../lib/scheduleUtils'

export default function StudentScheduleView({ schedule, loading }) {
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateInputValue(new Date()))

  const dayItems = useMemo(() => {
    return schedule.filter((item) => {
      const key = item.dateKey || toDateInputValue(item.startAt)
      return key === selectedDateKey
    })
  }, [schedule, selectedDateKey])

  const upcoming = useMemo(() => {
    const now = Date.now()
    return [...schedule]
      .filter((item) => new Date(item.startAt).getTime() >= now - 3600000)
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
  }, [schedule])

  if (loading) {
    return <p className="dash-schedule-loading">Loading your schedule…</p>
  }

  return (
    <div className="dash-student-schedule">
      <div className="dash-student-schedule-layout">
        <CalendarView
          items={schedule}
          selectedDateKey={selectedDateKey}
          onSelectDate={setSelectedDateKey}
        />

        <div className="dash-student-schedule-panel">
          <h3 className="dash-student-schedule-day-title">
            {selectedDateKey
              ? new Date(selectedDateKey + 'T12:00:00').toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })
              : 'Selected day'}
          </h3>

          {dayItems.length === 0 ? (
            <DashEmptyState
              compact
              icon="fa-calendar-days"
              title="No classes this day"
              message="Select another date or check upcoming sessions below."
            />
          ) : (
            <div className="dash-schedule-card-list">
              {dayItems.map((item) => (
                <ScheduleCard key={item.id} item={item} readOnly />
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="dash-student-upcoming" aria-label="All upcoming classes">
        <h3>All upcoming classes</h3>
        {upcoming.length === 0 ? (
          <DashEmptyState
            compact
            icon="fa-video"
            title="No upcoming classes"
            message="Your tutor will notify you when a new session is scheduled."
          />
        ) : (
          <div className="dash-schedule-card-list">
            {upcoming.map((item) => (
              <ScheduleCard key={item.id} item={item} readOnly />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

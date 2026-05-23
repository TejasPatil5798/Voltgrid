import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  addMonths,
  endOfMonth,
  groupByDateKey,
  monthLabel,
  startOfMonth,
  toDateInputValue,
} from '../../lib/scheduleUtils'

function buildMonthGrid(monthDate) {
  const start = startOfMonth(monthDate)
  const end = endOfMonth(monthDate)
  const firstWeekday = start.getDay()
  const daysInMonth = end.getDate()
  const cells = []
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) {
    const d = new Date(start.getFullYear(), start.getMonth(), day)
    cells.push({ day, dateKey: toDateInputValue(d), date: d })
  }
  return cells
}

export default function CalendarView({ items, selectedDateKey, onSelectDate }) {
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()))
  const grouped = useMemo(() => groupByDateKey(items), [items])
  const cells = useMemo(() => buildMonthGrid(monthCursor), [monthCursor])
  const activeKey = selectedDateKey || toDateInputValue(new Date())

  return (
    <div className="dash-calendar">
      <div className="dash-calendar-head">
        <button
          type="button"
          className="dash-calendar-nav"
          aria-label="Previous month"
          onClick={() => setMonthCursor((m) => addMonths(m, -1))}
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="dash-calendar-month">{monthLabel(monthCursor)}</h3>
        <button
          type="button"
          className="dash-calendar-nav"
          aria-label="Next month"
          onClick={() => setMonthCursor((m) => addMonths(m, 1))}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="dash-calendar-weekdays" aria-hidden="true">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="dash-calendar-grid" role="grid" aria-label={monthLabel(monthCursor)}>
        {cells.map((cell, index) => {
          if (!cell) {
            return <span key={`empty-${index}`} className="dash-calendar-cell dash-calendar-cell--empty" />
          }
          const hasEvents = Boolean(grouped[cell.dateKey]?.length)
          const isSelected = activeKey === cell.dateKey
          const isToday = toDateInputValue(new Date()) === cell.dateKey
          return (
            <motion.button
              key={cell.dateKey}
              type="button"
              role="gridcell"
              className={[
                'dash-calendar-cell',
                hasEvents && 'dash-calendar-cell--has-events',
                isSelected && 'dash-calendar-cell--selected',
                isToday && 'dash-calendar-cell--today',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate?.(cell.dateKey)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>{cell.day}</span>
              {hasEvents && <span className="dash-calendar-dot" aria-hidden="true" />}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

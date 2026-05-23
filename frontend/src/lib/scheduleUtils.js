/** YYYY-MM-DD in the user's local timezone (avoids UTC off-by-one on calendar cells). */
export function toDateInputValue(date) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function toTimeInputValue(date) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export function combineDateAndTime(date, time) {
  if (!date || !time) return ''
  const parsed = new Date(`${date}T${time}`)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString()
}

export function startOfMonth(date) {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function endOfMonth(date) {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

export function addMonths(date, count) {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth() + count, 1)
}

export function monthLabel(date) {
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export function groupByDateKey(items) {
  return items.reduce((acc, item) => {
    const key = item.dateKey || toDateInputValue(item.startAt)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

export const EMPTY_SCHEDULE_CLASS_FORM = {
  id: '',
  title: '',
  courseId: '',
  subject: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  meetingLink: '',
  studentIds: [],
  batchIds: [],
}

export function scheduleToForm(item) {
  return {
    id: item.id || '',
    title: item.title || '',
    courseId: item.courseId || '',
    subject: item.subject || item.course || '',
    date: item.dateKey || toDateInputValue(item.startAt),
    startTime: item.startAt ? toTimeInputValue(item.startAt) : '',
    endTime: item.endAt ? toTimeInputValue(item.endAt) : '',
    description: item.description || '',
    meetingLink: item.meetingLink || '',
    studentIds: item.studentIds || [],
    batchIds: item.batchIds || [],
  }
}

/** Merge learners from selected batches + manual picks (deduped). */
export function resolveFormStudentIds(batches, batchIds, manualStudentIds) {
  const selected = batches.filter((b) => batchIds.includes(b.id))
  const fromBatches = selected.flatMap((b) => b.studentIds || [])
  return [...new Set([...fromBatches, ...manualStudentIds])]
}

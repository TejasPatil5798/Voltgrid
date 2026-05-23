/**
 * Fallback mock data when API/database is unavailable.
 * Replace by wiring learnerApi / tutorApi only.
 */

export const MOCK_NOTIFICATIONS_TUTOR = [
  {
    id: 'mock-t1',
    title: 'Class scheduled',
    message: 'You scheduled "Protection Systems Q&A" successfully.',
    read: false,
    time: '2 hours ago',
    createdAt: new Date().toISOString(),
  },
]

export const MOCK_NOTIFICATIONS_LEARNER = [
  {
    id: 'mock-l1',
    title: 'New class scheduled',
    message: 'New class scheduled: Protection Systems Q&A on 23 May 2026 at 2:30 PM.',
    read: false,
    time: '1 hour ago',
    createdAt: new Date().toISOString(),
  },
]

export const MOCK_SCHEDULE_LEARNER = [
  {
    id: 'mock-s1',
    dayLabel: 'Today',
    date: '23 May',
    dateKey: '2026-05-23',
    time: '2:30 PM – 3:30 PM',
    title: 'Protection Systems Q&A',
    course: 'Power Systems Protection',
    subject: 'Power Systems Protection',
    tutor: 'Demo Tutor',
    description: 'Live Q&A on differential protection.',
    meetingLink: 'https://meet.example.com/protection-qa',
    startAt: new Date().toISOString(),
    status: 'scheduled',
  },
]

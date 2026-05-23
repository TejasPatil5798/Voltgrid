const mongoose = require('mongoose')
const User = require('../models/User')
const Course = require('../models/Course')
const Lesson = require('../models/Lesson')
const Note = require('../models/Note')
const Assignment = require('../models/Assignment')
const Quiz = require('../models/Quiz')
const Schedule = require('../models/Schedule')
const Batch = require('../models/Batch')
const Message = require('../models/Message')
const Enrollment = require('../models/Enrollment')
const TutorProfile = require('../models/TutorProfile')

const TUTOR_EMAIL = 'demo-tutor@voltgridinsights.com'

function dbReady() {
  return mongoose.connection.readyState === 1
}

async function findTutorUser() {
  let tutor = await User.findOne({ email: TUTOR_EMAIL })
  if (!tutor) {
    tutor = await User.findOne({ role: 'tutor' })
  }
  return tutor
}

async function findDemoLearner() {
  let learner = await User.findOne({ email: 'demo-student@voltgridinsights.com' })
  if (!learner) {
    learner = await User.findOne({ role: { $in: ['learner', 'student'] } })
  }
  return learner
}

async function seedTutorDemo() {
  if (!dbReady()) return { skipped: true, reason: 'no database' }

  const tutor = await findTutorUser()
  if (!tutor) return { skipped: true, reason: 'no tutor user' }

  const tutorId = tutor._id
  const existing = await Course.countDocuments({ tutorId })
  if (existing > 0) return { skipped: true, reason: 'already seeded' }

  const learner = await findDemoLearner()

  await TutorProfile.findOneAndUpdate(
    { userId: tutorId },
    {
      userId: tutorId,
      expertise: ['Power systems', 'Grid operations', 'Safety training'],
      timezone: 'Asia/Kolkata (IST)',
      weeklyHours: ['Mon–Fri · 9:00 AM – 5:00 PM', 'Sat · 10:00 AM – 1:00 PM'],
      officeHours: 'Tue & Thu · 4:00 – 5:30 PM',
      nextOpenSlot: 'Today · 2:00 PM',
      earningsThisMonth: 124500,
    },
    { upsert: true, new: true },
  )

  const courseSpecs = [
    {
      title: 'Power Systems Protection',
      batch: 'Batch A · May 2026',
      status: 'Live',
      moduleCount: 8,
    },
    {
      title: 'Grid Operations & Control',
      batch: 'Batch B · May 2026',
      status: 'Live',
      moduleCount: 6,
    },
    {
      title: 'Safety Compliance Fundamentals',
      batch: 'Corporate cohort',
      status: 'Draft',
      moduleCount: 5,
    },
    {
      title: 'Asset Maintenance Planning',
      batch: 'Evening batch',
      status: 'Scheduled',
      moduleCount: 4,
    },
  ]

  const courses = await Course.insertMany(
    courseSpecs.map((spec) => ({ ...spec, tutorId })),
  )

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const learnerIds = learner ? [learner._id] : []

  await Schedule.insertMany([
    {
      tutorId,
      courseId: courses[1]._id,
      title: 'Grid Operations — Batch B',
      subject: 'Grid Operations & Control',
      meta: 'Live session · 90 min',
      startAt: new Date(today.getTime() + 10 * 60 * 60 * 1000),
      durationMinutes: 90,
      sessionType: 'Live session',
      studentIds: learnerIds,
    },
    {
      tutorId,
      courseId: courses[0]._id,
      title: 'Protection Systems Q&A',
      subject: 'Power Systems Protection',
      meta: 'Doubt clearing · 45 min',
      startAt: new Date(today.getTime() + 14.5 * 60 * 60 * 1000),
      durationMinutes: 45,
      sessionType: 'Q&A',
      studentIds: learnerIds,
    },
    {
      tutorId,
      courseId: courses[2]._id,
      title: 'Safety Compliance — Module 3',
      subject: 'Safety Compliance Fundamentals',
      meta: 'Recorded upload due',
      startAt: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
      durationMinutes: 60,
      sessionType: 'Recorded',
      studentIds: learnerIds,
    },
    {
      tutorId,
      courseId: courses[3]._id,
      title: 'Maintenance Planning workshop',
      subject: 'Asset Maintenance Planning',
      meta: 'Residential cohort',
      startAt: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 9.5 * 60 * 60 * 1000),
      durationMinutes: 120,
      sessionType: 'Workshop',
      studentIds: learnerIds,
    },
  ])

  if (learner) {
    await Enrollment.insertMany([
      {
        studentId: learner._id,
        courseId: courses[0]._id,
        tutorId,
        progress: 78,
        status: 'On track',
        lastActiveAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        studentId: learner._id,
        courseId: courses[1]._id,
        tutorId,
        progress: 62,
        status: 'Needs review',
        lastActiveAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        studentId: learner._id,
        courseId: courses[2]._id,
        tutorId,
        progress: 45,
        status: 'On track',
        lastActiveAt: new Date(now.getTime() - 30 * 60 * 1000),
      },
      {
        studentId: learner._id,
        courseId: courses[3]._id,
        tutorId,
        progress: 55,
        status: 'On track',
        lastActiveAt: new Date(now.getTime() - 60 * 60 * 1000),
      },
    ])

    const threadId = `thread-${courses[0]._id}-${learner._id}`
    await Message.insertMany([
      {
        tutorId,
        studentId: learner._id,
        studentName: learner.name || 'Demo Learner',
        courseId: courses[1]._id,
        courseTitle: courses[1].title,
        text: 'Could you clarify relay coordination settings from yesterday’s session?',
        fromRole: 'learner',
        read: false,
        threadId,
      },
      {
        tutorId,
        studentId: learner._id,
        studentName: learner.name || 'Demo Learner',
        courseId: courses[0]._id,
        courseTitle: courses[0].title,
        text: 'Assignment 2 submission link is not opening on mobile.',
        fromRole: 'learner',
        read: false,
        threadId: `thread-${courses[0]._id}-${learner._id}`,
      },
      {
        tutorId,
        studentId: learner._id,
        studentName: learner.name || 'Demo Learner',
        courseId: courses[0]._id,
        courseTitle: courses[0].title,
        text: 'Thanks for the extra notes on differential protection.',
        fromRole: 'learner',
        read: true,
        threadId: `thread-${courses[0]._id}-${learner._id}`,
      },
    ])

    const batchCount = await Batch.countDocuments({ tutorId })
    if (batchCount === 0) {
      const batches = await Batch.insertMany([
        {
          tutorId,
          name: 'Protection Systems — Batch A',
          subject: 'Power Systems Protection',
          description: 'Core protection cohort for May 2026.',
          studentIds: learnerIds,
        },
        {
          tutorId,
          name: 'Grid Operations — Batch B',
          subject: 'Grid Operations & Control',
          description: 'Live operations and control room sessions.',
          studentIds: learnerIds,
        },
      ])
      await Schedule.updateMany(
        { tutorId, title: 'Protection Systems Q&A' },
        { $set: { batchIds: [batches[0]._id] } },
      )
      await Schedule.updateMany(
        { tutorId, title: 'Grid Operations — Batch B' },
        { $set: { batchIds: [batches[1]._id] } },
      )
    }
  }

  await Lesson.create({
    courseId: courses[0]._id,
    tutorId,
    title: 'Introduction to protection relays',
    videoUrl: 'https://example.com/videos/protection-intro',
    description: 'Overview of relay types and applications',
    order: 1,
  })

  return { seeded: true, courses: courses.length }
}

module.exports = { seedTutorDemo, TUTOR_EMAIL }

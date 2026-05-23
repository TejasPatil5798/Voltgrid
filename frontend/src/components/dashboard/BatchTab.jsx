import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DashSection } from '../DashboardShell'
import DashEmptyState from './DashEmptyState'
import { DashCardSkeleton } from './DashSkeleton'
import BatchCard from './BatchCard'
import CreateBatchModal from './CreateBatchModal'
import EditBatchModal from './EditBatchModal'
import ManageLearnersModal from './ManageLearnersModal'
import {
  createBatch,
  updateBatch,
  deleteBatch,
  addBatchLearner,
  removeBatchLearner,
} from '../../lib/tutorApi'
import { staggerContainer, staggerItem } from '../../lib/motion'

const EMPTY_BATCH_FORM = { name: '', subject: '', description: '' }

export default function BatchTab({ batches, learners, loading, onRefresh, showNotice }) {
  const [search, setSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_BATCH_FORM)
  const [editForm, setEditForm] = useState(EMPTY_BATCH_FORM)
  const [activeBatch, setActiveBatch] = useState(null)

  useEffect(() => {
    if (!activeBatch?.id) return
    const next = batches.find((b) => b.id === activeBatch.id)
    if (next) setActiveBatch(next)
  }, [batches, activeBatch?.id])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return batches
    return batches.filter((b) => {
      const haystack = [b.name, b.subject, b.description].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [batches, search])

  async function handleCreate(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createBatch(createForm)
      showNotice('Batch created successfully.')
      setCreateOpen(false)
      setCreateForm(EMPTY_BATCH_FORM)
      await onRefresh()
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(e) {
    e.preventDefault()
    if (!activeBatch) return
    setSubmitting(true)
    try {
      await updateBatch(activeBatch.id, editForm)
      showNotice('Batch updated.')
      setEditOpen(false)
      await onRefresh()
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(batch) {
    const confirmed = window.confirm(`Delete batch "${batch.name}"? This cannot be undone.`)
    if (!confirmed) return
    setSubmitting(true)
    try {
      await deleteBatch(batch.id)
      showNotice('Batch deleted.')
      await onRefresh()
    } catch (err) {
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function openEdit(batch) {
    setActiveBatch(batch)
    setEditForm({
      name: batch.name || '',
      subject: batch.subject || '',
      description: batch.description || '',
    })
    setEditOpen(true)
  }

  function openManage(batch) {
    setActiveBatch(batch)
    setManageOpen(true)
  }

  function closeManage() {
    setManageOpen(false)
  }

  function findLearnerMeta(studentId) {
    const match = learners.find((l) => (l.studentId || l.id) === studentId)
    return {
      id: studentId,
      name: match?.name || 'Learner',
      email: match?.email || '',
      course: match?.course,
    }
  }

  function patchActiveBatchStudents(nextStudentIds, mutateStudents) {
    setActiveBatch((prev) => {
      if (!prev) return prev
      const students = mutateStudents(prev.students || [])
      return {
        ...prev,
        studentIds: nextStudentIds,
        students,
        learnerCount: students.length,
      }
    })
  }

  async function handleAddLearner(studentId) {
    if (!activeBatch) return
    const sid = String(studentId)
    if ((activeBatch.studentIds || []).includes(sid)) return

    const previous = activeBatch
    const nextIds = [...(activeBatch.studentIds || []), sid]
    patchActiveBatchStudents(nextIds, (list) => [...list, findLearnerMeta(sid)])

    setSubmitting(true)
    try {
      const res = await addBatchLearner(activeBatch.id, sid)
      setActiveBatch(res.data)
      showNotice('Learner added to batch.')
      await onRefresh()
    } catch (err) {
      setActiveBatch(previous)
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemoveLearner(studentId) {
    if (!activeBatch) return
    const sid = String(studentId)
    const previous = activeBatch
    const nextIds = (activeBatch.studentIds || []).filter((id) => id !== sid)
    patchActiveBatchStudents(nextIds, (list) => list.filter((s) => s.id !== sid))

    setSubmitting(true)
    try {
      const res = await removeBatchLearner(activeBatch.id, sid)
      setActiveBatch(res.data)
      showNotice('Learner removed from batch.')
      await onRefresh()
    } catch (err) {
      setActiveBatch(previous)
      showNotice(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <DashSection className="tutor-section tutor-section--batches" aria-labelledby="tutor-batches-heading" delay={0}>
        <div className="tutor-section-head">
          <div className="tutor-section-head-text">
            <h2 id="tutor-batches-heading" className="tutor-section-title">
              Batches
            </h2>
            <p className="tutor-section-desc">
              Group learners into batches and schedule lectures for entire cohorts at once.
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setCreateOpen(true)}>
            + Create batch
          </button>
        </div>

        <div className="dash-batch-toolbar">
          <input
            type="search"
            className="form-input dash-batch-search"
            placeholder="Search batches…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="tutor-section-count">{filtered.length} batches</span>
        </div>

        {loading ? (
          <DashCardSkeleton count={2} className="dash-batch-grid" />
        ) : filtered.length === 0 ? (
          <DashEmptyState
            icon="fa-users"
            title={search ? 'No batches match' : 'No batches yet'}
            message={
              search
                ? 'Try a different search term.'
                : 'Create a batch to organize learners and assign lectures by cohort.'
            }
            action={
              !search && (
                <button type="button" className="btn btn-primary" onClick={() => setCreateOpen(true)}>
                  Create batch
                </button>
              )
            }
          />
        ) : (
          <motion.div
            className="dash-batch-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((batch) => (
              <motion.div key={batch.id} variants={staggerItem}>
                <BatchCard
                  batch={batch}
                  isActive={manageOpen && activeBatch?.id === batch.id}
                  onEdit={openEdit}
                  onManageLearners={openManage}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </DashSection>

      <CreateBatchModal
        open={createOpen}
        form={createForm}
        submitting={submitting}
        onClose={() => setCreateOpen(false)}
        onChange={(patch) => setCreateForm((f) => ({ ...f, ...patch }))}
        onSubmit={handleCreate}
      />

      <EditBatchModal
        open={editOpen}
        form={editForm}
        submitting={submitting}
        onClose={() => setEditOpen(false)}
        onChange={(patch) => setEditForm((f) => ({ ...f, ...patch }))}
        onSubmit={handleEdit}
      />

      <ManageLearnersModal
        open={manageOpen}
        batch={activeBatch}
        learners={learners}
        submitting={submitting}
        onClose={closeManage}
        onAddLearner={handleAddLearner}
        onRemoveLearner={handleRemoveLearner}
      />
    </>
  )
}

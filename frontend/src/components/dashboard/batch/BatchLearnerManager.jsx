import React, { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import LearnerList from './LearnerList'
import LearnerCard from './LearnerCard'
import {
  buildLearnerPool,
  learnerKey,
  matchesLearnerSearch,
  resolveBatchMembers,
} from './learnerUtils'

export default function BatchLearnerManager({ batch, learners, submitting, onAddLearner, onRemoveLearner }) {
  const [inBatchSearch, setInBatchSearch] = useState('')
  const [availableSearch, setAvailableSearch] = useState('')

  const memberIds = useMemo(
    () => new Set((batch?.studentIds || []).map(String)),
    [batch?.studentIds],
  )

  const fullPool = useMemo(
    () => buildLearnerPool(learners, batch?.students || []),
    [learners, batch?.students],
  )

  const inBatchLearners = useMemo(() => {
    return resolveBatchMembers(batch, fullPool).filter((l) =>
      matchesLearnerSearch(l, inBatchSearch),
    )
  }, [batch, fullPool, inBatchSearch])

  const availableLearners = useMemo(() => {
    return fullPool
      .filter((l) => !memberIds.has(learnerKey(l)))
      .filter((l) => matchesLearnerSearch(l, availableSearch))
  }, [fullPool, memberIds, availableSearch])

  if (!batch) return null

  return (
    <div className="dash-batch-learner-manager">
      <div className="dash-batch-learner-manager-banner">
        <span className="dash-batch-learner-manager-icon" aria-hidden="true">
          <Users size={18} />
        </span>
        <div>
          <span className="dash-batch-learner-manager-label">Active batch</span>
          <strong>{batch.name}</strong>
          {batch.subject && <span className="dash-batch-learner-manager-subject">{batch.subject}</span>}
        </div>
      </div>

      <div className="dash-batch-dual-panel">
        <LearnerList
          side="in-batch"
          title="Learners in Batch"
          count={(batch.students || []).length}
          searchId="batch-in-search"
          searchValue={inBatchSearch}
          onSearchChange={setInBatchSearch}
          searchPlaceholder="Search learners in this batch…"
          emptyTitle={inBatchSearch ? 'No matches' : 'No learners yet'}
          emptyMessage={
            inBatchSearch
              ? 'Try a different search term.'
              : 'Use the arrow on the right to add learners from the available list.'
          }
        >
          {inBatchLearners.map((learner) => (
            <LearnerCard
              key={learner.id}
              learner={learner}
              action="remove"
              layoutId={`learner-${learner.id}`}
              exitDirection="right"
              disabled={submitting}
              onTransfer={() => onRemoveLearner(learner.id)}
            />
          ))}
        </LearnerList>

        <div className="dash-batch-dual-divider" aria-hidden="true">
          <span />
        </div>

        <LearnerList
          side="available"
          title="All Learners"
          count={fullPool.filter((l) => !memberIds.has(learnerKey(l))).length}
          searchId="batch-available-search"
          searchValue={availableSearch}
          onSearchChange={setAvailableSearch}
          searchPlaceholder="Search available learners…"
          emptyTitle={availableSearch ? 'No matches' : 'All learners added'}
          emptyMessage={
            availableSearch
              ? 'Try a different search term.'
              : 'Every learner account is already in this batch.'
          }
        >
          {availableLearners.map((learner) => (
            <LearnerCard
              key={learner.id}
              learner={learner}
              action="add"
              layoutId={`learner-${learner.id}`}
              exitDirection="left"
              disabled={submitting}
              onTransfer={() => onAddLearner(learner.id)}
            />
          ))}
        </LearnerList>
      </div>
    </div>
  )
}

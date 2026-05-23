import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchLearnerInput from './SearchLearnerInput'

export default function LearnerList({
  side,
  title,
  count,
  searchId,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  emptyTitle,
  emptyMessage,
  children,
}) {
  return (
    <section className={`dash-learner-panel dash-learner-panel--${side}`}>
      <header className="dash-learner-panel-head">
        <div>
          <h3>{title}</h3>
          <span className="dash-learner-panel-count">{count} learner{count === 1 ? '' : 's'}</span>
        </div>
      </header>
      <SearchLearnerInput
        id={searchId}
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      <ul className="dash-learner-panel-list">
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
      </ul>
      {!React.Children.count(children) && (
        <motion.div
          className="dash-learner-panel-empty"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <strong>{emptyTitle}</strong>
          <p>{emptyMessage}</p>
        </motion.div>
      )}
    </section>
  )
}

import React from 'react'

export function DashStatSkeleton({ count = 4, className = '' }) {
  return (
    <div className={`dash-skeleton-stats ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="dash-skeleton-stat dash-skeleton-pulse" />
      ))}
    </div>
  )
}

export function DashCardSkeleton({ count = 3, className = '' }) {
  return (
    <div className={`dash-skeleton-cards ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="dash-skeleton-card dash-skeleton-pulse" />
      ))}
    </div>
  )
}

export function DashListSkeleton({ count = 4, className = '' }) {
  return (
    <ul className={`dash-skeleton-list ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="dash-skeleton-list-item dash-skeleton-pulse" />
      ))}
    </ul>
  )
}

export function DashTableSkeleton({ rows = 5, className = '' }) {
  return (
    <div className={`dash-skeleton-table-wrap ${className}`.trim()} aria-hidden="true">
      <div className="dash-skeleton-table-head dash-skeleton-pulse" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="dash-skeleton-table-row dash-skeleton-pulse" />
      ))}
    </div>
  )
}

export function DashSectionSkeleton({ className = '' }) {
  return (
    <div className={`dash-skeleton-section ${className}`.trim()} aria-busy="true" aria-label="Loading">
      <div className="dash-skeleton-section-head dash-skeleton-pulse" />
      <DashCardSkeleton count={3} />
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { fadeIn, fadeUp, springTab, tabPanel } from '../lib/motion'

export default function DashboardShell({
  variant,
  portal,
  tabs,
  defaultTab,
  notice,
}) {
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(
    () => tabFromUrl || defaultTab || tabs[0]?.id,
  )
  const activePanel = tabs.find((tab) => tab.id === activeTab) || tabs[0]
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (tabFromUrl && tabs.some((t) => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl, tabs])

  return (
    <motion.main
      className={`${variant}-page dash-page`}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className={`${variant}-page-glow dash-page-glow`} aria-hidden="true" />

      <motion.div
        className="dash-fade-section dash-fade-section--hero dash-section--motion"
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        {portal}
      </motion.div>

      <AnimatePresence mode="wait">
        {notice && (
          <motion.div
            key="notice"
            className="dash-notice-wrap"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="dash-layout">
        <motion.aside
          className="dash-sidebar dash-card-lift dash-section--motion"
          aria-label="Dashboard navigation"
          variants={fadeIn}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          <nav className="dash-sidebar-nav">
            <ul className="dash-tab-list">
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id
                return (
                  <li key={tab.id} className="dash-tab-item">
                    <button
                      type="button"
                      className={`dash-tab-btn${
                        isActive ? ' dash-tab-btn--active' : ''
                      }`}
                      style={{ '--dash-tab-delay': `${120 + index * 55}ms` }}
                      onClick={() => setActiveTab(tab.id)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {isActive && !reduceMotion && (
                        <motion.span
                          layoutId={`${variant}-dash-tab-indicator`}
                          className="dash-tab-active-indicator"
                          transition={springTab}
                          aria-hidden="true"
                        />
                      )}
                      <span className="dash-tab-btn-icon" aria-hidden="true">
                        <i className={`fas ${tab.icon}`} />
                      </span>
                      <span className="dash-tab-btn-label">{tab.label}</span>
                      {tab.badge != null && tab.badge !== 0 && (
                        <span className="dash-tab-badge">{tab.badge}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </motion.aside>

        <div className="dash-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="dash-tab-panel dash-section--motion"
              role="tabpanel"
              aria-labelledby={`dash-tab-${activeTab}`}
              variants={tabPanel}
              initial={reduceMotion ? false : 'initial'}
              animate="animate"
              exit={reduceMotion ? undefined : 'exit'}
            >
              {activePanel?.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.main>
  )
}

export function DashSection({ children, className = '', delay = 0, ...props }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className={`dash-fade-section dash-section dash-section--motion ${className}`.trim()}
      style={{ '--dash-section-delay': `${delay}ms` }}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.48,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.section>
  )
}

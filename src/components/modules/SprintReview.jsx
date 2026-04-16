import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ModuleShell from '../shared/ModuleShell'

export default function SprintReview({ module, onComplete }) {
  const stories = module.delivered_stories ?? []
  const [index, setIndex] = useState(0)
  const [decisions, setDecisions] = useState([])

  function decide(storyId, accepted) {
    setDecisions(prev => [...prev, { storyId, accepted }])
    setIndex(prev => prev + 1)
  }

  const current = stories[index]
  const done = index >= stories.length
  const accepted = decisions.filter(d => d.accepted).length
  const rejected = decisions.filter(d => !d.accepted).length

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="sprint-review">
        {!done && current && (
          <>
            <div className="review-progress">
              Story {index + 1} / {stories.length}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.25 }}
                className="review-card"
              >
                <h3 className="review-story-title">{current.title}</h3>
                {current.description && (
                  <p className="review-description">{current.description}</p>
                )}
                <div className="acceptance-criteria">
                  <strong>Critères d'acceptance :</strong>
                  <ul>
                    {(current.acceptance_criteria ?? []).map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
                {current.demo_note && (
                  <div className="demo-note">📽️ {current.demo_note}</div>
                )}
                {current.issues && (
                  <div className="review-issues">⚠️ {current.issues}</div>
                )}
                <div className="review-actions">
                  <button className="reject-btn" onClick={() => decide(current.id, false)}>
                    ✗ Refuser
                  </button>
                  <button className="accept-btn" onClick={() => decide(current.id, true)}>
                    ✓ Accepter
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
        {done && (
          <motion.div
            className="review-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Résumé Sprint Review</h3>
            <div className="review-stats">
              <div className="stat-card accepted">{accepted} acceptées</div>
              <div className="stat-card rejected">{rejected} refusées</div>
            </div>
            {decisions.map(d => {
              const story = stories.find(s => s.id === d.storyId)
              return (
                <div key={d.storyId} className={`decision-row ${d.accepted ? 'accepted' : 'rejected'}`}>
                  {d.accepted ? '✓' : '✗'} {story?.title}
                </div>
              )
            })}
          </motion.div>
        )}
      </div>
    </ModuleShell>
  )
}

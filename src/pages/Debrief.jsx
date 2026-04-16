import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useSessionStore from '../store/sessionStore'
import { scoreTotalSession } from '../engine/scoreEngine'
import { exportSessionPDF } from '../engine/pdfExporter'

const LEVELS = {
  advanced: { label: 'PO Avancé', icon: '🏆', color: '#6366f1' },
  intermediate: { label: 'PO Intermédiaire', icon: '🥈', color: '#f59e0b' },
  junior: { label: 'PO Junior', icon: '🌱', color: '#94a3b8' },
}

function getLevel(percent, thresholds) {
  if (!thresholds) return 'junior'
  if (percent >= (thresholds.advanced?.min_percent ?? 75)) return 'advanced'
  if (percent >= (thresholds.intermediate?.min_percent ?? 40)) return 'intermediate'
  return 'junior'
}

export default function Debrief() {
  const navigate = useNavigate()
  const { currentCase, answers, taskScores, eventAnswers, decisions } = useSessionStore()
  const [exporting, setExporting] = useState(false)

  if (!currentCase) {
    return (
      <div className="error-screen">
        <p>Aucune session trouvée.</p>
        <button onClick={() => navigate('/')}>← Retour à l'accueil</button>
      </div>
    )
  }

  const { earned, max, percent } = scoreTotalSession(currentCase, answers, eventAnswers)
  const thresholds = currentCase.feedback?.success_thresholds
  const level = getLevel(percent, thresholds)
  const badge = LEVELS[level]
  const message = thresholds?.[level]?.message ?? ''

  async function handleExport() {
    setExporting(true)
    try {
      await exportSessionPDF('debrief-export', `bilan-${currentCase.id}-${Date.now()}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="debrief-page">
      <div id="debrief-export">
        <header className="debrief-header">
          <div className="debrief-trophy">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="36" cy="36" r="36" fill="#FAFAFA"/>
              {/* Cup body */}
              <path d="M22 18h28v16c0 8.837-6.268 16-14 16s-14-7.163-14-16V18z" fill="#FEF9C3" stroke="#FDE047" strokeWidth="2"/>
              {/* Handles */}
              <path d="M22 22h-6a4 4 0 000 8h6" stroke="#FDE047" strokeWidth="2" strokeLinecap="round"/>
              <path d="M50 22h6a4 4 0 010 8h-6" stroke="#FDE047" strokeWidth="2" strokeLinecap="round"/>
              {/* Star inside */}
              <text x="36" y="36" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="#CA8A04">★</text>
              {/* Stem */}
              <rect x="32" y="50" width="8" height="8" rx="1" fill="#FDE047"/>
              {/* Base */}
              <rect x="26" y="57" width="20" height="4" rx="2" fill="#FDE047" stroke="#CA8A04" strokeWidth="1"/>
            </svg>
          </div>
          <h1>Bilan de mission</h1>
          <p className="debrief-case">{currentCase.context.company} — {currentCase.title}</p>
        </header>

        <div className="score-section">
          <motion.div
            className="score-circle"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
          >
            <span className="score-percent">{percent}%</span>
            <span className="score-pts">{earned} / {max} pts</span>
          </motion.div>

          <motion.div
            className="badge-block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{ color: badge.color }}
          >
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-label">{badge.label}</div>
            {message && <p className="badge-message">{message}</p>}
          </motion.div>
        </div>

        <div className="module-scores">
          <h2>Score par module</h2>
          {currentCase.modules.map(module => {
            const earned = module.tasks.reduce((sum, t) => sum + (taskScores[t.id] ?? 0), 0)
            const max = module.tasks.reduce((sum, t) => sum + t.points, 0)
            const pct = max > 0 ? Math.round((earned / max) * 100) : 0
            return (
              <motion.div
                key={module.id}
                className="module-score-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="module-score-title">{module.title}</span>
                <span className="module-score-pts">{earned} / {max}</span>
                <div className="module-score-bar">
                  <motion.div
                    className="module-score-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3 }}
                  />
                </div>
                <span className="module-score-pct">{pct}%</span>
              </motion.div>
            )
          })}
        </div>

        <div className="decisions-timeline">
          <h2>Historique de vos décisions ({decisions.length})</h2>
          {decisions.map((d, i) => {
            const isOptimal = d.points === d.maxPoints
            const isPartial = d.points > 0 && !isOptimal
            const statusClass = isOptimal ? 'optimal' : isPartial ? 'partial' : 'wrong'
            return (
              <div key={i} className={`decision-item ${statusClass}`}>
                <div className="decision-type">{d.type === 'event' ? '⚡' : '📝'}</div>
                <div className="decision-content">
                  <div className="decision-score">{d.points} / {d.maxPoints ?? '?'} pts</div>
                  {d.rationale && <p className="decision-rationale">{d.rationale}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="debrief-actions">
        <button className="export-btn" onClick={handleExport} disabled={exporting}>
          {exporting ? '⏳ Export en cours…' : '📄 Exporter en PDF'}
        </button>
        <button className="restart-btn" onClick={() => navigate('/')}>
          🔄 Nouvelle mission
        </button>
      </div>
    </div>
  )
}

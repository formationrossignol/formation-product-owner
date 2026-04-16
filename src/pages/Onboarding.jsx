import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { loadCase } from '../engine/caseLoader'
import useSessionStore from '../store/sessionStore'
import PersonaCard from '../components/shared/PersonaCard'
import KpiDashboard from '../components/shared/KpiDashboard'

const STEPS = ['company', 'context', 'personas', 'kpis', 'start']
const STEP_LABELS = ['Entreprise', 'Mission', 'Équipe', 'KPIs', 'Départ']

export default function Onboarding() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const setCase = useSessionStore(s => s.setCase)
  const [caseData, setCaseData] = useState(null)
  const [step, setStep] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCase(caseId)
      .then(data => { setCaseData(data); setCase(data) })
      .catch(err => setError(err.message))
  }, [caseId])

  if (error) return (
    <div className="error-screen">
      <h2>Erreur de chargement</h2>
      <p>{error}</p>
      <button onClick={() => navigate('/')}>← Retour</button>
    </div>
  )

  if (!caseData) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p>Chargement de la mission…</p>
    </div>
  )

  const currentStep = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="onboarding">
      <div className="onboarding-stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`stepper-item ${i <= step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
            <div className="stepper-dot">{i < step ? '✓' : i + 1}</div>
            <span className="stepper-label">{STEP_LABELS[i]}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="onboarding-step"
        >
          {currentStep === 'company' && (
            <div className="step-company">
              <motion.div
                className="company-logo-big"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {caseData.context.company[0]}
              </motion.div>
              <h1>{caseData.context.company}</h1>
              <div className="company-meta">
                <span className="company-industry">{caseData.context.industry}</span>
              </div>
              <p className="company-role">Votre rôle : <strong>{caseData.context.role}</strong></p>
            </div>
          )}

          {currentStep === 'context' && (
            <div className="step-context">
              <h2>Votre mission</h2>
              <p className="context-summary">{caseData.context.summary}</p>
              <div className="context-goal">
                <span className="goal-label">🎯 Objectif business</span>
                <p>{caseData.context.business_goal}</p>
              </div>
              <div className="context-constraints">
                <span className="constraints-label">⚠️ Contraintes</span>
                <ul>
                  {caseData.context.constraints?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          )}

          {currentStep === 'personas' && (
            <div className="step-personas">
              <h2>Équipe & Parties prenantes</h2>
              <p className="step-subtitle">Cliquez sur une carte pour en savoir plus</p>
              <div className="personas-grid">
                {caseData.personas?.map(p => <PersonaCard key={p.id} persona={p} />)}
              </div>
            </div>
          )}

          {currentStep === 'kpis' && (
            <div className="step-kpis">
              <h2>État des indicateurs — Jour 1</h2>
              <p className="step-subtitle">Ce sont les métriques que vous devrez améliorer</p>
              <KpiDashboard kpis={caseData.kpis} />
            </div>
          )}

          {currentStep === 'start' && (
            <div className="step-start">
              <motion.div
                className="start-icon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 150 }}
              >
                🚀
              </motion.div>
              <h2>Prêt à démarrer ?</h2>
              <p>
                Vous allez traverser <strong>{caseData.modules?.length} modules</strong> et prendre
                des décisions critiques qui impacteront les KPIs de {caseData.context.company}.
              </p>
              <ul className="start-reminders">
                <li>Lisez attentivement les documents disponibles</li>
                <li>Justifiez vos choix avec les données</li>
                <li>Réagissez aux événements imprévus</li>
              </ul>
              <button
                className="start-btn"
                onClick={() => navigate(`/workspace/${caseId}`)}
              >
                Commencer la mission →
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="onboarding-nav">
        {step > 0 && (
          <button className="nav-btn-ob prev" onClick={() => setStep(s => s - 1)}>← Précédent</button>
        )}
        {!isLast && (
          <button className="nav-btn-ob next" onClick={() => setStep(s => s + 1)}>Suivant →</button>
        )}
      </div>
    </div>
  )
}

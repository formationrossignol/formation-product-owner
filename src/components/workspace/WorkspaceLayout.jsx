import { useState } from 'react'
import { ChevronDown, Check, Lock } from 'lucide-react'
import Navbar from './Navbar'
import Inbox from './Inbox'
import KpiDashboard from '../shared/KpiDashboard'
import PersonaCard from '../shared/PersonaCard'
import ConfirmModal from '../shared/ConfirmModal'

export default function WorkspaceLayout({
  caseData,
  completedCount,
  children,
  modules,
  completedModuleIds,
  currentModuleTitle,
  reviewingModuleId,
  onSelectModule,
  onGoHome,
}) {
  const [activeTab, setActiveTab] = useState('module')
  const [showModuleNav, setShowModuleNav] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const inbox = caseData.inbox ?? []
  const totalModules = modules?.length ?? caseData.modules?.length ?? 0
  const isReviewing = reviewingModuleId != null

  const displayedModuleNumber = isReviewing
    ? (modules?.findIndex(m => m.id === reviewingModuleId) ?? 0) + 1
    : completedCount + 1

  return (
    <div className="workspace-layout">
      <Navbar
        company={caseData.context.company}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inboxCount={inbox.length}
        onGoHome={() => setShowConfirm(true)}
      />

      <div className="workspace-body">
        {isReviewing && (
          <div className="review-banner">
            <span className="review-banner-text">
              📖 Mode révision — module {displayedModuleNumber} sur {totalModules}
            </span>
            <button className="review-back-btn" onClick={() => onSelectModule(null)}>
              Retour au module actif →
            </button>
          </div>
        )}

        <div className="workspace-topbar">
          <div className="ws-breadcrumb">
            <span className="ws-company">{caseData.context.company}</span>
            <span className="ws-sep">/</span>
            <span className="ws-page">
              {activeTab === 'module'   && (currentModuleTitle || 'Module en cours')}
              {activeTab === 'kpis'     && 'Tableau de bord KPIs'}
              {activeTab === 'inbox'    && 'Inbox'}
              {activeTab === 'personas' && 'Équipe & Parties prenantes'}
            </span>
          </div>

          <div className="ws-module-nav">
            <button
              className="ws-module-badge"
              onClick={() => setShowModuleNav(v => !v)}
            >
              Module {displayedModuleNumber} / {totalModules}
              <ChevronDown size={12} />
            </button>

            {showModuleNav && (
              <>
                <div className="module-nav-overlay" onClick={() => setShowModuleNav(false)} />
                <div className="module-nav-dropdown">
                  <div className="module-nav-header">Modules de la mission</div>
                  {modules?.map((mod, i) => {
                    const isDone = completedModuleIds?.includes(mod.id)
                    const isCurrent = !isDone && i === completedCount
                    const isReviewingThis = reviewingModuleId === mod.id
                    const isLocked = !isDone && !isCurrent
                    return (
                      <div
                        key={mod.id}
                        className={[
                          'module-nav-item',
                          isDone ? 'is-done' : '',
                          isCurrent ? 'is-current' : '',
                          isDone ? 'clickable' : '',
                          isReviewingThis ? 'is-reviewing' : '',
                        ].filter(Boolean).join(' ')}
                        onClick={() => {
                          if (isDone) {
                            onSelectModule(mod.id)
                            setShowModuleNav(false)
                          }
                        }}
                      >
                        <div className="module-nav-num">
                          {isDone ? <Check size={11} strokeWidth={3} /> : i + 1}
                        </div>
                        <span className="module-nav-title">{mod.title}</span>
                        {isLocked && <Lock size={11} className="module-nav-lock" />}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <main className="workspace-main">
          {activeTab === 'module' && children}

          {activeTab === 'kpis' && (
            <div className="tab-content">
              <h2>Tableau de bord KPIs</h2>
              <KpiDashboard
                kpis={caseData.kpis}
                analyticsData={caseData.datasets?.analytics}
              />
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="tab-content">
              <h2>Inbox</h2>
              <Inbox messages={inbox} />
            </div>
          )}

          {activeTab === 'personas' && (
            <div className="tab-content">
              <h2>Équipe & Parties prenantes</h2>
              <div className="personas-grid">
                {caseData.personas?.map(p => <PersonaCard key={p.id} persona={p} />)}
              </div>
            </div>
          )}
        </main>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Quitter la mission ?"
          message="Votre progression est sauvegardée et vous pourrez reprendre cette mission plus tard."
          confirmLabel="Retour aux missions"
          onConfirm={() => { setShowConfirm(false); onGoHome() }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}

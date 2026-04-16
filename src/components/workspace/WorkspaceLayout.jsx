import { useState } from 'react'
import Navbar from './Navbar'
import Inbox from './Inbox'
import KpiDashboard from '../shared/KpiDashboard'
import PersonaCard from '../shared/PersonaCard'

export default function WorkspaceLayout({ caseData, completedCount, children }) {
  const [activeTab, setActiveTab] = useState('module')
  const inbox = caseData.inbox ?? []
  const totalModules = caseData.modules?.length ?? 0

  return (
    <div className="workspace-layout">
      <Navbar
        company={caseData.context.company}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inboxCount={inbox.length}
      />
      <div className="workspace-body">
        <div className="workspace-topbar">
          <div className="ws-breadcrumb">
            <span className="ws-company">{caseData.context.company}</span>
            <span className="ws-sep">/</span>
            <span className="ws-page">
              {activeTab === 'module'   && 'Module en cours'}
              {activeTab === 'kpis'     && 'Tableau de bord KPIs'}
              {activeTab === 'inbox'    && 'Inbox'}
              {activeTab === 'personas' && 'Équipe & Parties prenantes'}
            </span>
          </div>
          <div className="ws-badge">
            Module {completedCount + 1} / {totalModules}
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
    </div>
  )
}

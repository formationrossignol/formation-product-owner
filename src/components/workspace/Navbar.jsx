import { LayoutGrid, LineChart, Inbox, Users, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'module',   Icon: LayoutGrid, color: 'var(--c-module)',  label: 'Module'  },
  { id: 'kpis',     Icon: LineChart,  color: 'var(--c-kpi)',     label: 'KPIs'    },
  { id: 'inbox',    Icon: Inbox,      color: 'var(--c-inbox)',   label: 'Inbox'   },
  { id: 'personas', Icon: Users,      color: 'var(--c-team)',    label: 'Équipe'  },
]

export default function Navbar({ company, activeTab, onTabChange, inboxCount, onGoHome }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo" title={company}>
        {company?.[0] ?? 'P'}
      </div>

      <div className="sidebar-sep" />

      {NAV_ITEMS.map(({ id, Icon, color, label }) => {
        const isActive = activeTab === id
        const showBadge = id === 'inbox' && inboxCount > 0
        return (
          <button
            key={id}
            className={`nav-btn ${isActive ? 'active' : ''}`}
            style={{ '--nav-color': color }}
            onClick={() => onTabChange(id)}
            title={label}
            aria-label={label}
          >
            <Icon size={18} strokeWidth={1.75} />
            {showBadge && (
              <span className="nav-badge">{inboxCount}</span>
            )}
          </button>
        )
      })}

      <div style={{ flex: 1 }} />
      <div className="sidebar-sep" />

      <button
        className="nav-btn"
        style={{ '--nav-color': 'var(--danger)' }}
        onClick={onGoHome}
        title="Quitter la mission"
        aria-label="Quitter la mission"
      >
        <LogOut size={18} strokeWidth={1.75} />
      </button>
    </nav>
  )
}

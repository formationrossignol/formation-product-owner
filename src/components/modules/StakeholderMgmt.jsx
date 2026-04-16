import { useState } from 'react'
import ModuleShell from '../shared/ModuleShell'

const PRIORITY_STYLES = {
  high: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: '🔴 Haute' },
  medium: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: '🟡 Moyenne' },
  low: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', label: '🟢 Basse' },
}

export default function StakeholderMgmt({ module, onComplete }) {
  const messages = module.stakeholder_messages ?? []
  const [read, setRead] = useState(new Set())
  const unreadCount = messages.length - read.size

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="stakeholder-panel">
        <div className="stakeholder-header">
          <h3>Messages des parties prenantes</h3>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} non lu{unreadCount > 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="stakeholder-messages">
          {messages.map((msg, i) => {
            const style = PRIORITY_STYLES[msg.priority] ?? PRIORITY_STYLES.medium
            const isRead = read.has(i)
            return (
              <div
                key={i}
                className={`stakeholder-message ${isRead ? 'read' : 'unread'}`}
                style={{ borderLeft: `3px solid ${style.color}` }}
                onClick={() => setRead(prev => new Set([...prev, i]))}
              >
                <div className="msg-header">
                  <strong>{msg.from}</strong>
                  <span className="priority-tag" style={{ color: style.color, background: style.bg }}>
                    {style.label}
                  </span>
                </div>
                <div className="msg-subject">{msg.subject}</div>
                {isRead && msg.body && (
                  <div className="msg-body">
                    <p>{msg.body}</p>
                    {msg.demand && (
                      <div className="msg-demand">
                        <strong>Demande :</strong> {msg.demand}
                      </div>
                    )}
                  </div>
                )}
                {!isRead && <span className="read-hint">Cliquer pour lire</span>}
              </div>
            )
          })}
        </div>
      </div>
    </ModuleShell>
  )
}

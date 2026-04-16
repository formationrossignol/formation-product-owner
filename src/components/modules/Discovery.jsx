import { useState } from 'react'
import ModuleShell from '../shared/ModuleShell'

export default function Discovery({ module, onComplete }) {
  const interviews = module.interviews ?? []
  const analytics = module.analytics_highlights ?? []
  const hasData = interviews.length > 0 || analytics.length > 0
  const defaultTab = interviews.length > 0 ? 'interviews' : 'analytics'
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [activeInterview, setActiveInterview] = useState(null)

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      {hasData && (
        <div className="discovery-panel">
          <div className="discovery-tabs">
            {interviews.length > 0 && (
              <button
                className={`disc-tab ${activeTab === 'interviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('interviews')}
              >
                🎤 Interviews ({interviews.length})
              </button>
            )}
            {analytics.length > 0 && (
              <button
                className={`disc-tab ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                📊 Analytics ({analytics.length})
              </button>
            )}
          </div>

          {activeTab === 'interviews' && interviews.length > 0 && (
            <div className="interviews-layout">
              <div className="interview-list">
                {interviews.map((interview, i) => (
                  <div
                    key={i}
                    className={`interview-card ${activeInterview === i ? 'active' : ''}`}
                    onClick={() => setActiveInterview(i)}
                  >
                    <div className="interview-persona">👤 {interview.persona_id}</div>
                    <p className="interview-preview">{interview.excerpt.slice(0, 100)}…</p>
                  </div>
                ))}
              </div>
              {activeInterview !== null && (
                <div className="interview-detail">
                  <blockquote className="interview-quote">
                    "{interviews[activeInterview].excerpt}"
                  </blockquote>
                  {interviews[activeInterview].key_insight && (
                    <div className="interview-insight">
                      💡 <strong>Insight clé :</strong> {interviews[activeInterview].key_insight}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && analytics.length > 0 && (
            <div className="analytics-highlights">
              {analytics.map((item, i) => (
                <div key={i} className="analytics-card">
                  <div className="analytics-metric">{item.metric}</div>
                  <div className="analytics-value">{item.value}</div>
                  <p className="analytics-insight">{item.insight}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ModuleShell>
  )
}

import { useState } from 'react'
import ModuleShell from '../shared/ModuleShell'

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']
const THEME_COLORS = {
  strategy: '#6366f1',
  tech: '#f59e0b',
  growth: '#22c55e',
  ux: '#ec4899',
  default: '#94a3b8',
}

export default function RoadmapPlanning({ module, onComplete }) {
  const features = module.features ?? []
  const featureMap = Object.fromEntries(features.map(f => [f.id, f]))
  const [quarters, setQuarters] = useState({
    Q1: [], Q2: [], Q3: [], Q4: [],
    backlog: features.map(f => f.id),
  })
  const [dragging, setDragging] = useState(null)

  function handleDrop(e, target) {
    e.preventDefault()
    if (!dragging) return
    const src = Object.keys(quarters).find(q => quarters[q].includes(dragging))
    if (!src || src === target) { setDragging(null); return }
    setQuarters(prev => ({
      ...prev,
      [src]: prev[src].filter(id => id !== dragging),
      [target]: [...prev[target], dragging],
    }))
    setDragging(null)
  }

  function FeatureChip({ id }) {
    const f = featureMap[id]
    if (!f) return null
    return (
      <div
        className="roadmap-chip"
        style={{ background: THEME_COLORS[f.theme] ?? THEME_COLORS.default }}
        draggable
        onDragStart={() => setDragging(id)}
      >
        {f.title}
        {f.effort && <span className="chip-effort">{f.effort}sp</span>}
      </div>
    )
  }

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="roadmap-layout">
        <div className="roadmap-quarters">
          {QUARTERS.map(q => (
            <div
              key={q}
              className="roadmap-quarter"
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, q)}
            >
              <div className="quarter-header">{q}</div>
              <div className="quarter-features">
                {quarters[q].map(id => <FeatureChip key={id} id={id} />)}
                {quarters[q].length === 0 && (
                  <div className="quarter-empty">Déposez ici</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          className="roadmap-backlog"
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop(e, 'backlog')}
        >
          <h4>Backlog ({quarters.backlog.length})</h4>
          {quarters.backlog.map(id => <FeatureChip key={id} id={id} />)}
        </div>
        <div className="roadmap-legend">
          {Object.entries(THEME_COLORS).filter(([k]) => k !== 'default').map(([theme, color]) => (
            <span key={theme} className="legend-item">
              <span className="legend-dot" style={{ background: color }} />
              {theme}
            </span>
          ))}
        </div>
      </div>
    </ModuleShell>
  )
}

import { useState } from 'react'
import ModuleShell from '../shared/ModuleShell'

export default function CompetitiveAnalysis({ module, onComplete }) {
  const competitors = module.competitors ?? []
  const [positions, setPositions] = useState({})
  const [dragging, setDragging] = useState(null)

  function handleDrop(e, quadrant) {
    e.preventDefault()
    if (!dragging) return
    setPositions(prev => ({ ...prev, [dragging]: quadrant }))
    setDragging(null)
  }

  const quadrants = [
    { id: 'top-left', label: 'Coût élevé\nPeu de features', x: 0, y: 0 },
    { id: 'top-right', label: 'Coût élevé\nBeaucoup de features', x: 1, y: 0 },
    { id: 'bottom-left', label: 'Coût faible\nPeu de features', x: 0, y: 1 },
    { id: 'bottom-right', label: 'Coût faible\nBeaucoup de features', x: 1, y: 1 },
  ]

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="competitive-layout">
        <div className="competitive-matrix">
          <div className="matrix-y-label">↑ Coût élevé</div>
          <div className="matrix-grid">
            {quadrants.map(q => (
              <div
                key={q.id}
                className="matrix-quadrant"
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, q.id)}
              >
                <div className="quadrant-label">{q.label}</div>
                <div className="quadrant-chips">
                  {competitors
                    .filter(c => positions[c.id] === q.id)
                    .map(c => (
                      <div
                        key={c.id}
                        className="competitor-chip placed"
                        draggable
                        onDragStart={() => setDragging(c.id)}
                      >
                        {c.name}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="matrix-x-label">→ Beaucoup de features</div>
        </div>

        <div className="competitors-bank">
          <h4>Concurrents à positionner</h4>
          {competitors
            .filter(c => !positions[c.id])
            .map(c => (
              <div
                key={c.id}
                className="competitor-card-bank"
                draggable
                onDragStart={() => setDragging(c.id)}
              >
                <strong>{c.name}</strong>
                <p>{c.description}</p>
              </div>
            ))}
          {competitors.every(c => positions[c.id]) && (
            <p className="all-placed">✓ Tous les concurrents sont positionnés</p>
          )}
        </div>
      </div>
    </ModuleShell>
  )
}

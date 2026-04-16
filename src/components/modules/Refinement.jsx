import { useState } from 'react'
import ModuleShell from '../shared/ModuleShell'

const SIZES = [
  { id: 'XS', points: 1, color: '#22c55e' },
  { id: 'S', points: 2, color: '#84cc16' },
  { id: 'M', points: 5, color: '#f59e0b' },
  { id: 'L', points: 8, color: '#f97316' },
  { id: 'XL', points: 13, color: '#ef4444' },
]

export default function Refinement({ module, onComplete }) {
  const stories = module.stories ?? []
  const storyMap = Object.fromEntries(stories.map(s => [s.id, s]))
  const [buckets, setBuckets] = useState({
    unestimated: stories.map(s => s.id),
    XS: [], S: [], M: [], L: [], XL: [],
  })
  const [dragging, setDragging] = useState(null)

  function handleDrop(e, target) {
    e.preventDefault()
    if (!dragging) return
    const src = Object.keys(buckets).find(b => buckets[b].includes(dragging))
    if (!src || src === target) { setDragging(null); return }
    setBuckets(prev => ({
      ...prev,
      [src]: prev[src].filter(id => id !== dragging),
      [target]: [...prev[target], dragging],
    }))
    setDragging(null)
  }

  const totalEstimated = SIZES.reduce((sum, s) => sum + buckets[s.id].length, 0)

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="refinement-board">
        <div
          className="unestimated-pool"
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop(e, 'unestimated')}
        >
          <h4>À estimer ({buckets.unestimated.length})</h4>
          <div className="story-chips">
            {buckets.unestimated.map(id => (
              <div
                key={id}
                className="story-chip"
                draggable
                onDragStart={() => setDragging(id)}
              >
                {storyMap[id]?.title ?? id}
              </div>
            ))}
            {buckets.unestimated.length === 0 && (
              <p className="pool-empty">✓ Toutes les stories sont estimées</p>
            )}
          </div>
        </div>

        <div className="size-buckets">
          {SIZES.map(size => (
            <div
              key={size.id}
              className="size-bucket"
              style={{ borderTop: `3px solid ${size.color}` }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, size.id)}
            >
              <div className="size-header">
                <span className="size-label" style={{ color: size.color }}>{size.id}</span>
                <span className="size-points">{size.points} pts</span>
              </div>
              <div className="bucket-stories">
                {buckets[size.id].map(id => (
                  <div
                    key={id}
                    className="bucket-story"
                    draggable
                    onDragStart={() => setDragging(id)}
                  >
                    {storyMap[id]?.title ?? id}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="refinement-summary">
          {totalEstimated}/{stories.length} stories estimées
        </div>
      </div>
    </ModuleShell>
  )
}

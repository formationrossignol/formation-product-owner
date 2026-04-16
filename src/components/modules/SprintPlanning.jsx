import { useState } from 'react'
import ModuleShell from '../shared/ModuleShell'

const THEME_COLORS = { strategy: '#6366f1', tech: '#f59e0b', growth: '#22c55e', ux: '#ec4899', bug: '#ef4444', default: '#94a3b8' }

export default function SprintPlanning({ module, onComplete }) {
  const stories = module.stories ?? []
  const capacity = module.capacity ?? 40
  const storyMap = Object.fromEntries(stories.map(s => [s.id, s]))
  const [sprintIds, setSprintIds] = useState([])
  const [backlogIds, setBacklogIds] = useState(stories.map(s => s.id))
  const [dragging, setDragging] = useState(null)

  const sprintPoints = sprintIds.reduce((sum, id) => sum + (storyMap[id]?.points ?? 0), 0)
  const overflow = sprintPoints > capacity
  const utilizationPct = Math.min(100, Math.round((sprintPoints / capacity) * 100))

  function moveToSprint(id) {
    setBacklogIds(p => p.filter(x => x !== id))
    setSprintIds(p => [...p, id])
  }

  function moveToBacklog(id) {
    setSprintIds(p => p.filter(x => x !== id))
    setBacklogIds(p => [...p, id])
  }

  function handleDrop(e, target) {
    e.preventDefault()
    if (!dragging) return
    if (target === 'sprint' && backlogIds.includes(dragging)) moveToSprint(dragging)
    if (target === 'backlog' && sprintIds.includes(dragging)) moveToBacklog(dragging)
    setDragging(null)
  }

  function StoryCard({ id, inSprint }) {
    const s = storyMap[id]
    if (!s) return null
    return (
      <div
        className="sprint-story-card"
        style={{ borderLeft: `3px solid ${THEME_COLORS[s.theme] ?? THEME_COLORS.default}` }}
        draggable
        onDragStart={() => setDragging(id)}
        onClick={() => inSprint ? moveToBacklog(id) : moveToSprint(id)}
        title={inSprint ? 'Cliquer pour retirer du sprint' : 'Cliquer pour ajouter au sprint'}
      >
        <div className="card-title">{s.title}</div>
        <div className="card-meta">
          <span className="card-points">{s.points} pts</span>
          <span className="card-theme">{s.theme}</span>
        </div>
        {s.priority && <span className="card-priority">{s.priority}</span>}
      </div>
    )
  }

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="sprint-planning-board">
        <div
          className="backlog-zone"
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop(e, 'backlog')}
        >
          <h4>Backlog ({backlogIds.length} stories)</h4>
          <p className="zone-hint">Cliquez ou glissez vers le sprint →</p>
          {backlogIds.map(id => <StoryCard key={id} id={id} inSprint={false} />)}
        </div>

        <div
          className={`sprint-zone ${overflow ? 'overflow' : ''}`}
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop(e, 'sprint')}
        >
          <div className="sprint-zone-header">
            <h4>Sprint 1</h4>
            <div className="capacity-gauge">
              <div className="gauge-bar">
                <div
                  className={`gauge-fill ${overflow ? 'overflow' : ''}`}
                  style={{ width: `${utilizationPct}%` }}
                />
              </div>
              <span className={`gauge-label ${overflow ? 'overflow' : ''}`}>
                {sprintPoints} / {capacity} pts {overflow && '⚠️ Surcharge !'}
              </span>
            </div>
          </div>
          <p className="zone-hint">← Cliquez ou glissez depuis le backlog</p>
          {sprintIds.map(id => <StoryCard key={id} id={id} inSprint={true} />)}
          {sprintIds.length === 0 && <div className="sprint-empty">Sprint vide</div>}
        </div>
      </div>
    </ModuleShell>
  )
}

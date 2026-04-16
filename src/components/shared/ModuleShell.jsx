import { useState } from 'react'
import ArtifactPanel from './ArtifactPanel'
import TaskRenderer from '../tasks/TaskRenderer'
import TaskResult from '../tasks/TaskResult'
import GlossaryText from './GlossaryText'
import useSessionStore from '../../store/sessionStore'

const MODULE_ICONS = {
  okr_setting:          { emoji: '🎯', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  competitive_analysis: { emoji: '🔍', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  roadmap_planning:     { emoji: '🗺️', color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  discovery:            { emoji: '🎤', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  story_writing:        { emoji: '✍️', color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
  refinement:           { emoji: '⚖️', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  sprint_planning:      { emoji: '🏃', color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
  sprint_review:        { emoji: '✅', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  kpi_analysis:         { emoji: '📊', color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)' },
  stakeholder_mgmt:     { emoji: '👥', color: '#A855F7', bg: 'rgba(168,85,247,0.1)' },
  release_communication:{ emoji: '🚀', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  prioritization:       { emoji: '🏆', color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
}

export default function ModuleShell({ module, children, onComplete }) {
  const { answers, taskScores, submitAnswer } = useSessionStore()
  const [showDebrief, setShowDebrief] = useState(false)

  const tasksWithModuleId = (module.tasks ?? []).map(t => ({ ...t, moduleId: module.id }))
  const allAnswered = tasksWithModuleId.length > 0 && tasksWithModuleId.every(t => answers[t.id] !== undefined)

  const moduleEarned = tasksWithModuleId.reduce((sum, t) => sum + (taskScores[t.id] ?? 0), 0)
  const moduleMax = tasksWithModuleId.reduce((sum, t) => sum + t.points, 0)

  const icon = MODULE_ICONS[module.type]

  return (
    <div className="module-shell">
      <div className="module-header">
        {icon && (
          <div
            className="illus-module-icon"
            style={{ background: icon.bg, fontSize: 22 }}
            aria-hidden="true"
          >
            {icon.emoji}
          </div>
        )}
        <h2 className="module-title"><GlossaryText>{module.title}</GlossaryText></h2>
        {module.objectives?.length > 0 && (
          <ul className="module-objectives">
            {module.objectives.map((o, i) => <li key={i}><GlossaryText>{o}</GlossaryText></li>)}
          </ul>
        )}
      </div>

      <ArtifactPanel artifacts={module.artifacts} />

      {module.instructions && (
        <div className="module-instructions">
          <p><GlossaryText>{module.instructions}</GlossaryText></p>
        </div>
      )}

      {children}

      {tasksWithModuleId.length > 0 && (
        <div className="module-tasks">
          {tasksWithModuleId.map(task => (
            <div key={task.id} className="task-wrapper">
              <TaskRenderer
                task={task}
                onAnswer={(t, answer) => submitAnswer(t, answer)}
                answered={answers[task.id]}
              />
              {answers[task.id] !== undefined && (
                <TaskResult task={task} answer={answers[task.id]} score={taskScores[task.id] ?? 0} />
              )}
            </div>
          ))}
        </div>
      )}

      {allAnswered && !showDebrief && (
        <div className="module-score-preview">
          <span>{moduleEarned} / {moduleMax} pts sur ce module</span>
          <button className="complete-btn" onClick={() => setShowDebrief(true)}>
            Terminer le module →
          </button>
        </div>
      )}

      {showDebrief && (
        <div className="module-debrief">
          <h3>Bilan du module</h3>
          <p><GlossaryText>{module.debrief}</GlossaryText></p>
          <button className="next-btn" onClick={() => onComplete(module.id)}>
            Module suivant →
          </button>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import ArtifactPanel from './ArtifactPanel'
import TaskRenderer from '../tasks/TaskRenderer'
import TaskResult from '../tasks/TaskResult'
import GlossaryText from './GlossaryText'
import useSessionStore from '../../store/sessionStore'

export default function ModuleShell({ module, children, onComplete }) {
  const { answers, taskScores, submitAnswer } = useSessionStore()
  const [showDebrief, setShowDebrief] = useState(false)

  const tasksWithModuleId = (module.tasks ?? []).map(t => ({ ...t, moduleId: module.id }))
  const allAnswered = tasksWithModuleId.length > 0 && tasksWithModuleId.every(t => answers[t.id] !== undefined)

  const moduleEarned = tasksWithModuleId.reduce((sum, t) => sum + (taskScores[t.id] ?? 0), 0)
  const moduleMax = tasksWithModuleId.reduce((sum, t) => sum + t.points, 0)

  return (
    <div className="module-shell">
      <div className="module-header">
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

import GlossaryText from '../shared/GlossaryText'

export default function TaskResult({ task, score }) {
  const isMax = score === task.points
  const isZero = score === 0
  const statusClass = isMax ? 'correct' : isZero ? 'wrong' : 'partial'
  const icon = isMax ? '✅' : isZero ? '❌' : '⚠️'

  return (
    <div className={`task-result ${statusClass}`}>
      <div className="result-header">
        <span className="result-icon">{icon}</span>
        <span className="result-score">{score} / {task.points} pts</span>
      </div>
      {task.rationale && (
        <div className="result-rationale">
          <strong>Explication :</strong> <GlossaryText>{task.rationale}</GlossaryText>
        </div>
      )}
    </div>
  )
}

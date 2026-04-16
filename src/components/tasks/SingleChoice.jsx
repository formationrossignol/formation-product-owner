import GlossaryText from '../shared/GlossaryText'

export default function SingleChoice({ task, onAnswer, disabled }) {
  return (
    <div className="task-single-choice">
      <p className="task-label"><GlossaryText>{task.label}</GlossaryText></p>
      {task.hint && <p className="task-hint">💡 <GlossaryText>{task.hint}</GlossaryText></p>}
      <div className="options">
        {task.options.map(opt => (
          <button
            key={opt.id}
            className="option-btn"
            disabled={disabled}
            onClick={() => onAnswer(task, opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

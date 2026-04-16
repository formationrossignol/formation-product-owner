import { useState } from 'react'
import GlossaryText from '../shared/GlossaryText'

export default function MultiSelect({ task, onAnswer, disabled }) {
  const [selected, setSelected] = useState([])

  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="task-multi-select">
      <p className="task-label"><GlossaryText>{task.label}</GlossaryText></p>
      {task.hint && <p className="task-hint">💡 <GlossaryText>{task.hint}</GlossaryText></p>}
      <div className="options">
        {task.options.map(opt => (
          <button
            key={opt.id}
            className={`option-btn ${selected.includes(opt.id) ? 'selected' : ''}`}
            disabled={disabled}
            onClick={() => !disabled && toggle(opt.id)}
          >
            {selected.includes(opt.id) ? '✓ ' : ''}{opt.label}
          </button>
        ))}
      </div>
      <button
        className="submit-btn"
        disabled={disabled || selected.length === 0}
        onClick={() => onAnswer(task, selected)}
      >
        Valider la sélection
      </button>
    </div>
  )
}

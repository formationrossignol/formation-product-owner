import { useState } from 'react'
import GlossaryText from '../shared/GlossaryText'

export default function NumericInput({ task, onAnswer, disabled }) {
  const [value, setValue] = useState('')

  return (
    <div className="task-numeric">
      <p className="task-label"><GlossaryText>{task.label}</GlossaryText></p>
      {task.hint && <p className="task-hint">💡 <GlossaryText>{task.hint}</GlossaryText></p>}
      <div className="numeric-input-row">
        <input
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={disabled}
          placeholder="Entrez une valeur..."
        />
        {task.unit && <span className="unit">{task.unit}</span>}
      </div>
      <button
        className="submit-btn"
        disabled={disabled || value === ''}
        onClick={() => onAnswer(task, parseFloat(value))}
      >
        Valider
      </button>
    </div>
  )
}

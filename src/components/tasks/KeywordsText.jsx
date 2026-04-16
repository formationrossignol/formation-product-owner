import { useState } from 'react'
import GlossaryText from '../shared/GlossaryText'

export default function KeywordsText({ task, onAnswer, disabled }) {
  const [text, setText] = useState('')

  return (
    <div className="task-keywords">
      <p className="task-label"><GlossaryText>{task.label}</GlossaryText></p>
      {task.hint && <p className="task-hint">💡 <GlossaryText>{task.hint}</GlossaryText></p>}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={disabled}
        rows={5}
        placeholder="Rédigez votre réponse..."
      />
      <div className="char-count">{text.length} caractères</div>
      <button
        className="submit-btn"
        disabled={disabled || text.trim().length < 10}
        onClick={() => onAnswer(task, text)}
      >
        Valider
      </button>
    </div>
  )
}

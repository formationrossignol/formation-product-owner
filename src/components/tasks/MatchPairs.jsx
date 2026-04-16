import { useState } from 'react'
import GlossaryText from '../shared/GlossaryText'

export default function MatchPairs({ task, onAnswer, disabled }) {
  const [pairs, setPairs] = useState({})
  const [activeLeft, setActiveLeft] = useState(null)

  function selectLeft(id) {
    if (disabled) return
    setActiveLeft(prev => prev === id ? null : id)
  }

  function selectRight(id) {
    if (disabled || !activeLeft) return
    setPairs(prev => ({ ...prev, [activeLeft]: id }))
    setActiveLeft(null)
  }

  function clearPair(leftId) {
    if (disabled) return
    setPairs(prev => { const n = { ...prev }; delete n[leftId]; return n })
  }

  const allPaired = task.left?.every(l => pairs[l.id])

  return (
    <div className="task-match-pairs">
      <p className="task-label"><GlossaryText>{task.label}</GlossaryText></p>
      {task.hint && <p className="task-hint">💡 <GlossaryText>{task.hint}</GlossaryText></p>}
      <p className="match-instruction">Cliquez un élément de gauche, puis son correspondant à droite</p>
      <div className="pairs-container">
        <div className="left-col">
          {task.left?.map(item => (
            <div key={item.id} className="pair-row">
              <button
                className={`pair-btn ${activeLeft === item.id ? 'active' : ''} ${pairs[item.id] ? 'paired' : ''}`}
                onClick={() => pairs[item.id] ? clearPair(item.id) : selectLeft(item.id)}
                disabled={disabled}
              >
                {item.label}
              </button>
              {pairs[item.id] && (
                <span className="pair-arrow">→ {task.right?.find(r => r.id === pairs[item.id])?.label}</span>
              )}
            </div>
          ))}
        </div>
        <div className="right-col">
          {task.right?.map(item => (
            <button
              key={item.id}
              className={`pair-btn ${Object.values(pairs).includes(item.id) ? 'paired' : ''}`}
              onClick={() => selectRight(item.id)}
              disabled={disabled}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <button
        className="submit-btn"
        disabled={disabled || !allPaired}
        onClick={() => onAnswer(task, pairs)}
      >
        Valider les associations
      </button>
    </div>
  )
}

import { useState } from 'react'

export default function PersonaCard({ persona, onClick }) {
  const [expanded, setExpanded] = useState(false)

  function handleClick() {
    setExpanded(e => !e)
    onClick?.()
  }

  return (
    <div className={`persona-card ${expanded ? 'expanded' : ''}`} onClick={handleClick} role="button" tabIndex={0}>
      <div className="persona-header">
        <div className="persona-avatar">{persona.avatar}</div>
        <div className="persona-info">
          <strong>{persona.name}</strong>
          <span>{persona.role}</span>
        </div>
      </div>
      {expanded && (
        <div className="persona-details">
          {persona.personality && <p className="persona-personality">{persona.personality}</p>}
          {persona.goals && (
            <div className="persona-section">
              <strong>Objectifs</strong>
              {Array.isArray(persona.goals)
                ? <ul>{persona.goals.map((g, i) => <li key={i}>{g}</li>)}</ul>
                : <p>{persona.goals}</p>
              }
            </div>
          )}
          {persona.pain_points && (
            <div className="persona-section">
              <strong>Points de friction</strong>
              {Array.isArray(persona.pain_points)
                ? <ul>{persona.pain_points.map((f, i) => <li key={i}>{f}</li>)}</ul>
                : <p>{persona.pain_points}</p>
              }
            </div>
          )}
          {persona.quote && (
            <blockquote className="persona-quote">"{persona.quote}"</blockquote>
          )}
        </div>
      )}
    </div>
  )
}

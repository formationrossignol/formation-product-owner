import { useState } from 'react'

const TYPE_ICONS = { email: '📧', dashboard: '📊', document: '📄', chart: '📈', table: '🗂️' }

export default function ArtifactPanel({ artifacts }) {
  const [open, setOpen] = useState(null)
  if (!artifacts?.length) return null

  return (
    <div className="artifact-panel">
      <h3 className="artifact-title">📁 Documents disponibles</h3>
      <div className="artifact-tabs">
        {artifacts.map((a, i) => (
          <button
            key={i}
            className={`artifact-tab ${open === i ? 'active' : ''}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {TYPE_ICONS[a.type] ?? '📄'} {a.title}
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="artifact-content">
          <pre>{typeof artifacts[open].content === 'string'
            ? artifacts[open].content
            : JSON.stringify(artifacts[open].content, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

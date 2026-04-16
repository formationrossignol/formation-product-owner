import { useState } from 'react'
import ModuleShell from '../shared/ModuleShell'

const INVEST = [
  { key: 'I', label: 'Indépendante', check: (s) => s.who.length > 5 },
  { key: 'N', label: 'Négociable', check: () => true },
  { key: 'V', label: 'de Valeur', check: (s) => s.so.length > 10 },
  { key: 'E', label: 'Estimable', check: (s) => s.want.length > 10 },
  { key: 'S', label: 'Small', check: (s) => s.want.length < 100 },
  { key: 'T', label: 'Testable', check: (s) => s.ac.length > 10 },
]

export default function StoryWriting({ module, onComplete }) {
  const [story, setStory] = useState({ who: '', want: '', so: '', ac: '' })

  const investScore = INVEST.filter(c => c.check(story)).length
  const preview = story.who && story.want && story.so
    ? `En tant que ${story.who}, je veux ${story.want} afin de ${story.so}.`
    : ''

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="story-writer">
        <div className="story-template">
          <div className="story-field">
            <label>En tant que…</label>
            <input
              value={story.who}
              onChange={e => setStory(p => ({ ...p, who: e.target.value }))}
              placeholder="type d'utilisateur"
            />
          </div>
          <div className="story-field">
            <label>Je veux…</label>
            <input
              value={story.want}
              onChange={e => setStory(p => ({ ...p, want: e.target.value }))}
              placeholder="action ou fonctionnalité"
            />
          </div>
          <div className="story-field">
            <label>Afin de…</label>
            <input
              value={story.so}
              onChange={e => setStory(p => ({ ...p, so: e.target.value }))}
              placeholder="bénéfice attendu"
            />
          </div>
          <div className="story-field">
            <label>Critères d'acceptance</label>
            <textarea
              value={story.ac}
              onChange={e => setStory(p => ({ ...p, ac: e.target.value }))}
              placeholder="Étant donné… Quand… Alors…"
              rows={3}
            />
          </div>
        </div>

        {preview && (
          <div className="story-preview">
            <strong>Aperçu :</strong> {preview}
          </div>
        )}

        <div className="invest-checklist">
          <h4>Checklist INVEST <span className={`invest-score score-${investScore}`}>{investScore}/6</span></h4>
          <div className="invest-grid">
            {INVEST.map(c => {
              const ok = c.check(story)
              return (
                <div key={c.key} className={`invest-item ${ok ? 'ok' : 'nok'}`}>
                  <span className="invest-letter">{c.key}</span>
                  <span className="invest-label">{c.label}</span>
                  <span>{ok ? '✓' : '○'}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </ModuleShell>
  )
}

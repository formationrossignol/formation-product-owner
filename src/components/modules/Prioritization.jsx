import { useState } from 'react'
import ModuleShell from '../shared/ModuleShell'

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21]

const MOSCOW_BUCKETS = [
  { id: 'must',   label: 'Must Have',   color: '#EF4444', dot: '#EF4444',  desc: 'Non négociable' },
  { id: 'should', label: 'Should Have', color: '#F97316', dot: '#F97316',  desc: 'Important mais pas vital' },
  { id: 'could',  label: 'Could Have',  color: '#3B82F6', dot: '#3B82F6',  desc: 'Souhaitable si possible' },
  { id: 'wont',   label: "Won't Have",  color: '#A1A1AA', dot: '#A1A1AA',  desc: 'Pas pour cette version' },
]

const EISENHOWER_QUADRANTS = [
  { id: 'do',       label: 'Faire maintenant',    urgency: 'urgent',     importance: 'important',     color: '#EF4444' },
  { id: 'schedule', label: 'Planifier',           urgency: 'not-urgent', importance: 'important',     color: '#3B82F6' },
  { id: 'delegate', label: 'Déléguer',            urgency: 'urgent',     importance: 'not-important', color: '#F97316' },
  { id: 'drop',     label: 'Éliminer',            urgency: 'not-urgent', importance: 'not-important', color: '#A1A1AA' },
]

// ─── RICE ────────────────────────────────────────────────────────────────────
function RiceTab({ features }) {
  const [scores, setScores] = useState(() =>
    Object.fromEntries(features.map(f => [f.id, { reach: '', impact: 1, confidence: 80, effort: 1 }]))
  )

  function update(id, field, val) {
    setScores(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }))
  }

  function riceScore(s) {
    const r = parseFloat(s.reach) || 0
    return r > 0 ? +((r * s.impact * (s.confidence / 100)) / s.effort).toFixed(1) : null
  }

  const withScores = features
    .map(f => ({ ...f, rice: riceScore(scores[f.id]) }))
    .sort((a, b) => (b.rice ?? -1) - (a.rice ?? -1))

  const maxScore = Math.max(...withScores.map(f => f.rice ?? 0), 1)

  return (
    <div>
      <div className="prio-framework-desc">
        <strong>RICE</strong> = (Reach × Impact × Confidence%) / Effort — Prioritise les features par valeur livrée par unité d'effort.
        <br />Reach : utilisateurs/mois touchés · Impact : 0.25 / 0.5 / 1 / 2 / 3 · Confidence : % de certitude · Effort : jours-homme
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="rice-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th style={{ minWidth: 160 }}>Feature</th>
              <th>Reach<br /><span style={{ fontWeight: 400, fontSize: 10 }}>users/mois</span></th>
              <th>Impact<br /><span style={{ fontWeight: 400, fontSize: 10 }}>0.25–3</span></th>
              <th>Conf.<br /><span style={{ fontWeight: 400, fontSize: 10 }}>%</span></th>
              <th>Effort<br /><span style={{ fontWeight: 400, fontSize: 10 }}>jours</span></th>
              <th>Score RICE</th>
            </tr>
          </thead>
          <tbody>
            {withScores.map((f, i) => {
              const s = scores[f.id]
              const score = f.rice
              const pct = score ? score / maxScore : 0
              const scoreClass = pct > 0.66 ? 'rice-score-high' : pct > 0.33 ? 'rice-score-mid' : 'rice-score-low'
              return (
                <tr key={f.id}>
                  <td>
                    <span className={`rice-rank ${i === 0 && score ? 'rice-rank-1' : 'rice-rank-2'}`}>
                      {score ? i + 1 : '–'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 12 }}>{f.title}</div>
                    {f.description && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{f.description}</div>}
                  </td>
                  <td><input className="rice-input" type="number" min="0" value={s.reach} onChange={e => update(f.id, 'reach', e.target.value)} placeholder="ex: 5000" /></td>
                  <td>
                    <select className="wsjf-select" value={s.impact} onChange={e => update(f.id, 'impact', parseFloat(e.target.value))}>
                      {[0.25, 0.5, 1, 2, 3].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </td>
                  <td><input className="rice-input" type="number" min="0" max="100" value={s.confidence} onChange={e => update(f.id, 'confidence', parseFloat(e.target.value))} /></td>
                  <td><input className="rice-input" type="number" min="0.1" step="0.5" value={s.effort} onChange={e => update(f.id, 'effort', parseFloat(e.target.value) || 1)} /></td>
                  <td><span className={`rice-score ${scoreClass}`}>{score ?? '–'}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── MoSCoW ──────────────────────────────────────────────────────────────────
function MoscowTab({ features }) {
  const [assignments, setAssignments] = useState({})
  const [selected, setSelected] = useState(null)

  function assign(featureId, bucketId) {
    setAssignments(prev => ({ ...prev, [featureId]: bucketId }))
    setSelected(null)
  }

  const unassigned = features.filter(f => !assignments[f.id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="prio-framework-desc">
        <strong>MoSCoW</strong> — Classez chaque feature en cliquant dessus, puis en choisissant sa catégorie.
        Cliquez sur une feature déjà classée pour la déplacer.
      </div>

      {/* Unassigned pool */}
      {unassigned.length > 0 && (
        <div className="moscow-unassigned">
          <h4>À classer ({unassigned.length})</h4>
          <div className="moscow-unassigned-list">
            {unassigned.map(f => (
              <div key={f.id}>
                <div
                  className="moscow-feature"
                  onClick={() => setSelected(selected === f.id ? null : f.id)}
                  style={{ background: selected === f.id ? 'var(--muted-bg)' : undefined, borderColor: selected === f.id ? 'var(--border-hover)' : undefined }}
                >
                  <div className="moscow-feature-title">{f.title}</div>
                </div>
                {selected === f.id && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {MOSCOW_BUCKETS.map(b => (
                      <button key={b.id} onClick={() => assign(f.id, b.id)}
                        style={{ padding: '3px 10px', borderRadius: 4, border: `1px solid ${b.color}`, background: 'white', color: b.color, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buckets */}
      <div className="moscow-grid">
        {MOSCOW_BUCKETS.map(bucket => {
          const items = features.filter(f => assignments[f.id] === bucket.id)
          return (
            <div key={bucket.id} className="moscow-bucket">
              <div className="moscow-bucket-header">
                <span className="moscow-dot" style={{ background: bucket.dot }} />
                <span style={{ color: bucket.color }}>{bucket.label}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>— {bucket.desc}</span>
              </div>
              <div className="moscow-features">
                {items.map(f => (
                  <div key={f.id}>
                    <div className="moscow-feature" onClick={() => setSelected(selected === f.id ? null : f.id)}
                      style={{ borderColor: selected === f.id ? bucket.color : undefined }}>
                      <div className="moscow-feature-title">{f.title}</div>
                    </div>
                    {selected === f.id && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                        {MOSCOW_BUCKETS.filter(b => b.id !== bucket.id).map(b => (
                          <button key={b.id} onClick={() => assign(f.id, b.id)}
                            style={{ padding: '3px 10px', borderRadius: 4, border: `1px solid ${b.color}`, background: 'white', color: b.color, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                            → {b.label}
                          </button>
                        ))}
                        <button onClick={() => { setAssignments(p => { const n = { ...p }; delete n[f.id]; return n }); setSelected(null) }}
                          style={{ padding: '3px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'white', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                          ✕ Retirer
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {items.length === 0 && <div style={{ fontSize: 11, color: 'var(--border-hover)', padding: '8px 0' }}>Aucune feature</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Eisenhower ──────────────────────────────────────────────────────────────
function EisenhowerTab({ features }) {
  const [positions, setPositions] = useState({})
  const [selected, setSelected] = useState(null)

  function place(featureId, quadrantId) {
    setPositions(prev => ({ ...prev, [featureId]: quadrantId }))
    setSelected(null)
  }

  const unplaced = features.filter(f => !positions[f.id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="prio-framework-desc">
        <strong>Matrice d'Eisenhower</strong> — Classez chaque feature selon son urgence et son importance.
        Cliquez sur une feature pour l'assigner à un quadrant.
      </div>

      {unplaced.length > 0 && (
        <div className="moscow-unassigned">
          <h4>À positionner ({unplaced.length})</h4>
          <div className="eisenhower-unassigned">
            {unplaced.map(f => (
              <div key={f.id}>
                <div className="eisenhower-chip" onClick={() => setSelected(selected === f.id ? null : f.id)}
                  style={{ background: selected === f.id ? 'var(--muted-bg)' : undefined }}>
                  {f.title}
                </div>
                {selected === f.id && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {EISENHOWER_QUADRANTS.map(q => (
                      <button key={q.id} onClick={() => place(f.id, q.id)}
                        style={{ padding: '3px 10px', borderRadius: 4, border: `1px solid ${q.color}`, background: 'white', color: q.color, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        {q.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <div style={{ width: 90, flexShrink: 0 }} />
          <div style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--danger)' }}>🔴 Urgent</div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>⬜ Pas urgent</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: 90, flexShrink: 0 }}>
            <div style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: '#16A34A', paddingRight: 8 }}>🟢 Important</div>
            <div style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', paddingRight: 8 }}>⬜ Pas important</div>
          </div>
          <div className="eisenhower-grid" style={{ flex: 1 }}>
            {EISENHOWER_QUADRANTS.map(q => {
              const items = features.filter(f => positions[f.id] === q.id)
              return (
                <div key={q.id} className="eisenhower-quadrant" style={{ borderTop: `3px solid ${q.color}` }}>
                  <div className="eisenhower-quadrant-header" style={{ color: q.color }}>{q.label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {items.map(f => (
                      <div key={f.id} className="eisenhower-chip" style={{ borderColor: q.color, color: q.color }}
                        onClick={() => { setPositions(p => { const n = { ...p }; delete n[f.id]; return n }) }}>
                        {f.title} ✕
                      </div>
                    ))}
                    {items.length === 0 && <div style={{ fontSize: 11, color: 'var(--border-hover)' }}>Déposez ici</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── WSJF ─────────────────────────────────────────────────────────────────────
function WsjfTab({ features }) {
  const [scores, setScores] = useState(() =>
    Object.fromEntries(features.map(f => [f.id, { ubv: 1, tc: 1, rr: 1, size: 3 }]))
  )

  function update(id, field, val) {
    setScores(prev => ({ ...prev, [id]: { ...prev[id], [field]: parseInt(val) } }))
  }

  function wsjf(s) {
    return +((s.ubv + s.tc + s.rr) / s.size).toFixed(2)
  }

  const withScores = features
    .map(f => ({ ...f, wsjf: wsjf(scores[f.id]) }))
    .sort((a, b) => b.wsjf - a.wsjf)

  return (
    <div>
      <div className="prio-framework-desc">
        <strong>WSJF</strong> (Weighted Shortest Job First) = (Valeur Métier + Criticité Temps + Réduction Risque) / Taille du Job
        <br />Évaluez chaque critère sur l'échelle de Fibonacci : 1 · 2 · 3 · 5 · 8 · 13 · 21
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="wsjf-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Valeur Métier<br /><span style={{ fontWeight: 400 }}>(UBV)</span></th>
              <th>Criticité Temps<br /><span style={{ fontWeight: 400 }}>(TC)</span></th>
              <th>Réduction Risque<br /><span style={{ fontWeight: 400 }}>(RR)</span></th>
              <th>Taille Job<br /><span style={{ fontWeight: 400 }}>(Size)</span></th>
              <th>Score WSJF</th>
            </tr>
          </thead>
          <tbody>
            {withScores.map((f, i) => {
              const s = scores[f.id]
              return (
                <tr key={f.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{f.title}</div>
                    {i === 0 && <div style={{ fontSize: 10, color: 'var(--success)', marginTop: 2 }}>↑ Priorité #1</div>}
                  </td>
                  {['ubv', 'tc', 'rr', 'size'].map(field => (
                    <td key={field}>
                      <select className="wsjf-select" value={s[field]} onChange={e => update(f.id, field, e.target.value)}>
                        {FIBONACCI.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </td>
                  ))}
                  <td>
                    <span className="wsjf-score" style={{ color: i === 0 ? 'var(--success)' : i === 1 ? 'var(--warning)' : 'var(--text-muted)' }}>
                      {f.wsjf}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'rice',        label: '🎯 RICE' },
  { id: 'moscow',      label: '🗂️ MoSCoW' },
  { id: 'eisenhower',  label: '⬜ Eisenhower' },
  { id: 'wsjf',        label: '⚖️ WSJF' },
]

export default function Prioritization({ module, onComplete }) {
  const features = module.features ?? []
  const [activeTab, setActiveTab] = useState('rice')

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="prio-module">
        <div className="prio-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`prio-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'rice'       && <RiceTab       features={features} />}
        {activeTab === 'moscow'     && <MoscowTab     features={features} />}
        {activeTab === 'eisenhower' && <EisenhowerTab features={features} />}
        {activeTab === 'wsjf'       && <WsjfTab       features={features} />}
      </div>
    </ModuleShell>
  )
}

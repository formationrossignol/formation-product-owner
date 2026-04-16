import { useState } from 'react'
import ModuleShell from '../shared/ModuleShell'

export default function OkrSetting({ module, onComplete }) {
  const [objective, setObjective] = useState('')
  const [krs, setKrs] = useState(['', '', ''])

  function updateKr(index, value) {
    setKrs(prev => prev.map((kr, i) => i === index ? value : kr))
  }

  const krValidation = krs.map(kr => ({
    hasMeasure: /\d/.test(kr),
    hasVerb: kr.length > 10,
  }))

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="okr-visual">
        <div className="okr-builder">
          <div className="okr-objective-section">
            <label className="okr-field-label">🎯 Objectif (qualitatif, inspirant)</label>
            <input
              className="okr-input objective-input"
              value={objective}
              onChange={e => setObjective(e.target.value)}
              placeholder="Ex: Devenir la référence de notre marché en expérience utilisateur"
            />
          </div>
          <div className="okr-krs-section">
            {krs.map((kr, i) => (
              <div key={i} className="okr-kr-row">
                <label className="okr-field-label">
                  KR {i + 1}
                  <span className={`kr-badge ${krValidation[i].hasMeasure ? 'valid' : 'invalid'}`}>
                    {krValidation[i].hasMeasure ? '✓ Mesurable' : '✗ Doit être mesurable'}
                  </span>
                </label>
                <input
                  className={`okr-input kr-input ${krValidation[i].hasMeasure ? 'valid' : ''}`}
                  value={kr}
                  onChange={e => updateKr(i, e.target.value)}
                  placeholder={`Ex: Augmenter le taux de rétention J30 de 45% à 65%`}
                />
              </div>
            ))}
          </div>
          <div className="okr-score">
            {krValidation.filter(v => v.hasMeasure).length}/3 KRs mesurables
          </div>
        </div>
      </div>
    </ModuleShell>
  )
}

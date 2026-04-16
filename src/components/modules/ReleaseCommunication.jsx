import ModuleShell from '../shared/ModuleShell'

export default function ReleaseCommunication({ module, onComplete }) {
  const features = module.released_features ?? []

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="release-panel">
        <div className="release-header">
          <h3>🚀 Release {module.version ?? 'v1.0'}</h3>
          {module.release_date && <span className="release-date">📅 {module.release_date}</span>}
        </div>
        {features.length > 0 && (
          <div className="released-features">
            <h4>Features livrées</h4>
            {features.map((f, i) => (
              <div key={i} className="released-feature-card">
                <div className="feature-title">{f.title}</div>
                <p className="feature-description">{f.description}</p>
                {f.audience && (
                  <span className="feature-audience">👥 {f.audience}</span>
                )}
              </div>
            ))}
          </div>
        )}
        {module.audiences && (
          <div className="release-audiences">
            <h4>Audiences à informer</h4>
            <div className="audience-chips">
              {module.audiences.map((a, i) => (
                <span key={i} className="audience-chip">{a}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  )
}

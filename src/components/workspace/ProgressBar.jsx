export default function ProgressBar({ current, total, label }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="progress-bar-wrapper" title={`${current}/${total} modules`}>
      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      {label && <span className="progress-label">{label}</span>}
    </div>
  )
}

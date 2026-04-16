import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts'
import ModuleShell from '../shared/ModuleShell'

export default function KpiAnalysis({ module, onComplete }) {
  const charts = module.charts ?? []

  return (
    <ModuleShell module={module} onComplete={onComplete}>
      <div className="kpi-analysis">
        {charts.map((chart, i) => (
          <div key={i} className="chart-block">
            <h4 className="chart-title">{chart.title}</h4>
            {chart.context && <p className="chart-context">{chart.context}</p>}
            <ResponsiveContainer width="100%" height={220}>
              {chart.type === 'bar' ? (
                <BarChart data={chart.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chart.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} />
                </LineChart>
              )}
            </ResponsiveContainer>
            {chart.key_observation && (
              <div className="chart-observation">
                💡 {chart.key_observation}
              </div>
            )}
          </div>
        ))}
      </div>
    </ModuleShell>
  )
}

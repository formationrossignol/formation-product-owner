import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const TREND_COLORS = { up: '#22c55e', down: '#ef4444', stable: '#f59e0b' }
const TREND_ICONS = { up: '↑', down: '↓', stable: '→' }

export default function KpiDashboard({ kpis, analyticsData }) {
  return (
    <div className="kpi-dashboard-wrapper">
      <div className="kpi-dashboard">
        {kpis.map(kpi => {
          const progressPct = kpi.target > 0 ? Math.min(100, Math.round((kpi.value / kpi.target) * 100)) : 0
          return (
            <div key={kpi.id} className="kpi-card">
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value" style={{ color: TREND_COLORS[kpi.trend] }}>
                {kpi.value} {kpi.unit}
                <span className="trend-icon">{TREND_ICONS[kpi.trend]}</span>
              </div>
              <div className="kpi-progress">
                <div className="kpi-progress-bar">
                  <div
                    className="kpi-progress-fill"
                    style={{ width: `${progressPct}%`, background: TREND_COLORS[kpi.trend] }}
                  />
                </div>
                <span className="kpi-target">Obj: {kpi.target} {kpi.unit}</span>
              </div>
            </div>
          )
        })}
      </div>

      {analyticsData?.map((dataset, i) => dataset.data?.length > 0 && (
        <div key={i} className="analytics-chart">
          <h4>{dataset.metric}</h4>
          {dataset.insight && <p className="chart-insight">{dataset.insight}</p>}
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dataset.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}

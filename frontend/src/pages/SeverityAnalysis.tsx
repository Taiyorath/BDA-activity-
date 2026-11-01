import { useQuery } from '@tanstack/react-query'
import { accidentService } from '../services/api'
import PieChartWrapper from '../components/charts/PieChartWrapper'
import BarChartWrapper from '../components/charts/BarChartWrapper'

const SEV_LABELS: Record<number, string> = { 1: 'Minor', 2: 'Minor', 3: 'Moderate', 4: 'Severe' }

const SEV_COLORS: Record<string, string> = {
  Minor: '#4E8752',
  Moderate: '#D48B38',
  Severe: '#C95742',
}

export default function SeverityAnalysis() {
  const overall  = useQuery({ queryKey: ['sev-overall'],  queryFn: () => accidentService.getBySeverity('overall') })
  const byState  = useQuery({ queryKey: ['sev-state'],    queryFn: () => accidentService.getBySeverity('state') })
  const byWx     = useQuery({ queryKey: ['sev-weather'],  queryFn: () => accidentService.getBySeverity('weather') })

  const overallData = (overall.data ?? []).map((d: any) => ({
    ...d, label: SEV_LABELS[d.severity] ?? `Level ${d.severity}`,
  }))

  // Pivot state data for grouped bar: top 10 states
  const stateRaw = byState.data ?? []
  const stateMap: Record<string, any> = {}
  stateRaw.forEach((d: any) => {
    const label = SEV_LABELS[d.severity] ?? `L${d.severity}`
    if (!stateMap[d.state]) stateMap[d.state] = { state: d.state }
    stateMap[d.state][label] = (stateMap[d.state][label] ?? 0) + d.count
  })
  const stateData = Object.values(stateMap)
    .sort((a: any, b: any) => ((a.Minor ?? 0) + (a.Moderate ?? 0) + (a.Severe ?? 0)) < ((b.Minor ?? 0) + (b.Moderate ?? 0) + (b.Severe ?? 0)) ? 1 : -1)
    .slice(0, 10)

  // Pivot weather data
  const wxRaw = byWx.data ?? []
  const wxMap: Record<string, any> = {}
  wxRaw.forEach((d: any) => {
    const label = SEV_LABELS[d.severity] ?? `L${d.severity}`
    if (!wxMap[d.weather]) wxMap[d.weather] = { weather: d.weather }
    wxMap[d.weather][label] = (wxMap[d.weather][label] ?? 0) + d.count
  })
  const wxData = Object.values(wxMap)
    .sort((a: any, b: any) => (a.Severe ?? 0) < (b.Severe ?? 0) ? 1 : -1)
    .slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#D97757] dark:text-[#E89578] mb-1">
          Casualty & Harm Stratification
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight">
          Accident Severity Classification
        </h2>
        <p className="text-sm text-[#7A746B] dark:text-[#9A9387] mt-1 max-w-2xl leading-relaxed">
          Stratifying incidents across Minor (Level 1–2), Moderate (Level 3), and Severe / Fatal (Level 4) impact brackets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PieChartWrapper
          data={overallData}
          nameKey="label"
          valueKey="count"
          title="Overall Severity Ratio"
          subtitle="Minor vs Moderate vs Severe breakdown"
          colors={['#4E8752','#D48B38','#C95742']}
          loading={overall.isLoading}
          height={320}
        />

        <div className="lg:col-span-2 space-y-4">
          {overallData.map((d: any) => {
            const total = overallData.reduce((s: number, x: any) => s + (x.count ?? 0), 0)
            const pct = total > 0 ? ((d.count ?? 0) / total * 100).toFixed(1) : '0'
            const color = SEV_COLORS[d.label] ?? '#D97757'
            return (
              <div
                key={d.label}
                className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4 sm:p-5 shadow-[0_2px_10px_-4px_rgba(38,35,32,0.05)] dark:shadow-none"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="font-serif text-sm font-medium text-[#262320] dark:text-[#EDE8E1]">
                      {d.label} Severity
                    </span>
                  </div>
                  <div className="text-sm font-mono text-[#262320] dark:text-[#EDE8E1] flex-shrink-0">
                    <span className="font-semibold">{(d.count ?? 0).toLocaleString()}</span>
                    <span className="text-[#8C8479] ml-1.5 font-sans">({pct}%)</span>
                  </div>
                </div>

                <div className="h-2 bg-[#F3EFEA] dark:bg-[#1D1C19] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <BarChartWrapper
        data={stateData}
        xKey="state"
        yKey={['Minor','Moderate','Severe']}
        title="Severity Composition Across Leading States"
        subtitle="Grouped collision frequencies stratified by injury scale across top 10 states"
        loading={byState.isLoading}
        colors={['#4E8752','#D48B38','#C95742']}
        height={300}
      />

      <BarChartWrapper
        data={wxData}
        xKey="weather"
        yKey={['Minor','Moderate','Severe']}
        title="Severity Breakdown by Weather Condition"
        subtitle="Distribution of incident severities correlated against prevailing weather conditions"
        loading={byWx.isLoading}
        colors={['#4E8752','#D48B38','#C95742']}
        height={300}
      />
    </div>
  )
}

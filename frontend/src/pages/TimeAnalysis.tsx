import { useQuery } from '@tanstack/react-query'
import { accidentService } from '../services/api'
import AreaChartWrapper from '../components/charts/AreaChartWrapper'
import BarChartWrapper from '../components/charts/BarChartWrapper'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

export default function TimeAnalysis() {
  const hourly  = useQuery({ queryKey: ['time-hour'],  queryFn: () => accidentService.getByTime('hour') })
  const daily   = useQuery({ queryKey: ['time-day'],   queryFn: () => accidentService.getByTime('day') })
  const monthly = useQuery({ queryKey: ['time-month'], queryFn: () => accidentService.getByTime('month') })

  const hourData = (hourly.data ?? []).map((d: any) => ({
    ...d,
    label: `${String(d.hour ?? d.Hour ?? '?').padStart(2,'0')}:00`,
  }))

  const dayData = (daily.data ?? []).sort((a: any, b: any) => {
    const ai = DAYS.indexOf(a.day ?? a.Day_of_Week ?? '')
    const bi = DAYS.indexOf(b.day ?? b.Day_of_Week ?? '')
    return ai - bi
  }).map((d: any) => ({ ...d, label: (d.day ?? d.Day_of_Week ?? '').slice(0, 3) }))

  const monthData = (monthly.data ?? []).map((d: any) => ({
    ...d,
    label: `M${String(d.month ?? d.Month ?? d.period ?? '').padStart(2,'0')}`,
  }))

  // Find peak stats
  const peakHour = hourData.reduce((max: any, d: any) => d.count > (max?.count ?? 0) ? d : max, null)
  const peakDay  = dayData.reduce((max: any, d: any) => d.count > (max?.count ?? 0) ? d : max, null)

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#D97757] dark:text-[#E89578] mb-1">
          Chronological & Diurnal Patterns
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight">
          Temporal & Hourly Dynamics
        </h2>
        <p className="text-sm text-[#7A746B] dark:text-[#9A9387] mt-1 max-w-2xl leading-relaxed">
          Evaluating peak transit risk windows through diurnally bimodal distributions and weekday traffic variance.
        </p>
      </div>

      {/* Peak Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[
          { label: 'Peak Hour Window', value: peakHour ? peakHour.label : '—', sub: `${(peakHour?.count ?? 0).toLocaleString()} recorded incidents`, color: 'text-[#D97757]' },
          { label: 'Peak Day of Week', value: peakDay ? (peakDay.day ?? peakDay.Day_of_Week ?? '—') : '—', sub: `${(peakDay?.count ?? 0).toLocaleString()} cumulative records`, color: 'text-[#D48B38]' },
          { label: 'Highest Severity Band', value: 'Night (00–06h)', sub: 'Elevated casualty ratio in off-peak darkness', color: 'text-[#C95742]' },
          { label: 'Rush Hour Windows', value: '07–09h & 16–18h', sub: 'Commuter volume congestion spikes', color: 'text-[#5C8A74]' },
        ].map(c => (
          <div key={c.label} className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4 sm:p-5 shadow-[0_2px_10px_-4px_rgba(38,35,32,0.05)] dark:shadow-none">
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#8C8479] uppercase tracking-wider mb-1">{c.label}</p>
            <p className={`font-serif text-xl sm:text-2xl font-normal ${c.color} tracking-tight`}>{c.value}</p>
            <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mt-1.5 leading-relaxed">{c.sub}</p>
          </div>
        ))}
      </div>

      <AreaChartWrapper
        data={hourData}
        xKey="label" yKey="count"
        title="24-Hour Diurnal Collision Distribution"
        subtitle="Incident counts across individual hours demonstrating bimodal morning and evening commute peaks"
        color="#D97757"
        loading={hourly.isLoading}
        height={280}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartWrapper
          data={dayData}
          xKey="label" yKey="count"
          title="Day-of-Week Incident Velocity"
          subtitle="Total volume of recorded collisions partitioned by weekday"
          loading={daily.isLoading}
          colors={['#5C8A74']}
          height={260}
        />
        <BarChartWrapper
          data={monthData}
          xKey="label" yKey="count"
          title="Monthly Seasonality Aggregates"
          subtitle="Seasonal variance across calendar calendar months"
          loading={monthly.isLoading}
          colors={['#D48B38']}
          height={260}
        />
      </div>
    </div>
  )
}

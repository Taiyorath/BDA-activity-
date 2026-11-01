import { useQuery } from '@tanstack/react-query'
import { accidentService } from '../services/api'
import BarChartWrapper from '../components/charts/BarChartWrapper'
import LineChartWrapper from '../components/charts/LineChartWrapper'

export default function AccidentAnalytics() {
  const states   = useQuery({ queryKey: ['loc-state-15'], queryFn: () => accidentService.getByLocation('state', 15) })
  const cities   = useQuery({ queryKey: ['loc-city-20'],  queryFn: () => accidentService.getByLocation('city', 20) })
  const monthly  = useQuery({ queryKey: ['trends-month'], queryFn: () => accidentService.getTrends('month') })
  const yearly   = useQuery({ queryKey: ['trends-year'],  queryFn: () => accidentService.getTrends('year') })

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#D97757] dark:text-[#E89578] mb-1">
          Geographic & Longitudinal Distribution
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight">
          Accident Pattern Analytics
        </h2>
        <p className="text-sm text-[#7A746B] dark:text-[#9A9387] mt-1 max-w-2xl leading-relaxed">
          Aggregated regional frequency across states and metropolitan centers, alongside multi-year longitudinal trend evaluations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartWrapper
          data={states.data ?? []}
          xKey="state" yKey="count"
          title="State-wise Distribution (Top 15)"
          subtitle="Cumulative accident records aggregated per state jurisdiction"
          loading={states.isLoading}
          horizontal height={380}
        />
        <BarChartWrapper
          data={cities.data ?? []}
          xKey="city" yKey="count"
          title="Municipal Hotspots (Top 20)"
          subtitle="Urban centers recording the highest accident frequencies"
          loading={cities.isLoading}
          horizontal height={380}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartWrapper
          data={monthly.data ?? []}
          xKey="period" yKey="count"
          title="Monthly Accident Volume"
          subtitle="Chronological trajectory across recorded months"
          loading={monthly.isLoading}
          height={290}
        />
        <BarChartWrapper
          data={yearly.data ?? []}
          xKey="period" yKey="count"
          title="Annual Aggregates"
          subtitle="Year-over-year total incident frequency"
          loading={yearly.isLoading}
          height={290}
          colors={['#D97757']}
        />
      </div>
    </div>
  )
}

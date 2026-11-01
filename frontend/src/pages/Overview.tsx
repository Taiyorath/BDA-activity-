import { useQuery } from '@tanstack/react-query'
import { Activity, AlertTriangle, MapPin, Calendar, TrendingUp, Layers, HardDrive, Terminal, Database, Cpu } from 'lucide-react'
import { dashboardService, accidentService } from '../services/api'
import KPICard from '../components/kpi/KPICard'
import BarChartWrapper from '../components/charts/BarChartWrapper'
import LineChartWrapper from '../components/charts/LineChartWrapper'
import PieChartWrapper from '../components/charts/PieChartWrapper'

export default function Overview() {
  const summary  = useQuery({ queryKey: ['summary'],   queryFn: dashboardService.getSummary })
  const states   = useQuery({ queryKey: ['loc-state'], queryFn: () => accidentService.getByLocation('state', 10) })
  const trends   = useQuery({ queryKey: ['trends-m'],  queryFn: () => accidentService.getTrends('month') })
  const severity = useQuery({ queryKey: ['sev-ov'],    queryFn: () => accidentService.getBySeverity('overall') })

  const d = summary.data ?? {}
  const isLoading = summary.isLoading

  const sevLabels: Record<number, string> = { 1: 'Minor', 2: 'Minor', 3: 'Moderate', 4: 'Severe' }
  const sevData = (severity.data ?? []).map((r: any) => ({
    ...r,
    label: sevLabels[r.severity] ?? `Level ${r.severity}`,
  }))

  return (
    <div className="space-y-7">
      {/* Editorial Header */}
      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#D97757] dark:text-[#E89578] mb-1">
          Hadoop Big Data Case Study
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight">
          Executive Synthesis & Telemetry
        </h2>
        <p className="text-sm text-[#7A746B] dark:text-[#9A9387] mt-1 max-w-2xl leading-relaxed">
          Aggregated batch indicators derived from distributed HDFS storage, MapReduce pipelines, and Spark analytics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Ingested"
          value={d.total_accidents ?? 0}
          subtitle={d.data_source === 'SYNTHETIC' ? 'Synthesized test records' : 'Verified dataset'}
          icon={<Activity className="w-5 h-5 text-[#D97757]" />}
          iconBg="bg-[#FAF4EE] dark:bg-[#362720]"
          loading={isLoading}
        />
        <KPICard
          title="Severe Incidents"
          value={d.severe_accidents ?? 0}
          subtitle="Severity Level 4 (Critical)"
          icon={<AlertTriangle className="w-5 h-5 text-[#C95742]" />}
          iconBg="bg-[#FDF0ED] dark:bg-[#35211D]"
          loading={isLoading}
        />
        <KPICard
          title="Identified Hotspots"
          value={d.hotspots_count ?? 0}
          subtitle="≥85th percentile risk cluster"
          icon={<MapPin className="w-5 h-5 text-[#8B5E83]" />}
          iconBg="bg-[#F6EFF6] dark:bg-[#302130]"
          loading={isLoading}
        />
        <KPICard
          title="Average / Day"
          value={d.avg_per_day ?? 0}
          subtitle="Historical daily mean"
          icon={<Calendar className="w-5 h-5 text-[#D48B38]" />}
          iconBg="bg-[#FAF3E6] dark:bg-[#332A1C]"
          loading={isLoading}
        />
        <KPICard
          title="Most Impacted"
          value={d.most_affected_location ?? '—'}
          subtitle="Peak occurrence municipality"
          icon={<TrendingUp className="w-5 h-5 text-[#4E8752]" />}
          iconBg="bg-[#EDF5EE] dark:bg-[#202E22]"
          loading={isLoading}
        />
      </div>

      {/* Primary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartWrapper
          data={states.data ?? []}
          xKey="state"
          yKey="count"
          title="Geographic Incidence by State"
          subtitle="Top 10 administrative regions by total accident frequency"
          loading={states.isLoading}
          horizontal
        />
        <LineChartWrapper
          data={(trends.data ?? []).slice(-24)}
          xKey="period"
          yKey="count"
          title="Longitudinal Accident Dynamics"
          subtitle="Monthly volume trajectories spanning the last 24 observed months"
          loading={trends.isLoading}
        />
      </div>

      {/* Secondary Analytical & Ecosystem Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PieChartWrapper
          data={sevData}
          nameKey="label"
          valueKey="count"
          title="Severity Stratification"
          subtitle="Proportional split of accident impacts"
          colors={['#4E8752', '#D48B38', '#C95742']}
          loading={severity.isLoading}
        />

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4.5 sm:p-6 h-full shadow-[0_2px_10px_-4px_rgba(38,35,32,0.05)] dark:shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-[#F0ECE4] dark:border-[#2F2D28] pb-3">
              <h3 className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1] tracking-tight">
                Hadoop Ecosystem Data Pipeline
              </h3>
              <span className="self-start sm:self-auto text-[11px] font-mono text-[#D97757] bg-[#FAF4EE] dark:bg-[#362720] px-2 py-0.5 rounded-full border border-[#E8C8B3]/50">
                End-to-End Architecture
              </span>
            </div>
            <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mb-5 leading-relaxed">
              Demonstrates distributed big data engineering across storage, transformation, and querying layers.
              Raw telemetry ingested via HDFS is batch-processed by Pig and MapReduce, indexed in Hive, and computed with PySpark.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'HDFS Storage', desc: 'Distributed block storage (/accidents)', color: '#D97757', icon: HardDrive },
                { label: 'MapReduce', desc: 'Fault-tolerant key-value aggregation', color: '#5C8A74', icon: Terminal },
                { label: 'Apache Hive', desc: 'HiveQL structured warehouse queries', color: '#D48B38', icon: Database },
                { label: 'Apache Pig', desc: 'ETL data flow & schema filtering', color: '#8B5E83', icon: Layers },
                { label: 'Apache Spark', desc: 'In-memory Resilient Distributed Datasets', color: '#C95742', icon: Cpu },
                { label: 'YARN Scheduler', desc: 'Cluster resource negotiation & nodes', color: '#5E7A94', icon: Activity },
              ].map(t => {
                const Icon = t.icon
                return (
                  <div
                    key={t.label}
                    className="p-3.5 rounded-xl border border-[#EAE5DD] dark:border-[#383530] bg-[#FAF8F5] dark:bg-[#1D1C19] hover:border-[#D97757]/40 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="p-1.5 rounded-lg bg-white dark:bg-[#252421] shadow-2xs border border-[#EAE5DD]/80 dark:border-[#33312C]">
                        <Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                      </div>
                      <div className="text-xs font-semibold text-[#262320] dark:text-[#EDE8E1]">
                        {t.label}
                      </div>
                    </div>
                    <div className="text-[11px] text-[#7A746B] dark:text-[#9A9387] leading-relaxed">
                      {t.desc}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

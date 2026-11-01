import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { hadoopService } from '../services/api'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import CodeBlock from '../components/ui/CodeBlock'
import EmptyState from '../components/ui/EmptyState'
import { HardDrive, Terminal, Database, Layers, Cpu, Activity, Play } from 'lucide-react'

type Tab = 'hdfs' | 'mapreduce' | 'hive' | 'pig' | 'spark' | 'yarn'

const MR_JOBS = [
  { id: 'city_count',     label: 'City Count MapReduce',    desc: 'MapReduce key-value job partitioning accident tallies across municipalities' },
  { id: 'state_count',    label: 'State Count MapReduce',   desc: 'Distributed mapper emitting state tokens and reducer aggregating volume' },
  { id: 'hour_count',     label: 'Hour Count MapReduce',    desc: 'Extracts hourly timestamp components to reveal peak collision periods' },
  { id: 'severity_count', label: 'Severity Count MapReduce',desc: 'Aggregates frequency counts across scale levels 1 through 4' },
  { id: 'weather_count',  label: 'Weather Count MapReduce', desc: 'Parses environmental strings into key-value counts' },
]

const HIVE_QUERIES = [
  { id: 'accidents_by_state',    label: 'Accidents by State',    sql: 'SELECT state, COUNT(*) AS total\nFROM road_safety_db.accidents\nGROUP BY state\nORDER BY total DESC\nLIMIT 15;' },
  { id: 'accidents_by_city',     label: 'Accidents by City',     sql: 'SELECT city, state, COUNT(*) AS total\nFROM road_safety_db.accidents\nGROUP BY city, state\nORDER BY total DESC\nLIMIT 20;' },
  { id: 'hourly_distribution',   label: 'Hourly Distribution',   sql: 'SELECT HOUR(start_time) AS hour, COUNT(*) AS count\nFROM road_safety_db.accidents\nGROUP BY HOUR(start_time)\nORDER BY hour;' },
  { id: 'severity_distribution', label: 'Severity Distribution', sql: 'SELECT severity_label, COUNT(*) AS count\nFROM road_safety_db.accidents\nGROUP BY severity_label;' },
  { id: 'weather_analysis',      label: 'Weather Analysis',      sql: 'SELECT weather_condition, COUNT(*) AS count\nFROM road_safety_db.accidents\nGROUP BY weather_condition\nORDER BY count DESC\nLIMIT 15;' },
  { id: 'monthly_trends',        label: 'Monthly Trends',        sql: 'SELECT YEAR(start_time) AS yr, MONTH(start_time) AS mo,\n  COUNT(*) AS count\nFROM road_safety_db.accidents\nGROUP BY yr, mo\nORDER BY yr, mo;' },
  { id: 'yearly_stats',          label: 'Yearly Statistics',     sql: 'SELECT YEAR(start_time) AS yr,\n  COUNT(*) AS count,\n  ROUND(AVG(severity),2) AS avg_severity\nFROM road_safety_db.accidents\nGROUP BY yr\nORDER BY yr;' },
  { id: 'severe_locations',      label: 'Severe Locations',      sql: 'SELECT city, state, COUNT(*) AS severe_count\nFROM road_safety_db.accidents\nWHERE severity = 4\nGROUP BY city, state\nORDER BY severe_count DESC\nLIMIT 20;' },
]

const PIG_SCRIPTS = [
  { id: 'clean_accidents', label: 'Clean Accidents ETL', pig: `-- Pig Latin Data Ingestion & Sanitization Script\nraw = LOAD '/accidents/raw/' USING PigStorage(',');\nno_nulls = FILTER raw BY city IS NOT NULL AND city != '';\nvalid = FILTER no_nulls BY lat != 0.0 AND lng != 0.0;\nSTORE valid INTO '/accidents/processed/' USING PigStorage(',');` },
  { id: 'location_stats',  label: 'Location Aggregation',  pig: `-- Location Stats Grouping via Pig Latin\ndata = LOAD '/accidents/processed/' USING PigStorage(',');\nby_city = GROUP data BY (city, state);\nstats = FOREACH by_city GENERATE FLATTEN(group), COUNT(data);\nORDERED = ORDER stats BY $2 DESC;\nSTORE ORDERED INTO '/accidents/results/pig/location_stats/' USING PigStorage('\\t');` },
  { id: 'severity_filter', label: 'Severity Filter (Level 3-4)', pig: `-- Filtering Severe Incidents\ndata = LOAD '/accidents/processed/' USING PigStorage(',');\nsevere = FILTER data BY severity >= 3;\nby_state = GROUP severe BY state;\nstats = FOREACH by_state GENERATE group, COUNT(severe);\nSTORE stats INTO '/accidents/results/pig/severe_by_state/' USING PigStorage('\\t');` },
]

const SPARK_JOBS = [
  { id: 'accident_frequency', label: 'PySpark: Accident Frequency',  desc: 'In-memory distributed DataFrame aggregation ranking top municipal clusters' },
  { id: 'severity_analysis',  label: 'PySpark: Severity Breakdown',   desc: 'Statistical classification and percentage shares across injury categories' },
  { id: 'monthly_trends',     label: 'PySpark: Monthly Trajectories', desc: 'Timestamp component extraction and multi-year time-series computation' },
  { id: 'weather_analysis',   label: 'PySpark: Environmental Risk',   desc: 'Correlation matrices analyzing adverse weather against casualty rates' },
  { id: 'location_stats',     label: 'PySpark: Grid Cell Density',    desc: 'Spatial coordinate rounding computing cluster density and dispersion' },
  { id: 'time_patterns',      label: 'PySpark: Temporal Rush Hours',  desc: 'Bimodal distribution modeling rush-hour vs off-peak incident rates' },
]

export default function HadoopOperations() {
  const [tab, setTab] = useState<Tab>('hdfs')
  const [mrResults, setMrResults] = useState<Record<string, any>>({})
  const [mrLoading, setMrLoading] = useState<Record<string, boolean>>({})
  const [hiveQuery, setHiveQuery] = useState(HIVE_QUERIES[0].id)
  const [hiveResult, setHiveResult] = useState<any>(null)
  const [hiveLoading, setHiveLoading] = useState(false)
  const [pigScript, setPigScript] = useState(PIG_SCRIPTS[0].id)
  const [pigResult, setPigResult] = useState<any>(null)
  const [pigLoading, setPigLoading] = useState(false)
  const [sparkResults, setSparkResults] = useState<Record<string, any>>({})
  const [sparkLoading, setSparkLoading] = useState<Record<string, boolean>>({})

  const hdfs = useQuery({ queryKey: ['hdfs'], queryFn: hadoopService.getHDFS, enabled: tab === 'hdfs' })
  const yarn = useQuery({ queryKey: ['yarn'], queryFn: hadoopService.getYARN, enabled: tab === 'yarn', refetchInterval: tab === 'yarn' ? 10000 : false })

  const runMR = async (job: string) => {
    setMrLoading(p => ({ ...p, [job]: true }))
    try {
      const res = await hadoopService.runMapReduce(job)
      setMrResults(p => ({ ...p, [job]: res }))
    } finally {
      setMrLoading(p => ({ ...p, [job]: false }))
    }
  }

  const runHive = async () => {
    setHiveLoading(true)
    try {
      const res = await hadoopService.executeHive(hiveQuery)
      setHiveResult(res)
    } finally {
      setHiveLoading(false)
    }
  }

  const runPig = async () => {
    setPigLoading(true)
    try {
      const res = await hadoopService.runPig(pigScript)
      setPigResult(res)
    } finally {
      setPigLoading(false)
    }
  }

  const runSpark = async (job: string) => {
    setSparkLoading(p => ({ ...p, [job]: true }))
    try {
      const res = await hadoopService.runSpark(job)
      setSparkResults(p => ({ ...p, [job]: res }))
    } finally {
      setSparkLoading(p => ({ ...p, [job]: false }))
    }
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'hdfs',      label: 'HDFS Explorer',     icon: HardDrive },
    { id: 'mapreduce', label: 'MapReduce Jobs',     icon: Terminal },
    { id: 'hive',      label: 'Apache Hive (HQL)',  icon: Database },
    { id: 'pig',       label: 'Apache Pig Latin',   icon: Layers },
    { id: 'spark',     label: 'Apache Spark',       icon: Cpu },
    { id: 'yarn',      label: 'YARN Resource Mgr',  icon: Activity },
  ]

  const selectedHive = HIVE_QUERIES.find(q => q.id === hiveQuery)!
  const selectedPig  = PIG_SCRIPTS.find(s => s.id === pigScript)!

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#D97757] dark:text-[#E89578] mb-1">
          Hadoop Ecosystem Execution Console
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight">
          Big Data Processing & Distributed Compute
        </h2>
        <p className="text-sm text-[#7A746B] dark:text-[#9A9387] mt-1 max-w-2xl leading-relaxed">
          Inspect distributed filesystem directories, trigger parallel MapReduce jobs, query Hive databases, and launch in-memory Spark analytics.
        </p>
      </div>

      {/* Claude Segmented Control Tabs */}
      <div className="flex gap-1.5 bg-[#F3EFEA] dark:bg-[#1D1C19] border border-[#EAE5DD] dark:border-[#383530] p-1.5 rounded-2xl overflow-x-auto shadow-2xs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer
              ${tab === id
                ? 'bg-white dark:bg-[#252421] text-[#262320] dark:text-[#EDE8E1] shadow-sm border border-[#EAE5DD]/80 dark:border-[#383530]'
                : 'text-[#6E685F] dark:text-[#9A9387] hover:text-[#262320] dark:hover:text-[#EDE8E1]'
              }`}
          >
            <Icon className={`w-3.5 h-3.5 ${tab === id ? 'text-[#D97757]' : ''}`} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: HDFS Explorer ── */}
      {tab === 'hdfs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {hdfs.data?.simulated ? (
                <Badge variant="amber">HDFS Simulator Active</Badge>
              ) : (
                <Badge variant="success">HDFS Cluster Connected</Badge>
              )}
              <span className="text-xs text-[#7A746B] dark:text-[#9A9387]">
                Target storage prefix: <code className="font-mono text-[#D97757]">/accidents/</code>
              </span>
            </div>
            <span className="text-xs font-mono text-[#8C8479]">Replication Factor: 3</span>
          </div>

          {hdfs.isLoading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : (
            <div className="space-y-4">
              {(hdfs.data?.directories ?? []).map((dir: any) => (
                <div key={dir.path} className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] overflow-hidden shadow-2xs">
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 bg-[#FAF8F5] dark:bg-[#1D1C19] flex items-center justify-between border-b border-[#EAE5DD] dark:border-[#383530]">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-[#D97757]" />
                      <code className="text-sm font-mono font-medium text-[#D97757] dark:text-[#E89578]">{dir.path}</code>
                    </div>
                    <span className="text-[11px] font-mono text-[#8C8479]">{dir.files.length} file(s)</span>
                  </div>

                  {dir.files.length === 0 ? (
                    <p className="px-6 py-4 text-xs text-[#8C8479] italic">No blocks allocated in this HDFS path yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs min-w-[500px]">
                        <thead>
                          <tr className="border-b border-[#F0ECE4] dark:border-[#2F2D28] bg-[#FAF8F5]/50 dark:bg-[#1D1C19]/50">
                            <th className="px-6 py-2.5 text-left font-serif font-medium text-[#7A746B] dark:text-[#9A9387]">File Key</th>
                            <th className="px-6 py-2.5 text-left font-serif font-medium text-[#7A746B] dark:text-[#9A9387]">Block Size</th>
                            <th className="px-6 py-2.5 text-left font-serif font-medium text-[#7A746B] dark:text-[#9A9387]">Ingestion Date</th>
                            <th className="px-6 py-2.5 text-left font-serif font-medium text-[#7A746B] dark:text-[#9A9387]">Replication State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0ECE4] dark:divide-[#2F2D28]">
                          {dir.files.map((f: any) => (
                            <tr key={f.name} className="hover:bg-[#FAF8F5] dark:hover:bg-[#2A2925] transition-colors">
                              <td className="px-6 py-3 font-mono font-medium text-[#262320] dark:text-[#EDE8E1]">{f.name}</td>
                              <td className="px-6 py-3 text-[#7A746B] dark:text-[#9A9387] font-mono">{f.size}</td>
                              <td className="px-6 py-3 text-[#8C8479] font-mono">{f.modified}</td>
                              <td className="px-6 py-3">
                                <Badge variant="success">Replicated (3x)</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: MapReduce ── */}
      {tab === 'mapreduce' && (
        <div className="space-y-4">
          <p className="text-xs text-[#7A746B] dark:text-[#9A9387]">
            Executes parallel streaming jobs splitting CSV streams into mapper key-value pairs, sorting through Hadoop shuffle, and aggregating in reducers.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {MR_JOBS.map(job => {
              const res = mrResults[job.id]
              const loading = mrLoading[job.id]
              return (
                <div key={job.id} className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4.5 sm:p-6 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                        <Terminal className="w-4 h-4 text-[#5C8A74]" />
                        <h4 className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1]">
                          {job.label}
                        </h4>
                        {res && (
                          res.simulated ? (
                            <Badge variant="amber">Simulation Verified</Badge>
                          ) : (
                            <Badge variant="success">Cluster Executed</Badge>
                          )
                        )}
                        {res?.job?.status === 'completed' && <Badge variant="success">Completed</Badge>}
                      </div>
                      <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mt-1">{job.desc}</p>
                    </div>

                    <button
                      onClick={() => runMR(job.id)}
                      disabled={loading}
                      className="w-full sm:w-auto justify-center flex items-center gap-2 px-4 py-2 bg-[#D97757] hover:bg-[#C26343] disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      {loading ? <Spinner size="sm" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{loading ? 'Processing on Cluster…' : 'Execute Job'}</span>
                    </button>
                  </div>

                  {res && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-[#F0ECE4] dark:border-[#2F2D28]">
                      {res.simulated && (
                        <p className="text-[11px] text-[#A85035] dark:text-[#E89578] bg-[#FAF4EE] dark:bg-[#362720] rounded-xl px-3.5 py-2 border border-[#E8C8B3]/50">
                          ℹ️ {res.note} — Telemetry rendered from processed dataset.
                        </p>
                      )}
                      <CodeBlock code={res.job?.output ?? ''} language="mapreduce-output" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Tab: Hive ── */}
      {tab === 'hive' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4.5 sm:p-6 shadow-2xs">
            <h3 className="font-serif text-lg font-medium text-[#262320] dark:text-[#EDE8E1] mb-1">
              Apache Hive Query Console
            </h3>
            <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mb-4">
              HiveQL SQL queries translated into distributed execution plans on database <code className="font-mono text-[#D97757]">road_safety_db</code>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <select
                value={hiveQuery}
                onChange={e => { setHiveQuery(e.target.value); setHiveResult(null) }}
                className="w-full sm:flex-1 text-xs border border-[#EAE5DD] dark:border-[#383530] rounded-xl px-4 py-2.5 bg-[#FAF8F5] dark:bg-[#1D1C19] text-[#262320] dark:text-[#EDE8E1] focus:ring-2 focus:ring-[#D97757] focus:outline-none"
              >
                {HIVE_QUERIES.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
              </select>

              <button
                onClick={runHive}
                disabled={hiveLoading}
                className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-2.5 bg-[#D97757] hover:bg-[#C26343] disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {hiveLoading ? <Spinner size="sm" /> : <Database className="w-3.5 h-3.5" />}
                <span>{hiveLoading ? 'Compiling HQL…' : 'Execute Query'}</span>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-[11px] font-semibold text-[#8C8479] uppercase tracking-wider mb-2 font-mono">
                Target HiveQL Script
              </p>
              <CodeBlock code={selectedHive.sql} language="sql" />
            </div>

            {hiveResult && (
              <div className="space-y-2 pt-4 border-t border-[#F0ECE4] dark:border-[#2F2D28]">
                {hiveResult.simulated && (
                  <p className="text-[11px] text-[#A85035] dark:text-[#E89578] bg-[#FAF4EE] dark:bg-[#362720] rounded-xl px-3.5 py-2 border border-[#E8C8B3]/50">
                    ℹ️ {hiveResult.note}
                  </p>
                )}
                <p className="text-[11px] font-semibold text-[#8C8479] uppercase tracking-wider font-mono">
                  Result Set
                </p>
                <CodeBlock code={hiveResult.job?.output ?? ''} language="hive-results" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Pig ── */}
      {tab === 'pig' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4.5 sm:p-6 shadow-2xs">
            <h3 className="font-serif text-lg font-medium text-[#262320] dark:text-[#EDE8E1] mb-1">
              Apache Pig Latin Dataflow Script Runner
            </h3>
            <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mb-4">
              High-level procedural data transformation scripts for filtering invalid coordinate values and preparing analytical aggregations.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <select
                value={pigScript}
                onChange={e => { setPigScript(e.target.value); setPigResult(null) }}
                className="w-full sm:flex-1 text-xs border border-[#EAE5DD] dark:border-[#383530] rounded-xl px-4 py-2.5 bg-[#FAF8F5] dark:bg-[#1D1C19] text-[#262320] dark:text-[#EDE8E1] focus:ring-2 focus:ring-[#D97757] focus:outline-none"
              >
                {PIG_SCRIPTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>

              <button
                onClick={runPig}
                disabled={pigLoading}
                className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-2.5 bg-[#D97757] hover:bg-[#C26343] disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {pigLoading ? <Spinner size="sm" /> : <Layers className="w-3.5 h-3.5" />}
                <span>{pigLoading ? 'Compiling DAG…' : 'Run Pig Script'}</span>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-[11px] font-semibold text-[#8C8479] uppercase tracking-wider mb-2 font-mono">
                Pig Latin Script (ETL)
              </p>
              <CodeBlock code={selectedPig.pig} language="pig" />
            </div>

            {pigResult && (
              <div className="space-y-2 pt-4 border-t border-[#F0ECE4] dark:border-[#2F2D28]">
                {pigResult.simulated && (
                  <p className="text-[11px] text-[#A85035] dark:text-[#E89578] bg-[#FAF4EE] dark:bg-[#362720] rounded-xl px-3.5 py-2 border border-[#E8C8B3]/50">
                    ℹ️ {pigResult.note}
                  </p>
                )}
                <p className="text-[11px] font-semibold text-[#8C8479] uppercase tracking-wider font-mono">
                  Execution Output
                </p>
                <CodeBlock code={pigResult.job?.output ?? ''} language="pig-output" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Spark ── */}
      {tab === 'spark' && (
        <div className="space-y-4">
          <p className="text-xs text-[#7A746B] dark:text-[#9A9387]">
            PySpark jobs leveraging distributed in-memory Resilient Distributed Datasets (RDDs) and DataFrames to process complex multidimensional traffic aggregates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPARK_JOBS.map(job => {
              const res = sparkResults[job.id]
              const loading = sparkLoading[job.id]
              return (
                <div key={job.id} className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4.5 sm:p-6 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Cpu className="w-4 h-4 text-[#D97757]" />
                      <h4 className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1]">
                        {job.label}
                      </h4>
                    </div>
                    <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mb-4 leading-relaxed">
                      {job.desc}
                    </p>
                  </div>

                  <div>
                    {res && (
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={res.simulated ? 'amber' : 'success'}>
                            {res.simulated ? 'Spark Simulation' : 'PySpark Live'}
                          </Badge>
                          <Badge variant="success">Completed</Badge>
                        </div>
                        <CodeBlock code={res.job?.output ?? ''} language="spark-output" />
                      </div>
                    )}

                    <button
                      onClick={() => runSpark(job.id)}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF4EE] dark:bg-[#362720] border border-[#E8C8B3] dark:border-[#5F2B1B] text-[#D97757] dark:text-[#E89578] hover:bg-[#D97757] hover:text-white dark:hover:bg-[#D97757] dark:hover:text-white disabled:opacity-50 text-xs font-medium rounded-xl transition-all cursor-pointer"
                    >
                      {loading ? <Spinner size="sm" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{loading ? 'Submitting to Spark Master…' : 'Submit Spark Job'}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Tab: YARN ── */}
      {tab === 'yarn' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <Badge variant={yarn.data?.simulated ? 'amber' : 'success'}>
                {yarn.data?.simulated ? 'YARN Telemetry Simulator' : 'YARN Active'}
              </Badge>
              <span className="text-xs text-[#7A746B] dark:text-[#9A9387]">
                Cluster Resource Allocation & Scheduler State
              </span>
            </div>
            {yarn.isFetching && <Spinner size="sm" />}
          </div>

          {yarn.isLoading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : yarn.data?.cluster ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                {[
                  { label: 'Total Allocated Memory', value: `${((yarn.data.cluster.total_memory_mb ?? 0) / 1024).toFixed(0)} GB`, sub: 'Across 3 DataNodes' },
                  { label: 'Utilized Memory',        value: `${((yarn.data.cluster.used_memory_mb ?? 0) / 1024).toFixed(0)} GB`,  sub: 'YARN Containers' },
                  { label: 'Virtual Cores Total',    value: yarn.data.cluster.total_vcores ?? 0,                                   sub: 'Total Execution Cores' },
                  { label: 'Active VCores',          value: yarn.data.cluster.used_vcores ?? 0,                                    sub: 'Active Container Threads' },
                ].map(s => (
                  <div key={s.label} className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4 sm:p-5 shadow-2xs">
                    <p className="text-[11px] font-semibold text-[#8C8479] uppercase tracking-wider mb-1">{s.label}</p>
                    <p className="font-serif text-2xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight">{s.value}</p>
                    <p className="text-[11px] text-[#7A746B] dark:text-[#9A9387] mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] overflow-hidden shadow-2xs">
                <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#F0ECE4] dark:border-[#2F2D28]">
                  <h3 className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1]">
                    YARN Scheduled Applications
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[550px]">
                    <thead>
                      <tr className="border-b border-[#EAE5DD] dark:border-[#33312C] bg-[#FAF8F5] dark:bg-[#1D1C19]">
                        {['Application ID','Job Descriptor','Status','Progress','Elapsed Time'].map(h => (
                          <th key={h} className="px-6 py-3 text-left font-serif font-medium text-[#7A746B] dark:text-[#9A9387]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0ECE4] dark:divide-[#2F2D28]">
                      {(yarn.data.running_applications ?? []).map((app: any) => (
                        <tr key={app.id} className="hover:bg-[#FAF8F5] dark:hover:bg-[#2A2925] transition-colors">
                          <td className="px-6 py-3 font-mono text-[#D97757]">{app.id}</td>
                          <td className="px-6 py-3 font-medium text-[#262320] dark:text-[#EDE8E1]">{app.name}</td>
                          <td className="px-6 py-3">
                            <Badge variant="success">{app.state}</Badge>
                          </td>
                          <td className="px-6 py-3 font-mono text-[#7A746B]">{app.progress}</td>
                          <td className="px-6 py-3 font-mono text-[#8C8479]">{app.elapsed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              icon={<Activity className="w-6 h-6 text-[#D97757]" />}
              title="YARN Cluster Telemetry"
              description="Connect to live ResourceManager on port 8088 to stream container logs."
            />
          )}
        </div>
      )}
    </div>
  )
}

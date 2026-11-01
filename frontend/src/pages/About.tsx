import { Sparkles, ExternalLink, BookOpen, Layers } from 'lucide-react'

export default function About() {
  const TOOLS = [
    { emoji: '🐘', name: 'Apache Hadoop', version: '3.3.6', desc: 'Core distributed computation and storage framework' },
    { emoji: '📁', name: 'Hadoop HDFS', version: '3.3.6', desc: 'Fault-tolerant distributed file system with block replication' },
    { emoji: '🔄', name: 'MapReduce', version: '3.3.6', desc: 'Parallel batch computing with mapper & reducer phases' },
    { emoji: '⚙️', name: 'Apache YARN', version: '3.3.6', desc: 'Cluster resource management & distributed scheduler' },
    { emoji: '🐝', name: 'Apache Hive', version: '3.1.3', desc: 'SQL-dialect data warehousing over HDFS partitions' },
    { emoji: '🐷', name: 'Apache Pig', version: '0.17.0', desc: 'Procedural Pig Latin pipeline for ETL & sanitization' },
    { emoji: '⚡', name: 'Apache Spark', version: '3.5.1', desc: 'In-memory distributed computing with RDDs & DataFrames' },
    { emoji: '🐍', name: 'PySpark', version: '3.5.1', desc: 'High-level Python API for distributed Spark pipelines' },
    { emoji: '⚛️', name: 'React 18', version: '18.3.1', desc: 'Component architecture with client-side state routing' },
    { emoji: '📊', name: 'Recharts', version: '3.x', desc: 'Declarative SVG visualization layer' },
    { emoji: '🗺️', name: 'Leaflet Engine', version: '1.9.4', desc: 'Geospatial vector mapping with coordinate clustering' },
    { emoji: '🚀', name: 'FastAPI', version: '0.111', desc: 'Asynchronous Python REST API with OpenAPI validation' },
  ]

  const HADOOP_DESC = [
    { name: 'Hadoop Distributed File System (HDFS)', color: '#D97757', desc: 'HDFS shards raw collision datasets across DataNodes in 128 MB blocks, automatically replicating blocks across 3 distinct rack nodes for high fault tolerance and parallel sequential I/O.' },
    { name: 'MapReduce Computational Paradigm', color: '#5C8A74', desc: 'Employs streaming map tasks that parse line-delimited records into key-value pairs (e.g., location, severity, hour) followed by automated shuffle-sorting and reducer aggregation.' },
    { name: 'Apache Hive Data Warehousing', color: '#D48B38', desc: 'Exposes an external schema over HDFS files via the road_safety_db database. Translates declarative HiveQL SQL queries into optimized MapReduce execution graphs.' },
    { name: 'Apache Pig ETL Dataflow Engine', color: '#8B5E83', desc: 'Uses procedural Pig Latin scripts (LOAD, FILTER, GROUP, FOREACH, STORE) to strip invalid GPS coordinates, null entries, and format clean records for analytical queries.' },
    { name: 'Apache Spark High-Throughput Analytics', color: '#C95742', desc: 'In-memory Resilient Distributed Datasets (RDDs) execute multi-dimensional traffic pattern computations up to 100× faster than traditional disk-bound MapReduce jobs.' },
    { name: 'YARN Resource Scheduler', color: '#5E7A94', desc: 'Decouples cluster resource management from application logic, dynamically allocating container memory and virtual cores to running jobs across worker nodes.' },
  ]

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Project Hero Card - Claude Editorial */}
      <div className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4.5 sm:p-7 shadow-[0_2px_10px_-4px_rgba(38,35,32,0.05)] dark:shadow-none">
        <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF4EE] dark:bg-[#362720] border border-[#E8C8B3] dark:border-[#5F2B1B] flex items-center justify-center text-[#D97757] flex-shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 fill-[#D97757]/20" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase font-semibold text-[#D97757] dark:text-[#E89578] tracking-wider">
                CSE Big Data Analytics Assessment
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight">
              Road Accident Pattern Analysis & Black Spot Identification Using Hadoop
            </h2>
            <p className="text-xs text-[#8C8479] mt-1 font-medium">
              Academic Case Study & Distributed Big Data Architecture
            </p>
            <p className="text-sm text-[#524C44] dark:text-[#B8B2A7] mt-3.5 leading-relaxed font-sans">
              This project applies the Apache Hadoop big data ecosystem to large-scale road accident datasets. By combining distributed HDFS storage, MapReduce batch counting, Apache Hive structured querying, Apache Pig ETL cleansing, and Apache Spark in-memory analytics, the system isolates high-risk accident black spots and surfaces time, weather, and severity risk factors.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div>
        <h3 className="font-serif text-lg font-medium text-[#262320] dark:text-[#EDE8E1] mb-1">
          Comprehensive Technology Stack
        </h3>
        <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mb-4">
          Integrated distributed components powering data ingestion, batch processing, and visualization.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {TOOLS.map(t => (
            <div
              key={t.name}
              className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4 flex items-start gap-3 shadow-2xs hover:border-[#D97757]/40 transition-colors"
            >
              <span className="text-2xl mt-0.5">{t.emoji}</span>
              <div>
                <div className="font-serif text-sm font-medium text-[#262320] dark:text-[#EDE8E1]">
                  {t.name}
                </div>
                <div className="text-[11px] font-mono text-[#D97757] dark:text-[#E89578] mb-1">
                  v{t.version}
                </div>
                <div className="text-[11px] text-[#7A746B] dark:text-[#9A9387] leading-relaxed">
                  {t.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hadoop Ecosystem Descriptions */}
      <div>
        <h3 className="font-serif text-lg font-medium text-[#262320] dark:text-[#EDE8E1] mb-1">
          Hadoop Architecture & Tool Telemetry
        </h3>
        <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mb-4">
          Detailed functional delineation of each ecosystem component utilized across the analytical pipeline.
        </p>

        <div className="space-y-3.5">
          {HADOOP_DESC.map(h => (
            <div
              key={h.name}
              className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4 sm:p-5.5 flex gap-3.5 sm:gap-4 shadow-2xs"
            >
              <div
                className="w-1.5 rounded-full flex-shrink-0"
                style={{ background: h.color, minHeight: '60px' }}
              />
              <div>
                <h4 className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1] mb-1.5">
                  {h.name}
                </h4>
                <p className="text-xs text-[#524C44] dark:text-[#B8B2A7] leading-relaxed font-sans">
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Documentation */}
      <div className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4.5 sm:p-6 shadow-2xs">
        <h3 className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1] mb-1">
          Dataset Provenance & Documentation
        </h3>
        <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mb-4">
          Primary research corpus and development synthesis details.
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-[#EAE5DD] dark:border-[#383530] bg-[#FAF8F5] dark:bg-[#1D1C19] flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FAF4EE] dark:bg-[#362720] text-[#D97757] font-semibold border border-[#E8C8B3]/50">
              Primary Corpus
            </span>
            <div className="flex-1">
              <p className="font-serif text-sm font-medium text-[#262320] dark:text-[#EDE8E1]">
                US Accidents Dataset (Sobhan Moosavi et al.)
              </p>
              <a
                href="https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#D97757] hover:underline mt-0.5 font-mono break-all"
              >
                <span>kaggle.com/datasets/sobhanmoosavi/us-accidents</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
              <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mt-1 leading-relaxed">
                7.7M observations (2016–2023) detailing geo-coordinates, ambient weather, light, and severity.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#EAE5DD] dark:border-[#383530] bg-[#FAF8F5] dark:bg-[#1D1C19] flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FAF4EE] dark:bg-[#362720] text-[#D97757] font-semibold border border-[#E8C8B3]/50">
              Development
            </span>
            <div>
              <p className="font-serif text-sm font-medium text-[#262320] dark:text-[#EDE8E1]">
                Generated Synthetic Benchmark Dataset (50,000 Records)
              </p>
              <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mt-1 leading-relaxed">
                Reproducible 50,000-record test suite engineered with realistic spatial coordinate clusters, weather distributions, and diurnal rush-hour variations for evaluation without requiring multi-gigabyte external downloads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

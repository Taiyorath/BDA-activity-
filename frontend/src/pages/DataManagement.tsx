import { useState, useRef } from 'react'
import { hadoopService } from '../services/api'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import { Upload, File as FileIcon, CheckCircle2 } from 'lucide-react'

export default function DataManagement() {
  const [dragging, setDragging] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const DATASETS = [
    { name: 'synthetic_accidents.csv', size: '~5.2 MB', records: '50,000', type: 'SYNTHESIS', status: 'Ingested' },
    { name: 'accidents_clean.csv',     size: '~4.8 MB', records: '50,000', type: 'SANITIZED', status: 'Ready for Hadoop' },
  ]

  const STEPS = [
    { label: 'Parse raw CSV stream into memory buffer',                  status: 'done' },
    { label: 'Filter anomalous or null GPS coordinates (-90 to +90 / -180 to +180)', status: 'done' },
    { label: 'Deduplicate records by unique incident GUID',             status: 'done' },
    { label: 'Harmonize severity into 4-tier risk categories',          status: 'done' },
    { label: 'Deconstruct timestamps into diurnal hour, weekday, and month features', status: 'done' },
    { label: 'Standardize municipal strings and regional taxonomy',     status: 'done' },
    { label: 'Export sanitized CSV into /datasets/processed for HDFS', status: 'done' },
  ]

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Only CSV format files are accepted by the ingestion pipeline.')
      return
    }
    setUploading(true)
    try {
      const res = await hadoopService.uploadDataset(file)
      setUploadResult(res)
    } catch {
      setUploadResult({ error: 'Ingestion failed. Verify FastAPI backend connectivity.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#D97757] dark:text-[#E89578] mb-1">
          Dataset Ingestion & Sanitization
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight">
          Data Management & Pipeline Telemetry
        </h2>
        <p className="text-sm text-[#7A746B] dark:text-[#9A9387] mt-1 max-w-2xl leading-relaxed">
          Ingest raw municipal road accident logs, inspect file attributes, and trigger data cleansing transformations before HDFS loading.
        </p>
      </div>

      {/* Claude Drag and Drop Ingestion Box */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        onClick={() => fileRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-12 flex flex-col items-center gap-3.5 transition-all text-center
          ${dragging
            ? 'border-[#D97757] bg-[#FAF4EE] dark:bg-[#362720]'
            : 'border-[#EAE5DD] dark:border-[#383530] bg-white dark:bg-[#252421] hover:border-[#D97757]/60 hover:bg-[#FAF8F5] dark:hover:bg-[#2A2925]'
          }`}
      >
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        
        {uploading ? (
          <Spinner size="lg" />
        ) : uploadResult?.filename ? (
          <div className="w-14 h-14 rounded-2xl bg-[#EDF5EE] dark:bg-[#202E22] flex items-center justify-center text-[#4E8752]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-[#FAF4EE] dark:bg-[#362720] flex items-center justify-center text-[#D97757]">
            <Upload className="w-7 h-7" />
          </div>
        )}

        <div>
          <p className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1]">
            {uploading ? 'Processing Dataset Ingestion…' : uploadResult?.filename ? `Successfully Ingested: ${uploadResult.filename}` : 'Drop Accident CSV Dataset or Click to Upload'}
          </p>
          <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mt-1 max-w-md">
            Compatible with Kaggle US Accidents schema or Indian Open Government Data (data.gov.in) records. Stored to HDFS staging path.
          </p>
        </div>

        {uploadResult && !uploadResult.error && (
          <Badge variant="success">{uploadResult.size_kb} KB Ingested</Badge>
        )}
        {uploadResult?.error && (
          <Badge variant="danger">{uploadResult.error}</Badge>
        )}
      </div>

      {/* Dataset Ledger Table */}
      <div className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] overflow-hidden shadow-2xs">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4.5 border-b border-[#F0ECE4] dark:border-[#2F2D28] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <h3 className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1]">
            Active Dataset Files
          </h3>
          <span className="text-xs font-mono text-[#8C8479]">HDFS Staging Directory</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="border-b border-[#EAE5DD] dark:border-[#33312C] bg-[#FAF8F5] dark:bg-[#1D1C19]">
                {['File Name','Physical Size','Record Count','Dataset Class','Pipeline Readiness'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-serif font-medium text-[#7A746B] dark:text-[#9A9387]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4] dark:divide-[#2F2D28]">
              {DATASETS.map(d => (
                <tr key={d.name} className="hover:bg-[#FAF8F5] dark:hover:bg-[#2A2925] transition-colors">
                  <td className="px-6 py-3 flex items-center gap-2.5">
                    <FileIcon className="w-4 h-4 text-[#D97757]" />
                    <span className="font-mono font-medium text-[#262320] dark:text-[#EDE8E1]">{d.name}</span>
                  </td>
                  <td className="px-6 py-3 text-[#7A746B] dark:text-[#9A9387] font-mono">{d.size}</td>
                  <td className="px-6 py-3 font-mono font-medium text-[#262320] dark:text-[#EDE8E1]">{d.records}</td>
                  <td className="px-6 py-3">
                    <Badge variant="amber">{d.type}</Badge>
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant="success">{d.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preprocessing Pipeline Steps */}
      <div className="bg-white dark:bg-[#252421] rounded-2xl border border-[#EAE5DD] dark:border-[#383530] p-4.5 sm:p-6 shadow-2xs">
        <h3 className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1] mb-4">
          Data Sanitization & Preprocessing Workflow
        </h3>
        
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4E8752] flex-shrink-0 mt-0.5" />
              <span className="text-xs text-[#524C44] dark:text-[#B8B2A7] leading-relaxed">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-xl bg-[#EDF5EE] dark:bg-[#202E22] border border-[#CCE3CD]/50 dark:border-transparent flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#4E8752] flex-shrink-0" />
          <p className="text-xs text-[#3B723F] dark:text-[#78B97E] font-medium leading-relaxed">
            All preprocessing stages successfully validated. Clean dataset is formatted and partitioned for MapReduce streaming and Apache Hive external tables.
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState, Suspense, lazy, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { hotspotService } from '../services/api'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import {
  MapPin,
  Filter,
  Layers,
  Flame,
  Search,
  Crosshair,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart3,
  Calendar,
  Compass,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'

const AccidentMap = lazy(() => import('../components/maps/AccidentMap'))

const RISK_LEVELS = ['Low Risk', 'Moderate Risk', 'High Risk', 'Critical Risk']
const BADGE_VARIANTS: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'purple'> = {
  'Low Risk': 'default',
  'Moderate Risk': 'warning',
  'High Risk': 'danger',
  'Critical Risk': 'purple',
}

const CITY_COORDINATES: Record<string, [number, number]> = {
  'All Metros': [37.0902, -95.7129],
  'Houston': [29.7604, -95.3698],
  'Indianapolis': [39.7684, -86.1581],
  'Dallas': [32.7767, -96.7970],
  'Miami': [25.7617, -80.1918],
  'Austin': [30.2672, -97.7431],
  'Seattle': [47.6062, -122.3321],
  'Oklahoma City': [35.4676, -97.5164],
}

export default function BlackSpotDetection() {
  // Filter States (Defaulting to Houston Metropolitan Region as in Reference Workstation)
  const [selectedCity, setSelectedCity] = useState<string>('Houston')
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q4 2024')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedRisks, setSelectedRisks] = useState<Set<string>>(new Set(RISK_LEVELS))

  // Layer Toggles (mirroring the reference image workstation)
  const [showBaseMap, setShowBaseMap] = useState<boolean>(true)
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true)
  const [showNodes, setShowNodes] = useState<boolean>(true)
  const [showCorridors, setShowCorridors] = useState<boolean>(true)
  const [baseMapStyle, setBaseMapStyle] = useState<'dark' | 'light' | 'streets'>('dark')

  // Interactive Map Fly-To Target
  const [flyToTarget, setFlyToTarget] = useState<[number, number] | null>(null)

  // Fetch Hotspots with city filter
  const cityParam = selectedCity === 'All Metros' ? undefined : selectedCity
  const { data: hotspots = [], isLoading: isHotspotsLoading } = useQuery({
    queryKey: ['hotspots', cityParam],
    queryFn: () => hotspotService.getHotspots(undefined, cityParam, 350),
  })

  // Fetch Analytical Insights & Factors
  const { data: insights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ['hotspots-insights', cityParam],
    queryFn: () => hotspotService.getInsights(cityParam),
  })

  // Filter hotspots based on user selections
  const filteredHotspots = useMemo(() => {
    return hotspots.filter((h: any) => {
      const matchesRisk = selectedRisks.has(h.risk_level)
      const matchesSearch =
        searchTerm === '' ||
        (h.street && h.street.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (h.city && h.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (h.state && h.state.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesRisk && matchesSearch
    })
  }, [hotspots, selectedRisks, searchTerm])

  const toggleRisk = (risk: string) => {
    setSelectedRisks(prev => {
      const next = new Set(prev)
      next.has(risk) ? next.delete(risk) : next.add(risk)
      return next
    })
  }

  // Handle City Change
  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    const coord = CITY_COORDINATES[city]
    if (coord) {
      setFlyToTarget(coord)
    }
  }

  const handleFlyToIntersection = (lat: number, lng: number) => {
    setFlyToTarget([lat, lng])
  }

  const handleResetView = () => {
    const coord = CITY_COORDINATES[selectedCity] ?? [37.0902, -95.7129]
    setFlyToTarget([coord[0], coord[1]])
  }

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. WORKSTATION TOP BAR & HEADER (MATCHING USER'S MOCKUP) */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#EAE5DD] dark:border-[#2D2A26]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#FAF4EE] dark:bg-[#362720] text-[#D97757] border border-[#D97757]/30">
              <Sparkles className="w-3 h-3" />
              GIS PREDICTIVE MODELING
            </span>
            <span className="text-xs text-[#8C8479]">Hadoop Spatial MapReduce & PySpark ML</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-normal text-[#262320] dark:text-[#EDE8E1] tracking-tight">
            Predictive Modeling of Road Accident Hotspots
          </h1>
          <p className="text-xs md:text-sm text-[#7A746B] dark:text-[#9A9387] mt-0.5">
            Surface density estimation and high-risk corridor prioritization using open traffic and demographic data
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quarter Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#201F1C] border border-[#EAE5DD] dark:border-[#383530] text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#D97757]" />
            <select
              value={selectedQuarter}
              onChange={e => setSelectedQuarter(e.target.value)}
              className="bg-transparent text-[#262320] dark:text-[#EDE8E1] focus:outline-none cursor-pointer"
            >
              <option value="Q4 2024">Q4 2024</option>
              <option value="Q3 2024">Q3 2024</option>
              <option value="Q2 2024">Q2 2024</option>
              <option value="Q1 2024">Q1 2024</option>
              <option value="Full Year">FY 2024</option>
            </select>
          </div>

          {/* Metro Region Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#201F1C] border border-[#EAE5DD] dark:border-[#383530] text-xs">
            <Compass className="w-3.5 h-3.5 text-[#D97757]" />
            <select
              value={selectedCity}
              onChange={e => handleCityChange(e.target.value)}
              className="bg-transparent text-[#262320] dark:text-[#EDE8E1] font-medium focus:outline-none cursor-pointer"
            >
              {Object.keys(CITY_COORDINATES).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Search Corridor */}
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8479]" />
            <input
              type="text"
              placeholder="Search corridor or street..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8.5 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#201F1C] border border-[#EAE5DD] dark:border-[#383530] text-xs text-[#262320] dark:text-[#EDE8E1] focus:outline-none focus:border-[#D97757] w-full sm:w-44 md:w-56"
            />
          </div>

          {/* Basemap Style Selector */}
          <div className="flex rounded-xl overflow-hidden border border-[#EAE5DD] dark:border-[#383530] text-xs font-mono">
            <button
              onClick={() => setBaseMapStyle('dark')}
              className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                baseMapStyle === 'dark'
                  ? 'bg-[#262320] text-white dark:bg-[#3D3A35]'
                  : 'bg-white dark:bg-[#201F1C] text-[#7A746B]'
              }`}
              title="CartoDB Dark Matter (Matches Mockup)"
            >
              Dark
            </button>
            <button
              onClick={() => setBaseMapStyle('light')}
              className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                baseMapStyle === 'light'
                  ? 'bg-[#262320] text-white dark:bg-[#3D3A35]'
                  : 'bg-white dark:bg-[#201F1C] text-[#7A746B]'
              }`}
              title="CartoDB Positron Light"
            >
              Light
            </button>
            <button
              onClick={() => setBaseMapStyle('streets')}
              className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                baseMapStyle === 'streets'
                  ? 'bg-[#262320] text-white dark:bg-[#3D3A35]'
                  : 'bg-white dark:bg-[#201F1C] text-[#7A746B]'
              }`}
              title="OpenStreetMap Standard"
            >
              OSM
            </button>
          </div>

          {/* Reset Zoom */}
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-xl bg-white dark:bg-[#201F1C] border border-[#EAE5DD] dark:border-[#383530] text-[#7A746B] hover:text-[#D97757] transition-colors cursor-pointer"
            title="Reset Map Center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THREE-COLUMN WORKSTATION LAYOUT (AS SHOWN IN IMAGE)   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* -------------------------------------------------------- */}
        {/* LEFT COLUMN: INTERACTIVE LEGEND & LAYER CONTROLS (3 cols)*/}
        {/* -------------------------------------------------------- */}
        <div className="order-2 lg:order-1 lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-[#201F1C] rounded-2xl border border-[#EAE5DD] dark:border-[#2D2A26] p-4 sm:p-4.5 shadow-sm space-y-5">
            {/* Legend Header */}
            <div className="flex items-center justify-between border-b border-[#F0ECE4] dark:border-[#2D2A26] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D97757]" />
                <h3 className="font-serif text-sm font-semibold tracking-wider text-[#262320] dark:text-[#EDE8E1] uppercase">
                  Legend & Controls
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8C8479]">GIS v2.4</span>
            </div>

            {/* Layer Toggles (from reference image) */}
            <div className="space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#8C8479]">
                Active Overlay Layers
              </p>

              {/* Base Map Grid Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#2A2925] cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5 text-xs text-[#262320] dark:text-[#EDE8E1]">
                  <span className="w-3 h-3 rounded-sm bg-[#00e5ff]" />
                  <span>Base Map Grid</span>
                </div>
                <input
                  type="checkbox"
                  checked={showBaseMap}
                  onChange={e => setShowBaseMap(e.target.checked)}
                  className="rounded text-[#D97757] focus:ring-[#D97757] w-4 h-4 cursor-pointer accent-[#D97757]"
                />
              </label>

              {/* Heatmap Density Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#2A2925] cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5 text-xs text-[#262320] dark:text-[#EDE8E1]">
                  <Flame className="w-3.5 h-3.5 text-[#fb923c]" />
                  <span>Heatmap Density</span>
                </div>
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={e => setShowHeatmap(e.target.checked)}
                  className="rounded text-[#D97757] focus:ring-[#D97757] w-4 h-4 cursor-pointer accent-[#D97757]"
                />
              </label>

              {/* Incident Severity Nodes */}
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#2A2925] cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5 text-xs text-[#262320] dark:text-[#EDE8E1]">
                  <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <span>Incident Severity Nodes</span>
                </div>
                <input
                  type="checkbox"
                  checked={showNodes}
                  onChange={e => setShowNodes(e.target.checked)}
                  className="rounded text-[#D97757] focus:ring-[#D97757] w-4 h-4 cursor-pointer accent-[#D97757]"
                />
              </label>

              {/* Traffic Corridors */}
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#2A2925] cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5 text-xs text-[#262320] dark:text-[#EDE8E1]">
                  <span className="w-3.5 h-0.5 bg-[#f97316] border-t border-dashed" />
                  <span>Traffic Corridors</span>
                </div>
                <input
                  type="checkbox"
                  checked={showCorridors}
                  onChange={e => setShowCorridors(e.target.checked)}
                  className="rounded text-[#D97757] focus:ring-[#D97757] w-4 h-4 cursor-pointer accent-[#D97757]"
                />
              </label>
            </div>

            {/* Risk Stratification Filter */}
            <div className="space-y-2.5 pt-2 border-t border-[#F0ECE4] dark:border-[#2D2A26]">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#8C8479]">
                Risk Stratification
              </p>
              <div className="space-y-1.5">
                {RISK_LEVELS.map(rl => {
                  const active = selectedRisks.has(rl)
                  const count = hotspots.filter((h: any) => h.risk_level === rl).length
                  return (
                    <button
                      key={rl}
                      onClick={() => toggleRisk(rl)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                        active
                          ? 'bg-[#FAF4EE] dark:bg-[#2F2620] border-[#D97757]/30 text-[#262320] dark:text-[#EDE8E1]'
                          : 'bg-transparent border-transparent text-[#8C8479] opacity-60'
                      }`}
                    >
                      <Badge variant={BADGE_VARIANTS[rl]}>{rl}</Badge>
                      <span className="font-mono text-[11px] text-[#7A746B] dark:text-[#9A9387]">
                        {count} clusters
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Vertical Density Index Color Ramp (Directly from Mockup Image!) */}
            <div className="pt-2 border-t border-[#F0ECE4] dark:border-[#2D2A26]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#262320] dark:text-[#EDE8E1]">
                  Density Index
                </span>
                <span className="text-[10px] font-mono text-[#8C8479]">1.0 – 10.0</span>
              </div>

              <div className="flex items-center gap-3 bg-[#FAF8F5] dark:bg-[#181715] p-3 rounded-xl border border-[#EAE5DD] dark:border-[#2D2A26]">
                {/* Vertical Gradient Bar */}
                <div
                  className="w-4 h-36 rounded-md shadow-inner"
                  style={{
                    background: 'linear-gradient(to bottom, #dc2626 0%, #fb923c 25%, #facc15 50%, #2563eb 75%, #00e5ff 100%)',
                  }}
                />

                {/* Scale Indicators */}
                <div className="flex flex-col justify-between h-36 text-[10px] font-mono text-[#7A746B] dark:text-[#9A9387]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#ef4444]">10.0</span>
                    <span className="text-[#8C8479]">Critical Core</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[#fb923c]">7.5</span>
                    <span className="text-[#8C8479]">Severe Hotspot</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[#eab308]">5.0</span>
                    <span className="text-[#8C8479]">Moderate Risk</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[#3b82f6]">2.5</span>
                    <span className="text-[#8C8479]">Elevated Flow</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[#00e5ff]">1.0</span>
                    <span className="text-[#8C8479]">Baseline Surface</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* CENTER COLUMN: FULL INTERACTIVE GIS MAP (6 cols)         */}
        {/* -------------------------------------------------------- */}
        <div className="order-1 lg:order-2 lg:col-span-6 space-y-2">
          <div className="relative rounded-2xl overflow-hidden border border-[#EAE5DD] dark:border-[#2D2A26] bg-[#0e0e11] shadow-md">
            {/* Top Map Header Overlay (Matches photo style) */}
            <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-[1000] flex flex-row items-center justify-between gap-1.5 pointer-events-none">
              <div className="bg-[#181715]/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/10 shadow-lg pointer-events-auto max-w-[65%] sm:max-w-none">
                <p className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-white/90 font-semibold flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse flex-shrink-0" />
                  <span className="truncate">HOTSPOTS — {selectedCity.toUpperCase()}</span>
                </p>
              </div>

              <div className="bg-[#181715]/90 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-xl border border-white/10 shadow-lg pointer-events-auto flex items-center gap-1.5 text-[9px] sm:text-[11px] font-mono text-white/80 flex-shrink-0">
                <span>{selectedQuarter}</span>
                <span className="text-[#D97757]">|</span>
                <span>{filteredHotspots.length} Clusters</span>
              </div>
            </div>

            {/* Leaflet Vector & Heatmap Display */}
            {isHotspotsLoading ? (
              <div className="h-[400px] sm:h-[500px] lg:h-[620px] flex flex-col items-center justify-center bg-[#181715] text-[#8C8479] space-y-3">
                <Spinner size="lg" />
                <p className="text-xs font-mono">Aggregating Hadoop HDFS Geo-Coordinates...</p>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="h-[400px] sm:h-[500px] lg:h-[620px] flex items-center justify-center bg-[#181715]">
                    <Spinner size="lg" />
                  </div>
                }
              >
                <AccidentMap
                  hotspots={filteredHotspots}
                  center={CITY_COORDINATES[selectedCity] ?? [37.0902, -95.7129]}
                  zoom={selectedCity === 'All Metros' ? 4 : 11}
                  showBaseMap={showBaseMap}
                  showHeatmap={showHeatmap}
                  showNodes={showNodes}
                  showCorridors={showCorridors}
                  baseMapStyle={baseMapStyle}
                  flyToTarget={flyToTarget}
                />
              </Suspense>
            )}

            {/* Bottom Status Ribbon on Map */}
            <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-[1000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 pointer-events-none">
              <div className="bg-[#181715]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[9px] sm:text-[10px] font-mono text-white/70 pointer-events-auto truncate max-w-full">
                Projection: EPSG:4326 · Resolution: 0.01° (~1.1 km Grid)
              </div>
              <div className="bg-[#181715]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[9px] sm:text-[10px] font-mono text-[#D97757] pointer-events-auto">
                Continuous Density Heatmap Active
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* RIGHT COLUMN: "DATA INSIGHTS" PANEL (3 cols)             */}
        {/* Directly inspired by user's photo with all typos corrected*/}
        {/* -------------------------------------------------------- */}
        <div className="order-3 lg:order-3 lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-[#201F1C] rounded-2xl border border-[#EAE5DD] dark:border-[#2D2A26] p-4 sm:p-4.5 shadow-sm space-y-5">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-[#F0ECE4] dark:border-[#2D2A26] pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#D97757]" />
                <h3 className="font-serif text-sm font-semibold tracking-wider text-[#262320] dark:text-[#EDE8E1] uppercase">
                  Data Insights
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Real-Time Data Feed" />
            </div>

            {/* Section 1: Top 5 Riskiest Intersections */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#262320] dark:text-[#EDE8E1]">
                  Top 5 Riskiest Intersections
                </h4>
              </div>
              <p className="text-[11px] text-[#D97757] font-mono">
                Peak Risk Window: Active (17:00 – 19:00 PM)
              </p>

              {isInsightsLoading ? (
                <div className="py-6 flex justify-center"><Spinner size="sm" /></div>
              ) : (
                <div className="space-y-2">
                  {insights?.top_intersections?.slice(0, 5).map((spot: any) => (
                    <div
                      key={spot.rank}
                      className="group p-2.5 rounded-xl border border-[#F0ECE4] dark:border-[#2D2A26] hover:border-[#D97757]/40 bg-[#FAF8F5] dark:bg-[#181715] transition-all"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono bg-[#D97757] text-white">
                            {spot.rank}
                          </span>
                          <span className="text-xs font-semibold text-[#262320] dark:text-[#EDE8E1] truncate max-w-[130px]">
                            {spot.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleFlyToIntersection(spot.lat, spot.lng)}
                          className="p-1 rounded-md text-[#7A746B] group-hover:text-[#D97757] hover:bg-white dark:hover:bg-[#252421] transition-colors cursor-pointer"
                          title="Fly to this intersection"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] mt-1.5 text-[#7A746B] dark:text-[#9A9387]">
                        <span>{spot.city}, {spot.state}</span>
                        <span className="font-mono font-medium text-[#C95742]">
                          {spot.total_accidents} Collisions
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#8C8479] mt-1 pt-1 border-t border-[#EAE5DD]/60 dark:border-[#2D2A26]">
                        <span>Density: {spot.density_index}</span>
                        <span>{spot.peak_window}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Primary Contributing Factors (Photo had typo 'PRMMACK IGNTTINOS') */}
            <div className="space-y-2 pt-2 border-t border-[#F0ECE4] dark:border-[#2D2A26]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#262320] dark:text-[#EDE8E1]">
                Primary Contributing Factors
              </h4>
              <div className="space-y-2 pt-1">
                {(insights?.contributing_factors || [
                  { factor: 'Traffic Flow (Congestion)', percentage: 58, color: '#D97757' },
                  { factor: 'Roadway Geometry', percentage: 24, color: '#D48B38' },
                  { factor: 'Surface Friction', percentage: 18, color: '#4E8752' },
                ]).map((cf: any) => (
                  <div key={cf.factor} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#524C44] dark:text-[#B8B2A7]">{cf.factor}</span>
                      <span className="font-mono font-bold text-[#262320] dark:text-[#EDE8E1]">
                        {cf.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#FAF4EE] dark:bg-[#181715] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cf.percentage}%`, backgroundColor: cf.color || '#D97757' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Contributing Environmental Hazards (Photo had typo 'CONTRBUTING FACTORS') */}
            <div className="space-y-2 pt-2 border-t border-[#F0ECE4] dark:border-[#2D2A26]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#262320] dark:text-[#EDE8E1]">
                Contributing Environmental Hazards
              </h4>
              <div className="space-y-2 pt-1">
                {(insights?.environmental_factors || [
                  { factor: 'Wet / Slick Surface', percentage: 42 },
                  { factor: 'Low Visibility / Fog', percentage: 26 },
                  { factor: 'Night / Unlit Corridor', percentage: 32 },
                ]).map((ef: any) => (
                  <div key={ef.factor} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#524C44] dark:text-[#B8B2A7]">{ef.factor}</span>
                      <span className="font-mono font-semibold text-[#D97757]">
                        {ef.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#FAF4EE] dark:bg-[#181715] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8C8479]/40 dark:bg-[#8C8479]/50 rounded-full"
                        style={{ width: `${ef.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Diurnal & Seasonal Trends Scatter Curve */}
            <div className="space-y-2 pt-2 border-t border-[#F0ECE4] dark:border-[#2D2A26]">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#262320] dark:text-[#EDE8E1]">
                  Diurnal & Seasonal Trends
                </h4>
                <span className="text-[10px] font-mono text-[#8C8479]">24h Curve</span>
              </div>

              <div className="h-28 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={insights?.hourly_density || []}
                    margin={{ top: 5, right: 0, left: -25, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 9, fill: '#8C8479' }}
                      interval={3}
                      stroke="none"
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: '#8C8479' }}
                      stroke="none"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="p-1.5 rounded-lg bg-[#262320] text-white text-[10px] font-mono shadow-md">
                              <div>{data.hour}: {data.incidents} incidents</div>
                              <div className="text-[#D97757]">Density: {data.density} / 10</div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar
                      dataKey="incidents"
                      fill="#D97757"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. RANKED HIGH-RISK BLACK SPOT INCIDENT LEDGER TABLE     */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-[#201F1C] rounded-2xl border border-[#EAE5DD] dark:border-[#2D2A26] overflow-hidden shadow-sm">
        <div className="px-6 py-4.5 border-b border-[#F0ECE4] dark:border-[#2D2A26] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-base font-medium text-[#262320] dark:text-[#EDE8E1]">
              Ranked High-Risk Black Spot Ledger
            </h3>
            <p className="text-xs text-[#7A746B] dark:text-[#9A9387] mt-0.5">
              Clusters computed by spatial MapReduce partitioner with composite weighting
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C8479]">
            <span>Showing top {Math.min(filteredHotspots.length, 50)} of {filteredHotspots.length} clusters</span>
          </div>
        </div>

        {isHotspotsLoading ? (
          <div className="p-12 flex justify-center"><Spinner /></div>
        ) : filteredHotspots.length === 0 ? (
          <EmptyState
            icon={<MapPin className="w-6 h-6 text-[#D97757]" />}
            title="No Black Spots Match Filters"
            description="Adjust your risk category filters above to surface geo-clusters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[850px]">
              <thead>
                <tr className="border-b border-[#EAE5DD] dark:border-[#2D2A26] bg-[#FAF8F5] dark:bg-[#181715]">
                  {['Rank', 'Intersection Corridor', 'Municipality', 'Total Collisions', 'Severe (L4)', 'Peak Window', 'Primary Factor', 'Density Index', 'Risk Classification', 'Map Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-serif font-medium text-[#7A746B] dark:text-[#9A9387]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE4] dark:divide-[#2D2A26]">
                {filteredHotspots.slice(0, 50).map((h: any, i: number) => (
                  <tr
                    key={i}
                    className="hover:bg-[#FAF8F5] dark:hover:bg-[#2A2925] transition-colors"
                  >
                    <td className="px-5 py-3 font-mono font-medium text-[#8C8479]">#{i + 1}</td>
                    <td className="px-5 py-3 font-medium text-[#262320] dark:text-[#EDE8E1]">
                      {h.street || 'Arterial Corridor'}
                    </td>
                    <td className="px-5 py-3 text-[#7A746B] dark:text-[#9A9387]">{h.city}, {h.state}</td>
                    <td className="px-5 py-3 font-mono font-medium text-[#262320] dark:text-[#EDE8E1]">
                      {h.total_accidents.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-mono text-[#C95742] font-semibold">
                      {h.severe_accidents.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-mono text-[#D48B38]">
                      {h.peak_hour || '17:00–19:00'}
                    </td>
                    <td className="px-5 py-3 text-[#524C44] dark:text-[#B8B2A7]">
                      {h.top_weather || 'Clear'} ({h.top_road || 'Dry'})
                    </td>
                    <td className="px-5 py-3 font-mono font-serif font-bold text-[#D97757]">
                      {h.density_index ?? (h.risk_score / 10).toFixed(1)} / 10
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={BADGE_VARIANTS[h.risk_level] ?? 'default'}>
                        {h.risk_level}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleFlyToIntersection(h.lat, h.lng)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#FAF4EE] dark:bg-[#362720] text-[#D97757] hover:bg-[#D97757] hover:text-white transition-colors cursor-pointer"
                      >
                        <Crosshair className="w-3 h-3" />
                        <span>Locate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. METHODOLOGY & HADOOP ENGINE DOCUMENTATION             */}
      {/* ======================================================== */}
      <div className="bg-[#FAF8F5] dark:bg-[#1C1B18] rounded-2xl border border-[#EAE5DD] dark:border-[#2D2A26] p-4.5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#D97757]" />
          <h3 className="font-serif text-base font-semibold text-[#262320] dark:text-[#EDE8E1]">
            Hadoop Ecosystem Computational Pipeline for Black Spot Analytics
          </h3>
        </div>
        <p className="text-xs text-[#7A746B] dark:text-[#9A9387] leading-relaxed">
          The identification of road black spots follows an academic spatial clustering framework implemented across the Apache Hadoop ecosystem:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-white dark:bg-[#252421] border border-[#EAE5DD] dark:border-[#2D2A26]">
            <p className="font-mono text-xs font-semibold text-[#D97757] mb-1">1. HDFS & MapReduce</p>
            <p className="text-xs text-[#524C44] dark:text-[#B8B2A7] leading-relaxed">
              Spatial partitioner groups latitude and longitude into 0.01° spatial grids. Reducers calculate accident frequency, casualty severity, and composite index.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#252421] border border-[#EAE5DD] dark:border-[#2D2A26]">
            <p className="font-mono text-xs font-semibold text-[#D97757] mb-1">2. Apache Hive SQL</p>
            <p className="text-xs text-[#524C44] dark:text-[#B8B2A7] leading-relaxed">
              Analytical window functions rank locations by 95th, 85th, and 70th percentile risk scores to stratify clusters into Critical, High, and Moderate Risk.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#252421] border border-[#EAE5DD] dark:border-[#2D2A26]">
            <p className="font-mono text-xs font-semibold text-[#D97757] mb-1">3. PySpark Density Surface</p>
            <p className="text-xs text-[#524C44] dark:text-[#B8B2A7] leading-relaxed">
              Kernel Density Estimation (KDE) interpolates collision frequency into a continuous surface density index (1.0 to 10.0 scale) rendered directly in the GIS map.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

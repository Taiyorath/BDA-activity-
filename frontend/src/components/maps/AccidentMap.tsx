import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Badge from '../ui/Badge'
import HeatmapLayer, { HeatPoint } from './HeatmapLayer'

// Ensure L is on window
if (typeof window !== 'undefined') {
  ;(window as any).L = L
}

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Earthy Terracotta & Risk palette
const RISK_COLORS: Record<string, string> = {
  'Low Risk':      '#3b82f6', // Cyan / Blue edge
  'Moderate Risk': '#eab308', // Amber Ochre
  'High Risk':     '#f97316', // Orange
  'Critical Risk': '#ef4444', // Red Core
}

const BADGE_VARIANTS: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'purple'> = {
  'Low Risk':      'default',
  'Moderate Risk': 'warning',
  'High Risk':     'danger',
  'Critical Risk': 'purple',
}

export interface Hotspot {
  lat: number
  lng: number
  city: string
  state: string
  street?: string
  peak_hour?: string
  top_weather?: string
  top_road?: string
  total_accidents: number
  severe_accidents: number
  moderate_accidents: number
  minor_accidents: number
  risk_score: number
  risk_level: string
  density_index?: number
}

interface MapFlyProps {
  target: [number, number] | null
  zoom?: number
}

function MapFlyController({ target, zoom = 12 }: MapFlyProps) {
  const map = useMap()
  useEffect(() => {
    if (target) {
      map.flyTo(target, zoom, {
        duration: 1.8,
        easeLinearity: 0.25,
      })
    }
  }, [map, target, zoom])
  return null
}

interface AccidentMapProps {
  hotspots: Hotspot[]
  center?: [number, number]
  zoom?: number
  height?: string
  showBaseMap?: boolean
  showHeatmap?: boolean
  showNodes?: boolean
  showCorridors?: boolean
  baseMapStyle?: 'dark' | 'light' | 'streets'
  flyToTarget?: [number, number] | null
}

export default function AccidentMap({
  hotspots,
  center = [37.09, -95.71], // Center US
  zoom = 4,
  height = '620px',
  showBaseMap = true,
  showHeatmap = true,
  showNodes = true,
  showCorridors = true,
  baseMapStyle = 'dark',
  flyToTarget = null,
}: AccidentMapProps) {
  // Tile URLs (Using CartoDB Fastly CDN: Ultra-clean Dark Matter & Positron, zero watermark, exactly matching reference image)
  const tileUrls = {
    dark: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
    light: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  }

  // Generate heatmap points with normalized intensity
  const heatPoints: HeatPoint[] = hotspots.map(h => ({
    lat: h.lat,
    lng: h.lng,
    intensity: Math.min(1.0, Math.max(0.15, (h.density_index ?? (h.risk_score / 100)) / 10)),
  }))

  // Derive corridor lines between nearby critical/high-risk spots for visual arterial connection
  const criticalSpots = hotspots.filter(h => h.risk_level === 'Critical Risk' || h.risk_level === 'High Risk')
  const corridorLines: [number, number][][] = []
  if (showCorridors && criticalSpots.length > 1) {
    for (let i = 0; i < Math.min(criticalSpots.length, 30); i++) {
      for (let j = i + 1; j < Math.min(criticalSpots.length, 30); j++) {
        const dLat = Math.abs(criticalSpots[i].lat - criticalSpots[j].lat)
        const dLng = Math.abs(criticalSpots[i].lng - criticalSpots[j].lng)
        // If close enough to be an arterial link within metropolitan area
        if (dLat < 0.25 && dLng < 0.25) {
          corridorLines.push([
            [criticalSpots[i].lat, criticalSpots[i].lng],
            [criticalSpots[j].lat, criticalSpots[j].lng],
          ])
        }
      }
    }
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E8E4DC] dark:border-[#2D2A26] shadow-sm">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-[400px] sm:h-[500px] lg:h-[620px] w-full"
        style={{ background: '#0e0e11' }}
        scrollWheelZoom
        attributionControl={false}
      >
        <MapFlyController target={flyToTarget} />

        {/* Dynamic Vector Basemap */}
        {showBaseMap && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            className={baseMapStyle === 'dark' ? 'dark-map-tiles' : ''}
          />
        )}

        {/* Predictive Heatmap Continuous Density Surface */}
        {showHeatmap && heatPoints.length > 0 && (
          <HeatmapLayer points={heatPoints} radius={32} blur={24} maxZoom={16} max={1.0} />
        )}

        {/* Arterial Traffic Corridors */}
        {showCorridors &&
          corridorLines.map((line, idx) => (
            <Polyline
              key={`corridor-${idx}`}
              positions={line}
              pathOptions={{
                color: '#f97316',
                weight: 2,
                opacity: 0.45,
                dashArray: '4, 6',
              }}
            />
          ))}

        {/* Hotspot Incident Severity Nodes */}
        {showNodes &&
          hotspots.map((spot, i) => {
            const color = RISK_COLORS[spot.risk_level] ?? '#8C8479'
            const radius = Math.min(18, Math.max(5.5, (spot.density_index ?? 3) * 1.5))
            return (
              <CircleMarker
                key={`node-${i}`}
                center={[spot.lat, spot.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.85,
                  color: '#ffffff',
                  weight: 1.2,
                  opacity: 0.9,
                }}
              >
                <Popup maxWidth={300}>
                  <div className="p-1 font-sans">
                    <div className="font-serif text-sm font-semibold text-[#262320] dark:text-[#EDE8E1] mb-2 border-b border-[#F0ECE4] dark:border-[#383530] pb-1.5 flex items-center justify-between">
                      <span className="truncate pr-2 font-bold">{spot.street || `${spot.city}, ${spot.state}`}</span>
                      <Badge variant={BADGE_VARIANTS[spot.risk_level] ?? 'default'}>
                        {spot.risk_level}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-[#524C44] dark:text-[#B8B2A7]">
                      <div className="flex justify-between py-0.5">
                        <span className="text-[#8C8479]">Municipality:</span>
                        <span className="font-semibold text-[#262320] dark:text-[#EDE8E1]">{spot.city}, {spot.state}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-[#8C8479]">Total Incidents:</span>
                        <span className="font-semibold text-[#262320] dark:text-[#EDE8E1]">{spot.total_accidents.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-[#8C8479]">Severe Incidents:</span>
                        <span className="font-semibold text-[#ef4444]">{spot.severe_accidents.toLocaleString()}</span>
                      </div>
                      {spot.peak_hour && (
                        <div className="flex justify-between py-0.5">
                          <span className="text-[#8C8479]">Peak Risk Window:</span>
                          <span className="font-medium text-[#D97757]">{spot.peak_hour}</span>
                        </div>
                      )}
                      {spot.top_weather && (
                        <div className="flex justify-between py-0.5">
                          <span className="text-[#8C8479]">Primary Factor:</span>
                          <span className="font-medium">{spot.top_weather} / {spot.top_road || 'Dry'}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-1.5 border-t border-[#F0ECE4] dark:border-[#383530]">
                        <span className="font-medium">Density Index:</span>
                        <span className="font-serif font-bold text-[#D97757]">{spot.density_index ?? (spot.risk_score / 10).toFixed(1)} / 10.0</span>
                      </div>
                      <div className="text-[10px] text-[#8C8479] font-mono pt-1 text-right">
                        [{spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}]
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
      </MapContainer>
    </div>
  )
}

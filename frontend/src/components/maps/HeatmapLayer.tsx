import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

// Ensure L is available on window for Leaflet plugins
if (typeof window !== 'undefined') {
  ;(window as any).L = L
}

export interface HeatPoint {
  lat: number
  lng: number
  intensity: number // 0.1 to 1.0
}

interface HeatmapLayerProps {
  points: HeatPoint[]
  radius?: number
  blur?: number
  maxZoom?: number
  max?: number
}

export default function HeatmapLayer({
  points,
  radius = 32,
  blur = 22,
  maxZoom = 16,
  max = 1.0,
}: HeatmapLayerProps) {
  const map = useMap()

  useEffect(() => {
    if (!map || !points || points.length === 0) return

    let heatLayer: any = null
    let isCancelled = false

    const createHeatLayer = () => {
      if (isCancelled || !map) return
      const heatData = points.map(p => [p.lat, p.lng, p.intensity] as [number, number, number])

      if (typeof (L as any).heatLayer === 'function') {
        heatLayer = (L as any).heatLayer(heatData, {
          radius,
          blur,
          maxZoom,
          max,
          minOpacity: 0.35,
          gradient: {
            0.15: '#00e5ff', // Cyan
            0.35: '#2563eb', // Electric Blue
            0.55: '#facc15', // Amber Yellow
            0.75: '#fb923c', // Terracotta Orange
            1.00: '#dc2626', // Deep Red Core
          },
        })
        heatLayer.addTo(map)
      }
    }

    if (typeof (L as any).heatLayer === 'function') {
      createHeatLayer()
    } else {
      // Dynamically import leaflet.heat after window.L is firmly attached
      import('leaflet.heat')
        .then(() => {
          createHeatLayer()
        })
        .catch(err => {
          console.warn('Leaflet.heat module failed to load:', err)
        })
    }

    return () => {
      isCancelled = true
      if (map && heatLayer) {
        try {
          map.removeLayer(heatLayer)
        } catch (_) {}
      }
    }
  }, [map, points, radius, blur, maxZoom, max])

  return null
}

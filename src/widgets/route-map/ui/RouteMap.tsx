import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapPoint } from '@/entities/destination'
import { fetchDrivingRoute } from '@/shared/lib/osrm'
import { useTheme } from '@/shared/lib/theme'
import styles from './RouteMap.module.scss'

export type RouteLegInfo = {
  from: string
  to: string
  km: number
  min: number
}

type Props = {
  points: MapPoint[]
  activeId?: string
  visitedIds?: string[]
  nextId?: string
  onSelect?: (id: string) => void
  onDirections?: (info: { distanceKm: number; travelMin: number; legs: RouteLegInfo[] }) => void
}

function pin(
  label: string,
  role: MapPoint['role'],
  state: { active?: boolean; visited?: boolean; next?: boolean },
) {
  const tone = state.visited
    ? styles.pinDone : role === 'origin' ? styles.pinOrigin : role === 'finish' ? styles.pinFinish : styles.pinStop
  const ring = state.next || state.active ? styles.pinOn : ''
  return L.divIcon({
    className: `leaflet-div-icon ${styles.pinWrap}`,
    html: `<span class="${styles.pin} ${tone} ${ring}">${state.visited ? '✓' : label}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

function pathKey(points: MapPoint[]) {
  return points.map((point) => `${point.id}:${point.lat}:${point.lng}`).join('|')
}

const FIT = { padding: [56, 56] as [number, number], maxZoom: 12, animate: false }

function cssColor(node: HTMLElement | null, name: string, fallback: string) {
  if (!node) return fallback
  return getComputedStyle(node).getPropertyValue(name).trim() || fallback
}

export function RouteMap({
  points,
  activeId,
  visitedIds = [],
  nextId,
  onSelect,
  onDirections,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const lineRef = useRef<L.LayerGroup | null>(null)
  const lastFitKey = useRef('')
  const onSelectRef = useRef(onSelect)
  const onDirectionsRef = useRef(onDirections)
  onSelectRef.current = onSelect
  onDirectionsRef.current = onDirections
  const pointsRef = useRef(points)
  pointsRef.current = points
  const routeKey = pathKey(points)
  const visitedKey = visitedIds.join(',')
  const { theme } = useTheme()

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const map = L.map(frame, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
    }).setView([53.7, 27.6], 7)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)
    markersRef.current = L.layerGroup().addTo(map)
    lineRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    const frameId = requestAnimationFrame(() => map.invalidateSize())
    const observer = new ResizeObserver(() => {
      map.invalidateSize({ animate: false })
    })
    observer.observe(frame)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frameId)
      map.remove()
      mapRef.current = null
      markersRef.current = null
      lineRef.current = null
    }
  }, [])

  useEffect(() => {
    const group = markersRef.current
    if (!group) return
    group.clearLayers()
    pointsRef.current.forEach((point, index) => {
      const visited = visitedIds.includes(point.id)
      L.marker([point.lat, point.lng], {
        icon: pin(String(index + 1), point.role, {
          active: activeId === point.id,
          visited,
          next: nextId === point.id,
        }),
        title: visited ? `${point.title} · посещено` : `${index + 1}. ${point.title}`,
        zIndexOffset: nextId === point.id ? 500 : visited ? 150 : 200,
      })
        .on('click', () => onSelectRef.current?.(point.id))
        .addTo(group)
    })
  }, [activeId, routeKey, visitedKey, nextId, visitedIds])

  useEffect(() => {
    const map = mapRef.current
    const lineGroup = lineRef.current
    if (!map || !lineGroup) return
    const current = pointsRef.current
    lineGroup.clearLayers()

    if (current.length === 1) {
      map.setView([current[0].lat, current[0].lng], 10, { animate: false })
      lastFitKey.current = routeKey
      return
    }

    if (current.length < 2) return

    const controller = new AbortController()
    fetchDrivingRoute(current, controller.signal)
      .then((route) => {
        if (!route || !lineRef.current || !mapRef.current) return
        L.polyline(route.coords, {
          color: cssColor(frameRef.current, '--color-cta', '#c0360c'),
          weight: 5,
          opacity: 1,
          renderer: L.canvas({ padding: 0.5 }),
        }).addTo(lineRef.current)
        onDirectionsRef.current?.({
          distanceKm: route.distanceKm,
          travelMin: route.travelMin,
          legs: route.legs.map((leg, index) => ({
            from: current[index]?.title ?? '',
            to: current[index + 1]?.title ?? '',
            km: leg.km,
            min: leg.min,
          })),
        })
        if (lastFitKey.current !== routeKey) {
          const lineBounds = L.latLngBounds(route.coords)
          if (lineBounds.isValid()) {
            mapRef.current.fitBounds(lineBounds, FIT)
          }
          lastFitKey.current = routeKey
        }
      })
      .catch(() => undefined)

    return () => controller.abort()
  }, [routeKey])

  useEffect(() => {
    const color = cssColor(frameRef.current, '--color-cta', '#c0360c')
    lineRef.current?.eachLayer((layer) => {
      if (layer instanceof L.Polyline) layer.setStyle({ color })
    })
  }, [theme])

  return <div className={styles.root} ref={frameRef} />
}

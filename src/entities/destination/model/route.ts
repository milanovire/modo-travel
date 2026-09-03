import type { DurationId } from '@/entities/trip-preference'
import { START_POINTS, haversineKm, travelMin } from './geo'
import type { StartId } from './geo'
import type { Destination, RouteStop } from './types'

export type MapPoint = {
  id: string
  title: string
  text: string
  lat: number
  lng: number
  durationMin: number
  role: 'origin' | 'stop' | 'finish'
}

export function resolveOrigin(startId: StartId): MapPoint {
  const hub = START_POINTS.find((item) => item.id === startId) ?? START_POINTS[0]
  return {
    id: hub.id,
    title: hub.title,
    text: 'Точка отправления',
    lat: hub.lat,
    lng: hub.lng,
    durationMin: 0,
    role: 'origin',
  }
}

export function defaultStopIds(destination: Destination, duration: DurationId): string[] {
  return destination.stops
    .filter((item) => item.defaultFor.includes(duration))
    .map((item) => item.id)
}

export function pointsFromIds(
  destination: Destination,
  ids: string[],
  origin: MapPoint,
): MapPoint[] {
  const selected = ids
    .map((id) => destination.stops.find((item) => item.id === id))
    .filter((item): item is RouteStop => Boolean(item))
    .map((item, index, list) => ({
      id: item.id,
      title: item.title,
      text: item.text,
      lat: item.lat,
      lng: item.lng,
      durationMin: item.durationMin,
      role: (index === list.length - 1 ? 'finish' : 'stop') as MapPoint['role'],
    }))
  return [origin, ...selected]
}

export function routeStats(points: MapPoint[]) {
  let distanceKm = 0
  let travel = 0
  const legs: Array<{ from: string; to: string; km: number; min: number }> = []
  for (let index = 1; index < points.length; index += 1) {
    const km = haversineKm(points[index - 1], points[index])
    const min = travelMin(km)
    distanceKm += km
    travel += min
    legs.push({
      from: points[index - 1].title,
      to: points[index].title,
      km,
      min,
    })
  }
  const stay = points.reduce((sum, item) => sum + item.durationMin, 0)
  return {
    distanceKm,
    travelMin: travel,
    stayMin: stay,
    totalMin: travel + stay,
    legs,
  }
}

export function formatMinutes(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  if (hours === 0) return `${minutes} мин`
  if (minutes === 0) return `${hours} ч`
  return `${hours} ч ${minutes} мин`
}

export function estimateBudget(baseLabel: string, days: number, extraStops: number) {
  const match = baseLabel.match(/(\d+)/)
  const low = match ? Number(match[1]) : 90
  const total = (low + extraStops * 18) * Math.max(1, days)
  return `около ${total} BYN на человека`
}

export function durationDays(duration: DurationId) {
  if (duration === 'day') return 1
  if (duration === 'weekend') return 2
  return 7
}

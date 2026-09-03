export type DrivingLeg = {
  km: number
  min: number
}

export type DrivingRoute = {
  coords: Array<[number, number]>
  distanceKm: number
  travelMin: number
  legs: DrivingLeg[]
}

export async function fetchDrivingRoute(
  points: Array<{ lat: number; lng: number }>,
  signal?: AbortSignal,
): Promise<DrivingRoute | null> {
  if (points.length < 2) return null
  const path = points.map((point) => `${point.lng},${point.lat}`).join(';')
  const url = `https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson`
  const response = await fetch(url, { signal })
  if (!response.ok) return null
  const data = (await response.json()) as {
    code?: string
    routes?: Array<{
      distance: number
      duration: number
      geometry?: { coordinates: Array<[number, number]> }
      legs?: Array<{ distance: number; duration: number }>
    }>
  }
  const route = data.routes?.[0]
  if (data.code !== 'Ok' || !route?.geometry?.coordinates?.length) return null
  return {
    coords: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanceKm: Math.round(route.distance / 1000),
    travelMin: Math.round(route.duration / 60),
    legs: (route.legs ?? []).map((leg) => ({
      km: Math.round(leg.distance / 1000),
      min: Math.round(leg.duration / 60),
    })),
  }
}

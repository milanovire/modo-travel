export const MINSK = {
  id: 'minsk',
  title: 'Минск',
  text: 'Точка отправления',
  lat: 53.9023,
  lng: 27.5619,
}

export const START_POINTS = [
  { id: 'minsk', title: 'Минск', lat: 53.9023, lng: 27.5619 },
  { id: 'brest', title: 'Брест', lat: 52.0975, lng: 23.6877 },
  { id: 'grodno', title: 'Гродно', lat: 53.6694, lng: 23.8131 },
  { id: 'vitebsk', title: 'Витебск', lat: 55.1904, lng: 30.2049 },
  { id: 'gomel', title: 'Гомель', lat: 52.4412, lng: 30.9878 },
] as const

export type StartId = (typeof START_POINTS)[number]['id']

export const ORIGIN_CHOICES: Array<{ id: StartId; title: string }> = START_POINTS.map((item) => ({
  id: item.id,
  title: item.title,
}))

export function parseStartId(value: string | null): StartId {
  if (START_POINTS.some((item) => item.id === value)) {
    return value as StartId
  }
  return 'minsk'
}


const LAT_MIN = 51.22
const LAT_MAX = 56.22
const LNG_MIN = 23.05
const LNG_MAX = 32.85

export function project(lat: number, lng: number, width: number, height: number, pad = 56) {
  const x = pad + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (width - pad * 2)
  const y = pad + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (height - pad * 2)
  return { x, y }
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(s)))
}

export function travelMin(km: number) {
  return Math.max(20, Math.round((km / 72) * 60))
}

export const BELARUS_OUTLINE: Array<[number, number]> = [
  [23.6, 53.96],
  [23.45, 53.4],
  [23.18, 52.35],
  [23.4, 51.78],
  [23.65, 51.52],
  [24.4, 51.5],
  [26.2, 51.55],
  [27.8, 51.32],
  [29.2, 51.28],
  [30.55, 51.45],
  [31.8, 51.85],
  [32.72, 52.25],
  [32.55, 53.05],
  [32.1, 53.85],
  [31.3, 54.55],
  [30.85, 55.35],
  [29.55, 56.12],
  [28.15, 56.16],
  [27.15, 55.85],
  [26.35, 55.35],
  [25.55, 54.85],
  [24.55, 54.32],
  [23.85, 54.12],
  [23.6, 53.96],
]

export const BELARUS_RIVERS: Array<Array<[number, number]>> = [
  [
    [23.7, 53.68],
    [24.4, 53.6],
    [25.3, 53.52],
    [26.1, 53.4],
  ],
  [
    [23.7, 52.08],
    [25.2, 52.12],
    [26.4, 52.1],
    [27.6, 52.05],
    [28.8, 52.0],
    [30.2, 51.7],
  ],
  [
    [27.6, 55.9],
    [28.4, 55.5],
    [29.3, 55.25],
    [30.2, 55.19],
  ],
]

export const CONTEXT_CITIES = [
  { title: 'Минск', lat: 53.9, lng: 27.56 },
  { title: 'Брест', lat: 52.1, lng: 23.69 },
  { title: 'Гродно', lat: 53.67, lng: 23.81 },
  { title: 'Витебск', lat: 55.19, lng: 30.2 },
  { title: 'Гомель', lat: 52.43, lng: 30.98 },
]

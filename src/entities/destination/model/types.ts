import type {
  ActivityId,
  BudgetId,
  CompanyId,
  DistanceId,
  DurationId,
  FormatId,
} from '@/entities/trip-preference'

export type Attraction = {
  title: string
  text: string
  photo: string
}

export type Feature = {
  title: string
  text: string
}

export type TripActivity = {
  id: string
  title: string
  text: string
  duration: string
  recommended?: boolean
}

export type ItineraryDay = {
  day: number
  title: string
  text: string
  activityIds: string[]
}

export type RouteStop = {
  id: string
  title: string
  text: string
  durationMin: number
  lat: number
  lng: number
  kind: 'stop' | 'finish'
  defaultFor: DurationId[]
}

export type Destination = {
  id: string
  title: string
  region: string
  kicker: string
  summary: string
  description: string
  cover: string
  gallery: string[]
  formats: FormatId[]
  durations: DurationId[]
  activity: ActivityId
  companies: CompanyId[]
  durationLabel: string
  budget: BudgetId
  budgetLabel: string
  distanceKm: number
  distanceBand: DistanceId
  season: string
  lat: number
  lng: number
  featured?: boolean
  unusual?: boolean
  heroCaption?: string
  attractions: Attraction[]
  features: Feature[]
  activities: TripActivity[]
  itinerary: ItineraryDay[]
  stops: RouteStop[]
}

import type {
  ActivityId,
  BudgetId,
  CompanyId,
  DistanceId,
  DurationId,
  FormatId,
  TripAnswers,
} from '@/entities/trip-preference'
import {
  activities,
  budgets,
  companies,
  distances,
  durations,
  formats,
} from '@/entities/trip-preference'

function isFormat(value: string): value is FormatId {
  return formats.some((item) => item.id === value)
}

function isDuration(value: string | null): value is DurationId {
  return durations.some((item) => item.id === value)
}

function isActivity(value: string | null): value is ActivityId {
  return activities.some((item) => item.id === value)
}

function isCompany(value: string | null): value is CompanyId {
  return companies.some((item) => item.id === value)
}

function isBudget(value: string | null): value is BudgetId {
  return budgets.some((item) => item.id === value)
}

function isDistance(value: string | null): value is DistanceId {
  return distances.some((item) => item.id === value)
}

export function answersToSearch(answers: TripAnswers): string {
  const params = new URLSearchParams()
  params.set('formats', answers.formats.join(','))
  params.set('duration', answers.duration)
  params.set('activity', answers.activity)
  params.set('company', answers.company)
  params.set('budget', answers.budget)
  params.set('distance', answers.distance)
  return params.toString()
}

export function answersFromSearch(search: URLSearchParams): TripAnswers | null {
  const selectedFormats = (search.get('formats') ?? search.get('format') ?? '').split(',').filter(isFormat)
  const duration = search.get('duration')
  const activity = search.get('activity')
  const company = search.get('company')
  const budget = search.get('budget')
  const distance = search.get('distance')

  if (
    selectedFormats.length === 0 ||
    !isDuration(duration) ||
    !isActivity(activity) ||
    !isCompany(company) ||
    !isBudget(budget) ||
    !isDistance(distance)
  ) {
    return null
  }

  return {
    formats: selectedFormats.slice(0, 2),
    duration,
    activity,
    company,
    budget,
    distance,
  }
}

export function withAnswers(path: string, answers: TripAnswers, extra?: Record<string, string>) {
  const params = new URLSearchParams(answersToSearch(answers))
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => params.set(key, value))
  }
  return `${path}?${params.toString()}`
}

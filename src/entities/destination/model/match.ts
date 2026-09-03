import type { ActivityId, DistanceId, TripAnswers } from '@/entities/trip-preference'
import { activities, distances, durations, formats } from '@/entities/trip-preference'
import type { Destination } from './types'

const ACTIVITY_DISTANCE: Record<ActivityId, Record<ActivityId, number>> = {
  low: { low: 1, medium: 0.55, high: 0.15 },
  medium: { low: 0.6, medium: 1, high: 0.6 },
  high: { low: 0.2, medium: 0.65, high: 1 },
}

const DISTANCE_FIT: Record<DistanceId, Record<DistanceId, number>> = {
  near: { near: 1, region: 0.45, far: 0.12 },
  region: { near: 0.7, region: 1, far: 0.55 },
  far: { near: 0.4, region: 0.75, far: 1 },
}

export function matchDestination(destination: Destination, answers: TripAnswers): number {
  const formatHits = answers.formats.filter((item) => destination.formats.includes(item)).length
  const formatScore =
    answers.formats.length === 0 ? 0.6 : formatHits === 0 ? 0.2 : formatHits / answers.formats.length
  const durationScore = destination.durations.includes(answers.duration) ? 1 : 0.38
  const activityScore = ACTIVITY_DISTANCE[answers.activity][destination.activity]
  const companyScore = destination.companies.includes(answers.company) ? 1 : 0.42
  const budgetScore = destination.budget === answers.budget ? 1 : destination.budget === 'mid' || answers.budget === 'mid' ? 0.62 : 0.28
  const distanceScore = DISTANCE_FIT[answers.distance][destination.distanceBand]

  const raw =
    formatScore * 0.32 +
    durationScore * 0.12 +
    activityScore * 0.14 +
    companyScore * 0.1 +
    budgetScore * 0.14 +
    distanceScore * 0.18

  return Math.round(Math.min(97, Math.max(48, raw * 100)))
}

export function explainMatch(destination: Destination, answers: TripAnswers): string[] {
  const reasons: string[] = []
  const matchedFormats = formats.filter((item) => answers.formats.includes(item.id) && destination.formats.includes(item.id))
  if (matchedFormats.length > 0) {
    reasons.push(`Совпадает с форматом «${matchedFormats.map((item) => item.title).join('» и «')}».`)
  }
  if (destination.durations.includes(answers.duration)) {
    const duration = durations.find((item) => item.id === answers.duration)
    reasons.push(`Срок «${duration?.title}» здесь собирается без лишних переездов.`)
  }
  if (destination.activity === answers.activity) {
    const activity = activities.find((item) => item.id === answers.activity)
    reasons.push(`Темп «${activity?.title}» совпадает с характером направления.`)
  }
  if (destination.distanceBand === answers.distance) {
    const distance = distances.find((item) => item.id === answers.distance)
    reasons.push(`${distance?.title}: около ${destination.distanceKm} км от Минска.`)
  } else if (answers.distance === 'far' && destination.unusual) {
    reasons.push('Если готовы ехать далеко, это одно из менее очевидных направлений.')
  }
  if (destination.budget === answers.budget) {
    reasons.push(`Бюджет совпадает: ${destination.budgetLabel}.`)
  }
  if (destination.unusual && answers.formats.includes('unusual')) {
    reasons.push('Место всё ещё не стёрто чужими короткими списками.')
  }
  if (reasons.length < 3) {
    reasons.push(`${destination.season} — сезон, когда направление читается лучше всего.`)
  }
  if (reasons.length < 3) {
    reasons.push(destination.features[0]?.text ?? destination.summary)
  }
  return reasons.slice(0, 3)
}

export function rankDestinations(list: Destination[], answers: TripAnswers) {
  return [...list]
    .map((destination) => ({
      destination,
      match: matchDestination(destination, answers),
      reasons: explainMatch(destination, answers),
    }))
    .sort((a, b) => b.match - a.match)
}

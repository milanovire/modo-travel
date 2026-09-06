import { formats, type TagTone } from '@/entities/trip-preference'
import type { SearchAnalytics } from './types'

export type VibeStatRow = {
  id: string
  title: string
  tone: TagTone
  count: number
  share: number
  searchShare: number
  rank: number
}

export type VibeAnalyticsView = {
  rows: VibeStatRow[]
  slices: VibeStatRow[]
  vibePicks: number
  covered: number
  catalogSize: number
  top: VibeStatRow | null
}

export function sumVibePicks(vibes: Record<string, number>): number {
  return Object.values(vibes).reduce((sum, count) => sum + count, 0)
}

export function buildVibeStats(data: SearchAnalytics): VibeAnalyticsView {
  const vibePicks = sumVibePicks(data.vibes)
  const catalogSize = formats.length
  const rows = formats
    .map((item) => {
      const count = data.vibes[item.id] ?? 0
      return {
        id: item.id,
        title: item.title,
        tone: item.tone,
        count,
        share: vibePicks === 0 ? 0 : count / vibePicks,
        searchShare: data.totalSearches === 0 ? 0 : count / data.totalSearches,
      }
    })
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, 'ru'))
    .map((item, index) => ({ ...item, rank: index + 1 }))

  const slices = rows.filter((item) => item.count > 0)
  const covered = slices.length

  return {
    rows,
    slices,
    vibePicks,
    covered,
    catalogSize,
    top: slices[0] ?? null,
  }
}

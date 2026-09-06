import { supabase } from '@/shared/api/supabase'
import type { SearchAnalytics } from './types'

function emptyAnalytics(): SearchAnalytics {
  return {
    totalSearches: 0,
    vibes: {},
  }
}

function knownFormats(ids: readonly string[]): string[] {
  const unique: string[] = []

  for (const id of ids) {
    const normalized = id.trim().toLowerCase()

    if (!/^[a-z]{1,32}$/.test(normalized) || unique.includes(normalized)) {
      continue
    }

    unique.push(normalized)

    if (unique.length >= 2) {
      break
    }
  }

  return unique
}

export async function loadAnalytics(): Promise<SearchAnalytics> {
  const { data: searchData, error: searchError } = await supabase
    .from('search_analytics')
    .select('total_searches')
    .eq('id', 1)
    .single()

  if (searchError || !searchData) {
    console.error('Failed to load search analytics:', searchError)

    return emptyAnalytics()
  }

  const { data: vibeData, error: vibeError } = await supabase
    .from('vibe_analytics')
    .select('vibe_id, selections_count')

  if (vibeError) {
    console.error('Failed to load vibe analytics:', vibeError)

    return {
      totalSearches: searchData.total_searches,
      vibes: {},
    }
  }

  const vibes: Record<string, number> = {}

  for (const vibe of vibeData ?? []) {
    vibes[vibe.vibe_id] = vibe.selections_count
  }

  return {
    totalSearches: searchData.total_searches,
    vibes,
  }
}

export async function recordSearch(
  formatsSelected: readonly string[],
): Promise<void> {
  const ids = knownFormats(formatsSelected)

  if (ids.length === 0) {
    return
  }

  const { error } = await supabase.rpc('record_search', {
    selected_formats: ids,
  })

  if (error) {
    console.error('Failed to record search:', error)
  }
}
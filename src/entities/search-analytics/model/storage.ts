import type { SearchAnalytics } from './types'

const ENDPOINT = '/api/search-analytics'
const STORAGE_KEY = 'modo.search-analytics'

function emptyAnalytics(): SearchAnalytics {
  return { totalSearches: 0, vibes: {} }
}

function normalizeAnalytics(value: unknown): SearchAnalytics {
  if (!value || typeof value !== 'object') return emptyAnalytics()
  const record = value as Record<string, unknown>
  const totalSearches =
    typeof record.totalSearches === 'number' && Number.isFinite(record.totalSearches)
      ? Math.max(0, Math.floor(record.totalSearches))
      : 0
  const vibes: Record<string, number> = {}
  if (record.vibes && typeof record.vibes === 'object') {
    for (const [key, count] of Object.entries(record.vibes as Record<string, unknown>)) {
      if (typeof count === 'number' && Number.isFinite(count) && count > 0) {
        vibes[key] = Math.floor(count)
      }
    }
  }
  return { totalSearches, vibes }
}

function knownFormats(ids: readonly string[]): string[] {
  const unique: string[] = []
  for (const id of ids) {
    const normalized = id.trim().toLowerCase()
    if (!/^[a-z]{1,32}$/.test(normalized) || unique.includes(normalized)) continue
    unique.push(normalized)
    if (unique.length >= 2) break
  }
  return unique
}

function readLocal(): SearchAnalytics {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyAnalytics()
    return normalizeAnalytics(JSON.parse(raw) as unknown)
  } catch {
    return emptyAnalytics()
  }
}

function writeLocal(data: SearchAnalytics) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function applySearch(current: SearchAnalytics, ids: readonly string[]): SearchAnalytics {
  const vibes = { ...current.vibes }
  for (const id of ids) {
    vibes[id] = (vibes[id] ?? 0) + 1
  }
  return {
    totalSearches: current.totalSearches + 1,
    vibes,
  }
}

export async function loadAnalytics(): Promise<SearchAnalytics> {
  try {
    const response = await fetch(ENDPOINT, { cache: 'no-store' })
    if (response.ok) {
      const data = normalizeAnalytics(await response.json())
      writeLocal(data)
      return data
    }
  } catch {
  }
  return readLocal()
}

export async function recordSearch(formatsSelected: readonly string[]): Promise<void> {
  const ids = knownFormats(formatsSelected)
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formats: ids }),
      keepalive: true,
    })
    if (response.ok) {
      writeLocal(normalizeAnalytics(await response.json()))
      return
    }
  } catch {
    // Fall back to local persistence below.
  }
  writeLocal(applySearch(readLocal(), ids))
}

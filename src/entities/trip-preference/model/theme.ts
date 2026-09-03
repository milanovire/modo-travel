import type { FormatId } from './catalog'
import { formats } from './catalog'
import type { MoodTheme } from '@/shared/lib/theme'

const formatTheme: Record<FormatId, MoodTheme> = {
  nature: 'nature',
  calm: 'nature',
  history: 'culture',
  architecture: 'culture',
  gastro: 'culture',
  adventure: 'adventure',
  unusual: 'unusual',
}

export function themeFromFormats(ids: readonly string[]): MoodTheme | null {
  for (let index = ids.length - 1; index >= 0; index -= 1) {
    const id = ids[index]
    if (formats.some((item) => item.id === id)) {
      return formatTheme[id as FormatId]
    }
  }
  return null
}

export function parseFormatIds(search: URLSearchParams): string[] {
  const raw = search.get('formats') ?? search.get('format') ?? ''
  return raw.split(',').map((item) => item.trim()).filter(Boolean)
}

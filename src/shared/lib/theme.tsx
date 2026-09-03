import { createContext, useContext } from 'react'

export type MoodTheme = 'nature' | 'culture' | 'adventure' | 'unusual'

export const THEME_QUERY = 't'

export type ThemeContextValue = {
  theme: MoodTheme | null
  setFormatOverride: (ids: string[] | null) => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: null,
  setFormatOverride: () => undefined,
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function parseTheme(value: string | null): MoodTheme | null {
  if (value === 'nature' || value === 'culture' || value === 'adventure' || value === 'unusual') {
    return value
  }
  return null
}

export function withLockedTheme(path: string, search: URLSearchParams, theme: MoodTheme | null) {
  const next = new URLSearchParams(search)
  if (theme) next.set(THEME_QUERY, theme)
  const query = next.toString()
  return query ? `${path}?${query}` : path
}

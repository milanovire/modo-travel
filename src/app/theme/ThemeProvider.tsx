import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parseFormatIds, themeFromFormats } from '@/entities/trip-preference'
import { ThemeContext, parseTheme, THEME_QUERY, type MoodTheme } from '@/shared/lib/theme'

type Props = {
  children: ReactNode
}

export function ThemeProvider({ children }: Props) {
  const [params] = useSearchParams()
  const [override, setOverride] = useState<string[] | null>(null)

  const setFormatOverride = useCallback((ids: string[] | null) => {
    setOverride(ids)
  }, [])

  const theme = useMemo<MoodTheme | null>(() => {
    const locked = parseTheme(params.get(THEME_QUERY))
    if (locked) return locked
    const ids = override ?? parseFormatIds(params)
    return themeFromFormats(ids)
  }, [override, params])

  useLayoutEffect(() => {
    const root = document.documentElement
    if (theme) root.setAttribute('data-theme', theme)
    else root.removeAttribute('data-theme')
  }, [theme])

  const value = useMemo(
    () => ({ theme, setFormatOverride }),
    [theme, setFormatOverride],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

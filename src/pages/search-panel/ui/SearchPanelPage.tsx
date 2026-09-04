import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { formats } from '@/entities/trip-preference'
import { loadAnalytics, type SearchAnalytics } from '@/entities/search-analytics'
import styles from './SearchPanelPage.module.scss'

export function SearchPanelPage() {
  const [data, setData] = useState<SearchAnalytics>({ totalSearches: 0, vibes: {} })

  useLayoutEffect(() => {
    const html = document.documentElement
    const body = document.body
    const previousHtml = html.style.backgroundColor
    const previousBody = body.style.backgroundColor
    html.style.backgroundColor = '#ffffff'
    body.style.backgroundColor = '#ffffff'
    html.removeAttribute('data-theme')
    return () => {
      html.style.backgroundColor = previousHtml
      body.style.backgroundColor = previousBody
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      const next = await loadAnalytics()
      if (!cancelled) setData(next)
    }

    void refresh()

    function onVisible() {
      if (document.visibilityState === 'visible') void refresh()
    }

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
  }, [])

  const vibes = useMemo(
    () =>
      formats
        .map((item) => ({
          id: item.id,
          title: item.title,
          count: data.vibes[item.id] ?? 0,
        }))
        .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, 'ru')),
    [data.vibes],
  )

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <section className={styles.block}>
          <h1 className={styles.label}>Total Searches</h1>
          <p className={styles.total}>{data.totalSearches}</p>
        </section>
        <section className={styles.block}>
          <h2 className={styles.label}>Most Popular Vibes</h2>
          <ul className={styles.list}>
            {vibes.map((item) => (
              <li key={item.id}>
                <span>{item.title}</span>
                <strong>{item.count}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

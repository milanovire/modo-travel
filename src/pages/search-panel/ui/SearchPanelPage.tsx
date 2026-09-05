import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildVibeStats, loadAnalytics, type SearchAnalytics, type VibeStatRow } from '@/entities/search-analytics'
import { routes } from '@/shared/config/routes'
import { cx } from '@/shared/lib/cx'
import { Button } from '@/shared/ui/Button'
import { Tag } from '@/shared/ui/Tag'
import { VibePieChart } from './VibePieChart'
import styles from './SearchPanelPage.module.scss'

const numberFmt = new Intl.NumberFormat('ru-RU')
const percentFmt = new Intl.NumberFormat('ru-RU', { style: 'percent', maximumFractionDigits: 1 })

function formatShare(value: number) {
  return percentFmt.format(value)
}

export function SearchPanelPage() {
  const [data, setData] = useState<SearchAnalytics>({ totalSearches: 0, vibes: {} })
  const [activeId, setActiveId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useLayoutEffect(() => {
    const html = document.documentElement
    const body = document.body
    const previousHtml = html.style.backgroundColor
    const previousBody = body.style.backgroundColor
    html.removeAttribute('data-theme')
    html.style.backgroundColor = '#f4f1ea'
    body.style.backgroundColor = '#f4f1ea'
    return () => {
      html.style.backgroundColor = previousHtml
      body.style.backgroundColor = previousBody
    }
  }, [])

  const refresh = useCallback(async () => {
    setBusy(true)
    try {
      setData(await loadAnalytics())
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setBusy(true)
      try {
        const next = await loadAnalytics()
        if (!cancelled) setData(next)
      } finally {
        if (!cancelled) setBusy(false)
      }
    })()

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
  }, [refresh])

  const stats = useMemo(() => buildVibeStats(data), [data])
  const active = stats.rows.find((item) => item.id === activeId) ?? stats.top
  const centerValue = stats.vibePicks === 0 ? '0%' : formatShare(active?.share ?? 0)
  const centerLabel = stats.vibePicks === 0 ? 'нет данных' : (active?.title ?? 'доля эмоциональной вовлечённости')

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <header className={styles.hero}>
          <div>
            <Link to={routes.home} className={styles.brand}>
              Modo <span>Research</span>
            </Link>
            <p className={styles.kicker}>Search panel</p>
            <h1 className={styles.title}>Исследовательская аналитика поисков</h1>
            <p className={styles.lead}>
              Анонимные итоги завершённых подборов: сколько раз запускали поиск и какие настроения выбирали чаще
              всего. Один подбор может дать до двух эмоциональных состояний.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={() => void refresh()} disabled={busy}>
            Обновить
          </Button>
        </header>

        <section className={styles.kpis} aria-label="Ключевые показатели">
          <article className={styles.kpi}>
            <p className={styles.kpiLabel}>Total Searches</p>
            <p className={styles.kpiValue}>{numberFmt.format(data.totalSearches)}</p>
            <p className={styles.kpiHint}>завершённых подборов</p>
          </article>
          <article className={styles.kpi}>
            <p className={styles.kpiLabel}>Vibe Picks</p>
            <p className={styles.kpiValue}>{numberFmt.format(stats.vibePicks)}</p>
            <p className={styles.kpiHint}>суммарных выборов настроения</p>
          </article>
          <article className={styles.kpi}>
            <p className={styles.kpiLabel}>Top Vibe</p>
            <p className={styles.kpiValueText}>{stats.top?.title ?? '—'}</p>
            <p className={styles.kpiHint}>
              {stats.top ? `${numberFmt.format(stats.top.count)} · ${formatShare(stats.top.share)}` : 'ещё нет лидера'}
            </p>
          </article>
          <article className={styles.kpi}>
            <p className={styles.kpiLabel}>Coverage</p>
            <p className={styles.kpiValue}>
              {stats.covered}
              <span className={styles.kpiOver}>/{stats.catalogSize}</span>
            </p>
            <p className={styles.kpiHint}>настроений хотя бы с одним выбором</p>
          </article>
        </section>

        <div className={styles.grid}>
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2>Most Popular Vibes</h2>
              <p>Пайчарт по доле выборов. Наведите на сектор или строку таблицы, чтобы сопоставить значения.</p>
            </div>
            <VibePieChart
              slices={stats.slices}
              activeId={activeId}
              onActiveChange={setActiveId}
              centerLabel={centerLabel}
              centerValue={centerValue}
            />
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2>Таблица эмоционального восприятия</h2>
              <p>Ранг, число выборов, доля среди эмо и частота появления в завершённых поисках.</p>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Вайб</th>
                    <th scope="col">Выборы</th>
                    <th scope="col">Доля</th>
                    <th scope="col">В поисках</th>
                    <th scope="col">Распределение</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.rows.map((item) => (
                    <VibeRow
                      key={item.id}
                      item={item}
                      maxCount={stats.rows[0]?.count ?? 0}
                      active={activeId === item.id}
                      onActiveChange={setActiveId}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function VibeRow({
  item,
  maxCount,
  active,
  onActiveChange,
}: {
  item: VibeStatRow
  maxCount: number
  active: boolean
  onActiveChange: (id: string | null) => void
}) {
  const bar = maxCount === 0 ? 0 : item.count / maxCount

  return (
    <tr
      className={cx(active && styles.rowActive)}
      onMouseEnter={() => onActiveChange(item.id)}
      onMouseLeave={() => onActiveChange(null)}
    >
      <td className={styles.rank}>{item.rank}</td>
      <td>
        <span className={styles.vibe}>
          <span className={cx(styles.dot, styles[item.tone])} />
          <span>
            <strong>{item.title}</strong>
            <Tag tone={item.tone}>{item.id}</Tag>
          </span>
        </span>
      </td>
      <td className={styles.num}>{numberFmt.format(item.count)}</td>
      <td className={styles.num}>{formatShare(item.share)}</td>
      <td className={styles.num}>{formatShare(item.searchShare)}</td>
      <td>
        <div className={styles.barTrack} aria-hidden="true">
          <span className={cx(styles.barFill, styles[item.tone])} style={{ width: `${bar * 100}%` }} />
        </div>
      </td>
    </tr>
  )
}

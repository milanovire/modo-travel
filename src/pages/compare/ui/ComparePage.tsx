import { Navigate, useSearchParams } from 'react-router-dom'
import { getDestinationById } from '@/entities/destination'
import { activities, formats } from '@/entities/trip-preference'
import { answersFromSearch, withAnswers } from '@/features/trip-quiz'
import { routes } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { useTheme, withLockedTheme } from '@/shared/lib/theme'
import styles from './ComparePage.module.scss'

const rows = [
  { key: 'format', label: 'Формат отдыха' },
  { key: 'duration', label: 'Длительность' },
  { key: 'activity', label: 'Уровень активности' },
  { key: 'budget', label: 'Бюджет' },
  { key: 'season', label: 'Сезон' },
  { key: 'distance', label: 'Расстояние от Минска' },
  { key: 'features', label: 'Основные особенности' },
  { key: 'acts', label: 'Доступные активности' },
] as const

export function ComparePage() {
  const [params] = useSearchParams()
  const { theme } = useTheme()
  const answers = answersFromSearch(params)
  const ids = (params.get('ids') ?? '').split(',').filter(Boolean)
  const left = ids[0] ? getDestinationById(ids[0]) : undefined
  const right = ids[1] ? getDestinationById(ids[1]) : undefined

  if (!left || !right) {
    return <Navigate to={answers ? `${routes.results}?${params.toString()}` : routes.matcher} replace />
  }

  const pair = [left, right]
  const values = pair.map((item) => ({
    format: formats.filter((entry) => item.formats.includes(entry.id)).map((entry) => entry.title).join(', '),
    duration: item.durationLabel,
    activity: activities.find((entry) => entry.id === item.activity)?.title ?? item.activity,
    budget: item.budgetLabel,
    season: item.season,
    distance: `${item.distanceKm} км`,
    features: item.features.map((entry) => entry.title).join('. '),
    acts: item.activities.map((entry) => entry.title).join(', '),
  }))

  function routeLink(id: string) {
    const extra: Record<string, string> = { d: answers?.duration ?? 'weekend' }
    if (theme) extra.t = theme
    if (answers) return withAnswers(routes.itinerary(id), answers, extra)
    return withLockedTheme(routes.itinerary(id), new URLSearchParams(extra), theme)
  }

  return (
    <div className={styles.root}>
      <Container>
        <p className={styles.kicker}>Сравнение</p>
        <h1 className={styles.title}>Два направления рядом</h1>
        <p className={styles.lead}>Выберите одно и переходите к сборке маршрута. Второй финалист можно оставить на другой выезд.</p>
        <div className={styles.heads}>
          {pair.map((item) => (
            <div key={item.id}>
              <img src={item.cover} alt={item.title} />
              <h2>{item.title}</h2>
              <p>{item.region}</p>
            </div>
          ))}
        </div>
        <table className={styles.table}>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th>{row.label}</th>
                <td>{values[0][row.key]}</td>
                <td>{values[1][row.key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.choose}>
          {pair.map((item) => (
            <div key={item.id} className={styles.chooseCard}>
              <p>Выбрать {item.title}</p>
              <Button to={routeLink(item.id)} size="lg">
                Составить маршрут
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

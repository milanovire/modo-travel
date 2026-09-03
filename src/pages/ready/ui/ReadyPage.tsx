import { useMemo, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import type { DurationId } from '@/entities/trip-preference'
import { durations } from '@/entities/trip-preference'
import {
  defaultStopIds,
  durationDays,
  estimateBudget,
  formatMinutes,
  getDestinationById,
  parseStartId,
  pointsFromIds,
  resolveOrigin,
  routeStats,
} from '@/entities/destination'
import { routes } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { RouteMap } from '@/widgets/route-map'
import type { RouteLegInfo } from '@/widgets/route-map'
import styles from './ReadyPage.module.scss'

function readDuration(value: string | null): DurationId {
  if (value === 'day' || value === 'weekend' || value === 'week') return value
  return 'weekend'
}

export function ReadyPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const destination = id ? getDestinationById(id) : undefined
  const [live, setLive] = useState<{ distanceKm: number; travelMin: number; legs: RouteLegInfo[] } | null>(null)

  const duration = readDuration(params.get('d'))
  const startId = parseStartId(params.get('o'))
  const stopIds = useMemo(() => {
    const ids = (params.get('p') ?? '').split(',').filter(Boolean)
    if (ids.length > 0) return ids
    return destination ? defaultStopIds(destination, duration) : []
  }, [params, destination, duration])
  const activityIds = useMemo(
    () => (params.get('a') ?? '').split(',').filter(Boolean),
    [params],
  )
  const origin = useMemo(() => resolveOrigin(startId), [startId])
  const points = useMemo(
    () => (destination ? pointsFromIds(destination, stopIds, origin) : []),
    [destination, stopIds, origin],
  )
  const fallback = routeStats(points)
  const distanceKm = live?.distanceKm ?? fallback.distanceKm
  const travel = live?.travelMin ?? fallback.travelMin
  const days = durationDays(duration)
  const start = points[0]
  const finish = points[points.length - 1]
  const chosenActivities = destination?.activities.filter((item) => activityIds.includes(item.id)) ?? []
  const sequence = points.map((item) => item.title).join(' → ')

  if (!destination) {
    return <Navigate to={routes.home} replace />
  }

  const back = `${routes.itinerary(destination.id)}?${params.toString()}`
  const journeyTo = `${routes.journey(destination.id)}?${params.toString()}`

  return (
    <div className={styles.root}>
      <Container>
        <p className={styles.kicker}>Готовый маршрут</p>
        <h1>Можно выезжать</h1>
        <p className={styles.lead}>
          {destination.title} · {durations.find((item) => item.id === duration)?.title} · {sequence}
        </p>
      </Container>
      <Container className={styles.layout}>
        <RouteMap points={points} onDirections={(info) => setLive(info)} />
        <aside>
          <dl className={styles.facts}>
            <div><dt>Отправление</dt><dd>{start?.title}</dd></div>
            <div><dt>Назначение</dt><dd>{finish?.title}</dd></div>
            <div><dt>Длительность</dt><dd>{durations.find((item) => item.id === duration)?.title}</dd></div>
            <div><dt>Расстояние</dt><dd>{distanceKm} км</dd></div>
            <div><dt>Время в пути</dt><dd>{formatMinutes(travel)}</dd></div>
            <div><dt>Бюджет</dt><dd>{estimateBudget(destination.budgetLabel, days, Math.max(0, stopIds.length - 2))}</dd></div>
          </dl>
          <p className={styles.asideLabel}>Точки маршрута</p>
          <ol className={styles.list}>
            {points.map((item, index) => (
              <li key={item.id}>
                <span>{item.role === 'origin' ? 'Старт' : item.role === 'finish' ? 'Финиш' : `Точка ${index}`}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {chosenActivities.length > 0 ? (
            <>
              <p className={styles.asideLabel}>Активности</p>
              <ul className={styles.acts}>
                {chosenActivities.map((item) => (
                  <li key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.duration}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
            <div className={styles.actions}>
              <Button to={back} variant="secondary" block>
                Изменить маршрут
              </Button>
              <Button to={journeyTo} size="lg" block>
                Начать путешествие
              </Button>
            </div>
        </aside>
      </Container>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import type { DurationId } from '@/entities/trip-preference'
import { durations } from '@/entities/trip-preference'
import {
  defaultStopIds,
  getDestinationById,
  parseStartId,
  pointsFromIds,
  programForDuration,
  resolveOrigin,
} from '@/entities/destination'
import { routes } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { RouteMap } from '@/widgets/route-map'
import { cx } from '@/shared/lib/cx'
import styles from './JourneyPage.module.scss'

function readDuration(value: string | null): DurationId {
  if (value === 'day' || value === 'weekend' || value === 'week') return value
  return 'weekend'
}

export function JourneyPage() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const destination = id ? getDestinationById(id) : undefined
  const [activeId, setActiveId] = useState<string | undefined>()

  const duration = readDuration(params.get('d'))
  const startId = parseStartId(params.get('o'))
  const stopIds = useMemo(() => {
    const ids = (params.get('p') ?? '').split(',').filter(Boolean)
    if (ids.length > 0) return ids
    return destination ? defaultStopIds(destination, duration) : []
  }, [params, destination, duration])
  const visitedIds = useMemo(
    () => (params.get('v') ?? '').split(',').filter(Boolean),
    [params],
  )
  const origin = useMemo(() => resolveOrigin(startId), [startId])
  const points = useMemo(
    () => (destination ? pointsFromIds(destination, stopIds, origin) : []),
    [destination, stopIds, origin],
  )
  const nextPoint = points.find((item) => !visitedIds.includes(item.id))
  const finished = points.length > 0 && !nextPoint
  const doneCount = points.filter((item) => visitedIds.includes(item.id)).length
  const progress = points.length > 0 ? Math.round((doneCount / points.length) * 100) : 0
  const program = destination ? programForDuration(destination, duration) : []

  if (!destination) {
    return <Navigate to={routes.home} replace />
  }

  const back = `${routes.ready(destination.id)}?${params.toString()}`

  function toggleVisited(pointId: string) {
    const next = visitedIds.includes(pointId)
      ? visitedIds.filter((item) => item !== pointId)
      : [...visitedIds, pointId]
    const updated = new URLSearchParams(params)
    if (next.length > 0) updated.set('v', next.join(','))
    else updated.delete('v')
    setParams(updated, { replace: true })
    setActiveId(pointId)
  }

  return (
    <div className={styles.root}>
      <Container>
        <p className={styles.kicker}>Моё путешествие</p>
        <h1>{destination.title}</h1>
        <p className={styles.lead}>
          {durations.find((item) => item.id === duration)?.title}. Отмечайте точки на карте или в списке — прогресс обновится сразу.
        </p>
      </Container>
      <Container className={styles.layout}>
        <RouteMap
          points={points}
          activeId={activeId}
          visitedIds={visitedIds}
          nextId={nextPoint?.id}
          onSelect={toggleVisited}
        />
        <aside className={styles.side}>
          <div className={cx(styles.next, finished && styles.nextDone)}>
            <p className={styles.asideLabel}>{finished ? 'Готово' : 'Следующая точка'}</p>
            {nextPoint ? (
              <>
                <h2>{nextPoint.title}</h2>
                <p>{nextPoint.text}</p>
                <Button variant="accent" onClick={() => toggleVisited(nextPoint.id)}>
                  Отметить посещённой
                </Button>
              </>
            ) : (
              <p className={styles.complete}>Вы завершили маршрут</p>
            )}
          </div>
          <div>
            <p className={styles.asideLabel}>Прогресс</p>
            <p className={styles.progressLabel}>
              {doneCount} из {points.length} · {progress}%
            </p>
            <div className={styles.track} aria-hidden="true">
              <span className={styles.fill} style={{ width: `${progress}%` }} />
            </div>
          </div>
          <p className={styles.asideLabel}>Точки маршрута</p>
          <ol className={styles.points}>
            {points.map((item, index) => {
              const visited = visitedIds.includes(item.id)
              const isNext = nextPoint?.id === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={cx(
                      styles.point,
                      visited && styles.visited,
                      isNext && styles.current,
                    )}
                    onClick={() => toggleVisited(item.id)}
                    aria-pressed={visited}
                  >
                    <span className={styles.mark}>{visited ? '✓' : index + 1}</span>
                    <span>
                      <strong>{item.title}</strong>
                      <em>{visited ? 'Посещено' : isNext ? 'Сейчас дальше' : item.text}</em>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          <p className={styles.asideLabel}>Программа · {program.length} {program.length === 1 ? 'день' : program.length < 5 ? 'дня' : 'дней'}</p>
          <ol className={styles.days}>
            {program.map((item) => (
              <li key={item.day}>
                <p className={styles.dayN}>День {item.day}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.activities.length > 0 ? (
                  <ul>
                    {item.activities.map((activity) => (
                      <li key={activity.id}>
                        <strong>{activity.title}</strong>
                        <span>{activity.duration}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
          <Button to={back} variant="secondary" block>
            К готовому маршруту
          </Button>
        </aside>
      </Container>
    </div>
  )
}

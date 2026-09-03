import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { DurationId } from '@/entities/trip-preference'
import { durations } from '@/entities/trip-preference'
import {
  ORIGIN_CHOICES,
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
import type { StartId } from '@/entities/destination'
import { answersFromSearch } from '@/features/trip-quiz'
import { ActivityPicker } from '@/features/activity-select'
import { routes } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { Segmented } from '@/shared/ui/Segmented'
import { RouteMap } from '@/widgets/route-map'
import type { RouteLegInfo } from '@/widgets/route-map'
import { cx } from '@/shared/lib/cx'
import styles from './ItineraryPage.module.scss'

function readDuration(value: string | null): DurationId {
  if (value === 'day' || value === 'weekend' || value === 'week') return value
  return 'weekend'
}

export function ItineraryPage() {
  const { id } = useParams()
  const destination = id ? getDestinationById(id) : undefined
  const [params] = useSearchParams()

  if (!destination) {
    return <Navigate to={routes.home} replace />
  }

  return <ItineraryBody destinationId={destination.id} query={params} />
}

function ItineraryBody({ destinationId, query }: { destinationId: string; query: URLSearchParams }) {
  const destination = getDestinationById(destinationId)!
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const answers = answersFromSearch(query)
  const [duration, setDuration] = useState<DurationId>(readDuration(query.get('d') ?? answers?.duration ?? null))
  const [startId, setStartId] = useState<StartId>(parseStartId(query.get('o')))
  const [ids, setIds] = useState(() => {
    const fromUrl = (query.get('p') ?? '').split(',').filter(Boolean)
    return fromUrl.length > 0 ? fromUrl : defaultStopIds(destination, duration)
  })
  const [activityIds, setActivityIds] = useState(() => {
    const fromUrl = (query.get('a') ?? '').split(',').filter(Boolean)
    if (fromUrl.length > 0) return fromUrl
    return destination.activities.filter((item) => item.recommended).map((item) => item.id)
  })
  const [activeId, setActiveId] = useState<string | undefined>()
  const [live, setLive] = useState<{ distanceKm: number; travelMin: number; legs: RouteLegInfo[] } | null>(null)

  const origin = useMemo(() => resolveOrigin(startId), [startId])
  const points = useMemo(() => pointsFromIds(destination, ids, origin), [destination, ids, origin])
  const fallback = routeStats(points)
  const stayMin = fallback.stayMin
  const distanceKm = live?.distanceKm ?? fallback.distanceKm
  const travel = live?.travelMin ?? fallback.travelMin
  const legs = live?.legs ?? fallback.legs
  const available = destination.stops.filter((item) => !ids.includes(item.id))
  const days = durationDays(duration)
  const finishId = ids[ids.length - 1]

  function persist(nextDuration: DurationId, nextIds: string[], nextStart: StartId, nextActs: string[]) {
    const next = new URLSearchParams(params)
    next.set('d', nextDuration)
    next.set('p', nextIds.join(','))
    next.set('o', nextStart)
    next.set('a', nextActs.join(','))
    setParams(next, { replace: true })
  }

  function changeDuration(next: DurationId) {
    const nextIds = defaultStopIds(destination, next)
    setDuration(next)
    setIds(nextIds)
    setLive(null)
    persist(next, nextIds, startId, activityIds)
  }

  function changeStart(next: StartId) {
    setStartId(next)
    setLive(null)
    persist(duration, ids, next, activityIds)
  }

  function changeIds(nextIds: string[]) {
    setIds(nextIds)
    setLive(null)
    persist(duration, nextIds, startId, activityIds)
  }

  function changeActivities(next: string[]) {
    setActivityIds(next)
    persist(duration, ids, startId, next)
  }

  function move(index: number, shift: number) {
    const finishIndex = ids.length - 1
    const target = index + shift
    if (index >= finishIndex || target < 0 || target >= finishIndex) return
    const next = [...ids]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    changeIds(next)
  }

  function remove(id: string) {
    if (ids.length <= 1) return
    if (id === finishId) return
    changeIds(ids.filter((item) => item !== id))
  }

  function add(id: string) {
    const finish = ids[ids.length - 1]
    const middle = ids.slice(0, -1)
    changeIds([...middle, id, finish].filter(Boolean))
  }

  function setFinish(id: string) {
    const middle = ids.slice(0, -1).filter((item) => item !== id)
    changeIds([...middle, id])
  }

  const readyTo = `${routes.ready(destination.id)}?${new URLSearchParams({
    ...Object.fromEntries(params.entries()),
    d: duration,
    p: ids.join(','),
    o: startId,
    a: activityIds.join(','),
  }).toString()}`

  return (
    <div className={styles.root}>
      <Container className={styles.head}>
        <div>
          <p className={styles.kicker}>Сборка маршрута</p>
          <h1>{destination.title}</h1>
          <p className={styles.lead}>
            Старт, точки по пути и финиш. Меняйте отправление, порядок и активности — карта обновится сразу.
          </p>
        </div>
        <div className={styles.duration}>
          <p>Продолжительность</p>
          <Segmented
            items={durations}
            value={duration}
            onChange={(value) => changeDuration(value as DurationId)}
          />
        </div>
      </Container>
      <Container>
        <div className={styles.toolbar}>
          <div>
            <p className={styles.asideLabel}>Точка отправления</p>
            <div className={styles.pills}>
              {ORIGIN_CHOICES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cx(styles.pill, startId === item.id && styles.pillOn)}
                  onClick={() => changeStart(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={styles.asideLabel}>Конечная точка</p>
            <div className={styles.pills}>
              {destination.stops.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cx(styles.pill, finishId === item.id && styles.pillOn)}
                  onClick={() => setFinish(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <Container className={styles.layout}>
        <RouteMap
          points={points}
          activeId={activeId}
          onSelect={setActiveId}
          onDirections={(info) => setLive(info)}
        />
        <aside className={styles.side}>
          <p className={styles.asideLabel}>Старт → точки → финиш</p>
          <ol className={styles.points}>
            {points.map((item, index) => (
              <li key={item.id} className={cx(activeId === item.id && styles.on)}>
                <button type="button" className={styles.pointBtn} onClick={() => setActiveId(item.id)}>
                  <span className={styles.idx}>
                    {item.role === 'origin'
                      ? 'Старт': item.role === 'finish' ? 'Конечная точка' : `Точка ${index}`}
                  </span>
                  <strong>{item.title}</strong>
                  <em>{item.text}</em>
                  {index > 0 ? (
                    <b>
                      {legs[index - 1]?.km ?? 0} км · {formatMinutes(legs[index - 1]?.min ?? 0)} в пути
                      {item.durationMin ? ` · ${formatMinutes(item.durationMin)} на месте` : ''}
                    </b>
                  ) : (
                    <b>Старт маршрута</b>
                  )}
                </button>
                {item.role === 'stop' ? (
                  <div className={styles.controls}>
                    <button type="button" onClick={() => move(index - 1, -1)}>Выше</button>
                    <button type="button" onClick={() => move(index - 1, 1)}>Ниже</button>
                    <button type="button" onClick={() => remove(item.id)}>Убрать</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
          {available.length > 0 ? (
            <div className={styles.extras}>
              <p className={styles.asideLabel}>Добавить промежуточное место</p>
              <ul>
                {available.map((item) => (
                  <li key={item.id}>
                    <span>
                      <strong>{item.title}</strong>
                      {item.text}
                    </span>
                    <Button variant="accent" onClick={() => add(item.id)}>
                      Добавить
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className={styles.activities}>
            <p className={styles.asideLabel}>Активности</p>
            <ActivityPicker
              activities={destination.activities}
              selectedIds={activityIds}
              onChange={changeActivities}
            />
          </div>
          <div className={styles.totals}>
            <p><strong>{distanceKm} км</strong> по дороге</p>
            <p><strong>{formatMinutes(travel)}</strong> в пути</p>
            <p><strong>{formatMinutes(stayMin)}</strong> на местах</p>
            <p><strong>{estimateBudget(destination.budgetLabel, days, Math.max(0, ids.length - 2))}</strong></p>
          </div>
          <Button to={readyTo} size="lg" block>
            Маршрут готов
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)} block>
            Назад
          </Button>
        </aside>
      </Container>
    </div>
  )
}

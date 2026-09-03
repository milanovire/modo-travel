import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { destinations, rankDestinations } from '@/entities/destination'
import { activities, budgets, companies, distances, durations, formats } from '@/entities/trip-preference'
import { answersFromSearch, withAnswers } from '@/features/trip-quiz'
import { routes } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { Tag } from '@/shared/ui/Tag'
import { cx } from '@/shared/lib/cx'
import { useTheme, withLockedTheme } from '@/shared/lib/theme'
import styles from './RecommendationsPage.module.scss'

export function RecommendationsPage() {
  const [params] = useSearchParams()
  const { theme } = useTheme()
  const answers = answersFromSearch(params)
  const [picked, setPicked] = useState<string[]>([])

  const ranked = useMemo(() => {
    if (!answers) {
      return destinations.map((destination) => ({
        destination,
        match: undefined as number | undefined,
        reasons: destination.features.slice(0, 3).map((item) => item.title),
      }))
    }
    return rankDestinations(destinations, answers).slice(0, 6)
  }, [answers])

  function toggle(id: string) {
    setPicked((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= 2) return [current[1], id]
      return [...current, id]
    })
  }

  const compareTo =
    answers && picked.length === 2
      ? withAnswers(routes.compare, answers, { ids: picked.join(','), ...(theme ? { t: theme } : {}) })
      : withLockedTheme(routes.compare, new URLSearchParams({ ids: picked.join(',') }), theme)

  function destinationTo(id: string) {
    return answers
      ? withAnswers(routes.destination(id), answers, theme ? { t: theme } : undefined)
      : withLockedTheme(routes.destination(id), params, theme)
  }

  return (
    <div className={styles.root}>
      <Container>
        <p className={styles.kicker}>Рекомендации</p>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>
              {answers ? 'Подборка под ваши ответы' : 'Сначала пройдите подбор'}
            </h1>
            <p className={styles.lead}>
              Выберите максимум два направления, затем сравните их и соберите маршрут.
            </p>
          </div>
          <Button to={routes.matcher} variant="secondary">
            {answers ? 'Изменить ответы' : 'Подобрать путешествие'}
          </Button>
        </div>
        {answers ? (
          <div className={styles.tags}>
            {formats.filter((item) => answers.formats.includes(item.id)).map((item) => (
              <Tag key={item.id} tone={item.tone}>{item.title}</Tag>
            ))}
            <Tag>{durations.find((item) => item.id === answers.duration)?.title}</Tag>
            <Tag>{activities.find((item) => item.id === answers.activity)?.title}</Tag>
            <Tag>{companies.find((item) => item.id === answers.company)?.title}</Tag>
            <Tag>{budgets.find((item) => item.id === answers.budget)?.title}</Tag>
            <Tag>{distances.find((item) => item.id === answers.distance)?.title}</Tag>
          </div>
        ) : null}
        <div className={styles.list}>
          {ranked.map(({ destination, match, reasons }) => {
            const format = formats.find((item) => item.id === destination.formats[0])
            const selected = picked.includes(destination.id)
            return (
              <article key={destination.id} className={cx(styles.row, selected && styles.rowOn)}>
                <Link to={destinationTo(destination.id)} className={styles.photo}>
                  <img src={destination.cover} alt={destination.title} />
                </Link>
                <div className={styles.body}>
                  <div className={styles.top}>
                    <p className={styles.region}>{destination.region}</p>
                    {match !== undefined ? <p className={styles.match}>{match}% совпадение</p> : null}
                  </div>
                  <h2>{destination.title}</h2>
                  <p className={styles.summary}>{destination.summary}</p>
                  <div className={styles.meta}>
                    {format ? <Tag tone={format.tone}>{format.title}</Tag> : null}
                    <span>{destination.durationLabel}</span>
                    <span>{destination.budgetLabel}</span>
                    <span>{destination.distanceKm} км от Минска</span>
                  </div>
                  <ul className={styles.reasons}>
                    {reasons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className={styles.actions}>
                    <Button
                      variant={selected ? 'accent' : 'secondary'}
                      onClick={() => toggle(destination.id)}
                    >
                      {selected ? 'Выбрано' : picked.length === 2 ? 'Заменить выбор' : 'Выбрать для сравнения'}
                    </Button>
                    <Button to={destinationTo(destination.id)} variant="ghost">
                      Подробнее
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
      {picked.length === 2 ? (
        <div className={styles.dock}>
          <Container className={styles.dockInner}>
            <p>Выбрано: {picked.map((id) => destinations.find((item) => item.id === id)?.title).join(' и ')}</p>
            <Button to={compareTo} variant="accent" size="lg">
              Сравнить
            </Button>
          </Container>
        </div>
      ) : null}
    </div>
  )
}

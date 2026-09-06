import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { recordSearch } from '@/entities/search-analytics'
import type { FormatId, TripAnswers } from '@/entities/trip-preference'
import {
  activities,
  budgets,
  companies,
  distances,
  durations,
  formats,
} from '@/entities/trip-preference'
import { routes } from '@/shared/config/routes'
import { cx } from '@/shared/lib/cx'
import { useTheme } from '@/shared/lib/theme'
import { Button } from '@/shared/ui/Button'
import { Segmented } from '@/shared/ui/Segmented'
import { answersToSearch } from '../model/query'
import styles from './QuizFlow.module.scss'

const STEPS = 6

type Draft = Partial<TripAnswers> & { formats: FormatId[] }

export function QuizFlow() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const preset = params.get('format')
  const presetFormat = formats.some((item) => item.id === preset) ? (preset as FormatId) : undefined

  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<Draft>({
    formats: presetFormat ? [presetFormat] : [],
  })
  const { setFormatOverride } = useTheme()

  useEffect(() => {
    setFormatOverride(draft.formats)
  }, [draft.formats, setFormatOverride])

  useEffect(() => {
    return () => setFormatOverride(null)
  }, [setFormatOverride])

  const canNext = useMemo(() => {
    if (step === 1) return draft.formats.length > 0
    if (step === 2) return Boolean(draft.duration)
    if (step === 3) return Boolean(draft.activity)
    if (step === 4) return Boolean(draft.company)
    if (step === 5) return Boolean(draft.budget)
    return Boolean(draft.distance)
  }, [draft, step])

  function toggleFormat(id: FormatId) {
    setDraft((current) => {
      if (current.formats.includes(id)) {
        return { ...current, formats: current.formats.filter((item) => item !== id) }
      }
      if (current.formats.length >= 2) {
        return { ...current, formats: [current.formats[1], id] }
      }
      return { ...current, formats: [...current.formats, id] }
    })
  }

  function goNext() {
    if (step < STEPS) {
      setStep(step + 1)
      return
    }
    if (!draft.duration || !draft.activity || !draft.company || !draft.budget || !draft.distance) return
    const answers: TripAnswers = {
      formats: draft.formats,
      duration: draft.duration,
      activity: draft.activity,
      company: draft.company,
      budget: draft.budget,
      distance: draft.distance,
    }
    void recordSearch(answers.formats)
    navigate(`${routes.results}?${answersToSearch(answers)}`)
  }

  return (
    <div className={styles.root}>
      <div className={styles.progress} aria-hidden="true">
        {Array.from({ length: STEPS }, (_, index) => (
          <span key={index} className={index < step ? styles.filled : styles.segment} />
        ))}
      </div>
      <p className={styles.stepLabel}>Шаг {step} из {STEPS}</p>

      {step === 1 ? (
        <section>
          <h1 className={styles.title}>Какой отдых вам ближе?</h1>
          <p className={styles.lead}>Можно выбрать одну или две карточки. Две — если хотите смешать сценарии.</p>
          <div className={styles.formats}>
            {formats.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cx(styles.format, draft.formats.includes(item.id) && styles.formatOn)}
                onClick={() => toggleFormat(item.id)}
                aria-pressed={draft.formats.includes(item.id)}
              >
                <img src={item.photo} alt="" />
                <span>
                  <strong>{item.title}</strong>
                  {item.text}
                </span>
              </button>
            ))}
          </div>
          <p className={styles.hint}>Выбрано {draft.formats.length} из 2</p>
        </section>
      ) : null}

      {step === 2 ? (
        <section>
          <h1 className={styles.title}>На сколько уезжаете?</h1>
          <p className={styles.lead}>От этого зависит длина маршрута и набор точек.</p>
          <Segmented
            items={durations}
            value={draft.duration}
            onChange={(id) => setDraft((current) => ({ ...current, duration: id as TripAnswers['duration'] }))}
          />
        </section>
      ) : null}

      {step === 3 ? (
        <section>
          <h1 className={styles.title}>Какой темп комфортен?</h1>
          <p className={styles.lead}>Мы не будем набирать лишние точки, если вам нужен спокойный день.</p>
          <Segmented
            items={activities}
            value={draft.activity}
            onChange={(id) => setDraft((current) => ({ ...current, activity: id as TripAnswers['activity'] }))}
          />
        </section>
      ) : null}

      {step === 4 ? (
        <section>
          <h1 className={styles.title}>С кем едете?</h1>
          <p className={styles.lead}>Компания меняет плотность дня и тип остановок.</p>
          <Segmented
            items={companies}
            value={draft.company}
            onChange={(id) => setDraft((current) => ({ ...current, company: id as TripAnswers['company'] }))}
          />
        </section>
      ) : null}

      {step === 5 ? (
        <section>
          <h1 className={styles.title}>Какой бюджет закладываете?</h1>
          <p className={styles.lead}>Ориентир на человека в день: дорога, еда и входные билеты.</p>
          <Segmented
            items={budgets}
            value={draft.budget}
            onChange={(id) => setDraft((current) => ({ ...current, budget: id as TripAnswers['budget'] }))}
          />
        </section>
      ) : null}

      {step === 6 ? (
        <section>
          <h1 className={styles.title}>Как далеко готовы ехать?</h1>
          <p className={styles.lead}>Считаем от Минска — его можно сменить при сборке маршрута.</p>
          <Segmented
            items={distances}
            value={draft.distance}
            onChange={(id) => setDraft((current) => ({ ...current, distance: id as TripAnswers['distance'] }))}
          />
        </section>
      ) : null}

      <div className={styles.bar}>
        <Button variant="secondary" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
          Назад
        </Button>
        <Button onClick={goNext} disabled={!canNext}>
          {step === STEPS ? 'Показать направления' : 'Далее'}
        </Button>
      </div>
    </div>
  )
}

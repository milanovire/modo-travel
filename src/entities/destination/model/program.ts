import type { DurationId } from '@/entities/trip-preference'
import { durationDays } from './route'
import type { Destination } from './types'

export type ProgramActivity = {
  id: string
  title: string
  duration: string
}

export type ProgramDay = {
  day: number
  title: string
  text: string
  activities: ProgramActivity[]
}

function fillers(destination: Destination): Omit<ProgramDay, 'day'>[] {
  const place = destination.title
  const region = destination.region
  return [
    {
      title: `Вокруг ${place}`,
      text: `Короткий выезд по ${region}: соседние деревни, смотровые точки и дорога без обязательного списка.`,
      activities: [
        { id: `${destination.id}-loop`, title: 'Круг по окрестностям', duration: '3–4 часа' },
        { id: `${destination.id}-loop-evening`, title: 'Вечер в городе', duration: 'вечер' },
      ],
    },
    {
      title: 'Еда и медленный центр',
      text: `День без новых обязательных объектов: рынок, кухня, повтор улицы, которая зашла вчера.`,
      activities: [
        { id: `${destination.id}-food`, title: 'Местная кухня', duration: '2 часа' },
        { id: `${destination.id}-center`, title: 'Свободная прогулка', duration: '2 часа' },
      ],
    },
    {
      title: 'Повтор сильного места',
      text: `Вернуться туда, что сработало в первые дни — свет другой, людей меньше, спешки нет.`,
      activities: [
        { id: `${destination.id}-repeat`, title: 'Любимая точка ещё раз', duration: '2–3 часа' },
      ],
    },
    {
      title: 'День без плана',
      text: `Пауза в недельном ритме: сон, короткая прогулка, ничего обязательного.`,
      activities: [
        { id: `${destination.id}-rest`, title: 'Свободный день', duration: 'день' },
      ],
    },
    {
      title: 'Сборы и дорога',
      text: `Утро на месте, затем выезд. Новых точек не закладываем — неделя уже собрана.`,
      activities: [
        { id: `${destination.id}-leave`, title: 'Сборы и дорога', duration: 'полдня' },
      ],
    },
  ]
}

export function programForDuration(destination: Destination, duration: DurationId): ProgramDay[] {
  const need = durationDays(duration)
  const authored: ProgramDay[] = destination.itinerary.map((item) => ({
    day: item.day,
    title: item.title,
    text: item.text,
    activities: destination.activities
      .filter((activity) => item.activityIds.includes(activity.id))
      .map((activity) => ({
        id: activity.id,
        title: activity.title,
        duration: activity.duration,
      })),
  }))

  if (authored.length >= need) {
    return authored.slice(0, need)
  }

  const extra = fillers(destination)
    .slice(0, need - authored.length)
    .map((item, index) => ({
      ...item,
      day: authored.length + index + 1,
    }))

  return [...authored, ...extra]
}

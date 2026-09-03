import { useState } from 'react'
import type { TripActivity } from '@/entities/destination'
import { cx } from '@/shared/lib/cx'
import styles from './ActivityPicker.module.scss'

type Props = {
  activities: TripActivity[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function ActivityPicker({ activities, selectedIds, onChange }: Props) {
  return (
    <ul className={styles.list}>
      {activities.map((item) => {
        const selected = selectedIds.includes(item.id)
        return (
          <li key={item.id}>
            <button
              type="button"
              className={cx(styles.card, selected && styles.selected)}
              onClick={() => {
                onChange(
                  selected
                    ? selectedIds.filter((id) => id !== item.id) : [...selectedIds, item.id],
                )
              }}
              aria-pressed={selected}
            >
              <span className={styles.top}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.duration}>{item.duration}</span>
              </span>
              <span className={styles.text}>{item.text}</span>
              <span className={styles.state}>{selected ? 'В маршруте' : 'Добавить'}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export function useSelectedActivities(activities: TripActivity[]) {
  const defaults = activities.filter((item) => item.recommended).map((item) => item.id)
  return useState<string[]>(defaults)
}

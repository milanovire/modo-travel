import { Link } from 'react-router-dom'
import { MatchScore } from '@/shared/ui/MatchScore'
import { Tag } from '@/shared/ui/Tag'
import { routes } from '@/shared/config/routes'
import { formats } from '@/entities/trip-preference'
import type { Destination } from '../model/types'
import styles from './DestinationCard.module.scss'

type Props = {
  destination: Destination
  match?: number
}

export function DestinationCard({ destination, match }: Props) {
  const format = formats.find((item) => item.id === destination.formats[0])

  return (
    <Link to={routes.destination(destination.id)} className={styles.root}>
      <div className={styles.photo}>
        <img src={destination.cover} alt={destination.title} />
        {match !== undefined ? (
          <div className={styles.score}>
            <MatchScore value={match} />
          </div>
        ) : null}
      </div>
      <div className={styles.body}>
        <p className={styles.region}>{destination.region}</p>
        <h3 className={styles.title}>{destination.title}</h3>
        <p className={styles.summary}>{destination.summary}</p>
        <div className={styles.meta}>
          {format ? <Tag tone={format.tone}>{format.title}</Tag> : null}
          <span className={styles.duration}>{destination.durationLabel}</span>
        </div>
      </div>
    </Link>
  )
}

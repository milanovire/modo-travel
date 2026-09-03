import { cx } from '@/shared/lib/cx'
import styles from './MatchScore.module.scss'

type Props = {
  value: number
  className?: string
}

export function MatchScore({ value, className }: Props) {
  return (
    <p className={cx(styles.root, className)}>
      <span className={styles.value}>{value}%</span>
      <span className={styles.label}>совпадение</span>
    </p>
  )
}

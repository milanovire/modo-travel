import { cx } from '@/shared/lib/cx'
import styles from './ScrollCue.module.scss'

type Props = {
  href: string
  direction: 'up' | 'down'
  label: string
  className?: string
}

export function ScrollCue({ href, direction, label, className }: Props) {
  return (
    <a href={href} className={cx(styles.root, styles[direction], className)} aria-label={label}>
      <span className={styles.chevron} aria-hidden="true" />
    </a>
  )
}

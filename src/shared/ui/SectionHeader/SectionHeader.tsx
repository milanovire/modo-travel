import type { ReactNode } from 'react'
import { cx } from '@/shared/lib/cx'
import styles from './SectionHeader.module.scss'

type Props = {
  kicker?: string
  title: string
  text?: string
  action?: ReactNode
  className?: string
}

export function SectionHeader({ kicker, title, text, action, className }: Props) {
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.copy}>
        {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
        <h2 className={styles.title}>{title}</h2>
        {text ? <p className={styles.text}>{text}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  )
}

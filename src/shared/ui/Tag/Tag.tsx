import type { ReactNode } from 'react'
import { cx } from '@/shared/lib/cx'
import styles from './Tag.module.scss'

type Tone = 'neutral' | 'primary' | 'accent' | 'nature' | 'history' | 'adventure' | 'gastro' | 'calm' | 'unusual' | 'architecture'

type Props = {
  children: ReactNode
  tone?: Tone
  className?: string
}

export function Tag({ children, tone = 'neutral', className }: Props) {
  return <span className={cx(styles.root, styles[tone], className)}>{children}</span>
}

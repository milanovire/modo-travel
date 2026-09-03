import type { ReactNode } from 'react'
import { cx } from '@/shared/lib/cx'
import styles from './Container.module.scss'

type Props = {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'header' | 'footer' | 'main'
}

export function Container({ children, className, as: Tag = 'div' }: Props) {
  return <Tag className={cx(styles.root, className)}>{children}</Tag>
}

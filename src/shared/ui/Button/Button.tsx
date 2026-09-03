import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/shared/lib/cx'
import styles from './Button.module.scss'

type Variant = 'primary' | 'secondary' | 'ghost' | 'onPhoto' | 'inverse' | 'accent'
type Size = 'md' | 'lg'

type Common = {
  variant?: Variant
  size?: Size
  block?: boolean
  className?: string
  children: ReactNode
}

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never
  }

type ButtonAsLink = Common & {
  to: string
  type?: never
  disabled?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  block,
  className,
  children,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const cls = cx(
    styles.root,
    styles[variant],
    styles[size],
    block && styles.block,
    className,
  )

  if ('to' in rest && rest.to) {
    const { to, disabled, ...linkRest } = rest
    if (disabled) {
      return (
        <span className={cx(cls, styles.disabled)} {...linkRest}>
          {children}
        </span>
      )
    }
    return (
      <Link to={to} className={cls} {...linkRest}>
        {children}
      </Link>
    )
  }

  const buttonRest = rest as ButtonAsButton
  return (
    <button className={cls} {...buttonRest}>
      {children}
    </button>
  )
}

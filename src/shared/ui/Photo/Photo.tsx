import { cx } from '@/shared/lib/cx'
import styles from './Photo.module.scss'

type Props = {
  src: string
  alt: string
  className?: string
  ratio?: 'wide' | 'landscape' | 'square' | 'portrait' | 'fill'
}

export function Photo({ src, alt, className, ratio = 'landscape' }: Props) {
  return (
    <div className={cx(styles.root, styles[ratio], className)}>
      <img src={src} alt={alt} />
    </div>
  )
}

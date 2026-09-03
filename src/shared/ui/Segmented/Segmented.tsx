import { cx } from '@/shared/lib/cx'
import styles from './Segmented.module.scss'

type Item = {
  id: string
  title: string
  text?: string
}

type Props = {
  items: readonly Item[]
  value?: string
  onChange: (id: string) => void
}

export function Segmented({ items, value, onChange }: Props) {
  return (
    <div className={styles.root} role="listbox">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={cx(styles.item, value === item.id && styles.selected)}
          onClick={() => onChange(item.id)}
          aria-pressed={value === item.id}
        >
          <span className={styles.title}>{item.title}</span>
          {item.text ? <span className={styles.text}>{item.text}</span> : null}
        </button>
      ))}
    </div>
  )
}

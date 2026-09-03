import { cx } from '@/shared/lib/cx'
import styles from './ChoiceCard.module.scss'

type Props = {
  title: string
  text?: string
  selected?: boolean
  onSelect: () => void
  photo?: string
  disabled?: boolean
}

export function ChoiceCard({ title, text, selected, onSelect, photo, disabled }: Props) {
  return (
    <button
      type="button"
      className={cx(styles.root, selected && styles.selected, photo && styles.withPhoto)}
      onClick={onSelect}
      aria-pressed={selected}
      disabled={disabled}
    >
      {photo ? (
        <span className={styles.photo}>
          <img src={photo} alt="" />
        </span>
      ) : null}
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        {text ? <span className={styles.text}>{text}</span> : null}
      </span>
    </button>
  )
}

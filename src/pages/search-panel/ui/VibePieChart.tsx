import { cx } from '@/shared/lib/cx'
import type { VibeStatRow } from '@/entities/search-analytics'
import styles from './VibePieChart.module.scss'

type Props = {
  slices: VibeStatRow[]
  activeId: string | null
  onActiveChange: (id: string | null) => void
  centerLabel: string
  centerValue: string
}

const VIEW = 200
const CX = 100
const CY = 100
const OUTER = 84
const INNER = 54
const GAP = 2.4

function polar(cx: number, cy: number, radius: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

function donutSlice(startAngle: number, endAngle: number) {
  const startOuter = polar(CX, CY, OUTER, startAngle)
  const endOuter = polar(CX, CY, OUTER, endAngle)
  const startInner = polar(CX, CY, INNER, endAngle)
  const endInner = polar(CX, CY, INNER, startAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${startOuter.x.toFixed(3)} ${startOuter.y.toFixed(3)}`,
    `A ${OUTER} ${OUTER} 0 ${large} 1 ${endOuter.x.toFixed(3)} ${endOuter.y.toFixed(3)}`,
    `L ${startInner.x.toFixed(3)} ${startInner.y.toFixed(3)}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${endInner.x.toFixed(3)} ${endInner.y.toFixed(3)}`,
    'Z',
  ].join(' ')
}

function sliceGeometry(slices: VibeStatRow[]) {
  const total = slices.reduce((sum, item) => sum + item.count, 0)
  if (total === 0) return []

  let cursor = 0
  return slices.map((item) => {
    const sweep = (item.count / total) * 360
    const start = cursor
    const end = cursor + sweep
    cursor = end
    const gap = slices.length > 1 ? Math.min(GAP, sweep / 3) : 0
    return {
      ...item,
      start: start + gap / 2,
      end: end - gap / 2,
      full: slices.length === 1,
    }
  })
}

export function VibePieChart({ slices, activeId, onActiveChange, centerLabel, centerValue }: Props) {
  const geometry = sliceGeometry(slices)

  return (
    <div className={styles.root}>
      <div className={styles.stage}>
        <svg className={styles.svg} viewBox={`0 0 ${VIEW} ${VIEW}`} role="img" aria-label="Распределение выбранных вайбов">
          <circle className={styles.track} cx={CX} cy={CY} r={(OUTER + INNER) / 2} />
          {geometry.map((item) =>
            item.full ? (
              <circle
                key={item.id}
                className={cx(
                  styles.slice,
                  styles.ring,
                  styles[item.tone],
                  activeId && activeId !== item.id && styles.dim,
                )}
                cx={CX}
                cy={CY}
                r={(OUTER + INNER) / 2}
                strokeWidth={OUTER - INNER}
                onMouseEnter={() => onActiveChange(item.id)}
                onMouseLeave={() => onActiveChange(null)}
                onFocus={() => onActiveChange(item.id)}
                onBlur={() => onActiveChange(null)}
                tabIndex={0}
              >
                <title>
                  {item.title}: {item.count}
                </title>
              </circle>
            ) : item.end <= item.start ? null : (
              <path
                key={item.id}
                className={cx(
                  styles.slice,
                  styles[item.tone],
                  activeId === item.id && styles.active,
                  activeId && activeId !== item.id && styles.dim,
                )}
                d={donutSlice(item.start, item.end)}
                onMouseEnter={() => onActiveChange(item.id)}
                onMouseLeave={() => onActiveChange(null)}
                onFocus={() => onActiveChange(item.id)}
                onBlur={() => onActiveChange(null)}
                tabIndex={0}
              >
                <title>
                  {item.title}: {item.count}
                </title>
              </path>
            ),
          )}
        </svg>
        <div className={styles.center}>
          <span className={styles.centerValue}>{centerValue}</span>
          <span className={styles.centerLabel}>{centerLabel}</span>
        </div>
      </div>
      <ul className={styles.legend}>
        {slices.length === 0 ? (
          <li className={styles.empty}>Пока нет выборов вайбов — пайчарт появится после первого подбора.</li>
        ) : (
          slices.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={cx(styles.legendItem, activeId === item.id && styles.legendActive)}
                aria-pressed={activeId === item.id}
                onMouseEnter={() => onActiveChange(item.id)}
                onMouseLeave={() => onActiveChange(null)}
                onFocus={() => onActiveChange(item.id)}
                onBlur={() => onActiveChange(null)}
              >
                <span className={cx(styles.swatch, styles[item.tone])} />
                <span className={styles.legendTitle}>{item.title}</span>
                <span className={styles.legendShare}>
                  {new Intl.NumberFormat('ru-RU', { style: 'percent', maximumFractionDigits: 1 }).format(item.share)}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { routes } from '@/shared/config/routes'
import { cx } from '@/shared/lib/cx'
import styles from './Header.module.scss'

const links = [
  { to: `${routes.home}#napravleniya`, label: 'Направления' },
  { to: `${routes.home}#kak-eto-rabotaet`, label: 'Как это работает' },
  { to: routes.matcher, label: 'Подбор' },
]

export function Header() {
  const location = useLocation()
  const overlay = location.pathname === routes.home

  return (
    <header className={cx(styles.root, overlay && styles.overlay)}>
      <NavLink to={routes.home} className={styles.logo}>
        <span className={styles.brand}>Modo</span>
        <span className={styles.mark}>Беларусь</span>
      </NavLink>
      <nav className={styles.nav} aria-label="Основная навигация">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cx(styles.link, isActive && item.to === routes.matcher && styles.active)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Button to={routes.matcher} size="md" className={styles.cta}>
        <span className={styles.ctaFull}>Подобрать путешествие</span>
        <span className={styles.ctaShort}>Подобрать</span>
      </Button>
    </header>
  )
}

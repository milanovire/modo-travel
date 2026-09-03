import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { cx } from '@/shared/lib/cx'
import { routes } from '@/shared/config/routes'
import styles from './MainLayout.module.scss'

export function MainLayout() {
  const location = useLocation()
  const home = location.pathname === routes.home

  return (
    <div className={cx(styles.root, home && styles.home)}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

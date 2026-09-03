import { Link } from 'react-router-dom'
import { Container } from '@/shared/ui/Container'
import { routes } from '@/shared/config/routes'
import styles from './Footer.module.scss'

export function Footer() {
  return (
    <footer className={styles.root}>
      <Container className={styles.inner}>
        <div>
          <p className={styles.brand}>MODO</p>
          <p className={styles.text}>Путешествия по Беларуси. Подбираем направления под формат отдыха, а не под чужой список must see.</p>
        </div>
        <div>
          <p className={styles.label}>Разделы</p>
          <ul className={styles.links}>
            <li><Link to={routes.home}>Главная</Link></li>
            <li><Link to={routes.matcher}>Подбор путешествия</Link></li>
            <li><Link to={`${routes.home}#napravleniya`}>Направления</Link></li>
          </ul>
        </div>
        <div>
          <p className={styles.label}>Контакт</p>
          <p className={styles.text}>Минск</p>
          <p className={styles.text}>hello@modo.by</p>
        </div>
      </Container>
      <Container>
        <p className={styles.copy}>Modo, 2026. Сервис подбора путешествий по Беларуси.</p>
      </Container>
    </footer>
  )
}

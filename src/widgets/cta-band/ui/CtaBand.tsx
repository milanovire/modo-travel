import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { routes } from '@/shared/config/routes'
import styles from './CtaBand.module.scss'

export function CtaBand() {
  return (
    <section className={styles.root}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Дальше — ваш маршрут</p>
          <h2 className={styles.title}>Не выбирайте место из чужого топа. Соберите своё.</h2>
          <Button to={routes.matcher} size="lg">
            Подобрать путешествие
          </Button>
        </div>
        <img src="/photos/belovezha.jpg" alt="Беловежская пуща, реликтовый лес" />
      </Container>
    </section>
  )
}

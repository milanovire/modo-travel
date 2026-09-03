import { Link } from 'react-router-dom'
import { formats } from '@/entities/trip-preference'
import { matcherWithFormat } from '@/shared/config/routes'
import { Container } from '@/shared/ui/Container'
import styles from './FormatBand.module.scss'

export function FormatBand() {
  return (
    <section className={styles.root}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Форматы</p>
          <h2>С чего начать подбор</h2>
          <p>Выберите настроение — и сразу перейдёте к коротким вопросам. Второй формат можно добавить на следующем шаге.</p>
          <figure className={styles.photo}>
            <img src="/photos/pripyat.jpg" alt="Река Припять в полесье" />
            <figcaption>Полесье · широкий горизонт</figcaption>
          </figure>
        </div>
        <ul className={styles.list}>
          {formats.map((item) => (
            <li key={item.id}>
              <Link to={matcherWithFormat(item.id)}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

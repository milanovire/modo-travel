import { Container } from '@/shared/ui/Container'
import styles from './HowItWorks.module.scss'

const steps = [
  { n: '01', title: 'Формат', text: 'До двух сценариев отдыха — природа, архитектура, полесье или спокойная вода.' },
  { n: '02', title: 'Рекомендации', text: 'Направления с процентом соответствия и коротким объяснением, почему место подходит.' },
  { n: '03', title: 'Сравнение', text: 'Два финалиста рядом: сезон, активность, бюджет и характер поездки.' },
  { n: '04', title: 'Маршрут', text: 'Старт, точки и финиш на живой карте — затем готовая программа.' },
]

export function HowItWorks() {
  return (
    <section className={styles.root} id="kak-eto-rabotaet">
      <Container className={styles.layout}>
        <figure className={styles.photo}>
          <img src="/photos/grodno.jpg" alt="Старый Гродно у Немана" />
          <figcaption>Гродно · улица к реке</figcaption>
        </figure>
        <div>
          <p className={styles.kicker}>Как это работает</p>
          <h2 className={styles.heading}>От предпочтений до маршрута</h2>
          <ol className={styles.list}>
            {steps.map((item) => (
              <li key={item.n}>
                <p className={styles.n}>{item.n}</p>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}

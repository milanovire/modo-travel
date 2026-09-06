import { Button } from '@/shared/ui/Button'
import { routes } from '@/shared/config/routes'
import styles from './HeroMosaic.module.scss'

export function HeroMosaic() {
  return (
    <section className={styles.root} id="hero-container" aria-label="Главный экран">
      <div className={styles.frame}>
        <div className={styles.visual}>
          <img
            className={styles.photo}
            src="/photos/braslav.jpg"
            alt="Браславские озёра: вода, мостки и лес на северном берегу"
          />
          <div className={styles.shade} aria-hidden="true" />
          <p className={styles.spine}>Браслав | Витебская область</p>
          <div className={styles.headline}>
            <p className={styles.kicker}>Путешествия только по Беларуси</p>
            <h1>
              <span className={styles.light}>Соберите</span>
              <span className={styles.heavy}>свой маршрут</span>
            </h1>
          </div>
          <Button to={routes.matcher} size="lg" className={styles.cta}>
            Подобрать путешествие
          </Button>
        </div>
        <div className={styles.cards}>
          <article className={styles.note}>
            <p>Северная вода без курортного шума. Отсюда начинается подбор: не список must see, а маршрут под ваш ритм.</p>
          </article>
          <article className={styles.proof}>
            <p className={styles.proofLabel}>Направления</p>
            <p className={styles.proofValue}>10 мест</p>
            <p>Пуща, Полесье, малые города и замки рядом с водой.</p>
          </article>
          <article className={styles.place}>
            <img src="/photos/kossovo.jpg" alt="Дворец Пусловских в Коссово" />
            <div>
              <p className={styles.placeLabel}>Рядом, но иначе</p>
              <p className={styles.placeTitle}>Коссово</p>
              <p>Неоготика в поле, без очереди на смотровую.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

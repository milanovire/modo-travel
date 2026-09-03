import { useEffect } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { formats } from '@/entities/trip-preference'
import { getDestinationById } from '@/entities/destination'
import { routes } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { Tag } from '@/shared/ui/Tag'
import { useTheme, withLockedTheme } from '@/shared/lib/theme'
import styles from './DestinationPage.module.scss'

export function DestinationPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { setFormatOverride, theme } = useTheme()
  const destination = id ? getDestinationById(id) : undefined

  useEffect(() => {
    if (!destination) return
    const fromUrl = params.get('formats') ?? params.get('format') ?? params.get('t')
    if (fromUrl) return
    setFormatOverride(destination.formats.slice(0, 1))
    return () => setFormatOverride(null)
  }, [destination, params, setFormatOverride])

  if (!destination) {
    return <Navigate to={routes.home} replace />
  }

  const formatItems = formats.filter((item) => destination.formats.includes(item.id))
  const itineraryTo = withLockedTheme(routes.itinerary(destination.id), params, theme)

  return (
    <article>
      <header className={styles.hero}>
        <img src={destination.cover} alt={destination.title} />
        <div className={styles.heroPanel}>
          <p className={styles.kicker}>{destination.region}</p>
          <h1 className={styles.title}>{destination.title}</h1>
          <p className={styles.caption}>{destination.kicker}</p>
        </div>
      </header>
      <Container className={styles.body}>
        <div className={styles.intro}>
          <div>
            <div className={styles.tags}>
              {formatItems.map((item) => (
                <Tag key={item.id} tone={item.tone}>
                  {item.title}
                </Tag>
              ))}
              <Tag>{destination.durationLabel}</Tag>
            </div>
            <p className={styles.lead}>{destination.summary}</p>
            <p className={styles.text}>{destination.description}</p>
          </div>
          <aside className={styles.aside}>
            <p className={styles.asideLabel}>Программа</p>
            <p className={styles.asideText}>Соберите точки на карте, порядок и длительность — без бронирования.</p>
            <Button to={itineraryTo} block>
              Составить маршрут
            </Button>
            <Button to={routes.matcher} variant="secondary" block>
              Подобрать другое
            </Button>
          </aside>
        </div>
        <section className={styles.block}>
          <h2 className={styles.h2}>Что смотреть</h2>
          <div className={styles.attractions}>
            {destination.attractions.map((item) => (
              <figure key={item.title} className={styles.figure}>
                <img src={item.photo} alt={item.title} />
                <figcaption>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section className={styles.block}>
          <h2 className={styles.h2}>Особенности</h2>
          <div className={styles.features}>
            {destination.features.map((item) => (
              <article key={item.title} className={styles.feature}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.block}>
          <h2 className={styles.h2}>Активности</h2>
          <ul className={styles.activities}>
            {destination.activities.map((item) => (
              <li key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <span>{item.duration}</span>
              </li>
            ))}
          </ul>
        </section>
        <div className={styles.gallery}>
          {destination.gallery.map((src) => (
            <img key={src} src={src} alt={destination.title} />
          ))}
        </div>
        <div className={styles.bottomCta}>
          <div>
            <h2 className={styles.h2}>Составить маршрут</h2>
            <p>Добавьте точки, поменяйте порядок и соберите программу поездки.</p>
          </div>
          <Button to={itineraryTo} size="lg">
            Составить маршрут
          </Button>
        </div>
      </Container>
    </article>
  )
}

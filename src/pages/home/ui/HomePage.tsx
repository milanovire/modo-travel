import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { destinations, getUnusualDestinations } from '@/entities/destination'
import { routes } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { CtaBand } from '@/widgets/cta-band'
import { FormatBand } from '@/widgets/format-band'
import { HeroMosaic } from '@/widgets/hero-mosaic'
import { HowItWorks } from '@/widgets/how-it-works'
import { FixedScrollToHero } from '@/shared/ui/ScrollCue'
import styles from './HomePage.module.scss'

export function HomePage() {
  const location = useLocation()
  const unusual = getUnusualDestinations()
  const featured = destinations.filter((item) => item.featured)
  const lead = featured[0]
  const rest = featured.slice(1, 3)

  useEffect(() => {
    if (location.hash) {
      const node = document.querySelector(location.hash)
      if (node) node.scrollIntoView({ block: 'start' })
    }
  }, [location.hash])

  return (
    <>
      <HeroMosaic />
      <HowItWorks />
      {lead ? (
        <section className={styles.feature} id="napravleniya">
          <div className={styles.featureStage}>
            <img src={lead.cover} alt={lead.title} />
            <article className={styles.featureCard}>
              <p className={styles.kicker}>{lead.region}</p>
              <h2>{lead.title}</h2>
              <p className={styles.summary}>{lead.summary}</p>
              <Button to={routes.destination(lead.id)} variant="accent">
                Смотреть направление
              </Button>
            </article>
            <ul className={styles.rest}>
              {rest.map((item) => (
                <li key={item.id}>
                  <Link to={routes.destination(item.id)}>
                    <img src={item.cover} alt="" />
                    <span>
                      <strong>{item.title}</strong>
                      <em>{item.kicker}</em>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      <FormatBand />
      <section className={styles.unusual}>
        <Container>
          <p className={styles.kicker}>Рядом, но не на виду</p>
          <h2 className={styles.heading}>Малоизвестные маршруты</h2>
        </Container>
        <div className={styles.unusualStage}>
          {unusual.map((item, index) => (
            <Link
              key={item.id}
              to={routes.destination(item.id)}
              className={index === 0 ? styles.unusualLead : styles.unusualItem}
            >
              <img src={item.cover} alt={item.title} />
              <span>
                <strong>{item.title}</strong>
                <em>{item.summary}</em>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
      <FixedScrollToHero />
    </>
  )
}

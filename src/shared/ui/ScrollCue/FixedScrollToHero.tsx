import { useEffect, useState } from 'react'
import { ScrollCue } from './ScrollCue'
import styles from './ScrollCue.module.scss'

export function FixedScrollToHero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function update() {
      const hero = document.getElementById('hero-container')
      if (!hero) {
        setVisible(false)
        return
      }
      setVisible(hero.getBoundingClientRect().bottom <= 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={styles.fixed}>
      <ScrollCue href="#hero-container" direction="up" label="Вернуться к началу" />
    </div>
  )
}

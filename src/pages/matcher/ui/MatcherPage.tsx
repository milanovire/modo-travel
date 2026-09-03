import { Container } from '@/shared/ui/Container'
import { QuizFlow } from '@/features/trip-quiz'
import styles from './MatcherPage.module.scss'

export function MatcherPage() {
  return (
    <div className={styles.root}>
      <Container>
        <p className={styles.kicker}>Подбор путешествия</p>
        <QuizFlow />
      </Container>
    </div>
  )
}

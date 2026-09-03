import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MainLayout } from '@/app/layouts/MainLayout'
import { ThemeProvider } from '@/app/theme/ThemeProvider'
import { DestinationPage } from '@/pages/destination'
import { HomePage } from '@/pages/home'
import { ItineraryPage } from '@/pages/itinerary'
import { MatcherPage } from '@/pages/matcher'
import { RecommendationsPage } from '@/pages/recommendations'
import { ComparePage } from '@/pages/compare'
import { JourneyPage } from '@/pages/journey'
import { ReadyPage } from '@/pages/ready'
import { routes } from '@/shared/config/routes'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={routes.home} element={<HomePage />} />
            <Route path={routes.matcher} element={<MatcherPage />} />
            <Route path={routes.results} element={<RecommendationsPage />} />
            <Route path={routes.compare} element={<ComparePage />} />
            <Route path="/napravlenie/:id" element={<DestinationPage />} />
            <Route path="/marshrut/:id/gotov" element={<ReadyPage />} />
            <Route path="/marshrut/:id/puteshestvie" element={<JourneyPage />} />
            <Route path="/marshrut/:id" element={<ItineraryPage />} />
            <Route path="*" element={<Navigate to={routes.home} replace />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

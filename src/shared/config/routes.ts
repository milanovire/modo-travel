export const routes = {
  home: '/',
  matcher: '/podbor',
  results: '/rekomendacii',
  searchPanel: '/search-panel',
  compare: '/sravnenie',
  destination: (id: string) => `/napravlenie/${id}`,
  itinerary: (id: string) => `/marshrut/${id}`,
  ready: (id: string) => `/marshrut/${id}/gotov`,
  journey: (id: string) => `/marshrut/${id}/puteshestvie`,
} as const

export function matcherWithFormat(format: string): string {
  return `${routes.matcher}?format=${format}`
}

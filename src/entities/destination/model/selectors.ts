import { destinations } from './destinations'
import type { Destination } from './types'

export function getDestinationById(id: string): Destination | undefined {
  return destinations.find((item) => item.id === id)
}

export function getFeaturedDestinations(): Destination[] {
  return destinations.filter((item) => item.featured)
}

export function getUnusualDestinations(): Destination[] {
  return destinations.filter((item) => item.unusual)
}

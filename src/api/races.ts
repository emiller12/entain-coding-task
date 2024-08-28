import type { NextRacesResponse } from './types'

export async function getNextRaces(categoryId: string): Promise<RaceSummary[]> {
  const url = 'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=30'

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const nextRaces = (await response.json()) as NextRacesResponse

    let raceSummaries = Object.values(nextRaces.data.race_summaries)

    // Sort by start time and filter out any that started more than a minute ago
    raceSummaries = raceSummaries
      .sort((a, b) => a.advertised_start.seconds - b.advertised_start.seconds)
      .filter((r) => (r.advertised_start.seconds * 1000) > (Date.now() - 60000))

    // Apply the category filter
    if (categoryId && categoryId !== 'all') {
      raceSummaries = raceSummaries.filter((r) => r.category_id === categoryId)
    }

    // Only return 5
    return raceSummaries.slice(0, 5)
  } catch (error) {
    console.error('Error fetching next races:', error)
    throw error
  }
}

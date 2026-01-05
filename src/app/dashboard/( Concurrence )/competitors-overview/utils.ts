import type { CompetitorItem } from './action'

/**
 * Statistiques sur les concurrents
 */
export interface CompetitorsStats {
  totalCompetitors: number
  avgKeywordsIntersection: number
  avgOrganicKeywords: number
  avgPaidKeywords: number
  totalOrganicKeywords: number
  totalPaidKeywords: number
  avgETV: number
  topCompetitorsByKeywords: Array<{ domain: string; count: number }>
  topCompetitorsByETV: Array<{ domain: string; etv: number }>
  topCompetitorsByPosition: Array<{ domain: string; position: number }>
}

export function calculateCompetitorsStats(
  competitors: CompetitorItem[],
): CompetitorsStats {
  const stats: CompetitorsStats = {
    totalCompetitors: competitors.length,
    avgKeywordsIntersection: 0,
    avgOrganicKeywords: 0,
    avgPaidKeywords: 0,
    totalOrganicKeywords: 0,
    totalPaidKeywords: 0,
    avgETV: 0,
    topCompetitorsByKeywords: [],
    topCompetitorsByETV: [],
    topCompetitorsByPosition: [],
  }

  if (competitors.length === 0) return stats

  let totalIntersections = 0
  let totalOrganicCount = 0
  let totalPaidCount = 0
  let totalETV = 0

  competitors.forEach((competitor) => {
    totalIntersections += competitor.intersections || 0
    totalOrganicCount += competitor.metrics?.organic?.count || 0
    totalPaidCount += competitor.metrics?.paid?.count || 0
    totalETV +=
      (competitor.metrics?.organic?.etv || 0) +
      (competitor.metrics?.paid?.etv || 0)
  })

  stats.avgKeywordsIntersection = totalIntersections / competitors.length
  stats.avgOrganicKeywords = totalOrganicCount / competitors.length
  stats.avgPaidKeywords = totalPaidCount / competitors.length
  stats.totalOrganicKeywords = totalOrganicCount
  stats.totalPaidKeywords = totalPaidCount
  stats.avgETV = totalETV / competitors.length

  // Top par nombre de mots-clés
  stats.topCompetitorsByKeywords = [...competitors]
    .sort(
      (a, b) =>
        (b.metrics?.organic?.count || 0) - (a.metrics?.organic?.count || 0),
    )
    .slice(0, 10)
    .map((c) => ({
      domain: c.domain,
      count: c.metrics?.organic?.count || 0,
    }))

  // Top par ETV
  stats.topCompetitorsByETV = [...competitors]
    .sort(
      (a, b) => (b.metrics?.organic?.etv || 0) - (a.metrics?.organic?.etv || 0),
    )
    .slice(0, 10)
    .map((c) => ({
      domain: c.domain,
      etv: c.metrics?.organic?.etv || 0,
    }))

  // Top par position moyenne
  stats.topCompetitorsByPosition = [...competitors]
    .filter((c) => c.avg_position > 0)
    .sort((a, b) => a.avg_position - b.avg_position)
    .slice(0, 10)
    .map((c) => ({
      domain: c.domain,
      position: c.avg_position,
    }))

  return stats
}


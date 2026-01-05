import type { KeywordGapResponse, KeywordGapStats } from './action'

/**
 * Statistiques sur les keyword gaps
 */
export function calculateKeywordGapStats(
  data: KeywordGapResponse,
): KeywordGapStats {
  const stats: KeywordGapStats = {
    totalKeywords: data.items.length,
    totalSearchVolume: 0,
    totalETV: 0,
    avgSearchVolume: 0,
    avgCPC: 0,
    avgPosition: 0,
    intentDistribution: {},
    competitionDistribution: {},
    positionDistribution: {
      top3: 0,
      top10: 0,
      top20: 0,
      top50: 0,
      top100: 0,
    },
    topKeywordsByVolume: [],
    topKeywordsByETV: [],
    easyWins: [],
  }

  if (data.items.length === 0) return stats

  let totalCPC = 0
  let cpcCount = 0
  let totalPosition = 0
  let positionCount = 0

  const keywordsData: Array<{
    keyword: string
    searchVolume: number
    etv: number
    cpc: number | null
    position: number
    competition: string
    intent: string | null
  }> = []

  data.items.forEach((item) => {
    const keyword = item.keyword_data?.keyword || ''
    const keywordInfo = item.keyword_data?.keyword_info
    const searchVolume = keywordInfo?.search_volume || 0
    const cpc = keywordInfo?.cpc || null
    const competitionValue = keywordInfo?.competition || null
    // Convertir competition (0-1) en niveau
    const competition =
      competitionValue === null
        ? 'UNKNOWN'
        : competitionValue < 0.33
          ? 'LOW'
          : competitionValue < 0.66
            ? 'MEDIUM'
            : 'HIGH'

    stats.totalSearchVolume += searchVolume

    // ETV et Position depuis first_domain_serp_element
    let etv = 0
    let position = 999
    const serpElement = item.first_domain_serp_element
    if (serpElement) {
      position = serpElement.rank_absolute || 999
      etv = serpElement.etv || 0
      // Si ETV n'est pas disponible, l'estimer
      if (etv === 0) {
        etv = estimateETV(searchVolume, position, cpc)
      }
    }

    stats.totalETV += etv

    if (cpc !== null) {
      totalCPC += cpc
      cpcCount++
    }

    if (position < 999) {
      totalPosition += position
      positionCount++

      // Distribution par position
      if (position <= 3) stats.positionDistribution.top3++
      if (position <= 10) stats.positionDistribution.top10++
      if (position <= 20) stats.positionDistribution.top20++
      if (position <= 50) stats.positionDistribution.top50++
      if (position <= 100) stats.positionDistribution.top100++
    }

    // Distribution par compétition
    stats.competitionDistribution[competition] =
      (stats.competitionDistribution[competition] || 0) + 1

    keywordsData.push({
      keyword,
      searchVolume,
      etv,
      cpc,
      position,
      competition,
      intent: null, // Pas disponible dans la nouvelle structure
    })

    // Easy wins (faible compétition, bon volume)
    if (
      (competition === 'LOW' || competition === 'MEDIUM') &&
      searchVolume >= 100 &&
      position <= 20
    ) {
      if (stats.easyWins.length < 10) {
        stats.easyWins.push({
          keyword,
          searchVolume,
          competition,
          position,
        })
      }
    }
  })

  // Moyennes
  stats.avgSearchVolume = Math.round(
    stats.totalSearchVolume / data.items.length,
  )
  stats.avgCPC = cpcCount > 0 ? totalCPC / cpcCount : 0
  stats.avgPosition = positionCount > 0 ? totalPosition / positionCount : 0

  // Top keywords par volume
  stats.topKeywordsByVolume = keywordsData
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 10)
    .map((kw) => ({
      keyword: kw.keyword,
      searchVolume: kw.searchVolume,
      position: kw.position,
      etv: kw.etv,
    }))

  // Top keywords par ETV
  stats.topKeywordsByETV = keywordsData
    .sort((a, b) => b.etv - a.etv)
    .slice(0, 10)
    .map((kw) => ({
      keyword: kw.keyword,
      etv: kw.etv,
      searchVolume: kw.searchVolume,
      position: kw.position,
    }))

  // Trier easy wins
  stats.easyWins.sort((a, b) => b.searchVolume - a.searchVolume)

  return stats
}

// Fonction pour estimer l'ETV
function estimateETV(
  searchVolume: number,
  position: number,
  cpc: number | null,
): number {
  if (position > 100) return 0

  // CTR estimé par position
  const ctrByPosition: Record<number, number> = {
    1: 0.28,
    2: 0.15,
    3: 0.11,
    4: 0.08,
    5: 0.07,
    6: 0.05,
    7: 0.04,
    8: 0.03,
    9: 0.03,
    10: 0.02,
  }

  const ctr = position <= 10 ? ctrByPosition[position] : 0.01
  const clicks = searchVolume * ctr
  const value = cpc ? clicks * cpc : clicks * 0.5 // 0.5€ par défaut si pas de CPC

  return Math.round(value)
}


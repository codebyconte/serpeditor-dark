import type { DomainIntersectionResponse, DomainIntersectionStats } from './action'

/**
 * Statistiques sur l'intersection
 */
export function calculateIntersectionStats(data: DomainIntersectionResponse): DomainIntersectionStats {
  const stats: DomainIntersectionStats = {
    totalReferringDomains: data.items.length,
    targetCount: Object.keys(data.targets).length,
    avgBacklinksPerDomain: 0,
    avgReferringDomainsPerTarget: 0,
    topReferringDomains: [],
    intersectionMatrix: {},
    topTLDs: [],
  }

  if (data.items.length === 0) return stats

  const tldCount = new Map<string, number>()
  let totalBacklinks = 0
  const referringDomainsPerTarget = new Map<string, Set<string>>()

  // Initialiser les compteurs par target
  Object.keys(data.targets).forEach((targetId) => {
    referringDomainsPerTarget.set(targetId, new Set())
  })

  // Analyser chaque domaine référent
  const domainsData: Array<{
    domain: string
    totalBacklinks: number
    targetsCount: number
  }> = []

  data.items.forEach((item) => {
    // Ignorer les items sans referring_domain
    if (!item.referring_domain) return

    const referringDomain = item.referring_domain
    let domainTotalBacklinks = 0
    let domainTargetsCount = 0

    // Compter les backlinks et targets pour ce domaine
    Object.keys(item.domain_intersection).forEach((targetId) => {
      const targetData = item.domain_intersection[targetId]
      domainTotalBacklinks += targetData.backlinks || 0
      domainTargetsCount++

      // Ajouter ce domaine au set du target
      if (referringDomainsPerTarget.has(targetId)) {
        referringDomainsPerTarget.get(targetId)!.add(referringDomain)
      }
    })

    totalBacklinks += domainTotalBacklinks
    domainsData.push({
      domain: referringDomain,
      totalBacklinks: domainTotalBacklinks,
      targetsCount: domainTargetsCount,
    })

    // Compter les TLDs
    const tld = referringDomain.split('.').pop() || 'unknown'
    tldCount.set(tld, (tldCount.get(tld) || 0) + 1)

    // Matrice d'intersection (combien pointent vers X targets)
    const key = `${domainTargetsCount}`
    stats.intersectionMatrix[key] = (stats.intersectionMatrix[key] || 0) + 1
  })

  // Moyennes
  stats.avgBacklinksPerDomain = Math.round(totalBacklinks / data.items.length)

  const totalReferringDomains = Array.from(referringDomainsPerTarget.values()).reduce((sum, set) => sum + set.size, 0)
  stats.avgReferringDomainsPerTarget = Math.round(totalReferringDomains / stats.targetCount)

  // Top domaines référents
  stats.topReferringDomains = domainsData.sort((a, b) => b.totalBacklinks - a.totalBacklinks).slice(0, 10)

  // Top TLDs
  stats.topTLDs = Array.from(tldCount.entries())
    .map(([tld, count]) => ({ tld, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return stats
}

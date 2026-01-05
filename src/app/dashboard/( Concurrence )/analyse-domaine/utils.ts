import type { DomainWhoisItem, DomainWhoisStats } from './action'

/**
 * Statistiques sur les domaines
 */
export function calculateDomainWhoisStats(
  domains: DomainWhoisItem[],
): DomainWhoisStats {
  const stats: DomainWhoisStats = {
    totalDomains: domains.length,
    expiredDomains: 0,
    activeDomains: 0,
    avgBacklinks: 0,
    avgReferringDomains: 0,
    avgOrganicKeywords: 0,
    avgETV: 0,
    topTLDs: [],
    topByBacklinks: [],
    topByKeywords: [],
    topByETV: [],
  }

  if (domains.length === 0) return stats

  const tlds = new Map<string, number>()
  let totalBacklinks = 0
  let totalReferringDomains = 0
  let totalKeywords = 0
  let totalETV = 0

  domains.forEach((domain) => {
    // Status
    if (!domain.registered) {
      stats.expiredDomains++
    } else {
      stats.activeDomains++
    }

    // Backlinks
    totalBacklinks += domain.backlinks_info?.backlinks || 0
    totalReferringDomains += domain.backlinks_info?.referring_main_domains || 0

    // Keywords & ETV
    totalKeywords += domain.metrics?.organic?.count || 0
    totalETV += domain.metrics?.organic?.etv || 0

    // TLDs
    const tld = domain.tld
    if (tld) {
      const count = tlds.get(tld) || 0
      tlds.set(tld, count + 1)
    }
  })

  stats.avgBacklinks = totalBacklinks / domains.length
  stats.avgReferringDomains = totalReferringDomains / domains.length
  stats.avgOrganicKeywords = totalKeywords / domains.length
  stats.avgETV = totalETV / domains.length

  // Top TLDs
  stats.topTLDs = Array.from(tlds.entries())
    .map(([tld, count]) => ({ tld, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Top par backlinks
  stats.topByBacklinks = [...domains]
    .sort(
      (a, b) =>
        (b.backlinks_info?.backlinks || 0) - (a.backlinks_info?.backlinks || 0),
    )
    .slice(0, 10)
    .map((d) => ({
      domain: d.domain,
      backlinks: d.backlinks_info?.backlinks || 0,
    }))

  // Top par keywords
  stats.topByKeywords = [...domains]
    .sort(
      (a, b) =>
        (b.metrics?.organic?.count || 0) - (a.metrics?.organic?.count || 0),
    )
    .slice(0, 10)
    .map((d) => ({
      domain: d.domain,
      keywords: d.metrics?.organic?.count || 0,
    }))

  // Top par ETV
  stats.topByETV = [...domains]
    .sort(
      (a, b) => (b.metrics?.organic?.etv || 0) - (a.metrics?.organic?.etv || 0),
    )
    .slice(0, 10)
    .map((d) => ({
      domain: d.domain,
      etv: d.metrics?.organic?.etv || 0,
    }))

  return stats
}


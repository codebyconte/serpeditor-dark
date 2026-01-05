import type { BacklinkItem } from './action'

/**
 * Statistiques sur les backlinks
 */
export interface BacklinkStats {
  totalBacklinks: number
  dofollowCount: number
  nofollowCount: number
  uniqueDomains: number
  newBacklinks: number
  lostBacklinks: number
  brokenBacklinks: number
  avgDomainRank: number
  avgPageRank: number
  avgSpamScore: number
  topCountries: Array<{ country: string; count: number }>
  topTLDs: Array<{ tld: string; count: number }>
  topAnchors: Array<{ anchor: string; count: number }>
  linkTypes: {
    text: number
    image: number
    redirect: number
    frame: number
    form: number
  }
}

export function calculateBacklinkStats(
  backlinks: BacklinkItem[],
): BacklinkStats {
  const stats: BacklinkStats = {
    totalBacklinks: backlinks.length,
    dofollowCount: 0,
    nofollowCount: 0,
    uniqueDomains: new Set<string>().size,
    newBacklinks: 0,
    lostBacklinks: 0,
    brokenBacklinks: 0,
    avgDomainRank: 0,
    avgPageRank: 0,
    avgSpamScore: 0,
    topCountries: [],
    topTLDs: [],
    topAnchors: [],
    linkTypes: {
      text: 0,
      image: 0,
      redirect: 0,
      frame: 0,
      form: 0,
    },
  }

  if (backlinks.length === 0) return stats

  const domains = new Set<string>()
  const countries = new Map<string, number>()
  const tlds = new Map<string, number>()
  const anchors = new Map<string, number>()
  let totalDomainRank = 0
  let totalPageRank = 0
  let totalSpamScore = 0

  backlinks.forEach((backlink) => {
    // Domains
    domains.add(backlink.domain_from)

    // Dofollow/Nofollow
    if (backlink.dofollow) {
      stats.dofollowCount++
    } else {
      stats.nofollowCount++
    }

    // New/Lost/Broken
    if (backlink.is_new) stats.newBacklinks++
    if (backlink.is_lost) stats.lostBacklinks++
    if (backlink.is_broken) stats.brokenBacklinks++

    // Ranks
    totalDomainRank += backlink.domain_from_rank || 0
    totalPageRank += backlink.page_from_rank || 0
    totalSpamScore += backlink.backlink_spam_score || 0

    // Countries
    if (backlink.domain_from_country) {
      const count = countries.get(backlink.domain_from_country) || 0
      countries.set(backlink.domain_from_country, count + 1)
    }

    // TLDs
    const tld = backlink.tld_from
    if (tld) {
      const count = tlds.get(tld) || 0
      tlds.set(tld, count + 1)
    }

    // Anchors
    if (backlink.anchor) {
      const count = anchors.get(backlink.anchor) || 0
      anchors.set(backlink.anchor, count + 1)
    }

    // Link types
    if (backlink.item_type === 'link') {
      if (backlink.anchor && backlink.anchor.includes('<img')) {
        stats.linkTypes.image++
      } else {
        stats.linkTypes.text++
      }
    } else if (backlink.item_type === 'redirect') {
      stats.linkTypes.redirect++
    } else if (backlink.item_type === 'frame') {
      stats.linkTypes.frame++
    } else if (backlink.item_type === 'form') {
      stats.linkTypes.form++
    }
  })

  stats.uniqueDomains = domains.size
  stats.avgDomainRank = totalDomainRank / backlinks.length
  stats.avgPageRank = totalPageRank / backlinks.length
  stats.avgSpamScore = totalSpamScore / backlinks.length

  // Top countries
  stats.topCountries = Array.from(countries.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Top TLDs
  stats.topTLDs = Array.from(tlds.entries())
    .map(([tld, count]) => ({ tld, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Top Anchors
  stats.topAnchors = Array.from(anchors.entries())
    .map(([anchor, count]) => ({ anchor, count }))
    .filter((item) => item.anchor.length > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  return stats
}


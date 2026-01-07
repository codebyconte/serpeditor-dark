'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Types pour Historical SERP - Structure améliorée basée sur l'API DataForSEO

// Interface de base pour tous les éléments SERP
export interface BaseSERPItem {
  type: string
  rank_group: number
  rank_absolute: number
  position?: string
  xpath?: string
  [key: string]: unknown // Permet d'accepter toutes les propriétés supplémentaires
}

// Interface pour les éléments organiques
export interface OrganicSERPItem extends BaseSERPItem {
  type: 'organic'
  domain: string
  title: string
  url: string
  breadcrumb?: string
  description?: string
  is_image?: boolean
  is_video?: boolean
  is_featured_snippet?: boolean
  is_malicious?: boolean
  etv?: number
  estimated_paid_traffic_cost?: number
  rank_changes?: {
    previous_rank_absolute: number | null
    is_new: boolean
    is_up: boolean
    is_down: boolean
  }
  main_domain?: string
  relative_url?: string
  highlighted?: string[]
  links?: Array<{
    type: string
    title: string
    description?: string | null
    url: string
  }>
  about_this_result?: {
    type: string
    url: string
    source?: string | null
    source_info?: string | null
    source_url?: string | null
    language?: string
    location?: string
    search_terms?: string[]
    related_terms?: string[] | null
  }
}

// Interface pour les éléments payants
export interface PaidSERPItem extends BaseSERPItem {
  type: 'paid'
  domain: string
  title: string
  description?: string
  breadcrumb?: string
  url: string
  highlighted?: string[]
  extra?: {
    ad_aclk?: string
  }
  description_rows?: Array<{
    type: string
    text: string
  }> | null
  links?: Array<{
    type: string
    title: string
    description?: string | null
    url: string
    ad_aclk?: string
  }>
  main_domain?: string
  relative_url?: string
  etv?: number
  estimated_paid_traffic_cost?: number
  rank_changes?: {
    previous_rank_absolute: number | null
    is_new: boolean
    is_up: boolean
    is_down: boolean
  }
}

// Interface pour les featured snippets
export interface FeaturedSnippetSERPItem extends BaseSERPItem {
  type: 'featured_snippet'
  domain: string
  title: string
  featured_title?: string | null
  description?: string
  url: string
  table?: {
    table_header?: string[]
    table_content?: string[][]
  } | null
  main_domain?: string
  relative_url?: string
  etv?: number
  estimated_paid_traffic_cost?: number
  rank_changes?: {
    previous_rank_absolute: number | null
    is_new: boolean
    is_up: boolean
    is_down: boolean
  }
}

// Union type pour tous les types d'éléments SERP
export type HistoricalSERPItem = OrganicSERPItem | PaidSERPItem | FeaturedSnippetSERPItem | BaseSERPItem // Pour tous les autres types (carousel, video, knowledge_graph, etc.)

export interface HistoricalSERPSnapshot {
  se_type: string
  keyword: string
  location_code: number
  language_code: string
  datetime: string
  se_results_count: number
  items_count: number
  items: HistoricalSERPItem[]
  // Propriétés supplémentaires de l'API
  check_url?: string
  spell?: string | null
  item_types?: string[]
  total_count?: number
}

export interface HistoricalSERPResponse {
  se_type: string
  keyword: string
  location_code: number
  language_code: string
  items: HistoricalSERPSnapshot[]
}

/**
 * Récupère l'historique SERP pour un mot-clé
 * @param keyword - Mot-clé à analyser (max 700 caractères)
 * @param locationCode - Code de localisation (ex: 2250 pour France)
 * @param languageCode - Code de langue (ex: "fr" pour français)
 * @param options - Options supplémentaires
 * @param options.dateFrom - Date de début au format "yyyy-mm-dd" (optionnel, min 365 jours avant aujourd'hui)
 * @param options.dateTo - Date de fin au format "yyyy-mm-dd" (optionnel, par défaut aujourd'hui)
 * @param options.tag - Identifiant utilisateur pour identifier la tâche (optionnel, max 255 caractères)
 */
export async function getHistoricalSERP(
  keyword: string,
  locationCode: number,
  languageCode: string,
  options?: {
    dateFrom?: string // format: "yyyy-mm-dd"
    dateTo?: string // format: "yyyy-mm-dd"
    tag?: string // Identifiant utilisateur (max 255 caractères)
  },
): Promise<{
  success: boolean
  data?: HistoricalSERPResponse
  error?: string
}> {
  try {
    // Authentification avec Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return { success: false, error: 'Non authentifié' }
    }

    // Validation du keyword
    const trimmedKeyword = keyword.trim()
    if (!trimmedKeyword) {
      return { success: false, error: 'Le mot-clé est requis' }
    }

    if (trimmedKeyword.length > 700) {
      return {
        success: false,
        error: 'Le mot-clé ne peut pas dépasser 700 caractères',
      }
    }

    // Validation du format des dates si fournies
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (options?.dateFrom && !dateRegex.test(options.dateFrom)) {
      return {
        success: false,
        error: 'Le format de date_from doit être "yyyy-mm-dd"',
      }
    }

    if (options?.dateTo && !dateRegex.test(options.dateTo)) {
      return {
        success: false,
        error: 'Le format de date_to doit être "yyyy-mm-dd"',
      }
    }

    // Validation du tag si fourni
    if (options?.tag && options.tag.length > 255) {
      return {
        success: false,
        error: 'Le tag ne peut pas dépasser 255 caractères',
      }
    }

    // Construction du payload selon la documentation API
    const payload = [
      {
        keyword: trimmedKeyword,
        location_code: locationCode,
        language_code: languageCode,
        ...(options?.dateFrom && { date_from: options.dateFrom }),
        ...(options?.dateTo && { date_to: options.dateTo }),
        ...(options?.tag && { tag: options.tag }),
      },
    ]

    const response = await fetch(`${process.env.DATAFORSEO_URL}/dataforseo_labs/google/historical_serps/live`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${process.env.DATAFORSEO_PASSWORD}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    if (result.status_code !== 20000) {
      return {
        success: false,
        error: result.status_message || 'Erreur API inconnue',
      }
    }

    const taskResult = result.tasks?.[0]?.result?.[0]
    if (!taskResult) {
      return {
        success: false,
        error: 'Aucun résultat trouvé',
      }
    }

    // Transformer les données pour correspondre à notre structure
    const allSnapshots: HistoricalSERPSnapshot[] = (taskResult.items || []).map(
      (item: {
        se_type: string
        keyword: string
        location_code: number
        language_code: string
        datetime: string
        se_results_count: number
        items_count: number
        items: unknown[]
        check_url?: string
        spell?: string | null
        item_types?: string[]
        total_count?: number
      }) => ({
        se_type: item.se_type,
        keyword: item.keyword,
        location_code: item.location_code,
        language_code: item.language_code,
        datetime: item.datetime,
        se_results_count: item.se_results_count,
        items_count: item.items_count,
        items: (item.items || []) as HistoricalSERPItem[],
        check_url: item.check_url,
        spell: item.spell,
        item_types: item.item_types,
        total_count: item.total_count,
      }),
    )

    // Si des dates sont fournies, filtrer pour trouver les snapshots les plus proches
    let filteredSnapshots = allSnapshots

    if (options?.dateFrom || options?.dateTo) {
      const targetDateFrom = options?.dateFrom ? new Date(options.dateFrom + 'T00:00:00') : null
      const targetDateTo = options?.dateTo ? new Date(options.dateTo + 'T23:59:59') : null

      if (targetDateFrom && targetDateTo) {
        // Filtrer les snapshots dans la plage de dates
        filteredSnapshots = allSnapshots.filter((snapshot) => {
          const snapshotDate = new Date(snapshot.datetime)
          return snapshotDate >= targetDateFrom && snapshotDate <= targetDateTo
        })

        // Si aucun snapshot exact dans la plage, trouver les plus proches
        if (filteredSnapshots.length === 0 && allSnapshots.length > 0) {
          // Trouver le snapshot le plus proche de dateFrom
          const closestToFrom = allSnapshots.reduce((closest, current) => {
            const closestDate = new Date(closest.datetime)
            const currentDate = new Date(current.datetime)
            const closestDiff = Math.abs(closestDate.getTime() - targetDateFrom!.getTime())
            const currentDiff = Math.abs(currentDate.getTime() - targetDateFrom!.getTime())
            return currentDiff < closestDiff ? current : closest
          })

          // Trouver le snapshot le plus proche de dateTo
          const closestToTo = allSnapshots.reduce((closest, current) => {
            const closestDate = new Date(closest.datetime)
            const currentDate = new Date(current.datetime)
            const closestDiff = Math.abs(closestDate.getTime() - targetDateTo!.getTime())
            const currentDiff = Math.abs(currentDate.getTime() - targetDateTo!.getTime())
            return currentDiff < closestDiff ? current : closest
          })

          // Inclure tous les snapshots entre les deux plus proches
          const sortedSnapshots = [...allSnapshots].sort(
            (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
          )

          const fromIndex = sortedSnapshots.findIndex((s) => s.datetime === closestToFrom.datetime)
          const toIndex = sortedSnapshots.findIndex((s) => s.datetime === closestToTo.datetime)

          if (fromIndex !== -1 && toIndex !== -1) {
            const startIndex = Math.min(fromIndex, toIndex)
            const endIndex = Math.max(fromIndex, toIndex)
            filteredSnapshots = sortedSnapshots.slice(startIndex, endIndex + 1)
          } else {
            // Fallback : prendre les 2 snapshots les plus proches
            filteredSnapshots = [closestToFrom, closestToTo].filter(
              (s, i, arr) => arr.findIndex((x) => x.datetime === s.datetime) === i,
            )
          }
        }
      } else if (targetDateFrom) {
        // Seulement dateFrom : trouver le snapshot le plus proche après cette date
        filteredSnapshots = allSnapshots
          .filter((snapshot) => new Date(snapshot.datetime) >= targetDateFrom)
          .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

        if (filteredSnapshots.length === 0 && allSnapshots.length > 0) {
          // Prendre le snapshot le plus proche de dateFrom
          filteredSnapshots = [
            allSnapshots.reduce((closest, current) => {
              const closestDate = new Date(closest.datetime)
              const currentDate = new Date(current.datetime)
              const closestDiff = Math.abs(closestDate.getTime() - targetDateFrom.getTime())
              const currentDiff = Math.abs(currentDate.getTime() - targetDateFrom.getTime())
              return currentDiff < closestDiff ? current : closest
            }),
          ]
        }
      } else if (targetDateTo) {
        // Seulement dateTo : trouver le snapshot le plus proche avant cette date
        filteredSnapshots = allSnapshots
          .filter((snapshot) => new Date(snapshot.datetime) <= targetDateTo)
          .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())

        if (filteredSnapshots.length === 0 && allSnapshots.length > 0) {
          // Prendre le snapshot le plus proche de dateTo
          filteredSnapshots = [
            allSnapshots.reduce((closest, current) => {
              const closestDate = new Date(closest.datetime)
              const currentDate = new Date(current.datetime)
              const closestDiff = Math.abs(closestDate.getTime() - targetDateTo.getTime())
              const currentDiff = Math.abs(currentDate.getTime() - targetDateTo.getTime())
              return currentDiff < closestDiff ? current : closest
            }),
          ]
        }
      }
    }

    // Trier les snapshots par date
    filteredSnapshots.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

    return {
      success: true,
      data: {
        se_type: taskResult.se_type,
        keyword: taskResult.keyword,
        location_code: taskResult.location_code,
        language_code: taskResult.language_code,
        items: filteredSnapshots,
      },
    }
  } catch (error) {
    console.error('Error fetching historical SERP:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Compare deux SERP snapshots
 */
export interface SERPComparison {
  date1: string
  date2: string
  totalChanges: number
  newDomains: Array<{
    domain: string
    position: number
    title?: string
    url?: string
  }>
  lostDomains: Array<{
    domain: string
    previousPosition: number
    title?: string
    url?: string
  }>
  positionChanges: Array<{
    domain: string
    oldPosition: number
    newPosition: number
    change: number
    direction: 'up' | 'down' | 'stable'
    title?: string
    url?: string
  }>
  volatilityScore: number
  averagePositionChange: number
}

export async function compareSERPs(
  serp1: HistoricalSERPSnapshot,
  serp2: HistoricalSERPSnapshot,
): Promise<SERPComparison> {
  // Filtrer uniquement les éléments organiques avec type guard
  const isOrganicItem = (item: HistoricalSERPItem): item is OrganicSERPItem => item.type === 'organic'

  const organicItems1 = serp1.items.filter(isOrganicItem)
  const organicItems2 = serp2.items.filter(isOrganicItem)

  const domains1 = new Map(
    organicItems1.map((item) => [
      item.domain,
      {
        position: item.rank_absolute,
        title: item.title,
        url: item.url,
      },
    ]),
  )

  const domains2 = new Map(
    organicItems2.map((item) => [
      item.domain,
      {
        position: item.rank_absolute,
        title: item.title,
        url: item.url,
      },
    ]),
  )

  const allDomains = new Set([...domains1.keys(), ...domains2.keys()])

  const newDomains: SERPComparison['newDomains'] = []
  const lostDomains: SERPComparison['lostDomains'] = []
  const positionChanges: SERPComparison['positionChanges'] = []

  let totalPositionChange = 0
  let changedDomainsCount = 0

  allDomains.forEach((domain) => {
    const inSerp1 = domains1.has(domain)
    const inSerp2 = domains2.has(domain)

    if (!inSerp1 && inSerp2) {
      const data = domains2.get(domain)!
      newDomains.push({
        domain,
        position: data.position,
        title: data.title,
        url: data.url,
      })
    } else if (inSerp1 && !inSerp2) {
      const data = domains1.get(domain)!
      lostDomains.push({
        domain,
        previousPosition: data.position,
        title: data.title,
        url: data.url,
      })
    } else if (inSerp1 && inSerp2) {
      const data1 = domains1.get(domain)!
      const data2 = domains2.get(domain)!
      const change = data1.position - data2.position

      if (change !== 0) {
        totalPositionChange += Math.abs(change)
        changedDomainsCount++
      }

      positionChanges.push({
        domain,
        oldPosition: data1.position,
        newPosition: data2.position,
        change,
        direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
        title: data2.title,
        url: data2.url,
      })
    }
  })

  positionChanges.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))

  const volatilityScore =
    allDomains.size > 0 ? (newDomains.length + lostDomains.length + changedDomainsCount) / allDomains.size : 0

  const averagePositionChange = changedDomainsCount > 0 ? totalPositionChange / changedDomainsCount : 0

  return {
    date1: serp1.datetime,
    date2: serp2.datetime,
    totalChanges: newDomains.length + lostDomains.length + changedDomainsCount,
    newDomains,
    lostDomains,
    positionChanges,
    volatilityScore,
    averagePositionChange,
  }
}

/**
 * Analyse la volatilité sur une période
 */
export async function analyzeSERPVolatility(snapshots: HistoricalSERPSnapshot[]) {
  if (snapshots.length < 2) {
    return {
      averageVolatility: 0,
      maxVolatility: 0,
      minVolatility: 0,
      trend: 'stable' as 'increasing' | 'decreasing' | 'stable',
      comparisons: [],
    }
  }

  const sortedSnapshots = [...snapshots].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

  const comparisons = []
  const volatilityScores = []

  for (let i = 1; i < sortedSnapshots.length; i++) {
    const comparison = await compareSERPs(sortedSnapshots[i - 1], sortedSnapshots[i])
    comparisons.push(comparison)
    volatilityScores.push(comparison.volatilityScore)
  }

  const averageVolatility = volatilityScores.reduce((sum, score) => sum + score, 0) / volatilityScores.length
  const maxVolatility = Math.max(...volatilityScores)
  const minVolatility = Math.min(...volatilityScores)

  const recentScores = volatilityScores.slice(-3)
  const earlyScores = volatilityScores.slice(0, 3)
  const recentAvg = recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length
  const earlyAvg = earlyScores.reduce((sum, s) => sum + s, 0) / earlyScores.length

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
  if (recentAvg > earlyAvg * 1.2) trend = 'increasing'
  else if (recentAvg < earlyAvg * 0.8) trend = 'decreasing'

  return {
    averageVolatility,
    maxVolatility,
    minVolatility,
    trend,
    comparisons,
  }
}

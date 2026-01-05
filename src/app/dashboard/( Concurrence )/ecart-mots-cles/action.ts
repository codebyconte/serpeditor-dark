'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Types pour Keyword Gap
export interface KeywordMetrics {
  organic: {
    pos_1: number
    pos_2_3: number
    pos_4_10: number
    pos_11_20: number
    pos_21_30: number
    pos_31_40: number
    pos_41_50: number
    pos_51_60: number
    pos_61_70: number
    pos_71_80: number
    pos_81_90: number
    pos_91_100: number
    etv: number
    count: number
  }
  paid?: {
    count: number
    etv: number
  }
}

export interface SERPElement {
  se_type: string
  type: string
  rank_group: number
  rank_absolute: number
  position: string
  xpath: string
  domain: string
  title: string
  url: string
  breadcrumb: string | null
  is_image: boolean
  is_video: boolean
  is_featured_snippet: boolean
  is_malicious: boolean
  is_web_story?: boolean
  description: string
  pre_snippet: string | null
  extended_snippet: string | null
  amp_version: boolean
  rating: {
    rating_type: string
    value: number
    votes_count: number
    rating_max: number
  } | null
  highlighted: string[] | null
  links: Array<unknown> | null
  about_this_result: {
    type: string
    url: string
    source: string | null
    source_info: unknown | null
    source_url: string | null
    language: string
    location: string
    search_terms: string[] | null
    related_terms: unknown | null
  } | null
  main_domain: string
  relative_url: string
  etv: number
  estimated_paid_traffic_cost: number
  rank_changes: {
    previous_rank_absolute: number | null
    is_new: boolean
    is_up: boolean
    is_down: boolean
  }
}

export interface KeywordData {
  se_type: string
  keyword: string
  location_code: number
  language_code: string
  keyword_info: {
    se_type: string
    last_updated_time: string
    competition: number | null
    competition_level?: string
    cpc: number | null
    search_volume: number
    low_top_of_page_bid?: number | null
    high_top_of_page_bid?: number | null
    categories: number[] | null
    monthly_searches: Array<{
      year: number
      month: number
      search_volume: number
    }> | null
  }
  serp_info: unknown | null
}

export interface KeywordGapItem {
  se_type: string
  keyword_data: KeywordData
  first_domain_serp_element: SERPElement | null
  second_domain_serp_element: SERPElement | null
}

export interface KeywordGapResponse {
  targets: Record<string, string>
  location_code: number
  language_code: string
  total_count: number
  items_count: number
  items: KeywordGapItem[]
}

/**
 * Analyse les écarts de mots-clés entre domaines
 */
/**
 * Analyse les écarts de mots-clés entre domaines
 * @param options - Options de recherche
 * @param options.target1 - Domaine 1 (concurrent)
 * @param options.target2 - Domaine 2 (votre site)
 * @param options.locationCode - Code de localisation (défaut: 2250 = France)
 * @param options.languageCode - Code de langue (défaut: 'fr')
 * @param options.intersections - true = mots-clés communs, false = gaps (défaut)
 * @param options.filters - Filtres de recherche (max 8 filtres)
 * @param options.limit - Nombre maximum de résultats (1-1000, défaut: 100)
 * @param options.offset - Décalage dans les résultats (défaut: 0)
 * @param options.includeSubdomains - Inclure les sous-domaines (défaut: true)
 */
export async function getKeywordGap(options: {
  target1: string // Concurrent (qui se positionne)
  target2: string // Votre site (qui ne se positionne PAS sur ces KW)
  locationCode?: number // 2250 = France
  languageCode?: string // 'fr' = Français
  intersections?: boolean // false = gaps (défaut), true = communs
  filters?: Array<unknown>
  limit?: number
  offset?: number
  includeSubdomains?: boolean
}): Promise<{ success: boolean; data?: KeywordGapResponse; error?: string }> {
  try {
    // Authentification avec Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return { success: false, error: 'Non authentifié' }
    }

    if (!options.target1 || !options.target2) {
      return { success: false, error: 'Les 2 domaines sont requis' }
    }

    // Nettoyer les domaines
    const cleanTarget1 = options.target1
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/$/, '')
    const cleanTarget2 = options.target2
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/$/, '')

    // Validations
    if (options.limit !== undefined) {
      if (options.limit < 1 || options.limit > 1000) {
        return {
          success: false,
          error: 'La limite doit être entre 1 et 1000',
        }
      }
    }

    if (options.offset !== undefined && options.offset < 0) {
      return {
        success: false,
        error: 'Le décalage doit être supérieur ou égal à 0',
      }
    }

    if (options.filters && options.filters.length > 8) {
      return {
        success: false,
        error: 'Maximum 8 filtres autorisés',
      }
    }

    const payload = [
      {
        target1: cleanTarget1,
        target2: cleanTarget2,
        location_code: options.locationCode || 2250, // France par défaut
        language_code: options.languageCode || 'fr',
        intersections: options.intersections ?? false, // false par défaut = gaps
        ...(options.filters && { filters: options.filters }),
        limit: options.limit || 100,
        offset: options.offset || 0,
        ...(options.includeSubdomains !== undefined && {
          include_subdomains: options.includeSubdomains,
        }),
      },
    ]

    const response = await fetch(
      `${process.env.DATAFORSEO_URL}/dataforseo_labs/google/domain_intersection/live`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${process.env.DATAFORSEO_PASSWORD}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    console.log(result.tasks[0].result)

    if (result.status_code !== 20000) {
      return {
        success: false,
        error: result.status_message || 'Erreur API inconnue',
      }
    }

    // Vérifier le statut de la tâche
    const task = result.tasks?.[0]
    if (!task) {
      return {
        success: false,
        error: 'Aucune tâche trouvée dans la réponse',
      }
    }

    if (task.status_code !== 20000) {
      return {
        success: false,
        error: task.status_message || 'Erreur lors du traitement de la tâche',
      }
    }

    const taskResult = task.result?.[0]
    if (!taskResult) {
      return {
        success: false,
        error: 'Aucun résultat trouvé dans la réponse de la tâche',
      }
    }

    // Extraire les données
    const items = Array.isArray(taskResult.items) ? taskResult.items : []
    const totalCount = taskResult.total_count ?? 0
    const itemsCount = taskResult.items_count ?? items.length

    // Extraire les targets depuis la réponse ou les créer
    const targets: Record<string, string> = {}
    if (taskResult.target1) targets['1'] = taskResult.target1
    if (taskResult.target2) targets['2'] = taskResult.target2
    if (Object.keys(targets).length === 0) {
      targets['1'] = cleanTarget1
      targets['2'] = cleanTarget2
    }

    return {
      success: true,
      data: {
        targets,
        location_code: taskResult.location_code || options.locationCode || 2250,
        language_code: taskResult.language_code || options.languageCode || 'fr',
        total_count: totalCount,
        items_count: itemsCount,
        items: items,
      },
    }
  } catch (error) {
    console.error('Error fetching keyword gap:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Statistiques sur les keyword gaps
 */
export interface KeywordGapStats {
  totalKeywords: number
  totalSearchVolume: number
  totalETV: number
  avgSearchVolume: number
  avgCPC: number
  avgPosition: number
  intentDistribution: Record<string, number>
  competitionDistribution: Record<string, number>
  positionDistribution: {
    top3: number
    top10: number
    top20: number
    top50: number
    top100: number
  }
  topKeywordsByVolume: Array<{
    keyword: string
    searchVolume: number
    position: number
    etv: number
  }>
  topKeywordsByETV: Array<{
    keyword: string
    etv: number
    searchVolume: number
    position: number
  }>
  easyWins: Array<{
    keyword: string
    searchVolume: number
    competition: string
    position: number
  }>
}

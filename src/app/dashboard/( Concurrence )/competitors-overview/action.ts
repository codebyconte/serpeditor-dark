'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Types pour Competitors
export interface ClickstreamGenderDistribution {
  female: number
  male: number
}

export interface ClickstreamAgeDistribution {
  '18-24': number
  '25-34': number
  '35-44': number
  '45-54': number
  '55-64': number
}

export interface CompetitorMetrics {
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
    estimated_paid_traffic_cost: number
    is_new: number
    is_up: number
    is_down: number
    is_lost: number
    clickstream_etv?: number
    clickstream_gender_distribution?: ClickstreamGenderDistribution
    clickstream_age_distribution?: ClickstreamAgeDistribution
  }
  paid?: {
    pos_1: number
    pos_2_3: number
    pos_4_10: number
    pos_11_20: number
    pos_21_30?: number
    pos_31_40?: number
    pos_41_50?: number
    pos_51_60?: number
    pos_61_70?: number
    pos_71_80?: number
    pos_81_90?: number
    pos_91_100?: number
    etv: number
    count: number
    estimated_paid_traffic_cost: number
    is_new: number
    is_up: number
    is_down: number
    is_lost: number
    clickstream_etv?: number
    clickstream_gender_distribution?: ClickstreamGenderDistribution
    clickstream_age_distribution?: ClickstreamAgeDistribution
  }
  featured_snippet?: {
    count: number
    etv: number
  } | null
  local_pack?: {
    count: number
    etv: number
  } | null
}

export interface CompetitorItem {
  se_type: string
  domain: string
  avg_position: number
  sum_position: number
  intersections: number
  full_domain_metrics: CompetitorMetrics
  metrics: CompetitorMetrics
  competitor_metrics?: CompetitorMetrics
  competing_domains?: number
}

export interface CompetitorsResponse {
  se_type: string
  target: string
  location_code: number
  language_code: string
  total_count: number
  items_count: number
  items: CompetitorItem[]
}

// Configuration DataForSEO
const credentials = process.env.DATAFORSEO_PASSWORD

/**
 * Récupère les concurrents d'un domaine
 * Localisation et langue fixées : France (2250) et Français (fr)
 * Limit fixé à 100, max_rank_group fixé à 100
 */
export async function getCompetitors(
  target: string,
  options?: {
    includeClickstreamData?: boolean
    filters?: Array<unknown>
    orderBy?: string[]
    offset?: number
    excludeTopDomains?: boolean
    excludeDomains?: string[]
    intersectingDomains?: string[]
    ignoreSynonyms?: boolean
    tag?: string
  },
): Promise<{ success: boolean; data?: CompetitorsResponse; error?: string }> {
  try {
    // Authentification avec Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return { success: false, error: 'Non authentifié' }
    }

    if (!credentials) {
      return { success: false, error: 'Configuration API manquante' }
    }

    // Valider le target
    if (!target.trim()) {
      return { success: false, error: 'Le domaine cible est requis' }
    }

    // Location et langue fixées : France (2250) et Français (fr)

    // Valider exclude_domains (max 1000)
    if (options?.excludeDomains && options.excludeDomains.length > 1000) {
      return {
        success: false,
        error: 'exclude_domains ne peut pas contenir plus de 1000 domaines',
      }
    }

    // Valider intersecting_domains (max 20)
    if (
      options?.intersectingDomains &&
      options.intersectingDomains.length > 20
    ) {
      return {
        success: false,
        error: 'intersecting_domains ne peut pas contenir plus de 20 domaines',
      }
    }

    // Valider tag (max 255 caractères)
    if (options?.tag && options.tag.length > 255) {
      return {
        success: false,
        error: 'Le tag ne peut pas dépasser 255 caractères',
      }
    }

    // Valider orderBy (max 3 règles)
    if (options?.orderBy && options.orderBy.length > 3) {
      return {
        success: false,
        error: 'Maximum 3 règles de tri autorisées',
      }
    }

    // Nettoyer le target
    const cleanTarget = target
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/$/, '')

    const payload = [
      {
        target: cleanTarget,
        location_code: 2250, // France
        language_code: 'fr', // Français
        item_types: ['organic', 'paid'],
        ...(options?.includeClickstreamData !== undefined && {
          include_clickstream_data: options.includeClickstreamData,
        }),
        ...(options?.filters && { filters: options.filters }),
        ...(options?.orderBy && { order_by: options.orderBy }),
        limit: 100,
        offset: options?.offset ?? 0,
        max_rank_group: 100,
        exclude_top_domains: options?.excludeTopDomains ?? false,
        ...(options?.excludeDomains &&
          options.excludeDomains.length > 0 && {
            exclude_domains: options.excludeDomains,
          }),
        ...(options?.intersectingDomains &&
          options.intersectingDomains.length > 0 && {
            intersecting_domains: options.intersectingDomains,
          }),
        ignore_synonyms: options?.ignoreSynonyms ?? false,
        ...(options?.tag && { tag: options.tag }),
      },
    ]

    const response = await fetch(
      `${process.env.DATAFORSEO_URL}/dataforseo_labs/google/competitors_domain/live`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    console.log(result)

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

    // Retourner les données même si items est vide mais total_count > 0
    // Cela permet d'afficher qu'il y a des concurrents même si on n'en affiche pas
    return {
      success: true,
      data: {
        se_type: taskResult.se_type || 'google',
        target: taskResult.target || cleanTarget,
        location_code: taskResult.location_code || 2250,
        language_code: taskResult.language_code || 'fr',
        total_count: totalCount,
        items_count: itemsCount,
        items: items,
      },
    }
  } catch (error) {
    console.error('Error fetching competitors:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

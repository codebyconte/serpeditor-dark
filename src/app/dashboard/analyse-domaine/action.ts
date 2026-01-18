'use server'

import { auth } from '@/lib/auth'
import { checkAndIncrementUsage } from '@/lib/usage-utils'
import { headers } from 'next/headers'

// Types pour Domain WHOIS
export interface BacklinksInfo {
  referring_domains: number
  referring_main_domains: number
  referring_pages: number
  dofollow: number
  backlinks: number
  time_update: string | null
}

export interface OrganicMetrics {
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
}

export interface PaidMetrics {
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
}

export interface DomainMetrics {
  organic: OrganicMetrics
  paid?: PaidMetrics
}

export interface DomainWhoisItem {
  se_type: string
  domain: string
  created_datetime: string | null
  changed_datetime: string | null
  expiration_datetime: string | null
  updated_datetime: string | null
  first_seen: string | null
  epp_status_codes: string[] | null
  tld: string
  registered: boolean
  registrar: string | null
  backlinks_info: BacklinksInfo
  metrics: DomainMetrics
}

export interface DomainWhoisResponse {
  se_type: string
  total_count: number
  items_count: number
  items: DomainWhoisItem[]
}

// Configuration DataForSEO

/**
 * Récupère les domaines expirés avec leurs métriques WHOIS
 * @param options - Options de recherche
 * @param options.filters - Filtres de recherche (max 8 filtres)
 * @param options.orderBy - Règles de tri (max 3 règles)
 * @param options.limit - Nombre maximum de résultats (1-1000, défaut: 100)
 * @param options.offset - Décalage dans les résultats (défaut: 0)
 * @param options.tag - Identifiant de tâche personnalisé (max 255 caractères)
 */
export async function getDomainWhoisOverview(options?: {
  filters?: Array<unknown>
  orderBy?: string[]
  limit?: number
  offset?: number
  tag?: string
}): Promise<{ success: boolean; data?: DomainWhoisResponse; error?: string; limitReached?: boolean }> {
  try {
    // Authentification avec Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return { success: false, error: 'Non authentifié' }
    }

    // Vérification des limites d'usage pour les analyses de domaines
    const usageCheck = await checkAndIncrementUsage(session.user.id, 'domainAnalyses')
    if (!usageCheck.allowed) {
      return {
        success: false,
        error: usageCheck.message || 'Limite d\'analyses de domaines atteinte',
        limitReached: true,
      }
    }

    // Validations
    if (options?.limit !== undefined) {
      if (options.limit < 1 || options.limit > 1000) {
        return {
          success: false,
          error: 'La limite doit être entre 1 et 1000',
        }
      }
    }

    if (options?.offset !== undefined && options.offset < 0) {
      return {
        success: false,
        error: 'Le décalage doit être supérieur ou égal à 0',
      }
    }

    if (options?.filters && options.filters.length > 8) {
      return {
        success: false,
        error: 'Maximum 8 filtres autorisés',
      }
    }

    if (options?.orderBy && options.orderBy.length > 3) {
      return {
        success: false,
        error: 'Maximum 3 règles de tri autorisées',
      }
    }

    if (options?.tag && options.tag.length > 255) {
      return {
        success: false,
        error: 'Le tag ne peut pas dépasser 255 caractères',
      }
    }

    const payload = [
      {
        ...(options?.filters && { filters: options.filters }),
        ...(options?.orderBy && { order_by: options.orderBy }),
        limit: options?.limit || 100,
        offset: options?.offset || 0,
        ...(options?.tag && { tag: options.tag }),
      },
    ]

    const response = await fetch(
      `${process.env.DATAFORSEO_URL}/dataforseo_labs/google/domain_whois_overview/live`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${process.env.DATAFORSEO_PASSWORD}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        // Cache la réponse pendant 24 heures (86400 secondes)
        next: { revalidate: 86400 },
      },
    )

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

    return {
      success: true,
      data: {
        se_type: taskResult.se_type || 'google',
        total_count: totalCount,
        items_count: itemsCount,
        items: items,
      },
    }
  } catch (error) {
    console.error('Error fetching domain WHOIS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Statistiques sur les domaines
 */
export interface DomainWhoisStats {
  totalDomains: number
  expiredDomains: number
  activeDomains: number
  avgBacklinks: number
  avgReferringDomains: number
  avgOrganicKeywords: number
  avgETV: number
  topTLDs: Array<{ tld: string; count: number }>
  topByBacklinks: Array<{ domain: string; backlinks: number }>
  topByKeywords: Array<{ domain: string; keywords: number }>
  topByETV: Array<{ domain: string; etv: number }>
}

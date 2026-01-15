'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Types pour Domain Intersection
export interface DomainIntersectionTarget {
  type: string // 'backlinks_domain_intersection'
  target: string
  rank: number
  backlinks: number
  first_seen: string | null
  lost_date: number | null // Timestamp (integer) ou null
  backlinks_spam_score: number
  broken_backlinks: number
  broken_pages: number
  referring_domains: number
  referring_domains_nofollow: number
  referring_main_domains: number
  referring_main_domains_nofollow: number
  referring_ips: number
  referring_subnets: number
  referring_pages: number
  referring_pages_nofollow: number
  referring_links_tld: Record<string, number> | null
  referring_links_types: Record<string, number> | null
  referring_links_attributes: Record<string, number> | null
  referring_links_platform_types: Record<string, number> | null
  referring_links_semantic_locations: Record<string, number> | null
  referring_links_countries: Record<string, number> | null
}

export interface DomainIntersectionItem {
  referring_domain?: string // Extrait du premier target dans domain_intersection
  domain_intersection: Record<string, DomainIntersectionTarget> // Clés numérotées de "1" à "20"
  summary: {
    intersections_count: number
  }
}

export interface DomainIntersectionResponse {
  targets: Record<string, string>
  total_count: number
  items_count: number
  items: DomainIntersectionItem[]
}

/**
 * Analyse l'intersection de domaines (sites qui pointent vers plusieurs targets)
 * @param options - Options de recherche
 * @param options.targets - Domaines, sous-domaines ou pages web (max 20)
 * @param options.excludeTargets - Domaines à exclure (max 10)
 * @param options.filters - Filtres de recherche (max 8 filtres)
 * @param options.limit - Nombre maximum de résultats (1-1000, défaut: 100)
 * @param options.offset - Décalage dans les résultats (défaut: 0)
 * @param options.internalListLimit - Limite pour les tableaux internes (1-1000, défaut: 10)
 * @param options.includeSubdomains - Inclure les sous-domaines (défaut: true)
 * @param options.includeIndirectLinks - Inclure les liens indirects (défaut: true)
 * @param options.excludeInternalBacklinks - Exclure les backlinks internes (défaut: true)
 * @param options.intersectionMode - Mode d'intersection: 'all' ou 'partial' (défaut: 'all')
 * @param options.backlinksFilters - Filtres pour les backlinks
 * @param options.backlinksStatusType - Type de backlinks: 'all', 'live' ou 'lost' (défaut: 'live')
 * @param options.rankScale - Échelle de rang: 'one_hundred' ou 'one_thousand' (défaut: 'one_thousand')
 * @param options.tag - Identifiant de tâche personnalisé (max 255 caractères)
 */
export async function getDomainIntersection(options: {
  targets: Record<string, string> // { "1": "domain.com", "2": "example.com", ... }
  excludeTargets?: string[]
  filters?: Array<unknown>
  limit?: number
  offset?: number
  internalListLimit?: number
  includeSubdomains?: boolean
  includeIndirectLinks?: boolean
  excludeInternalBacklinks?: boolean
  intersectionMode?: 'all' | 'partial'
  backlinksFilters?: Array<unknown>
  backlinksStatusType?: 'all' | 'live' | 'lost'
  rankScale?: 'one_hundred' | 'one_thousand'
  tag?: string
}): Promise<{
  success: boolean
  data?: DomainIntersectionResponse
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

    // Valider qu'on a au moins 2 targets
    const targetCount = Object.keys(options.targets).length
    if (targetCount < 2) {
      return {
        success: false,
        error: "Minimum 2 domaines requis pour l'intersection",
      }
    }

    if (targetCount > 20) {
      return { success: false, error: 'Maximum 20 domaines autorisés' }
    }

    // Validations
    if (options.excludeTargets && options.excludeTargets.length > 10) {
      return {
        success: false,
        error: 'Maximum 10 domaines à exclure autorisés',
      }
    }

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

    if (options.internalListLimit !== undefined) {
      if (options.internalListLimit < 1 || options.internalListLimit > 1000) {
        return {
          success: false,
          error: 'internal_list_limit doit être entre 1 et 1000',
        }
      }
    }

    if (options.filters && options.filters.length > 8) {
      return {
        success: false,
        error: 'Maximum 8 filtres autorisés',
      }
    }

    if (options.tag && options.tag.length > 255) {
      return {
        success: false,
        error: 'Le tag ne peut pas dépasser 255 caractères',
      }
    }

    const payload = [
      {
        targets: options.targets,
        ...(options.excludeTargets && {
          exclude_targets: options.excludeTargets,
        }),
        ...(options.filters && { filters: options.filters }),
        limit: options.limit || 100,
        offset: options.offset || 0,
        ...(options.internalListLimit !== undefined && {
          internal_list_limit: options.internalListLimit,
        }),
        ...(options.includeSubdomains !== undefined && {
          include_subdomains: options.includeSubdomains,
        }),
        ...(options.includeIndirectLinks !== undefined && {
          include_indirect_links: options.includeIndirectLinks,
        }),
        ...(options.excludeInternalBacklinks !== undefined && {
          exclude_internal_backlinks: options.excludeInternalBacklinks,
        }),
        ...(options.intersectionMode && {
          intersection_mode: options.intersectionMode,
        }),
        ...(options.backlinksFilters && {
          backlinks_filters: options.backlinksFilters,
        }),
        ...(options.backlinksStatusType && {
          backlinks_status_type: options.backlinksStatusType,
        }),
        ...(options.rankScale && { rank_scale: options.rankScale }),
        ...(options.tag && { tag: options.tag }),
      },
    ]

    const response = await fetch(
      `${process.env.DATAFORSEO_URL}/backlinks/domain_intersection/live`,
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

    // Enrichir les items avec referring_domain extrait du premier target
    const enrichedItems = items.map((item: DomainIntersectionItem) => {
      // Extraire le domaine référent du premier target dans domain_intersection
      const firstTargetKey = Object.keys(item.domain_intersection || {})[0]
      const firstTarget = firstTargetKey
        ? item.domain_intersection[firstTargetKey]
        : null
      const referringDomain = firstTarget?.target || ''

      return {
        ...item,
        referring_domain: referringDomain,
      }
    })

    return {
      success: true,
      data: {
        targets: taskResult.targets || options.targets,
        total_count: totalCount,
        items_count: itemsCount,
        items: enrichedItems,
      },
    }
  } catch (error) {
    console.error('Error fetching domain intersection:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Statistiques sur l'intersection
 */
export interface DomainIntersectionStats {
  totalReferringDomains: number
  targetCount: number
  avgBacklinksPerDomain: number
  avgReferringDomainsPerTarget: number
  topReferringDomains: Array<{
    domain: string
    totalBacklinks: number
    targetsCount: number
  }>
  intersectionMatrix: Record<string, number> // Combien de domaines pointent vers X targets
  topTLDs: Array<{ tld: string; count: number }>
}

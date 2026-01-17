'use server'

import { auth } from '@/lib/auth'
import { checkAndIncrementUsage } from '@/lib/usage-utils'
import { headers } from 'next/headers'

// Types pour l'API SERP Competitors
export interface SERPCompetitor {
  se_type: string
  domain: string
  avg_position: number
  median_position: number
  rating: number
  etv: number
  keywords_count: number
  visibility: number
  relevant_serp_items: number
  keywords_positions: Record<string, number[]> // Array de positions par mot-clé
}

export interface SERPCompetitorsResponse {
  seed_keywords: string[]
  location_code: number
  language_code: string
  total_count: number
  items: SERPCompetitor[]
}

// Types supprimés - on utilise uniquement serp_competitors

// Configuration DataForSEO

const credentials = process.env.DATAFORSEO_PASSWORD

/**
 * Récupère les concurrents SERP pour un ou plusieurs mots-clés
 * Localisation et langue fixées : France (2250) et Français (fr)
 *
 * @param keywords - Array de mots-clés (max 200)
 * @param options - Options de configuration
 * @param options.includeSubdomains - Inclure les sous-domaines (défaut: true)
 * @param options.itemTypes - Types de résultats SERP (défaut: ['organic', 'paid', 'featured_snippet', 'local_pack'])
 * @param options.limit - Nombre maximum de domaines retournés (défaut: 100, max: 1000)
 * @param options.offset - Offset dans les résultats (défaut: 0)
 * @param options.filters - Filtres de résultats (max 8 filtres)
 * @param options.orderBy - Règles de tri (max 3 règles, format: ["field,asc"] ou ["field,desc"])
 * @param options.tag - Identifiant personnalisé pour la tâche (max 255 caractères)
 */
export async function getSERPCompetitors(
  keywords: string[],
  options?: {
    includeSubdomains?: boolean
    itemTypes?: string[]
    limit?: number
    offset?: number
    filters?: Array<unknown>
    orderBy?: string[]
    tag?: string
  },
): Promise<{
  success: boolean
  data?: SERPCompetitorsResponse
  error?: string
  limitReached?: boolean
  upgradeRequired?: boolean
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id) {
      return { success: false, error: 'Non authentifié' }
    }

    // Vérification des limites d'usage
    const usageCheck = await checkAndIncrementUsage(session.user.id, 'keywordSearches')
    if (!usageCheck.allowed) {
      return {
        success: false,
        error: usageCheck.message,
        limitReached: true,
        upgradeRequired: true,
      }
    }

    if (!credentials) {
      return { success: false, error: 'Configuration API manquante' }
    }

    // Valider les keywords (max 200)
    if (keywords.length === 0) {
      return { success: false, error: 'Au moins un mot-clé est requis' }
    }
    if (keywords.length > 200) {
      return { success: false, error: 'Maximum 200 mots-clés autorisés' }
    }

    // Valider le limit (max 1000)
    if (options?.limit !== undefined) {
      if (options.limit < 1) {
        return { success: false, error: 'Le limit doit être supérieur à 0' }
      }
      if (options.limit > 1000) {
        return { success: false, error: 'Le limit ne peut pas dépasser 1000' }
      }
    }

    // Valider l'offset
    if (options?.offset !== undefined && options.offset < 0) {
      return { success: false, error: "L'offset doit être positif ou nul" }
    }

    // Valider le tag (max 255 caractères)
    if (options?.tag !== undefined) {
      if (options.tag.length > 255) {
        return {
          success: false,
          error: 'Le tag ne peut pas dépasser 255 caractères',
        }
      }
    }

    // Valider orderBy (max 3 règles)
    if (options?.orderBy !== undefined) {
      if (options.orderBy.length > 3) {
        return {
          success: false,
          error: 'Maximum 3 règles de tri autorisées',
        }
      }
    }

    // Valider filters (max 8 filtres)
    if (options?.filters !== undefined) {
      // Compter les filtres de base (pas les opérateurs logiques)
      const filterCount = Array.isArray(options.filters)
        ? options.filters.filter((f) => Array.isArray(f) && f.length >= 2).length
        : 0
      if (filterCount > 8) {
        return {
          success: false,
          error: 'Maximum 8 filtres autorisés',
        }
      }
    }

    // Localisation et langue fixées : France (2250) et Français (fr)
    const payload = [
      {
        keywords: keywords.map((k) => k.trim().toLowerCase()).filter(Boolean),
        location_code: 2250, // France
        language_code: 'fr', // Français
        include_subdomains: options?.includeSubdomains ?? true,
        item_types: options?.itemTypes ?? ['organic', 'paid', 'featured_snippet', 'local_pack'],
        limit: options?.limit ?? 100,
        offset: options?.offset ?? 0,
        ...(options?.filters && { filters: options.filters }),
        ...(options?.orderBy && { order_by: options.orderBy }),
        ...(options?.tag && { tag: options.tag }),
      },
    ]

    // Appel API protégé (la vérification de limite est déjà faite plus haut)
    const { protectedDataForSEOPost } = await import('@/lib/dataforseo-protection')
    const result = await protectedDataForSEOPost<{
      status_code: number
      status_message?: string
      tasks?: Array<{
        status_code: number
        status_message?: string
        result?: SERPCompetitorsResponse[]
      }>
    }>(
      session.user.id,
      '/dataforseo_labs/google/serp_competitors/live',
      payload[0],
      0, // Ne pas incrémenter car déjà fait plus haut
    )

    if (result.status_code !== 20000) {
      return {
        success: false,
        error: result.status_message || 'Erreur API inconnue',
      }
    }

    const taskResult = result.tasks?.[0]?.result?.[0] as SERPCompetitorsResponse | undefined
    if (!taskResult) {
      return {
        success: false,
        error: 'Aucun résultat trouvé',
      }
    }

    return {
      success: true,
      data: {
        seed_keywords: taskResult.seed_keywords,
        location_code: taskResult.location_code,
        language_code: taskResult.language_code,
        total_count: taskResult.total_count,
        items: taskResult.items || [],
      },
    }
  } catch (error) {
    console.error('Error fetching SERP competitors:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

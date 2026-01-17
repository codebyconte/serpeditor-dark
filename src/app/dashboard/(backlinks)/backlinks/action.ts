'use server'

import { auth } from '@/lib/auth'
import { checkAndIncrementUsage } from '@/lib/usage-utils'
import { headers } from 'next/headers'

// Types pour Backlinks
export interface BacklinkItem {
  type: string
  domain_from: string
  url_from: string
  url_from_https: boolean
  domain_to: string
  url_to: string
  url_to_https: boolean
  tld_from: string
  is_new: boolean
  is_lost: boolean
  backlink_spam_score: number
  rank: number
  page_from_rank: number
  domain_from_rank: number
  domain_from_platform_type: string[]
  domain_from_is_ip: boolean
  domain_from_country: string | null
  page_from_language: string | null
  page_from_title: string | null
  page_from_status_code: number
  first_seen: string
  prev_seen: string | null
  last_seen: string
  item_type: string
  attributes: string[]
  dofollow: boolean
  original: boolean
  alt: string | null
  anchor: string | null
  text_pre: string | null
  text_post: string | null
  semantic_location: string | null
  links_count: number
  group_count: number
  is_broken: boolean
  url_to_status_code: number
  url_to_spam_score: number
  url_to_redirect_target: string | null
}

export interface BacklinksResponse {
  target: string
  mode: string
  total_count: number
  items_count: number
  items: BacklinkItem[]
  search_after_token?: string
}

// Configuration DataForSEO

/**
 * Récupère les backlinks d'un domaine
 * Mode par défaut: 'as_is' (tous les backlinks)
 * Limit par défaut: 100
 * Status par défaut: 'live' (backlinks actifs uniquement)
 */
export async function getBacklinks(
  target: string,
  options?: {
    offset?: number
    includeSubdomains?: boolean
    includeIndirectLinks?: boolean
    excludeInternalBacklinks?: boolean
    filters?: Array<unknown>
    orderBy?: string[]
  },
): Promise<{ success: boolean; data?: BacklinksResponse; error?: string; limitReached?: boolean; upgradeRequired?: boolean }> {
  try {
    // Authentification avec Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: 'Non authentifié' }
    }

    // Vérification des limites d'usage
    const usageCheck = await checkAndIncrementUsage(session.user.id, 'backlinkAnalyses')
    if (!usageCheck.allowed) {
      return {
        success: false,
        error: usageCheck.message,
        limitReached: true,
        upgradeRequired: true,
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
        mode: 'as_is',
        limit: 100,
        offset: options?.offset || 0,
        backlinks_status_type: 'live',
        include_subdomains: options?.includeSubdomains !== false,
        include_indirect_links: options?.includeIndirectLinks !== false,
        exclude_internal_backlinks: options?.excludeInternalBacklinks !== false,
        ...(options?.filters && { filters: options.filters }),
        ...(options?.orderBy && { order_by: options.orderBy }),
      },
    ]

    const response = await fetch(
      `${process.env.DATAFORSEO_URL}/backlinks/backlinks/live`,
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

    const taskResult = result.tasks?.[0]?.result?.[0]
    if (!taskResult) {
      return {
        success: false,
        error: 'Aucun résultat trouvé',
      }
    }

    return {
      success: true,
      data: {
        target: taskResult.target,
        mode: taskResult.mode,
        total_count: taskResult.total_count,
        items_count: taskResult.items_count,
        items: taskResult.items || [],
        search_after_token: taskResult.search_after_token,
      },
    }
  } catch (error) {
    console.error('Error fetching backlinks:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

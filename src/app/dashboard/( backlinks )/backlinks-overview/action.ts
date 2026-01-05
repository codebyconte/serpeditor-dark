'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { z } from 'zod'

// ===========================
// SCHEMA DE VALIDATION
// ===========================

const BacklinksSummarySchema = z.object({
  customUrl: z.string().min(1, "L'URL est requise"),
  include_subdomains: z.boolean().optional().default(true),
  include_indirect_links: z.boolean().optional().default(true),
  exclude_internal_backlinks: z.boolean().optional().default(true),
  internal_list_limit: z
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .default(10),
  backlinks_status_type: z
    .enum(['all', 'live', 'lost'])
    .optional()
    .default('live'),
  rank_scale: z
    .enum(['one_hundred', 'one_thousand'])
    .optional()
    .default('one_thousand'),
})

// ===========================
// INTERFACES TYPESCRIPT
// ===========================

interface BacklinksSummaryRequest {
  target: string
  include_subdomains?: boolean
  include_indirect_links?: boolean
  exclude_internal_backlinks?: boolean
  internal_list_limit?: number
  backlinks_status_type?: string
  rank_scale?: string
  backlinks_filters?: string[]
  tag?: string
}

interface DataForSEOResponse {
  version: string
  status_code: number
  status_message: string
  time: string
  cost: number
  tasks_count: number
  tasks_error: number
  tasks: Array<{
    id: string
    status_code: number
    status_message: string
    time: string
    cost: number
    result_count: number
    path: string[]
    data: BacklinksSummaryRequest
    result: Array<{
      target: string
      first_seen?: string
      lost_date?: string
      rank?: number
      backlinks?: number
      backlinks_spam_score?: number
      crawled_pages?: number
      info?: {
        server?: string
        cms?: string
        platform_type?: string[]
        ip_address?: string
        country?: string
        is_ip?: boolean
        target_spam_score?: number
      }
      internal_links_count?: number
      external_links_count?: number
      broken_backlinks?: number
      broken_pages?: number
      referring_domains?: number
      referring_domains_nofollow?: number
      referring_main_domains?: number
      referring_main_domains_nofollow?: number
      referring_ips?: number
      referring_subnets?: number
      referring_pages?: number
      referring_links_tld?: Record<string, number>
      referring_links_types?: Record<string, number>
      referring_links_attributes?: Record<string, number>
      referring_links_platform_types?: Record<string, number>
      referring_links_semantic_locations?: Record<string, number>
      referring_links_countries?: Record<string, number>
      referring_pages_nofollow?: number
    }>
  }>
}

export interface BacklinksSummaryState {
  success: boolean
  result?: {
    target: string
    first_seen: string | null
    lost_date: string | null
    rank: number
    backlinks: number
    backlinks_spam_score: number
    crawled_pages: number
    info: {
      server?: string
      cms?: string
      platform_type?: string[]
      ip_address?: string
      country?: string
      is_ip: boolean
      target_spam_score: number
    }
    internal_links_count: number
    external_links_count: number
    broken_backlinks: number
    broken_pages: number
    referring_domains: number
    referring_domains_nofollow: number
    referring_main_domains: number
    referring_main_domains_nofollow: number
    referring_ips: number
    referring_subnets: number
    referring_pages: number
    referring_links_tld: Record<string, number>
    referring_links_types: Record<string, number>
    referring_links_attributes: Record<string, number>
    referring_links_platform_types: Record<string, number>
    referring_links_semantic_locations: Record<string, number>
    referring_links_countries: Record<string, number>
    referring_pages_nofollow: number
  }
  error?: string
  message?: string
}

/**
 * Nettoie l'URL pour l'API DataForSEO
 * - Retire https:// et http://
 * - Retire www.
 * - Pour les pages, garde l'URL complète
 */
function cleanTargetUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    // Si c'est juste le domaine (pas de chemin spécifique), on retourne le domaine sans protocole
    if (urlObj.pathname === '/' && !urlObj.search && !urlObj.hash) {
      return urlObj.hostname.replace(/^www\./, '')
    }
    // Sinon, on retourne l'URL complète
    return url
  } catch {
    // Si ce n'est pas une URL valide, on nettoie manuellement
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '')
  }
}

/**
 * Appelle l'API DataForSEO Backlinks Summary
 */
export async function fetchBacklinksSummary(
  prevState: BacklinksSummaryState,
  formData: FormData,
): Promise<BacklinksSummaryState> {
  console.log("🔗 Début de l'analyse backlinks...")

  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Vous devez être connecté pour effectuer cette action',
      }
    }

    // Valider les données du formulaire
    const rawData = {
      customUrl: formData.get('customUrl') as string | null,
      include_subdomains: formData.get('include_subdomains') === 'true',
      include_indirect_links: formData.get('include_indirect_links') === 'true',
      exclude_internal_backlinks:
        formData.get('exclude_internal_backlinks') === 'true',
      internal_list_limit: formData.get('internal_list_limit')
        ? parseInt(formData.get('internal_list_limit') as string, 10)
        : 10,
      backlinks_status_type:
        (formData.get('backlinks_status_type') as string) || 'live',
      rank_scale: (formData.get('rank_scale') as string) || 'one_thousand',
    }

    const validatedFields = BacklinksSummarySchema.safeParse(rawData)

    if (!validatedFields.success) {
      const errors = validatedFields.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      return {
        success: false,
        error: `Erreur de validation: ${errors}`,
      }
    }

    const {
      customUrl,
      include_subdomains,
      include_indirect_links,
      exclude_internal_backlinks,
      internal_list_limit,
      backlinks_status_type,
      rank_scale,
    } = validatedFields.data

    // Nettoyer l'URL à analyser
    const target = cleanTargetUrl(customUrl)

    // Préparation de la requête DataForSEO
    const requestBody: BacklinksSummaryRequest[] = [
      {
        target,
        include_subdomains,
        include_indirect_links,
        exclude_internal_backlinks,
        internal_list_limit,
        backlinks_status_type,
        rank_scale,
      },
    ]

    console.log('📤 Requête DataForSEO:', JSON.stringify(requestBody, null, 2))

    // Appel à l'API DataForSEO
    const apiUrl = `${process.env.DATAFORSEO_URL}/backlinks/summary/live`
    const credentials = process.env.DATAFORSEO_PASSWORD

    if (!credentials) {
      return {
        success: false,
        error: 'Configuration API manquante',
      }
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erreur API:', response.status, errorText)
      return {
        success: false,
        error: `Erreur API (${response.status}): ${errorText}`,
      }
    }

    const data: DataForSEOResponse = await response.json()

    // Vérifier le statut de la réponse
    if (data.status_code !== 20000) {
      return {
        success: false,
        error: `Erreur API: ${data.status_message || 'Erreur inconnue'}`,
      }
    }

    if (!data.tasks || data.tasks.length === 0) {
      return {
        success: false,
        error: "Aucune tâche retournée par l'API",
      }
    }

    const task = data.tasks[0]

    // Vérifier le statut de la tâche
    if (task.status_code !== 20000) {
      return {
        success: false,
        error: `Erreur tâche: ${task.status_message || 'Erreur inconnue'}`,
      }
    }

    if (!task.result || task.result.length === 0) {
      return {
        success: false,
        error: 'Aucune donnée de backlinks trouvée pour ce site',
      }
    }

    const resultData = task.result[0]

    // Transformer les données pour correspondre à l'interface BacklinkData
    const result = {
      target: resultData.target || target,
      first_seen: resultData.first_seen || null,
      lost_date: resultData.lost_date || null,
      rank: resultData.rank || 0,
      backlinks: resultData.backlinks || 0,
      backlinks_spam_score: resultData.backlinks_spam_score || 0,
      crawled_pages: resultData.crawled_pages || 0,
      info: {
        server: resultData.info?.server,
        cms: resultData.info?.cms,
        platform_type: resultData.info?.platform_type || [],
        ip_address: resultData.info?.ip_address,
        country: resultData.info?.country,
        is_ip: resultData.info?.is_ip || false,
        target_spam_score: resultData.info?.target_spam_score || 0,
      },
      internal_links_count: resultData.internal_links_count || 0,
      external_links_count: resultData.external_links_count || 0,
      broken_backlinks: resultData.broken_backlinks || 0,
      broken_pages: resultData.broken_pages || 0,
      referring_domains: resultData.referring_domains || 0,
      referring_domains_nofollow: resultData.referring_domains_nofollow || 0,
      referring_main_domains: resultData.referring_main_domains || 0,
      referring_main_domains_nofollow:
        resultData.referring_main_domains_nofollow || 0,
      referring_ips: resultData.referring_ips || 0,
      referring_subnets: resultData.referring_subnets || 0,
      referring_pages: resultData.referring_pages || 0,
      referring_links_tld: resultData.referring_links_tld || {},
      referring_links_types: resultData.referring_links_types || {},
      referring_links_attributes: resultData.referring_links_attributes || {},
      referring_links_platform_types:
        resultData.referring_links_platform_types || {},
      referring_links_semantic_locations:
        resultData.referring_links_semantic_locations || {},
      referring_links_countries: resultData.referring_links_countries || {},
      referring_pages_nofollow: resultData.referring_pages_nofollow || 0,
    }

    console.log('✅ Analyse réussie!')
    console.log(
      `📊 Résultats: ${result.backlinks} backlinks trouvés pour ${target}`,
    )
    console.log(`💰 Coût: $${data.cost}`)

    return {
      success: true,
      result,
      message: `Analyse réussie: ${result.backlinks} backlinks trouvés pour ${target}`,
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'appel API:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur inconnue lors de l'analyse",
    }
  }
}

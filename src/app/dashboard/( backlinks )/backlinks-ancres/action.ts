// 📁 app/dashboard/backlinks/ancres/action.ts
'use server'

import { z } from 'zod'

const anchorsSchema = z.object({
  target: z.string().min(1, 'Le domaine cible est requis'),
  limit: z.number().min(1).max(1000).optional().default(100),
  offset: z.number().min(0).optional().default(0),
  backlinks_status_type: z
    .enum(['all', 'live', 'lost'])
    .optional()
    .default('live'),
})

export interface AnchorsState {
  success: boolean
  error?: string
  result?: AnchorsResult
  cost?: number
}

export interface AnchorsResult {
  target: string
  total_count: number
  items_count: number
  items: AnchorItem[]
}

export interface AnchorItem {
  type: string
  anchor: string
  rank: number
  backlinks: number
  first_seen: string
  lost_date: string | null
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
  referring_links_tld: Record<string, number>
  referring_links_types: Record<string, number>
  referring_links_attributes: Record<string, number> | null
  referring_links_platform_types: Record<string, number>
  referring_links_semantic_locations: Record<string, number>
  referring_links_countries: Record<string, number>
  referring_pages_nofollow: number
}

export async function fetchAnchors(
  prevState: AnchorsState,
  formData: FormData,
): Promise<AnchorsState> {
  try {
    // Extraction des données
    const rawTarget = formData.get('target')
    const rawLimit = formData.get('limit')
    const rawOffset = formData.get('offset')
    const rawBacklinksStatus = formData.get('backlinks_status_type')

    if (!rawTarget || typeof rawTarget !== 'string') {
      return { success: false, error: 'Veuillez saisir un domaine cible' }
    }

    // Nettoyage du domaine
    let target = rawTarget.trim()
    const isUrl = target.startsWith('http://') || target.startsWith('https://')

    if (!isUrl) {
      target = target.replace(/^www\./i, '')
      target = target.split('/')[0]
    }

    const limit = rawLimit ? parseInt(rawLimit as string) : 100
    const offset = rawOffset ? parseInt(rawOffset as string) : 0
    const backlinksStatusType = (rawBacklinksStatus as string) || 'live'

    // Validation
    const validated = anchorsSchema.safeParse({
      target,
      limit,
      offset,
      backlinks_status_type: backlinksStatusType,
    })

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0].message,
      }
    }

    // Configuration de la requête
    const requestBody = [
      {
        target: validated.data.target,
        limit: validated.data.limit,
        offset: validated.data.offset,
        backlinks_status_type: validated.data.backlinks_status_type,
        order_by: ['backlinks,desc'],
        exclude_internal_backlinks: true,
        include_subdomains: true,
        include_indirect_links: true,
      },
    ]

    const credentials = process.env.DATAFORSEO_PASSWORD

    // Appel API DataForSEO - toujours "live" par défaut
    const response = await fetch(
      `${process.env.DATAFORSEO_URL}/backlinks/anchors/live`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    )

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const data = await response.json()

    if (data.status_code !== 20000) {
      throw new Error(
        data.status_message || 'Erreur lors de la récupération des données',
      )
    }

    const taskResult = data.tasks?.[0]
    if (!taskResult || !taskResult.result || taskResult.result.length === 0) {
      return {
        success: false,
        error: 'Aucune donnée disponible pour ce domaine',
      }
    }

    return {
      success: true,
      result: taskResult.result[0],
      cost: data.cost,
    }
  } catch (error) {
    console.error('Erreur fetchAnchors:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la récupération des données',
    }
  }
}

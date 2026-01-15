// 📁 app/dashboard/keywords/action.ts
'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { z } from 'zod'

const keywordSchema = z.object({
  keywords: z.string().min(1, 'Au moins un mot-clé est requis'),
  include_clickstream_data: z.boolean().optional(),
})

export interface KeywordOverviewState {
  success: boolean
  error?: string
  results?: KeywordResult[]
  cost?: number
}

export interface KeywordResult {
  keyword: string
  location_code: number
  language_code: string
  search_partners: boolean
  keyword_info: {
    last_updated_time: string
    competition: number // Float 0-1 selon l'API
    competition_level: string | null // LOW, MEDIUM, HIGH ou null
    search_volume: number
    low_top_of_page_bid: number
    high_top_of_page_bid: number
    cpc: number
    categories: number[]
    monthly_searches: Array<{
      year: number
      month: number
      search_volume: number
    }>
  }
  keyword_properties: {
    se_type: string
    core_keyword: string | null
    keyword_difficulty: number
  }
  serp_info?: {
    se_type: string
    check_url: string
    serp_item_types: string[]
    se_results_count: string
    last_updated_time: string
    previous_updated_time: string
  }
  avg_backlinks_info?: {
    se_type: string
    backlinks: number
    dofollow: number
    referring_pages: number
    referring_domains: number
    referring_main_domains: number
    rank: number
    main_domain_rank: number
    last_updated_time: string
  }
  search_intent_info?: {
    se_type: string
    main_intent: string
    foreign_intent: string[] | null
    last_updated_time: string
  }
}

export async function fetchKeywordOverview(
  prevState: KeywordOverviewState,
  formData: FormData,
): Promise<KeywordOverviewState> {
  try {
    // Validation
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id) {
      return { success: false, error: 'Non authentifié' }
    }

    const rawKeywords = formData.get('keywords')
    // Forcer France et français pour le public français uniquement
    const locationCode = '2250' // France
    const languageCode = 'fr' // Français
    const includeSerp = true // Toujours inclure les données SERP
    const includeClickstream =
      formData.get('include_clickstream_data') === 'true'

    if (!rawKeywords || typeof rawKeywords !== 'string') {
      return { success: false, error: 'Veuillez saisir au moins un mot-clé' }
    }

    // Convertir la chaîne en tableau
    const keywords = rawKeywords
      .split('\n')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
      .slice(0, 700) // Max 700 mots-clés

    if (keywords.length === 0) {
      return { success: false, error: 'Aucun mot-clé valide trouvé' }
    }

    // Préparer la requête
    const requestBody = [
      {
        keywords,
        location_code: parseInt(locationCode as string),
        language_code: languageCode,
        include_serp_info: includeSerp,
        include_clickstream_data: includeClickstream,
      },
    ]

    const credentials = process.env.DATAFORSEO_PASSWORD

    // Appel API DataForSEO
    const response = await fetch(
      `${process.env.DATAFORSEO_URL}/dataforseo_labs/google/keyword_overview/live`,
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
        error: 'Aucune donnée disponible pour ces mots-clés',
      }
    }

    const items = taskResult.result[0]?.items || []

    return {
      success: true,
      results: items,
      cost: data.cost,
    }
  } catch (error) {
    console.error('Erreur fetchKeywordOverview:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la récupération des données',
    }
  }
}

// 📁 app/dashboard/mots-cles-organiques/action.ts
'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

const rankedKeywordsSchema = z.object({
  target: z.string().min(1, 'Le domaine cible est requis'),
  limit: z.number().min(1).max(1000).optional(),
  offset: z.number().min(0).optional(),
})

export interface RankedKeywordsState {
  success: boolean
  error?: string
  result?: RankedKeywordsResult
  cost?: number
}

export interface RankedKeywordsResult {
  se_type: string
  target: string
  location_code: number
  language_code: string
  total_count: number
  items_count: number
  metrics: {
    organic: MetricsData
    paid: MetricsData
    featured_snippet: MetricsData
    local_pack: MetricsData
    ai_overview_reference: MetricsData
  }
  metrics_absolute?: {
    organic: MetricsDataAbsolute
    paid: MetricsDataAbsolute
    featured_snippet: MetricsDataAbsolute
    local_pack: MetricsDataAbsolute
    ai_overview_reference: MetricsDataAbsolute
  }
  items: RankedKeywordItem[]
}

export interface MetricsData {
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
}

export interface MetricsDataAbsolute {
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
  is_new: number
  is_up: number
  is_down: number
  is_lost: number
}

export interface RankedKeywordItem {
  se_type: string
  keyword_data: {
    se_type: string
    keyword: string
    location_code: number
    language_code: string
    keyword_info: {
      se_type: string
      last_updated_time: string
      competition: number | null
      competition_level: string | null
      cpc: number | null
      search_volume: number
      low_top_of_page_bid: number | null
      high_top_of_page_bid: number | null
      categories: number[] | null
      monthly_searches: Array<{
        year: number
        month: number
        search_volume: number
      }> | null
      search_volume_trend?: {
        monthly: number
        quarterly: number
        yearly: number
      } | null
    }
    keyword_info_normalized_with_bing?: {
      last_updated_time: string
      search_volume: number
      is_normalized: boolean
      monthly_searches: Array<{
        year: number
        month: number
        search_volume: number
      }>
    } | null
    keyword_info_normalized_with_clickstream?: {
      last_updated_time: string
      search_volume: number
      is_normalized: boolean
      monthly_searches: Array<{
        year: number
        month: number
        search_volume: number
      }>
    } | null
    clickstream_keyword_info?: {
      search_volume: number
      last_updated_time: string
      gender_distribution?: {
        female: number
        male: number
      }
      age_distribution?: {
        '18-24': number
        '25-34': number
        '35-44': number
        '45-54': number
        '55-64': number
      }
      monthly_searches?: Array<{
        year: number
        month: number
        search_volume: number
      }>
    } | null
    keyword_properties: {
      se_type: string
      core_keyword: string | null
      synonym_clustering_algorithm: string | null
      keyword_difficulty: number
      detected_language: string
      is_another_language: boolean
    }
    serp_info: {
      se_type: string
      check_url: string
      serp_item_types: string[]
      se_results_count: number | string
      keyword_difficulty: number
      last_updated_time: string
      is_lost?: boolean
      previous_updated_time?: string
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
    } | null
    search_intent_info?: {
      se_type: string
      main_intent: string
      foreign_intent: string[] | null
      last_updated_time: string
    } | null
  }
  ranked_serp_element: {
    se_type: string
    serp_item:
      | OrganicSerpItem
      | PaidSerpItem
      | FeaturedSnippetSerpItem
      | LocalPackSerpItem
      | AiOverviewReferenceSerpItem
    check_url: string
    serp_item_types: string[]
    se_results_count: number | string
    keyword_difficulty: number
    is_lost: boolean
    last_updated_time?: string
    previous_updated_time?: string
  }
}

// Base interface pour les changements de rang
interface RankChanges {
  previous_rank_absolute: number | null
  is_new: boolean
  is_up: boolean
  is_down: boolean
}

// Base interface pour les informations de backlinks
interface BacklinksInfo {
  referring_domains: number
  referring_main_domains: number
  referring_pages: number
  dofollow: number
  backlinks: number
  time_update: string
}

// Base interface pour les informations de rang
interface RankInfo {
  page_rank: number
  main_domain_rank: number
  clickstream_etv?: number | null
}

// Interface pour les éléments organiques
interface OrganicSerpItem {
  se_type: string
  type: 'organic'
  rank_group: number
  rank_absolute: number
  position?: string
  xpath?: string
  domain: string
  title: string
  url: string
  breadcrumb: string
  website_name?: string
  is_image?: boolean
  is_video?: boolean
  is_featured_snippet: boolean
  is_malicious: boolean
  description: string
  pre_snippet?: string | null
  extended_snippet?: string | null
  amp_version?: boolean
  rating?: {
    rating_type: string
    value: number
    votes_count: number
    rating_max: number
  } | null
  highlighted?: string[]
  links?: Array<{
    type: string
    title: string
    description: string | null
    url: string
  }> | null
  about_this_result?: {
    type: string
    url: string
    source: string
    source_info: string
    source_url: string
    language: string
    location: string
    search_terms: string[]
    related_terms: string[]
  } | null
  main_domain: string
  relative_url: string
  etv: number
  estimated_paid_traffic_cost: number | null
  clickstream_etv?: number | null
  rank_changes: RankChanges
  backlinks_info?: BacklinksInfo | null
  rank_info?: RankInfo
}

// Interface pour les éléments payants
interface PaidSerpItem {
  se_type: string
  type: 'paid'
  rank_group: number
  rank_absolute: number
  position?: string
  xpath?: string
  title: string
  domain: string
  description: string
  breadcrumb: string
  url: string
  highlighted?: string[]
  extra?: {
    ad_aclk: string
  }
  description_rows?: Array<{
    type: string
    text: string
  }> | null
  links?: Array<{
    type: string
    title: string
    description: string | null
    url: string
    ad_aclk?: string
  }> | null
  main_domain: string
  relative_url: string
  etv: number
  estimated_paid_traffic_cost: number | null
  rank_changes: RankChanges
  backlinks_info?: BacklinksInfo | null
  rank_info?: RankInfo
}

// Interface pour les featured snippets
interface FeaturedSnippetSerpItem {
  se_type: string
  type: 'featured_snippet'
  rank_group: number
  rank_absolute: number
  position?: string
  xpath?: string
  domain: string
  title: string
  featured_title?: string
  description: string
  url: string
  table?: {
    table_header: string[]
    table_content: string[][]
  } | null
  main_domain: string
  relative_url: string
  etv: number
  estimated_paid_traffic_cost: number | null
  rank_changes: RankChanges
  backlinks_info?: BacklinksInfo | null
  rank_info?: RankInfo
}

// Interface pour les local packs
interface LocalPackSerpItem {
  se_type: string
  type: 'local_pack'
  rank_group: number
  rank_absolute: number
  position?: string
  xpath?: string
  title: string
  description: string
  domain: string
  phone?: string
  url: string
  is_paid?: boolean
  rating?: {
    rating_type: string
    value: number
    votes_count: number
    rating_max: number
  } | null
  main_domain: string
  relative_url: string
  etv: number
  estimated_paid_traffic_cost: number | null
  rank_changes: RankChanges
  backlinks_info?: BacklinksInfo | null
  rank_info?: RankInfo
}

// Interface pour les références AI Overview
interface AiOverviewReferenceSerpItem {
  se_type: string
  type: 'ai_overview_reference'
  rank_group: number
  rank_absolute: number
  position?: string
  source: string
  domain: string
  title: string
  url: string
  text: string
  main_domain: string
  relative_url: string
  etv: number
  estimated_paid_traffic_cost: number | null
  clickstream_etv?: number | null
  rank_changes: RankChanges
  backlinks_info?: BacklinksInfo | null
  rank_info?: RankInfo
}

export async function fetchRankedKeywords(
  prevState: RankedKeywordsState,
  formData: FormData,
): Promise<RankedKeywordsState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id) {
      return { success: false, error: 'Non authentifié' }
    }

    // Extraction des données
    const rawTarget = formData.get('target')
    const rawLimit = formData.get('limit')
    const rawOffset = formData.get('offset')

    if (!rawTarget || typeof rawTarget !== 'string') {
      return { success: false, error: 'Veuillez saisir un domaine cible' }
    }

    // Nettoyage du domaine (enlever https:// et www. si présents)
    let target = rawTarget.trim()
    target = target.replace(/^https?:\/\//i, '')
    target = target.replace(/^www\./i, '')
    target = target.split('/')[0] // Garder seulement le domaine

    const limit = rawLimit ? parseInt(rawLimit as string) : 100
    const offset = rawOffset ? parseInt(rawOffset as string) : 0

    // Validation
    const validated = rankedKeywordsSchema.safeParse({
      target,
      limit,
      offset,
    })

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0].message,
      }
    }

    // Configuration de la requête
    const locationCode = 2250 // France
    const languageCode = 'fr' // Français

    const requestBody = [
      {
        target: validated.data.target,
        location_code: locationCode,
        language_code: languageCode,
        limit: validated.data.limit,
        offset: validated.data.offset,
        load_rank_absolute: true,
        item_types: ['organic', 'paid', 'featured_snippet', 'local_pack', 'ai_overview_reference'],
        order_by: ['ranked_serp_element.serp_item.rank_group,asc'],
      },
    ]

    const credentials = process.env.DATAFORSEO_PASSWORD

    // Appel API DataForSEO
    const response = await fetch(`${process.env.DATAFORSEO_URL}/dataforseo_labs/google/ranked_keywords/live`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const data = await response.json()

    if (data.status_code !== 20000) {
      throw new Error(data.status_message || 'Erreur lors de la récupération des données')
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
    console.error('Erreur fetchRankedKeywords:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des données',
    }
  }
}

// Récupérer les projets de l'utilisateur
export async function getUserProjects() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Non authentifié',
        data: [],
      }
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        url: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      data: projects,
    }
  } catch (error) {
    console.error('Erreur getUserProjects:', error)
    return {
      success: false,
      error: 'Erreur lors de la récupération des projets',
      data: [],
    }
  }
}

// Interface pour sauvegarder un mot-clé
export interface SaveKeywordData {
  keyword: string
  rankGroup: number
  rankAbsolute?: number
  searchVolume?: number
  locationCode: number
  languageCode: string
}

// Sauvegarder plusieurs mots-clés sélectionnés
export async function saveSelectedKeywords(
  projectId: string,
  keywords: SaveKeywordData[],
): Promise<{ success: boolean; error?: string; saved?: number; skipped?: number }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Non authentifié',
      }
    }

    // Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      return {
        success: false,
        error: "Projet non trouvé ou vous n'avez pas les permissions",
      }
    }

    if (!keywords || keywords.length === 0) {
      return {
        success: false,
        error: 'Aucun mot-clé sélectionné',
      }
    }

    let saved = 0
    let skipped = 0

    // Sauvegarder chaque mot-clé
    for (const keywordData of keywords) {
      try {
        // Vérifier si le mot-clé existe déjà
        const existing = await prisma.keyword.findUnique({
          where: {
            projectId_keyword_locationCode_languageCode: {
              projectId,
              keyword: keywordData.keyword.trim(),
              locationCode: keywordData.locationCode,
              languageCode: keywordData.languageCode,
            },
          },
        })

        if (existing) {
          skipped++
          continue
        }

        // Créer le mot-clé (Prisma génère automatiquement l'ID)
        await prisma.keyword.create({
          data: {
            id: crypto.randomUUID(),
            keyword: keywordData.keyword.trim(),
            projectId,
            locationCode: keywordData.locationCode,
            languageCode: keywordData.languageCode,
            rankGroup: keywordData.rankGroup,
            rankAbsolute: keywordData.rankAbsolute || null,
            lastCheckedAt: new Date(),
          },
        })

        saved++
      } catch (error) {
        console.error(`Erreur lors de la sauvegarde du mot-clé ${keywordData.keyword}:`, error)
        skipped++
      }
    }

    revalidatePath('/dashboard')

    return {
      success: true,
      saved,
      skipped,
    }
  } catch (error) {
    console.error('Erreur saveSelectedKeywords:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde des mots-clés',
    }
  }
}

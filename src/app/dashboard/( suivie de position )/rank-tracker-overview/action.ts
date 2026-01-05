'use server'

import { prisma } from '@/lib/prisma'

// Types pour les réponses DataForSEO
interface DataForSEOResponse<T> {
  status_code: number
  status_message: string
  tasks: Array<{
    id: string
    status_code: number
    status_message: string
    result: T[]
  }>
}

// Types pour l'API Historical Rank Overview
interface HistoricalRankOverviewMetrics {
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
    clickstream_gender_distribution?: {
      female: number
      male: number
    }
    clickstream_age_distribution?: {
      '18-24': number
      '25-34': number
      '35-44': number
      '45-54': number
      '55-64': number
    }
  }
  paid: {
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
    clickstream_gender_distribution?: {
      female: number
      male: number
    }
    clickstream_age_distribution?: {
      '18-24': number
      '25-34': number
      '35-44': number
      '45-54': number
      '55-64': number
    }
  }
}

interface HistoricalRankOverviewItem {
  se_type: string
  year: number
  month: number
  metrics: HistoricalRankOverviewMetrics
}

interface HistoricalRankOverviewResult {
  se_type: string
  target: string
  location_code: number
  language_code: string
  total_count: number
  items_count: number
  items: HistoricalRankOverviewItem[]
}

// Récupérer les domaines depuis la base de données
export async function getDomains() {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        url: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    // Transformer les projets en domaines avec name = url
    const domains = projects.map((project) => ({
      id: project.id,
      name: project.url,
      url: project.url,
    }))
    return { success: true, data: domains }
  } catch (error) {
    console.error('Error fetching domains:', error)
    return { success: false, error: 'Failed to fetch domains' }
  }
}

// Appel à l'API Historical Rank Overview (remplace Domain Rank Overview)
export async function getHistoricalRankOverview(
  target: string,
  locationCode: number = 2250, // France par défaut
  languageCode: string = 'fr',
  dateFrom?: string,
  dateTo?: string,
) {
  try {
    const credentials = process.env.DATAFORSEO_PASSWORD

    if (!credentials) {
      throw new Error('Credentials DataForSEO manquants')
    }

    const requestBody: {
      target: string
      location_code: number
      language_code: string
      date_from?: string
      date_to?: string
      correlate?: boolean
      ignore_synonyms?: boolean
      include_clickstream_data?: boolean
    } = {
      target: target.replace(/^https?:\/\/(www\.)?/, ''),
      location_code: locationCode,
      language_code: languageCode,
      correlate: true,
      ignore_synonyms: false,
      include_clickstream_data: true,
    }

    if (dateFrom) {
      requestBody.date_from = dateFrom
    }
    if (dateTo) {
      requestBody.date_to = dateTo
    }

    const response = await fetch(`${process.env.DATAFORSEO_URL}/dataforseo_labs/google/historical_rank_overview/live`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([requestBody]),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data: DataForSEOResponse<HistoricalRankOverviewResult> = await response.json()

    if (data.status_code !== 20000) {
      throw new Error(data.status_message)
    }

    // Vérifier que la tâche existe et a un résultat
    if (!data.tasks || data.tasks.length === 0) {
      throw new Error('Aucune tâche retournée par l&apos;API')
    }

    const task = data.tasks[0]

    // Vérifier le statut de la tâche
    if (task.status_code !== 20000) {
      throw new Error(task.status_message || 'Erreur lors de la récupération des données')
    }

    // Vérifier que result existe et n'est pas vide
    if (!task.result || task.result.length === 0) {
      return {
        success: true,
        data: {
          se_type: 'google',
          target: target.replace(/^https?:\/\/(www\.)?/, ''),
          location_code: locationCode,
          language_code: languageCode,
          total_count: 0,
          items_count: 0,
          items: [],
        },
      }
    }

    const result = task.result[0]

    // Vérifier que result n'est pas null
    if (!result) {
      return {
        success: true,
        data: {
          se_type: 'google',
          target: target.replace(/^https?:\/\/(www\.)?/, ''),
          location_code: locationCode,
          language_code: languageCode,
          total_count: 0,
          items_count: 0,
          items: [],
        },
      }
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error fetching historical rank overview:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch data',
    }
  }
}

// Récupérer les mots-clés suivis depuis la base de données
export async function getTrackedKeywords(projectId?: string) {
  try {
    const keywords = await prisma.keyword.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { success: true, data: keywords }
  } catch (error) {
    console.error('Error fetching keywords:', error)
    return { success: false, error: 'Failed to fetch keywords' }
  }
}

// Récupérer les données détaillées d'un mot-clé
export async function getKeywordData(keyword: string, locationCode: number = 2250, languageCode: string = 'fr') {
  try {
    const credentials = process.env.DATAFORSEO_PASSWORD

    if (!credentials) {
      throw new Error('Credentials DataForSEO manquants')
    }

    const response = await fetch(`${process.env.DATAFORSEO_URL}/dataforseo_labs/google/keyword_overview/live`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          keywords: [keyword],
          location_code: locationCode,
          language_code: languageCode,
          include_serp_info: true,
          include_clickstream_data: false,
        },
      ]),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    interface KeywordOverviewItem {
      keyword_data?: {
        keyword: string
        keyword_info?: {
          search_volume: number
          cpc: number | null
          competition: number | null
          competition_level: string | null
        }
      }
      serp_info?: Array<{
        se_results_count: number
        keyword_difficulty: number
      }>
    }

    interface KeywordOverviewResult {
      items: KeywordOverviewItem[]
    }

    const data: DataForSEOResponse<KeywordOverviewResult> = await response.json()

    if (data.status_code !== 20000) {
      throw new Error(data.status_message)
    }

    if (!data.tasks || data.tasks.length === 0) {
      throw new Error('Aucune tâche retournée par l&apos;API')
    }

    const task = data.tasks[0]

    if (task.status_code !== 20000) {
      throw new Error(task.status_message || 'Erreur lors de la récupération des données')
    }

    if (!task.result || task.result.length === 0) {
      return {
        success: true,
        data: null,
      }
    }

    const result = task.result[0]

    if (!result || !result.items || result.items.length === 0) {
      return {
        success: true,
        data: null,
      }
    }

    return {
      success: true,
      data: result.items[0] as KeywordOverviewItem,
    }
  } catch (error) {
    console.error('Error fetching keyword data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch data',
    }
  }
}

// Supprimer un mot-clé suivi
export async function deleteKeyword(keywordId: string) {
  try {
    await prisma.keyword.delete({
      where: {
        id: keywordId,
      },
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting keyword:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la suppression du mot-clé',
    }
  }
}

/**
 * Vérifie la position d'un domaine dans les résultats SERP pour un mot-clé
 */
async function checkKeywordPosition(
  keyword: string,
  domain: string,
  locationCode: number = 2250,
  languageCode: string = 'fr',
): Promise<{ rankGroup: number | null; rankAbsolute: number | null }> {
  try {
    const credentials = process.env.DATAFORSEO_PASSWORD
    if (!credentials) {
      throw new Error('Credentials DataForSEO manquants')
    }

    // Nettoyer le domaine
    const cleanDomain = domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/$/, '')

    const response = await fetch(`${process.env.DATAFORSEO_URL}/dataforseo_labs/google/serp/live/advanced`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          keyword: keyword.trim(),
          location_code: locationCode,
          language_code: languageCode,
          device: 'desktop',
          os: 'windows',
          depth: 100, // Vérifier jusqu'à la position 100
          calculate_rectangles: false,
        },
      ]),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status_code !== 20000) {
      throw new Error(data.status_message || 'Erreur API')
    }

    const task = data.tasks?.[0]
    if (!task || task.status_code !== 20000) {
      throw new Error(task?.status_message || 'Erreur lors de la récupération des données')
    }

    const result = task.result?.[0]
    if (!result || !result.items) {
      return { rankGroup: null, rankAbsolute: null }
    }

    // Chercher le domaine dans les résultats organiques
    for (const item of result.items) {
      if (item.type === 'organic' && item.domain) {
        const itemDomain = item.domain
          .toLowerCase()
          .replace(/^(https?:\/\/)?(www\.)?/, '')
          .replace(/\/$/, '')

        // Vérifier si le domaine correspond (avec ou sans sous-domaines)
        if (
          itemDomain === cleanDomain ||
          itemDomain.endsWith(`.${cleanDomain}`) ||
          cleanDomain.endsWith(`.${itemDomain}`)
        ) {
          return {
            rankGroup: item.rank_group || null,
            rankAbsolute: item.rank_absolute || null,
          }
        }
      }
    }

    return { rankGroup: null, rankAbsolute: null }
  } catch (error) {
    console.error('Error checking keyword position:', error)
    return { rankGroup: null, rankAbsolute: null }
  }
}

/**
 * Met à jour la position d'un mot-clé en base de données
 */
export async function updateKeywordPosition(keywordId: string) {
  try {
    const keyword = await prisma.keyword.findUnique({
      where: { id: keywordId },
      include: {
        project: {
          select: {
            url: true,
          },
        },
      },
    })

    if (!keyword) {
      return {
        success: false,
        error: 'Mot-clé introuvable',
      }
    }

    // Nettoyer l'URL du projet
    const domain = keyword.project.url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')

    // Vérifier la position actuelle
    const position = await checkKeywordPosition(keyword.keyword, domain, keyword.locationCode, keyword.languageCode)

    // Mettre à jour en base de données
    const updated = await prisma.keyword.update({
      where: { id: keywordId },
      data: {
        previousRank: keyword.rankGroup, // Sauvegarder l'ancienne position
        rankGroup: position.rankGroup,
        rankAbsolute: position.rankAbsolute,
        lastCheckedAt: new Date(),
      },
    })

    return {
      success: true,
      data: updated,
    }
  } catch (error) {
    console.error('Error updating keyword position:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la position',
    }
  }
}

/**
 * Met à jour les positions de tous les mots-clés d'un projet
 */
export async function updateAllKeywordPositions(projectId: string) {
  try {
    const keywords = await prisma.keyword.findMany({
      where: { projectId },
      include: {
        project: {
          select: {
            url: true,
          },
        },
      },
    })

    const results = []
    for (const keyword of keywords) {
      const domain = keyword.project.url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')

      const position = await checkKeywordPosition(keyword.keyword, domain, keyword.locationCode, keyword.languageCode)

      const updated = await prisma.keyword.update({
        where: { id: keyword.id },
        data: {
          previousRank: keyword.rankGroup,
          rankGroup: position.rankGroup,
          rankAbsolute: position.rankAbsolute,
          lastCheckedAt: new Date(),
        },
      })

      results.push(updated)
    }

    return {
      success: true,
      data: results,
      count: results.length,
    }
  } catch (error) {
    console.error('Error updating all keyword positions:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour des positions',
    }
  }
}

// Ajouter un nouveau mot-clé à suivre
export async function addKeyword(formData: FormData) {
  try {
    const keyword = formData.get('keyword') as string
    const projectId = formData.get('projectId') as string
    const locationCode = formData.get('locationCode') ? parseInt(formData.get('locationCode') as string, 10) : 2250
    const languageCode = (formData.get('languageCode') as string) || 'fr'

    if (!keyword || !projectId) {
      return {
        success: false,
        error: 'Le mot-clé et le projet sont requis',
      }
    }

    // Vérifier si le mot-clé existe déjà pour ce projet
    const existing = await prisma.keyword.findUnique({
      where: {
        projectId_keyword_locationCode_languageCode: {
          projectId,
          keyword: keyword.trim(),
          locationCode,
          languageCode,
        },
      },
    })

    if (existing) {
      return {
        success: false,
        error: 'Ce mot-clé est déjà suivi pour ce projet',
      }
    }

    // Récupérer le projet pour obtenir l'URL
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { url: true },
    })

    if (!project) {
      return {
        success: false,
        error: 'Projet introuvable',
      }
    }

    // Vérifier la position initiale
    const domain = project.url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
    const position = await checkKeywordPosition(keyword.trim(), domain, locationCode, languageCode)

    // Créer le mot-clé avec la position initiale
    const newKeyword = await prisma.keyword.create({
      data: {
        keyword: keyword.trim(),
        projectId,
        locationCode,
        languageCode,
        rankGroup: position.rankGroup,
        rankAbsolute: position.rankAbsolute,
        lastCheckedAt: new Date(),
      },
      include: {
        project: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    })

    return { success: true, data: newKeyword }
  } catch (error) {
    console.error('Error adding keyword:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l&apos;ajout du mot-clé',
    }
  }
}

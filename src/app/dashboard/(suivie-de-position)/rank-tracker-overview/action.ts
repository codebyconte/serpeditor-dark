'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { fetchKeywordMetrics } from '@/lib/rank-tracking/dataforseo'
import { checkAndIncrementUsage } from '@/lib/usage-utils'
import { randomUUID } from 'crypto'
import { headers } from 'next/headers'

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

/**
 * Calcule le CTR estimé basé sur la position
 * Basé sur les données moyennes de Google Search Console
 */
function calculateEstimatedCTR(position: number | null): number | null {
  if (position === null) return null

  // Courbe de CTR basée sur les données réelles
  if (position === 1) return 0.316 // 31.6%
  if (position === 2) return 0.244 // 24.4%
  if (position === 3) return 0.186 // 18.6%
  if (position >= 4 && position <= 10) return 0.05 + (10 - position) * 0.015 // 5% à 14%
  if (position >= 11 && position <= 20) return 0.02 + (20 - position) * 0.002 // 2% à 4%
  if (position >= 21 && position <= 30) return 0.01 + (30 - position) * 0.0005 // 1% à 1.5%
  if (position >= 31 && position <= 50) return 0.005 + (50 - position) * 0.0001 // 0.5% à 0.7%
  if (position >= 51 && position <= 100) return 0.001 + (100 - position) * 0.00001 // 0.1% à 0.5%

  return 0.001 // Par défaut pour positions > 100
}

/**
 * Calcule le trafic estimé mensuel
 * Trafic = Volume de recherche × CTR estimé
 */
function calculateEstimatedTraffic(searchVolume: number | null, ctr: number | null): number | null {
  if (searchVolume === null || ctr === null) return null
  return Math.round(searchVolume * ctr)
}

/**
 * Calcule le score de visibilité
 * Basé sur la position et le volume de recherche
 * Score de 0 à 100
 */
function calculateVisibilityScore(position: number | null, searchVolume: number | null): number | null {
  if (position === null || searchVolume === null) return null

  // Poids de la position (plus la position est bonne, plus le score est élevé)
  let positionScore = 0
  if (position === 1) positionScore = 100
  else if (position === 2) positionScore = 80
  else if (position === 3) positionScore = 65
  else if (position >= 4 && position <= 10) positionScore = 50 - (position - 4) * 5
  else if (position >= 11 && position <= 20) positionScore = 30 - (position - 11) * 2
  else if (position >= 21 && position <= 30) positionScore = 15 - (position - 21) * 0.5
  else if (position >= 31 && position <= 50) positionScore = 10 - (position - 31) * 0.2
  else if (position >= 51 && position <= 100) positionScore = 5 - (position - 51) * 0.05
  else positionScore = 0

  // Poids du volume (normalisé sur une échelle logarithmique)
  // Volume élevé = plus de poids
  const volumeWeight = Math.min(1, Math.log10(searchVolume + 1) / 6) // Normalisé pour volumes jusqu'à 1M

  // Score final = position score × volume weight
  return Math.round(positionScore * volumeWeight)
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
): Promise<{ success: boolean; data?: HistoricalRankOverviewResult; error?: string; limitReached?: boolean; upgradeRequired?: boolean }> {
  try {
    // Authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: 'Non authentifié' }
    }

    // Vérification des limites d'usage
    const usageCheck = await checkAndIncrementUsage(session.user.id, 'serpHistories')
    if (!usageCheck.allowed) {
      return {
        success: false,
        error: usageCheck.message,
        limitReached: true,
        upgradeRequired: true,
      }
    }

    const credentials = process.env.DATAFORSEO_PASSWORD

    if (!credentials) {
      return { success: false, error: 'Credentials DataForSEO manquants' }
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

    // Appel API protégé (la vérification de limite est déjà faite plus haut)
    const { protectedDataForSEOPost } = await import('@/lib/dataforseo-protection')
    const data = await protectedDataForSEOPost<DataForSEOResponse<HistoricalRankOverviewResult>>(
      session.user.id,
      '/dataforseo_labs/google/historical_rank_overview/live',
      requestBody,
      0, // Ne pas incrémenter car déjà fait plus haut
    )

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
export async function getKeywordData(keyword: string, locationCode: number = 2250, languageCode: string = 'fr'): Promise<{ success: boolean; data?: unknown; error?: string; limitReached?: boolean; upgradeRequired?: boolean }> {
  try {
    // Authentification
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

    // Appel API protégé (la vérification de limite est déjà faite plus haut)
    const { protectedDataForSEOPost } = await import('@/lib/dataforseo-protection')
    const data = await protectedDataForSEOPost<{
      status_code: number
      status_message?: string
      tasks?: Array<{
        status_code: number
        status_message?: string
        result?: Array<{
          items?: Array<{
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
          }>
        }>
      }>
    }>(
      session.user.id,
      '/dataforseo_labs/google/keyword_overview/live',
      {
        keywords: [keyword],
        location_code: locationCode,
        language_code: languageCode,
        include_serp_info: true,
        include_clickstream_data: false,
      },
      0, // Ne pas incrémenter car déjà fait plus haut
    )

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

    // Les données sont déjà récupérées par protectedDataForSEOPost
    // Vérifier le status_code (déjà fait dans protectedDataForSEOPost mais on vérifie quand même)
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

// Mettre à jour les métriques d'un mot-clé (Volume, CPC, Competition)
export async function updateKeywordMetrics(keywordId: string): Promise<{ success: boolean; data?: unknown; error?: string; limitReached?: boolean; upgradeRequired?: boolean }> {
  try {
    // Authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: 'Non authentifié' }
    }

    const keyword = await prisma.keyword.findUnique({
      where: { id: keywordId },
    })

    if (!keyword) {
      return {
        success: false,
        error: 'Mot-clé introuvable',
      }
    }

    // Charger les métriques depuis l'API (protégé automatiquement)
    const metricsResult = await fetchKeywordMetrics(
      keyword.keyword,
      keyword.locationCode,
      keyword.languageCode,
      session.user.id,
    )

    if (!metricsResult.success || !metricsResult.data) {
      return {
        success: false,
        error: metricsResult.error || 'Erreur lors du chargement des métriques',
      }
    }

    const metrics = metricsResult.data

    // Recalculer les métriques dérivées avec les nouvelles données
    const ctr = calculateEstimatedCTR(keyword.rankGroup)
    const estimatedTraffic = calculateEstimatedTraffic(metrics.searchVolume, ctr)
    const visibilityScore = calculateVisibilityScore(keyword.rankGroup, metrics.searchVolume)

    // Mettre à jour en base de données
    const updated = await prisma.keyword.update({
      where: { id: keywordId },
      data: {
        searchVolume: metrics.searchVolume || keyword.searchVolume,
        cpc: metrics.cpc || keyword.cpc,
        competition: metrics.competition || keyword.competition,
        competitionLevel: metrics.competitionLevel || keyword.competitionLevel,
        estimatedCtr: ctr,
        estimatedTraffic: estimatedTraffic,
        visibilityScore: visibilityScore,
        updatedAt: new Date(),
      },
    })

    return {
      success: true,
      data: updated,
    }
  } catch (error) {
    console.error('Error updating keyword metrics:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour des métriques',
    }
  }
}

// Récupérer l'historique des positions d'un mot-clé
export async function getKeywordHistory(keywordId: string, limit: number = 90) {
  try {
    const history = await prisma.keyword_position_history.findMany({
      where: { keywordId },
      orderBy: { checkedAt: 'desc' },
      take: limit,
    })
    return { success: true, data: history }
  } catch (error) {
    console.error('Error fetching keyword history:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la récupération de l&apos;historique',
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
  userId: string,
  locationCode: number = 2250,
  languageCode: string = 'fr',
): Promise<{ rankGroup: number | null; rankAbsolute: number | null }> {
  try {
    if (!userId) {
      throw new Error('userId est requis pour protéger l\'appel API')
    }

    // Nettoyer le domaine
    const cleanDomain = domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/$/, '')

    // Appel API SERP protégé
    const { protectedDataForSEOPost } = await import('@/lib/dataforseo-protection')
    const data = await protectedDataForSEOPost<{
      tasks?: Array<{
        status_code: number
        status_message?: string
        result?: Array<{
          items?: Array<{
            type: string
            domain?: string
            rank_group?: number
            rank_absolute?: number
          }>
        }>
      }>
    }>(
      userId,
      '/serp/google/organic/live/advanced',
      {
        keyword: keyword.trim(),
        location_code: locationCode,
        language_code: languageCode,
        device: 'desktop',
        os: 'windows',
        depth: 100, // Vérifier jusqu'à la position 100
        calculate_rectangles: false,
      },
    )

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
export async function updateKeywordPosition(keywordId: string): Promise<{ success: boolean; data?: unknown; error?: string; limitReached?: boolean; upgradeRequired?: boolean }> {
  try {
    // Authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: 'Non authentifié' }
    }

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

    // Vérifier la position actuelle (protégé automatiquement - compte comme serpHistories)
    const position = await checkKeywordPosition(
      keyword.keyword,
      domain,
      session.user.id,
      keyword.locationCode,
      keyword.languageCode,
    )

    // Charger les métriques si elles ne sont pas déjà présentes (protégé automatiquement)
    let searchVolume = keyword.searchVolume
    let cpc = keyword.cpc
    let competition = keyword.competition
    let competitionLevel = keyword.competitionLevel
    if (!searchVolume || !cpc) {
      const metricsResult = await fetchKeywordMetrics(
        keyword.keyword,
        keyword.locationCode,
        keyword.languageCode,
        session.user.id,
      )
      if (metricsResult.success && metricsResult.data) {
        searchVolume = metricsResult.data.searchVolume || searchVolume || null
        cpc = metricsResult.data.cpc || cpc || null
        competition = metricsResult.data.competition || competition || null
        competitionLevel = metricsResult.data.competitionLevel || competitionLevel || null
      }
    }

    // Calculer les métriques dérivées
    const ctr = calculateEstimatedCTR(position.rankGroup)
    const estimatedTraffic = calculateEstimatedTraffic(searchVolume, ctr)
    const visibilityScore = calculateVisibilityScore(position.rankGroup, searchVolume)

    // Mettre à jour en base de données
    const updated = await prisma.keyword.update({
      where: { id: keywordId },
      data: {
        previousRank: keyword.rankGroup, // Sauvegarder l'ancienne position
        rankGroup: position.rankGroup,
        rankAbsolute: position.rankAbsolute,
        lastCheckedAt: new Date(),
        // Mettre à jour les métriques si elles étaient manquantes
        searchVolume: searchVolume || keyword.searchVolume,
        cpc: cpc || keyword.cpc,
        competition: competition || keyword.competition,
        competitionLevel: competitionLevel || keyword.competitionLevel,
        // Mettre à jour les métriques calculées
        estimatedCtr: ctr,
        estimatedTraffic: estimatedTraffic,
        visibilityScore: visibilityScore,
        updatedAt: new Date(),
      },
    })

    // Créer l'entrée d'historique si une position a été trouvée
    if (position.rankGroup !== null) {
      await prisma.keyword_position_history.create({
        data: {
          id: randomUUID(),
          keywordId: keywordId,
          rankGroup: position.rankGroup,
          rankAbsolute: position.rankAbsolute,
          checkedAt: new Date(),
        },
      })
    }

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
export async function updateAllKeywordPositions(projectId: string): Promise<{ success: boolean; data?: unknown[]; count?: number; error?: string; limitReached?: boolean; upgradeRequired?: boolean }> {
  try {
    // Authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: 'Non authentifié' }
    }

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

      // Vérifier la position actuelle (protégé automatiquement - compte comme serpHistories)
      const position = await checkKeywordPosition(
        keyword.keyword,
        domain,
        session.user.id,
        keyword.locationCode,
        keyword.languageCode,
      )

      // Charger les métriques si elles ne sont pas déjà présentes (protégé automatiquement)
      let searchVolume = keyword.searchVolume
      let cpc = keyword.cpc
      let competition = keyword.competition
      let competitionLevel = keyword.competitionLevel
      if (!searchVolume || !cpc) {
        const metricsResult = await fetchKeywordMetrics(
          keyword.keyword,
          keyword.locationCode,
          keyword.languageCode,
          session.user.id,
        )
        if (metricsResult.success && metricsResult.data) {
          searchVolume = metricsResult.data.searchVolume || searchVolume || null
          cpc = metricsResult.data.cpc || cpc || null
          competition = metricsResult.data.competition || competition || null
          competitionLevel = metricsResult.data.competitionLevel || competitionLevel || null
        }
        // Attendre 100ms entre les appels API pour respecter le rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Calculer les métriques dérivées
      const ctr = calculateEstimatedCTR(position.rankGroup)
      const estimatedTraffic = calculateEstimatedTraffic(searchVolume, ctr)
      const visibilityScore = calculateVisibilityScore(position.rankGroup, searchVolume)

      const updated = await prisma.keyword.update({
        where: { id: keyword.id },
        data: {
          previousRank: keyword.rankGroup,
          rankGroup: position.rankGroup,
          rankAbsolute: position.rankAbsolute,
          lastCheckedAt: new Date(),
          // Mettre à jour les métriques si elles étaient manquantes
          searchVolume: searchVolume || keyword.searchVolume,
          cpc: cpc || keyword.cpc,
          competition: competition || keyword.competition,
          competitionLevel: competitionLevel || keyword.competitionLevel,
          // Mettre à jour les métriques calculées
          estimatedCtr: ctr,
          estimatedTraffic: estimatedTraffic,
          visibilityScore: visibilityScore,
          updatedAt: new Date(),
        },
      })

      // Créer l'entrée d'historique si une position a été trouvée
      if (position.rankGroup !== null) {
        await prisma.keyword_position_history.create({
          data: {
            id: randomUUID(),
            keywordId: keyword.id,
            rankGroup: position.rankGroup,
            rankAbsolute: position.rankAbsolute,
            checkedAt: new Date(),
          },
        })
      }

      results.push(updated)

      // Attendre 100ms entre chaque vérification pour respecter le rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
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
export async function addKeyword(formData: FormData): Promise<{ success: boolean; data?: unknown; error?: string; limitReached?: boolean; upgradeRequired?: boolean }> {
  try {
    // Authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: 'Non authentifié' }
    }

    // Vérification des limites pour les mots-clés suivis
    const trackedKeywordsCheck = await checkAndIncrementUsage(session.user.id, 'trackedKeywords')
    if (!trackedKeywordsCheck.allowed) {
      return {
        success: false,
        error: trackedKeywordsCheck.message,
        limitReached: true,
        upgradeRequired: true,
      }
    }

    // Vérification des limites pour les recherches SERP
    const serpCheck = await checkAndIncrementUsage(session.user.id, 'serpHistories')
    if (!serpCheck.allowed) {
      return {
        success: false,
        error: serpCheck.message,
        limitReached: true,
        upgradeRequired: true,
      }
    }

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

    // Vérifier la position initiale (protégé automatiquement)
    const domain = project.url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
    const position = await checkKeywordPosition(keyword.trim(), domain, session.user.id, locationCode, languageCode)

    // Charger les métriques du mot-clé (Volume, CPC, Competition) (protégé automatiquement)
    const metricsResult = await fetchKeywordMetrics(keyword.trim(), locationCode, languageCode, session.user.id)
    const metrics = metricsResult.success ? metricsResult.data : null

    // Calculer les métriques dérivées
    const ctr = calculateEstimatedCTR(position.rankGroup)
    const estimatedTraffic = calculateEstimatedTraffic(metrics?.searchVolume || null, ctr)
    const visibilityScore = calculateVisibilityScore(position.rankGroup, metrics?.searchVolume || null)

    // Créer le mot-clé avec toutes les données
    const newKeyword = await prisma.keyword.create({
      data: {
        id: randomUUID(),
        keyword: keyword.trim(),
        projectId,
        locationCode,
        languageCode,
        rankGroup: position.rankGroup,
        rankAbsolute: position.rankAbsolute,
        lastCheckedAt: new Date(),
        // Métriques enrichies
        searchVolume: metrics?.searchVolume || null,
        cpc: metrics?.cpc || null,
        competition: metrics?.competition || null,
        competitionLevel: metrics?.competitionLevel || null,
        // Métriques calculées
        estimatedCtr: ctr,
        estimatedTraffic: estimatedTraffic,
        visibilityScore: visibilityScore,
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

    // Créer l'entrée d'historique si une position a été trouvée
    if (position.rankGroup !== null) {
      await prisma.keyword_position_history.create({
        data: {
          id: randomUUID(),
          keywordId: newKeyword.id,
          rankGroup: position.rankGroup,
          rankAbsolute: position.rankAbsolute,
          checkedAt: new Date(),
        },
      })
    }

    return { success: true, data: newKeyword }
  } catch (error) {
    console.error('Error adding keyword:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l&apos;ajout du mot-clé',
    }
  }
}

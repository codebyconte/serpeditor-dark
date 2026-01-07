/**
 * Intégration DataForSEO pour le Rank Tracking
 *
 * Ce fichier contient les fonctions pour interagir avec l'API DataForSEO
 * afin de récupérer les positions réelles des mots-clés dans les SERP Google.
 */

interface SERPRequest {
  keyword: string
  locationCode: number
  languageCode: string
  domain: string
}

interface SERPResult {
  success: boolean
  data?: {
    rankGroup: number | null
    rankAbsolute: number | null
    rankedUrl: string | null
    serpFeatures: string[]
  }
  error?: string
  cost?: number
}

interface KeywordMetricsResult {
  success: boolean
  data?: {
    searchVolume: number | null
    cpc: number | null
    competition: number | null
    competitionLevel: string | null
  }
  error?: string
}

/**
 * Récupère la position d'un domaine dans les SERP pour un mot-clé
 *
 * Utilise l'endpoint DataForSEO SERP API pour obtenir:
 * - La position du domaine (rank_group et rank_absolute)
 * - L'URL exacte classée
 * - Les SERP features présentes (people_also_ask, featured_snippet, etc.)
 *
 * @param request - Paramètres de la requête SERP
 * @returns Résultat avec position et URL classée
 */
export async function fetchDataForSEOSERP(request: SERPRequest): Promise<SERPResult> {
  try {
    const credentials = process.env.DATAFORSEO_PASSWORD
    if (!credentials) {
      throw new Error('Credentials DataForSEO manquants')
    }

    // Nettoyer le domaine (enlever protocole, www, slash final)
    const cleanDomain = request.domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/$/, '')

    // Appel API SERP
    const response = await fetch(`${process.env.DATAFORSEO_URL}/serp/google/organic/live/advanced`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          keyword: request.keyword.trim(),
          location_code: request.locationCode,
          language_code: request.languageCode,
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
      throw new Error(data.status_message || 'API Error')
    }

    const task = data.tasks?.[0]
    if (!task || task.status_code !== 20000) {
      throw new Error(task?.status_message || 'Task Error')
    }

    const result = task.result?.[0]
    if (!result || !result.items) {
      return {
        success: true,
        data: {
          rankGroup: null,
          rankAbsolute: null,
          rankedUrl: null,
          serpFeatures: [],
        },
        cost: data.cost || 0,
      }
    }

    // Extraire les SERP features
    const serpFeatures: string[] = []
    result.items.forEach((item: any) => {
      if (item.type && item.type !== 'organic') {
        serpFeatures.push(item.type)
      }
    })

    // Chercher notre domaine dans les résultats organiques
    for (const item of result.items) {
      if (item.type === 'organic' && item.domain) {
        const itemDomain = item.domain
          .toLowerCase()
          .replace(/^(https?:\/\/)?(www\.)?/, '')
          .replace(/\/$/, '')

        // Vérifier si le domaine correspond
        // Permet les sous-domaines (blog.example.com match example.com)
        if (
          itemDomain === cleanDomain ||
          itemDomain.endsWith(`.${cleanDomain}`) ||
          cleanDomain.endsWith(`.${itemDomain}`)
        ) {
          return {
            success: true,
            data: {
              rankGroup: item.rank_group || null,
              rankAbsolute: item.rank_absolute || null,
              rankedUrl: item.url || null,
              serpFeatures: Array.from(new Set(serpFeatures)),
            },
            cost: data.cost || 0,
          }
        }
      }
    }

    // Domaine non trouvé
    return {
      success: true,
      data: {
        rankGroup: null,
        rankAbsolute: null,
        rankedUrl: null,
        serpFeatures: Array.from(new Set(serpFeatures)),
      },
      cost: data.cost || 0,
    }
  } catch (error) {
    console.error('Error fetching SERP:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Récupère les métriques d'un mot-clé (search volume, CPC, competition)
 *
 * Utilise l'endpoint Keyword Overview de DataForSEO
 *
 * @param keyword - Mot-clé
 * @param locationCode - Code de localisation (2250 = France)
 * @param languageCode - Code de langue ("fr")
 * @returns Métriques du keyword
 */
export async function fetchKeywordMetrics(
  keyword: string,
  locationCode: number,
  languageCode: string
): Promise<KeywordMetricsResult> {
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
          include_serp_info: false,
          include_clickstream_data: false,
        },
      ]),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status_code !== 20000) {
      throw new Error(data.status_message || 'API Error')
    }

    const task = data.tasks?.[0]
    if (!task || task.status_code !== 20000) {
      throw new Error(task?.status_message || 'Task Error')
    }

    const result = task.result?.[0]
    if (!result || !result.items || result.items.length === 0) {
      return {
        success: true,
        data: {
          searchVolume: null,
          cpc: null,
          competition: null,
          competitionLevel: null,
        },
      }
    }

    const item = result.items[0]
    const keywordInfo = item.keyword_data?.keyword_info

    return {
      success: true,
      data: {
        searchVolume: keywordInfo?.search_volume || null,
        cpc: keywordInfo?.cpc || null,
        competition: keywordInfo?.competition || null,
        competitionLevel: keywordInfo?.competition_level || null,
      },
    }
  } catch (error) {
    console.error('Error fetching keyword metrics:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Fonction utilitaire pour attendre (utilisée pour rate limiting)
 *
 * @param ms - Millisecondes à attendre
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 📁 app/dashboard/keyword-magic/utils.ts
import { API_CONFIG } from './config'
import type { FilterExpression, KeywordItem, KeywordInfo, KeywordData } from './types'

// Types pour le body de requête
type RequestBodyValue = string | number | boolean | string[] | FilterExpression | undefined
type RequestBody = Record<string, RequestBodyValue>

// Type pour les items de related_keywords
interface RelatedKeywordItem extends KeywordItem {
  keyword_data?: KeywordData
}

/**
 * Validation du format des filtres DataForSEO
 */
export function validateFilters(filters: FilterExpression): boolean {
  if (!Array.isArray(filters)) return false

  // Vérifier si c'est un filtre simple: ["field", "op", value]
  if (filters.length === 3 && typeof filters[0] === 'string') {
    return true
  }

  // Vérifier les filtres complexes avec AND/OR
  for (let i = 0; i < filters.length; i++) {
    const item = filters[i]
    if (Array.isArray(item)) {
      if (item.length !== 3 || typeof item[0] !== 'string') {
        return false
      }
    } else if (item !== 'and' && item !== 'or') {
      return false
    }
  }

  return true
}

/**
 * Construction sécurisée du body de requête
 */
export function buildRequestBody(params: {
  keyword?: string
  keywords?: string[]
  locationCode?: number
  languageCode?: string
  includeSerp?: boolean
  includeClickstream?: boolean
  includeSeedKeyword?: boolean
  exactMatch?: boolean
  ignoreSynonyms?: boolean
  filters?: FilterExpression
  orderBy?: string[]
  limit?: number
  offset?: number
  offsetToken?: string
  depth?: number
}): RequestBody {
  const body: RequestBody = {}

  // Champs obligatoires/optionnels
  if (params.keyword !== undefined) {
    body.keyword = params.keyword.trim().toLowerCase()
  }

  if (params.keywords !== undefined && params.keywords.length > 0) {
    body.keywords = params.keywords.map((kw) => kw.trim().toLowerCase())
  }

  body.location_code = params.locationCode ?? 2250
  body.language_code = params.languageCode ?? 'fr'
  body.include_serp_info = params.includeSerp ?? true
  body.include_clickstream_data = params.includeClickstream ?? false
  body.limit = Math.min(params.limit ?? 1000, 1000) // Max 1000

  // Nouveaux paramètres pour keyword_suggestions
  if (params.includeSeedKeyword !== undefined) {
    body.include_seed_keyword = params.includeSeedKeyword
  }

  if (params.exactMatch !== undefined) {
    body.exact_match = params.exactMatch
  }

  if (params.ignoreSynonyms !== undefined) {
    body.ignore_synonyms = params.ignoreSynonyms
  }

  // Pagination - offset_token a la priorité sur offset
  if (params.offsetToken !== undefined && params.offsetToken.trim()) {
    body.offset_token = params.offsetToken.trim()
    // Note: Si offset_token est spécifié, les autres paramètres sauf limit sont ignorés
  } else if (params.offset !== undefined && params.offset > 0) {
    body.offset = params.offset
  }

  if (params.depth !== undefined) {
    body.depth = params.depth
  }

  // Filtres - Ajouter seulement si défini et valide
  if (params.filters !== undefined && params.filters.length > 0) {
    if (validateFilters(params.filters)) {
      body.filters = params.filters
    } else {
      console.warn('⚠️ Filtres invalides ignorés')
    }
  }

  // OrderBy - Ajouter seulement si défini
  if (params.orderBy !== undefined && params.orderBy.length > 0) {
    body.order_by = params.orderBy
  }

  return body
}

/**
 * Gestion du retry avec backoff exponentiel
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = API_CONFIG.MAX_RETRIES,
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Si 5xx, on retry
      if (response.status >= 500 && attempt < retries) {
        console.warn(
          `⚠️ Erreur ${response.status}, retry ${attempt + 1}/${retries}`,
        )
        await sleep(API_CONFIG.RETRY_DELAY * Math.pow(2, attempt))
        continue
      }

      return response
    } catch (error) {
      lastError = error as Error

      // Timeout ou erreur réseau
      if (attempt < retries) {
        console.warn(`⚠️ Erreur réseau, retry ${attempt + 1}/${retries}`)
        await sleep(API_CONFIG.RETRY_DELAY * Math.pow(2, attempt))
        continue
      }
    }
  }

  throw lastError || new Error('Échec après plusieurs tentatives')
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Validation du keyword
 */
export function validateKeyword(keyword: string): {
  valid: boolean
  error?: string
} {
  const trimmed = keyword.trim()

  if (!trimmed) {
    return { valid: false, error: 'Le mot-clé ne peut pas être vide' }
  }

  if (trimmed.length > 255) {
    return {
      valid: false,
      error: 'Le mot-clé est trop long (max 255 caractères)',
    }
  }

  // Caractères interdits
  const forbiddenChars = /[<>{}[\]\\]/
  if (forbiddenChars.test(trimmed)) {
    return { valid: false, error: 'Caractères interdits détectés' }
  }

  return { valid: true }
}

/**
 * Normalise un item de related_keywords pour le convertir en format standard
 */
function normalizeRelatedKeywordItem(item: RelatedKeywordItem): KeywordItem {
  // Si l'item a keyword_data, on extrait les données de keyword_data
  if (item.keyword_data) {
    const keywordData = item.keyword_data
    return {
      ...item,
      keyword: keywordData.keyword || item.keyword,
      location_code: keywordData.location_code || item.location_code,
      language_code: keywordData.language_code || item.language_code,
      keyword_info: keywordData.keyword_info || item.keyword_info,
      keyword_properties:
        keywordData.keyword_properties || item.keyword_properties,
      serp_info: keywordData.serp_info || item.serp_info,
      clickstream_keyword_info:
        keywordData.clickstream_keyword_info || item.clickstream_keyword_info,
      avg_backlinks_info:
        keywordData.avg_backlinks_info || item.avg_backlinks_info,
      search_intent_info:
        keywordData.search_intent_info || item.search_intent_info,
      // Conserver les champs spécifiques à related_keywords
      depth: item.depth,
      related_keywords: item.related_keywords,
    }
  }
  // Sinon, retourner l'item tel quel (format standard)
  return item
}

/**
 * Extraction sécurisée des données de l'API
 */
export function extractApiData<T = KeywordItem>(
  data: unknown,
  endpoint?: string,
): {
  success: boolean
  results: T[]
  totalCount: number
  seedData?: KeywordInfo | KeywordInfo[]
  seedKeyword?: string
  itemsCount?: number
  offset?: number
  offsetToken?: string
  cost: number
  error?: string
} {
  // Type assertion pour l'API response
  interface ApiDataShape {
    status_code?: number
    status_message?: string
    cost?: number
    tasks?: Array<{
      status_code?: number
      status_message?: string
      result?: Array<{
        items?: RelatedKeywordItem[]
        total_count?: number
        items_count?: number
        offset?: number
        offset_token?: string
        seed_keyword_data?: KeywordInfo | KeywordInfo[]
        seed_keyword?: string
      }>
    }>
  }

  const apiData = data as ApiDataShape | null

  try {
    // Validation du status code principal
    if (!apiData || apiData.status_code !== 20000) {
      return {
        success: false,
        results: [],
        totalCount: 0,
        cost: apiData?.cost || 0,
        error: apiData?.status_message || 'Erreur API inconnue',
      }
    }

    // Validation du premier task
    const task = apiData.tasks?.[0]
    if (!task) {
      return {
        success: false,
        results: [],
        totalCount: 0,
        cost: apiData.cost || 0,
        error: 'Aucune tâche retournée',
      }
    }

    if (task.status_code !== 20000) {
      return {
        success: false,
        results: [],
        totalCount: 0,
        cost: apiData.cost || 0,
        error: task.status_message || 'Erreur de tâche',
      }
    }

    // Extraction des résultats
    const result = task.result?.[0]
    if (!result) {
      return {
        success: false,
        results: [],
        totalCount: 0,
        cost: apiData.cost || 0,
        error: 'Aucun résultat',
      }
    }

    // Normaliser les items pour related_keywords
    let items: KeywordItem[] = result.items || []
    if (endpoint === 'related_keywords' && items.length > 0) {
      // Vérifier si les items ont la structure keyword_data
      const relatedItems = items as RelatedKeywordItem[]
      if (relatedItems[0]?.keyword_data) {
        items = relatedItems.map(normalizeRelatedKeywordItem)
      }
    }

    return {
      success: true,
      results: items as T[],
      totalCount: result.total_count || 0,
      itemsCount: result.items_count,
      offset: result.offset,
      offsetToken: result.offset_token,
      seedData: result.seed_keyword_data,
      seedKeyword: result.seed_keyword,
      cost: apiData.cost || 0,
    }
  } catch (error) {
    return {
      success: false,
      results: [],
      totalCount: 0,
      cost: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Erreur lors du traitement des données',
    }
  }
}

/**
 * Logging structuré
 */
export function logApiCall(params: {
  endpoint: string
  keyword?: string
  keywords?: string[]
  duration: number
  resultCount: number
  cost: number
  success: boolean
  error?: string
}) {
  const emoji = params.success ? '✅' : '❌'
  console.log(`${emoji} API Call: ${params.endpoint}`)
  console.log(
    `  └─ Keyword: ${params.keyword || params.keywords?.join(', ') || 'N/A'}`,
  )
  console.log(`  └─ Results: ${params.resultCount}`)
  console.log(`  └─ Cost: $${params.cost.toFixed(4)}`)
  console.log(`  └─ Duration: ${params.duration}ms`)
  if (params.error) {
    console.log(`  └─ Error: ${params.error}`)
  }
}

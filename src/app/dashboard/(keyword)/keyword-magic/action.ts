// 📁 app/dashboard/keyword-magic/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { API_CONFIG, DEFAULT_PARAMS } from './config'
import type { APIResponse, KeywordItem, KeywordMagicParams } from './types'
import {
  buildRequestBody,
  extractApiData,
  fetchWithRetry,
  logApiCall,
  validateKeyword,
} from './utils'

const BASE_URL = `${API_CONFIG.BASE_URL}/dataforseo_labs/google`

/**
 * Authentification et validation de session
 */
async function validateSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    throw new Error('Session expirée - veuillez vous reconnecter')
  }
  return session
}

/**
 * Headers de base pour les requêtes API
 */
function getApiHeaders() {
  return {
    Authorization: `Basic ${API_CONFIG.CREDENTIALS}`,
    'Content-Type': 'application/json',
  }
}

/**
 * 1. KEYWORD SUGGESTIONS
 * Retourne des mots-clés contenant le seed keyword
 */
export async function fetchKeywordSuggestions(
  params: KeywordMagicParams,
): Promise<APIResponse<KeywordItem>> {
  const startTime = Date.now()

  try {
    // Validation
    await validateSession()

    const keywordValidation = validateKeyword(params.keyword)
    if (!keywordValidation.valid) {
      throw new Error(keywordValidation.error)
    }

    // Construction du body
    const requestBody = [
      buildRequestBody({
        keyword: params.keyword,
        locationCode: params.locationCode ?? DEFAULT_PARAMS.locationCode,
        languageCode: params.languageCode ?? DEFAULT_PARAMS.languageCode,
        includeSerp: params.includeSerp ?? DEFAULT_PARAMS.includeSerp,
        includeClickstream:
          params.includeClickstream ?? DEFAULT_PARAMS.includeClickstream,
        includeSeedKeyword: params.includeSeedKeyword,
        exactMatch: params.exactMatch,
        ignoreSynonyms: params.ignoreSynonyms,
        filters: params.filters,
        orderBy: params.orderBy,
        limit: params.limit ?? DEFAULT_PARAMS.limit,
        offset: params.offset,
        offsetToken: params.offsetToken,
      }),
    ]

    // Appel API avec retry
    const response = await fetchWithRetry(
      `${BASE_URL}/keyword_suggestions/live`,
      {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(requestBody),
      },
    )

    console.log('response', response)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const extracted = extractApiData<KeywordItem>(data)

    // Logging
    logApiCall({
      endpoint: 'keyword_suggestions',
      keyword: params.keyword,
      duration: Date.now() - startTime,
      resultCount: extracted.results.length,
      cost: extracted.cost,
      success: extracted.success,
      error: extracted.error,
    })

    if (!extracted.success) {
      throw new Error(extracted.error || 'Erreur API')
    }

    return {
      success: true,
      results: extracted.results,
      seedData: extracted.seedData,
      seedKeyword: extracted.seedKeyword,
      totalCount: extracted.totalCount,
      itemsCount: extracted.itemsCount,
      offset: extracted.offset,
      offsetToken: extracted.offsetToken,
      cost: extracted.cost,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur inconnue'

    logApiCall({
      endpoint: 'keyword_suggestions',
      keyword: params.keyword,
      duration: Date.now() - startTime,
      resultCount: 0,
      cost: 0,
      success: false,
      error: errorMessage,
    })

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * 2. KEYWORD IDEAS
 * Retourne des mots-clés par catégories de produits/services
 */
export async function fetchKeywordIdeas(
  params: KeywordMagicParams & { keywords: string[] },
): Promise<APIResponse<KeywordItem>> {
  const startTime = Date.now()

  try {
    // Validation
    await validateSession()

    if (!params.keywords || params.keywords.length === 0) {
      throw new Error('Au moins un mot-clé est requis')
    }

    if (params.keywords.length > 200) {
      throw new Error('Maximum 200 mots-clés autorisés')
    }

    // Validation de chaque keyword
    for (const kw of params.keywords) {
      const validation = validateKeyword(kw)
      if (!validation.valid) {
        throw new Error(`Mot-clé invalide "${kw}": ${validation.error}`)
      }
    }

    // Construction du body
    const requestBody = [
      buildRequestBody({
        keywords: params.keywords,
        locationCode: params.locationCode ?? DEFAULT_PARAMS.locationCode,
        languageCode: params.languageCode ?? DEFAULT_PARAMS.languageCode,
        includeSerp: params.includeSerp ?? DEFAULT_PARAMS.includeSerp,
        includeClickstream:
          params.includeClickstream ?? DEFAULT_PARAMS.includeClickstream,
        filters: params.filters,
        orderBy: params.orderBy,
        limit: params.limit ?? DEFAULT_PARAMS.limit,
        offset: params.offset,
      }),
    ]

    // Appel API avec retry
    const response = await fetchWithRetry(`${BASE_URL}/keyword_ideas/live`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(requestBody),
    })

    console.log('response', response)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const extracted = extractApiData<KeywordItem>(data)

    // Logging
    logApiCall({
      endpoint: 'keyword_ideas',
      keywords: params.keywords,
      duration: Date.now() - startTime,
      resultCount: extracted.results.length,
      cost: extracted.cost,
      success: extracted.success,
      error: extracted.error,
    })

    if (!extracted.success) {
      throw new Error(extracted.error || 'Erreur API')
    }

    return {
      success: true,
      results: extracted.results,
      seedKeyword: extracted.seedKeyword,
      totalCount: extracted.totalCount,
      itemsCount: extracted.itemsCount,
      offset: extracted.offset,
      offsetToken: extracted.offsetToken,
      cost: extracted.cost,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur inconnue'

    logApiCall({
      endpoint: 'keyword_ideas',
      keywords: params.keywords,
      duration: Date.now() - startTime,
      resultCount: 0,
      cost: 0,
      success: false,
      error: errorMessage,
    })

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * 3. RELATED KEYWORDS
 * Retourne les recherches associées de Google
 */
export async function fetchRelatedKeywords(
  params: KeywordMagicParams & { depth?: number },
): Promise<APIResponse<KeywordItem>> {
  const startTime = Date.now()

  try {
    // Validation
    await validateSession()

    const keywordValidation = validateKeyword(params.keyword)
    if (!keywordValidation.valid) {
      throw new Error(keywordValidation.error)
    }

    // Construction du body
    const requestBody = [
      buildRequestBody({
        keyword: params.keyword,
        locationCode: params.locationCode ?? DEFAULT_PARAMS.locationCode,
        languageCode: params.languageCode ?? DEFAULT_PARAMS.languageCode,
        depth: params.depth ?? DEFAULT_PARAMS.depth,
        includeSerp: params.includeSerp ?? DEFAULT_PARAMS.includeSerp,
        includeClickstream:
          params.includeClickstream ?? DEFAULT_PARAMS.includeClickstream,
        filters: params.filters,
        // Note: related_keywords ne supporte PAS order_by
        limit: params.limit ?? DEFAULT_PARAMS.limit,
        offset: params.offset,
      }),
    ]

    // Appel API avec retry
    const response = await fetchWithRetry(`${BASE_URL}/related_keywords/live`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(requestBody),
    })

    console.log('response', response)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    // Passer 'related_keywords' pour normaliser la structure keyword_data
    const extracted = extractApiData<KeywordItem>(data, 'related_keywords')

    // Logging
    logApiCall({
      endpoint: 'related_keywords',
      keyword: params.keyword,
      duration: Date.now() - startTime,
      resultCount: extracted.results.length,
      cost: extracted.cost,
      success: extracted.success,
      error: extracted.error,
    })

    if (!extracted.success) {
      throw new Error(extracted.error || 'Erreur API')
    }

    return {
      success: true,
      results: extracted.results,
      seedKeyword: extracted.seedKeyword,
      seedData: extracted.seedData, // Peut être un tableau pour related_keywords
      totalCount: extracted.totalCount,
      itemsCount: extracted.itemsCount,
      offset: extracted.offset,
      offsetToken: extracted.offsetToken,
      cost: extracted.cost,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur inconnue'

    logApiCall({
      endpoint: 'related_keywords',
      keyword: params.keyword,
      duration: Date.now() - startTime,
      resultCount: 0,
      cost: 0,
      success: false,
      error: errorMessage,
    })

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * 4. ALL-IN-ONE
 * Recherche combinée parallèle
 */
export async function fetchAllKeywordData(params: KeywordMagicParams) {
  try {
    await validateSession()

    const [suggestions, related] = await Promise.allSettled([
      fetchKeywordSuggestions(params),
      fetchRelatedKeywords({ ...params, depth: 1 }),
    ])

    return {
      success: true,
      suggestions:
        suggestions.status === 'fulfilled' ? suggestions.value : null,
      related: related.status === 'fulfilled' ? related.value : null,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * 5. SAVE TO LIST
 * Sauvegarde une liste de mots-clés
 */

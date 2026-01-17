/**
 * Système de protection automatique pour tous les appels DataForSEO
 * Mappe les endpoints vers les types d'usage et protège les appels
 */

import { checkAndIncrementUsage } from './usage-utils'
import { type UsageType } from './plan-limits'

/**
 * Détecte le type d'usage à partir de l'URL DataForSEO
 */
export function detectUsageTypeFromUrl(url: string): UsageType {
  const urlLower = url.toLowerCase()

  // SERP / Suivi de position → serpHistories (pour le tracking de position)
  // Note: Les appels SERP pour vérifier la position d'un mot-clé suivi comptent comme serpHistories
  // Les appels SERP pour recherche de nouveaux mots-clés comptent comme keywordSearches
  // Par défaut, on utilise serpHistories car c'est le cas le plus courant dans le contexte de suivi
  if (urlLower.includes('/serp/google/organic')) {
    return 'serpHistories'
  }

  // Keyword Overview / Keyword Metrics → keywordSearches
  if (urlLower.includes('/keyword_overview') || urlLower.includes('/keywords_search_volume')) {
    return 'keywordSearches'
  }

  // Backlinks → backlinkAnalyses
  if (
    urlLower.includes('/backlinks/summary') ||
    urlLower.includes('/backlinks/backlinks') ||
    urlLower.includes('/backlinks/referring_domains') ||
    urlLower.includes('/backlinks/anchors') ||
    urlLower.includes('/backlinks/timeseries') ||
    urlLower.includes('/backlinks/domain_intersection')
  ) {
    return 'backlinkAnalyses'
  }

  // Domain Analysis → domainAnalyses
  if (
    urlLower.includes('/domain_rank_overview') ||
    urlLower.includes('/domain_intersection') ||
    urlLower.includes('/domain_whois_overview') ||
    urlLower.includes('/domain_overview') ||
    urlLower.includes('/competitors_domain') ||
    urlLower.includes('/serp_competitors')
  ) {
    return 'domainAnalyses'
  }

  // Audit SEO → auditPages
  if (
    urlLower.includes('/on_page/instant_pages') ||
    urlLower.includes('/on_page/task_post') ||
    urlLower.includes('/on_page/tasks_ready') ||
    urlLower.includes('/on_page/summary')
  ) {
    return 'auditPages'
  }

  // Rank Tracking / SERP Histories → serpHistories
  if (
    urlLower.includes('/historical_rank_overview') ||
    urlLower.includes('/ranked_keywords') ||
    urlLower.includes('/historical_serps')
  ) {
    return 'serpHistories'
  }

  // AI Visibility → aiVisibilityRequests
  if (urlLower.includes('/llm_mentions') || urlLower.includes('/ai_keyword_data')) {
    return 'aiVisibilityRequests'
  }

  // Par défaut, considérer comme recherche de mots-clés (la plus commune)
  console.warn(`⚠️ Endpoint non reconnu: ${url}, assigné à keywordSearches par défaut`)
  return 'keywordSearches'
}

/**
 * Wrapper pour protéger un appel API DataForSEO
 * Vérifie automatiquement les limites avant l'appel
 */
export async function protectedDataForSEOFetch<T>(
  userId: string,
  url: string,
  options: RequestInit = {},
  increment: number = 1,
): Promise<T> {
  // Détecter le type d'usage depuis l'URL
  const usageType = detectUsageTypeFromUrl(url)

  // Si increment est 0, on vérifie juste la limite sans incrémenter (pour éviter double comptage)
  if (increment > 0) {
    // Vérifier et incrémenter l'usage
    const usageCheck = await checkAndIncrementUsage(userId, usageType, increment)

    if (!usageCheck.allowed) {
      throw new Error(usageCheck.message || `Limite atteinte pour ${usageType}`)
    }
  } else {
    // Juste vérifier la limite sans incrémenter (pour les appels où l'incrémentation est déjà faite)
    const { checkUsageLimit } = await import('@/lib/usage-utils')
    const usageCheck = await checkUsageLimit(userId, usageType, 0)

    if (!usageCheck.allowed) {
      throw new Error(usageCheck.message || `Limite atteinte pour ${usageType}`)
    }
  }

  // Effectuer l'appel API
  const credentials = process.env.DATAFORSEO_PASSWORD
  if (!credentials) {
    throw new Error('Credentials DataForSEO manquants')
  }

  const fullUrl = url.startsWith('http') ? url : `${process.env.DATAFORSEO_URL}${url}`

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`API request failed: ${response.status} ${errorText}`)
  }

  const data = await response.json()

  if (data.status_code !== 20000) {
    throw new Error(data.status_message || 'API Error')
  }

  return data as T
}

/**
 * Wrapper pour les appels POST avec body JSON
 */
export async function protectedDataForSEOPost<T>(
  userId: string,
  endpoint: string,
  body: unknown,
  increment: number = 1,
): Promise<T> {
  return protectedDataForSEOFetch<T>(
    userId,
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(Array.isArray(body) ? body : [body]),
    },
    increment,
  )
}

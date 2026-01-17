'use server'

import { auth } from '@/lib/auth'
import { checkAndIncrementUsage } from '@/lib/usage-utils'
import { headers } from 'next/headers'
import { z } from 'zod'

const AIKeywordDataSchema = z.object({
  keywords: z
    .string()
    .min(1, 'Au moins un mot clé est requis')
    .max(5000, 'Le texte est trop long'),
})

const LLMMentionsSchema = z.object({
  target_type: z.enum(['keyword', 'domain']),
  target_value: z
    .string()
    .min(1, 'La valeur de la cible est requise')
    .max(2000, 'La valeur est trop longue'),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return 100
      const parsed = parseInt(val, 10)
      return isNaN(parsed) ? 100 : parsed
    }),
})

// ===========================
// INTERFACES TYPESCRIPT
// ===========================

interface AIMonthlySearch {
  year: number
  month: number
  ai_search_volume: number
}

interface AIKeywordItem {
  keyword: string
  ai_search_volume: number
  ai_monthly_searches: AIMonthlySearch[]
}

interface AIKeywordDataResult {
  location_code: number
  language_code: string
  items_count: number
  items: AIKeywordItem[]
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
    data: Record<string, unknown>
    result: AIKeywordDataResult[]
  }>
}

export interface AIKeywordDataState {
  success: boolean
  error?: string | Record<string, string[]>
  result?: AIKeywordDataResult
  keywords?: string[]
  message?: string
}

// Interfaces pour LLM Mentions
interface LLMMentionSource {
  snippet?: string
  source_name?: string
  thumbnail?: string
  markdown?: string
  position?: number
  title?: string
  domain?: string
  url?: string
  publication_date?: string
}

interface LLMBrandEntity {
  position?: number
  title?: string
  category?: string
}

interface LLMMentionItem {
  platform: string
  location_code: number
  language_code: string
  question?: string
  answer?: string
  sources?: LLMMentionSource[]
  search_results?: Array<{
    description?: string
    breadcrumb?: string
    position?: number
    title?: string
    domain?: string
    url?: string
    publication_date?: string
  }>
  ai_search_volume?: number
  ai_monthly_searches?: Array<{
    year: number
    month: number
    ai_search_volume: number
  }>
  first_response_at?: string
  last_response_at?: string
  brand_entities?: LLMBrandEntity[]
  fan_out_queries?: string[]
}

interface LLMMentionsResult {
  total_count: number
  current_offset: number
  search_after_token?: string
  items_count: number
  items: LLMMentionItem[]
}

interface LLMMentionsResponse {
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
    data: Record<string, unknown>
    result: LLMMentionsResult[]
  }>
}

export interface LLMMentionsState {
  success: boolean
  error?: string | Record<string, string[]>
  result?: LLMMentionsResult
  target_type?: 'keyword' | 'domain'
  target_value?: string
  message?: string
}

// ===========================
// SERVER ACTIONS
// ===========================

/**
 * Appelle l'API DataForSEO AI Keyword Data
 * Récupère le volume de recherche IA et l'intention utilisateur pour des mots clés
 */
export async function fetchAIKeywordData(
  prevState: AIKeywordDataState,
  formData: FormData,
): Promise<AIKeywordDataState> {
  console.log("🔍 Début de l'analyse AI Keyword Data...")

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

    // Vérification des limites d'usage pour la visibilité IA
    const usageCheck = await checkAndIncrementUsage(session.user.id, 'aiVisibilityRequests')
    if (!usageCheck.allowed) {
      return {
        success: false,
        error: usageCheck.message || 'Limite de requêtes Visibilité IA atteinte. Cette fonctionnalité n\'est pas disponible avec le forfait gratuit.',
      }
    }

    // Extraction et validation des données du formulaire
    const rawData = {
      keywords: formData.get('keywords') as string,
    }

    console.log('📊 Données reçues:', rawData)

    // Validation avec Zod
    const validatedFields = AIKeywordDataSchema.safeParse(rawData)

    if (!validatedFields.success) {
      console.error('❌ Validation échouée:', validatedFields.error.flatten())
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { keywords: keywordsInput } = validatedFields.data

    // Parser les mots-clés : séparer par virgules, retours à la ligne, ou points-virgules
    const keywordsArray = keywordsInput
      .split(/[,\n;]/)
      .map((kw) => kw.trim())
      .filter((kw) => kw.length > 0)
      .map((kw) => kw.toLowerCase())

    if (keywordsArray.length === 0) {
      return {
        success: false,
        error: { keywords: ['Au moins un mot clé valide est requis'] },
      }
    }

    if (keywordsArray.length > 100) {
      return {
        success: false,
        error: {
          keywords: [
            'Maximum 100 mots-clés autorisés par analyse. Vous en avez saisi ' +
              keywordsArray.length,
          ],
        },
      }
    }

    console.log(
      `📝 ${keywordsArray.length} mot(s) clé(s) à analyser:`,
      keywordsArray,
    )

    // Préparation de la requête DataForSEO (fixée sur la France uniquement)
    const requestBody = [
      {
        keywords: keywordsArray,
        location_name: 'France',
        language_code: 'fr',
        language_name: 'French',
      },
    ]

    console.log('📤 Requête DataForSEO:', JSON.stringify(requestBody, null, 2))

    // Appel à l'API DataForSEO
    const apiUrl = `${process.env.DATAFORSEO_URL}/ai_optimization/ai_keyword_data/keywords_search_volume/live`

    const credentials = process.env.DATAFORSEO_PASSWORD

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      console.error('❌ Erreur HTTP:', response.status, response.statusText)
      const errorText = await response.text()
      console.error("❌ Détails de l'erreur:", errorText)
      return {
        success: false,
        error: `Erreur API (${response.status}): ${response.statusText}`,
      }
    }

    const data: DataForSEOResponse = await response.json()
    console.log('📥 Réponse DataForSEO:', JSON.stringify(data, null, 2))

    // Vérification de la réponse
    if (data.status_code !== 20000) {
      console.error('❌ Erreur DataForSEO:', data.status_message)
      return {
        success: false,
        error: `Erreur DataForSEO: ${data.status_message}`,
      }
    }

    if (!data.tasks || data.tasks.length === 0) {
      console.error('❌ Aucune tâche retournée')
      return {
        success: false,
        error: "Aucune donnée retournée par l'API",
      }
    }

    const task = data.tasks[0]

    if (task.status_code !== 20000) {
      console.error('❌ Erreur tâche:', task.status_message)
      return {
        success: false,
        error: `Erreur lors de l'analyse: ${task.status_message}`,
      }
    }

    if (!task.result || task.result.length === 0) {
      console.error('❌ Aucun résultat dans la tâche')
      return {
        success: false,
        error: 'Aucun résultat trouvé pour ces mots-clés',
      }
    }

    const result = task.result[0]

    console.log('✅ Analyse réussie!')
    console.log(`📊 Résultats: ${result.items_count} mot(s) clé(s) analysé(s)`)
    console.log(`💰 Coût: $${data.cost}`)

    return {
      success: true,
      result,
      keywords: keywordsArray,
      message: `Analyse AI Keyword Data réussie pour ${keywordsArray.length} mot(s) clé(s)`,
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

/**
 * Appelle l'API DataForSEO LLM Mentions
 * Récupère les mentions de marques/sites dans les LLM
 */
export async function fetchLLMMentions(
  prevState: LLMMentionsState,
  formData: FormData,
): Promise<LLMMentionsState> {
  console.log("🔍 Début de l'analyse LLM Mentions...")

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

    // Vérification des limites d'usage pour la visibilité IA
    const usageCheck = await checkAndIncrementUsage(session.user.id, 'aiVisibilityRequests')
    if (!usageCheck.allowed) {
      return {
        success: false,
        error: usageCheck.message || 'Limite de requêtes Visibilité IA atteinte. Cette fonctionnalité n\'est pas disponible avec le forfait gratuit.',
      }
    }

    // Extraction et validation des données du formulaire
    const rawData = {
      target_type: formData.get('target_type') as string,
      target_value: formData.get('target_value') as string,
      limit: formData.get('limit') as string,
    }

    console.log('📊 Données reçues:', rawData)

    // Validation avec Zod
    const validatedFields = LLMMentionsSchema.safeParse(rawData)

    if (!validatedFields.success) {
      console.error('❌ Validation échouée:', validatedFields.error.flatten())
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { target_type, target_value, limit } = validatedFields.data

    // Validation de la limite
    const finalLimit = Math.min(Math.max(limit || 100, 1), 1000)

    // Préparation de la requête DataForSEO
    // Construction du tableau target selon le type
    const target = []
    if (target_type === 'domain') {
      // Nettoyer le domaine (enlever https://, www., etc.)
      const cleanDomain = target_value
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .trim()
      target.push({
        domain: cleanDomain,
        search_filter: 'include',
        search_scope: ['any'],
      })
    } else {
      // Keyword
      target.push({
        keyword: target_value.trim(),
        search_filter: 'include',
        search_scope: ['any'],
        match_type: 'word_match',
      })
    }

    const requestBody = [
      {
        target,
        language_code: 'fr',
        platform: 'google', // Fixé sur Google (seule plateforme disponible pour la France)
        limit: finalLimit,
      },
    ]

    console.log(
      '📤 Requête DataForSEO LLM Mentions:',
      JSON.stringify(requestBody, null, 2),
    )

    // Appel à l'API DataForSEO
    const apiUrl = `${process.env.DATAFORSEO_URL}/ai_optimization/llm_mentions/search/live`

    const credentials = process.env.DATAFORSEO_PASSWORD

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      console.error('❌ Erreur HTTP:', response.status, response.statusText)
      const errorText = await response.text()
      console.error("❌ Détails de l'erreur:", errorText)
      return {
        success: false,
        error: `Erreur API (${response.status}): ${response.statusText}`,
      }
    }

    const data: LLMMentionsResponse = await response.json()
    console.log(
      '📥 Réponse DataForSEO LLM Mentions:',
      JSON.stringify(data, null, 2),
    )

    // Vérification de la réponse
    if (data.status_code !== 20000) {
      console.error('❌ Erreur DataForSEO:', data.status_message)
      return {
        success: false,
        error: `Erreur DataForSEO: ${data.status_message}`,
      }
    }

    if (!data.tasks || data.tasks.length === 0) {
      console.error('❌ Aucune tâche retournée')
      return {
        success: false,
        error: "Aucune donnée retournée par l'API",
      }
    }

    const task = data.tasks[0]

    if (task.status_code !== 20000) {
      console.error('❌ Erreur tâche:', task.status_message)
      return {
        success: false,
        error: `Erreur lors de l'analyse: ${task.status_message}`,
      }
    }

    if (!task.result || task.result.length === 0) {
      console.error('❌ Aucun résultat dans la tâche')
      return {
        success: false,
        error: 'Aucune mention trouvée pour cette cible',
      }
    }

    const result = task.result[0]

    console.log('✅ Analyse LLM Mentions réussie!')
    console.log(
      `📊 Résultats: ${result.items_count} mention(s) trouvée(s) sur ${result.total_count} total`,
    )
    console.log(`💰 Coût: $${data.cost}`)

    return {
      success: true,
      result,
      target_type,
      target_value,
      message: `Analyse LLM Mentions réussie: ${result.items_count} mention(s) trouvée(s)`,
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

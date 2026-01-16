'use server'

import { z } from 'zod'

const auditSeoSchema = z.object({
  url: z
    .string()
    .min(1, "L'URL est requise")
    .url('Veuillez entrer une URL valide')
    .refine(
      (url) => {
        try {
          const parsed = new URL(url)
          return parsed.protocol === 'http:' || parsed.protocol === 'https:'
        } catch {
          return false
        }
      },
      {
        message: "L'URL doit commencer par http:// ou https://",
      },
    ),
})

export interface AuditSeoState {
  success: boolean
  error?: string | Record<string, string[]>
  result?: InstantPagesResult
  url?: string
  message?: string
}

export interface InstantPagesResult {
  url: string
  status_code: number
  onpage_score: number
  meta: {
    title?: string
    description?: string
    canonical?: string
    htags?: {
      h1?: string[]
      h2?: string[]
      h3?: string[]
      h4?: string[]
      h5?: string[]
      h6?: string[]
    }
    social_media_tags?: {
      [key: string]: string
    }
    title_length?: number
    description_length?: number
    internal_links_count?: number
    external_links_count?: number
    images_count?: number
  }
  checks: {
    [key: string]: boolean
  }
  page_timing?: {
    time_to_interactive?: number
    dom_complete?: number
    largest_contentful_paint?: number
    first_input_delay?: number
    connection_time?: number
    download_time?: number
    duration_time?: number
  }
  content?: {
    plain_text_size?: number
    plain_text_word_count?: number
    automated_readability_index?: number
    flesch_kincaid_readability_index?: number
  }
  size?: number
  media_type?: string
  server?: string
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
    result: Array<{
      items: Array<{
        url: string
        status_code: number
        onpage_score: number
        meta: {
          title?: string
          description?: string
          canonical?: string
          htags?: {
            h1?: string[]
            h2?: string[]
            h3?: string[]
            h4?: string[]
            h5?: string[]
            h6?: string[]
          }
          social_media_tags?: {
            [key: string]: string
          }
          title_length?: number
          description_length?: number
          internal_links_count?: number
          external_links_count?: number
          images_count?: number
        }
        checks: {
          [key: string]: boolean
        }
        page_timing?: {
          time_to_interactive?: number
          dom_complete?: number
          largest_contentful_paint?: number
          first_input_delay?: number
          connection_time?: number
          download_time?: number
          duration_time?: number
        }
        content?: {
          plain_text_size?: number
          plain_text_word_count?: number
          automated_readability_index?: number
          flesch_kincaid_readability_index?: number
        }
        size?: number
        media_type?: string
        server?: string
      }>
    }>
  }>
}

/**
 * Action serveur pour effectuer un audit SEO instantané via DataForSEO
 * Utilise l'endpoint /v3/on_page/instant_pages
 */
export async function auditSeoInstant(prevState: AuditSeoState, formData: FormData): Promise<AuditSeoState> {
  console.log("🔍 Début de l'audit SEO instantané...")

  try {
    // Extraction et validation des données du formulaire
    const rawData = {
      url: formData.get('url') as string,
    }

    console.log('📊 URL reçue:', rawData.url)

    // Validation avec Zod
    const validatedFields = auditSeoSchema.safeParse(rawData)

    if (!validatedFields.success) {
      console.error('❌ Validation échouée:', validatedFields.error.flatten())
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { url } = validatedFields.data

    // Vérifier les credentials DataForSEO
    if (!process.env.DATAFORSEO_URL || !process.env.DATAFORSEO_PASSWORD) {
      console.error('❌ Credentials DataForSEO manquants')
      return {
        success: false,
        error: 'Configuration API manquante. Veuillez contacter le support.',
      }
    }

    // Préparer la requête pour l'API DataForSEO
    const apiUrl = `${process.env.DATAFORSEO_URL}/on_page/instant_pages`
    const credentials = process.env.DATAFORSEO_PASSWORD

    console.log('🌐 Appel API DataForSEO:', apiUrl)

    // Nettoyer l'URL (s'assurer qu'elle est valide)
    let cleanUrl = url.trim()
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`
    }

    // Appel API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          url: cleanUrl,
          enable_javascript: false,
          enable_browser_rendering: false,
        },
      ]),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erreur API:', response.status, errorText)
      return {
        success: false,
        error: `Erreur API: ${response.status} ${response.statusText}`,
      }
    }

    const data: DataForSEOResponse = await response.json()

    console.log('📥 Réponse API reçue:', {
      status_code: data.status_code,
      tasks_count: data.tasks_count,
    })

    // Vérifier le statut de la réponse
    if (data.status_code !== 20000) {
      console.error('❌ Erreur API DataForSEO:', data.status_message)
      return {
        success: false,
        error: data.status_message || "Erreur lors de l'appel à l'API",
      }
    }

    // Vérifier qu'il y a des tâches
    if (!data.tasks || data.tasks.length === 0) {
      console.error('❌ Aucune tâche retournée')
      return {
        success: false,
        error: "Aucune tâche retournée par l'API",
      }
    }

    const task = data.tasks[0]

    // Vérifier le statut de la tâche
    if (task.status_code !== 20000) {
      console.error('❌ Erreur tâche:', task.status_message)
      return {
        success: false,
        error: task.status_message || 'Erreur lors du traitement de la tâche',
      }
    }

    // Vérifier qu'il y a des résultats
    if (!task.result || task.result.length === 0) {
      console.error('❌ Aucun résultat retourné')
      return {
        success: false,
        error: 'Aucun résultat retourné pour cette URL',
      }
    }

    const taskResult = task.result[0]

    // Vérifier qu'il y a des items
    if (!taskResult.items || taskResult.items.length === 0) {
      console.error('❌ Aucun item retourné')
      return {
        success: false,
        error: 'Aucun item retourné pour cette URL',
      }
    }

    const item = taskResult.items[0]

    // Transformer les données pour correspondre à notre interface
    const result: InstantPagesResult = {
      url: item.url,
      status_code: item.status_code,
      onpage_score: item.onpage_score,
      meta: item.meta || {},
      checks: item.checks || {},
      page_timing: item.page_timing,
      content: item.content,
      size: item.size,
      media_type: item.media_type,
      server: item.server,
    }

    console.log('✅ Audit SEO réussi:', {
      url: result.url,
      score: result.onpage_score,
      checks_count: Object.keys(result.checks || {}).length,
    })

    return {
      success: true,
      result,
      url: cleanUrl,
      message: 'Audit SEO terminé avec succès',
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'audit SEO:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
    }
  }
}

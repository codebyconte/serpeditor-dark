'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Types pour Domain Overview
export interface DomainMetrics {
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
    etv: number // Estimated Traffic Value
    count: number // Nombre total de mots-clés
    estimated_paid_traffic_cost: number // Valeur estimée du trafic organique
    is_new: number // Nouveaux mots-clés
    is_up: number // Positions améliorées
    is_down: number // Positions dégradées
    is_lost: number // Mots-clés perdus
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
  } | null
}

export interface DomainOverviewItem {
  se_type: string
  location_code: number
  language_code: string
  metrics: DomainMetrics
}

export interface DomainOverviewResponse {
  se_type: string
  target: string
  location_code: number
  language_code: string
  total_count: number
  items_count: number
  items: DomainOverviewItem[]
}

export interface DomainOverviewResult {
  success: boolean
  data?: DomainOverviewResponse
  error?: string
}

export interface GetDomainOverviewParams {
  target: string
  locationCode?: number
  languageCode?: string
  ignoreSynonyms?: boolean
  limit?: number
  offset?: number
}

// Fonction pour obtenir les données d'overview d'un domaine
export async function getDomainOverview(params: GetDomainOverviewParams): Promise<DomainOverviewResult> {
  try {
    // Authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        error: 'Non authentifié',
      }
    }

    // Nettoyer le domaine
    let cleanTarget = params.target.trim()
    cleanTarget = cleanTarget.replace(/^https?:\/\//, '')
    cleanTarget = cleanTarget.replace(/^www\./, '')
    cleanTarget = cleanTarget.replace(/\/$/, '')

    // Validation du domaine
    if (!cleanTarget || cleanTarget.includes(' ')) {
      return {
        success: false,
        error: 'Format de domaine invalide',
      }
    }

    // Préparer la requête pour DataForSEO
    const requestBody = [
      {
        target: cleanTarget,
        location_code: params.locationCode || 2250, // France par défaut
        language_code: params.languageCode || 'fr', // Français par défaut
        ...(params.ignoreSynonyms !== undefined && { ignore_synonyms: params.ignoreSynonyms }),
        limit: params.limit || 1000,
        ...(params.offset && { offset: params.offset }),
      },
    ]

    // Appel à l'API DataForSEO
    const dataForSeoLogin = process.env.DATAFORSEO_LOGIN
    const dataForSeoPassword = process.env.DATAFORSEO_PASSWORD

    if (!dataForSeoLogin || !dataForSeoPassword) {
      return {
        success: false,
        error: 'Configuration API manquante',
      }
    }

    // Encoder les credentials en base64 pour l'authentification Basic
    const credentials = process.env.DATAFORSEO_PASSWORD

    const response = await fetch(`${process.env.DATAFORSEO_URL}/dataforseo_labs/google/domain_rank_overview/live`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DataForSEO API Error:', errorText)
      return {
        success: false,
        error: `Erreur API: ${response.status}`,
      }
    }

    const data = await response.json()

    // Vérifier le status_code global
    if (data.status_code !== 20000) {
      return {
        success: false,
        error: data.status_message || 'Erreur API inconnue',
      }
    }

    // Vérifier la structure de la réponse
    if (!data || !data.tasks || !data.tasks[0]) {
      return {
        success: false,
        error: 'Aucune tâche trouvée dans la réponse',
      }
    }

    const task = data.tasks[0]

    // Vérifier le status_code de la tâche
    if (task.status_code !== 20000) {
      return {
        success: false,
        error: task.status_message || 'Erreur lors du traitement de la tâche',
      }
    }

    // Vérifier que result existe et contient des données
    if (!task.result || !task.result[0]) {
      return {
        success: false,
        error: 'Aucune donnée trouvée pour ce domaine',
      }
    }

    const taskResult = task.result[0]

    // Vérifier que items existe et n'est pas vide
    if (!taskResult.items || taskResult.items.length === 0) {
      return {
        success: false,
        error: 'Aucune donnée trouvée pour ce domaine',
      }
    }

    // Formater les données selon l'interface DomainOverviewResponse
    // La structure de la réponse API correspond exactement à notre interface
    const formattedData: DomainOverviewResponse = {
      se_type: taskResult.se_type || 'google',
      target: taskResult.target || cleanTarget,
      location_code: taskResult.location_code || params.locationCode || 2250,
      language_code: taskResult.language_code || params.languageCode || 'fr',
      total_count: taskResult.total_count || 0,
      items_count: taskResult.items_count || taskResult.items.length,
      items: taskResult.items.map((item: DomainOverviewItem) => ({
        se_type: item.se_type || taskResult.se_type || 'google',
        location_code: item.location_code || taskResult.location_code || params.locationCode || 2250,
        language_code: item.language_code || taskResult.language_code || params.languageCode || 'fr',
        metrics: {
          organic: item.metrics.organic,
          paid: item.metrics.paid || null, // paid peut être null selon la structure API
        },
      })),
    }

    return {
      success: true,
      data: formattedData,
    }
  } catch (error) {
    console.error('Error in getDomainOverview:', error)
    return {
      success: false,
      error: 'Une erreur est survenue lors de la récupération des données',
    }
  }
}

// Fonction pour calculer les statistiques globales
export interface DomainOverviewStats {
  totalOrganicKeywords: number
  totalOrganicTraffic: number
  totalOrganicValue: number
  totalPaidKeywords: number
  totalPaidTraffic: number
  totalPaidCost: number
  organicTrend: {
    new: number
    up: number
    down: number
    lost: number
  }
  paidTrend: {
    new: number
    up: number
    down: number
    lost: number
  }
  topPositions: {
    organic: {
      top3: number
      top10: number
      top20: number
      top50: number
      top100: number
    }
    paid: {
      top3: number
      top10: number
      top20: number
      top50: number
      top100: number
    }
  }
}

// calculateDomainStats a été déplacée dans utils.ts pour être utilisable côté client

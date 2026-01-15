// 📁 app/dashboard/backlinks/nouveaux-perdus/action.ts
'use server'

import { z } from 'zod'

const newLostBacklinksSchema = z.object({
  target: z.string().min(1, 'Le domaine cible est requis'),
})

export interface NewLostBacklinksState {
  success: boolean
  error?: string
  result?: NewLostBacklinksResult
  cost?: number
}

export interface NewLostBacklinksResult {
  target: string
  date_from: string
  date_to: string
  group_range: string
  items_count: number
  items: TimeseriesItem[]
}

export interface TimeseriesItem {
  type: string
  date: string
  new_backlinks: number
  lost_backlinks: number
  new_referring_domains: number
  lost_referring_domains: number
  new_referring_main_domains: number
  lost_referring_main_domains: number
}

export async function fetchNewLostBacklinks(
  prevState: NewLostBacklinksState,
  formData: FormData,
): Promise<NewLostBacklinksState> {
  try {
    // Extraction des données
    const rawTarget = formData.get('target')

    if (!rawTarget || typeof rawTarget !== 'string') {
      return { success: false, error: 'Veuillez saisir un domaine cible' }
    }

    // Nettoyage du domaine
    let target = rawTarget.trim()
    target = target.replace(/^https?:\/\//i, '')
    target = target.replace(/^www\./i, '')
    target = target.split('/')[0]

    // Calculer les dates par défaut (90 derniers jours)
    const dateTo = new Date()
    const dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 jours avant

    // Validation
    const validated = newLostBacklinksSchema.safeParse({
      target,
    })

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0].message,
      }
    }

    // Configuration de la requête avec valeurs par défaut
    const requestBody = [
      {
        target: validated.data.target,
        date_from: dateFrom.toISOString().split('T')[0],
        date_to: dateTo.toISOString().split('T')[0],
        group_range: 'month', // Par défaut: groupement par mois
        include_subdomains: true,
      },
    ]

    const credentials = process.env.DATAFORSEO_PASSWORD

    // Appel API DataForSEO
    const response = await fetch(
      `${process.env.DATAFORSEO_URL}/backlinks/timeseries_new_lost_summary/live`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    )

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const data = await response.json()

    if (data.status_code !== 20000) {
      throw new Error(
        data.status_message || 'Erreur lors de la récupération des données',
      )
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
    console.error('Erreur fetchNewLostBacklinks:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la récupération des données',
    }
  }
}

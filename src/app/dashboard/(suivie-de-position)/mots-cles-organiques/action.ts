// 📁 app/dashboard/mots-cles-organiques/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { format, subDays } from 'date-fns'
import { headers } from 'next/headers'

export interface KeywordData {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  clicksChange: number
  positionChange: number
  impressionsChange: number
  ctrChange: number
  isNew: boolean
  isImproving: boolean
  isDecreasing: boolean
  opportunity: 'high' | 'medium' | 'low'
}

async function getKeywordsData(
  projectUrl: string,
  accessToken: string,
  startDate: Date,
  endDate: Date,
  limit: number = 1000,
) {
  try {
    const formatToISO = (date: Date) => format(date, 'yyyy-MM-dd')
    const siteUrl = encodeURIComponent(projectUrl)
    const apiUrl = `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        startDate: formatToISO(startDate),
        endDate: formatToISO(endDate),
        dimensions: ['query'],
        rowLimit: limit,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur GSC keywords:', error)
    return null
  }
}

export async function fetchOrganicKeywords(projectId: string) {
  try {
    if (!projectId) {
      return {
        success: false,
        error: 'ID de projet manquant',
      }
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Vous devez être connecté pour accéder à cette fonctionnalité',
      }
    }

    const accessToken = await auth.api.getAccessToken({
      body: {
        providerId: 'google',
        userId: session.user.id,
      },
      headers: await headers(),
    })

    if (!accessToken || !accessToken.accessToken) {
      return {
        success: false,
        error: 'Impossible de récupérer le token Google. Veuillez vous reconnecter avec Google dans les paramètres.',
      }
    }

    // Récupérer le projet
    const { prisma } = await import('@/lib/prisma')
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: session.user.id },
    })

    if (!project) {
      return {
        success: false,
        error: "Projet non trouvé ou vous n'avez pas accès à ce projet",
      }
    }

    if (!project.url) {
      return {
        success: false,
        error: "Le projet ne contient pas d'URL. Veuillez configurer l'URL du projet.",
      }
    }

    // Période actuelle (30 derniers jours)
    const endDate = subDays(new Date(), 1)
    const startDate = subDays(endDate, 30)

    // Période précédente (30 jours avant)
    const previousEndDate = subDays(startDate, 1)
    const previousStartDate = subDays(previousEndDate, 30)

    // Récupération parallèle
    const [currentData, previousData] = await Promise.all([
      getKeywordsData(project.url, accessToken.accessToken, startDate, endDate),
      getKeywordsData(project.url, accessToken.accessToken, previousStartDate, previousEndDate),
    ])

    if (!currentData?.rows) {
      return {
        success: false,
        error: 'Aucune donnée disponible',
      }
    }

    // Calculer les changements et enrichir les données
    const keywords: KeywordData[] = currentData.rows.map(
      (keyword: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }) => {
        const query = keyword.keys[0]
        const previousKeyword = previousData?.rows?.find((k: { keys: string[] }) => k.keys[0] === query)

        let clicksChange = 0
        let positionChange = 0
        let impressionsChange = 0
        let ctrChange = 0

        if (previousKeyword) {
          clicksChange =
            previousKeyword.clicks > 0
              ? ((keyword.clicks - previousKeyword.clicks) / previousKeyword.clicks) * 100
              : keyword.clicks > 0
                ? 100
                : 0

          positionChange = previousKeyword.position - keyword.position

          impressionsChange =
            previousKeyword.impressions > 0
              ? ((keyword.impressions - previousKeyword.impressions) / previousKeyword.impressions) * 100
              : keyword.impressions > 0
                ? 100
                : 0

          ctrChange =
            previousKeyword.ctr > 0
              ? ((keyword.ctr - previousKeyword.ctr) / previousKeyword.ctr) * 100
              : keyword.ctr > 0
                ? 100
                : 0
        }

        // Déterminer le niveau d'opportunité
        let opportunity: 'high' | 'medium' | 'low' = 'low'
        if (keyword.position > 3 && keyword.position <= 20 && keyword.impressions > 100) {
          opportunity = 'high'
        } else if (keyword.position > 20 && keyword.position <= 50 && keyword.impressions > 50) {
          opportunity = 'medium'
        }

        return {
          query,
          clicks: keyword.clicks,
          impressions: keyword.impressions,
          ctr: keyword.ctr,
          position: keyword.position,
          clicksChange,
          positionChange,
          impressionsChange,
          ctrChange,
          isNew: !previousKeyword,
          isImproving: positionChange > 1 || clicksChange > 20,
          isDecreasing: positionChange < -1 || clicksChange < -20,
          opportunity,
        }
      },
    )

    // Statistiques globales
    const totalClicks = keywords.reduce((sum, k) => sum + k.clicks, 0)
    const totalImpressions = keywords.reduce((sum, k) => sum + k.impressions, 0)
    const avgCTR = totalImpressions > 0 ? totalClicks / totalImpressions : 0
    const avgPosition = keywords.length > 0 ? keywords.reduce((sum, k) => sum + k.position, 0) / keywords.length : 0

    const topPerformers = keywords.filter((k) => k.position <= 3).length
    const firstPageKeywords = keywords.filter((k) => k.position <= 10).length
    const newKeywords = keywords.filter((k) => k.isNew).length
    const improvingKeywords = keywords.filter((k) => k.isImproving).length

    return {
      success: true,
      keywords,
      stats: {
        totalKeywords: keywords.length,
        totalClicks,
        totalImpressions,
        avgCTR,
        avgPosition,
        topPerformers,
        firstPageKeywords,
        newKeywords,
        improvingKeywords,
      },
    }
  } catch (error) {
    console.error('Erreur fetchOrganicKeywords:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors du chargement',
    }
  }
}

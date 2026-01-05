// 📁 app/dashboard/pages-principales/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format, subDays } from 'date-fns'
import { headers } from 'next/headers'

export interface PageData {
  url: string
  path: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  clicksChange: number
  positionChange: number
  impressionsChange: number
  ctrChange: number
  isNew: boolean
  isTop: boolean
  isImproving: boolean
  isDecreasing: boolean
  pageType: 'home' | 'category' | 'product' | 'article' | 'other'
}

async function getPagesData(
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
        dimensions: ['page'],
        rowLimit: limit,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur GSC pages:', error)
    return null
  }
}

function getPageType(url: string): PageData['pageType'] {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname.toLowerCase()

    if (path === '/' || path === '') return 'home'
    if (path.includes('/blog/') || path.includes('/article/')) return 'article'
    if (path.includes('/category/') || path.includes('/categorie/')) return 'category'
    if (path.includes('/product/') || path.includes('/produit/') || path.includes('/p/')) return 'product'

    return 'other'
  } catch {
    return 'other'
  }
}

function shortenPath(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname + urlObj.search || '/'
  } catch {
    return url
  }
}

export async function fetchTopPages(projectId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      throw new Error('Non authentifié')
    }

    const accessToken = await auth.api.getAccessToken({
      body: {
        providerId: 'google',
        userId: session.user.id,
      },
      headers: await headers(),
    })

    if (!accessToken) {
      throw new Error('Token non disponible')
    }

    // Récupérer le projet
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: session.user.id },
    })

    if (!project) {
      throw new Error('Projet non trouvé')
    }

    // Période actuelle (30 derniers jours)
    const endDate = subDays(new Date(), 1)
    const startDate = subDays(endDate, 30)

    // Période précédente (30 jours avant)
    const previousEndDate = subDays(startDate, 1)
    const previousStartDate = subDays(previousEndDate, 30)

    // Récupération parallèle
    const [currentData, previousData] = await Promise.all([
      getPagesData(project.url, accessToken.accessToken, startDate, endDate),
      getPagesData(project.url, accessToken.accessToken, previousStartDate, previousEndDate),
    ])

    if (!currentData?.rows) {
      return {
        success: false,
        error: 'Aucune donnée disponible',
      }
    }

    // Enrichir les données
    const pages: PageData[] = currentData.rows.map((page: any) => {
      const url = page.keys[0]
      const path = shortenPath(url)
      const previousPage = previousData?.rows?.find((p: any) => p.keys[0] === url)

      let clicksChange = 0
      let positionChange = 0
      let impressionsChange = 0
      let ctrChange = 0

      if (previousPage) {
        clicksChange =
          previousPage.clicks > 0
            ? ((page.clicks - previousPage.clicks) / previousPage.clicks) * 100
            : page.clicks > 0
              ? 100
              : 0

        positionChange = previousPage.position - page.position

        impressionsChange =
          previousPage.impressions > 0
            ? ((page.impressions - previousPage.impressions) / previousPage.impressions) * 100
            : page.impressions > 0
              ? 100
              : 0

        ctrChange =
          previousPage.ctr > 0 ? ((page.ctr - previousPage.ctr) / previousPage.ctr) * 100 : page.ctr > 0 ? 100 : 0
      }

      return {
        url,
        path,
        clicks: page.clicks,
        impressions: page.impressions,
        ctr: page.ctr,
        position: page.position,
        clicksChange,
        positionChange,
        impressionsChange,
        ctrChange,
        isNew: !previousPage,
        isTop: page.position <= 3,
        isImproving: positionChange > 1 || clicksChange > 20,
        isDecreasing: positionChange < -1 || clicksChange < -20,
        pageType: getPageType(url),
      }
    })

    // Statistiques
    const totalClicks = pages.reduce((sum, p) => sum + p.clicks, 0)
    const totalImpressions = pages.reduce((sum, p) => sum + p.impressions, 0)
    const avgCTR = totalImpressions > 0 ? totalClicks / totalImpressions : 0
    const avgPosition = pages.length > 0 ? pages.reduce((sum, p) => sum + p.position, 0) / pages.length : 0

    const topPages = pages.filter((p) => p.isTop).length
    const newPages = pages.filter((p) => p.isNew).length
    const improvingPages = pages.filter((p) => p.isImproving).length

    // Répartition par type
    const pagesByType = pages.reduce(
      (acc, page) => {
        acc[page.pageType] = (acc[page.pageType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      success: true,
      pages,
      stats: {
        totalPages: pages.length,
        totalClicks,
        totalImpressions,
        avgCTR,
        avgPosition,
        topPages,
        newPages,
        improvingPages,
        pagesByType,
      },
    }
  } catch (error) {
    console.error('Erreur fetchTopPages:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors du chargement',
    }
  }
}

// Dashboard page - SEO Analytics Overview
import { DeleteProjectButton } from '@/components/dashboard/delete-project-button'
import { Dropdown, DropdownButton, DropdownMenu } from '@/components/dashboard/dropdown'
import { PageHeader } from '@/components/dashboard/page-header'
import { OpenModal } from '@/components/open-modale-google'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/server-utils'
import { format, subDays } from 'date-fns'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  EllipsisVertical,
  Eye,
  Folder,
  Globe,
  MousePointerClick,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'

/**
 * Métadonnées pour la page principale du dashboard
 * Note: robots: noindex car c'est une page privée/authentifiée
 */
export const metadata: Metadata = {
  title: 'Tableau de Bord',
  robots: {
    index: false,
    follow: false,
  },
}

// Types pour les données GSC
interface GSCRow {
  clicks?: number
  impressions?: number
  position?: number
}

interface GSCData {
  rows?: GSCRow[]
}

interface ProjectMetrics {
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface ProjectAlert {
  type: 'error' | 'warning' | 'info'
  title: string
  description: string
  action: string
}

// ✅ Fonction pour récupérer les données GSC d'un projet
async function getProjectGSCData(
  projectUrl: string,
  accessToken: string,
  startDate: Date,
  endDate: Date,
): Promise<ProjectMetrics | null> {
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
        dimensions: ['date'],
      }),
      next: { revalidate: 3600 }, // Cache 1h
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    // Calculer les totaux
    const gscData = data as GSCData
    if (gscData?.rows && gscData.rows.length > 0) {
      const totals = gscData.rows.reduce(
        (acc: ProjectMetrics, row: GSCRow) => ({
          clicks: acc.clicks + (row.clicks || 0),
          impressions: acc.impressions + (row.impressions || 0),
          ctr: 0,
          position: 0,
        }),
        { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      )

      totals.ctr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0
      totals.position =
        gscData.rows.reduce((sum: number, row: GSCRow) => sum + (row.position || 0), 0) / gscData.rows.length

      return totals
    }

    return null
  } catch (error) {
    console.error(`Erreur GSC pour ${projectUrl}:`, error)
    return null
  }
}

// ✅ Fonction pour calculer les alertes d'un projet
function getProjectAlerts(
  project: { id: string; crawl_status: string | null },
  metrics: ProjectMetrics | null | undefined,
  metricsPrevious: ProjectMetrics | null | undefined,
): ProjectAlert[] {
  const alerts: ProjectAlert[] = []

  // Alerte crawl status
  if (project.crawl_status === 'ERROR') {
    alerts.push({
      type: 'error',
      title: 'Erreur de crawl',
      description: 'Le crawl a échoué. Vérifiez les logs.',
      action: `/dashboard/audit-de-site/${project.id}`,
    })
  }

  if (metrics && metricsPrevious) {
    const clicksChange =
      metricsPrevious.clicks > 0 ? ((metrics.clicks - metricsPrevious.clicks) / metricsPrevious.clicks) * 100 : 0

    // Alerte baisse de trafic
    if (clicksChange < -10) {
      alerts.push({
        type: 'warning',
        title: 'Baisse de clics',
        description: `${Math.abs(clicksChange).toFixed(0)}% de clics en moins vs période précédente`,
        action: `/dashboard/mots-cles-organiques`,
      })
    }

    // Opportunité CTR
    if (metrics.ctr < 0.03) {
      alerts.push({
        type: 'info',
        title: 'Optimisation CTR',
        description: `CTR de ${(metrics.ctr * 100).toFixed(2)}%. Améliorez vos méta-descriptions.`,
        action: `/dashboard/pages-principales?project=${project.id}`,
      })
    }
  }

  return alerts
}

export default async function DashboardPage() {
  const session = await getSession()
  const userId = session?.user?.id

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  let accessToken = null
  try {
    accessToken = await auth.api.getAccessToken({
      body: { providerId: 'google', userId },
      headers: await headers(),
    })
  } catch {
    console.log('Google account not connected, continuing without GSC data')
  }

  const projectsData = new Map()
  const projectsDataPrevious = new Map()

  if (accessToken && projects.length > 0) {
    const endDate = subDays(new Date(), 1)
    const startDate = subDays(new Date(), 31)
    const previousEndDate = subDays(new Date(), 32)
    const previousStartDate = subDays(new Date(), 62)

    await Promise.all(
      projects.map(async (project) => {
        const currentData = await getProjectGSCData(project.url, accessToken.accessToken, startDate, endDate)
        if (currentData) projectsData.set(project.id, currentData)

        const previousData = await getProjectGSCData(
          project.url,
          accessToken.accessToken,
          previousStartDate,
          previousEndDate,
        )
        if (previousData) projectsDataPrevious.set(project.id, previousData)
      }),
    )
  }

  const getCrawlStatusBadge = (status: string | null | undefined) => {
    if (!status) return null
    const statusConfig = {
      PENDING: { color: 'amber' as const, label: 'En attente', icon: '...' },
      READY: { color: 'green' as const, label: 'Prêt', icon: null },
      ERROR: { color: 'red' as const, label: 'Erreur', icon: null },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null
    return <Badge color={config.color}>{config.label}</Badge>
  }

  return (
    <main className="text-foreground">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Tableau de bord"
          description="Suivez vos performances SEO, analysez vos concurrents et identifiez des opportunités de croissance"
          actions={<OpenModal />}
        />

        {projects.length > 0 ? (
          <section className="mt-8 space-y-6 pb-8">
            {/* Quick stats summary */}
            {projectsData.size > 0 && (
              <div className="mb-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {(() => {
                  let totalClicks = 0
                  let totalImpressions = 0
                  projectsData.forEach((data: ProjectMetrics) => {
                    totalClicks += data.clicks
                    totalImpressions += data.impressions
                  })
                  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

                  return (
                    <>
                      <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-500/20 bg-linear-to-br from-blue-500/10 via-mist-800/90 to-mist-900/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
                        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl transition-all duration-500 group-hover:bg-blue-500/30" />
                        <div className="relative">
                          <div className="mb-4 flex items-center justify-between border-b border-blue-500/10 pb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              Total clics
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 ring-2 ring-blue-500/10">
                              <MousePointerClick className="h-5 w-5 text-blue-400" />
                            </div>
                          </div>
                          <p className="text-4xl font-bold tracking-tight text-blue-400">
                            {totalClicks.toLocaleString('fr-FR')}
                          </p>
                          <p className="mt-2 text-sm font-medium text-muted-foreground">30 derniers jours</p>
                        </div>
                      </div>

                      <div className="group relative overflow-hidden rounded-2xl border-2 border-purple-500/20 bg-linear-to-br from-purple-500/10 via-mist-800/90 to-mist-900/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
                        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl transition-all duration-500 group-hover:bg-purple-500/30" />
                        <div className="relative">
                          <div className="mb-4 flex items-center justify-between border-b border-purple-500/10 pb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              Impressions
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 ring-2 ring-purple-500/10">
                              <Eye className="h-5 w-5 text-purple-400" />
                            </div>
                          </div>
                          <p className="text-4xl font-bold tracking-tight text-purple-400">
                            {totalImpressions.toLocaleString('fr-FR')}
                          </p>
                          <p className="mt-2 text-sm font-medium text-muted-foreground">30 derniers jours</p>
                        </div>
                      </div>

                      <div className="group relative overflow-hidden rounded-2xl border-2 border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-mist-800/90 to-mist-900/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10">
                        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/30" />
                        <div className="relative">
                          <div className="mb-4 flex items-center justify-between border-b border-emerald-500/10 pb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              CTR moyen
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 ring-2 ring-emerald-500/10">
                              <Zap className="h-5 w-5 text-emerald-400" />
                            </div>
                          </div>
                          <p className="text-4xl font-bold tracking-tight text-emerald-400">{avgCtr.toFixed(2)}%</p>
                          <p className="mt-2 text-sm font-medium text-muted-foreground">Tous projets</p>
                        </div>
                      </div>

                      <div className="group relative overflow-hidden rounded-2xl border-2 border-orange-500/20 bg-linear-to-br from-orange-500/10 via-mist-800/90 to-mist-900/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10">
                        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl transition-all duration-500 group-hover:bg-orange-500/30" />
                        <div className="relative">
                          <div className="mb-4 flex items-center justify-between border-b border-orange-500/10 pb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              Projets actifs
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 ring-2 ring-orange-500/10">
                              <Globe className="h-5 w-5 text-orange-400" />
                            </div>
                          </div>
                          <p className="text-4xl font-bold tracking-tight text-orange-400">{projects.length}</p>
                          <p className="mt-2 text-sm font-medium text-muted-foreground">Sites suivis</p>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            )}

            {/* Projects list */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Vos projets</h2>
                  <p className="text-muted-foreground mt-1 text-sm">Gérez et suivez vos sites web</p>
                </div>
                <span className="bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-semibold">
                  {projects.length} site{projects.length > 1 ? 's' : ''}
                </span>
              </div>

              {projects.map((project) => {
                const projectData = projectsData.get(project.id)
                const projectDataPrevious = projectsDataPrevious.get(project.id)
                const alerts = getProjectAlerts(project, projectData, projectDataPrevious)

                let clicksChange = 0
                let impressionsChange = 0

                if (projectData && projectDataPrevious) {
                  clicksChange =
                    projectDataPrevious.clicks > 0
                      ? ((projectData.clicks - projectDataPrevious.clicks) / projectDataPrevious.clicks) * 100
                      : 0
                  impressionsChange =
                    projectDataPrevious.impressions > 0
                      ? ((projectData.impressions - projectDataPrevious.impressions) /
                          projectDataPrevious.impressions) *
                        100
                      : 0
                }

                return (
                  <Card
                    key={project.id}
                    className="group relative overflow-hidden border-2 border-white/10 bg-linear-to-br from-mist-800/80 to-mist-900/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <CardHeader className="relative border-b border-white/5 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-1 items-start gap-4">
                          {/* Project icon with glow */}
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-xl bg-primary/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-primary/20 to-primary/5 shadow-lg">
                              <Globe className="h-6 w-6 text-primary" />
                            </div>
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-lg font-semibold tracking-tight">
                                {project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                              </CardTitle>
                              {getCrawlStatusBadge(project.crawl_status)}
                            </div>
                            <CardDescription>
                              <Link
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                              >
                                {project.url}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </CardDescription>
                            {project.task_created_at && (
                              <p className="text-xs text-muted-foreground/70">
                                Ajouté le {format(new Date(project.task_created_at), 'dd/MM/yyyy')}
                              </p>
                            )}
                          </div>
                        </div>

                        <CardAction>
                          <Dropdown>
                            <DropdownButton
                              plain
                              aria-label="Plus d'options"
                              className="rounded-lg border border-transparent p-2 transition-colors hover:border-white/10 hover:bg-white/5"
                            >
                              <EllipsisVertical size={16} />
                            </DropdownButton>
                            <DropdownMenu>
                              <DeleteProjectButton projectId={project.id} projectUrl={project.url} />
                            </DropdownMenu>
                          </Dropdown>
                        </CardAction>
                      </div>
                    </CardHeader>

                    <CardContent className="relative space-y-5 pt-5">
                      {projectData ? (
                        <>
                          {/* Metrics header */}
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                              <Activity className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                              Performances des 30 derniers jours
                            </span>
                          </div>

                          {/* Metrics grid */}
                          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {/* Clicks metric */}
                            <div className="group/stat relative overflow-hidden rounded-xl border-2 border-blue-500/20 bg-linear-to-br from-blue-500/10 via-blue-500/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl">
                              <div className="mb-3 flex items-center justify-between border-b border-blue-500/10 pb-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Clics
                                </span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 ring-2 ring-blue-500/10">
                                  <MousePointerClick className="h-4.5 w-4.5 text-blue-400" />
                                </div>
                              </div>
                              <p className="text-3xl font-bold tabular-nums text-blue-400">
                                {projectData.clicks.toLocaleString('fr-FR')}
                              </p>
                              {projectDataPrevious && (
                                <div className="mt-2 flex items-center gap-1">
                                  {clicksChange > 0 ? (
                                    <>
                                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                                      <span className="text-xs font-medium text-emerald-400">
                                        +{clicksChange.toFixed(1)}%
                                      </span>
                                    </>
                                  ) : clicksChange < 0 ? (
                                    <>
                                      <TrendingDown className="h-3 w-3 text-red-400" />
                                      <span className="text-xs font-medium text-red-400">
                                        {clicksChange.toFixed(1)}%
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Stable</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Impressions metric */}
                            <div className="group/stat relative overflow-hidden rounded-xl border-2 border-purple-500/20 bg-linear-to-br from-purple-500/10 via-purple-500/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl">
                              <div className="mb-3 flex items-center justify-between border-b border-purple-500/10 pb-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Impressions
                                </span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 ring-2 ring-purple-500/10">
                                  <Eye className="h-4.5 w-4.5 text-purple-400" />
                                </div>
                              </div>
                              <p className="text-3xl font-bold tabular-nums text-purple-400">
                                {projectData.impressions.toLocaleString('fr-FR')}
                              </p>
                              {projectDataPrevious && (
                                <div className="mt-2 flex items-center gap-1">
                                  {impressionsChange > 0 ? (
                                    <>
                                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                                      <span className="text-xs font-medium text-emerald-400">
                                        +{impressionsChange.toFixed(1)}%
                                      </span>
                                    </>
                                  ) : impressionsChange < 0 ? (
                                    <>
                                      <TrendingDown className="h-3 w-3 text-red-400" />
                                      <span className="text-xs font-medium text-red-400">
                                        {impressionsChange.toFixed(1)}%
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Stable</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* CTR metric */}
                            <div className="group/stat relative overflow-hidden rounded-xl border-2 border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:border-emerald-500/30 hover:shadow-xl">
                              <div className="mb-3 flex items-center justify-between border-b border-emerald-500/10 pb-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  CTR moyen
                                </span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 ring-2 ring-emerald-500/10">
                                  <Zap className="h-4.5 w-4.5 text-emerald-400" />
                                </div>
                              </div>
                              <p className="text-3xl font-bold tabular-nums text-emerald-400">
                                {(projectData.ctr * 100).toFixed(2)}%
                              </p>
                              <div className="mt-2">
                                <span className="text-xs font-semibold text-muted-foreground">
                                  {projectData.ctr >= 0.03 ? '✓ Bon CTR' : '⚠ À optimiser'}
                                </span>
                              </div>
                            </div>

                            {/* Position metric */}
                            <div className="group/stat relative overflow-hidden rounded-xl border-2 border-orange-500/20 bg-linear-to-br from-orange-500/10 via-orange-500/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:border-orange-500/30 hover:shadow-xl">
                              <div className="mb-3 flex items-center justify-between border-b border-orange-500/10 pb-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Position moy.
                                </span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/20 ring-2 ring-orange-500/10">
                                  <BarChart3 className="h-4.5 w-4.5 text-orange-400" />
                                </div>
                              </div>
                              <p className="text-3xl font-bold tabular-nums text-orange-400">
                                {projectData.position.toFixed(1)}
                              </p>
                              <div className="mt-2">
                                <span className="text-xs font-semibold text-muted-foreground">
                                  {projectData.position <= 10
                                    ? '✓ Top 10'
                                    : projectData.position <= 20
                                      ? '✓ Top 20'
                                      : '⚠ À améliorer'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Alerts section */}
                          {alerts.length > 0 && (
                            <div className="space-y-2 pt-2">
                              {alerts.map((alert, index) => (
                                <Alert
                                  key={index}
                                  variant={alert.type === 'error' ? 'destructive' : 'default'}
                                  className="border-white/5 bg-white/5 py-3"
                                >
                                  {alert.type === 'error' ? (
                                    <AlertTriangle className="h-4 w-4" />
                                  ) : alert.type === 'warning' ? (
                                    <TrendingDown className="h-4 w-4" />
                                  ) : (
                                    <Sparkles className="h-4 w-4" />
                                  )}
                                  <AlertTitle className="text-sm font-medium">{alert.title}</AlertTitle>
                                  <AlertDescription className="text-xs text-muted-foreground">
                                    {alert.description}
                                  </AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
                            <BarChart3 className="h-7 w-7 text-muted-foreground/50" />
                          </div>
                          <p className="font-medium text-foreground">Aucune donnée disponible</p>
                          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Vérifiez que ce site est correctement connecté à Google Search Console
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        ) : (
          <section className="py-16">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-linear-to-br from-primary/20 to-primary/5 shadow-2xl">
                      <Folder className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                </EmptyMedia>
                <EmptyTitle className="text-2xl font-bold">Bienvenue sur SerpEditor</EmptyTitle>
                <EmptyDescription className="max-w-md text-base">
                  Commencez par ajouter votre premier site web pour analyser ses performances SEO et suivre son
                  évolution dans les résultats de recherche Google.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <OpenModal />
              </EmptyContent>
            </Empty>
          </section>
        )}
      </div>
    </main>
  )
}

// 📁 app/dashboard/page.tsx
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
  BarChart3,
  CheckCircle2,
  EllipsisVertical,
  ExternalLink,
  Eye,
  Folder,
  Globe,
  MousePointerClick,
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
  // Use cached session for per-request deduplication
  const session = await getSession()
  const userId = session?.user?.id

  // Récupérer les projets
  const projects = await prisma.project.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Essayer de récupérer l'access token Google (peut échouer si Google n'est pas connecté)
  let accessToken = null
  try {
    accessToken = await auth.api.getAccessToken({
      body: {
        providerId: 'google',
        userId,
      },
      headers: await headers(),
    })
  } catch {
    // Si l'utilisateur n'a pas encore connecté Google, on continue sans access token
    // Les données GSC ne seront simplement pas disponibles
    console.log('Google account not connected, continuing without GSC data')
  }

  // ✅ Récupérer les données GSC pour tous les projets
  const projectsData = new Map()
  const projectsDataPrevious = new Map()

  if (accessToken && projects.length > 0) {
    const endDate = subDays(new Date(), 1)
    const startDate = subDays(new Date(), 31)
    const previousEndDate = subDays(new Date(), 32)
    const previousStartDate = subDays(new Date(), 62)

    await Promise.all(
      projects.map(async (project) => {
        // Données actuelles
        const currentData = await getProjectGSCData(project.url, accessToken.accessToken, startDate, endDate)
        if (currentData) {
          projectsData.set(project.id, currentData)
        }

        // Données précédentes (pour comparaison)
        const previousData = await getProjectGSCData(
          project.url,
          accessToken.accessToken,
          previousStartDate,
          previousEndDate,
        )
        if (previousData) {
          projectsDataPrevious.set(project.id, previousData)
        }
      }),
    )
  }

  const getCrawlStatusBadge = (status: string | null | undefined) => {
    if (!status) return null
    const statusConfig = {
      PENDING: { color: 'amber' as const, label: 'En attente' },
      READY: { color: 'green' as const, label: 'Prêt' },
      ERROR: { color: 'red' as const, label: 'Erreur' },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null
    return <Badge color={config.color}>{config.label}</Badge>
  }

  return (
    <main className="text-foreground min-h-screen">
      <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Tableau de bord SEO"
          description="Suivez vos performances, analysez vos concurrents et identifiez des opportunités de croissance en temps réel"
          actions={<OpenModal />}
        />

        {projects.length > 0 ? (
          <section className="space-y-6 pb-8">
            {projects.map((project) => {
              const projectData = projectsData.get(project.id)
              const projectDataPrevious = projectsDataPrevious.get(project.id)
              const alerts = getProjectAlerts(project, projectData, projectDataPrevious)

              // Calculer les changements
              let clicksChange = 0
              let impressionsChange = 0

              if (projectData && projectDataPrevious) {
                clicksChange =
                  projectDataPrevious.clicks > 0
                    ? ((projectData.clicks - projectDataPrevious.clicks) / projectDataPrevious.clicks) * 100
                    : 0
                impressionsChange =
                  projectDataPrevious.impressions > 0
                    ? ((projectData.impressions - projectDataPrevious.impressions) / projectDataPrevious.impressions) *
                      100
                    : 0
              }

              return (
                <Card key={project.id} className="group transition-all duration-200 hover:shadow-lg">
                  {/* Header du projet */}
                  <CardHeader className="border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                            <Globe className="text-primary h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold">
                              {project.url.replace(/^https?:\/\//, '')}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              <Link
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
                              >
                                {project.url}
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </CardDescription>
                          </div>
                        </div>
                        {project.crawl_status && (
                          <div className="flex items-center gap-2">
                            {getCrawlStatusBadge(project.crawl_status)}
                            {project.task_created_at && (
                              <span className="text-muted-foreground text-xs">
                                Créé le {format(new Date(project.task_created_at), 'dd/MM/yyyy')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <CardAction>
                        <Dropdown>
                          <DropdownButton plain aria-label="Plus d'options">
                            <EllipsisVertical size={16} />
                          </DropdownButton>
                          <DropdownMenu>
                            <DeleteProjectButton projectId={project.id} projectUrl={project.url} />
                          </DropdownMenu>
                        </Dropdown>
                      </CardAction>
                    </div>
                  </CardHeader>

                  {/* Métriques du projet */}
                  <CardContent className="space-y-6 pt-6">
                    {projectData ? (
                      <>
                        <div>
                          <div className="mb-4 flex items-center gap-2">
                            <Activity className="text-muted-foreground h-4 w-4" />
                            <p className="">Performances - 30 derniers jours</p>
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Clics */}
                            <div className="group/stat rounded-lg border bg-gradient-to-br from-blue-50/50 to-blue-100/30 p-4 transition-all hover:shadow-md dark:from-blue-950/20 dark:to-blue-900/10">
                              <div className="mb-2 flex items-center gap-2">
                                <div className="rounded-md bg-blue-500/10 p-1.5">
                                  <MousePointerClick className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="dashboard--sm font-medium">Clics</span>
                              </div>
                              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {projectData.clicks.toLocaleString('fr-FR')}
                              </p>
                              {projectDataPrevious && (
                                <p className="dashboard-body-sm mt-1 flex items-center gap-1">
                                  {clicksChange > 0 ? (
                                    <>
                                      <TrendingUp className="h-3 w-3 text-green-600" />
                                      <span className="text-green-600">+{clicksChange.toFixed(1)}%</span>
                                    </>
                                  ) : clicksChange < 0 ? (
                                    <>
                                      <TrendingDown className="h-3 w-3 text-red-600" />
                                      <span className="text-red-600">{clicksChange.toFixed(1)}%</span>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">→</span>
                                  )}
                                </p>
                              )}
                            </div>

                            {/* Impressions */}
                            <div className="group/stat rounded-lg border bg-gradient-to-br from-purple-50/50 to-purple-100/30 p-4 transition-all hover:shadow-md dark:from-purple-950/20 dark:to-purple-900/10">
                              <div className="mb-2 flex items-center gap-2">
                                <div className="rounded-md bg-purple-500/10 p-1.5">
                                  <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium">Impressions</span>
                              </div>
                              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {projectData.impressions.toLocaleString('fr-FR')}
                              </p>
                              {projectDataPrevious && (
                                <p className="dashboard-body-sm mt-1 flex items-center gap-1">
                                  {impressionsChange > 0 ? (
                                    <>
                                      <TrendingUp className="h-3 w-3 text-green-600" />
                                      <span className="text-green-600">+{impressionsChange.toFixed(1)}%</span>
                                    </>
                                  ) : impressionsChange < 0 ? (
                                    <>
                                      <TrendingDown className="h-3 w-3 text-red-600" />
                                      <span className="text-red-600">{impressionsChange.toFixed(1)}%</span>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">→</span>
                                  )}
                                </p>
                              )}
                            </div>

                            {/* CTR */}
                            <div className="group/stat rounded-lg border bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 p-4 transition-all hover:shadow-md dark:from-emerald-950/20 dark:to-emerald-900/10">
                              <div className="mb-2 flex items-center gap-2">
                                <div className="rounded-md bg-emerald-500/10 p-1.5">
                                  <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="font-medium">CTR moyen</span>
                              </div>
                              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {(projectData.ctr * 100).toFixed(2)}%
                              </p>
                            </div>

                            {/* Position */}
                            <div className="group/stat rounded-lg border bg-gradient-to-br from-orange-50/50 to-orange-100/30 p-4 transition-all hover:shadow-md dark:from-orange-950/20 dark:to-orange-900/10">
                              <div className="mb-2 flex items-center gap-2">
                                <div className="rounded-md bg-orange-500/10 p-1.5">
                                  <BarChart3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <span className="font-medium">Position</span>
                              </div>
                              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {projectData.position.toFixed(1)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Alertes du projet */}
                        {alerts.length > 0 && (
                          <div className="space-y-2">
                            {alerts.map((alert, index) => (
                              <Alert
                                key={index}
                                variant={alert.type === 'error' ? 'destructive' : 'default'}
                                className="py-3"
                              >
                                {alert.type === 'error' ? (
                                  <AlertTriangle className="h-4 w-4" />
                                ) : alert.type === 'warning' ? (
                                  <TrendingDown className="h-4 w-4" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4" />
                                )}
                                <AlertTitle className="text-sm">{alert.title}</AlertTitle>
                                <AlertDescription className="flex items-center justify-between text-xs">
                                  <span>{alert.description}</span>
                                </AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="rounded-lg border border-dashed p-8 text-center">
                        <BarChart3 className="text-muted-foreground/50 mx-auto h-12 w-12" />
                        <p className="dashboard-body-sm mt-4 font-medium">Aucune donnée disponible</p>
                        <p className="dashboard-body-sm mt-1">
                          Vérifiez que ce site est connecté à Google Search Console
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </section>
        ) : (
          <section className="py-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                    <Folder className="text-primary h-8 w-8" />
                  </div>
                </EmptyMedia>
                <EmptyTitle className="text-xl">Aucun projet</EmptyTitle>
                <EmptyDescription className="max-w-md">
                  Commencez par ajouter votre premier site web pour analyser ses performances SEO et suivre son
                  évolution dans les résultats de recherche.
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

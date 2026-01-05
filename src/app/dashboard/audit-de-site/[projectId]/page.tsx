// 📁 app/dashboard/audit-de-site/[projectId]/page.tsx
import { PageMetrics } from '@/components/audit/page-metrics'
import { SecurityChecks } from '@/components/audit/security-checks'
import { SEOIssues } from '@/components/audit/seo-issues'
import { SiteHealthScore } from '@/components/audit/site-health-score'
import { TechnicalInfo } from '@/components/audit/technical-info'
import { CrawlStatusChecker } from '@/components/crawl-status-checker'
import { Heading } from '@/components/dashboard/heading'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { AlertTriangle, CheckCircle2, Clock, Globe, XCircle } from 'lucide-react'
import { headers } from 'next/headers'
import { onPageSummary, onPageTask } from './action'

type OnPageSummaryData = {
 crawl_progress?: string
 crawl_status?: {
 max_crawl_pages?: number
 pages_in_queue?: number
 pages_crawled?: number
 }
 crawl_stop_reason?: string
 domain_info?: {
 name?: string
 cms?: string
 ip?: string
 server?: string
 crawl_start?: string
 crawl_end?: string
 extended_crawl_status?: string
 ssl_info?: {
 valid_certificate?: boolean
 certificate_issuer?: string
 certificate_subject?: string
 certificate_version?: string
 certificate_expiration_date?: string
 }
 checks?: {
 sitemap?: boolean
 robots_txt?: boolean
 ssl?: boolean
 http2?: boolean
 test_canonicalization?: boolean
 test_www_redirect?: boolean
 test_https_redirect?: boolean
 test_page_not_found?: boolean
 }
 total_pages?: number
 }
 page_metrics?: {
 links_external?: number
 links_internal?: number
 duplicate_title?: number
 duplicate_description?: number
 duplicate_content?: number
 broken_links?: number
 broken_resources?: number
 redirect_loop?: number
 onpage_score?: number
 non_indexable?: number
 checks?: {
 canonical?: number
 no_description?: number
 no_title?: number
 no_h1_tag?: number
 title_too_long?: number
 title_too_short?: number
 is_broken?: number
 is_4xx_code?: number
 is_5xx_code?: number
 is_redirect?: number
 no_image_alt?: number
 low_content_rate?: number
 high_loading_time?: number
 has_misspelling?: number
 irrelevant_title?: number
 irrelevant_description?: number
 [key: string]: number | undefined
 }
 }
 [key: string]: unknown
}

export default async function AuditDeSitePage({ params }: { params: { projectId: string } }) {
 const { projectId } = await params

 const session = await auth.api.getSession({
 headers: await headers(),
 })

 if (!session?.user?.id) {
 throw new Error('Non authentifié')
 }

 const project = await prisma.project.findUnique({
 where: { id: projectId },
 })

 if (!project) {
 throw new Error('Projet introuvable')
 }

 // Lancer crawl si nécessaire
 if (project.crawl_status !== 'PENDING' && project.crawl_status !== 'READY') {
 const taskResult = await onPageTask(project.url)
 if (!taskResult.success) {
 console.error('Erreur lors du lancement du crawl:', taskResult.error)
 }
 }

 let summaryData: OnPageSummaryData | null = null
 if (project.crawl_status === 'READY' && project.task_id) {
 const summaryResult = await onPageSummary(project.task_id)
 if (summaryResult.success) {
 summaryData = summaryResult.data as OnPageSummaryData
 }
 }

 // Calculer le statut global
 const onPageScore = summaryData?.page_metrics?.onpage_score ?? 0
 const criticalIssues =
 (summaryData?.page_metrics?.broken_links ?? 0) +
 (summaryData?.page_metrics?.broken_resources ?? 0) +
 (summaryData?.page_metrics?.checks?.is_broken ?? 0)

 const warnings =
 (summaryData?.page_metrics?.duplicate_title ?? 0) +
 (summaryData?.page_metrics?.duplicate_description ?? 0) +
 (summaryData?.page_metrics?.checks?.no_title ?? 0) +
 (summaryData?.page_metrics?.checks?.no_description ?? 0)

 return (
 <main className="min-h-screen text-foreground">
 <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
 {/* Header */}
 <div className="mb-6">
 <div className="flex items-center justify-between">
 <div>
 <div className="flex items-center gap-3">
 <Heading className="text-3xl font-bold">Audit de site</Heading>
 {summaryData && (
 <Badge
 variant={onPageScore >= 80 ? 'default' : onPageScore >= 60 ? 'secondary' : 'destructive'}
 className="text-base"
 >
 Score: {onPageScore.toFixed(0)}/100
 </Badge>
 )}
 </div>
 <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
 <div className="flex items-center gap-1.5">
 <Globe className="h-4 w-4" />
 {project.url.replace(/^https?:\/\//, '')}
 </div>
 {summaryData?.domain_info?.crawl_end && (
 <div className="flex items-center gap-1.5">
 <Clock className="h-4 w-4" />
 Analysé le{' '}
 {format(new Date(summaryData.domain_info.crawl_end), 'dd MMMM yyyy à HH:mm', { locale: fr })}
 </div>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* Status du crawl */}
 {project.crawl_status === 'PENDING' && project.task_id ? (
 <CrawlStatusChecker taskId={project.task_id} />
 ) : project.crawl_status === 'READY' && summaryData ? (
 <>
 {/* Vue d'ensemble rapide */}
 <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 {/* Score global */}
 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Santé du site</CardTitle>
 {onPageScore >= 80 ? (
 <CheckCircle2 className="h-4 w-4 text-green-600" />
 ) : onPageScore >= 60 ? (
 <AlertTriangle className="h-4 w-4 text-orange-600" />
 ) : (
 <XCircle className="h-4 w-4 text-red-600" />
 )}
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">{onPageScore.toFixed(0)}/100</div>
 <p className="text-muted-foreground text-xs">
 {onPageScore >= 80 ? 'Excellent' : onPageScore >= 60 ? 'Bon' : 'À améliorer'}
 </p>
 </CardContent>
 </Card>

 {/* Pages crawlées */}
 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Pages analysées</CardTitle>
 <Globe className="text-muted-foreground h-4 w-4" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">
 {summaryData.crawl_status?.pages_crawled?.toLocaleString('fr-FR') || 0}
 </div>
 <p className="text-muted-foreground text-xs">
 sur {summaryData.crawl_status?.max_crawl_pages?.toLocaleString('fr-FR') || 0} max
 </p>
 </CardContent>
 </Card>

 {/* Problèmes critiques */}
 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Problèmes critiques</CardTitle>
 <XCircle className={`h-4 w-4 ${criticalIssues > 0 ? 'text-red-600' : 'text-green-600'}`} />
 </CardHeader>
 <CardContent>
 <div className={`text-2xl font-bold ${criticalIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
 {criticalIssues}
 </div>
 <p className="text-muted-foreground text-xs">
 {criticalIssues === 0 ? 'Aucun problème' : 'À corriger immédiatement'}
 </p>
 </CardContent>
 </Card>

 {/* Avertissements */}
 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Avertissements</CardTitle>
 <AlertTriangle className={`h-4 w-4 ${warnings > 0 ? 'text-orange-600' : 'text-green-600'}`} />
 </CardHeader>
 <CardContent>
 <div className={`text-2xl font-bold ${warnings > 0 ? 'text-orange-600' : 'text-green-600'}`}>
 {warnings}
 </div>
 <p className="text-muted-foreground text-xs">
 {warnings === 0 ? 'Aucun avertissement' : 'À surveiller'}
 </p>
 </CardContent>
 </Card>
 </div>

 {/* Onglets détaillés */}
 <Tabs defaultValue="overview" className="space-y-6">
 <TabsList>
 <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
 <TabsTrigger value="technical">Technique</TabsTrigger>
 <TabsTrigger value="seo">SEO</TabsTrigger>
 <TabsTrigger value="security">Sécurité</TabsTrigger>
 <TabsTrigger value="performance">Performance</TabsTrigger>
 </TabsList>

 {/* Vue d'ensemble */}
 <TabsContent value="overview" className="space-y-6">
 <SiteHealthScore data={summaryData} />
 <PageMetrics data={summaryData} />
 </TabsContent>

 {/* Technique */}
 <TabsContent value="technical" className="space-y-6">
 <TechnicalInfo data={summaryData} />
 </TabsContent>

 {/* SEO */}
 <TabsContent value="seo" className="space-y-6">
 <SEOIssues data={summaryData} />
 </TabsContent>

 {/* Sécurité */}
 <TabsContent value="security" className="space-y-6">
 <SecurityChecks data={summaryData} />
 </TabsContent>

 {/* Performance */}
 <TabsContent value="performance" className="space-y-6">
 <Card>
 <CardHeader>
 <CardTitle>Performance</CardTitle>
 <CardDescription>Temps de chargement et optimisations</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {summaryData.page_metrics?.checks?.high_loading_time && (
 <div className="flex items-start gap-3">
 <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600" />
 <div>
 <p className="font-medium">Pages avec temps de chargement élevé</p>
 <p className="text-muted-foreground text-sm">
 {summaryData.page_metrics.checks.high_loading_time} pages mettent plus de 3 secondes à
 charger
 </p>
 </div>
 </div>
 )}
 </div>
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>
 </>
 ) : (
 <Card>
 <CardContent className="py-12 text-center">
 <p className="text-muted-foreground">Aucune donnée d&apos;audit disponible</p>
 </CardContent>
 </Card>
 )}
 </div>
 </main>
 )
}

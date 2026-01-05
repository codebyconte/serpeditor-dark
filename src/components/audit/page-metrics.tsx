// 📁 components/audit/page-metrics.tsx
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  AlertCircle,
  ArrowDownRight,
  Ban,
  Copy,
  ExternalLink,
  FileText,
  Link2,
  Link as LinkIcon,
} from 'lucide-react'

export function PageMetrics({ data }: { any }) {
  const pageMetrics = data?.page_metrics
  const crawlStatus = data?.crawl_status
  const totalPages = crawlStatus?.pages_crawled || 0

  if (!pageMetrics) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Aucune métrique de page disponible
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculer le pourcentage de pages avec problèmes
  const duplicatePages =
    (pageMetrics.duplicate_title || 0) +
    (pageMetrics.duplicate_description || 0) +
    (pageMetrics.duplicate_content || 0)

  const brokenPages =
    (pageMetrics.broken_links || 0) + (pageMetrics.broken_resources || 0)

  const healthPercentage =
    totalPages > 0
      ? Math.max(
          0,
          ((totalPages - duplicatePages - brokenPages) / totalPages) * 100,
        )
      : 0

  const metrics = [
    {
      title: 'Liens internes',
      value: pageMetrics.links_internal?.toLocaleString('fr-FR') || 0,
      icon: ArrowDownRight,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: "Liens pointant vers d'autres pages du site",
    },
    {
      title: 'Liens externes',
      value: pageMetrics.links_external?.toLocaleString('fr-FR') || 0,
      icon: ExternalLink,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: "Liens pointant vers d'autres sites",
    },
    {
      title: 'Pages non indexables',
      value: pageMetrics.non_indexable || 0,
      icon: Ban,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      description: 'Pages bloquées par robots.txt ou meta tags',
      warning: pageMetrics.non_indexable > 0,
    },
    {
      title: 'Boucles de redirection',
      value: pageMetrics.redirect_loop || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      description: 'Redirections circulaires détectées',
      critical: pageMetrics.redirect_loop > 0,
    },
  ]

  const duplicateMetrics = [
    {
      title: 'Titres dupliqués',
      value: pageMetrics.duplicate_title || 0,
      icon: Copy,
      severity: 'warning',
    },
    {
      title: 'Descriptions dupliquées',
      value: pageMetrics.duplicate_description || 0,
      icon: Copy,
      severity: 'warning',
    },
    {
      title: 'Contenu dupliqué',
      value: pageMetrics.duplicate_content || 0,
      icon: Copy,
      severity: 'warning',
    },
  ]

  const linkMetrics = [
    {
      title: 'Liens cassés',
      value: pageMetrics.broken_links || 0,
      severity: 'critical',
    },
    {
      title: 'Ressources cassées',
      value: pageMetrics.broken_resources || 0,
      severity: 'critical',
    },
    {
      title: 'Conflits de relation',
      value: pageMetrics.links_relation_conflict || 0,
      severity: 'info',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Santé globale des pages */}
      <Card>
        <CardHeader>
          <CardTitle>Santé globale des pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Pages saines</span>
              <span className="text-2xl font-bold">
                {healthPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={healthPercentage} className="h-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              {totalPages - duplicatePages - brokenPages} pages sur {totalPages}{' '}
              sans problème majeur
            </p>
          </div>

          {/* Statistiques rapides */}
          <div className="grid gap-4 pt-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Pages analysées</p>
                <p className="text-2xl font-bold">
                  {totalPages.toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total liens</p>
                <p className="text-2xl font-bold">
                  {(
                    (pageMetrics.links_internal || 0) +
                    (pageMetrics.links_external || 0)
                  ).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques détaillées */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={`flex flex-col gap-3 rounded-lg border p-4 ${
                  metric.critical
                    ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                    : metric.warning
                      ? 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950'
                      : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${metric.bgColor}`}>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  {(metric.critical || metric.warning) && (
                    <Badge
                      variant={metric.critical ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {metric.critical ? 'Critique' : 'Attention'}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm font-medium">{metric.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenu dupliqué */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contenu dupliqué</CardTitle>
            <Badge
              variant={duplicatePages > 0 ? 'secondary' : 'default'}
              className={duplicatePages > 0 ? '' : 'bg-green-600'}
            >
              {duplicatePages > 0
                ? `${duplicatePages} problèmes`
                : 'Aucun problème'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {duplicateMetrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <metric.icon
                    className={`h-5 w-5 ${
                      metric.value > 0 ? 'text-orange-600' : 'text-green-600'
                    }`}
                  />
                  <span className="font-medium">{metric.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold ${
                      metric.value > 0 ? 'text-orange-600' : 'text-green-600'
                    }`}
                  >
                    {metric.value}
                  </span>
                  {metric.value > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {((metric.value / totalPages) * 100).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {duplicatePages > 0 && (
            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                💡 Recommandation
              </p>
              <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                Le contenu dupliqué peut nuire au référencement. Assurez-vous
                que chaque page a un titre, une description et un contenu
                uniques.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Problèmes de liens */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Problèmes de liens</CardTitle>
            <Badge
              variant={brokenPages > 0 ? 'destructive' : 'default'}
              className={brokenPages > 0 ? '' : 'bg-green-600'}
            >
              {brokenPages > 0 ? `${brokenPages} problèmes` : 'Aucun problème'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {linkMetrics.map((metric, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  metric.value > 0 && metric.severity === 'critical'
                    ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Link2
                    className={`h-5 w-5 ${
                      metric.value > 0 && metric.severity === 'critical'
                        ? 'text-red-600'
                        : metric.value > 0
                          ? 'text-orange-600'
                          : 'text-green-600'
                    }`}
                  />
                  <span className="font-medium">{metric.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold ${
                      metric.value > 0 && metric.severity === 'critical'
                        ? 'text-red-600'
                        : metric.value > 0
                          ? 'text-orange-600'
                          : 'text-green-600'
                    }`}
                  >
                    {metric.value}
                  </span>
                  {metric.value > 0 && metric.severity === 'critical' && (
                    <Badge variant="destructive" className="text-xs">
                      Critique
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {brokenPages > 0 && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                ⚠️ Action requise
              </p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                Les liens et ressources cassés nuisent à l&apos;expérience
                utilisateur et au référencement. Corrigez-les dès que possible.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

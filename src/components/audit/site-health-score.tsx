// 📁 components/audit/site-health-score.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

export function SiteHealthScore({ data }: { any }) {
  const score = data?.page_metrics?.onpage_score ?? 0

  const issues = [
    {
      label: 'Liens cassés',
      value: data?.page_metrics?.broken_links ?? 0,
      severity: 'critical',
    },
    {
      label: 'Ressources cassées',
      value: data?.page_metrics?.broken_resources ?? 0,
      severity: 'critical',
    },
    {
      label: 'Titres dupliqués',
      value: data?.page_metrics?.duplicate_title ?? 0,
      severity: 'warning',
    },
    {
      label: 'Descriptions dupliquées',
      value: data?.page_metrics?.duplicate_description ?? 0,
      severity: 'warning',
    },
    {
      label: 'Contenu dupliqué',
      value: data?.page_metrics?.duplicate_content ?? 0,
      severity: 'warning',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score de santé du site</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score principal */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Score global</span>
            <span className="text-2xl font-bold">{score.toFixed(0)}/100</span>
          </div>
          <Progress value={score} className="h-3" />
          <p className="mt-2 text-xs text-muted-foreground">
            Ce score reflète la santé globale de votre site basée sur les bonnes
            pratiques SEO
          </p>
        </div>

        {/* Liste des problèmes */}
        <div className="space-y-3">
          <h4 className="font-medium">Détails des problèmes</h4>
          {issues.map((issue) => (
            <div
              key={issue.label}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                {issue.value === 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : issue.severity === 'critical' ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                )}
                <span className="text-sm">{issue.label}</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  issue.value === 0
                    ? 'text-green-600'
                    : issue.severity === 'critical'
                      ? 'text-red-600'
                      : 'text-orange-600'
                }`}
              >
                {issue.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// 📁 components/audit/security-checks.tsx
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Shield,
  XCircle,
} from 'lucide-react'

type OnPageSummaryData = {
  domain_info?: {
    ssl_info?: {
      valid_certificate?: boolean
      certificate_issuer?: string
      certificate_subject?: string
      certificate_version?: string
      certificate_expiration_date?: string
      certificate_hash?: string
    }
    checks?: {
      ssl?: boolean
      test_https_redirect?: boolean
      [key: string]: boolean | undefined
    }
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
      https_to_http_links?: number
      [key: string]: number | undefined
    }
  }
  [key: string]: unknown
}

export function SecurityChecks({ data }: { data: OnPageSummaryData | null | undefined }) {
  const domainInfo = data?.domain_info
  const sslInfo = domainInfo?.ssl_info
  const checks = domainInfo?.checks
  const pageChecks = data?.page_metrics?.checks

  // Calculer le score de sécurité
  const securityScore = [
    sslInfo?.valid_certificate,
    checks?.ssl,
    checks?.test_https_redirect,
    !pageChecks?.https_to_http_links,
  ].filter(Boolean).length

  const maxScore = 4
  const scorePercentage = (securityScore / maxScore) * 100

  const securityItems = [
    {
      title: 'Certificat SSL valide',
      status: sslInfo?.valid_certificate,
      severity: 'critical',
      description: 'Le site possède un certificat SSL valide et non expiré',
      details: sslInfo?.valid_certificate
        ? `Émis par ${sslInfo.certificate_issuer}`
        : 'Aucun certificat SSL valide détecté',
    },
    {
      title: 'HTTPS activé',
      status: checks?.ssl,
      severity: 'critical',
      description: 'Le site utilise le protocole HTTPS sécurisé',
      details: checks?.ssl
        ? 'Le site est accessible via HTTPS'
        : "Le site n'utilise pas HTTPS",
    },
    {
      title: 'Redirection HTTP vers HTTPS',
      status: checks?.test_https_redirect,
      severity: 'critical',
      description:
        'Les requêtes HTTP sont automatiquement redirigées vers HTTPS',
      details: checks?.test_https_redirect
        ? 'Redirection HTTP → HTTPS active'
        : 'Pas de redirection automatique vers HTTPS',
    },
    {
      title: 'Liens mixtes (HTTP dans HTTPS)',
      status:
        !pageChecks?.https_to_http_links ||
        pageChecks.https_to_http_links === 0,
      severity: 'warning',
      description: 'Aucun lien HTTP non sécurisé dans les pages HTTPS',
      details: pageChecks?.https_to_http_links
        ? `${pageChecks.https_to_http_links} pages contiennent des liens HTTP non sécurisés`
        : 'Aucun lien mixte détecté',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Score de sécurité global */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Score de sécurité</CardTitle>
            <Badge
              color={
                scorePercentage === 100
                  ? 'green'
                  : scorePercentage >= 75
                    ? 'orange'
                    : 'red'
              }
              className="text-base"
            >
              {securityScore}/{maxScore}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barre de progression */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sécurité globale</span>
                <span className="font-medium">
                  {scorePercentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all ${
                    scorePercentage === 100
                      ? 'bg-green-600'
                      : scorePercentage >= 75
                        ? 'bg-orange-600'
                        : 'bg-red-600'
                  }`}
                  style={{ width: `${scorePercentage}%` }}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {scorePercentage === 100
                ? '✅ Excellente sécurité ! Tous les critères sont remplis.'
                : scorePercentage >= 75
                  ? '⚠️ Bonne sécurité, mais quelques améliorations sont possibles.'
                  : '❌ Sécurité insuffisante. Des actions immédiates sont recommandées.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Détails SSL */}
      {sslInfo && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Certificat SSL/TLS</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Statut */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Statut</span>
                  {sslInfo.valid_certificate ? (
                    <Badge className="bg-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Valide
                    </Badge>
                  ) : (
                    <Badge color="red">
                      <XCircle className="mr-1 h-3 w-3" />
                      Invalide
                    </Badge>
                  )}
                </div>
              </div>

              {/* Version */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Version</span>
                <p className="text-sm text-muted-foreground">
                  {sslInfo.certificate_version || 'N/A'}
                </p>
              </div>

              {/* Émetteur */}
              <div className="space-y-2">
                <span className="text-sm font-medium">
                  Autorité de certification
                </span>
                <p className="text-sm text-muted-foreground">
                  {sslInfo.certificate_issuer || 'N/A'}
                </p>
              </div>

              {/* Sujet */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Sujet</span>
                <p className="text-sm text-muted-foreground">
                  {sslInfo.certificate_subject || 'N/A'}
                </p>
              </div>

              {/* Date d'expiration */}
              <div className="space-y-2">
                <span className="text-sm font-medium">
                  Date d&apos;expiration
                </span>
                <p className="text-sm text-muted-foreground">
                  {sslInfo.certificate_expiration_date
                    ? format(
                        new Date(sslInfo.certificate_expiration_date),
                        'dd MMMM yyyy à HH:mm',
                        { locale: fr },
                      )
                    : 'N/A'}
                </p>
              </div>

              {/* Hash */}
              <div className="space-y-2">
                <span className="text-sm font-medium">
                  Algorithme de hachage
                </span>
                <p className="font-mono text-sm text-muted-foreground">
                  {sslInfo.certificate_hash || 'N/A'}
                </p>
              </div>
            </div>

            {/* Avertissement si expire bientôt */}
            {sslInfo.certificate_expiration_date &&
              (() => {
                const daysUntilExpiry = Math.floor(
                  (new Date(sslInfo.certificate_expiration_date).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                )

                if (daysUntilExpiry < 30) {
                  return (
                    <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          Certificat expire bientôt
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          Votre certificat SSL expire dans {daysUntilExpiry}{' '}
                          jour
                          {daysUntilExpiry > 1 ? 's' : ''}. Pensez à le
                          renouveler.
                        </p>
                      </div>
                    </div>
                  )
                }
                return null
              })()}
          </CardContent>
        </Card>
      )}

      {/* Critères de sécurité */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Critères de sécurité</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityItems.map((item, index) => (
              <div
                key={index}
                className={`flex gap-4 rounded-lg border p-4 ${
                  item.status
                    ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                    : item.severity === 'critical'
                      ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                      : 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950'
                }`}
              >
                {/* Icône */}
                <div className="shrink-0">
                  {item.status ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : item.severity === 'critical' ? (
                    <XCircle className="h-6 w-6 text-red-600" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`font-medium ${
                        item.status
                          ? 'text-green-900 dark:text-green-100'
                          : item.severity === 'critical'
                            ? 'text-red-900 dark:text-red-100'
                            : 'text-orange-900 dark:text-orange-100'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <Badge
                      color={item.status ? 'green' : item.severity === 'critical' ? 'red' : 'orange'}
                      className={
                        item.status
                          ? 'bg-green-600'
                          : item.severity === 'critical'
                            ? 'border-red-600 text-red-600'
                            : 'border-orange-600 text-orange-600'
                      }
                    >
                      {item.status ? 'OK' : 'À corriger'}
                    </Badge>
                  </div>
                  <p
                    className={`text-sm ${
                      item.status
                        ? 'text-green-700 dark:text-green-300'
                        : item.severity === 'critical'
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-orange-700 dark:text-orange-300'
                    }`}
                  >
                    {item.description}
                  </p>
                  <p
                    className={`text-xs ${
                      item.status
                        ? 'text-green-600 dark:text-green-400'
                        : item.severity === 'critical'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-orange-600 dark:text-orange-400'
                    }`}
                  >
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      {securityScore < maxScore && (
        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {!sslInfo?.valid_certificate && (
                <li className="flex gap-3">
                  <span className="text-red-600">•</span>
                  <span className="text-sm">
                    <strong>Installez un certificat SSL valide</strong> pour
                    sécuriser les données de vos visiteurs. Utilisez Let&apos;s
                    Encrypt (gratuit) ou un fournisseur commercial.
                  </span>
                </li>
              )}
              {!checks?.ssl && (
                <li className="flex gap-3">
                  <span className="text-red-600">•</span>
                  <span className="text-sm">
                    <strong>Activez HTTPS</strong> sur votre serveur pour
                    chiffrer les communications.
                  </span>
                </li>
              )}
              {!checks?.test_https_redirect && (
                <li className="flex gap-3">
                  <span className="text-red-600">•</span>
                  <span className="text-sm">
                    <strong>Configurez une redirection HTTP vers HTTPS</strong>{' '}
                    pour forcer l&apos;utilisation du protocole sécurisé.
                  </span>
                </li>
              )}
              {(pageChecks?.https_to_http_links || 0) > 0 && (
                <li className="flex gap-3">
                  <span className="text-orange-600">•</span>
                  <span className="text-sm">
                    <strong>Corrigez les liens mixtes</strong> : remplacez les
                    liens HTTP par des liens HTTPS dans vos pages sécurisées.
                  </span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

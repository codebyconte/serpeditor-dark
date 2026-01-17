import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Globe,
  Link2,
  Lock,
  Server,
  Shield,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react'

interface OnPageSummaryData {
  crawl_progress?: string
  crawl_status?: {
    max_crawl_pages?: number
    pages_in_queue?: number
    pages_crawled?: number
  }
  domain_info?: {
    name?: string
    cms?: string
    ip?: string
    server?: string
    crawl_start?: string
    crawl_end?: string | null
    ssl_info?: {
      valid_certificate?: boolean
      certificate_issuer?: string
      certificate_subject?: string
      certificate_expiration_date?: string
      certificate_hash?: string
    }
    checks?: {
      sitemap?: boolean
      robots_txt?: boolean
      ssl?: boolean
      http2?: boolean
      [key: string]: boolean | undefined
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
    checks?: Record<string, number>
  }
}

const seoTranslations: Record<string, string> = {
  // Canonical
  canonical: 'Canonique',
  recursive_canonical: 'Canonical récursif',
  canonical_chain: 'Chaîne de canonical',
  canonical_to_broken: 'Canonical vers page cassée',
  canonical_to_redirect: 'Canonical vers redirection',

  // Meta tags
  duplicate_meta_tags: 'Balises meta dupliquées',
  irrelevant_meta_keywords: 'Mots-clés meta non pertinents',
  no_encoding_meta_tag: 'Balise meta encoding manquante',
  meta_charset_consistency: 'Cohérence du charset meta',

  // HTTPS
  is_https: 'HTTPS activé',
  is_http: 'HTTP (non sécurisé)',
  https_to_http_links: 'Liens HTTPS vers HTTP',
  test_https_redirect: 'Redirection HTTPS',

  // Content
  low_content_rate: 'Faible taux de contenu',
  high_content_rate: 'Taux de contenu élevé',
  low_character_count: 'Faible nombre de caractères',
  high_character_count: 'Nombre de caractères élevé',
  low_readability_rate: 'Faible lisibilité',
  no_content_encoding: 'Encodage de contenu manquant',

  // Images
  no_image_alt: 'Attribut alt manquant',
  no_image_title: "Titre d'image manquant",

  // URLs
  seo_friendly_url: 'URL optimisée SEO',
  seo_friendly_url_characters_check: "Vérification des caractères d'URL",
  seo_friendly_url_dynamic_check: "Vérification d'URL dynamique",
  seo_friendly_url_keywords_check: "Mots-clés dans l'URL",
  seo_friendly_url_relative_length_check: "Longueur relative d'URL",

  // Structure
  no_title: 'Titre manquant',
  title_too_long: 'Titre trop long',
  title_too_short: 'Titre trop court',
  duplicate_title_tag: 'Balise title dupliquée',
  irrelevant_title: 'Titre non pertinent',
  no_description: 'Description manquante',
  irrelevant_description: 'Description non pertinente',
  no_h1_tag: 'Balise H1 manquante',
  no_favicon: 'Favicon manquant',
  no_doctype: 'Doctype manquant',
  has_html_doctype: 'Doctype HTML présent',

  // Pages
  large_page_size: 'Taille de page importante',
  small_page_size: 'Petite taille de page',
  size_greater_than_3mb: 'Taille supérieure à 3MB',

  // Performance
  high_waiting_time: "Temps d'attente élevé",
  high_loading_time: 'Temps de chargement élevé',
  has_render_blocking_resources: 'Ressources bloquant le rendu',

  // Redirects
  is_redirect: 'Redirection',
  redirect_chain: 'Chaîne de redirections',
  has_meta_refresh_redirect: 'Redirection meta refresh',

  // Errors
  is_broken: 'Page cassée',
  is_4xx_code: 'Erreur 4xx',
  is_5xx_code: 'Erreur 5xx',

  // Links
  has_links_to_redirects: 'Liens vers des redirections',
  is_orphan_page: 'Page orpheline',
  is_link_relation_conflict: 'Conflit de relation de lien',

  // Other
  frame: 'Frames',
  flash: 'Flash',
  lorem_ipsum: 'Lorem ipsum',
  has_misspelling: "Fautes d'orthographe",
  deprecated_html_tags: 'Balises HTML obsolètes',
  is_www: 'WWW',
}

const getTranslation = (key: string): string => {
  return seoTranslations[key] || key.replace(/_/g, ' ')
}

interface SEODashboardProps {
  data: OnPageSummaryData | null | undefined
}

export function SEODashboard({ data }: SEODashboardProps) {
  // ✅ Vérification que data existe
  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Aucune donnée d’analyse disponible
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                L&apos;analyse n&apos;a pas encore été effectuée ou les données
                ne sont pas disponibles.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const domain_info = data.domain_info || {}
  const page_metrics = data.page_metrics || {}
  const crawl_status = data.crawl_status || {}
  const crawl_progress = data.crawl_progress || 'unknown'

  // ✅ Valeurs par défaut sécurisées
  const pagesCrawled = crawl_status.pages_crawled || 0
  const pagesInQueue = crawl_status.pages_in_queue || 0
  const maxCrawlPages = crawl_status.max_crawl_pages || 100
  const onpageScore = page_metrics.onpage_score || 0

  // Calculer le pourcentage de progression
  const crawlPercentage =
    maxCrawlPages > 0 ? (pagesCrawled / maxCrawlPages) * 100 : 0

  // Déterminer le niveau de santé SEO
  const getHealthLevel = (score: number) => {
    if (score >= 90)
      return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' }
    if (score >= 70)
      return { label: 'Bon', color: 'text-blue-600', bg: 'bg-blue-50' }
    if (score >= 50)
      return { label: 'Moyen', color: 'text-orange-600', bg: 'bg-orange-50' }
    return { label: 'À améliorer', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const healthLevel = getHealthLevel(onpageScore)

  // Problèmes critiques
  const criticalIssues = [
    {
      key: 'broken_links',
      label: 'Liens cassés',
      value: page_metrics.broken_links || 0,
    },
    {
      key: 'broken_resources',
      label: 'Ressources cassées',
      value: page_metrics.broken_resources || 0,
    },
    {
      key: 'redirect_loop',
      label: 'Boucles de redirection',
      value: page_metrics.redirect_loop || 0,
    },
  ].filter((issue) => issue.value > 0)

  // Avertissements
  const warnings = [
    {
      key: 'duplicate_title',
      label: 'Titres dupliqués',
      value: page_metrics.duplicate_title || 0,
    },
    {
      key: 'duplicate_description',
      label: 'Descriptions dupliquées',
      value: page_metrics.duplicate_description || 0,
    },
    {
      key: 'duplicate_content',
      label: 'Contenu dupliqué',
      value: page_metrics.duplicate_content || 0,
    },
    {
      key: 'non_indexable',
      label: 'Pages non indexables',
      value: page_metrics.non_indexable || 0,
    },
  ].filter((warning) => warning.value > 0)

  // Checks principaux
  const topChecks = page_metrics.checks
    ? Object.entries(page_metrics.checks)
        .filter(([, value]) => value > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
    : []

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Globe className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {domain_info.name || 'Analyse de votre site'}
            </h1>
            <p className="text-muted-foreground">
              {' '}
              Rapport SEO détaillé : performances, structure et optimisations
              recommandées.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Score Global + Statut Crawl */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Score OnPage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Score global SEO
            </CardTitle>
            <CardDescription>
              Indicateur de performance basé sur l’analyse technique, le contenu
              et la structure du site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Cercle de progression */}
              <div className="relative h-32 w-32 flex-shrink-0">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - onpageScore / 100)}`}
                    className={
                      onpageScore >= 90
                        ? 'text-green-500'
                        : onpageScore >= 70
                          ? 'text-blue-500'
                          : onpageScore >= 50
                            ? 'text-orange-500'
                            : 'text-red-500'
                    }
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {onpageScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Détails */}
              <div className="space-y-2">
                <div
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${healthLevel.bg} ${healthLevel.color}`}
                >
                  {healthLevel.label}
                </div>
                <p className="text-sm text-muted-foreground">
                  {criticalIssues.length === 0
                    ? 'Aucun problème majeur détecté – votre site est bien optimisé.'
                    : `${criticalIssues.length} élément${criticalIssues.length > 1 ? 's' : ''} critique${criticalIssues.length > 1 ? 's' : ''} à corriger pour améliorer vos performances.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statut du Crawl */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Progression de l’analyse
            </CardTitle>
            <CardDescription>
              {crawl_progress === 'in_progress'
                ? 'Votre site est en cours d’analyse. Les données seront affichées dès qu’elles seront prêtes.'
                : 'Analyse terminée. Consultez vos résultats ci-dessous.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pages analysées
                  </p>
                  <p className="text-2xl font-bold">{pagesCrawled}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pages en attente
                  </p>
                  <p className="text-2xl font-bold">{pagesInQueue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Limite d’analyse
                  </p>
                  <p className="text-2xl font-bold">{maxCrawlPages}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progression</span>
                  <span className="font-medium">
                    {crawlPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={crawlPercentage} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Liens Internes
            </CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {page_metrics.links_internal || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Analyse du maillage interne et de la structure de navigation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Liens Externes
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {page_metrics.links_external || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Répartition des liens sortants vers d’autres domaines.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liens Cassés</CardTitle>
            <XCircle
              className={`h-4 w-4 ${(page_metrics.broken_links || 0) > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${(page_metrics.broken_links || 0) > 0 ? 'text-red-500' : ''}`}
            >
              {page_metrics.broken_links || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {(page_metrics.broken_links || 0) === 0
                ? 'Aucun lien défectueux détecté.'
                : 'Corrigez ces liens pour une meilleure expérience utilisateur et un SEO plus propre.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contenu Dupliqué
            </CardTitle>
            <FileText
              className={`h-4 w-4 ${(page_metrics.duplicate_content || 0) > 0 ? 'text-orange-500' : 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${(page_metrics.duplicate_content || 0) > 0 ? 'text-orange-500' : ''}`}
            >
              {page_metrics.duplicate_content || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pages présentant un contenu similaire détectées lors de l’analyse.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Problèmes Détectés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Problèmes SEO identifiés
          </CardTitle>
          <CardDescription>
            Liste des éléments critiques et des avertissements détectés sur
            votre site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Critiques */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-600">
                <XCircle className="h-4 w-4" />
                Problèmes critiques ({criticalIssues.length})
              </h3>
              <div className="space-y-2">
                {criticalIssues.length > 0 ? (
                  criticalIssues.map((issue) => (
                    <div
                      key={issue.key}
                      className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
                    >
                      <span className="text-sm">{issue.label}</span>
                      <Badge color="red">{issue.value}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <p className="flex items-center gap-2 text-sm text-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      Aucun problème critique – votre base technique est solide.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Avertissements */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                Points à surveiller ({warnings.length})
              </h3>
              <div className="space-y-2">
                {warnings.length > 0 ? (
                  warnings.map((warning) => (
                    <div
                      key={warning.key}
                      className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-3"
                    >
                      <span className="text-sm">{warning.label}</span>
                      <Badge color="orange">{warning.value}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <p className="flex items-center gap-2 text-sm text-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      Aucun avertissement majeur – bon équilibre global.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations Techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Détails techniques du site
          </CardTitle>
          <CardDescription>
            Informations sur l’hébergement, le CMS et les technologies
            détectées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Serveur
              </p>
              <p className="flex items-center gap-2 text-base font-medium">
                <Server className="h-4 w-4" />
                {domain_info.server || 'Non détecté'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Adresse IP
              </p>
              <p className="flex items-center gap-2 text-base font-medium">
                <Globe className="h-4 w-4" />
                {domain_info.ip || 'Non détecté'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                CMS Détecté
              </p>
              <p className="text-base font-medium">
                {domain_info.cms ? (
                  <span className="line-clamp-1">{domain_info.cms}</span>
                ) : (
                  <span className="text-muted-foreground">Non détecté</span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Pages Totales
              </p>
              <p className="flex items-center gap-2 text-base font-medium">
                <FileText className="h-4 w-4" />
                {domain_info.total_pages || 0}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">SSL</p>
              <div className="flex items-center gap-2">
                {domain_info.ssl_info?.valid_certificate ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-base font-medium text-green-600">
                      Valide
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-base font-medium text-red-600">
                      Invalide
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                HTTP/2
              </p>
              <div className="flex items-center gap-2">
                {domain_info.checks?.http2 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-base font-medium">Activé</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-base font-medium">Désactivé</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificat SSL */}
      {domain_info.ssl_info && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Certificat SSL & Sécurité
            </CardTitle>
            <CardDescription>
              Statut du certificat et informations sur le chiffrement du site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Émetteur
                </p>
                <p className="text-sm">
                  {domain_info.ssl_info.certificate_issuer || 'N/A'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Sujet
                </p>
                <p className="text-sm">
                  {domain_info.ssl_info.certificate_subject || 'N/A'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Date d&apos;expiration
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  {domain_info.ssl_info.certificate_expiration_date
                    ? new Date(
                        domain_info.ssl_info.certificate_expiration_date,
                      ).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Algorithme de hachage
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  {domain_info.ssl_info.certificate_hash || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vérifications Principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Principales vérifications SEO
          </CardTitle>
          <CardDescription>
            Aperçu des facteurs techniques les plus surveillés pendant
            l’analyse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {topChecks.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
              >
                <span className="text-sm capitalize">
                  {getTranslation(key)}
                </span>
                <Badge color="indigo">{value}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Éléments essentiels de configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">
                Plan du site (Sitemap)
              </span>
              {domain_info.checks?.sitemap ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">Fichier robots.txt</span>
              {domain_info.checks?.robots_txt ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">Sécurisation HTTPS</span>
              {domain_info.checks?.ssl ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

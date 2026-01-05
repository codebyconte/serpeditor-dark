// 📁 components/backlinks/backlinks-content.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Globe,
  HelpCircle,
  Link2,
  Loader2,
  MapPin,
  Search,
  Server,
  Shield,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { startTransition, useActionState, useState } from 'react'
import { fetchBacklinksSummary, type BacklinksSummaryState } from './action'

export function BacklinksContent() {
  const initialBacklinksState: BacklinksSummaryState = {
    success: false,
  }

  const [backlinksState, backlinksFormAction, isBacklinksPending] =
    useActionState(fetchBacklinksSummary, initialBacklinksState)

  const [customUrl, setCustomUrl] = useState('')

  const backlinksData = backlinksState?.result

  // Calculer les métriques
  const dofollowBacklinks =
    backlinksData && backlinksData.backlinks > 0
      ? backlinksData.backlinks - backlinksData.referring_pages_nofollow
      : 0
  const dofollowPercentage =
    backlinksData && backlinksData.backlinks > 0
      ? (dofollowBacklinks / backlinksData.backlinks) * 100
      : 0
  const healthScore =
    backlinksData && backlinksData.backlinks > 0
      ? Math.max(
          0,
          100 -
            backlinksData.info.target_spam_score -
            (backlinksData.broken_backlinks / backlinksData.backlinks) * 100,
        )
      : 0

  // Top TLDs
  const topTLDs = backlinksData?.referring_links_tld
    ? Object.entries(backlinksData.referring_links_tld)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
    : []

  // Top pays
  const topCountries = backlinksData?.referring_links_countries
    ? Object.entries(backlinksData.referring_links_countries)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
    : []

  const handleAnalyzeCustomUrl = () => {
    if (!customUrl.trim()) {
      return
    }

    const formData = new FormData()
    formData.append('customUrl', customUrl.trim())
    formData.append('include_subdomains', 'true')
    formData.append('include_indirect_links', 'true')
    formData.append('exclude_internal_backlinks', 'true')
    formData.append('internal_list_limit', '10')
    formData.append('backlinks_status_type', 'live')
    formData.append('rank_scale', 'one_thousand')
    startTransition(() => {
      backlinksFormAction(formData)
    })
  }

  // Fonction pour obtenir le nom du pays
  const getCountryName = (code: string) => {
    const countries: Record<string, string> = {
      FR: 'France',
      US: 'États-Unis',
      GB: 'Royaume-Uni',
      DE: 'Allemagne',
      ES: 'Espagne',
      IT: 'Italie',
      CA: 'Canada',
      BE: 'Belgique',
      CH: 'Suisse',
      NL: 'Pays-Bas',
    }
    return countries[code] || code
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header amélioré */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Profil de backlinks</h1>
                  <p className="text-sm text-muted-foreground">
                    Analyse complète des liens entrants
                  </p>
                </div>
              </div>

              {/* Champ URL personnalisée */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Entrez une URL (ex: example.com)"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAnalyzeCustomUrl()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAnalyzeCustomUrl}
                    disabled={!customUrl.trim() || isBacklinksPending}
                  >
                    {isBacklinksPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyse...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Analyser
                      </>
                    )}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Entrez l&apos;URL du site que vous souhaitez analyser pour les
                  backlinks
                </p>
              </div>

              {backlinksData && (
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">{backlinksData.target}</span>
                  </div>
                  {backlinksData.first_seen && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Première détection :{' '}
                        {format(
                          new Date(backlinksData.first_seen),
                          'dd MMM yyyy',
                          {
                            locale: fr,
                          },
                        )}
                      </span>
                    </div>
                  )}
                  {backlinksData.crawled_pages && (
                    <Badge variant="outline">
                      {backlinksData.crawled_pages.toLocaleString('fr-FR')}{' '}
                      pages analysées
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message d'erreur amélioré */}
        {backlinksState?.error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">
                    Erreur lors du chargement
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {backlinksState.error}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* État de chargement amélioré */}
        {isBacklinksPending && !backlinksData && (
          <Card className="mb-6">
            <CardContent className="py-16 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-medium">
                Analyse des backlinks en cours...
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Cette opération peut prendre quelques secondes
              </p>
            </CardContent>
          </Card>
        )}

        {/* État vide amélioré */}
        {!isBacklinksPending && !backlinksData && !backlinksState?.error && (
          <Card className="mb-6">
            <CardContent className="py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Link2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium">Aucune donnée disponible</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Entrez une URL ci-dessus pour analyser les backlinks
              </p>
            </CardContent>
          </Card>
        )}

        {/* Métriques principales améliorées */}
        {backlinksData && (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total backlinks */}
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total backlinks
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Nombre total de liens pointant vers votre site
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {backlinksData.backlinks.toLocaleString('fr-FR')}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress
                      value={dofollowPercentage}
                      className="h-2 flex-1"
                    />
                    <span className="text-xs text-muted-foreground">
                      {dofollowPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {dofollowBacklinks.toLocaleString('fr-FR')} dofollow •{' '}
                    {backlinksData.referring_pages_nofollow.toLocaleString(
                      'fr-FR',
                    )}{' '}
                    nofollow
                  </p>
                </CardContent>
              </Card>

              {/* Domaines référents */}
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Domaines référents
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Nombre de domaines uniques avec au moins un lien vers
                        votre site
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {backlinksData.referring_domains.toLocaleString('fr-FR')}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">
                        Domaines principaux
                      </p>
                      <p className="font-semibold">
                        {backlinksData.referring_main_domains.toLocaleString(
                          'fr-FR',
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">IPs uniques</p>
                      <p className="font-semibold">
                        {backlinksData.referring_ips.toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Domain Rank */}
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Domain Rank
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Score d'autorité du domaine sur une échelle de 0 à 100
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {backlinksData.rank}
                    </span>
                    <span className="text-lg text-muted-foreground">/100</span>
                  </div>
                  <Progress value={backlinksData.rank} className="mt-3 h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {backlinksData.rank >= 70
                      ? '🚀 Excellent'
                      : backlinksData.rank >= 40
                        ? '✅ Bon'
                        : '⚡ À améliorer'}
                  </p>
                </CardContent>
              </Card>

              {/* Spam Score */}
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Spam Score
                  </CardTitle>
                  <Shield
                    className={`h-4 w-4 ${
                      backlinksData.info.target_spam_score < 30
                        ? 'text-green-600'
                        : backlinksData.info.target_spam_score < 60
                          ? 'text-orange-600'
                          : 'text-red-600'
                    }`}
                  />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-3xl font-bold ${
                      backlinksData.info.target_spam_score < 30
                        ? 'text-green-600'
                        : backlinksData.info.target_spam_score < 60
                          ? 'text-orange-600'
                          : 'text-red-600'
                    }`}
                  >
                    {backlinksData.info.target_spam_score}
                    <span className="text-lg">/100</span>
                  </div>
                  <Progress
                    value={backlinksData.info.target_spam_score}
                    className="mt-3 h-2"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {backlinksData.info.target_spam_score < 30
                      ? '✅ Faible risque'
                      : backlinksData.info.target_spam_score < 60
                        ? '⚠️ Risque modéré'
                        : '❌ Risque élevé'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alertes importantes */}
            {(backlinksData.broken_backlinks > 0 ||
              backlinksData.info.target_spam_score > 40) && (
              <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-orange-900 dark:text-orange-100">
                      Actions recommandées
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {backlinksData.broken_backlinks > 0 && (
                    <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <p>
                        <strong>
                          {backlinksData.broken_backlinks} backlinks cassés
                        </strong>{' '}
                        détectés. Corrigez-les ou créez des redirections 301
                        pour préserver le jus SEO.
                      </p>
                    </div>
                  )}
                  {backlinksData.broken_pages > 0 && (
                    <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <p>
                        <strong>
                          {backlinksData.broken_pages} pages cassées
                        </strong>{' '}
                        sur votre site. Réparez-les rapidement pour éviter de
                        perdre des visiteurs.
                      </p>
                    </div>
                  )}
                  {backlinksData.info.target_spam_score > 40 && (
                    <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                      <Shield className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <p>
                        Votre <strong>spam score est élevé</strong> (
                        {backlinksData.info.target_spam_score}/100). Analysez
                        vos backlinks et désavouez les liens toxiques via Google
                        Search Console.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Onglets améliorés */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-5">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="domains">Domaines</TabsTrigger>
                <TabsTrigger value="links">Types de liens</TabsTrigger>
                <TabsTrigger value="geo">Géographie</TabsTrigger>
                <TabsTrigger value="health">Santé</TabsTrigger>
              </TabsList>

              {/* Vue d'ensemble */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Score de santé */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Score de santé du profil</CardTitle>
                      <CardDescription>
                        Évaluation globale basée sur la qualité des backlinks
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Score global
                          </span>
                          <span className="text-3xl font-bold">
                            {healthScore.toFixed(0)}
                            <span className="text-lg text-muted-foreground">
                              /100
                            </span>
                          </span>
                        </div>
                        <Progress value={healthScore} className="h-3" />
                        <p className="mt-2 text-xs text-muted-foreground">
                          {healthScore >= 80
                            ? '✅ Excellent profil de backlinks'
                            : healthScore >= 60
                              ? '⚡ Bon profil avec des améliorations possibles'
                              : '⚠️ Profil nécessitant des optimisations'}
                        </p>
                      </div>

                      <div className="space-y-3 border-t pt-4">
                        <h4 className="font-medium">Indicateurs clés</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm">
                              <CheckCircle2
                                className={`h-4 w-4 ${
                                  backlinksData.broken_backlinks === 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              />
                              Backlinks cassés
                            </span>
                            <Badge
                              variant={
                                backlinksData.broken_backlinks === 0
                                  ? 'default'
                                  : 'destructive'
                              }
                              className={
                                backlinksData.broken_backlinks === 0
                                  ? 'bg-green-600'
                                  : ''
                              }
                            >
                              {backlinksData.broken_backlinks}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm">
                              <CheckCircle2
                                className={`h-4 w-4 ${
                                  backlinksData.broken_pages === 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              />
                              Pages cassées
                            </span>
                            <Badge
                              variant={
                                backlinksData.broken_pages === 0
                                  ? 'default'
                                  : 'destructive'
                              }
                              className={
                                backlinksData.broken_pages === 0
                                  ? 'bg-green-600'
                                  : ''
                              }
                            >
                              {backlinksData.broken_pages}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              Spam backlinks
                            </span>
                            <Badge variant="outline">
                              {backlinksData.backlinks_spam_score}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Informations techniques */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations techniques</CardTitle>
                      <CardDescription>
                        Configuration serveur et plateforme
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-sm text-muted-foreground">
                            CMS
                          </span>
                          <Badge variant="outline">
                            {backlinksData.info.cms || 'Non détecté'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-sm text-muted-foreground">
                            Serveur
                          </span>
                          <code className="text-xs">
                            {backlinksData.info.server || 'N/A'}
                          </code>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-sm text-muted-foreground">
                            Adresse IP
                          </span>
                          <code className="text-xs">
                            {backlinksData.info.ip_address}
                          </code>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-sm text-muted-foreground">
                            Pays
                          </span>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline">
                              {backlinksData.info.country}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {backlinksData.info.platform_type &&
                        backlinksData.info.platform_type.length > 0 && (
                          <div className="border-t pt-4">
                            <p className="mb-2 text-sm text-muted-foreground">
                              Types de plateformes
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {backlinksData.info.platform_type.map((type) => (
                                <Badge key={type} variant="secondary">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                </div>

                {/* Statistiques de liens */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques de liens</CardTitle>
                    <CardDescription>
                      Vue d'ensemble de la structure des liens
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-muted-foreground">
                            Liens internes
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          {backlinksData.internal_links_count.toLocaleString(
                            'fr-FR',
                          )}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-muted-foreground">
                            Liens externes
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          {backlinksData.external_links_count.toLocaleString(
                            'fr-FR',
                          )}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-muted-foreground">
                            Pages référentes
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          {backlinksData.referring_pages.toLocaleString(
                            'fr-FR',
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Domaines */}
              <TabsContent value="domains" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Domaines référents */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Domaines référents</CardTitle>
                      <CardDescription>
                        Nombre de domaines pointant vers votre site
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Tous les domaines
                          </p>
                          <p className="text-3xl font-bold">
                            {backlinksData.referring_domains.toLocaleString(
                              'fr-FR',
                            )}
                          </p>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                          <Globe className="h-7 w-7 text-primary" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Domaines principaux
                          </p>
                          <p className="text-3xl font-bold">
                            {backlinksData.referring_main_domains.toLocaleString(
                              'fr-FR',
                            )}
                          </p>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                          <Server className="h-7 w-7 text-blue-600" />
                        </div>
                      </div>

                      <div className="space-y-3 border-t pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Domaines avec liens nofollow
                          </span>
                          <Badge variant="outline">
                            {backlinksData.referring_domains_nofollow.toLocaleString(
                              'fr-FR',
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Domaines principaux nofollow
                          </span>
                          <Badge variant="outline">
                            {backlinksData.referring_main_domains_nofollow.toLocaleString(
                              'fr-FR',
                            )}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Infrastructure réseau */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Infrastructure réseau</CardTitle>
                      <CardDescription>
                        IPs et sous-réseaux référents
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Adresses IP uniques
                          </p>
                          <p className="text-3xl font-bold">
                            {backlinksData.referring_ips.toLocaleString(
                              'fr-FR',
                            )}
                          </p>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                          <Server className="h-7 w-7 text-purple-600" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Sous-réseaux
                          </p>
                          <p className="text-3xl font-bold">
                            {backlinksData.referring_subnets.toLocaleString(
                              'fr-FR',
                            )}
                          </p>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                          <BarChart3 className="h-7 w-7 text-green-600" />
                        </div>
                      </div>

                      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/50">
                        <div className="flex gap-2">
                          <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                          <p className="text-xs text-blue-900 dark:text-blue-100">
                            Une grande diversité d'IPs et de sous-réseaux
                            indique un profil de backlinks naturel et
                            diversifié, ce qui est positif pour le
                            référencement.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top TLDs */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Top 10 des extensions de domaine</CardTitle>
                        <CardDescription>
                          Répartition des backlinks par TLD
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-base">
                        {topTLDs.length} TLDs
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {topTLDs.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Extension</TableHead>
                            <TableHead className="text-right">
                              Backlinks
                            </TableHead>
                            <TableHead className="text-right">
                              Pourcentage
                            </TableHead>
                            <TableHead>Répartition</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topTLDs.map(([tld, count], index) => {
                            const percentage =
                              (count / backlinksData.backlinks) * 100
                            return (
                              <TableRow key={tld}>
                                <TableCell className="font-medium text-muted-foreground">
                                  {index + 1}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="font-mono"
                                  >
                                    {tld}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {count.toLocaleString('fr-FR')}
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                  {percentage.toFixed(1)}%
                                </TableCell>
                                <TableCell className="w-1/3">
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      value={percentage}
                                      className="h-2"
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      {percentage >= 50
                                        ? '🔥'
                                        : percentage >= 20
                                          ? '📊'
                                          : ''}
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        Aucune donnée TLD disponible
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Types de liens */}
              <TabsContent value="links" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Types de liens */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Types de liens</CardTitle>
                      <CardDescription>
                        Répartition par type d'élément HTML
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {backlinksData.referring_links_types &&
                      Object.keys(backlinksData.referring_links_types).length >
                        0 ? (
                        <div className="space-y-4">
                          {Object.entries(backlinksData.referring_links_types)
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, count]) => {
                              const percentage =
                                (count / backlinksData.backlinks) * 100
                              return (
                                <div key={type} className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="secondary"
                                        className="capitalize"
                                      >
                                        {type}
                                      </Badge>
                                      <span className="text-muted-foreground">
                                        {count.toLocaleString('fr-FR')} liens
                                      </span>
                                    </div>
                                    <span className="font-medium">
                                      {percentage.toFixed(1)}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={percentage}
                                    className="h-2"
                                  />
                                </div>
                              )
                            })}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          Aucune donnée disponible
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Attributs de liens */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Attributs de liens</CardTitle>
                      <CardDescription>
                        Attributs HTML des backlinks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {backlinksData.referring_links_attributes &&
                      Object.keys(backlinksData.referring_links_attributes)
                        .length > 0 ? (
                        <div className="space-y-4">
                          {Object.entries(
                            backlinksData.referring_links_attributes,
                          )
                            .sort(([, a], [, b]) => b - a)
                            .map(([attr, count]) => {
                              const percentage =
                                (count / backlinksData.backlinks) * 100
                              const isNofollow = attr === 'nofollow'
                              return (
                                <div key={attr} className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant={
                                          isNofollow ? 'destructive' : 'outline'
                                        }
                                        className="font-mono"
                                      >
                                        {attr}
                                      </Badge>
                                      <span className="text-muted-foreground">
                                        {count.toLocaleString('fr-FR')} liens
                                      </span>
                                    </div>
                                    <span className="font-medium">
                                      {percentage.toFixed(1)}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={percentage}
                                    className="h-2"
                                  />
                                </div>
                              )
                            })}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          Aucune donnée disponible
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Plateformes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Types de plateformes</CardTitle>
                    <CardDescription>
                      Origine des backlinks par type de site
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {backlinksData.referring_links_platform_types &&
                    Object.keys(backlinksData.referring_links_platform_types)
                      .length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(
                          backlinksData.referring_links_platform_types,
                        )
                          .sort(([, a], [, b]) => b - a)
                          .map(([platform, count]) => {
                            const percentage =
                              (count / backlinksData.backlinks) * 100
                            const icons: Record<string, any> = {
                              cms: Globe,
                              blogs: BarChart3,
                              news: TrendingUp,
                              ecommerce: Server,
                              wikis: Server,
                              forums: Server,
                            }
                            const Icon = icons[platform] || Globe
                            return (
                              <div
                                key={platform}
                                className="flex flex-col gap-3 rounded-lg border p-4 transition-shadow hover:shadow-md"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                      <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="font-medium capitalize">
                                      {platform}
                                    </span>
                                  </div>
                                  <Badge variant="secondary">{count}</Badge>
                                </div>
                                <div className="space-y-1">
                                  <Progress
                                    value={percentage}
                                    className="h-2"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    {percentage.toFixed(1)}% du total des
                                    backlinks
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        Aucune donnée disponible
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Emplacements sémantiques */}
                <Card>
                  <CardHeader>
                    <CardTitle>Emplacements sémantiques</CardTitle>
                    <CardDescription>
                      Position des liens dans la structure HTML
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {backlinksData.referring_links_semantic_locations &&
                    Object.keys(
                      backlinksData.referring_links_semantic_locations,
                    ).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(
                          backlinksData.referring_links_semantic_locations,
                        )
                          .sort(([, a], [, b]) => b - a)
                          .map(([location, count]) => {
                            const percentage =
                              (count / backlinksData.backlinks) * 100
                            const displayLocation = location || 'body'
                            return (
                              <div
                                key={location}
                                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                              >
                                <div className="flex items-center gap-3">
                                  <code className="rounded bg-muted px-2 py-1 text-xs font-medium">
                                    &lt;{displayLocation}&gt;
                                  </code>
                                  <span className="text-sm">
                                    {count.toLocaleString('fr-FR')} liens
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-24">
                                    <Progress
                                      value={percentage}
                                      className="h-2"
                                    />
                                  </div>
                                  <span className="w-12 text-right text-sm font-medium">
                                    {percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        Aucune donnée disponible
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Géographie */}
              <TabsContent value="geo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Distribution géographique</CardTitle>
                        <CardDescription>
                          Pays d'origine des backlinks
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-base">
                        {topCountries.length} pays
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {topCountries.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Pays</TableHead>
                            <TableHead className="text-right">
                              Backlinks
                            </TableHead>
                            <TableHead className="text-right">
                              Pourcentage
                            </TableHead>
                            <TableHead>Distribution</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topCountries.map(([country, count], index) => {
                            const percentage =
                              (count / backlinksData.backlinks) * 100
                            return (
                              <TableRow key={country}>
                                <TableCell className="font-medium text-muted-foreground">
                                  {index + 1}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {getCountryName(country)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {country}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {count.toLocaleString('fr-FR')}
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                  {percentage.toFixed(1)}%
                                </TableCell>
                                <TableCell className="w-1/3">
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      value={percentage}
                                      className="h-2"
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      {index === 0
                                        ? '🥇'
                                        : index === 1
                                          ? '🥈'
                                          : index === 2
                                            ? '🥉'
                                            : ''}
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        Aucune donnée géographique disponible
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Carte de chaleur simulée */}
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par continent</CardTitle>
                    <CardDescription>
                      Vue simplifiée de la distribution mondiale
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {(() => {
                        const continents = {
                          Europe: [
                            'FR',
                            'GB',
                            'DE',
                            'ES',
                            'IT',
                            'BE',
                            'CH',
                            'NL',
                          ],
                          'Amérique du Nord': ['US', 'CA'],
                          Asie: ['JP', 'CN', 'IN', 'SG'],
                          'Amérique du Sud': ['BR', 'AR'],
                        }

                        return Object.entries(continents).map(
                          ([continent, codes]) => {
                            const continentCount = topCountries
                              .filter(([country]) => codes.includes(country))
                              .reduce((sum, [, count]) => sum + count, 0)
                            const percentage =
                              (continentCount / backlinksData.backlinks) * 100

                            return (
                              <div
                                key={continent}
                                className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                              >
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    {continent}
                                  </span>
                                  <Badge variant="outline">
                                    {continentCount}
                                  </Badge>
                                </div>
                                <Progress value={percentage} className="h-2" />
                                <p className="mt-2 text-xs text-muted-foreground">
                                  {percentage.toFixed(1)}% du total
                                </p>
                              </div>
                            )
                          },
                        )
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Santé */}
              <TabsContent value="health" className="space-y-6">
                {/* Problèmes critiques */}
                <Card>
                  <CardHeader>
                    <CardTitle>Problèmes détectés</CardTitle>
                    <CardDescription>
                      Backlinks et pages nécessitant une attention immédiate
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div
                        className={`flex items-start gap-4 rounded-lg border p-4 ${
                          backlinksData.broken_backlinks > 0
                            ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                            : 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                        }`}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-900">
                          {backlinksData.broken_backlinks > 0 ? (
                            <XCircle className="h-6 w-6 text-red-600" />
                          ) : (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">Backlinks cassés</p>
                            <Badge
                              variant={
                                backlinksData.broken_backlinks > 0
                                  ? 'destructive'
                                  : 'default'
                              }
                              className={
                                backlinksData.broken_backlinks === 0
                                  ? 'bg-green-600'
                                  : ''
                              }
                            >
                              {backlinksData.broken_backlinks}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {backlinksData.broken_backlinks > 0
                              ? `${backlinksData.broken_backlinks} backlinks pointent vers des pages qui ne fonctionnent plus (erreurs 4xx/5xx)`
                              : 'Excellent ! Tous vos backlinks pointent vers des pages fonctionnelles.'}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-start gap-4 rounded-lg border p-4 ${
                          backlinksData.broken_pages > 0
                            ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                            : 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                        }`}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-900">
                          {backlinksData.broken_pages > 0 ? (
                            <XCircle className="h-6 w-6 text-red-600" />
                          ) : (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">Pages cassées</p>
                            <Badge
                              variant={
                                backlinksData.broken_pages > 0
                                  ? 'destructive'
                                  : 'default'
                              }
                              className={
                                backlinksData.broken_pages === 0
                                  ? 'bg-green-600'
                                  : ''
                              }
                            >
                              {backlinksData.broken_pages}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {backlinksData.broken_pages > 0
                              ? `${backlinksData.broken_pages} pages de votre site renvoient des erreurs 4xx ou 5xx`
                              : 'Parfait ! Toutes vos pages sont accessibles.'}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-start gap-4 rounded-lg border p-4 ${
                          backlinksData.backlinks_spam_score > 30
                            ? 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950'
                            : 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                        }`}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-900">
                          {backlinksData.backlinks_spam_score > 30 ? (
                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                          ) : (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">Backlinks spam</p>
                            <Badge
                              variant={
                                backlinksData.backlinks_spam_score > 30
                                  ? 'secondary'
                                  : 'default'
                              }
                              className={
                                backlinksData.backlinks_spam_score <= 30
                                  ? 'bg-green-600'
                                  : ''
                              }
                            >
                              {backlinksData.backlinks_spam_score} points
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {backlinksData.backlinks_spam_score > 30
                              ? 'Score de spam élevé détecté sur certains backlinks'
                              : 'Excellent ! Vos backlinks proviennent de sources fiables.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommandations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations prioritaires</CardTitle>
                    <CardDescription>
                      Actions à entreprendre pour améliorer votre profil
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {backlinksData.broken_backlinks > 0 && (
                        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                            1
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-red-900 dark:text-red-100">
                              Corriger les backlinks cassés
                            </p>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                              Créez des redirections 301 depuis les URLs cassées
                              vers les pages appropriées pour conserver le jus
                              SEO.
                            </p>
                          </div>
                        </div>
                      )}

                      {dofollowPercentage < 70 && (
                        <div className="flex gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-600 text-white">
                            {backlinksData.broken_backlinks > 0 ? '2' : '1'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-orange-900 dark:text-orange-100">
                              Augmenter le ratio de liens dofollow
                            </p>
                            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                              Seulement {dofollowPercentage.toFixed(0)}% de vos
                              backlinks sont dofollow. Visez au moins 70% pour
                              maximiser l'impact SEO.
                            </p>
                          </div>
                        </div>
                      )}

                      {backlinksData.referring_main_domains < 50 && (
                        <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                            {(backlinksData.broken_backlinks > 0 ? 1 : 0) +
                              (dofollowPercentage < 70 ? 1 : 0) +
                              1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-blue-900 dark:text-blue-100">
                              Diversifier vos sources de backlinks
                            </p>
                            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                              Vous avez actuellement{' '}
                              {backlinksData.referring_main_domains} domaines
                              référents. Ciblez des partenariats avec de
                              nouveaux sites de qualité.
                            </p>
                          </div>
                        </div>
                      )}

                      {backlinksData.broken_backlinks === 0 &&
                        dofollowPercentage >= 70 &&
                        backlinksData.referring_main_domains >= 50 && (
                          <div className="flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            <div className="flex-1">
                              <p className="font-medium text-green-900 dark:text-green-100">
                                Excellent profil de backlinks ! 🎉
                              </p>
                              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                                Votre profil de backlinks est sain. Continuez à
                                acquérir des liens de qualité et surveillez
                                régulièrement les nouveaux backlinks.
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
        )}
      </div>
    </TooltipProvider>
  )
}

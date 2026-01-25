// 📁 components/backlinks/backlinks-content.tsx
'use client'

import { Button } from '@/components/elements/button'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { startTransition, useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fetchBacklinksSummary, type BacklinksSummaryState } from './action'

const backlinksFormSchema = z.object({
  customUrl: z
    .string()
    .min(1, 'L&apos;URL est requise')
    .refine(
      (url) => {
        // Nettoyer l'URL
        let cleaned = url.trim()
        cleaned = cleaned.replace(/^https?:\/\//, '')
        cleaned = cleaned.replace(/^www\./, '')
        cleaned = cleaned.replace(/\/$/, '')

        // Vérifier qu'il n'y a pas d'espaces
        if (cleaned.includes(' ')) {
          return false
        }

        // Vérifier le format de domaine valide
        // Un domaine valide doit contenir au moins un point suivi d'un TLD (2+ caractères)
        // Format accepté: exemple.com, sous.domaine.exemple.fr, etc.
        const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

        // Vérifier aussi les formats avec port ou chemin (mais on les nettoie)
        const hasValidDomain = domainPattern.test(cleaned.split('/')[0].split(':')[0])

        return cleaned.length > 0 && hasValidDomain
      },
      {
        message: "Format d'URL invalide. Entrez un domaine valide (ex: example.com)",
      },
    ),
})

type BacklinksFormValues = z.infer<typeof backlinksFormSchema>

export function BacklinksContent() {
  const initialBacklinksState: BacklinksSummaryState = {
    success: false,
  }

  const [backlinksState, backlinksFormAction, isBacklinksPending] = useActionState(
    fetchBacklinksSummary,
    initialBacklinksState,
  )

  const form = useForm<BacklinksFormValues>({
    resolver: zodResolver(backlinksFormSchema),
    defaultValues: {
      customUrl: '',
    },
  })

  const backlinksData = backlinksState?.result

  // Calculer les métriques
  const dofollowBacklinks =
    backlinksData && backlinksData.backlinks > 0 ? backlinksData.backlinks - backlinksData.referring_pages_nofollow : 0
  const dofollowPercentage =
    backlinksData && backlinksData.backlinks > 0 ? (dofollowBacklinks / backlinksData.backlinks) * 100 : 0
  const healthScore =
    backlinksData && backlinksData.backlinks > 0
      ? Math.max(
          0,
          100 - backlinksData.info.target_spam_score - (backlinksData.broken_backlinks / backlinksData.backlinks) * 100,
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

  const onSubmit = (values: BacklinksFormValues) => {
    // Nettoyer l'URL
    let cleanUrl = values.customUrl.trim()
    cleanUrl = cleanUrl.replace(/^https?:\/\//, '')
    cleanUrl = cleanUrl.replace(/^www\./, '')
    cleanUrl = cleanUrl.replace(/\/$/, '')

    const formData = new FormData()
    formData.append('customUrl', cleanUrl)
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
      <div className="space-y-8">
        {/* Header avec formulaire premium */}
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-linear-to-br from-primary/5 via-mist-800/90 to-mist-900/90 shadow-xl backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <CardContent className="relative p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-primary/20 opacity-50 blur-md" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-primary/20 to-primary/5">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Analyse de backlinks</h2>
                <p className="text-sm text-muted-foreground">Analysez le profil de liens de n&apos;importe quel domaine</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">URL à analyser</FormLabel>
                      <div className="flex gap-3">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="exemple.com"
                            disabled={isBacklinksPending}
                            className="flex-1 border-white/10 bg-white/5 placeholder:text-muted-foreground/50 focus:border-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="submit"
                          disabled={!form.watch('customUrl')?.trim() || isBacklinksPending}
                          className="bg-primary px-6 text-primary-foreground hover:cursor-pointer hover:bg-primary/90"
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
                      <FormDescription className="text-xs text-muted-foreground">
                        Entrez le domaine que vous souhaitez analyser (sans https://)
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {backlinksData && (
              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="font-medium">{backlinksData.target}</span>
                </div>
                {backlinksData.first_seen && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Première détection :{' '}
                      {format(new Date(backlinksData.first_seen), 'dd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                )}
                {backlinksData.crawled_pages && (
                  <Badge color="zinc">{backlinksData.crawled_pages.toLocaleString('fr-FR')} pages analysées</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message d'erreur premium */}
        {backlinksState?.error && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-red-400">Erreur lors de l&apos;analyse</p>
                  <p className="mt-1 text-sm text-muted-foreground">{backlinksState.error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* État de chargement premium */}
        {isBacklinksPending && !backlinksData && (
          <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 via-mist-800/90 to-mist-900/90 shadow-xl backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute h-16 w-16 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                  <div className="absolute h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-primary/50 [animation-direction:reverse] [animation-duration:1.5s]" />
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="mt-6 text-lg font-medium">Analyse des backlinks en cours...</p>
              <p className="mt-2 text-sm text-muted-foreground">Cette opération peut prendre quelques secondes</p>
            </CardContent>
          </Card>
        )}

        {/* État vide premium */}
        {!isBacklinksPending && !backlinksData && !backlinksState?.error && (
          <EmptyState
            icon={Link2}
            title="Analysez votre profil de backlinks"
            description="Entrez un domaine ci-dessus pour découvrir son profil de liens, ses domaines référents et sa santé SEO."
          />
        )}

        {/* Métriques principales premium */}
        {backlinksData && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total backlinks */}
              <Card className="group relative overflow-hidden border-2 border-blue-500/20 bg-linear-to-br from-blue-500/10 via-mist-800/90 to-mist-900/90 shadow-xl backdrop-blur-sm transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl transition-all duration-500 group-hover:bg-blue-500/30" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-blue-500/10 pb-3">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total backlinks
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 ring-2 ring-blue-500/10">
                        <Link2 className="h-5 w-5 text-blue-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-mist-800 border border-mist-700 p-3 text-sm shadow-xl">
                      <p className="max-w-xs">Nombre total de liens pointant vers ce site</p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-4xl font-bold">{backlinksData.backlinks.toLocaleString('fr-FR')}</div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${dofollowPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{dofollowPercentage.toFixed(0)}%</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    {dofollowBacklinks.toLocaleString('fr-FR')} dofollow
                  </p>
                </CardContent>
              </Card>

              {/* Domaines référents */}
              <Card className="group relative overflow-hidden border-2 border-purple-500/20 bg-linear-to-br from-purple-500/10 via-mist-800/90 to-mist-900/90 shadow-xl backdrop-blur-sm transition-all hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl transition-all duration-500 group-hover:bg-purple-500/30" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-purple-500/10 pb-3">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Domaines référents
                  </CardTitle>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 ring-2 ring-purple-500/10">
                    <Globe className="h-5 w-5 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-4xl font-bold">{backlinksData.referring_domains.toLocaleString('fr-FR')}</div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Principaux</p>
                      <p className="mt-1 text-lg font-bold text-purple-400">
                        {backlinksData.referring_main_domains.toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">IPs</p>
                      <p className="mt-1 text-lg font-bold text-purple-400">
                        {backlinksData.referring_ips.toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Domain Rank */}
              <Card className="group relative overflow-hidden border-2 border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-mist-800/90 to-mist-900/90 shadow-xl backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10">
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/30" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-emerald-500/10 pb-3">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Domain Rank
                  </CardTitle>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 ring-2 ring-emerald-500/10">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{backlinksData.rank}</span>
                    <span className="text-xl text-muted-foreground">/100</span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full transition-all ${
                        backlinksData.rank >= 70 ? 'bg-emerald-500' : backlinksData.rank >= 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${backlinksData.rank}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold">
                    {backlinksData.rank >= 70 ? (
                      <span className="text-emerald-400">✓ Excellent</span>
                    ) : backlinksData.rank >= 40 ? (
                      <span className="text-amber-400">✓ Bon</span>
                    ) : (
                      <span className="text-red-400">⚠ À améliorer</span>
                    )}
                  </p>
                </CardContent>
              </Card>

              {/* Spam Score */}
              <Card
                className={`group relative overflow-hidden border-2 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl ${
                  backlinksData.info.target_spam_score < 30
                    ? 'border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-mist-800/90 to-mist-900/90 hover:border-emerald-500/30 hover:shadow-emerald-500/10'
                    : backlinksData.info.target_spam_score < 60
                      ? 'border-amber-500/20 bg-linear-to-br from-amber-500/10 via-mist-800/90 to-mist-900/90 hover:border-amber-500/30 hover:shadow-amber-500/10'
                      : 'border-red-500/20 bg-linear-to-br from-red-500/10 via-mist-800/90 to-mist-900/90 hover:border-red-500/30 hover:shadow-red-500/10'
                }`}
              >
                <div
                  className={`absolute -right-6 -top-6 h-32 w-32 rounded-full blur-3xl transition-all duration-500 ${
                    backlinksData.info.target_spam_score < 30
                      ? 'bg-emerald-500/20 group-hover:bg-emerald-500/30'
                      : backlinksData.info.target_spam_score < 60
                        ? 'bg-amber-500/20 group-hover:bg-amber-500/30'
                        : 'bg-red-500/20 group-hover:bg-red-500/30'
                  }`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-3">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Spam Score
                  </CardTitle>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ring-2 ${
                      backlinksData.info.target_spam_score < 30
                        ? 'bg-emerald-500/20 ring-emerald-500/10'
                        : backlinksData.info.target_spam_score < 60
                          ? 'bg-amber-500/20 ring-amber-500/10'
                          : 'bg-red-500/20 ring-red-500/10'
                    }`}
                  >
                    <Shield
                      className={`h-5 w-5 ${
                        backlinksData.info.target_spam_score < 30
                          ? 'text-emerald-400'
                          : backlinksData.info.target_spam_score < 60
                            ? 'text-amber-400'
                            : 'text-red-400'
                      }`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div
                    className={`flex items-baseline gap-1 ${
                      backlinksData.info.target_spam_score < 30
                        ? 'text-emerald-400'
                        : backlinksData.info.target_spam_score < 60
                          ? 'text-amber-400'
                          : 'text-red-400'
                    }`}
                  >
                    <span className="text-4xl font-bold">{backlinksData.info.target_spam_score}</span>
                    <span className="text-xl opacity-60">/100</span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full transition-all ${
                        backlinksData.info.target_spam_score < 30
                          ? 'bg-emerald-500'
                          : backlinksData.info.target_spam_score < 60
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${backlinksData.info.target_spam_score}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold">
                    {backlinksData.info.target_spam_score < 30 ? (
                      <span className="text-emerald-400">✓ Faible risque</span>
                    ) : backlinksData.info.target_spam_score < 60 ? (
                      <span className="text-amber-400">⚠ Risque modéré</span>
                    ) : (
                      <span className="text-red-400">⚠ Risque élevé</span>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alertes importantes */}
            {(backlinksData.broken_backlinks > 0 || backlinksData.info.target_spam_score > 40) && (
              <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-orange-900 dark:text-orange-100">Actions recommandées</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {backlinksData.broken_backlinks > 0 && (
                    <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        <strong>{backlinksData.broken_backlinks} backlinks cassés</strong> détectés. Corrigez-les ou
                        créez des redirections 301 pour préserver le jus SEO.
                      </p>
                    </div>
                  )}
                  {backlinksData.broken_pages > 0 && (
                    <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        <strong>{backlinksData.broken_pages} pages cassées</strong> sur votre site. Réparez-les
                        rapidement pour éviter de perdre des visiteurs.
                      </p>
                    </div>
                  )}
                  {backlinksData.info.target_spam_score > 40 && (
                    <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                      <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        Votre <strong>spam score est élevé</strong> ({backlinksData.info.target_spam_score}/100).
                        Analysez vos backlinks et désavouez les liens toxiques via Google Search Console.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Onglets améliorés */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-mist-600 lg:w-auto lg:grid-cols-5">
                <TabsTrigger
                  value="overview"
                  className="hover:cursor-pointer data-[state=active]:bg-mist-100 data-[state=active]:text-mist-800 dark:data-[state=active]:bg-mist-900 dark:data-[state=active]:text-mist-100"
                >
                  Vue d&apos;ensemble
                </TabsTrigger>
                <TabsTrigger
                  value="domains"
                  className="hover:cursor-pointer data-[state=active]:bg-mist-100 data-[state=active]:text-mist-800 dark:data-[state=active]:bg-mist-900 dark:data-[state=active]:text-mist-100"
                >
                  Domaines
                </TabsTrigger>
                <TabsTrigger
                  value="links"
                  className="hover:cursor-pointer data-[state=active]:bg-mist-100 data-[state=active]:text-mist-800 dark:data-[state=active]:bg-mist-900 dark:data-[state=active]:text-mist-100"
                >
                  Types de liens
                </TabsTrigger>
                <TabsTrigger
                  value="geo"
                  className="hover:cursor-pointer data-[state=active]:bg-mist-100 data-[state=active]:text-mist-800 dark:data-[state=active]:bg-mist-900 dark:data-[state=active]:text-mist-100"
                >
                  Géographie
                </TabsTrigger>
                <TabsTrigger
                  value="health"
                  className="hover:cursor-pointer data-[state=active]:bg-mist-100 data-[state=active]:text-mist-800 dark:data-[state=active]:bg-mist-900 dark:data-[state=active]:text-mist-100"
                >
                  Santé
                </TabsTrigger>
              </TabsList>

              {/* Vue d'ensemble */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Score de santé */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Score de santé du profil</CardTitle>
                      <CardDescription>Évaluation globale basée sur la qualité des backlinks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">Score global</span>
                          <span className="text-3xl font-bold">
                            {healthScore.toFixed(0)}
                            <span className="text-muted-foreground text-lg">/100</span>
                          </span>
                        </div>
                        <Progress value={healthScore} className="h-3" />
                        <p className="text-muted-foreground mt-2 text-xs">
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
                                  backlinksData.broken_backlinks === 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                              />
                              Backlinks cassés
                            </span>
                            <Badge
                              color={backlinksData.broken_backlinks === 0 ? 'green' : 'red'}
                              className={backlinksData.broken_backlinks === 0 ? 'bg-green-600' : ''}
                            >
                              {backlinksData.broken_backlinks}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm">
                              <CheckCircle2
                                className={`h-4 w-4 ${
                                  backlinksData.broken_pages === 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                              />
                              Pages cassées
                            </span>
                            <Badge
                              color={backlinksData.broken_pages === 0 ? 'green' : 'red'}
                              className={backlinksData.broken_pages === 0 ? 'bg-green-600' : ''}
                            >
                              {backlinksData.broken_pages}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm">
                              <Shield className="text-muted-foreground h-4 w-4" />
                              Spam backlinks
                            </span>
                            <Badge color="zinc">{backlinksData.backlinks_spam_score}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Informations techniques */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations techniques</CardTitle>
                      <CardDescription>Configuration serveur et plateforme</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-muted-foreground text-sm">CMS</span>
                          <Badge color="zinc">{backlinksData.info.cms || 'Non détecté'}</Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-muted-foreground text-sm">Serveur</span>
                          <code className="text-xs">{backlinksData.info.server || 'N/A'}</code>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-muted-foreground text-sm">Adresse IP</span>
                          <code className="text-xs">{backlinksData.info.ip_address}</code>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-muted-foreground text-sm">Pays</span>
                          <div className="flex items-center gap-2">
                            <MapPin className="text-muted-foreground h-4 w-4" />
                            <Badge color="zinc">{backlinksData.info.country}</Badge>
                          </div>
                        </div>
                      </div>

                      {backlinksData.info.platform_type && backlinksData.info.platform_type.length > 0 && (
                        <div className="border-t pt-4">
                          <p className="text-muted-foreground mb-2 text-sm">Types de plateformes</p>
                          <div className="flex flex-wrap gap-2">
                            {backlinksData.info.platform_type.map((type) => (
                              <Badge key={type} color="zinc">
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
                    <CardDescription>Vue d&apos;ensemble de la structure des liens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          <span className="text-muted-foreground text-sm">Liens internes</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {backlinksData.internal_links_count.toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span className="text-muted-foreground text-sm">Liens externes</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {backlinksData.external_links_count.toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-green-600" />
                          <span className="text-muted-foreground text-sm">Pages référentes</span>
                        </div>
                        <p className="text-2xl font-bold">{backlinksData.referring_pages.toLocaleString('fr-FR')}</p>
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
                      <CardDescription>Nombre de domaines pointant vers votre site</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-sm">Tous les domaines</p>
                          <p className="text-3xl font-bold">
                            {backlinksData.referring_domains.toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
                          <Globe className="text-primary h-7 w-7" />
                        </div>
                      </div>

                      <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-sm">Domaines principaux</p>
                          <p className="text-3xl font-bold">
                            {backlinksData.referring_main_domains.toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                          <Server className="h-7 w-7 text-blue-600" />
                        </div>
                      </div>

                      <div className="space-y-3 border-t pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Domaines avec liens nofollow</span>
                          <Badge color="zinc">{backlinksData.referring_domains_nofollow.toLocaleString('fr-FR')}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Domaines principaux nofollow</span>
                          <Badge color="zinc">
                            {backlinksData.referring_main_domains_nofollow.toLocaleString('fr-FR')}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Infrastructure réseau */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Infrastructure réseau</CardTitle>
                      <CardDescription>IPs et sous-réseaux référents</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-sm">Adresses IP uniques</p>
                          <p className="text-3xl font-bold">{backlinksData.referring_ips.toLocaleString('fr-FR')}</p>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                          <Server className="h-7 w-7 text-purple-600" />
                        </div>
                      </div>

                      <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-sm">Sous-réseaux</p>
                          <p className="text-3xl font-bold">
                            {backlinksData.referring_subnets.toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                          <BarChart3 className="h-7 w-7 text-green-600" />
                        </div>
                      </div>

                      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/50">
                        <div className="flex gap-2">
                          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                          <p className="text-xs text-blue-900 dark:text-blue-100">
                            Une grande diversité d&apos;IPs et de sous-réseaux indique un profil de backlinks naturel et
                            diversifié, ce qui est positif pour le référencement.
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
                        <CardDescription>Répartition des backlinks par TLD</CardDescription>
                      </div>
                      <Badge color="zinc" className="text-base">
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
                            <TableHead className="text-right">Backlinks</TableHead>
                            <TableHead className="text-right">Pourcentage</TableHead>
                            <TableHead>Répartition</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topTLDs.map(([tld, count], index) => {
                            const percentage = (count / backlinksData.backlinks) * 100
                            return (
                              <TableRow key={tld}>
                                <TableCell className="text-muted-foreground font-medium">{index + 1}</TableCell>
                                <TableCell>
                                  <Badge color="zinc" className="font-mono">
                                    {tld}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {count.toLocaleString('fr-FR')}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-right">
                                  {percentage.toFixed(1)}%
                                </TableCell>
                                <TableCell className="w-1/3">
                                  <div className="flex items-center gap-2">
                                    <Progress value={percentage} className="h-2" />
                                    <span className="text-muted-foreground text-xs">
                                      {percentage >= 50 ? '🔥' : percentage >= 20 ? '📊' : ''}
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-muted-foreground py-8 text-center">Aucune donnée TLD disponible</div>
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
                      <CardDescription>Répartition par type d&apos;élément HTML</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {backlinksData.referring_links_types &&
                      Object.keys(backlinksData.referring_links_types).length > 0 ? (
                        <div className="space-y-4">
                          {Object.entries(backlinksData.referring_links_types)
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, count]) => {
                              const percentage = (count / backlinksData.backlinks) * 100
                              return (
                                <div key={type} className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <Badge color="zinc" className="capitalize">
                                        {type}
                                      </Badge>
                                      <span className="text-muted-foreground">
                                        {count.toLocaleString('fr-FR')} liens
                                      </span>
                                    </div>
                                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                                  </div>
                                  <Progress value={percentage} className="h-2" />
                                </div>
                              )
                            })}
                        </div>
                      ) : (
                        <div className="text-muted-foreground py-8 text-center">Aucune donnée disponible</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Attributs de liens */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Attributs de liens</CardTitle>
                      <CardDescription>Attributs HTML des backlinks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {backlinksData.referring_links_attributes &&
                      Object.keys(backlinksData.referring_links_attributes).length > 0 ? (
                        <div className="space-y-4">
                          {Object.entries(backlinksData.referring_links_attributes)
                            .sort(([, a], [, b]) => b - a)
                            .map(([attr, count]) => {
                              const percentage = (count / backlinksData.backlinks) * 100
                              const isNofollow = attr === 'nofollow'
                              return (
                                <div key={attr} className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <Badge color={isNofollow ? 'red' : 'zinc'} className="font-mono">
                                        {attr}
                                      </Badge>
                                      <span className="text-muted-foreground">
                                        {count.toLocaleString('fr-FR')} liens
                                      </span>
                                    </div>
                                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                                  </div>
                                  <Progress value={percentage} className="h-2" />
                                </div>
                              )
                            })}
                        </div>
                      ) : (
                        <div className="text-muted-foreground py-8 text-center">Aucune donnée disponible</div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Plateformes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Types de plateformes</CardTitle>
                    <CardDescription>Origine des backlinks par type de site</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {backlinksData.referring_links_platform_types &&
                    Object.keys(backlinksData.referring_links_platform_types).length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(backlinksData.referring_links_platform_types)
                          .sort(([, a], [, b]) => b - a)
                          .map(([platform, count]) => {
                            const percentage = (count / backlinksData.backlinks) * 100
                            const icons: Record<string, React.ComponentType<{ className?: string }>> = {
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
                                    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                                      <Icon className="text-primary h-4 w-4" />
                                    </div>
                                    <span className="font-medium capitalize">{platform}</span>
                                  </div>
                                  <Badge color="zinc">{count}</Badge>
                                </div>
                                <div className="space-y-1">
                                  <Progress value={percentage} className="h-2" />
                                  <p className="text-muted-foreground text-xs">
                                    {percentage.toFixed(1)}% du total des backlinks
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground py-8 text-center">Aucune donnée disponible</div>
                    )}
                  </CardContent>
                </Card>

                {/* Emplacements sémantiques */}
                <Card>
                  <CardHeader>
                    <CardTitle>Emplacements sémantiques</CardTitle>
                    <CardDescription>Position des liens dans la structure HTML</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {backlinksData.referring_links_semantic_locations &&
                    Object.keys(backlinksData.referring_links_semantic_locations).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(backlinksData.referring_links_semantic_locations)
                          .sort(([, a], [, b]) => b - a)
                          .map(([location, count]) => {
                            const percentage = (count / backlinksData.backlinks) * 100
                            const displayLocation = location || 'body'
                            return (
                              <div
                                key={location}
                                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <code className="bg-muted rounded px-2 py-1 text-xs font-medium">
                                    &lt;{displayLocation}&gt;
                                  </code>
                                  <span className="text-sm">{count.toLocaleString('fr-FR')} liens</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-24">
                                    <Progress value={percentage} className="h-2" />
                                  </div>
                                  <span className="w-12 text-right text-sm font-medium">{percentage.toFixed(1)}%</span>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground py-8 text-center">Aucune donnée disponible</div>
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
                        <CardDescription>Pays d&apos;origine des backlinks</CardDescription>
                      </div>
                      <Badge color="zinc" className="text-base">
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
                            <TableHead className="text-right">Backlinks</TableHead>
                            <TableHead className="text-right">Pourcentage</TableHead>
                            <TableHead>Distribution</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topCountries.map(([country, count], index) => {
                            const percentage = (count / backlinksData.backlinks) * 100
                            return (
                              <TableRow key={country}>
                                <TableCell className="text-muted-foreground font-medium">{index + 1}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                                      <MapPin className="text-muted-foreground h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{getCountryName(country)}</p>
                                      <p className="text-muted-foreground text-xs">{country}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {count.toLocaleString('fr-FR')}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-right">
                                  {percentage.toFixed(1)}%
                                </TableCell>
                                <TableCell className="w-1/3">
                                  <div className="flex items-center gap-2">
                                    <Progress value={percentage} className="h-2" />
                                    <span className="text-muted-foreground text-xs">
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-muted-foreground py-8 text-center">
                        Aucune donnée géographique disponible
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Carte de chaleur simulée */}
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par continent</CardTitle>
                    <CardDescription>Vue simplifiée de la distribution mondiale</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {(() => {
                        const continents = {
                          Europe: ['FR', 'GB', 'DE', 'ES', 'IT', 'BE', 'CH', 'NL'],
                          'Amérique du Nord': ['US', 'CA'],
                          Asie: ['JP', 'CN', 'IN', 'SG'],
                          'Amérique du Sud': ['BR', 'AR'],
                        }

                        return Object.entries(continents).map(([continent, codes]) => {
                          const continentCount = topCountries
                            .filter(([country]) => codes.includes(country))
                            .reduce((sum, [, count]) => sum + count, 0)
                          const percentage = (continentCount / backlinksData.backlinks) * 100

                          return (
                            <div key={continent} className="rounded-lg border p-4 transition-shadow hover:shadow-md">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium">{continent}</span>
                                <Badge color="zinc">{continentCount}</Badge>
                              </div>
                              <Progress value={percentage} className="h-2" />
                              <p className="text-muted-foreground mt-2 text-xs">{percentage.toFixed(1)}% du total</p>
                            </div>
                          )
                        })
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
                    <CardDescription>Backlinks et pages nécessitant une attention immédiate</CardDescription>
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
                        <div className="bg-card flex h-10 w-10 shrink-0 items-center justify-center rounded-full dark:bg-gray-900">
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
                              color={backlinksData.broken_backlinks > 0 ? 'red' : 'green'}
                              className={backlinksData.broken_backlinks === 0 ? 'bg-green-600' : ''}
                            >
                              {backlinksData.broken_backlinks}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
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
                        <div className="bg-card flex h-10 w-10 shrink-0 items-center justify-center rounded-full dark:bg-gray-900">
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
                              color={backlinksData.broken_pages > 0 ? 'red' : 'green'}
                              className={backlinksData.broken_pages === 0 ? 'bg-green-600' : ''}
                            >
                              {backlinksData.broken_pages}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
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
                        <div className="bg-card flex h-10 w-10 shrink-0 items-center justify-center rounded-full dark:bg-gray-900">
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
                              color={backlinksData.backlinks_spam_score > 30 ? 'orange' : 'green'}
                              className={backlinksData.backlinks_spam_score <= 30 ? 'bg-green-600' : ''}
                            >
                              {backlinksData.backlinks_spam_score} points
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
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
                    <CardDescription>Actions à entreprendre pour améliorer votre profil</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {backlinksData.broken_backlinks > 0 && (
                        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                            1
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-red-900 dark:text-red-100">Corriger les backlinks cassés</p>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                              Créez des redirections 301 depuis les URLs cassées vers les pages appropriées pour
                              conserver le jus SEO.
                            </p>
                          </div>
                        </div>
                      )}

                      {dofollowPercentage < 70 && (
                        <div className="flex gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white">
                            {backlinksData.broken_backlinks > 0 ? '2' : '1'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-orange-900 dark:text-orange-100">
                              Augmenter le ratio de liens dofollow
                            </p>
                            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                              Seulement {dofollowPercentage.toFixed(0)}% de vos backlinks sont dofollow. Visez au moins
                              70% pour maximiser l&apos;impact SEO.
                            </p>
                          </div>
                        </div>
                      )}

                      {backlinksData.referring_main_domains < 50 && (
                        <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                            {(backlinksData.broken_backlinks > 0 ? 1 : 0) + (dofollowPercentage < 70 ? 1 : 0) + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-blue-900 dark:text-blue-100">
                              Diversifier vos sources de backlinks
                            </p>
                            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                              Vous avez actuellement {backlinksData.referring_main_domains} domaines référents. Ciblez
                              des partenariats avec de nouveaux sites de qualité.
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
                                Votre profil de backlinks est sain. Continuez à acquérir des liens de qualité et
                                surveillez régulièrement les nouveaux backlinks.
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

// 📁 components/keywords/keyword-overview-content.tsx
'use client'

import { Button } from '@/components/elements/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { SpinnerCustom } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { TooltipProvider } from '@/components/ui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, BarChart3, DollarSign, Loader2, Search, Target } from 'lucide-react'
import { useActionState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fetchKeywordOverview, type KeywordOverviewState, type KeywordResult } from './action'

// Localisation et langue fixées pour le public français uniquement

// Schéma de validation Zod
const keywordOverviewSchema = z.object({
  keywords: z
    .string()
    .min(1, 'Au moins un mot-clé est requis')
    .refine(
      (val) => {
        const lines = val.split('\n').filter((k) => k.trim())
        return lines.length > 0 && lines.length <= 100
      },
      {
        message: 'Vous pouvez entrer entre 1 et 100 mots-clés',
      },
    )
    .refine(
      (val) => {
        const lines = val.split('\n').filter((k) => k.trim())
        return lines.every((keyword) => {
          const trimmed = keyword.trim()
          return trimmed.length <= 80 && trimmed.split(/\s+/).length <= 10
        })
      },
      {
        message: 'Chaque mot-clé doit faire maximum 80 caractères et 10 mots',
      },
    ),
  includeClickstream: z.boolean().default(false),
})

export function KeywordOverviewContent() {
  const initialState: KeywordOverviewState = {
    success: false,
  }

  const [state, formAction, isPending] = useActionState(fetchKeywordOverview, initialState)

  const [isTransitioning, startTransition] = useTransition()

  const form = useForm({
    resolver: zodResolver(keywordOverviewSchema),
    defaultValues: {
      keywords: '',
      includeClickstream: false,
    },
  })

  const keywords = form.watch('keywords')
  const keywordCount = keywords.split('\n').filter((k) => k.trim()).length

  const onSubmit = (values: z.infer<typeof keywordOverviewSchema>) => {
    startTransition(() => {
      const formData = new FormData()
      formData.append('keywords', values.keywords)
      if (values.includeClickstream) {
        formData.append('include_clickstream_data', 'true')
      }
      formAction(formData)
    })
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto">
        {/* Header */}

        {/* Formulaire */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Rechercher des mots-clés</CardTitle>
            <CardDescription>Entrez jusqu&apos;à 100 mots-clés (un par ligne)</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          Mots-clés{' '}
                          <Badge color="zinc" className="ml-2">
                            {keywordCount}/100
                          </Badge>
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="seo gratuit&#10;agence référencement&#10;outils seo"
                          rows={6}
                          className="font-mono text-sm"
                          disabled={isPending || isTransitioning}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full hover:cursor-pointer"
                  disabled={isPending || isTransitioning || keywordCount === 0}
                >
                  {isPending || isTransitioning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyser {keywordCount} mot{keywordCount > 1 ? 's' : ''}-clé
                      {keywordCount > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Erreur */}
        {state.error && (
          <Card className="border-destructive/50 bg-destructive/5 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-destructive mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-destructive font-semibold">Erreur</p>
                  <p className="text-muted-foreground mt-1 text-sm">{state.error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* État de chargement amélioré */}
        {isPending && (
          <Card className="mb-6 flex flex-col items-center justify-center">
            <SpinnerCustom />
            <p className="mt-4 font-medium">Analyse en cours...</p>
          </Card>
        )}

        {/* Résultats */}
        {state.success && state.results && state.results.length > 0 && (
          <>
            {/* Métriques globales */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mots-clés analysés</CardTitle>
                  <Target className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{state.results.length}</div>
                  <p className="text-muted-foreground mt-1 text-xs">Coût: ${state.cost?.toFixed(4) || '0'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Volume moyen</CardTitle>
                  <BarChart3 className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Math.round(
                      state.results.reduce((acc, r) => acc + (r.keyword_info?.search_volume || 0), 0) /
                        state.results.length,
                    ).toLocaleString('fr-FR')}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">recherches/mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CPC moyen</CardTitle>
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    $
                    {(
                      state.results.reduce((acc, r) => acc + (r.keyword_info?.cpc || 0), 0) / state.results.length
                    ).toFixed(2)}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">Coût par clic</p>
                </CardContent>
              </Card>
            </div>

            {/* Tableau des résultats */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-muted gap-2">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:text-foreground hover:bg-mist-500/50 data-[state=active]:bg-mist-500"
                >
                  Vue d&apos;ensemble
                </TabsTrigger>
                <TabsTrigger
                  value="trends"
                  className="data-[state=active]:text-foreground hover:bg-mist-500/50 data-[state=active]:bg-mist-500"
                >
                  Tendances
                </TabsTrigger>
                <TabsTrigger
                  value="competition"
                  className="data-[state=active]:text-foreground hover:bg-mist-500/50 data-[state=active]:bg-mist-500"
                >
                  Concurrence
                </TabsTrigger>
                <TabsTrigger
                  value="serp"
                  className="data-[state=active]:text-foreground hover:bg-mist-500/50 data-[state=active]:bg-mist-500"
                >
                  SERP
                </TabsTrigger>
                <TabsTrigger
                  value="backlinks"
                  className="data-[state=active]:text-foreground hover:bg-mist-500/50 data-[state=active]:bg-mist-500"
                >
                  Backlinks
                </TabsTrigger>
                <TabsTrigger
                  value="intent"
                  className="data-[state=active]:text-foreground hover:bg-mist-500/50 data-[state=active]:bg-mist-500"
                >
                  Intention
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Résultats détaillés</CardTitle>
                    <CardDescription>Métriques complètes pour chaque mot-clé</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mot-clé</TableHead>
                          <TableHead className="text-right">Volume</TableHead>
                          <TableHead className="text-right">CPC</TableHead>
                          <TableHead>Concurrence</TableHead>
                          <TableHead className="text-right">Difficulté</TableHead>
                          <TableHead className="text-right">Résultats SERP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {state.results.map((result, index) => {
                          const competitionLevel = result.keyword_info?.competition_level || null
                          const competition = result.keyword_info?.competition || 0 // Float 0-1
                          const competitionIndex = Math.round(competition * 100) // Convertir en pourcentage
                          const difficulty = result.keyword_properties?.keyword_difficulty || 0

                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{result.keyword}</TableCell>
                              <TableCell className="text-right">
                                {result.keyword_info?.search_volume?.toLocaleString('fr-FR') || '0'}
                              </TableCell>
                              <TableCell className="text-right">
                                ${result.keyword_info?.cpc?.toFixed(2) || '0.00'}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Badge
                                    color={
                                      competitionLevel === 'HIGH'
                                        ? 'red'
                                        : competitionLevel === 'MEDIUM'
                                          ? 'yellow'
                                          : 'zinc'
                                    }
                                  >
                                    {competitionLevel || 'N/A'}
                                  </Badge>
                                  <Progress value={competitionIndex} className="h-1" />
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge color={difficulty > 70 ? 'red' : difficulty > 40 ? 'yellow' : 'zinc'}>
                                  {difficulty}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {result.serp_info?.se_results_count || 'N/A'}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends">
                <KeywordTrends results={state.results} />
              </TabsContent>

              <TabsContent value="competition">
                <CompetitionAnalysis results={state.results} />
              </TabsContent>

              <TabsContent value="serp">
                <SerpAnalysis results={state.results} />
              </TabsContent>

              <TabsContent value="backlinks">
                <BacklinksAnalysis results={state.results} />
              </TabsContent>

              <TabsContent value="intent">
                <IntentAnalysis results={state.results} />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* État vide */}
        {!isPending && !state.results && !state.error && (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <Search className="text-muted-foreground h-8 w-8" />
              </div>
              <p className="mt-4 font-medium">Aucune analyse effectuée</p>
              <p className="text-muted-foreground mt-2 text-sm">
                Entrez des mots-clés ci-dessus pour commencer l&apos;analyse
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}

// Composant Tendances
function KeywordTrends({ results }: { results: KeywordResult[] }) {
  return (
    <div className="grid gap-6">
      {results.slice(0, 5).map((result, index) => {
        const monthly = result.keyword_info?.monthly_searches || []
        if (monthly.length === 0) return null

        const maxVolume = Math.max(...monthly.map((m) => m.search_volume))

        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{result.keyword}</span>
                <Badge color="zinc">Volume actuel: {result.keyword_info?.search_volume?.toLocaleString('fr-FR')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {monthly.slice(0, 12).map((month, idx) => {
                  const percentage = (month.search_volume / maxVolume) * 100
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-muted-foreground w-20 text-sm">
                        {month.month}/{month.year}
                      </span>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <span className="w-24 text-right text-sm font-medium">
                        {month.search_volume.toLocaleString('fr-FR')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Composant Analyse Concurrence
function CompetitionAnalysis({ results }: { results: KeywordResult[] }) {
  const highCompetition = results.filter(
    (r) => r.keyword_info?.competition_level === 'HIGH' || (r.keyword_info?.competition || 0) > 0.7,
  )
  const mediumCompetition = results.filter(
    (r) =>
      r.keyword_info?.competition_level === 'MEDIUM' ||
      ((r.keyword_info?.competition || 0) > 0.3 && (r.keyword_info?.competition || 0) <= 0.7),
  )
  const lowCompetition = results.filter(
    (r) => r.keyword_info?.competition_level === 'LOW' || (r.keyword_info?.competition || 0) <= 0.3,
  )

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="text-red-900 dark:text-red-100">Forte concurrence</CardTitle>
          <CardDescription>Mots-clés difficiles à ranker</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-3xl font-bold tracking-tight text-red-600">{highCompetition.length}</div>
          <div className="space-y-2">
            {highCompetition.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate">{r.keyword}</span>
                <Badge color="red">{Math.round((r.keyword_info?.competition || 0) * 100)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
        <CardHeader>
          <CardTitle className="text-orange-900 dark:text-orange-100">Concurrence moyenne</CardTitle>
          <CardDescription>Opportunités intéressantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-3xl font-bold tracking-tight text-orange-600">{mediumCompetition.length}</div>
          <div className="space-y-2">
            {mediumCompetition.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate">{r.keyword}</span>
                <Badge color="yellow">{Math.round((r.keyword_info?.competition || 0) * 100)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-green-900 dark:text-green-100">Faible concurrence</CardTitle>
          <CardDescription>Quick wins potentiels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-3xl font-bold tracking-tight text-green-600">{lowCompetition.length}</div>
          <div className="space-y-2">
            {lowCompetition.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate">{r.keyword}</span>
                <Badge color="green" className="bg-green-100">
                  {Math.round((r.keyword_info?.competition || 0) * 100)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant Analyse SERP
function SerpAnalysis({ results }: { results: KeywordResult[] }) {
  const resultsWithSerp = results.filter((r) => r.serp_info)

  if (resultsWithSerp.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground text-sm">Aucune donnée SERP disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {resultsWithSerp.slice(0, 10).map((result, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{result.keyword}</CardTitle>
              <Badge color="zinc">
                {parseInt(result.serp_info!.se_results_count).toLocaleString('fr-FR')} résultats
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Types d&apos;éléments SERP</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.serp_info!.serp_item_types.map((type, i) => (
                  <Badge key={i} color="yellow" className="text-xs">
                    {type.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground text-xs">URL de vérification</Label>
                <a
                  href={result.serp_info!.check_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary mt-1 block truncate text-sm hover:underline"
                >
                  {result.serp_info!.check_url}
                </a>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Dernière mise à jour</Label>
                <p className="mt-1 text-sm">
                  {new Date(result.serp_info!.last_updated_time).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Composant Analyse Backlinks
function BacklinksAnalysis({ results }: { results: KeywordResult[] }) {
  const resultsWithBacklinks = results.filter((r) => r.avg_backlinks_info)

  if (resultsWithBacklinks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground text-sm">Aucune donnée de backlinks disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métriques de backlinks moyennes</CardTitle>
        <CardDescription>Statistiques moyennes des backlinks pour les 10 premiers résultats organiques</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mot-clé</TableHead>
              <TableHead className="text-right">Backlinks</TableHead>
              <TableHead className="text-right">Dofollow</TableHead>
              <TableHead className="text-right">Pages référentes</TableHead>
              <TableHead className="text-right">Domaines référents</TableHead>
              <TableHead className="text-right">Rank</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultsWithBacklinks.slice(0, 20).map((result, index) => {
              const backlinks = result.avg_backlinks_info!
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{result.keyword}</TableCell>
                  <TableCell className="text-right">
                    {Math.round(backlinks.backlinks).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">{Math.round(backlinks.dofollow).toLocaleString('fr-FR')}</TableCell>
                  <TableCell className="text-right">
                    {Math.round(backlinks.referring_pages).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">
                    {Math.round(backlinks.referring_domains).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge color="zinc">{Math.round(backlinks.rank)}</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Composant Analyse Intention
function IntentAnalysis({ results }: { results: KeywordResult[] }) {
  const resultsWithIntent = results.filter((r) => r.search_intent_info)

  if (resultsWithIntent.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground text-sm">Aucune donnée d&apos;intention disponible</p>
        </CardContent>
      </Card>
    )
  }

  const intentGroups = {
    informational: resultsWithIntent.filter((r) => r.search_intent_info?.main_intent === 'informational'),
    navigational: resultsWithIntent.filter((r) => r.search_intent_info?.main_intent === 'navigational'),
    commercial: resultsWithIntent.filter((r) => r.search_intent_info?.main_intent === 'commercial'),
    transactional: resultsWithIntent.filter((r) => r.search_intent_info?.main_intent === 'transactional'),
  }

  const intentLabels: Record<string, string> = {
    informational: 'Informationnel',
    navigational: 'Navigationnel',
    commercial: 'Commercial',
    transactional: 'Transactionnel',
  }

  const intentColors: Record<string, string> = {
    informational: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950',
    navigational: 'border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950',
    commercial: 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950',
    transactional: 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950',
  }

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble par intention */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(intentGroups).map(([intent, items]) => (
          <Card key={intent} className={intentColors[intent] || 'border bg-gray-50'}>
            <CardHeader>
              <CardTitle className="text-base">{intentLabels[intent] || intent}</CardTitle>
              <CardDescription>
                {items.length} mot{items.length > 1 ? 's' : ''}-clé
                {items.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{items.length}</div>
              <p className="text-muted-foreground mt-1 text-xs">
                {Math.round((items.length / resultsWithIntent.length) * 100)}% du total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Liste détaillée */}
      <Card>
        <CardHeader>
          <CardTitle>Détails par mot-clé</CardTitle>
          <CardDescription>Intention principale et intentions secondaires</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mot-clé</TableHead>
                <TableHead>Intention principale</TableHead>
                <TableHead>Intentions secondaires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultsWithIntent.slice(0, 20).map((result, index) => {
                const intent = result.search_intent_info!
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{result.keyword}</TableCell>
                    <TableCell>
                      <Badge color="yellow">{intentLabels[intent.main_intent] || intent.main_intent}</Badge>
                    </TableCell>
                    <TableCell>
                      {intent.foreign_intent && intent.foreign_intent.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {intent.foreign_intent.map((fi, i) => (
                            <Badge key={i} color="zinc" className="text-xs">
                              {intentLabels[fi] || fi}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Aucune</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

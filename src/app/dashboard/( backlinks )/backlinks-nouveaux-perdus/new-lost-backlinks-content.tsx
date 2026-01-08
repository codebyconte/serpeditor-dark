// 📁 app/dashboard/backlinks/nouveaux-perdus/new-lost-backlinks-content.tsx
'use client'

import { Button } from '@/components/elements/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SpinnerCustom } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Calendar,
  LineChart,
  Loader2,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useActionState, useMemo, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fetchNewLostBacklinks, type NewLostBacklinksState } from './action'

const newLostBacklinksFormSchema = z.object({
  target: z
    .string()
    .min(1, 'Le domaine ou l&apos;URL est requis')
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

        // Vérifier le format du domaine (exemple.com) ou URL complète
        const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
        const urlPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/

        return domainPattern.test(cleaned) || urlPattern.test(cleaned)
      },
      {
        message: 'Format invalide. Utilisez un domaine (exemple.com) ou une URL complète (https://exemple.com/page)',
      },
    ),
})

type NewLostBacklinksFormValues = z.infer<typeof newLostBacklinksFormSchema>

export function NewLostBacklinksContent() {
  const initialState: NewLostBacklinksState = { success: false }
  const [state, formAction, isPending] = useActionState(fetchNewLostBacklinks, initialState)
  const [isTransitionPending, startTransition] = useTransition()

  const form = useForm<NewLostBacklinksFormValues>({
    resolver: zodResolver(newLostBacklinksFormSchema),
    mode: 'onChange',
    defaultValues: {
      target: '',
    },
  })

  const onSubmit = (values: NewLostBacklinksFormValues) => {
    const formData = new FormData()
    formData.set('target', values.target.trim())
    startTransition(() => {
      formAction(formData)
    })
  }

  // Calculs agrégés
  const aggregatedMetrics = useMemo(() => {
    if (!state.result?.items) return null

    const totalNewBacklinks = state.result.items.reduce((sum, item) => sum + item.new_backlinks, 0)
    const totalLostBacklinks = state.result.items.reduce((sum, item) => sum + item.lost_backlinks, 0)
    const totalNewDomains = state.result.items.reduce((sum, item) => sum + item.new_referring_domains, 0)
    const totalLostDomains = state.result.items.reduce((sum, item) => sum + item.lost_referring_domains, 0)
    const totalNewMainDomains = state.result.items.reduce((sum, item) => sum + item.new_referring_main_domains, 0)
    const totalLostMainDomains = state.result.items.reduce((sum, item) => sum + item.lost_referring_main_domains, 0)

    const netBacklinks = totalNewBacklinks - totalLostBacklinks
    const netDomains = totalNewDomains - totalLostDomains
    const netMainDomains = totalNewMainDomains - totalLostMainDomains

    // Tendance récente (derniers 30% des données)
    const recentCount = Math.ceil(state.result.items.length * 0.3)
    const recentItems = state.result.items.slice(-recentCount)
    const recentNetBacklinks = recentItems.reduce((sum, item) => sum + (item.new_backlinks - item.lost_backlinks), 0)

    const trend = recentNetBacklinks > 0 ? 'up' : recentNetBacklinks < 0 ? 'down' : 'stable'

    // Moyenne par période
    const avgNewBacklinks = totalNewBacklinks / state.result.items.length
    const avgLostBacklinks = totalLostBacklinks / state.result.items.length

    // Meilleure et pire période
    const bestPeriod = [...state.result.items].sort(
      (a, b) => b.new_backlinks - b.lost_backlinks - (a.new_backlinks - a.lost_backlinks),
    )[0]
    const worstPeriod = [...state.result.items].sort(
      (a, b) => a.new_backlinks - a.lost_backlinks - (b.new_backlinks - b.lost_backlinks),
    )[0]

    return {
      totalNewBacklinks,
      totalLostBacklinks,
      totalNewDomains,
      totalLostDomains,
      totalNewMainDomains,
      totalLostMainDomains,
      netBacklinks,
      netDomains,
      netMainDomains,
      trend,
      avgNewBacklinks,
      avgLostBacklinks,
      bestPeriod,
      worstPeriod,
    }
  }, [state.result])

  // Helper pour formater les nombres
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  // Helper pour formater les dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Helper pour obtenir l'icône de tendance
  const getTrendIcon = (netValue: number) => {
    if (netValue > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (netValue < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  // Helper pour la couleur du badge
  const getNetBadgeColor = (netValue: number): 'green' | 'red' | 'blue' => {
    if (netValue > 0) return 'green'
    if (netValue < 0) return 'red'
    return 'blue'
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
            <LineChart className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Backlinks Nouveaux & Perdus</h1>
            <p className="text-muted-foreground text-sm">
              Suivez l&apos;évolution temporelle de votre profil de backlinks
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analyser l&apos;évolution des backlinks</CardTitle>
          <CardDescription>
            Analysez les backlinks nouveaux et perdus (90 derniers jours, groupés par mois)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domaine cible</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="exemple.fr"
                        disabled={isPending || isTransitionPending}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          form.trigger('target')
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending || isTransitionPending}>
                {isPending || isTransitionPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <LineChart className="mr-2 h-4 w-4" />
                    Analyser l&apos;évolution
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

      {/* Loading */}
      {isPending && (
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <SpinnerCustom />
            <p className="mt-4 font-medium">Récupération des données temporelles...</p>
            <p className="text-muted-foreground mt-2 text-sm">Cela peut prendre quelques secondes</p>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {state.success && state.result && aggregatedMetrics && (
        <>
          {/* Métriques globales */}
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux Backlinks</CardTitle>
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  +{formatNumber(aggregatedMetrics.totalNewBacklinks)}
                </div>
                <p className="text-muted-foreground text-xs">
                  Moy: {Math.round(aggregatedMetrics.avgNewBacklinks)}/période
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Backlinks Perdus</CardTitle>
                <ArrowDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  -{formatNumber(aggregatedMetrics.totalLostBacklinks)}
                </div>
                <p className="text-muted-foreground text-xs">
                  Moy: {Math.round(aggregatedMetrics.avgLostBacklinks)}/période
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bilan Net</CardTitle>
                {getTrendIcon(aggregatedMetrics.netBacklinks)}
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold ${
                    aggregatedMetrics.netBacklinks > 0
                      ? 'text-green-600'
                      : aggregatedMetrics.netBacklinks < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                  }`}
                >
                  {aggregatedMetrics.netBacklinks > 0 ? '+' : ''}
                  {formatNumber(aggregatedMetrics.netBacklinks)}
                </div>
                <p className="text-muted-foreground text-xs">Nouveaux - Perdus</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tendance</CardTitle>
                <Calendar className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {aggregatedMetrics.trend === 'up' && (
                    <Badge color="green" className="text-lg">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      En hausse
                    </Badge>
                  )}
                  {aggregatedMetrics.trend === 'down' && (
                    <Badge color="red" className="text-lg">
                      <TrendingDown className="mr-1 h-4 w-4" />
                      En baisse
                    </Badge>
                  )}
                  {aggregatedMetrics.trend === 'stable' && (
                    <Badge color="blue" className="text-lg">
                      <Minus className="mr-1 h-4 w-4" />
                      Stable
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">Sur la période récente</p>
              </CardContent>
            </Card>
          </div>

          {/* Domaines référents */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux Domaines</CardTitle>
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +{formatNumber(aggregatedMetrics.totalNewDomains)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {formatNumber(aggregatedMetrics.totalNewMainDomains)} domaines principaux
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Domaines Perdus</CardTitle>
                <ArrowDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  -{formatNumber(aggregatedMetrics.totalLostDomains)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {formatNumber(aggregatedMetrics.totalLostMainDomains)} domaines principaux
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bilan Domaines</CardTitle>
                {getTrendIcon(aggregatedMetrics.netDomains)}
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    aggregatedMetrics.netDomains > 0
                      ? 'text-green-600'
                      : aggregatedMetrics.netDomains < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                  }`}
                >
                  {aggregatedMetrics.netDomains > 0 ? '+' : ''}
                  {formatNumber(aggregatedMetrics.netDomains)}
                </div>
                <p className="text-muted-foreground text-xs">net domaines référents</p>
              </CardContent>
            </Card>
          </div>

          {/* Meilleure et pire période */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Meilleure Période
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{formatDate(aggregatedMetrics.bestPeriod.date)}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nouveaux</p>
                      <p className="font-semibold text-green-600">
                        +{formatNumber(aggregatedMetrics.bestPeriod.new_backlinks)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Perdus</p>
                      <p className="font-semibold text-red-600">
                        -{formatNumber(aggregatedMetrics.bestPeriod.lost_backlinks)}
                      </p>
                    </div>
                  </div>
                  <Badge color="green" className="mt-2">
                    Net: +
                    {formatNumber(
                      aggregatedMetrics.bestPeriod.new_backlinks - aggregatedMetrics.bestPeriod.lost_backlinks,
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Pire Période
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{formatDate(aggregatedMetrics.worstPeriod.date)}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nouveaux</p>
                      <p className="font-semibold text-green-600">
                        +{formatNumber(aggregatedMetrics.worstPeriod.new_backlinks)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Perdus</p>
                      <p className="font-semibold text-red-600">
                        -{formatNumber(aggregatedMetrics.worstPeriod.lost_backlinks)}
                      </p>
                    </div>
                  </div>
                  <Badge color="red" className="mt-2">
                    Net:{' '}
                    {formatNumber(
                      aggregatedMetrics.worstPeriod.new_backlinks - aggregatedMetrics.worstPeriod.lost_backlinks,
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table des données */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Données Détaillées</CardTitle>
                  <CardDescription>{state.result.items.length} période(s) analysée(s)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Nouveaux BL</TableHead>
                      <TableHead className="text-right">Perdus BL</TableHead>
                      <TableHead className="text-right">Net BL</TableHead>
                      <TableHead className="text-right">Nouveaux Dom.</TableHead>
                      <TableHead className="text-right">Perdus Dom.</TableHead>
                      <TableHead className="text-right">Net Dom.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.result.items.map((item, idx) => {
                      const netBacklinks = item.new_backlinks - item.lost_backlinks
                      const netDomains = item.new_referring_domains - item.lost_referring_domains

                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{formatDate(item.date)}</TableCell>
                          <TableCell className="text-right text-green-600">
                            +{formatNumber(item.new_backlinks)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            -{formatNumber(item.lost_backlinks)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge color={getNetBadgeColor(netBacklinks)}>
                              {netBacklinks > 0 ? '+' : ''}
                              {formatNumber(netBacklinks)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            +{formatNumber(item.new_referring_domains)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            -{formatNumber(item.lost_referring_domains)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge color={getNetBadgeColor(netDomains)}>
                              {netDomains > 0 ? '+' : ''}
                              {formatNumber(netDomains)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

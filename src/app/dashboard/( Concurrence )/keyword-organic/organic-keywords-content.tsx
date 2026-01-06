// 📁 app/dashboard/mots-cles-organiques/organic-keywords-content.tsx
'use client'

import { Button, PlainButton } from '@/components/elements/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { SpinnerCustom } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ExternalLink,
  Loader2,
  Minus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useActionState, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fetchRankedKeywords, type RankedKeywordItem, type RankedKeywordsState } from './actions'

const organicKeywordsSchema = z.object({
  target: z
    .string()
    .min(1, 'Veuillez entrer un domaine')
    .refine(
      (val) => {
        // Nettoyer le domaine pour la validation
        let clean = val.trim()
        clean = clean.replace(/^https?:\/\//, '')
        clean = clean.replace(/^www\./, '')
        clean = clean.replace(/\/$/, '')
        // Vérifier que c'est un domaine valide (contient au moins un point et pas d'espaces)
        return clean.includes('.') && !clean.includes(' ') && clean.length > 3
      },
      {
        message: 'Format de domaine invalide. Exemple : exemple.com ou www.exemple.com',
      },
    ),
})

export function OrganicKeywordsContent() {
  const initialState: RankedKeywordsState = { success: false }
  const [state, formAction, isPending] = useActionState(fetchRankedKeywords, initialState)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  const form = useForm<z.infer<typeof organicKeywordsSchema>>({
    resolver: zodResolver(organicKeywordsSchema),
    defaultValues: {
      target: '',
    },
  })

  async function onSubmit(values: z.infer<typeof organicKeywordsSchema>) {
    setCurrentPage(1) // Reset pagination

    // Nettoyer le domaine
    let cleanTarget = values.target.trim()
    cleanTarget = cleanTarget.replace(/^https?:\/\//, '')
    cleanTarget = cleanTarget.replace(/^www\./, '')
    cleanTarget = cleanTarget.replace(/\/$/, '')

    // Créer FormData pour l'action serveur
    const formData = new FormData()
    formData.set('target', cleanTarget)
    formData.set('offset', '0')
    formData.set('limit', '100') // Valeur par défaut de 100

    formAction(formData)
  }

  // Pagination
  const paginatedItems = state.result?.items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil((state.result?.items.length || 0) / itemsPerPage)

  // Helper pour obtenir le rank_group de manière sûre
  const getRankGroup = (item: RankedKeywordItem): number => {
    return item.ranked_serp_element.serp_item.rank_group
  }

  // Helper pour obtenir l'URL relative de manière sûre
  const getRelativeUrl = (item: RankedKeywordItem): string => {
    return item.ranked_serp_element.serp_item.relative_url
  }

  // Helper pour obtenir l'ETV de manière sûre
  const getEtv = (item: RankedKeywordItem): number => {
    return item.ranked_serp_element.serp_item.etv
  }

  // Helper pour les badges de position
  const getRankBadge = (rank: number): 'green' | 'blue' | 'sky' | 'zinc' => {
    if (rank === 1) return 'green'
    if (rank <= 3) return 'blue'
    if (rank <= 10) return 'sky'
    return 'zinc'
  }

  // Helper pour les badges de tendance
  const getTrendIcon = (item: RankedKeywordItem) => {
    const changes = item.ranked_serp_element.serp_item.rank_changes
    if (changes.is_new) return <Sparkles className="h-3 w-3 text-green-500" />
    if (changes.is_up) return <ArrowUp className="h-3 w-3 text-green-500" />
    if (changes.is_down) return <ArrowDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  // Helper pour formater les nombres
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  // Helper pour formater les devises
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(num)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
            <Search className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Rechercher des mots-clés organiques</h1>
            <p className="text-muted-foreground text-sm">
              Découvrez tous les mots-clés sur lesquels vos concurrents se positionne
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analyser un domaine</CardTitle>
          <CardDescription>Entrez un nom de domaine (sans https:// ou www.)</CardDescription>
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
                      <Input {...field} placeholder="exemple.fr" disabled={isPending} className="w-full" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Exemple: exemple.fr ou sous-domaine.exemple.fr
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:border-primary/50 flex w-full items-center justify-center gap-3 rounded-xl border-2 py-4 text-base font-semibold shadow-lg transition-all hover:cursor-pointer hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending || !form.watch('target')?.trim()}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Analyser les mots-clés organiques
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
            <p className="mt-4 font-medium">Récupération des mots-clés organiques...</p>
            <p className="text-muted-foreground mt-2 text-sm">Cela peut prendre quelques secondes</p>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {state.success && state.result && (
        <>
          {/* Métriques globales */}
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Mots-Clés</CardTitle>
                <BarChart3 className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(state.result.total_count)}</div>
                <p className="text-muted-foreground text-xs">
                  {formatNumber(state.result.metrics.organic.count)} organiques
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trafic Estimé</CardTitle>
                <TrendingUp className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(Math.round(state.result.metrics.organic.etv))}</div>
                <p className="text-muted-foreground text-xs">visites/mois estimées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valeur du Trafic</CardTitle>
                <DollarSign className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(state.result.metrics.organic.estimated_paid_traffic_cost)}
                </div>
                <p className="text-muted-foreground text-xs">coût équivalent en SEA</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top 10</CardTitle>
                <Target className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatNumber(
                    state.result.metrics.organic.pos_1 +
                      state.result.metrics.organic.pos_2_3 +
                      state.result.metrics.organic.pos_4_10,
                  )}
                </div>
                <p className="text-muted-foreground text-xs">mots-clés en 1ère page</p>
              </CardContent>
            </Card>
          </div>

          {/* Distribution des positions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Distribution des Positions</CardTitle>
              <CardDescription>Répartition de vos mots-clés par position dans Google</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Position 1</span>
                    <span className="text-muted-foreground">
                      {formatNumber(state.result.metrics.organic.pos_1)} mots-clés
                    </span>
                  </div>
                  <Progress
                    value={(state.result.metrics.organic.pos_1 / state.result.metrics.organic.count) * 100}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Positions 2-3</span>
                    <span className="text-muted-foreground">
                      {formatNumber(state.result.metrics.organic.pos_2_3)} mots-clés
                    </span>
                  </div>
                  <Progress
                    value={(state.result.metrics.organic.pos_2_3 / state.result.metrics.organic.count) * 100}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Positions 4-10</span>
                    <span className="text-muted-foreground">
                      {formatNumber(state.result.metrics.organic.pos_4_10)} mots-clés
                    </span>
                  </div>
                  <Progress
                    value={(state.result.metrics.organic.pos_4_10 / state.result.metrics.organic.count) * 100}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Positions 11-20</span>
                    <span className="text-muted-foreground">
                      {formatNumber(state.result.metrics.organic.pos_11_20)} mots-clés
                    </span>
                  </div>
                  <Progress
                    value={(state.result.metrics.organic.pos_11_20 / state.result.metrics.organic.count) * 100}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Positions 21+</span>
                    <span className="text-muted-foreground">
                      {formatNumber(
                        state.result.metrics.organic.count -
                          state.result.metrics.organic.pos_1 -
                          state.result.metrics.organic.pos_2_3 -
                          state.result.metrics.organic.pos_4_10 -
                          state.result.metrics.organic.pos_11_20,
                      )}{' '}
                      mots-clés
                    </span>
                  </div>
                  <Progress
                    value={
                      ((state.result.metrics.organic.count -
                        state.result.metrics.organic.pos_1 -
                        state.result.metrics.organic.pos_2_3 -
                        state.result.metrics.organic.pos_4_10 -
                        state.result.metrics.organic.pos_11_20) /
                        state.result.metrics.organic.count) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tendances */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
                <Sparkles className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(state.result.metrics.organic.is_new)}</div>
                <p className="text-muted-foreground text-xs">mots-clés ajoutés récemment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En progression</CardTitle>
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(state.result.metrics.organic.is_up)}</div>
                <p className="text-muted-foreground text-xs">positions améliorées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En baisse</CardTitle>
                <ArrowDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(state.result.metrics.organic.is_down)}</div>
                <p className="text-muted-foreground text-xs">positions perdues</p>
              </CardContent>
            </Card>
          </div>

          {/* Table des mots-clés */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Mots-Clés</CardTitle>
                  <CardDescription>{formatNumber(state.result.items.length)} mots-clés trouvés</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">Pos.</TableHead>
                      <TableHead>Mot-Clé</TableHead>
                      <TableHead className="w-[100px]">Volume</TableHead>
                      <TableHead className="w-[80px]">Diff.</TableHead>
                      <TableHead className="w-[100px]">Trafic Est.</TableHead>
                      <TableHead className="w-[80px]">Tendance</TableHead>
                      <TableHead className="w-[100px]">Intent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Badge color={getRankBadge(getRankGroup(item))}>{getRankGroup(item)}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            <a
                              href={item.ranked_serp_element.check_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:underline"
                            >
                              {item.keyword_data.keyword}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <span className="text-muted-foreground text-xs">{getRelativeUrl(item)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatNumber(item.keyword_data.keyword_info.search_volume)}</TableCell>
                        <TableCell>
                          <Badge
                            color={
                              item.keyword_data.keyword_properties.keyword_difficulty < 30
                                ? 'green'
                                : item.keyword_data.keyword_properties.keyword_difficulty < 60
                                  ? 'yellow'
                                  : 'red'
                            }
                          >
                            {item.keyword_data.keyword_properties.keyword_difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>{Math.round(getEtv(item)).toLocaleString('fr-FR')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(item)}
                            {item.ranked_serp_element.serp_item.rank_changes.is_new && (
                              <Badge color="green" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge color="zinc" className="text-xs">
                            {item.keyword_data.search_intent_info?.main_intent || 'N/A'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Page {currentPage} sur {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <PlainButton onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </PlainButton>
                    <PlainButton
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </PlainButton>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

// 📁 app/dashboard/mots-cles-organiques/organic-keywords-content.tsx
'use client'

import { Button, PlainButton } from '@/components/elements/button'
import { Badge } from '@/components/ui/badge'
import { Button as ShadcnButton } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SpinnerCustom } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ExternalLink,
  Eye,
  Link2,
  Loader2,
  MapPin,
  Minus,
  Save,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  fetchRankedKeywords,
  getUserProjects,
  saveSelectedKeywords,
  type RankedKeywordItem,
  type RankedKeywordsState,
} from './actions'

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

interface Project {
  id: string
  url: string
}

export function OrganicKeywordsContent() {
  const initialState: RankedKeywordsState = { success: false }
  const [state, formAction, isPending] = useActionState(fetchRankedKeywords, initialState)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50
  const [selectedKeywords, setSelectedKeywords] = useState<Set<number>>(new Set())
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedKeywordDetail, setSelectedKeywordDetail] = useState<RankedKeywordItem | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [showAbsoluteMetrics, setShowAbsoluteMetrics] = useState(false)

  const form = useForm<z.infer<typeof organicKeywordsSchema>>({
    resolver: zodResolver(organicKeywordsSchema),
    defaultValues: {
      target: '',
    },
  })

  // Charger les projets au montage
  useEffect(() => {
    async function loadProjects() {
      setLoadingProjects(true)
      const result = await getUserProjects()
      if (result.success && result.data) {
        setProjects(result.data)
        if (result.data.length > 0) {
          setSelectedProjectId(result.data[0].id)
        }
      }
      setLoadingProjects(false)
    }
    loadProjects()
  }, [])

  const [, startTransition] = useTransition()

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

    startTransition(() => {
      formAction(formData)
    })
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

  // Helper pour obtenir le niveau de compétition
  const getCompetitionLevel = (
    level: string | null | undefined,
  ): { label: string; color: 'green' | 'yellow' | 'red' | 'zinc' } => {
    if (!level) return { label: 'N/A', color: 'zinc' }
    const levelUpper = level.toUpperCase()
    if (levelUpper === 'LOW') return { label: 'Faible', color: 'green' }
    if (levelUpper === 'MEDIUM') return { label: 'Moyenne', color: 'yellow' }
    if (levelUpper === 'HIGH') return { label: 'Élevée', color: 'red' }
    return { label: level, color: 'zinc' }
  }

  // Helper pour obtenir l'intention de recherche
  const getIntentLabel = (intent: string | null | undefined): string => {
    if (!intent) return 'N/A'
    const intentMap: Record<string, string> = {
      commercial: 'Commercial',
      informational: 'Informationnel',
      navigational: 'Navigationnel',
      transactional: 'Transactionnel',
    }
    return intentMap[intent.toLowerCase()] || intent
  }

  // Helper pour obtenir la tendance de volume
  const getVolumeTrend = (trend: { monthly: number; quarterly: number; yearly: number } | null | undefined) => {
    if (!trend) return null
    return {
      monthly: trend.monthly,
      quarterly: trend.quarterly,
      yearly: trend.yearly,
    }
  }

  // Helper pour calculer le total des positions absolues
  const getAbsoluteTotal = (metrics: {
    pos_1: number
    pos_2_3: number
    pos_4_10: number
    pos_11_20: number
    pos_21_30: number
    pos_31_40: number
    pos_41_50: number
    pos_51_60: number
    pos_61_70: number
    pos_71_80: number
    pos_81_90: number
    pos_91_100: number
  }) => {
    return (
      metrics.pos_1 +
      metrics.pos_2_3 +
      metrics.pos_4_10 +
      metrics.pos_11_20 +
      metrics.pos_21_30 +
      metrics.pos_31_40 +
      metrics.pos_41_50 +
      metrics.pos_51_60 +
      metrics.pos_61_70 +
      metrics.pos_71_80 +
      metrics.pos_81_90 +
      metrics.pos_91_100
    )
  }

  // Ouvrir le dialog de détails
  const openKeywordDetail = (item: RankedKeywordItem) => {
    setSelectedKeywordDetail(item)
    setIsDetailDialogOpen(true)
  }

  // Gérer la sélection/désélection d'un mot-clé
  const toggleKeywordSelection = (index: number) => {
    const newSelected = new Set(selectedKeywords)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedKeywords(newSelected)
  }

  // Sélectionner/désélectionner tous les mots-clés de la page
  const toggleAllKeywords = () => {
    if (!state.result?.items) return

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, state.result.items.length)
    const pageIndices = Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i)

    const newSelected = new Set(selectedKeywords)
    const allSelected = pageIndices.every((idx) => newSelected.has(idx))

    if (allSelected) {
      pageIndices.forEach((idx) => newSelected.delete(idx))
    } else {
      pageIndices.forEach((idx) => newSelected.add(idx))
    }
    setSelectedKeywords(newSelected)
  }

  // Sauvegarder les mots-clés sélectionnés
  const handleSaveKeywords = async () => {
    if (!selectedProjectId) {
      toast.error('Veuillez sélectionner un projet')
      return
    }

    if (selectedKeywords.size === 0) {
      toast.error('Veuillez sélectionner au moins un mot-clé')
      return
    }

    if (!state.result?.items) {
      toast.error('Aucune donnée disponible')
      return
    }

    setSaving(true)

    if (!state.result?.items) {
      toast.error('Aucune donnée disponible')
      return
    }

    const keywordResult = state.result

    try {
      const keywordsToSave = Array.from(selectedKeywords)
        .map((index) => {
          const item = keywordResult.items[index]
          if (!item) return null

          return {
            keyword: item.keyword_data.keyword,
            rankGroup: getRankGroup(item),
            rankAbsolute: item.ranked_serp_element.serp_item.rank_absolute || undefined,
            searchVolume: item.keyword_data.keyword_info.search_volume || undefined,
            locationCode: keywordResult.location_code,
            languageCode: keywordResult.language_code,
          }
        })
        .filter((k): k is NonNullable<typeof k> => k !== null)

      const saveResult = await saveSelectedKeywords(selectedProjectId, keywordsToSave)

      if (saveResult.success) {
        toast.success(
          `${saveResult.saved} mot-clé(s) sauvegardé(s)${saveResult.skipped ? `, ${saveResult.skipped} ignoré(s) (déjà existants)` : ''}`,
        )
        setSelectedKeywords(new Set()) // Réinitialiser la sélection
      } else {
        toast.error(saveResult.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}

      <Card className="border-primary/20 bg-primary/5 my-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg">
              <Search className="text-primary-foreground h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">Rechercher des mots-clés organiques</h1>
              <p className="dashboard-body-lg text-muted-foreground mt-2">
                Découvrez tous les mots-clés sur lesquels vos concurrents se positionne
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Distribution des Positions</CardTitle>
                  <CardDescription>
                    {showAbsoluteMetrics
                      ? 'Positions absolues (exactes) de vos mots-clés dans Google'
                      : 'Répartition groupée de vos mots-clés par position dans Google'}
                  </CardDescription>
                </div>
                {state.result.metrics_absolute && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Positions absolues</span>
                    <Switch checked={showAbsoluteMetrics} onCheckedChange={setShowAbsoluteMetrics} />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {showAbsoluteMetrics && state.result?.metrics_absolute ? (
                <div className="space-y-4">
                  {[
                    { label: 'Position 1', value: state.result.metrics_absolute.organic.pos_1, key: 'pos_1' },
                    { label: 'Positions 2-3', value: state.result.metrics_absolute.organic.pos_2_3, key: 'pos_2_3' },
                    { label: 'Positions 4-10', value: state.result.metrics_absolute.organic.pos_4_10, key: 'pos_4_10' },
                    {
                      label: 'Positions 11-20',
                      value: state.result.metrics_absolute.organic.pos_11_20,
                      key: 'pos_11_20',
                    },
                    {
                      label: 'Positions 21-30',
                      value: state.result.metrics_absolute.organic.pos_21_30,
                      key: 'pos_21_30',
                    },
                    {
                      label: 'Positions 31-40',
                      value: state.result.metrics_absolute.organic.pos_31_40,
                      key: 'pos_31_40',
                    },
                    {
                      label: 'Positions 41-50',
                      value: state.result.metrics_absolute.organic.pos_41_50,
                      key: 'pos_41_50',
                    },
                    {
                      label: 'Positions 51-60',
                      value: state.result.metrics_absolute.organic.pos_51_60,
                      key: 'pos_51_60',
                    },
                    {
                      label: 'Positions 61-70',
                      value: state.result.metrics_absolute.organic.pos_61_70,
                      key: 'pos_61_70',
                    },
                    {
                      label: 'Positions 71-80',
                      value: state.result.metrics_absolute.organic.pos_71_80,
                      key: 'pos_71_80',
                    },
                    {
                      label: 'Positions 81-90',
                      value: state.result.metrics_absolute.organic.pos_81_90,
                      key: 'pos_81_90',
                    },
                    {
                      label: 'Positions 91-100',
                      value: state.result.metrics_absolute.organic.pos_91_100,
                      key: 'pos_91_100',
                    },
                  ].map((item) => {
                    if (!state.result?.metrics_absolute) return null
                    const total = getAbsoluteTotal(state.result.metrics_absolute.organic)
                    return (
                      <div key={item.key} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground">{formatNumber(item.value)} mots-clés</span>
                        </div>
                        <Progress value={total > 0 ? (item.value / total) * 100 : 0} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              ) : (
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
              )}
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

          {/* Métriques Featured Snippet, Local Pack, AI Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Autres Types de Résultats</CardTitle>
              <CardDescription>Featured Snippets, Local Pack et AI Overview References</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {/* Featured Snippet */}
                <Card className="border-purple-500/20 bg-purple-500/5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Featured Snippets</CardTitle>
                    <Zap className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(state.result.metrics.featured_snippet?.count || 0)}
                    </div>
                    <p className="text-muted-foreground text-xs">mots-clés avec snippet</p>
                    {state.result.metrics.featured_snippet && state.result.metrics.featured_snippet.count > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Top 10</span>
                          <span className="font-medium">
                            {formatNumber(
                              state.result.metrics.featured_snippet.pos_1 +
                                state.result.metrics.featured_snippet.pos_2_3 +
                                state.result.metrics.featured_snippet.pos_4_10,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Trafic estimé</span>
                          <span className="font-medium">
                            {formatNumber(Math.round(state.result.metrics.featured_snippet.etv))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Valeur trafic</span>
                          <span className="font-medium">
                            {formatCurrency(state.result.metrics.featured_snippet.estimated_paid_traffic_cost)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Local Pack */}
                <Card className="border-blue-500/20 bg-blue-500/5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Local Pack</CardTitle>
                    <MapPin className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(state.result.metrics.local_pack?.count || 0)}
                    </div>
                    <p className="text-muted-foreground text-xs">mots-clés avec local pack</p>
                    {state.result.metrics.local_pack && state.result.metrics.local_pack.count > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Top 10</span>
                          <span className="font-medium">
                            {formatNumber(
                              state.result.metrics.local_pack.pos_1 +
                                state.result.metrics.local_pack.pos_2_3 +
                                state.result.metrics.local_pack.pos_4_10,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Trafic estimé</span>
                          <span className="font-medium">
                            {formatNumber(Math.round(state.result.metrics.local_pack.etv))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Valeur trafic</span>
                          <span className="font-medium">
                            {formatCurrency(state.result.metrics.local_pack.estimated_paid_traffic_cost)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Overview Reference */}
                <Card className="border-orange-500/20 bg-orange-500/5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Overview</CardTitle>
                    <Brain className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(state.result.metrics.ai_overview_reference?.count || 0)}
                    </div>
                    <p className="text-muted-foreground text-xs">références AI Overview</p>
                    {state.result.metrics.ai_overview_reference &&
                      state.result.metrics.ai_overview_reference.count > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Top 10</span>
                            <span className="font-medium">
                              {formatNumber(
                                state.result.metrics.ai_overview_reference.pos_1 +
                                  state.result.metrics.ai_overview_reference.pos_2_3 +
                                  state.result.metrics.ai_overview_reference.pos_4_10,
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Trafic estimé</span>
                            <span className="font-medium">
                              {formatNumber(Math.round(state.result.metrics.ai_overview_reference.etv))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Valeur trafic</span>
                            <span className="font-medium">
                              {formatCurrency(state.result.metrics.ai_overview_reference.estimated_paid_traffic_cost)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Position 1</span>
                            <span className="font-medium">
                              {formatNumber(state.result.metrics.ai_overview_reference.pos_1)}
                            </span>
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Table des mots-clés */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Mots-Clés</CardTitle>
                  <CardDescription>{formatNumber(state.result.items.length)} mots-clés trouvés</CardDescription>
                </div>
                {selectedKeywords.size > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Select
                        value={selectedProjectId}
                        onValueChange={setSelectedProjectId}
                        disabled={loadingProjects || saving}
                      >
                        <SelectTrigger className="bg-card border-border w-[250px]">
                          <SelectValue placeholder="Sélectionner un projet">
                            {projects.find((p) => p.id === selectedProjectId)?.url.replace(/^https?:\/\//, '') ||
                              'Sélectionner un projet'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="border-border bg-mist-800">
                          {projects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={project.id}
                              className="hover:cursor-pointer hover:bg-mist-700"
                            >
                              {project.url.replace(/^https?:\/\//, '')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleSaveKeywords}
                        disabled={saving || !selectedProjectId}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Sauvegarder ({selectedKeywords.size})
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            paginatedItems &&
                            paginatedItems.length > 0 &&
                            paginatedItems.every((_, idx) => {
                              const globalIndex = (currentPage - 1) * itemsPerPage + idx
                              return selectedKeywords.has(globalIndex)
                            })
                          }
                          onCheckedChange={toggleAllKeywords}
                        />
                      </TableHead>
                      <TableHead className="w-[40px]">Pos.</TableHead>
                      <TableHead>Mot-Clé</TableHead>
                      <TableHead className="w-[100px]">Volume</TableHead>
                      <TableHead className="w-[80px]">Difficulté</TableHead>
                      <TableHead className="w-[80px]">CPC</TableHead>
                      <TableHead className="w-[90px]">Compétition</TableHead>
                      <TableHead className="w-[100px]">Trafic Est.</TableHead>
                      <TableHead className="w-[80px]">Tendance</TableHead>
                      <TableHead className="w-[100px]">Intent</TableHead>
                      <TableHead className="w-[80px]">Backlinks</TableHead>
                      <TableHead className="w-[60px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems?.map((item, idx) => {
                      const globalIndex = (currentPage - 1) * itemsPerPage + idx
                      const isSelected = selectedKeywords.has(globalIndex)
                      return (
                        <TableRow key={idx} className={isSelected ? 'bg-primary/5' : ''}>
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleKeywordSelection(globalIndex)}
                            />
                          </TableCell>
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
                          <TableCell>
                            {item.keyword_data.keyword_info.cpc ? (
                              <span className="text-sm">${item.keyword_data.keyword_info.cpc.toFixed(2)}</span>
                            ) : (
                              <span className="text-muted-foreground text-xs">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={getCompetitionLevel(item.keyword_data.keyword_info.competition_level).color}
                              className="text-xs"
                            >
                              {getCompetitionLevel(item.keyword_data.keyword_info.competition_level).label}
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
                              {getIntentLabel(item.keyword_data.search_intent_info?.main_intent)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.keyword_data.avg_backlinks_info ? (
                              <div className="flex items-center gap-1 text-xs">
                                <Link2 className="h-3 w-3" />
                                {formatNumber(Math.round(item.keyword_data.avg_backlinks_info.backlinks))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <ShadcnButton variant="ghost" size="icon-sm" onClick={() => openKeywordDetail(item)}>
                              <Eye className="h-4 w-4" />
                            </ShadcnButton>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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

      {/* Dialog de détails du mot-clé */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="border-border max-w-7xl bg-mist-800">
          {selectedKeywordDetail && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedKeywordDetail.keyword_data.keyword}</DialogTitle>
                <DialogDescription>Analyse détaillée du mot-clé et de ses performances SEO</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-5 gap-2 bg-mist-700/50 p-1">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors hover:bg-mist-600/50"
                  >
                    Vue d&apos;ensemble
                  </TabsTrigger>
                  <TabsTrigger
                    value="trends"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors hover:bg-mist-600/50"
                  >
                    Tendances
                  </TabsTrigger>
                  <TabsTrigger
                    value="serp"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors hover:bg-mist-600/50"
                  >
                    SERP
                  </TabsTrigger>
                  <TabsTrigger
                    value="backlinks"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors hover:bg-mist-600/50"
                  >
                    Backlinks
                  </TabsTrigger>
                  <TabsTrigger
                    value="competition"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors hover:bg-mist-600/50"
                  >
                    Compétition
                  </TabsTrigger>
                </TabsList>

                {/* Vue d'ensemble */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Position</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{getRankGroup(selectedKeywordDetail)}</div>
                        <p className="text-muted-foreground text-xs">
                          {selectedKeywordDetail.ranked_serp_element.serp_item.rank_absolute
                            ? `Absolue: ${selectedKeywordDetail.ranked_serp_element.serp_item.rank_absolute}`
                            : 'N/A'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Volume de recherche</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatNumber(selectedKeywordDetail.keyword_data.keyword_info.search_volume)}
                        </div>
                        <p className="text-muted-foreground text-xs">recherches/mois</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Difficulté SEO</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {selectedKeywordDetail.keyword_data.keyword_properties.keyword_difficulty}
                        </div>
                        <p className="text-muted-foreground text-xs">sur 100</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Trafic estimé</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Math.round(getEtv(selectedKeywordDetail)).toLocaleString('fr-FR')}
                        </div>
                        <p className="text-muted-foreground text-xs">visites/mois</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Informations générales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Intention de recherche</span>
                        <Badge color="zinc">
                          {getIntentLabel(selectedKeywordDetail.keyword_data.search_intent_info?.main_intent)}
                        </Badge>
                      </div>
                      {selectedKeywordDetail.keyword_data.search_intent_info?.foreign_intent && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Intentions secondaires</span>
                          <div className="flex gap-1">
                            {selectedKeywordDetail.keyword_data.search_intent_info.foreign_intent.map((intent, idx) => (
                              <Badge key={idx} color="zinc" className="text-xs">
                                {getIntentLabel(intent)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Niveau de compétition</span>
                        <Badge
                          color={
                            getCompetitionLevel(selectedKeywordDetail.keyword_data.keyword_info.competition_level).color
                          }
                        >
                          {getCompetitionLevel(selectedKeywordDetail.keyword_data.keyword_info.competition_level).label}
                        </Badge>
                      </div>
                      {selectedKeywordDetail.keyword_data.keyword_info.cpc && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">CPC (Coût par clic)</span>
                          <span className="text-sm font-semibold">
                            ${selectedKeywordDetail.keyword_data.keyword_info.cpc.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {selectedKeywordDetail.keyword_data.keyword_properties.core_keyword && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Mot-clé principal</span>
                          <span className="text-sm">
                            {selectedKeywordDetail.keyword_data.keyword_properties.core_keyword}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {('title' in selectedKeywordDetail.ranked_serp_element.serp_item ||
                    'description' in selectedKeywordDetail.ranked_serp_element.serp_item) && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Résultat SERP</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {'title' in selectedKeywordDetail.ranked_serp_element.serp_item && (
                          <div>
                            <p className="text-sm font-medium">Titre</p>
                            <p className="text-sm">{selectedKeywordDetail.ranked_serp_element.serp_item.title}</p>
                          </div>
                        )}
                        {'description' in selectedKeywordDetail.ranked_serp_element.serp_item &&
                          selectedKeywordDetail.ranked_serp_element.serp_item.description && (
                            <div>
                              <p className="text-sm font-medium">Description</p>
                              <p className="text-muted-foreground text-sm">
                                {selectedKeywordDetail.ranked_serp_element.serp_item.description}
                              </p>
                            </div>
                          )}
                        {'url' in selectedKeywordDetail.ranked_serp_element.serp_item && (
                          <div>
                            <p className="text-sm font-medium">URL</p>
                            <a
                              href={selectedKeywordDetail.ranked_serp_element.serp_item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary flex items-center gap-1 text-sm hover:underline"
                            >
                              {selectedKeywordDetail.ranked_serp_element.serp_item.url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                        {'text' in selectedKeywordDetail.ranked_serp_element.serp_item && (
                          <div>
                            <p className="text-sm font-medium">Texte (AI Overview)</p>
                            <p className="text-muted-foreground text-sm">
                              {selectedKeywordDetail.ranked_serp_element.serp_item.text}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Tendances */}
                <TabsContent value="trends" className="space-y-4">
                  {selectedKeywordDetail.keyword_data.keyword_info.monthly_searches && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Évolution du volume de recherche (12 derniers mois)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedKeywordDetail.keyword_data.keyword_info.monthly_searches.map((search, idx) => (
                            <div key={idx} className="flex items-center justify-between border-b pb-2">
                              <span className="text-sm">
                                {new Date(search.year, search.month - 1).toLocaleDateString('fr-FR', {
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="font-semibold">{formatNumber(search.search_volume)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend) && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Tendances de volume</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-muted-foreground text-sm">Mensuel</p>
                            <p
                              className={`text-lg font-bold ${
                                getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                  .monthly > 0
                                  ? 'text-green-500'
                                  : getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                        .monthly < 0
                                    ? 'text-red-500'
                                    : ''
                              }`}
                            >
                              {getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                .monthly > 0
                                ? '+'
                                : ''}
                              {
                                getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                  .monthly
                              }
                              %
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground text-sm">Trimestriel</p>
                            <p
                              className={`text-lg font-bold ${
                                getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                  .quarterly > 0
                                  ? 'text-green-500'
                                  : getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                        .quarterly < 0
                                    ? 'text-red-500'
                                    : ''
                              }`}
                            >
                              {getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                .quarterly > 0
                                ? '+'
                                : ''}
                              {
                                getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                  .quarterly
                              }
                              %
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground text-sm">Annuel</p>
                            <p
                              className={`text-lg font-bold ${
                                getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                  .yearly > 0
                                  ? 'text-green-500'
                                  : getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                        .yearly < 0
                                    ? 'text-red-500'
                                    : ''
                              }`}
                            >
                              {getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                .yearly > 0
                                ? '+'
                                : ''}
                              {
                                getVolumeTrend(selectedKeywordDetail.keyword_data.keyword_info.search_volume_trend)!
                                  .yearly
                              }
                              %
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Évolution de position</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Position précédente</span>
                          <span className="text-sm">
                            {selectedKeywordDetail.ranked_serp_element.serp_item.rank_changes.previous_rank_absolute ||
                              'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Position actuelle</span>
                          <span className="text-sm font-semibold">
                            {selectedKeywordDetail.ranked_serp_element.serp_item.rank_absolute ||
                              getRankGroup(selectedKeywordDetail)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Statut</span>
                          <div className="flex items-center gap-2">
                            {selectedKeywordDetail.ranked_serp_element.serp_item.rank_changes.is_new && (
                              <Badge color="green">Nouveau</Badge>
                            )}
                            {selectedKeywordDetail.ranked_serp_element.serp_item.rank_changes.is_up && (
                              <Badge color="green">
                                <ArrowUp className="mr-1 h-3 w-3" />
                                En hausse
                              </Badge>
                            )}
                            {selectedKeywordDetail.ranked_serp_element.serp_item.rank_changes.is_down && (
                              <Badge color="red">
                                <ArrowDown className="mr-1 h-3 w-3" />
                                En baisse
                              </Badge>
                            )}
                            {!selectedKeywordDetail.ranked_serp_element.serp_item.rank_changes.is_new &&
                              !selectedKeywordDetail.ranked_serp_element.serp_item.rank_changes.is_up &&
                              !selectedKeywordDetail.ranked_serp_element.serp_item.rank_changes.is_down && (
                                <Badge color="zinc">Stable</Badge>
                              )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SERP */}
                <TabsContent value="serp" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Types de résultats SERP</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedKeywordDetail.ranked_serp_element.serp_item_types.map((type, idx) => (
                          <Badge key={idx} color="zinc">
                            {type.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Informations SERP</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Nombre total de résultats</span>
                        <span className="text-sm">
                          {formatNumber(Number(selectedKeywordDetail.ranked_serp_element.se_results_count))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Dernière mise à jour</span>
                        <span className="text-sm">
                          {new Date(
                            selectedKeywordDetail.ranked_serp_element.last_updated_time || '',
                          ).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {selectedKeywordDetail.ranked_serp_element.previous_updated_time && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Mise à jour précédente</span>
                          <span className="text-sm">
                            {new Date(
                              selectedKeywordDetail.ranked_serp_element.previous_updated_time,
                            ).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {'rank_info' in selectedKeywordDetail.ranked_serp_element.serp_item &&
                    selectedKeywordDetail.ranked_serp_element.serp_item.rank_info && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Ranking</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Page Rank</span>
                            <span className="text-sm font-semibold">
                              {selectedKeywordDetail.ranked_serp_element.serp_item.rank_info.page_rank || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Domain Rank</span>
                            <span className="text-sm font-semibold">
                              {selectedKeywordDetail.ranked_serp_element.serp_item.rank_info.main_domain_rank || 'N/A'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                </TabsContent>

                {/* Backlinks */}
                <TabsContent value="backlinks" className="space-y-4">
                  {selectedKeywordDetail.keyword_data.avg_backlinks_info && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Backlinks moyens (Top 10)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div>
                            <p className="text-muted-foreground text-xs">Total</p>
                            <p className="text-lg font-bold">
                              {formatNumber(
                                Math.round(selectedKeywordDetail.keyword_data.avg_backlinks_info.backlinks),
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Dofollow</p>
                            <p className="text-lg font-bold">
                              {formatNumber(Math.round(selectedKeywordDetail.keyword_data.avg_backlinks_info.dofollow))}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Pages référentes</p>
                            <p className="text-lg font-bold">
                              {formatNumber(
                                Math.round(selectedKeywordDetail.keyword_data.avg_backlinks_info.referring_pages),
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Domaines référents</p>
                            <p className="text-lg font-bold">
                              {formatNumber(
                                Math.round(selectedKeywordDetail.keyword_data.avg_backlinks_info.referring_domains),
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-muted-foreground text-xs">Rank moyen</p>
                            <p className="text-lg font-bold">
                              {Math.round(selectedKeywordDetail.keyword_data.avg_backlinks_info.rank)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Domain Rank moyen</p>
                            <p className="text-lg font-bold">
                              {Math.round(selectedKeywordDetail.keyword_data.avg_backlinks_info.main_domain_rank)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {'backlinks_info' in selectedKeywordDetail.ranked_serp_element.serp_item &&
                    selectedKeywordDetail.ranked_serp_element.serp_item.backlinks_info && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Backlinks de cette page</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                            <div>
                              <p className="text-muted-foreground text-xs">Total</p>
                              <p className="text-lg font-bold">
                                {formatNumber(
                                  selectedKeywordDetail.ranked_serp_element.serp_item.backlinks_info.backlinks,
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Dofollow</p>
                              <p className="text-lg font-bold">
                                {formatNumber(
                                  selectedKeywordDetail.ranked_serp_element.serp_item.backlinks_info.dofollow,
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Pages</p>
                              <p className="text-lg font-bold">
                                {formatNumber(
                                  selectedKeywordDetail.ranked_serp_element.serp_item.backlinks_info.referring_pages,
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Domaines</p>
                              <p className="text-lg font-bold">
                                {formatNumber(
                                  selectedKeywordDetail.ranked_serp_element.serp_item.backlinks_info.referring_domains,
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Main Domains</p>
                              <p className="text-lg font-bold">
                                {formatNumber(
                                  selectedKeywordDetail.ranked_serp_element.serp_item.backlinks_info
                                    .referring_main_domains,
                                )}
                              </p>
                            </div>
                          </div>
                          {selectedKeywordDetail.ranked_serp_element.serp_item.backlinks_info.time_update && (
                            <p className="text-muted-foreground mt-4 text-xs">
                              Dernière mise à jour :{' '}
                              {new Date(
                                selectedKeywordDetail.ranked_serp_element.serp_item.backlinks_info.time_update,
                              ).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                </TabsContent>

                {/* Compétition */}
                <TabsContent value="competition" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Données de compétition</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedKeywordDetail.keyword_data.keyword_info.low_top_of_page_bid && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Enchère min. (Top of Page)</span>
                          <span className="text-sm font-semibold">
                            ${selectedKeywordDetail.keyword_data.keyword_info.low_top_of_page_bid.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {selectedKeywordDetail.keyword_data.keyword_info.high_top_of_page_bid && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Enchère max. (Top of Page)</span>
                          <span className="text-sm font-semibold">
                            ${selectedKeywordDetail.keyword_data.keyword_info.high_top_of_page_bid.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {selectedKeywordDetail.keyword_data.keyword_info.cpc && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">CPC moyen</span>
                          <span className="text-sm font-semibold">
                            ${selectedKeywordDetail.keyword_data.keyword_info.cpc.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Niveau de compétition</span>
                        <Badge
                          color={
                            getCompetitionLevel(selectedKeywordDetail.keyword_data.keyword_info.competition_level).color
                          }
                        >
                          {getCompetitionLevel(selectedKeywordDetail.keyword_data.keyword_info.competition_level).label}
                        </Badge>
                      </div>
                      {selectedKeywordDetail.keyword_data.keyword_info.competition !== null && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Score de compétition</span>
                          <span className="text-sm font-semibold">
                            {selectedKeywordDetail.keyword_data.keyword_info.competition.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

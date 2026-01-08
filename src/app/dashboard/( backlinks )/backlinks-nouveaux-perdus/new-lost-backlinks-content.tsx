// 📁 app/dashboard/backlinks/nouveaux-perdus/new-lost-backlinks-content.tsx
'use client'

import { Button, SoftButton } from '@/components/elements/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SpinnerCustom } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  LineChart,
  Loader2,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useActionState, useMemo, useState, useTransition } from 'react'
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

type SortField =
  | 'date'
  | 'new_backlinks'
  | 'lost_backlinks'
  | 'net_backlinks'
  | 'new_domains'
  | 'lost_domains'
  | 'net_domains'
type SortDirection = 'asc' | 'desc'
type PeriodFilter = 'all' | '7d' | '30d' | '60d' | '90d'

// Composant pour l'en-tête de colonne triable (défini en dehors du composant principal)
const SortableHeader = ({
  field,
  children,
  sortField,
  sortDirection,
  onSort,
}: {
  field: SortField
  children: React.ReactNode
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}) => (
  <TableHead className="hover:bg-muted/50 cursor-pointer text-right select-none" onClick={() => onSort(field)}>
    <div className="flex items-center justify-end gap-1">
      {children}
      {sortField === field &&
        (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      {sortField !== field && <ArrowUpDown className="h-3 w-3 opacity-30" />}
    </div>
  </TableHead>
)

export function NewLostBacklinksContent() {
  const initialState: NewLostBacklinksState = { success: false }
  const [state, formAction, isPending] = useActionState(fetchNewLostBacklinks, initialState)
  const [isTransitionPending, startTransition] = useTransition()

  // États pour la pagination, le tri et les filtres
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all')

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
    // Réinitialiser la pagination lors d'une nouvelle recherche
    setCurrentPage(1)
    setPeriodFilter('all')
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

  // Filtrage, tri et pagination des données
  const processedData = useMemo(() => {
    if (!state.result?.items) return null

    let items = [...state.result.items]

    // Appliquer le filtre de période
    if (periodFilter !== 'all') {
      const now = new Date()
      const daysMap = { '7d': 7, '30d': 30, '60d': 60, '90d': 90 }
      const days = daysMap[periodFilter]
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

      items = items.filter((item) => new Date(item.date) >= cutoffDate)
    }

    // Appliquer le tri
    items.sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (sortField) {
        case 'date':
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case 'new_backlinks':
          aValue = a.new_backlinks
          bValue = b.new_backlinks
          break
        case 'lost_backlinks':
          aValue = a.lost_backlinks
          bValue = b.lost_backlinks
          break
        case 'net_backlinks':
          aValue = a.new_backlinks - a.lost_backlinks
          bValue = b.new_backlinks - b.lost_backlinks
          break
        case 'new_domains':
          aValue = a.new_referring_domains
          bValue = b.new_referring_domains
          break
        case 'lost_domains':
          aValue = a.lost_referring_domains
          bValue = b.lost_referring_domains
          break
        case 'net_domains':
          aValue = a.new_referring_domains - a.lost_referring_domains
          bValue = b.new_referring_domains - b.lost_referring_domains
          break
        default:
          aValue = 0
          bValue = 0
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    // Calculer la pagination
    const totalItems = items.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedItems = items.slice(startIndex, endIndex)

    return {
      items: paginatedItems,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      allItems: items, // Pour l'export CSV
    }
  }, [state.result, periodFilter, sortField, sortDirection, currentPage, itemsPerPage])

  // Fonction pour changer le tri
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1) // Réinitialiser à la première page
  }

  // Fonction pour exporter en CSV
  const exportToCSV = () => {
    if (!processedData?.allItems) return

    const headers = ['Date', 'Nouveaux BL', 'Perdus BL', 'Net BL', 'Nouveaux Dom.', 'Perdus Dom.', 'Net Dom.']
    const rows = processedData.allItems.map((item) => {
      const netBacklinks = item.new_backlinks - item.lost_backlinks
      const netDomains = item.new_referring_domains - item.lost_referring_domains
      return [
        formatDate(item.date),
        item.new_backlinks.toString(),
        item.lost_backlinks.toString(),
        netBacklinks.toString(),
        item.new_referring_domains.toString(),
        item.lost_referring_domains.toString(),
        netDomains.toString(),
      ]
    })

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `backlinks-evolution-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
    <div className="container mx-auto ">
      {/* Header */}

      {/* Formulaire */}
      <Card className="my-6">
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
          {/* Insights et recommandations SEO */}
          <Card className="border-primary/20 bg-primary/5 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="text-primary h-5 w-5" />
                Analyse SEO Professionnelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Taux de croissance */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Taux de Croissance</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-muted-foreground text-xs">Backlinks</p>
                      <p
                        className={`text-lg font-bold ${
                          aggregatedMetrics.netBacklinks > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {aggregatedMetrics.totalLostBacklinks > 0
                          ? ((aggregatedMetrics.netBacklinks / aggregatedMetrics.totalLostBacklinks) * 100).toFixed(1)
                          : '0'}
                        %
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-muted-foreground text-xs">Domaines</p>
                      <p
                        className={`text-lg font-bold ${
                          aggregatedMetrics.netDomains > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {aggregatedMetrics.totalLostDomains > 0
                          ? ((aggregatedMetrics.netDomains / aggregatedMetrics.totalLostDomains) * 100).toFixed(1)
                          : '0'}
                        %
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ratio acquisition/perte */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Ratio Acquisition/Perte</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-muted-foreground text-xs">Backlinks</p>
                      <p className="text-lg font-bold">
                        {aggregatedMetrics.totalLostBacklinks > 0
                          ? (aggregatedMetrics.totalNewBacklinks / aggregatedMetrics.totalLostBacklinks).toFixed(2)
                          : '∞'}
                        :1
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-muted-foreground text-xs">Domaines</p>
                      <p className="text-lg font-bold">
                        {aggregatedMetrics.totalLostDomains > 0
                          ? (aggregatedMetrics.totalNewDomains / aggregatedMetrics.totalLostDomains).toFixed(2)
                          : '∞'}
                        :1
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommandations */}
              <div className="bg-background mt-4 space-y-2 rounded-lg p-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  {aggregatedMetrics.netBacklinks > 0 ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                      ✓
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      !
                    </span>
                  )}
                  Recommandations
                </h4>
                <ul className="text-muted-foreground ml-8 space-y-1 text-sm">
                  {aggregatedMetrics.netBacklinks > 0 ? (
                    <>
                      <li>• Votre profil de backlinks est en croissance positive</li>
                      <li>• Continuez vos efforts d&apos;acquisition de liens</li>
                      <li>• Surveillez la qualité des nouveaux domaines référents</li>
                    </>
                  ) : (
                    <>
                      <li>• Votre profil perd plus de backlinks qu&apos;il n&apos;en gagne</li>
                      <li>• Analysez les backlinks perdus pour identifier les causes</li>
                      <li>• Renforcez votre stratégie de link building</li>
                    </>
                  )}
                  {aggregatedMetrics.totalNewMainDomains / (aggregatedMetrics.totalNewDomains || 1) < 0.3 && (
                    <li>• Diversifiez vos sources de backlinks (peu de domaines principaux)</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

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

          {/* Table des données avec filtres et pagination */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Données Détaillées</CardTitle>
                  <CardDescription>
                    {processedData?.totalItems || 0} période(s) {periodFilter !== 'all' && 'filtrée(s)'}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Filtre de période */}
                  <div className="flex items-center gap-2">
                    <Filter className="text-muted-foreground h-4 w-4" />
                    <Select
                      value={periodFilter}
                      onValueChange={(value: PeriodFilter) => {
                        setPeriodFilter(value)
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-mist-600">
                        <SelectItem value="all" className="hover:cursor-pointer hover:bg-mist-500">
                          Tout
                        </SelectItem>
                        <SelectItem value="7d" className="hover:cursor-pointer hover:bg-mist-500">
                          7 derniers jours
                        </SelectItem>
                        <SelectItem value="30d" className="hover:cursor-pointer hover:bg-mist-500">
                          30 derniers jours
                        </SelectItem>
                        <SelectItem value="60d" className="hover:cursor-pointer hover:bg-mist-500">
                          60 derniers jours
                        </SelectItem>
                        <SelectItem value="90d" className="hover:cursor-pointer hover:bg-mist-500">
                          90 derniers jours
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bouton Export CSV */}
                  <SoftButton onClick={exportToCSV} disabled={!processedData?.allItems?.length}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </SoftButton>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {processedData && processedData.items.length > 0 ? (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            className="hover:bg-muted/50 cursor-pointer select-none"
                            onClick={() => handleSort('date')}
                          >
                            <div className="flex items-center gap-1">
                              Date
                              {sortField === 'date' &&
                                (sortDirection === 'asc' ? (
                                  <ArrowUp className="h-3 w-3" />
                                ) : (
                                  <ArrowDown className="h-3 w-3" />
                                ))}
                              {sortField !== 'date' && <ArrowUpDown className="h-3 w-3 opacity-30" />}
                            </div>
                          </TableHead>
                          <SortableHeader
                            field="new_backlinks"
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          >
                            Nouveaux BL
                          </SortableHeader>
                          <SortableHeader
                            field="lost_backlinks"
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          >
                            Perdus BL
                          </SortableHeader>
                          <SortableHeader
                            field="net_backlinks"
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          >
                            Net BL
                          </SortableHeader>
                          <SortableHeader
                            field="new_domains"
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          >
                            Nouveaux Dom.
                          </SortableHeader>
                          <SortableHeader
                            field="lost_domains"
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          >
                            Perdus Dom.
                          </SortableHeader>
                          <SortableHeader
                            field="net_domains"
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          >
                            Net Dom.
                          </SortableHeader>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {processedData.items.map((item, idx) => {
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

                  {/* Contrôles de pagination */}
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">Lignes par page:</span>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                          setItemsPerPage(Number(value))
                          setCurrentPage(1)
                        }}
                      >
                        <SelectTrigger className="w-[70px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-mist-600">
                          <SelectItem value="5" className="hover:cursor-pointer hover:bg-mist-500">
                            5
                          </SelectItem>
                          <SelectItem value="10" className="hover:cursor-pointer hover:bg-mist-500">
                            10
                          </SelectItem>
                          <SelectItem value="20" className="hover:cursor-pointer hover:bg-mist-500">
                            20
                          </SelectItem>
                          <SelectItem value="50" className="hover:cursor-pointer hover:bg-mist-500">
                            50
                          </SelectItem>
                          <SelectItem value="100" className="hover:cursor-pointer hover:bg-mist-500">
                            100
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground text-sm">
                        {processedData.startIndex + 1}-{Math.min(processedData.endIndex, processedData.totalItems)} sur{' '}
                        {processedData.totalItems}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <SoftButton onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                      </SoftButton>
                      <span className="text-muted-foreground text-sm">
                        Page {currentPage} sur {processedData.totalPages}
                      </span>
                      <SoftButton
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === processedData.totalPages}
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </SoftButton>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  Aucune donnée disponible pour cette période
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

// Organic Keywords Content - Professional SEO Dashboard
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable } from '@/components/dashboard/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Eye,
  MousePointerClick,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchOrganicKeywords, type KeywordData } from './action'

interface Props {
  projectId: string
}

interface OrganicKeywordsData {
  success: boolean
  keywords?: KeywordData[]
  stats?: {
    totalKeywords: number
    totalClicks: number
    totalImpressions: number
    avgCTR: number
    avgPosition: number
    topPerformers: number
    firstPageKeywords: number
    newKeywords: number
    improvingKeywords: number
  }
  error?: string
}

export function OrganicKeywordsContent({ projectId }: Props) {
  const [data, setData] = useState<OrganicKeywordsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtres (état réservé pour future UI de filtre/tri ; setters non utilisés pour l'instant)
  /* eslint-disable @typescript-eslint/no-unused-vars -- setters réservés pour future UI */
  const [searchQuery, setSearchQuery] = useState('')
  const [positionFilter, setPositionFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'clicks' | 'impressions' | 'ctr' | 'position'>('clicks')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const loadData = useCallback(async () => {
    if (!projectId) {
      setError('Aucun projet sélectionné')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchOrganicKeywords(projectId)
      if (result.success && result.keywords && result.stats) {
        setData(result as OrganicKeywordsData)
      } else {
        setError(result.error || 'Erreur de chargement des données')
        setData(null)
      }
    } catch (err) {
      console.error('Erreur loadData:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des données. Vérifiez que votre site est connecté à Google Search Console.',
      )
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Filtrage et tri (filteredKeywords réservé pour future utilisation dans la DataTable)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- réservé pour filtre/tri UI
  const filteredKeywords =
    data?.keywords
      ?.filter((k: KeywordData) => {
        // Recherche
        if (searchQuery && !k.query.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }

        // Position
        if (positionFilter === 'top3' && k.position > 3) return false
        if (positionFilter === 'top10' && k.position > 10) return false
        if (positionFilter === 'top20' && k.position > 20) return false
        if (positionFilter === 'top50' && k.position > 50) return false

        return true
      })
      .sort((a: KeywordData, b: KeywordData) => {
        const aValue = a[sortBy]
        const bValue = b[sortBy]

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        }
        return aValue < bValue ? 1 : -1
      }) || []

  // Columns definition for DataTable - MUST be before any conditional returns
  const columns: ColumnDef<KeywordData>[] = useMemo(
    () => [
      {
        accessorKey: 'query',
        header: 'Mot-clé',
        cell: ({ row }) => {
          const keyword = row.original
          return (
            <div className="flex items-center gap-2">
              <span className="font-medium">{keyword.query}</span>
              <div className="flex gap-1">
                {keyword.isNew && (
                  <Badge color="zinc" className="text-[10px]">Nouveau</Badge>
                )}
                {keyword.isImproving && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                    <ArrowUp className="h-3 w-3 text-emerald-400" />
                  </span>
                )}
                {keyword.isDecreasing && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10">
                    <ArrowDown className="h-3 w-3 text-red-400" />
                  </span>
                )}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'clicks',
        header: 'Clics',
        cell: ({ row }) => (
          <div className="text-right">
            <span className="font-semibold tabular-nums">{row.original.clicks.toLocaleString('fr-FR')}</span>
            {Math.abs(row.original.clicksChange) > 5 && (
              <div className={`mt-0.5 text-xs ${row.original.clicksChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {row.original.clicksChange > 0 ? '+' : ''}{row.original.clicksChange.toFixed(0)}%
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'impressions',
        header: 'Impressions',
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">{row.original.impressions.toLocaleString('fr-FR')}</span>
        ),
      },
      {
        accessorKey: 'ctr',
        header: 'CTR',
        cell: ({ row }) => {
          const ctr = row.original.ctr * 100
          return (
            <span className={`tabular-nums ${ctr >= 5 ? 'text-emerald-400' : ctr >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              {ctr.toFixed(2)}%
            </span>
          )
        },
      },
      {
        accessorKey: 'position',
        header: 'Position',
        cell: ({ row }) => {
          const pos = row.original.position
          let colorClass = 'text-muted-foreground bg-muted/50'
          if (pos <= 3) colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
          else if (pos <= 10) colorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/20'
          else if (pos <= 20) colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20'
          else colorClass = 'text-red-400 bg-red-500/10 border-red-500/20'

          return (
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${colorClass}`}>
              #{pos.toFixed(1)}
            </span>
          )
        },
      },
      {
        accessorKey: 'positionChange',
        header: 'Évolution',
        cell: ({ row }) => {
          const change = row.original.positionChange
          if (Math.abs(change) <= 0.5) return <span className="text-muted-foreground">-</span>
          const isPositive = change > 0
          return (
            <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              <span className="text-xs font-medium">{Math.abs(change).toFixed(1)}</span>
            </div>
          )
        },
      },
    ],
    []
  )

  // Export CSV (réservé pour bouton d'export futur)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- réservé pour UI d'export
  const exportToCSV = () => {
    if (!data?.keywords) return

    const headers = [
      'Mot-clé',
      'Clics',
      'Impressions',
      'CTR (%)',
      'Position',
      'Évolution Clics (%)',
      'Évolution Position',
    ]
    const rows = data.keywords.map((k: KeywordData) => [
      k.query,
      k.clicks,
      k.impressions,
      (k.ctr * 100).toFixed(2),
      k.position.toFixed(1),
      k.clicksChange.toFixed(1),
      k.positionChange.toFixed(1),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `keywords-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Loading state with premium design
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-linear-to-b from-mist-800/40 to-mist-900/40 p-16">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute h-14 w-14 animate-spin rounded-full border-2 border-transparent border-t-primary" />
            <div className="absolute h-10 w-10 animate-spin rounded-full border-2 border-transparent border-t-primary/50 [animation-direction:reverse] [animation-duration:1.5s]" />
          </div>
        </div>
        <p className="text-sm font-medium text-foreground">Chargement des données...</p>
        <p className="mt-1 text-xs text-muted-foreground">Récupération depuis Google Search Console</p>
      </div>
    )
  }

  // Error state with premium design
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-linear-to-b from-red-500/5 to-transparent p-8">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-lg" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-red-400">Erreur de chargement</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>

            <div className="mt-4 rounded-lg border border-white/5 bg-white/5 p-4">
              <p className="text-sm font-medium text-foreground">Vérifications à effectuer :</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Assurez-vous que votre site est vérifié dans Google Search Console
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Vérifiez que vous avez connecté votre compte Google avec les bonnes permissions
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Attendez au moins 48h après l&apos;ajout de votre site dans GSC
                </li>
              </ul>
            </div>

            <Button onClick={loadData} size="sm" variant="outline" className="mt-4 border-white/10 bg-white/5 hover:bg-white/10">
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!data?.keywords || data.keywords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 p-16">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-muted/20 blur-xl" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-muted/50">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
        </div>
        <p className="text-sm font-medium text-foreground">Aucun mot-clé trouvé</p>
        <p className="mt-1 max-w-sm text-center text-xs text-muted-foreground">
          Vérifiez que votre site est bien indexé dans Google Search Console
        </p>
      </div>
    )
  }

  const stats = data.stats
  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 p-16">
        <AlertTriangle className="mb-4 h-12 w-12 text-amber-400" />
        <p className="font-medium text-foreground">Données incomplètes</p>
        <p className="mt-1 text-sm text-muted-foreground">Les statistiques ne sont pas disponibles</p>
      </div>
    )
  }

  const opportunities = data.keywords?.filter((k: KeywordData) => k.opportunity === 'high') || []
  const improving = data.keywords?.filter((k: KeywordData) => k.isImproving) || []
  const decreasing = data.keywords?.filter((k: KeywordData) => k.isDecreasing) || []

  return (
    <div className="space-y-6">
      {/* Premium Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Keywords */}
        <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-500/20 bg-linear-to-br from-blue-500/10 via-mist-800/90 to-mist-900/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl transition-all duration-500 group-hover:bg-blue-500/30" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between border-b border-blue-500/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total mots-clés</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 ring-2 ring-blue-500/10">
                <Search className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <p className="text-4xl font-bold tracking-tight text-blue-400">{stats.totalKeywords.toLocaleString('fr-FR')}</p>
            <div className="mt-3 flex items-center gap-4 text-xs">
              <div className="rounded-lg bg-emerald-500/10 px-2 py-1">
                <span className="text-muted-foreground">Top 3: </span>
                <span className="font-bold text-emerald-400">{stats.topPerformers}</span>
              </div>
              <div className="rounded-lg bg-blue-500/10 px-2 py-1">
                <span className="text-muted-foreground">Page 1: </span>
                <span className="font-bold text-blue-400">{stats.firstPageKeywords}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="group relative overflow-hidden rounded-2xl border-2 border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-mist-800/90 to-mist-900/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/30" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between border-b border-emerald-500/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Clics totaux</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 ring-2 ring-emerald-500/10">
                <MousePointerClick className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-4xl font-bold tracking-tight text-emerald-400">{stats.totalClicks.toLocaleString('fr-FR')}</p>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              CTR moyen: <span className="font-bold text-emerald-400">{(stats.avgCTR * 100).toFixed(2)}%</span>
            </p>
          </div>
        </div>

        {/* Total Impressions */}
        <div className="group relative overflow-hidden rounded-2xl border-2 border-purple-500/20 bg-linear-to-br from-purple-500/10 via-mist-800/90 to-mist-900/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl transition-all duration-500 group-hover:bg-purple-500/30" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between border-b border-purple-500/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Impressions</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 ring-2 ring-purple-500/10">
                <Eye className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <p className="text-4xl font-bold tracking-tight text-purple-400">{stats.totalImpressions.toLocaleString('fr-FR')}</p>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              <span className="font-bold text-blue-400">{stats.newKeywords}</span> nouveaux mots-clés
            </p>
          </div>
        </div>

        {/* Average Position */}
        <div className="group relative overflow-hidden rounded-2xl border-2 border-orange-500/20 bg-linear-to-br from-orange-500/10 via-mist-800/90 to-mist-900/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl transition-all duration-500 group-hover:bg-orange-500/30" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between border-b border-orange-500/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Position moyenne</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 ring-2 ring-orange-500/10">
                <Target className="h-5 w-5 text-orange-400" />
              </div>
            </div>
            <p className="text-4xl font-bold tracking-tight text-orange-400">{stats.avgPosition.toFixed(1)}</p>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              <span className="font-bold text-emerald-400">{stats.improvingKeywords}</span> en amélioration
            </p>
          </div>
        </div>
      </div>

      {/* Tabs with DataTable */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="bg-mist-900/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Tous ({data.keywords?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Opportunités ({opportunities.length})
            </TabsTrigger>
            <TabsTrigger value="improving" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              En progression ({improving.length})
            </TabsTrigger>
            <TabsTrigger value="decreasing" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              En baisse ({decreasing.length})
            </TabsTrigger>
          </TabsList>

          <Button onClick={loadData} variant="outline" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>

        {/* All Keywords Tab */}
        <TabsContent value="all" className="space-y-4">
          <DataTable
            columns={columns}
            data={data.keywords || []}
            searchKey="query"
            searchPlaceholder="Rechercher un mot-clé..."
            exportFilename={`keywords-${new Date().toISOString().split('T')[0]}`}
            pageSize={25}
            pageSizeOptions={[10, 25, 50, 100, 250, 500]}
            showColumnToggle={true}
            showExport={true}
            showSearch={true}
          />
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="rounded-xl border border-blue-500/20 bg-linear-to-r from-blue-500/10 to-transparent p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                <Sparkles className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Opportunités d&apos;amélioration</p>
                <p className="text-sm text-muted-foreground">Mots-clés positions 4-20 avec fort potentiel de clics</p>
              </div>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={opportunities}
            searchKey="query"
            searchPlaceholder="Rechercher une opportunité..."
            exportFilename={`opportunities-${new Date().toISOString().split('T')[0]}`}
            pageSize={25}
            pageSizeOptions={[10, 25, 50, 100, 250]}
            emptyMessage="Aucune opportunité détectée"
            emptyDescription="Les opportunités apparaîtront ici lorsque des mots-clés avec potentiel seront identifiés."
            showColumnToggle={true}
            showExport={true}
            showSearch={true}
          />
        </TabsContent>

        {/* Improving Tab */}
        <TabsContent value="improving" className="space-y-4">
          <div className="rounded-xl border border-emerald-500/20 bg-linear-to-r from-emerald-500/10 to-transparent p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Mots-clés en progression</p>
                <p className="text-sm text-muted-foreground">Amélioration significative de position ou clics</p>
              </div>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={improving}
            searchKey="query"
            searchPlaceholder="Rechercher..."
            exportFilename={`improving-${new Date().toISOString().split('T')[0]}`}
            pageSize={25}
            pageSizeOptions={[10, 25, 50, 100, 250]}
            emptyMessage="Aucun mot-clé en progression"
            emptyDescription="Les mots-clés en amélioration apparaîtront ici."
            showColumnToggle={true}
            showExport={true}
            showSearch={true}
          />
        </TabsContent>

        {/* Decreasing Tab */}
        <TabsContent value="decreasing" className="space-y-4">
          <div className="rounded-xl border border-red-500/20 bg-linear-to-r from-red-500/10 to-transparent p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Mots-clés en baisse</p>
                <p className="text-sm text-muted-foreground">Nécessitent une attention immédiate</p>
              </div>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={decreasing}
            searchKey="query"
            searchPlaceholder="Rechercher..."
            exportFilename={`decreasing-${new Date().toISOString().split('T')[0]}`}
            pageSize={25}
            pageSizeOptions={[10, 25, 50, 100, 250]}
            emptyMessage="Aucun mot-clé en baisse"
            emptyDescription="Bonne nouvelle ! Aucun mot-clé n'est en baisse significative."
            showColumnToggle={true}
            showExport={true}
            showSearch={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// 📁 components/keywords/organic-keywords-content.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  Filter,
  Loader2,
  MousePointerClick,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchOrganicKeywords, type KeywordData } from './action'

interface Props {
  projectId: string
}

interface OrganicKeywordsData {
  success: boolean
  keywords: KeywordData[]
  stats: {
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

  // Filtres
  const [searchQuery, setSearchQuery] = useState('')
  const [positionFilter, setPositionFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'clicks' | 'impressions' | 'ctr' | 'position'>('clicks')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const loadData = async () => {
    if (!projectId) {
      setError('Aucun projet sélectionné')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchOrganicKeywords(projectId)
      if (result.success) {
        setData(result)
      } else {
        setError(result.error || 'Erreur de chargement des données')
      }
    } catch (err) {
      console.error('Erreur loadData:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des données. Vérifiez que votre site est connecté à Google Search Console.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [projectId])

  // Filtrage et tri
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

  // Export CSV
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
          <p className="mt-4 font-medium">Chargement des données...</p>
          <p className="text-muted-foreground mt-2 text-sm">Récupération depuis Google Search Console</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-destructive mt-0.5 h-5 w-5" />
            <div className="flex-1">
              <p className="text-destructive font-semibold">Erreur de chargement</p>
              <p className="text-muted-foreground mt-1 text-sm">{error}</p>

              <div className="border-border bg-card mt-4 rounded-lg border p-4">
                <p className="text-sm font-medium">Vérifications à effectuer :</p>
                <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                  <li>• Assurez-vous que votre site est vérifié dans Google Search Console</li>
                  <li>• Vérifiez que vous avez connecté votre compte Google avec les bonnes permissions</li>
                  <li>• Attendez au moins 48h après l&apos;ajout de votre site dans GSC</li>
                  <li>• Vérifiez que votre projet contient une URL valide</li>
                </ul>
              </div>

              <Button onClick={loadData} size="sm" variant="outline" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data?.keywords || data.keywords.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Search className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <p className="mt-4 font-medium">Aucun mot-clé trouvé</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Vérifiez que votre site est bien indexé dans Google Search Console
          </p>
        </CardContent>
      </Card>
    )
  }

  const stats = data.stats
  const opportunities = data.keywords.filter((k: KeywordData) => k.opportunity === 'high')
  const improving = data.keywords.filter((k: KeywordData) => k.isImproving)
  const decreasing = data.keywords.filter((k: KeywordData) => k.isDecreasing)

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Statistiques globales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total mots-clés</CardTitle>
              <Search className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalKeywords.toLocaleString('fr-FR')}</div>
              <div className="mt-2 flex items-center gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Top 3: </span>
                  <span className="font-semibold text-green-600">{stats.topPerformers}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Page 1: </span>
                  <span className="font-semibold text-blue-600">{stats.firstPageKeywords}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clics totaux</CardTitle>
              <MousePointerClick className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalClicks.toLocaleString('fr-FR')}</div>
              <p className="text-muted-foreground mt-2 text-xs">CTR moyen: {(stats.avgCTR * 100).toFixed(2)}%</p>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impressions totales</CardTitle>
              <Eye className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalImpressions.toLocaleString('fr-FR')}</div>
              <p className="text-muted-foreground mt-2 text-xs">{stats.newKeywords} nouveaux mots-clés</p>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Position moyenne</CardTitle>
              <Target className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.avgPosition.toFixed(1)}</div>
              <p className="text-muted-foreground mt-2 text-xs">{stats.improvingKeywords} en amélioration</p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="all">Tous ({data.keywords.length})</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunités ({opportunities.length})</TabsTrigger>
              <TabsTrigger value="improving">En progression ({improving.length})</TabsTrigger>
              <TabsTrigger value="decreasing">En baisse ({decreasing.length})</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button onClick={loadData} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Filtres */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <CardTitle className="text-base">Filtres et tri</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rechercher</label>
                  <Input
                    placeholder="Mot-clé..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Select value={positionFilter} onValueChange={setPositionFilter}>
                    <SelectTrigger className="hover:cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-mist-600">
                      <SelectItem value="all" className="hover:cursor-pointer hover:bg-mist-500">
                        Toutes positions
                      </SelectItem>
                      <SelectItem value="top3" className="hover:cursor-pointer hover:bg-mist-500">
                        Top 3
                      </SelectItem>
                      <SelectItem value="top10" className="hover:cursor-pointer hover:bg-mist-500">
                        Top 10
                      </SelectItem>
                      <SelectItem value="top20" className="hover:cursor-pointer hover:bg-mist-500">
                        Top 20
                      </SelectItem>
                      <SelectItem value="top50" className="hover:cursor-pointer hover:bg-mist-500">
                        Top 50
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trier par</label>
                  <Select
                    value={sortBy}
                    onValueChange={(v) => setSortBy(v as 'clicks' | 'impressions' | 'ctr' | 'position')}
                  >
                    <SelectTrigger className="hover:cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-mist-600">
                      <SelectItem value="clicks" className="hover:cursor-pointer hover:bg-mist-500">
                        Clics
                      </SelectItem>
                      <SelectItem value="impressions" className="hover:cursor-pointer hover:bg-mist-500">
                        Impressions
                      </SelectItem>
                      <SelectItem value="ctr" className="hover:cursor-pointer hover:bg-mist-500">
                        CTR
                      </SelectItem>
                      <SelectItem value="position" className="hover:cursor-pointer hover:bg-mist-500">
                        Position
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ordre</label>
                  <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'asc' | 'desc')}>
                    <SelectTrigger className="hover:cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-mist-600">
                      <SelectItem value="desc" className="hover:cursor-pointer hover:bg-mist-500">
                        Décroissant
                      </SelectItem>
                      <SelectItem value="asc" className="hover:cursor-pointer hover:bg-mist-500">
                        Croissant
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(searchQuery || positionFilter !== 'all') && (
                <div className="mt-4 flex items-center gap-2">
                  <Badge color="zinc">
                    {filteredKeywords.length} résultat
                    {filteredKeywords.length > 1 ? 's' : ''}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSearchQuery('')
                      setPositionFilter('all')
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Onglet Tous */}
          <TabsContent value="all" className="space-y-6">
            <KeywordsTable keywords={filteredKeywords} />
          </TabsContent>

          {/* Onglet Opportunités */}
          <TabsContent value="opportunities" className="space-y-6">
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-blue-900 dark:text-blue-100">Opportunités d&apos;amélioration</CardTitle>
                </div>
                <CardDescription>
                  Mots-clés avec fort potentiel de progression (positions 4-20 avec bonnes impressions)
                </CardDescription>
              </CardHeader>
            </Card>
            <KeywordsTable keywords={opportunities} showOpportunity />
          </TabsContent>

          {/* Onglet En progression */}
          <TabsContent value="improving" className="space-y-6">
            <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-green-900 dark:text-green-100">Mots-clés en progression</CardTitle>
                </div>
                <CardDescription>Mots-clés avec amélioration significative de position ou clics</CardDescription>
              </CardHeader>
            </Card>
            <KeywordsTable keywords={improving} />
          </TabsContent>

          {/* Onglet En baisse */}
          <TabsContent value="decreasing" className="space-y-6">
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-red-900 dark:text-red-100">Mots-clés en baisse</CardTitle>
                </div>
                <CardDescription>Mots-clés nécessitant une attention immédiate</CardDescription>
              </CardHeader>
            </Card>
            <KeywordsTable keywords={decreasing} />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}

// Composant Tableau
function KeywordsTable({ keywords, showOpportunity = false }: { keywords: KeywordData[]; showOpportunity?: boolean }) {
  if (keywords.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Search className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <p className="text-muted-foreground mt-4 text-sm font-medium">Aucun mot-clé dans cette catégorie</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="min-w-[250px]">Mot-clé</TableHead>
                <TableHead className="text-right">Clics</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Position</TableHead>
                <TableHead className="text-center">Évolution</TableHead>
                {showOpportunity && <TableHead>Opportunité</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((keyword, index) => (
                <TableRow key={keyword.query} className="group">
                  <TableCell className="text-muted-foreground font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{keyword.query}</span>
                      {keyword.isNew && (
                        <Badge color="zinc" className="text-xs">
                          Nouveau
                        </Badge>
                      )}
                      {keyword.isImproving && (
                        <Badge color="green" className="text-xs">
                          ↑
                        </Badge>
                      )}
                      {keyword.isDecreasing && (
                        <Badge color="red" className="text-xs">
                          ↓
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{keyword.clicks.toLocaleString('fr-FR')}</TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {keyword.impressions.toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">{(keyword.ctr * 100).toFixed(2)}%</TableCell>
                  <TableCell className="text-right">
                    <Badge color={keyword.position <= 3 ? 'green' : keyword.position <= 10 ? 'blue' : 'zinc'}>
                      {keyword.position.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      {/* Changement clics */}
                      {Math.abs(keyword.clicksChange) > 5 && (
                        <Tooltip>
                          <TooltipTrigger>
                            <div
                              className={`flex items-center gap-1 text-xs font-medium ${
                                keyword.clicksChange > 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {keyword.clicksChange > 0 ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                              {Math.abs(keyword.clicksChange).toFixed(0)}%
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Évolution des clics</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {/* Changement position */}
                      {Math.abs(keyword.positionChange) > 0.5 && (
                        <Tooltip>
                          <TooltipTrigger>
                            <div
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                keyword.positionChange > 0
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              }`}
                            >
                              {keyword.positionChange > 0 ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                              {Math.abs(keyword.positionChange).toFixed(1)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Évolution de position</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  {showOpportunity && (
                    <TableCell>
                      <Badge
                        color={
                          keyword.opportunity === 'high'
                            ? 'orange'
                            : keyword.opportunity === 'medium'
                              ? 'yellow'
                              : 'zinc'
                        }
                      >
                        {keyword.opportunity === 'high'
                          ? 'Haute'
                          : keyword.opportunity === 'medium'
                            ? 'Moyenne'
                            : 'Faible'}
                      </Badge>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

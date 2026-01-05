// 📁 components/pages/top-pages-content.tsx
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
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select'
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
import {
 AlertTriangle,
 ArrowDown,
 ArrowUp,
 Download,
 ExternalLink,
 Eye,
 FileText,
 Filter,
 Home,
 Loader2,
 MousePointerClick,
 RefreshCw,
 ShoppingBag,
 Sparkles,
 Target,
 TrendingDown,
 TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchTopPages, type PageData } from './actions'

interface Props {
 projectId: string
}

const PAGE_TYPE_ICONS = {
 home: Home,
 article: FileText,
 category: Filter,
 product: ShoppingBag,
 other: FileText,
}

const PAGE_TYPE_LABELS = {
 home: 'Accueil',
 article: 'Article',
 category: 'Catégorie',
 product: 'Produit',
 other: 'Autre',
}

export function TopPagesContent({ projectId }: Props) {
 const [data, setData] = useState<any>(null)
 const [isLoading, setIsLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)

 // Filtres
 const [searchQuery, setSearchQuery] = useState('')
 const [pageTypeFilter, setPageTypeFilter] = useState('all')
 const [performanceFilter, setPerformanceFilter] = useState('all')
 const [sortBy, setSortBy] = useState<
 'clicks' | 'impressions' | 'ctr' | 'position'
 >('clicks')
 const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

 const loadData = async () => {
 setIsLoading(true)
 setError(null)
 try {
 const result = await fetchTopPages(projectId)
 if (result.success) {
 setData(result)
 } else {
 setError(result.error || 'Erreur de chargement')
 }
 } catch (err) {
 setError('Erreur lors du chargement')
 } finally {
 setIsLoading(false)
 }
 }

 useEffect(() => {
 loadData()
 }, [projectId])

 // Filtrage et tri
 const filteredPages =
 data?.pages
 ?.filter((p: PageData) => {
 // Recherche
 if (
 searchQuery &&
 !p.path.toLowerCase().includes(searchQuery.toLowerCase())
 ) {
 return false
 }

 // Type de page
 if (pageTypeFilter !== 'all' && p.pageType !== pageTypeFilter) {
 return false
 }

 // Performance
 if (performanceFilter === 'top' && !p.isTop) return false
 if (performanceFilter === 'improving' && !p.isImproving) return false
 if (performanceFilter === 'decreasing' && !p.isDecreasing) return false
 if (performanceFilter === 'new' && !p.isNew) return false

 return true
 })
 .sort((a: PageData, b: PageData) => {
 const aValue = a[sortBy]
 const bValue = b[sortBy]

 if (sortOrder === 'asc') {
 return aValue > bValue ? 1 : -1
 }
 return aValue < bValue ? 1 : -1
 }) || []

 // Export CSV
 const exportToCSV = () => {
 if (!data?.pages) return

 const headers = [
 'URL',
 'Clics',
 'Impressions',
 'CTR (%)',
 'Position',
 'Type',
 'Évolution Clics (%)',
 'Évolution Position',
 ]
 const rows = data.pages.map((p: PageData) => [
 p.url,
 p.clicks,
 p.impressions,
 (p.ctr * 100).toFixed(2),
 p.position.toFixed(1),
 PAGE_TYPE_LABELS[p.pageType],
 p.clicksChange.toFixed(1),
 p.positionChange.toFixed(1),
 ])

 const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
 const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
 const link = document.createElement('a')
 link.href = URL.createObjectURL(blob)
 link.download = `pages-${new Date().toISOString().split('T')[0]}.csv`
 link.click()
 }

 if (isLoading) {
 return (
 <Card>
 <CardContent className="py-16 text-center">
 <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
 <p className="mt-4 font-medium">Chargement des données...</p>
 </CardContent>
 </Card>
 )
 }

 if (error) {
 return (
 <Card className="border-destructive/50 bg-destructive/5">
 <CardContent className="pt-6">
 <div className="flex items-start gap-3">
 <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
 <div>
 <p className="font-semibold text-destructive">
 Erreur de chargement
 </p>
 <p className="mt-1 text-sm text-muted-foreground">{error}</p>
 <Button
 onClick={loadData}
 size="sm"
 variant="outline"
 className="mt-3"
 >
 <RefreshCw className="mr-2 h-4 w-4" />
 Réessayer
 </Button>
 </div>
 </div>
 </CardContent>
 </Card>
 )
 }

 if (!data?.pages || data.pages.length === 0) {
 return (
 <Card>
 <CardContent className="py-16 text-center">
 <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
 <p className="mt-4 font-medium">Aucune page trouvée</p>
 <p className="mt-2 text-sm text-muted-foreground">
 Vérifiez que votre site est bien indexé
 </p>
 </CardContent>
 </Card>
 )
 }

 const stats = data.stats
 const topPerformers = data.pages.filter((p: PageData) => p.isTop)
 const improving = data.pages.filter((p: PageData) => p.isImproving)
 const decreasing = data.pages.filter((p: PageData) => p.isDecreasing)

 return (
 <TooltipProvider>
 <div className="space-y-6">
 {/* Statistiques */}
 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 <Card className="transition-shadow hover:shadow-md">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Total pages</CardTitle>
 <FileText className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {stats.totalPages.toLocaleString('fr-FR')}
 </div>
 <div className="mt-2 flex items-center gap-4 text-xs">
 <div>
 <span className="text-muted-foreground">Top 3: </span>
 <span className="font-semibold text-green-600">
 {stats.topPages}
 </span>
 </div>
 <div>
 <span className="text-muted-foreground">Nouvelles: </span>
 <span className="font-semibold text-blue-600">
 {stats.newPages}
 </span>
 </div>
 </div>
 </CardContent>
 </Card>

 <Card className="transition-shadow hover:shadow-md">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 Clics totaux
 </CardTitle>
 <MousePointerClick className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {stats.totalClicks.toLocaleString('fr-FR')}
 </div>
 <p className="mt-2 text-xs text-muted-foreground">
 CTR moyen: {(stats.avgCTR * 100).toFixed(2)}%
 </p>
 </CardContent>
 </Card>

 <Card className="transition-shadow hover:shadow-md">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 Impressions totales
 </CardTitle>
 <Eye className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {stats.totalImpressions.toLocaleString('fr-FR')}
 </div>
 <p className="mt-2 text-xs text-muted-foreground">
 {stats.improvingPages} pages en progression
 </p>
 </CardContent>
 </Card>

 <Card className="transition-shadow hover:shadow-md">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 Position moyenne
 </CardTitle>
 <Target className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {stats.avgPosition.toFixed(1)}
 </div>
 <p className="mt-2 text-xs text-muted-foreground">
 Sur toutes les pages
 </p>
 </CardContent>
 </Card>
 </div>

 {/* Répartition par type */}
 <Card>
 <CardHeader>
 <CardTitle>Répartition par type de page</CardTitle>
 <CardDescription>Distribution du contenu</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
 {Object.entries(stats.pagesByType).map(([type, count]) => {
 const Icon =
 PAGE_TYPE_ICONS[type as keyof typeof PAGE_TYPE_ICONS]
 const label =
 PAGE_TYPE_LABELS[type as keyof typeof PAGE_TYPE_LABELS]
 const percentage = (count / stats.totalPages) * 100

 return (
 <div
 key={type}
 className="flex flex-col gap-2 rounded-lg border p-4 transition-shadow hover:shadow-md"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Icon className="h-4 w-4 text-primary" />
 <span className="text-sm font-medium">{label}</span>
 </div>
 <Badge variant="secondary">{count}</Badge>
 </div>
 <div className="text-xs text-muted-foreground">
 {percentage.toFixed(1)}% du total
 </div>
 </div>
 )
 })}
 </div>
 </CardContent>
 </Card>

 {/* Onglets */}
 <Tabs defaultValue="all" className="space-y-6">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <TabsList>
 <TabsTrigger value="all">
 Toutes ({data.pages.length})
 </TabsTrigger>
 <TabsTrigger value="top">
 Top 3 ({topPerformers.length})
 </TabsTrigger>
 <TabsTrigger value="improving">
 En progression ({improving.length})
 </TabsTrigger>
 <TabsTrigger value="decreasing">
 En baisse ({decreasing.length})
 </TabsTrigger>
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
 <div className="grid gap-4 md:grid-cols-5">
 <div className="space-y-2">
 <label className="text-sm font-medium">Rechercher</label>
 <Input
 placeholder="Chemin..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium">Type de page</label>
 <Select
 value={pageTypeFilter}
 onValueChange={setPageTypeFilter}
 >
 <SelectTrigger>
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">Tous types</SelectItem>
 <SelectItem value="home">Accueil</SelectItem>
 <SelectItem value="article">Articles</SelectItem>
 <SelectItem value="category">Catégories</SelectItem>
 <SelectItem value="product">Produits</SelectItem>
 <SelectItem value="other">Autres</SelectItem>
 </SelectContent>
 </Select>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium">Performance</label>
 <Select
 value={performanceFilter}
 onValueChange={setPerformanceFilter}
 >
 <SelectTrigger>
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">Toutes</SelectItem>
 <SelectItem value="top">Top 3</SelectItem>
 <SelectItem value="improving">En progression</SelectItem>
 <SelectItem value="decreasing">En baisse</SelectItem>
 <SelectItem value="new">Nouvelles</SelectItem>
 </SelectContent>
 </Select>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium">Trier par</label>
 <Select
 value={sortBy}
 onValueChange={(v: any) => setSortBy(v)}
 >
 <SelectTrigger>
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="clicks">Clics</SelectItem>
 <SelectItem value="impressions">Impressions</SelectItem>
 <SelectItem value="ctr">CTR</SelectItem>
 <SelectItem value="position">Position</SelectItem>
 </SelectContent>
 </Select>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium">Ordre</label>
 <Select
 value={sortOrder}
 onValueChange={(v: any) => setSortOrder(v)}
 >
 <SelectTrigger>
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="desc">Décroissant</SelectItem>
 <SelectItem value="asc">Croissant</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>

 {(searchQuery ||
 pageTypeFilter !== 'all' ||
 performanceFilter !== 'all') && (
 <div className="mt-4 flex items-center gap-2">
 <Badge variant="secondary">
 {filteredPages.length} résultat
 {filteredPages.length > 1 ? 's' : ''}
 </Badge>
 <Button
 size="sm"
 variant="ghost"
 onClick={() => {
 setSearchQuery('')
 setPageTypeFilter('all')
 setPerformanceFilter('all')
 }}
 >
 Réinitialiser
 </Button>
 </div>
 )}
 </CardContent>
 </Card>

 {/* Tableaux */}
 <TabsContent value="all">
 <PagesTable pages={filteredPages} />
 </TabsContent>

 <TabsContent value="top">
 <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
 <CardHeader>
 <div className="flex items-center gap-2">
 <Sparkles className="h-5 w-5 text-green-600" />
 <CardTitle className="text-green-900 dark:text-green-100">
 Pages Top 3
 </CardTitle>
 </div>
 <CardDescription>
 Pages positionnées dans le top 3 de Google
 </CardDescription>
 </CardHeader>
 </Card>
 <PagesTable pages={topPerformers} />
 </TabsContent>

 <TabsContent value="improving">
 <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
 <CardHeader>
 <div className="flex items-center gap-2">
 <TrendingUp className="h-5 w-5 text-blue-600" />
 <CardTitle className="text-blue-900 dark:text-blue-100">
 Pages en progression
 </CardTitle>
 </div>
 <CardDescription>
 Pages avec amélioration significative
 </CardDescription>
 </CardHeader>
 </Card>
 <PagesTable pages={improving} />
 </TabsContent>

 <TabsContent value="decreasing">
 <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
 <CardHeader>
 <div className="flex items-center gap-2">
 <TrendingDown className="h-5 w-5 text-red-600" />
 <CardTitle className="text-red-900 dark:text-red-100">
 Pages en baisse
 </CardTitle>
 </div>
 <CardDescription>
 Pages nécessitant une optimisation
 </CardDescription>
 </CardHeader>
 </Card>
 <PagesTable pages={decreasing} />
 </TabsContent>
 </Tabs>
 </div>
 </TooltipProvider>
 )
}

// Composant Tableau
function PagesTable({ pages }: { pages: PageData[] }) {
 if (pages.length === 0) {
 return (
 <Card>
 <CardContent className="py-12 text-center">
 <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
 <p className="mt-4 text-sm font-medium text-muted-foreground">
 Aucune page dans cette catégorie
 </p>
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
 <TableHead className="min-w-[300px]">Page</TableHead>
 <TableHead>Type</TableHead>
 <TableHead className="text-right">Clics</TableHead>
 <TableHead className="text-right">Impressions</TableHead>
 <TableHead className="text-right">CTR</TableHead>
 <TableHead className="text-right">Position</TableHead>
 <TableHead className="text-center">Évolution</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {pages.map((page, index) => {
 const Icon =
 PAGE_TYPE_ICONS[page.pageType as keyof typeof PAGE_TYPE_ICONS]
 return (
 <TableRow key={page.url}>
 <TableCell className="font-medium text-muted-foreground">
 {index + 1}
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-2">
 <Tooltip>
 <TooltipTrigger asChild>
 <Link
 href={page.url}
 target="_blank"
 rel="noopener noreferrer nofollow"
 className="flex items-center gap-1.5 font-medium hover:text-primary hover:underline"
 >
 <span className="max-w-xs truncate">
 {page.path}
 </span>
 <ExternalLink className="h-3 w-3 flex-shrink-0" />
 </Link>
 </TooltipTrigger>
 <TooltipContent side="bottom" className="max-w-md">
 <p className="text-xs break-all">{page.url}</p>
 </TooltipContent>
 </Tooltip>
 {page.isNew && (
 <Badge variant="secondary" className="text-xs">
 Nouveau
 </Badge>
 )}
 {page.isTop && (
 <Badge className="bg-green-600 text-xs">Top 3</Badge>
 )}
 </div>
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-2">
 <Icon className="h-4 w-4 text-muted-foreground" />
 <span className="text-xs text-muted-foreground">
 {PAGE_TYPE_LABELS[page.pageType]}
 </span>
 </div>
 </TableCell>
 <TableCell className="text-right font-semibold">
 {page.clicks.toLocaleString('fr-FR')}
 </TableCell>
 <TableCell className="text-right text-muted-foreground">
 {page.impressions.toLocaleString('fr-FR')}
 </TableCell>
 <TableCell className="text-right">
 {(page.ctr * 100).toFixed(2)}%
 </TableCell>
 <TableCell className="text-right">
 <Badge
 variant={
 page.position <= 3
 ? 'default'
 : page.position <= 10
 ? 'secondary'
 : 'outline'
 }
 className={
 page.position <= 3
 ? 'bg-green-600'
 : page.position <= 10
 ? 'bg-blue-600 text-white'
 : ''
 }
 >
 {page.position.toFixed(1)}
 </Badge>
 </TableCell>
 <TableCell>
 <div className="flex items-center justify-center gap-3">
 {Math.abs(page.clicksChange) > 5 && (
 <Tooltip>
 <TooltipTrigger>
 <div
 className={`flex items-center gap-1 text-xs font-medium ${
 page.clicksChange > 0
 ? 'text-green-600'
 : 'text-red-600'
 }`}
 >
 {page.clicksChange > 0 ? (
 <ArrowUp className="h-3 w-3" />
 ) : (
 <ArrowDown className="h-3 w-3" />
 )}
 {Math.abs(page.clicksChange).toFixed(0)}%
 </div>
 </TooltipTrigger>
 <TooltipContent>
 <p>Évolution des clics</p>
 </TooltipContent>
 </Tooltip>
 )}

 {Math.abs(page.positionChange) > 0.5 && (
 <Tooltip>
 <TooltipTrigger>
 <div
 className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
 page.positionChange > 0
 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
 : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
 }`}
 >
 {page.positionChange > 0 ? (
 <ArrowUp className="h-3 w-3" />
 ) : (
 <ArrowDown className="h-3 w-3" />
 )}
 {Math.abs(page.positionChange).toFixed(1)}
 </div>
 </TooltipTrigger>
 <TooltipContent>
 <p>Évolution de position</p>
 </TooltipContent>
 </Tooltip>
 )}
 </div>
 </TableCell>
 </TableRow>
 )
 })}
 </TableBody>
 </Table>
 </div>
 </CardContent>
 </Card>
 )
}

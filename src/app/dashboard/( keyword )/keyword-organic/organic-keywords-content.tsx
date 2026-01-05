// 📁 app/dashboard/mots-cles-organiques/organic-keywords-content.tsx
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
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { SpinnerCustom } from '@/components/ui/spinner'
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table'
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
import {
 fetchRankedKeywords,
 type RankedKeywordItem,
 type RankedKeywordsState,
} from './actions'

export function OrganicKeywordsContent() {
 const initialState: RankedKeywordsState = { success: false }
 const [state, formAction, isPending] = useActionState(
 fetchRankedKeywords,
 initialState,
 )

 const [target, setTarget] = useState('')
 const [currentPage, setCurrentPage] = useState(1)
 const itemsPerPage = 50

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault()
 setCurrentPage(1) // Reset pagination
 const formData = new FormData(e.currentTarget)
 formData.set('offset', '0')
 formData.set('limit', '100') // Valeur par défaut de 100
 formAction(formData)
 }

 // Pagination
 const paginatedItems = state.result?.items.slice(
 (currentPage - 1) * itemsPerPage,
 currentPage * itemsPerPage,
 )
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
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
 <Search className="h-6 w-6 text-primary" />
 </div>
 <div>
 <h1 className="text-3xl font-bold">Mots-Clés Organiques</h1>
 <p className="text-sm text-muted-foreground">
 Découvrez tous les mots-clés sur lesquels votre domaine se
 positionne
 </p>
 </div>
 </div>
 </div>

 {/* Formulaire */}
 <Card className="mb-6">
 <CardHeader>
 <CardTitle>Analyser un domaine</CardTitle>
 <CardDescription>
 Entrez un nom de domaine (sans https:// ou www.)
 </CardDescription>
 </CardHeader>
 <CardContent>
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="grid gap-4 md:grid-cols-2">
 <div className="space-y-2">
 <Label htmlFor="target">Domaine cible</Label>
 <Input
 id="target"
 name="target"
 type="text"
 value={target}
 onChange={(e) => setTarget(e.target.value)}
 placeholder="exemple.fr"
 disabled={isPending}
 required
 />
 <p className="text-xs text-muted-foreground">
 Exemple: exemple.fr ou sous-domaine.exemple.fr
 </p>
 </div>
 </div>

 <Button
 type="submit"
 className="w-full"
 disabled={isPending || !target}
 >
 {isPending ? (
 <>
 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 Analyse en cours...
 </>
 ) : (
 <>
 <Search className="mr-2 h-4 w-4" />
 Analyser les mots-clés organiques
 </>
 )}
 </Button>
 </form>
 </CardContent>
 </Card>

 {/* Erreur */}
 {state.error && (
 <Card className="mb-6 border-destructive/50 bg-destructive/5">
 <CardContent className="pt-6">
 <div className="flex items-start gap-3">
 <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
 <div>
 <p className="font-semibold text-destructive">Erreur</p>
 <p className="mt-1 text-sm text-muted-foreground">
 {state.error}
 </p>
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
 <p className="mt-4 font-medium">
 Récupération des mots-clés organiques...
 </p>
 <p className="mt-2 text-sm text-muted-foreground">
 Cela peut prendre quelques secondes
 </p>
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
 <CardTitle className="text-sm font-medium">
 Total Mots-Clés
 </CardTitle>
 <BarChart3 className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {formatNumber(state.result.total_count)}
 </div>
 <p className="text-xs text-muted-foreground">
 {formatNumber(state.result.metrics.organic.count)} organiques
 </p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 Trafic Estimé
 </CardTitle>
 <TrendingUp className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {formatNumber(Math.round(state.result.metrics.organic.etv))}
 </div>
 <p className="text-xs text-muted-foreground">
 visites/mois estimées
 </p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 Valeur du Trafic
 </CardTitle>
 <DollarSign className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {formatCurrency(
 state.result.metrics.organic.estimated_paid_traffic_cost,
 )}
 </div>
 <p className="text-xs text-muted-foreground">
 coût équivalent en SEA
 </p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Top 10</CardTitle>
 <Target className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {formatNumber(
 state.result.metrics.organic.pos_1 +
 state.result.metrics.organic.pos_2_3 +
 state.result.metrics.organic.pos_4_10,
 )}
 </div>
 <p className="text-xs text-muted-foreground">
 mots-clés en 1ère page
 </p>
 </CardContent>
 </Card>
 </div>

 {/* Distribution des positions */}
 <Card className="mb-6">
 <CardHeader>
 <CardTitle>Distribution des Positions</CardTitle>
 <CardDescription>
 Répartition de vos mots-clés par position dans Google
 </CardDescription>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 <div className="space-y-2">
 <div className="flex items-center justify-between text-sm">
 <span className="font-medium">Position 1</span>
 <span className="text-muted-foreground">
 {formatNumber(state.result.metrics.organic.pos_1)}{' '}
 mots-clés
 </span>
 </div>
 <Progress
 value={
 (state.result.metrics.organic.pos_1 /
 state.result.metrics.organic.count) *
 100
 }
 className="h-2"
 />
 </div>

 <div className="space-y-2">
 <div className="flex items-center justify-between text-sm">
 <span className="font-medium">Positions 2-3</span>
 <span className="text-muted-foreground">
 {formatNumber(state.result.metrics.organic.pos_2_3)}{' '}
 mots-clés
 </span>
 </div>
 <Progress
 value={
 (state.result.metrics.organic.pos_2_3 /
 state.result.metrics.organic.count) *
 100
 }
 className="h-2"
 />
 </div>

 <div className="space-y-2">
 <div className="flex items-center justify-between text-sm">
 <span className="font-medium">Positions 4-10</span>
 <span className="text-muted-foreground">
 {formatNumber(state.result.metrics.organic.pos_4_10)}{' '}
 mots-clés
 </span>
 </div>
 <Progress
 value={
 (state.result.metrics.organic.pos_4_10 /
 state.result.metrics.organic.count) *
 100
 }
 className="h-2"
 />
 </div>

 <div className="space-y-2">
 <div className="flex items-center justify-between text-sm">
 <span className="font-medium">Positions 11-20</span>
 <span className="text-muted-foreground">
 {formatNumber(state.result.metrics.organic.pos_11_20)}{' '}
 mots-clés
 </span>
 </div>
 <Progress
 value={
 (state.result.metrics.organic.pos_11_20 /
 state.result.metrics.organic.count) *
 100
 }
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
 <div className="text-2xl font-bold">
 {formatNumber(state.result.metrics.organic.is_new)}
 </div>
 <p className="text-xs text-muted-foreground">
 mots-clés ajoutés récemment
 </p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 En progression
 </CardTitle>
 <ArrowUp className="h-4 w-4 text-green-500" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">
 {formatNumber(state.result.metrics.organic.is_up)}
 </div>
 <p className="text-xs text-muted-foreground">
 positions améliorées
 </p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">En baisse</CardTitle>
 <ArrowDown className="h-4 w-4 text-red-500" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">
 {formatNumber(state.result.metrics.organic.is_down)}
 </div>
 <p className="text-xs text-muted-foreground">
 positions perdues
 </p>
 </CardContent>
 </Card>
 </div>

 {/* Table des mots-clés */}
 <Card>
 <CardHeader>
 <div className="flex items-center justify-between">
 <div>
 <CardTitle>Liste des Mots-Clés</CardTitle>
 <CardDescription>
 {formatNumber(state.result.items.length)} mots-clés trouvés
 </CardDescription>
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
 <Badge color={getRankBadge(getRankGroup(item))}>
 {getRankGroup(item)}
 </Badge>
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
 <span className="text-xs text-muted-foreground">
 {getRelativeUrl(item)}
 </span>
 </div>
 </TableCell>
 <TableCell>
 {formatNumber(
 item.keyword_data.keyword_info.search_volume,
 )}
 </TableCell>
 <TableCell>
 <Badge
 color={
 item.keyword_data.keyword_properties
 .keyword_difficulty < 30
 ? 'green'
 : item.keyword_data.keyword_properties
 .keyword_difficulty < 60
 ? 'yellow'
 : 'red'
 }
 >
 {
 item.keyword_data.keyword_properties
 .keyword_difficulty
 }
 </Badge>
 </TableCell>
 <TableCell>
 {Math.round(getEtv(item)).toLocaleString('fr-FR')}
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-1">
 {getTrendIcon(item)}
 {item.ranked_serp_element.serp_item.rank_changes
 .is_new && (
 <Badge color="green" className="text-xs">
 New
 </Badge>
 )}
 </div>
 </TableCell>
 <TableCell>
 <Badge color="zinc" className="text-xs">
 {item.keyword_data.search_intent_info
 ?.main_intent || 'N/A'}
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
 <p className="text-sm text-muted-foreground">
 Page {currentPage} sur {totalPages}
 </p>
 <div className="flex gap-2">
 <Button
 variant="outline"
 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
 disabled={currentPage === 1}
 >
 <ChevronLeft className="h-4 w-4" />
 Précédent
 </Button>
 <Button
 variant="outline"
 onClick={() =>
 setCurrentPage((p) => Math.min(totalPages, p + 1))
 }
 disabled={currentPage === totalPages}
 >
 Suivant
 <ChevronRight className="h-4 w-4" />
 </Button>
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

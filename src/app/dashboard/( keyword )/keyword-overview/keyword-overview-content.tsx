// 📁 components/keywords/keyword-overview-content.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { TooltipProvider } from '@/components/ui/tooltip'

import {
 AlertTriangle,
 BarChart3,
 DollarSign,
 Loader2,
 Search,
 Target,
} from 'lucide-react'
import { useActionState, useState } from 'react'
import {
 fetchKeywordOverview,
 type KeywordOverviewState,
 type KeywordResult,
} from './action'

// Localisation et langue fixées pour le public français uniquement

export function KeywordOverviewContent() {
 const initialState: KeywordOverviewState = {
 success: false,
 }

 const [state, formAction, isPending] = useActionState(
 fetchKeywordOverview,
 initialState,
 )

 const [keywords, setKeywords] = useState('')
 // Localisation et langue fixées : France et français uniquement
 const [includeClickstream, setIncludeClickstream] = useState(false)

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault()
 const formData = new FormData(e.currentTarget)
 formAction(formData)
 }

 const keywordCount = keywords.split('\n').filter((k) => k.trim()).length

 return (
 <TooltipProvider>
 <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
 {/* Header */}
 <div className="mb-6">
 <div className="flex items-center gap-3">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
 <Search className="h-6 w-6 text-primary" />
 </div>
 <div>
 <h1 className="text-3xl font-bold">Analyse de Mots-Clés</h1>
 <p className="text-sm text-muted-foreground">
 Volume de recherche, CPC, concurrence et tendances mensuelles
 </p>
 </div>
 </div>
 </div>

 {/* Formulaire */}
 <Card className="mb-6">
 <CardHeader>
 <CardTitle>Rechercher des mots-clés</CardTitle>
 <CardDescription>
 Entrez jusqu'à 700 mots-clés (un par ligne)
 </CardDescription>
 </CardHeader>
 <CardContent>
 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="space-y-2">
 <Label htmlFor="keywords">
 Mots-clés{' '}
 <Badge variant="secondary" className="ml-2">
 {keywordCount}/700
 </Badge>
 </Label>
 <Textarea
 id="keywords"
 name="keywords"
 value={keywords}
 onChange={(e) => setKeywords(e.target.value)}
 placeholder="seo gratuit&#10;agence référencement&#10;outils seo"
 rows={6}
 className="font-mono text-sm"
 disabled={isPending}
 />
 <p className="text-xs text-muted-foreground">
 Maximum 80 caractères et 10 mots par mot-clé
 </p>
 </div>

 <Button
 type="submit"
 className="w-full"
 disabled={isPending || keywordCount === 0}
 >
 {isPending ? (
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

 {/* État de chargement amélioré */}
 {isPending && (
 <Card className="mb-6">
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
 <CardTitle className="text-sm font-medium">
 Mots-clés analysés
 </CardTitle>
 <Target className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {state.results.length}
 </div>
 <p className="mt-1 text-xs text-muted-foreground">
 Coût: ${state.cost?.toFixed(4) || '0'}
 </p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 Volume moyen
 </CardTitle>
 <BarChart3 className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {Math.round(
 state.results.reduce(
 (acc, r) => acc + (r.keyword_info?.search_volume || 0),
 0,
 ) / state.results.length,
 ).toLocaleString('fr-FR')}
 </div>
 <p className="mt-1 text-xs text-muted-foreground">
 recherches/mois
 </p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 CPC moyen
 </CardTitle>
 <DollarSign className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 $
 {(
 state.results.reduce(
 (acc, r) => acc + (r.keyword_info?.cpc || 0),
 0,
 ) / state.results.length
 ).toFixed(2)}
 </div>
 <p className="mt-1 text-xs text-muted-foreground">
 Coût par clic
 </p>
 </CardContent>
 </Card>
 </div>

 {/* Tableau des résultats */}
 <Tabs defaultValue="overview" className="space-y-6">
 <TabsList>
 <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
 <TabsTrigger value="trends">Tendances</TabsTrigger>
 <TabsTrigger value="competition">Concurrence</TabsTrigger>
 <TabsTrigger value="serp">SERP</TabsTrigger>
 <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
 <TabsTrigger value="intent">Intention</TabsTrigger>
 </TabsList>

 <TabsContent value="overview">
 <Card>
 <CardHeader>
 <CardTitle>Résultats détaillés</CardTitle>
 <CardDescription>
 Métriques complètes pour chaque mot-clé
 </CardDescription>
 </CardHeader>
 <CardContent>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Mot-clé</TableHead>
 <TableHead className="text-right">Volume</TableHead>
 <TableHead className="text-right">CPC</TableHead>
 <TableHead>Concurrence</TableHead>
 <TableHead className="text-right">
 Difficulté
 </TableHead>
 <TableHead className="text-right">
 Résultats SERP
 </TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {state.results.map((result, index) => {
 const competitionLevel =
 result.keyword_info?.competition_level || null
 const competition =
 result.keyword_info?.competition || 0 // Float 0-1
 const competitionIndex = Math.round(competition * 100) // Convertir en pourcentage
 const difficulty =
 result.keyword_properties?.keyword_difficulty || 0

 return (
 <TableRow key={index}>
 <TableCell className="font-medium">
 {result.keyword}
 </TableCell>
 <TableCell className="text-right">
 {result.keyword_info?.search_volume?.toLocaleString(
 'fr-FR',
 ) || '0'}
 </TableCell>
 <TableCell className="text-right">
 $
 {result.keyword_info?.cpc?.toFixed(2) || '0.00'}
 </TableCell>
 <TableCell>
 <div className="space-y-1">
 <Badge
 variant={
 competitionLevel === 'HIGH'
 ? 'destructive'
 : competitionLevel === 'MEDIUM'
 ? 'secondary'
 : 'outline'
 }
 >
 {competitionLevel || 'N/A'}
 </Badge>
 <Progress
 value={competitionIndex}
 className="h-1"
 />
 </div>
 </TableCell>
 <TableCell className="text-right">
 <Badge
 variant={
 difficulty > 70
 ? 'destructive'
 : difficulty > 40
 ? 'secondary'
 : 'outline'
 }
 >
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
 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
 <Search className="h-8 w-8 text-muted-foreground" />
 </div>
 <p className="mt-4 font-medium">Aucune analyse effectuée</p>
 <p className="mt-2 text-sm text-muted-foreground">
 Entrez des mots-clés ci-dessus pour commencer l'analyse
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
 <Badge variant="outline">
 Volume actuel:{' '}
 {result.keyword_info?.search_volume?.toLocaleString('fr-FR')}
 </Badge>
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-2">
 {monthly.slice(0, 12).map((month, idx) => {
 const percentage = (month.search_volume / maxVolume) * 100
 return (
 <div key={idx} className="flex items-center gap-3">
 <span className="w-20 text-sm text-muted-foreground">
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
 (r) =>
 r.keyword_info?.competition_level === 'HIGH' ||
 (r.keyword_info?.competition || 0) > 0.7,
 )
 const mediumCompetition = results.filter(
 (r) =>
 r.keyword_info?.competition_level === 'MEDIUM' ||
 ((r.keyword_info?.competition || 0) > 0.3 &&
 (r.keyword_info?.competition || 0) <= 0.7),
 )
 const lowCompetition = results.filter(
 (r) =>
 r.keyword_info?.competition_level === 'LOW' ||
 (r.keyword_info?.competition || 0) <= 0.3,
 )

 return (
 <div className="grid gap-6 md:grid-cols-3">
 <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
 <CardHeader>
 <CardTitle className="text-red-900 dark:text-red-100">
 Forte concurrence
 </CardTitle>
 <CardDescription>Mots-clés difficiles à ranker</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="mb-4 text-3xl font-bold tracking-tight text-red-600">
 {highCompetition.length}
 </div>
 <div className="space-y-2">
 {highCompetition.slice(0, 5).map((r, i) => (
 <div
 key={i}
 className="flex items-center justify-between text-sm"
 >
 <span className="truncate">{r.keyword}</span>
 <Badge variant="destructive">
 {Math.round((r.keyword_info?.competition || 0) * 100)}%
 </Badge>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>

 <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
 <CardHeader>
 <CardTitle className="text-orange-900 dark:text-orange-100">
 Concurrence moyenne
 </CardTitle>
 <CardDescription>Opportunités intéressantes</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="mb-4 text-3xl font-bold tracking-tight text-orange-600">
 {mediumCompetition.length}
 </div>
 <div className="space-y-2">
 {mediumCompetition.slice(0, 5).map((r, i) => (
 <div
 key={i}
 className="flex items-center justify-between text-sm"
 >
 <span className="truncate">{r.keyword}</span>
 <Badge variant="secondary">
 {Math.round((r.keyword_info?.competition || 0) * 100)}%
 </Badge>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>

 <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
 <CardHeader>
 <CardTitle className="text-green-900 dark:text-green-100">
 Faible concurrence
 </CardTitle>
 <CardDescription>Quick wins potentiels</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="mb-4 text-3xl font-bold tracking-tight text-green-600">
 {lowCompetition.length}
 </div>
 <div className="space-y-2">
 {lowCompetition.slice(0, 5).map((r, i) => (
 <div
 key={i}
 className="flex items-center justify-between text-sm"
 >
 <span className="truncate">{r.keyword}</span>
 <Badge variant="outline" className="bg-green-100">
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
 <p className="text-sm text-muted-foreground">
 Aucune donnée SERP disponible
 </p>
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
 <Badge variant="outline">
 {parseInt(result.serp_info!.se_results_count).toLocaleString(
 'fr-FR',
 )}{' '}
 résultats
 </Badge>
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 <div>
 <Label className="text-sm font-medium">
 Types d'éléments SERP
 </Label>
 <div className="mt-2 flex flex-wrap gap-2">
 {result.serp_info!.serp_item_types.map((type, i) => (
 <Badge key={i} variant="secondary" className="text-xs">
 {type.replace(/_/g, ' ')}
 </Badge>
 ))}
 </div>
 </div>

 <div className="grid gap-4 md:grid-cols-2">
 <div>
 <Label className="text-xs text-muted-foreground">
 URL de vérification
 </Label>
 <a
 href={result.serp_info!.check_url}
 target="_blank"
 rel="noopener noreferrer"
 className="mt-1 block truncate text-sm text-primary hover:underline"
 >
 {result.serp_info!.check_url}
 </a>
 </div>
 <div>
 <Label className="text-xs text-muted-foreground">
 Dernière mise à jour
 </Label>
 <p className="mt-1 text-sm">
 {new Date(
 result.serp_info!.last_updated_time,
 ).toLocaleDateString('fr-FR', {
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
 <p className="text-sm text-muted-foreground">
 Aucune donnée de backlinks disponible
 </p>
 </CardContent>
 </Card>
 )
 }

 return (
 <Card>
 <CardHeader>
 <CardTitle>Métriques de backlinks moyennes</CardTitle>
 <CardDescription>
 Statistiques moyennes des backlinks pour les 10 premiers résultats
 organiques
 </CardDescription>
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
 <TableCell className="font-medium">
 {result.keyword}
 </TableCell>
 <TableCell className="text-right">
 {Math.round(backlinks.backlinks).toLocaleString('fr-FR')}
 </TableCell>
 <TableCell className="text-right">
 {Math.round(backlinks.dofollow).toLocaleString('fr-FR')}
 </TableCell>
 <TableCell className="text-right">
 {Math.round(backlinks.referring_pages).toLocaleString(
 'fr-FR',
 )}
 </TableCell>
 <TableCell className="text-right">
 {Math.round(backlinks.referring_domains).toLocaleString(
 'fr-FR',
 )}
 </TableCell>
 <TableCell className="text-right">
 <Badge variant="outline">
 {Math.round(backlinks.rank)}
 </Badge>
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
 <p className="text-sm text-muted-foreground">
 Aucune donnée d'intention disponible
 </p>
 </CardContent>
 </Card>
 )
 }

 const intentGroups = {
 informational: resultsWithIntent.filter(
 (r) => r.search_intent_info?.main_intent === 'informational',
 ),
 navigational: resultsWithIntent.filter(
 (r) => r.search_intent_info?.main_intent === 'navigational',
 ),
 commercial: resultsWithIntent.filter(
 (r) => r.search_intent_info?.main_intent === 'commercial',
 ),
 transactional: resultsWithIntent.filter(
 (r) => r.search_intent_info?.main_intent === 'transactional',
 ),
 }

 const intentLabels: Record<string, string> = {
 informational: 'Informationnel',
 navigational: 'Navigationnel',
 commercial: 'Commercial',
 transactional: 'Transactionnel',
 }

 const intentColors: Record<string, string> = {
 informational:
 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950',
 navigational:
 'border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950',
 commercial:
 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950',
 transactional:
 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950',
 }

 return (
 <div className="space-y-6">
 {/* Vue d'ensemble par intention */}
 <div className="grid gap-4 md:grid-cols-4">
 {Object.entries(intentGroups).map(([intent, items]) => (
 <Card
 key={intent}
 className={intentColors[intent] || 'border bg-gray-50'}
 >
 <CardHeader>
 <CardTitle className="text-base">
 {intentLabels[intent] || intent}
 </CardTitle>
 <CardDescription>
 {items.length} mot{items.length > 1 ? 's' : ''}-clé
 {items.length > 1 ? 's' : ''}
 </CardDescription>
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">{items.length}</div>
 <p className="mt-1 text-xs text-muted-foreground">
 {Math.round((items.length / resultsWithIntent.length) * 100)}%
 du total
 </p>
 </CardContent>
 </Card>
 ))}
 </div>

 {/* Liste détaillée */}
 <Card>
 <CardHeader>
 <CardTitle>Détails par mot-clé</CardTitle>
 <CardDescription>
 Intention principale et intentions secondaires
 </CardDescription>
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
 <TableCell className="font-medium">
 {result.keyword}
 </TableCell>
 <TableCell>
 <Badge variant="secondary">
 {intentLabels[intent.main_intent] || intent.main_intent}
 </Badge>
 </TableCell>
 <TableCell>
 {intent.foreign_intent &&
 intent.foreign_intent.length > 0 ? (
 <div className="flex flex-wrap gap-1">
 {intent.foreign_intent.map((fi, i) => (
 <Badge
 key={i}
 variant="outline"
 className="text-xs"
 >
 {intentLabels[fi] || fi}
 </Badge>
 ))}
 </div>
 ) : (
 <span className="text-sm text-muted-foreground">
 Aucune
 </span>
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

'use client'

import { Divider } from '@/components/dashboard/divider'
import { Heading } from '@/components/dashboard/heading'
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
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
 BarChart3,
 Brain,
 Calendar,
 ChevronRight,
 ExternalLink,
 Link2,
 Loader2,
 MessageSquare,
 Search,
 Sparkles,
 TrendingUp,
 Zap,
} from 'lucide-react'
import { useActionState, useState } from 'react'
import {
 fetchAIKeywordData,
 fetchLLMMentions,
 type AIKeywordDataState,
 type LLMMentionsState,
} from './action'

export default function VisibiliteIAPage() {
 const [activeTab, setActiveTab] = useState('ai-keywords')

 // États pour AI Keyword Data
 const initialKeywordState: AIKeywordDataState = {
 success: false,
 }
 const [keywordState, keywordFormAction, isKeywordPending] = useActionState(
 fetchAIKeywordData,
 initialKeywordState,
 )

 // États pour LLM Mentions
 const initialMentionsState: LLMMentionsState = {
 success: false,
 }
 const [mentionsState, mentionsFormAction, isMentionsPending] = useActionState(
 fetchLLMMentions,
 initialMentionsState,
 )

 return (
 <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background to-muted/20">
 <div className="mx-auto box-border w-full max-w-full min-w-0 overflow-x-hidden px-4 pt-6 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
 {/* Header */}
 <div className="mb-8 lg:mb-12">
 <div className="mb-4 flex items-center gap-4 lg:gap-6">
 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg lg:h-16 lg:w-16">
 <Brain className="h-7 w-7 text-white lg:h-8 lg:w-8" />
 </div>
 <div>
 <Heading className="text-3xl sm:text-3xl lg:text-5xl">
 Visibilité IA & LLM
 </Heading>
 <p className="mt-2 text-base text-muted-foreground lg:text-lg">
 Analysez votre visibilité dans les outils d&apos;IA et les
 grands modèles de langage
 </p>
 </div>
 </div>
 </div>

 {/* Bannière informative */}
 <div className="mb-8 rounded-xl border bg-gradient-to-r from-purple-500/5 via-purple-500/10 to-pink-500/5 p-6 lg:mb-10 lg:rounded-2xl lg:p-8">
 <div className="flex items-start gap-4 lg:gap-6">
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 lg:h-14 lg:w-14">
 <Sparkles className="h-6 w-6 text-purple-600 lg:h-7 lg:w-7 dark:text-purple-400" />
 </div>
 <div className="flex-1">
 <h3 className="mb-2 text-lg font-semibold lg:text-xl">
 Optimisez votre présence dans l&apos;écosystème IA
 </h3>
 <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
 Découvrez comment vos mots clés et votre marque sont perçus et
 mentionnés dans les outils d&apos;IA comme ChatGPT, Claude,
 Gemini et autres LLM. Obtenez des insights précieux sur le
 volume de recherche IA et optimisez votre stratégie de contenu.
 </p>
 </div>
 </div>
 </div>

 {/* Tabs pour les deux APIs */}
 <Tabs
 value={activeTab}
 onValueChange={setActiveTab}
 className="w-full min-w-0 overflow-x-hidden"
 >
 <TabsList className="mb-6 grid w-full grid-cols-2 lg:mb-8 lg:w-auto">
 <TabsTrigger value="ai-keywords" className="gap-2 lg:px-8">
 <BarChart3 className="h-4 w-4" />
 <span className="hidden sm:inline">AI Keyword Data</span>
 <span className="sm:hidden">Keywords</span>
 </TabsTrigger>
 <TabsTrigger value="llm-mentions" className="gap-2 lg:px-8">
 <MessageSquare className="h-4 w-4" />
 <span className="hidden sm:inline">LLM Mentions</span>
 <span className="sm:hidden">Mentions</span>
 </TabsTrigger>
 </TabsList>

 {/* Tab: AI Keyword Data */}
 <TabsContent value="ai-keywords" className="space-y-6 lg:space-y-8">
 <Card className="border-2 shadow-lg">
 <CardHeader className="lg:px-8 lg:py-7">
 <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
 <Search className="h-6 w-6 lg:h-7 lg:w-7" />
 Analyser des mots clés dans l&apos;IA
 </CardTitle>
 <CardDescription className="mt-2 lg:text-base">
 Obtenez le volume de recherche, l&apos;intention utilisateur
 et les tendances d&apos;utilisation dans les outils d&apos;IA.
 Analysez jusqu&apos;à 100 mots-clés simultanément.
 </CardDescription>
 </CardHeader>
 <CardContent className="lg:px-8 lg:pb-8">
 <form action={keywordFormAction} className="space-y-6">
 <div className="space-y-2">
 <Label
 htmlFor="keywords"
 className="text-sm font-medium lg:text-base"
 >
 Mots clés *
 </Label>
 <textarea
 id="keywords"
 name="keywords"
 placeholder="Ex: SEO optimization, Référencement naturel, Marketing digital ; Séparez les mots-clés par des virgules, des points-virgules ou des retours à la ligne"
 required
 disabled={isKeywordPending}
 rows={6}
 className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:h-auto lg:text-base"
 />
 <p className="text-xs text-muted-foreground">
 Analyse ciblée pour le marché français (France, langue
 française). Vous pouvez analyser jusqu&apos;à 100
 mots-clés à la fois.
 </p>
 </div>

 <Button
 type="submit"
 className="h-11 w-full gap-2 lg:h-12 lg:text-base"
 disabled={isKeywordPending}
 >
 {isKeywordPending ? (
 <>
 <Loader2 className="h-5 w-5 animate-spin" />
 Analyse en cours...
 </>
 ) : (
 <>
 <Sparkles className="h-5 w-5" />
 Lancer l&apos;analyse IA
 </>
 )}
 </Button>
 </form>

 {/* Affichage des erreurs */}
 {keywordState?.error && (
 <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
 <p className="text-sm font-semibold text-red-900 dark:text-red-200">
 ❌ Erreur
 </p>
 {typeof keywordState.error === 'string' ? (
 <p className="mt-1 text-sm text-red-700 dark:text-red-300">
 {keywordState.error}
 </p>
 ) : (
 <div className="mt-2 space-y-1">
 {Object.entries(keywordState.error).map(
 ([field, errors]) => (
 <div key={field}>
 <p className="text-xs font-medium text-red-800 dark:text-red-300">
 {field}:
 </p>
 {Array.isArray(errors) &&
 errors.map((error: string, index: number) => (
 <p
 key={index}
 className="text-xs text-red-700 dark:text-red-400"
 >
 • {error}
 </p>
 ))}
 </div>
 ),
 )}
 </div>
 )}
 </div>
 )}

 {/* Résultats AI Keyword Data */}
 {keywordState?.success && keywordState?.result && (
 <div className="mt-8 space-y-6">
 <Divider />

 {/* Header des résultats */}
 <div className="flex items-center gap-4">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 lg:h-14 lg:w-14">
 <Sparkles className="h-6 w-6 text-white lg:h-7 lg:w-7" />
 </div>
 <div>
 <h3 className="text-xl font-semibold lg:text-2xl">
 {keywordState.keywords &&
 keywordState.keywords.length === 1
 ? `Résultat pour "${keywordState.keywords[0]}"`
 : `Résultats pour ${keywordState.result?.items_count || keywordState.keywords?.length || 0} mot(s) clé(s)`}
 </h3>
 <p className="text-sm text-muted-foreground lg:text-base">
 {keywordState.keywords &&
 keywordState.keywords.length === 1
 ? "Analyse complète du mot clé dans l'écosystème IA"
 : `Analyse complète de ${keywordState.result?.items_count || keywordState.keywords?.length || 0} mot(s) clé(s) dans l'écosystème IA`}
 </p>
 {keywordState.keywords &&
 keywordState.keywords.length > 1 && (
 <div className="mt-3 flex flex-wrap gap-2">
 {keywordState.keywords
 .slice(0, 10)
 .map((kw, idx) => (
 <Badge
 key={idx}
 color="zinc"
 className="text-xs"
 >
 {kw}
 </Badge>
 ))}
 {keywordState.keywords.length > 10 && (
 <Badge color="zinc" className="text-xs">
 +{keywordState.keywords.length - 10} autres
 </Badge>
 )}
 </div>
 )}
 </div>
 </div>

 {keywordState.result.items.map((item, index) => (
 <div key={index} className="space-y-6">
 {/* Métriques principales */}
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-6">
 <Card className="border-2-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
 <CardContent className="pt-6">
 <div className="flex items-start justify-between">
 <div className="flex-1">
 <p className="text-sm font-medium text-muted-foreground">
 Volume de recherche IA
 </p>
 <p className="mt-2 text-3xl font-bold text-purple-600 lg:text-3xl dark:text-purple-400">
 {item.ai_search_volume?.toLocaleString(
 'fr-FR',
 ) || 'N/A'}
 </p>
 <p className="mt-2 text-xs text-muted-foreground">
 Recherches mensuelles estimées dans les IA
 </p>
 </div>
 <Brain className="h-10 w-10 text-purple-600 lg:h-12 lg:w-12" />
 </div>
 </CardContent>
 </Card>

 <Card className="border-2-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
 <CardContent className="pt-6">
 <div>
 <p className="text-sm font-medium text-muted-foreground">
 Mot clé analysé
 </p>
 <div className="mt-3 flex items-center gap-2">
 <Badge
 className="px-4 py-2 text-base break-words lg:text-lg"
 color="blue"
 >
 {item.keyword}
 </Badge>
 </div>
 <p className="mt-3 text-xs text-muted-foreground">
 {item.ai_monthly_searches?.length || 0} mois
 de données historiques
 </p>
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Graphique des recherches mensuelles */}
 {item.ai_monthly_searches &&
 item.ai_monthly_searches.length > 0 && (
 <Card className="border-2">
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
 <BarChart3 className="h-5 w-5" />
 Évolution mensuelle du volume de recherche IA
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {item.ai_monthly_searches
 .slice(-12)
 .map((monthData, idx) => {
 const maxVolume = Math.max(
 ...item.ai_monthly_searches.map(
 (m) => m.ai_search_volume,
 ),
 )
 const percentage =
 (monthData.ai_search_volume /
 maxVolume) *
 100

 const monthName = new Date(
 monthData.year,
 monthData.month - 1,
 ).toLocaleDateString('fr-FR', {
 month: 'long',
 year: 'numeric',
 })

 return (
 <div key={idx} className="space-y-2">
 <div className="flex items-center justify-between text-sm">
 <span className="font-medium capitalize">
 {monthName}
 </span>
 <span className="font-bold text-purple-600">
 {monthData.ai_search_volume.toLocaleString(
 'fr-FR',
 )}
 </span>
 </div>
 <Progress
 value={percentage}
 className="h-2"
 />
 </div>
 )
 })}
 </div>
 </CardContent>
 </Card>
 )}

 {/* Recommandations */}
 <Card className="border-2-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
 <Zap className="h-5 w-5 text-amber-600" />
 Recommandations
 </CardTitle>
 </CardHeader>
 <CardContent>
 <ul className="space-y-3">
 <li className="flex items-start gap-3">
 <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
 <span className="text-sm break-words lg:text-base">
 {item.ai_search_volume > 10000
 ? `Volume élevé (${item.ai_search_volume.toLocaleString('fr-FR')}). Ce mot clé est très recherché dans les outils IA. Optimisez votre contenu pour apparaître dans les réponses des LLM.`
 : `Volume modéré (${item.ai_search_volume.toLocaleString('fr-FR')}). Opportunité intéressante avec moins de compétition.`}
 </span>
 </li>
 <li className="flex items-start gap-3">
 <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
 <span className="text-sm lg:text-base">
 Créez du contenu structuré et détaillé pour
 être cité par les IA comme source fiable.
 </span>
 </li>
 <li className="flex items-start gap-3">
 <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
 <span className="text-sm lg:text-base">
 Utilisez un balisage sémantique (schema.org)
 pour améliorer votre visibilité dans les LLM.
 </span>
 </li>
 </ul>
 </CardContent>
 </Card>
 </div>
 ))}
 </div>
 )}
 </CardContent>
 </Card>
 </TabsContent>

 {/* Tab: LLM Mentions */}
 <TabsContent
 value="llm-mentions"
 className="w-full min-w-0 space-y-6 overflow-x-hidden lg:space-y-8"
 >
 <Card className="w-full min-w-0 overflow-x-hidden border-2 shadow-lg">
 <CardHeader className="w-full min-w-0 overflow-x-hidden lg:px-8 lg:py-7">
 <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
 <MessageSquare className="h-6 w-6 shrink-0 lg:h-7 lg:w-7" />
 Analyser les mentions LLM
 </CardTitle>
 <CardDescription className="mt-2 lg:text-base">
 Découvrez comment votre marque, domaine ou mots-clés sont
 mentionnés dans les réponses des LLM (Google Gemini, etc.)
 </CardDescription>
 </CardHeader>
 <CardContent className="w-full min-w-0 overflow-x-hidden lg:px-8 lg:pb-8">
 <form
 action={mentionsFormAction}
 className="w-full min-w-0 space-y-6 overflow-x-hidden"
 >
 <div className="space-y-2">
 <Label
 htmlFor="target_type"
 className="text-sm font-medium lg:text-base"
 >
 Type de cible *
 </Label>
 <Select
 name="target_type"
 defaultValue="keyword"
 disabled={isMentionsPending}
 required
 >
 <SelectTrigger className="h-11 lg:h-12 lg:text-base">
 <SelectValue placeholder="Sélectionner un type" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="keyword">Mot-clé</SelectItem>
 <SelectItem value="domain">Domaine</SelectItem>
 </SelectContent>
 </Select>
 <p className="text-xs text-muted-foreground">
 Analyse ciblée pour le marché français (France, langue
 française) via Google
 </p>
 </div>

 <div className="space-y-2">
 <Label
 htmlFor="target_value"
 className="text-sm font-medium lg:text-base"
 >
 Valeur de la cible *
 </Label>
 <textarea
 id="target_value"
 name="target_value"
 placeholder="Ex: nom de votre marque, domaine (exemple.com), ou mot-clé"
 required
 disabled={isMentionsPending}
 rows={3}
 className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:h-auto lg:text-base"
 />
 <p className="text-xs text-muted-foreground">
 Pour un domaine, saisissez-le sans https:// ou www. (ex:
 exemple.com)
 </p>
 </div>

 <div className="space-y-2">
 <Label
 htmlFor="limit"
 className="text-sm font-medium lg:text-base"
 >
 Nombre de résultats (optionnel)
 </Label>
 <Input
 id="limit"
 name="limit"
 type="number"
 min="1"
 max="1000"
 defaultValue="100"
 disabled={isMentionsPending}
 className="h-11 lg:h-12 lg:text-base"
 />
 <p className="text-xs text-muted-foreground">
 Entre 1 et 1000 (par défaut: 100). Analyse ciblée pour le
 marché français (France, langue française).
 </p>
 </div>

 <Button
 type="submit"
 className="h-11 w-full gap-2 lg:h-12 lg:text-base"
 disabled={isMentionsPending}
 >
 {isMentionsPending ? (
 <>
 <Loader2 className="h-5 w-5 animate-spin" />
 Analyse en cours...
 </>
 ) : (
 <>
 <MessageSquare className="h-5 w-5" />
 Lancer l&apos;analyse LLM Mentions
 </>
 )}
 </Button>
 </form>

 {/* Affichage des erreurs */}
 {mentionsState?.error && (
 <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
 <p className="text-sm font-semibold text-red-900 dark:text-red-200">
 ❌ Erreur
 </p>
 {typeof mentionsState.error === 'string' ? (
 <p className="mt-1 text-sm text-red-700 dark:text-red-300">
 {mentionsState.error}
 </p>
 ) : (
 <div className="mt-2 space-y-1">
 {Object.entries(mentionsState.error).map(
 ([field, errors]) => (
 <div key={field}>
 <p className="text-xs font-medium text-red-800 dark:text-red-300">
 {field}:
 </p>
 {Array.isArray(errors) &&
 errors.map((error: string, index: number) => (
 <p
 key={index}
 className="text-xs text-red-700 dark:text-red-400"
 >
 • {error}
 </p>
 ))}
 </div>
 ),
 )}
 </div>
 )}
 </div>
 )}

 {/* Résultats LLM Mentions */}
 {mentionsState?.success && mentionsState?.result && (
 <div className="mt-8 w-full max-w-full min-w-0 space-y-6 overflow-x-hidden">
 <Divider />

 {/* Header des résultats */}
 <div className="flex w-full max-w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 lg:h-14 lg:w-14">
 <MessageSquare className="h-6 w-6 text-white lg:h-7 lg:w-7" />
 </div>
 <div className="max-w-full min-w-0 flex-1 overflow-x-hidden">
 <h3 className="text-xl font-semibold break-words lg:text-2xl">
 Résultats pour{' '}
 {mentionsState.target_type === 'domain'
 ? `le domaine "${mentionsState.target_value}"`
 : `"${mentionsState.target_value}"`}
 </h3>
 <p className="text-sm text-muted-foreground lg:text-base">
 {mentionsState.result.items_count} mention(s) sur{' '}
 {mentionsState.result.total_count} total trouvé(s)
 </p>
 </div>
 </div>

 {/* Liste des mentions */}
 {mentionsState.result.items.map((item, index) => (
 <Card
 key={index}
 className="w-full max-w-full min-w-0 overflow-x-hidden border-2 shadow-sm transition-shadow hover:shadow-md"
 >
 <CardHeader className="w-full max-w-full min-w-0 overflow-x-hidden border-b bg-gradient-to-r from-purple-500/5 to-pink-500/5">
 <div className="flex w-full max-w-full min-w-0 items-start justify-between gap-4">
 <div className="max-w-full min-w-0 flex-1 overflow-x-hidden">
 <div className="mb-2 flex w-full max-w-full min-w-0 items-center gap-2">
 <CardTitle className="min-w-0 flex-1 text-lg break-words lg:text-xl">
 Mention #{index + 1}
 </CardTitle>
 <Badge color="purple" className="shrink-0">
 {item.platform}
 </Badge>
 </div>
 <div className="mt-2 flex w-full max-w-full min-w-0 flex-wrap gap-2">
 {item.ai_search_volume && (
 <Badge
 color="blue"
 className="max-w-full shrink-0 gap-1"
 >
 <TrendingUp className="h-3 w-3 shrink-0" />
 <span className="truncate">
 Volume IA:{' '}
 {item.ai_search_volume.toLocaleString(
 'fr-FR',
 )}
 </span>
 </Badge>
 )}
 {item.first_response_at && (
 <Badge
 color="zinc"
 className="max-w-full shrink-0 gap-1"
 >
 <Calendar className="h-3 w-3 shrink-0" />
 <span className="truncate">
 Première réponse:{' '}
 {new Date(
 item.first_response_at,
 ).toLocaleDateString('fr-FR', {
 day: 'numeric',
 month: 'short',
 year: 'numeric',
 })}
 </span>
 </Badge>
 )}
 {item.last_response_at && (
 <Badge
 color="zinc"
 className="max-w-full shrink-0 gap-1"
 >
 <Calendar className="h-3 w-3 shrink-0" />
 <span className="truncate">
 Dernière mise à jour:{' '}
 {new Date(
 item.last_response_at,
 ).toLocaleDateString('fr-FR', {
 day: 'numeric',
 month: 'short',
 year: 'numeric',
 })}
 </span>
 </Badge>
 )}
 </div>
 </div>
 </div>
 </CardHeader>
 <CardContent className="w-full max-w-full min-w-0 space-y-6 overflow-x-hidden pt-6">
 {/* Question */}
 {item.question && (
 <div className="w-full max-w-full min-w-0 overflow-x-hidden rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
 <div className="mb-2 flex items-start gap-2">
 <Search className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
 <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
 Question posée:
 </p>
 </div>
 <p className="text-sm break-words text-blue-800 lg:text-base dark:text-blue-300">
 {item.question}
 </p>
 </div>
 )}

 {/* Réponse avec meilleur rendu markdown */}
 {item.answer && (
 <div className="w-full max-w-full min-w-0 overflow-x-hidden">
 <div className="mb-3 flex items-start gap-2">
 <Brain className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
 <p className="text-sm font-semibold text-muted-foreground">
 Réponse du LLM:
 </p>
 </div>
 <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-lg border-2-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-4 dark:border-purple-800 dark:from-purple-950/20 dark:to-pink-950/20">
 <div
 className="prose prose-sm dark:prose-invert w-full max-w-full min-w-0 overflow-x-auto text-sm lg:text-base [&_*]:max-w-full [&_*]:min-w-0 [&_*]:break-words [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-purple-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:break-all [&_em]:italic [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:break-words [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:break-words [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:break-words [&_img]:h-auto [&_img]:max-w-full [&_li]:my-1 [&_li]:break-words [&_ol]:my-2 [&_ol]:ml-4 [&_ol]:list-decimal [&_p]:my-2 [&_p]:leading-relaxed [&_p]:break-words [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-muted [&_pre]:p-2 [&_pre]:break-all [&_strong]:font-semibold [&_table]:w-full [&_table]:overflow-x-auto [&_ul]:my-2 [&_ul]:ml-4 [&_ul]:list-disc"
 dangerouslySetInnerHTML={{
 __html: (() => {
 let html = item.answer
 // Convertir les liens markdown [texte](url)
 html = html.replace(
 /\[([^\]]+)\]\(([^)]+)\)/g,
 '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">$1</a>',
 )
 // Convertir le gras **texte**
 html = html.replace(
 /\*\*([^*]+)\*\*/g,
 '<strong>$1</strong>',
 )
 // Convertir l'italique *texte* (mais pas si c'est déjà du gras)
 html = html.replace(
 /(?<!\*)\*([^*]+)\*(?!\*)/g,
 '<em>$1</em>',
 )
 // Convertir le code inline `code`
 html = html.replace(
 /`([^`]+)`/g,
 '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>',
 )
 // Convertir les titres
 html = html.replace(
 /^### (.*$)/gim,
 '<h3>$1</h3>',
 )
 html = html.replace(
 /^## (.*$)/gim,
 '<h2>$1</h2>',
 )
 html = html.replace(
 /^# (.*$)/gim,
 '<h1>$1</h1>',
 )
 // Convertir les listes à puces
 html = html.replace(
 /^\* (.*$)/gim,
 '<li>$1</li>',
 )
 html = html.replace(
 /^- (.*$)/gim,
 '<li>$1</li>',
 )
 // Encapsuler les listes dans <ul>
 html = html.replace(
 /(<li>.*<\/li>\n?)+/g,
 '<ul>$&</ul>',
 )
 // Convertir les blockquotes
 html = html.replace(
 /^> (.*$)/gim,
 '<blockquote>$1</blockquote>',
 )
 // Convertir les paragraphes (double saut de ligne)
 html = html.replace(/\n\n/g, '</p><p>')
 // Convertir les simples sauts de ligne en <br>
 html = html.replace(/\n/g, '<br />')
 // Encapsuler dans un paragraphe si nécessaire
 if (!html.startsWith('<')) {
 html = '<p>' + html + '</p>'
 }
 return html
 })(),
 }}
 />
 </div>
 </div>
 )}

 {/* Métriques de volume IA mensuel */}
 {item.ai_monthly_searches &&
 item.ai_monthly_searches.length > 0 && (
 <Card className="w-full max-w-full min-w-0 overflow-x-hidden border-2-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
 <CardHeader className="w-full max-w-full min-w-0 overflow-x-hidden">
 <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
 <BarChart3 className="h-4 w-4 shrink-0" />
 Évolution mensuelle du volume IA
 </CardTitle>
 </CardHeader>
 <CardContent className="w-full max-w-full min-w-0 overflow-x-hidden">
 <div className="w-full max-w-full min-w-0 space-y-3">
 {item.ai_monthly_searches
 .slice(-6)
 .map((monthData, idx) => {
 const maxVolume = Math.max(
 ...(
 item.ai_monthly_searches || []
 ).map((m) => m.ai_search_volume),
 )
 const percentage =
 (monthData.ai_search_volume /
 maxVolume) *
 100

 const monthName = new Date(
 monthData.year,
 monthData.month - 1,
 ).toLocaleDateString('fr-FR', {
 month: 'short',
 year: 'numeric',
 })

 return (
 <div key={idx} className="space-y-1">
 <div className="flex items-center justify-between text-xs">
 <span className="font-medium">
 {monthName}
 </span>
 <span className="font-bold text-purple-600">
 {monthData.ai_search_volume.toLocaleString(
 'fr-FR',
 )}
 </span>
 </div>
 <Progress
 value={percentage}
 className="h-1.5"
 />
 </div>
 )
 })}
 </div>
 </CardContent>
 </Card>
 )}

 {/* Sources avec thumbnails */}
 {item.sources && item.sources.length > 0 && (
 <div className="w-full max-w-full min-w-0 overflow-x-hidden">
 <div className="mb-3 flex items-center gap-2">
 <Link2 className="h-4 w-4 shrink-0 text-purple-600" />
 <p className="text-sm font-semibold text-muted-foreground">
 Sources citées ({item.sources.length}):
 </p>
 </div>
 <div className="grid w-full max-w-full min-w-0 gap-3 sm:grid-cols-2">
 {item.sources.slice(0, 6).map((source, idx) => (
 <div
 key={idx}
 className="group w-full min-w-0 rounded-lg border bg-card p-3 transition-all hover:border-purple-300 hover:shadow-sm"
 >
 <div className="flex w-full min-w-0 gap-3 overflow-x-hidden">
 {source.thumbnail && (
 <div className="shrink-0">
 <img
 src={source.thumbnail}
 alt={source.title || 'Source'}
 className="h-16 w-16 rounded object-cover"
 onError={(e) => {
 e.currentTarget.style.display =
 'none'
 }}
 />
 </div>
 )}
 <div className="min-w-0 flex-1 overflow-x-hidden">
 {source.title && (
 <p className="line-clamp-2 text-sm font-medium break-words">
 {source.title}
 </p>
 )}
 {source.domain && (
 <p className="mt-1 text-xs break-all text-muted-foreground">
 {source.domain}
 </p>
 )}
 {source.snippet && (
 <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
 {source.snippet}
 </p>
 )}
 {source.url && (
 <a
 href={source.url}
 target="_blank"
 rel="noopener noreferrer"
 className="mt-2 inline-flex items-center gap-1 text-xs break-all text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400"
 >
 <ExternalLink className="h-3 w-3 shrink-0" />
 <span className="truncate">
 {source.url.length > 50
 ? `${source.url.substring(0, 50)}...`
 : source.url}
 </span>
 </a>
 )}
 {source.publication_date && (
 <p className="mt-1 text-xs text-muted-foreground">
 {new Date(
 source.publication_date,
 ).toLocaleDateString('fr-FR')}
 </p>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>
 {item.sources.length > 6 && (
 <p className="mt-3 text-center text-xs text-muted-foreground">
 +{item.sources.length - 6} autre(s) source(s)
 </p>
 )}
 </div>
 )}

 {/* Search Results */}
 {item.search_results &&
 item.search_results.length > 0 && (
 <div className="w-full max-w-full min-w-0 overflow-x-hidden">
 <div className="mb-3 flex items-center gap-2">
 <Search className="h-4 w-4 shrink-0 text-blue-600" />
 <p className="text-sm font-semibold text-muted-foreground">
 Résultats de recherche utilisés (
 {item.search_results.length}):
 </p>
 </div>
 <div className="max-h-60 w-full max-w-full min-w-0 space-y-2 overflow-x-hidden overflow-y-auto">
 {item.search_results
 .slice(0, 10)
 .map((result, idx) => (
 <div
 key={idx}
 className="w-full min-w-0 overflow-x-hidden rounded-md border bg-muted/30 p-2 text-xs"
 >
 {result.title && (
 <p className="font-medium break-words">
 {result.title}
 </p>
 )}
 {result.domain && (
 <p className="break-all text-muted-foreground">
 {result.domain}
 </p>
 )}
 {result.description && (
 <p className="mt-1 line-clamp-2 break-words text-muted-foreground">
 {result.description}
 </p>
 )}
 {result.url && (
 <a
 href={result.url}
 target="_blank"
 rel="noopener noreferrer"
 className="mt-1 inline-flex items-center gap-1 break-all text-blue-600 hover:underline"
 >
 <ExternalLink className="h-3 w-3 shrink-0" />
 <span className="truncate">
 {result.url.length > 60
 ? `${result.url.substring(0, 60)}...`
 : result.url}
 </span>
 </a>
 )}
 </div>
 ))}
 {item.search_results.length > 10 && (
 <p className="text-center text-xs text-muted-foreground">
 +{item.search_results.length - 10}{' '}
 autre(s) résultat(s)
 </p>
 )}
 </div>
 </div>
 )}

 {/* Fan-out queries */}
 {item.fan_out_queries &&
 item.fan_out_queries.length > 0 && (
 <div className="w-full max-w-full min-w-0 overflow-x-hidden">
 <div className="mb-3 flex items-center gap-2">
 <Sparkles className="h-4 w-4 shrink-0 text-purple-600" />
 <p className="text-sm font-semibold text-muted-foreground">
 Requêtes liées (
 {item.fan_out_queries.length}
 ):
 </p>
 </div>
 <div className="flex w-full max-w-full min-w-0 flex-wrap gap-2">
 {item.fan_out_queries.map((query, idx) => (
 <Badge
 key={idx}
 color="purple"
 className="max-w-full text-xs break-words"
 >
 <span className="truncate">{query}</span>
 </Badge>
 ))}
 </div>
 </div>
 )}

 {/* Entités de marque */}
 {item.brand_entities &&
 item.brand_entities.length > 0 && (
 <div className="w-full max-w-full min-w-0 overflow-x-hidden">
 <div className="mb-3 flex items-center gap-2">
 <Zap className="h-4 w-4 shrink-0 text-amber-600" />
 <p className="text-sm font-semibold text-muted-foreground">
 Entités de marque mentionnées:
 </p>
 </div>
 <div className="flex w-full max-w-full min-w-0 flex-wrap gap-2">
 {item.brand_entities.map((entity, idx) => (
 <Badge
 key={idx}
 color="amber"
 className="max-w-full break-words"
 >
 <span className="truncate">
 {entity.title}
 {entity.category && (
 <span className="ml-1 text-xs opacity-75">
 ({entity.category})
 </span>
 )}
 </span>
 </Badge>
 ))}
 </div>
 </div>
 )}
 </CardContent>
 </Card>
 ))}

 {mentionsState.result.items_count === 0 && (
 <Card className="border-2">
 <CardContent className="pt-6">
 <p className="text-center text-muted-foreground">
 Aucune mention trouvée pour cette cible.
 </p>
 </CardContent>
 </Card>
 )}
 </div>
 )}
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>

 <Divider className="my-8 lg:my-12" />

 {/* Section informative sur les APIs */}
 <section className="space-y-8 pb-12 lg:space-y-10">
 <div className="text-center">
 <h2 className="mb-3 text-2xl font-bold lg:text-3xl">
 Comprendre la visibilité IA
 </h2>
 <p className="mx-auto max-w-3xl text-muted-foreground lg:text-lg">
 Découvrez comment optimiser votre présence dans les outils
 d&apos;intelligence artificielle
 </p>
 </div>

 <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
 <Card className="border-2 transition-all hover:shadow-lg">
 <CardHeader className="lg:px-8 lg:py-7">
 <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10">
 <BarChart3 className="h-7 w-7 text-purple-600" />
 </div>
 <CardTitle className="text-xl lg:text-2xl">
 AI Keyword Data
 </CardTitle>
 </CardHeader>
 <CardContent className="lg:px-8">
 <p className="mb-4 text-sm leading-relaxed text-muted-foreground lg:text-base">
 Cette API analyse comment les mots clés sont utilisés dans les
 outils d&apos;IA comme ChatGPT, Claude et autres LLM. Elle
 fournit :
 </p>
 <ul className="space-y-2 text-sm lg:text-base">
 <li className="flex items-start gap-2">
 <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600" />
 <span>Volume de recherche estimé dans les IA</span>
 </li>
 <li className="flex items-start gap-2">
 <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600" />
 <span>Historique mensuel des recherches</span>
 </li>
 <li className="flex items-start gap-2">
 <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600" />
 <span>Tendances et évolution</span>
 </li>
 <li className="flex items-start gap-2">
 <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600" />
 <span>Recommandations d&apos;optimisation</span>
 </li>
 </ul>
 </CardContent>
 </Card>

 <Card className="border-2 transition-all hover:shadow-lg">
 <CardHeader className="lg:px-8 lg:py-7">
 <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-pink-500/10">
 <MessageSquare className="h-7 w-7 text-pink-600" />
 </div>
 <CardTitle className="text-xl lg:text-2xl">
 LLM Mentions
 </CardTitle>
 </CardHeader>
 <CardContent className="lg:px-8">
 <p className="mb-4 text-sm leading-relaxed text-muted-foreground lg:text-base">
 Cette API suit les mentions de votre marque, site web ou mots
 clés dans les grands modèles de langage. Elle offre :
 </p>
 <ul className="space-y-2 text-sm lg:text-base">
 <li className="flex items-start gap-2">
 <div className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-600" />
 <span>Nombre total de mentions dans les LLM</span>
 </li>
 <li className="flex items-start gap-2">
 <div className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-600" />
 <span>Volume d&apos;impressions générées</span>
 </li>
 <li className="flex items-start gap-2">
 <div className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-600" />
 <span>Identification des sources principales</span>
 </li>
 <li className="flex items-start gap-2">
 <div className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-600" />
 <span>Analyse de la croissance et tendances</span>
 </li>
 </ul>
 </CardContent>
 </Card>
 </div>
 </section>
 </div>
 </main>
 )
}

'use client'

import {
 Activity,
 AlertTriangle,
 ArrowDown,
 ArrowUp,
 BarChart3,
 ChevronDown,
 ChevronRight,
 Eye,
 Globe,
 Info,
 Loader2,
 Search,
 Star,
 Target,
 TrendingDown,
 TrendingUp,
 Users,
 Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type {
 SERPCompetitor,
 SERPCompetitorsResponse,
} from './actions'

interface SERPAnalyzerProProps {
 competitorsData: SERPCompetitorsResponse
 keyword: string
}

export default function SERPAnalyzerPro({
 competitorsData,
 keyword,
}: SERPAnalyzerProProps) {
 const [sortBy, setSortBy] = useState<
 'rating' | 'etv' | 'visibility' | 'avg_position' | 'keywords_count'
 >('rating')
 const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
 const [domainFilter, setDomainFilter] = useState('')
 const [expandedDomain, setExpandedDomain] = useState<string | null>(null)
 const [viewMode, setViewMode] = useState<'table' | 'insights'>('table')

 // Trier et filtrer les concurrents
 const sortedCompetitors = useMemo(() => {
 let filtered = competitorsData.items.filter((competitor) =>
 competitor.domain.toLowerCase().includes(domainFilter.toLowerCase()),
 )

 filtered.sort((a, b) => {
 let aValue: number
 let bValue: number

 switch (sortBy) {
 case 'rating':
 aValue = a.rating
 bValue = b.rating
 break
 case 'etv':
 aValue = a.etv
 bValue = b.etv
 break
 case 'visibility':
 aValue = a.visibility
 bValue = b.visibility
 break
 case 'avg_position':
 aValue = a.avg_position
 bValue = b.avg_position
 break
 case 'keywords_count':
 aValue = a.keywords_count
 bValue = b.keywords_count
 break
 default:
 return 0
 }

 if (sortOrder === 'asc') {
 return aValue - bValue
 } else {
 return bValue - aValue
 }
 })

 return filtered
 }, [competitorsData.items, sortBy, sortOrder, domainFilter])

 // Calculer les statistiques globales
 const stats = useMemo(() => {
 const competitors = competitorsData.items
 const totalETV = competitors.reduce((sum, c) => sum + c.etv, 0)
 const avgRating =
 competitors.reduce((sum, c) => sum + c.rating, 0) / competitors.length
 const avgVisibility =
 competitors.reduce((sum, c) => sum + c.visibility, 0) /
 competitors.length
 const avgPosition =
 competitors.reduce((sum, c) => sum + c.avg_position, 0) /
 competitors.length

 // Top 3 par ETV
 const top3ByETV = [...competitors]
 .sort((a, b) => b.etv - a.etv)
 .slice(0, 3)

 // Concurrents dans le top 10
 const top10Competitors = competitors.filter((c) => c.avg_position <= 10)

 // Opportunités (positions 11-20)
 const opportunities = competitors.filter(
 (c) => c.avg_position > 10 && c.avg_position <= 20,
 )

 return {
 totalETV,
 avgRating,
 avgVisibility,
 avgPosition,
 top3ByETV,
 top10Competitors: top10Competitors.length,
 opportunities: opportunities.length,
 }
 }, [competitorsData.items])

 // Insights SEO
 const insights = useMemo(() => {
 const competitors = competitorsData.items
 const topCompetitor = competitors[0] // Déjà trié par rating par défaut

 // Domination du marché
 const marketShare = topCompetitor
 ? (topCompetitor.etv / stats.totalETV) * 100
 : 0

 // Distribution des positions
 const top3Count = competitors.filter((c) => c.avg_position <= 3).length
 const top10Count = competitors.filter((c) => c.avg_position <= 10).length

 return {
 marketShare,
 topCompetitor,
 top3Count,
 top10Count,
 }
 }, [competitorsData.items, stats.totalETV])

 return (
 <div className="space-y-6">
 {/* En-tête avec métriques clés */}
 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
 <MetricCard
 label="Concurrents identifiés"
 value={competitorsData.items_count}
 icon={<Users className="h-5 w-5" />}
 color="blue"
 subtitle={`${competitorsData.total_count} au total • ${competitorsData.seed_keywords.length} mot-clé${competitorsData.seed_keywords.length > 1 ? 'x' : ''}`}
 />
 <MetricCard
 label="ETV total du marché"
 value={new Intl.NumberFormat('fr-FR', {
 maximumFractionDigits: 0,
 }).format(stats.totalETV)}
 icon={<BarChart3 className="h-5 w-5" />}
 color="green"
 subtitle={`Trafic mensuel estimé`}
 />
 <MetricCard
 label="Visibilité moyenne"
 value={`${(stats.avgVisibility * 100).toFixed(1)}%`}
 icon={<Eye className="h-5 w-5" />}
 color="purple"
 subtitle={`Position moy: ${stats.avgPosition.toFixed(1)}`}
 />
 <MetricCard
 label="Top 10"
 value={stats.top10Competitors}
 icon={<Target className="h-5 w-5" />}
 color="orange"
 subtitle={`Concurrents bien positionnés`}
 />
 </div>

 {/* Insights SEO */}
 {viewMode === 'insights' && (
 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
 <div className="rounded-xl border-2-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
 <div className="flex items-start gap-4">
 <div className="rounded-lg bg-card p-3 shadow-sm">
 <Zap className="h-6 w-6 text-blue-600" />
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-bold text-foreground">
 Leader du marché
 </h3>
 <p className="mt-1 text-sm text-gray-600">
 {insights.topCompetitor?.domain || 'N/A'}
 </p>
 <div className="mt-3 grid grid-cols-2 gap-3">
 <div>
 <div className="text-2xl font-bold text-blue-700">
 {insights.marketShare.toFixed(1)}%
 </div>
 <div className="text-xs text-gray-600">Part de marché ETV</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-blue-700">
 {insights.topCompetitor?.rating || 0}
 </div>
 <div className="text-xs text-gray-600">Rating SEO</div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="rounded-xl border-2-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-sm">
 <div className="flex items-start gap-4">
 <div className="rounded-lg bg-card p-3 shadow-sm">
 <Activity className="h-6 w-6 text-green-600" />
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-bold text-foreground">
 Distribution des positions
 </h3>
 <div className="mt-3 space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-sm text-gray-600">Top 3</span>
 <span className="font-semibold text-foreground">
 {insights.top3Count} domaines
 </span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-gray-600">Top 10</span>
 <span className="font-semibold text-foreground">
 {insights.top10Count} domaines
 </span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-gray-600">Opportunités</span>
 <span className="font-semibold text-foreground">
 {stats.opportunities} domaines (11-20)
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Navigation des vues */}
 <div className="flex flex-wrap gap-2 rounded-xl border border bg-card p-4 shadow-sm">
 <button
 onClick={() => setViewMode('table')}
 className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
 viewMode === 'table'
 ? 'bg-blue-600 text-white shadow-md'
 : 'bg-gray-50 text-gray-700 hover:bg-muted/50'
 }`}
 >
 <BarChart3 className="h-4 w-4" />
 Vue tableau
 </button>
 <button
 onClick={() => setViewMode('insights')}
 className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
 viewMode === 'insights'
 ? 'bg-blue-600 text-white shadow-md'
 : 'bg-gray-50 text-gray-700 hover:bg-muted/50'
 }`}
 >
 <Info className="h-4 w-4" />
 Insights SEO
 </button>
 </div>

 {/* Filtres et tri */}
 <div className="rounded-xl border border bg-card p-4 shadow-sm">
 <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
 {/* Recherche par domaine */}
 <div className="flex-1">
 <div className="relative">
 <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
 <input
 type="text"
 placeholder="Rechercher un domaine..."
 value={domainFilter}
 onChange={(e) => setDomainFilter(e.target.value)}
 className="w-full rounded-lg border border py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
 />
 </div>
 </div>

 {/* Tri */}
 <div className="flex items-center gap-2">
 <label className="text-sm font-medium text-gray-700">Trier par:</label>
 <select
 value={sortBy}
 onChange={(e) =>
 setSortBy(
 e.target.value as
 | 'rating'
 | 'etv'
 | 'visibility'
 | 'avg_position'
 | 'keywords_count',
 )
 }
 className="rounded-lg border border bg-card px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
 >
 <option value="rating">Rating (visibilité relative)</option>
 <option value="etv">ETV (trafic estimé)</option>
 <option value="visibility">Visibilité SERP</option>
 <option value="avg_position">Position moyenne</option>
 <option value="keywords_count">Nombre de mots-clés</option>
 </select>
 <button
 onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
 className="rounded-lg border border bg-card p-2 text-gray-600 hover:bg-gray-50"
 title={sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
 >
 {sortOrder === 'asc' ? (
 <ArrowUp className="h-4 w-4" />
 ) : (
 <ArrowDown className="h-4 w-4" />
 )}
 </button>
 </div>
 </div>
 </div>

 {/* Tableau des concurrents */}
 <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
 <div className="border-b border px-6 py-4">
 <div className="flex items-center justify-between">
 <h3 className="text-lg font-semibold text-foreground">
 Analyse détaillée des concurrents ({sortedCompetitors.length})
 </h3>
 <div className="text-sm text-gray-500">
 Cliquez sur un domaine pour voir les positions par mot-clé
 </div>
 </div>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
 Rang
 </th>
 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
 Domaine
 </th>
 <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
 Rating
 </th>
 <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
 ETV
 </th>
 <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
 Visibilité
 </th>
 <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
 Pos. moy.
 </th>
 <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
 Pos. méd.
 </th>
 <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
 Mots-clés
 </th>
 <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
 SERP items
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {sortedCompetitors.length === 0 ? (
 <tr>
 <td
 colSpan={9}
 className="px-6 py-12 text-center text-gray-500"
 >
 <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
 <p className="mt-4">Aucun concurrent trouvé</p>
 </td>
 </tr>
 ) : (
 sortedCompetitors.map((competitor, index) => (
 <CompetitorRow
 key={competitor.domain}
 competitor={competitor}
 rank={index + 1}
 seedKeywords={competitorsData.seed_keywords}
 isExpanded={expandedDomain === competitor.domain}
 onToggleExpand={() =>
 setExpandedDomain(
 expandedDomain === competitor.domain
 ? null
 : competitor.domain,
 )
 }
 />
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )
}

// Composants auxiliaires
function MetricCard({
 label,
 value,
 icon,
 color,
 subtitle,
}: {
 label: string
 value: string | number
 icon: React.ReactNode
 color: 'blue' | 'green' | 'orange' | 'purple'
 subtitle?: string
}) {
 const colorClasses = {
 blue: 'bg-blue-50 text-blue-600 border-blue-100',
 green: 'bg-green-50 text-green-600 border-green-100',
 orange: 'bg-orange-50 text-orange-600 border-orange-100',
 purple: 'bg-purple-50 text-purple-600 border-purple-100',
 }

 return (
 <div className="rounded-xl border-2 bg-card p-6 shadow-sm">
 <div className="flex items-start justify-between">
 <div className="flex-1">
 <p className="text-sm font-medium text-gray-600">{label}</p>
 <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
 {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
 </div>
 <div className={`rounded-lg border p-3 ${colorClasses[color]}`}>
 {icon}
 </div>
 </div>
 </div>
 )
}

function CompetitorRow({
 competitor,
 rank,
 seedKeywords,
 isExpanded,
 onToggleExpand,
}: {
 competitor: SERPCompetitor
 rank: number
 seedKeywords: string[]
 isExpanded: boolean
 onToggleExpand: () => void
}) {
 const getRatingColor = (rating: number) => {
 if (rating >= 90) return 'text-green-700 bg-green-100'
 if (rating >= 70) return 'text-blue-700 bg-blue-100'
 if (rating >= 50) return 'text-orange-700 bg-orange-100'
 return 'text-red-700 bg-red-100'
 }

 const getVisibilityColor = (visibility: number) => {
 if (visibility >= 0.8) return 'text-green-700'
 if (visibility >= 0.5) return 'text-blue-700'
 if (visibility >= 0.2) return 'text-orange-700'
 return 'text-red-700'
 }

 const getPositionBadge = (position: number) => {
 if (position <= 3) return 'bg-green-100 text-green-700'
 if (position <= 10) return 'bg-blue-100 text-blue-700'
 if (position <= 20) return 'bg-orange-100 text-orange-700'
 return 'bg-muted/50 text-gray-700'
 }

 // Calculer le pourcentage de part de marché ETV (approximatif)
 const marketShare = useMemo(() => {
 // Cette valeur serait mieux calculée avec le total ETV, mais on l'utilise comme indicateur relatif
 return competitor.etv > 0 ? 'Élevé' : 'Faible'
 }, [competitor.etv])

 return (
 <>
 <tr
 className="hover:bg-gray-50 transition-colors cursor-pointer"
 onClick={onToggleExpand}
 >
 <td className="px-6 py-4">
 <div className="flex items-center gap-2">
 <span className="font-semibold text-foreground">#{rank}</span>
 {rank <= 3 && (
 <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
 TOP {rank}
 </span>
 )}
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-2">
 {isExpanded ? (
 <ChevronDown className="h-4 w-4 text-gray-400" />
 ) : (
 <ChevronRight className="h-4 w-4 text-gray-400" />
 )}
 <Globe className="h-4 w-4 text-gray-400" />
 <a
 href={`https://${competitor.domain}`}
 target="_blank"
 rel="noopener noreferrer"
 onClick={(e) => e.stopPropagation()}
 className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
 >
 {competitor.domain}
 </a>
 </div>
 </td>
 <td className="px-6 py-4 text-center">
 <div className="flex items-center justify-center gap-1">
 <Star className="h-4 w-4 text-yellow-500" />
 <span
 className={`rounded-full px-2 py-1 text-xs font-semibold ${getRatingColor(competitor.rating)}`}
 >
 {competitor.rating}
 </span>
 </div>
 </td>
 <td className="px-6 py-4 text-center">
 <div className="flex flex-col items-center">
 <span className="font-semibold text-foreground">
 {new Intl.NumberFormat('fr-FR', {
 maximumFractionDigits: 0,
 }).format(competitor.etv)}
 </span>
 <span className="text-xs text-gray-500">trafic/mois</span>
 </div>
 </td>
 <td className="px-6 py-4 text-center">
 <div className="flex flex-col items-center">
 <span
 className={`font-semibold ${getVisibilityColor(competitor.visibility)}`}
 >
 {(competitor.visibility * 100).toFixed(1)}%
 </span>
 <span className="text-xs text-gray-500">SERP</span>
 </div>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="font-medium text-gray-700">
 {competitor.avg_position.toFixed(1)}
 </span>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="font-medium text-gray-700">
 {competitor.median_position}
 </span>
 </td>
 <td className="px-6 py-4 text-center">
 <div className="flex items-center justify-center gap-1">
 <Search className="h-4 w-4 text-gray-400" />
 <span className="font-medium text-gray-700">
 {competitor.keywords_count}
 </span>
 </div>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="font-medium text-gray-700">
 {competitor.relevant_serp_items}
 </span>
 </td>
 </tr>
 {isExpanded && (
 <tr className="bg-blue-50/50">
 <td colSpan={9} className="px-6 py-6">
 <div className="space-y-4">
 <h4 className="font-semibold text-foreground">
 Positions détaillées par mot-clé
 </h4>
 <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
 {seedKeywords.map((keyword) => {
 const positions =
 competitor.keywords_positions[keyword] || []
 const bestPosition = positions.length > 0 ? Math.min(...positions) : null
 const avgPos =
 positions.length > 0
 ? positions.reduce((a, b) => a + b, 0) / positions.length
 : null

 return (
 <div
 key={keyword}
 className="rounded-lg border border bg-card p-4 shadow-sm"
 >
 <div className="mb-2 flex items-center justify-between">
 <span className="font-medium text-foreground">
 {keyword}
 </span>
 {bestPosition && (
 <span
 className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getPositionBadge(bestPosition)}`}
 >
 Pos. {bestPosition}
 </span>
 )}
 </div>
 {positions.length > 0 ? (
 <div className="space-y-1">
 <div className="flex items-center justify-between text-xs">
 <span className="text-gray-600">Meilleure:</span>
 <span className="font-semibold text-foreground">
 {bestPosition}
 </span>
 </div>
 {positions.length > 1 && (
 <div className="flex items-center justify-between text-xs">
 <span className="text-gray-600">Moyenne:</span>
 <span className="font-semibold text-foreground">
 {avgPos?.toFixed(1)}
 </span>
 </div>
 )}
 {positions.length > 1 && (
 <div className="flex items-center gap-1 text-xs text-gray-500">
 <span>Toutes:</span>
 <span className="font-mono">
 {positions.join(', ')}
 </span>
 </div>
 )}
 </div>
 ) : (
 <div className="text-xs text-gray-400">
 Non classé pour ce mot-clé
 </div>
 )}
 </div>
 )
 })}
 </div>
 </div>
 </td>
 </tr>
 )}
 </>
 )
}

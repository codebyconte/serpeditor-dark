'use client'

import {
 ArrowUpDown,
 Award,
 BarChart3,
 ExternalLink,
 Filter,
 GitMerge,
 Globe,
 Link as LinkIcon,
 Search,
 Target,
 TrendingUp,
 Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type {
 DomainIntersectionItem,
 DomainIntersectionResponse,
 DomainIntersectionStats,
} from './action'
import { calculateIntersectionStats } from './utils'

interface DomainIntersectionAnalyzerProps {
 data: DomainIntersectionResponse
}

export default function DomainIntersectionAnalyzer({
 data,
}: DomainIntersectionAnalyzerProps) {
 const [viewMode, setViewMode] = useState<'overview' | 'all' | 'common'>(
 'overview',
 )
 const [searchQuery, setSearchQuery] = useState('')
 const [minTargets, setMinTargets] = useState(2)
 const [sortBy, setSortBy] = useState<'backlinks' | 'targets' | 'domains'>(
 'backlinks',
 )
 const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

 // Calculer les stats
 const stats: DomainIntersectionStats = useMemo(() => {
 return calculateIntersectionStats(data)
 }, [data])

 // Filtrer et trier
 const filteredDomains = useMemo(() => {
 let filtered = [...data.items]

 // Recherche
 if (searchQuery) {
 filtered = filtered.filter((item) =>
 item.referring_domain
 ?.toLowerCase()
 .includes(searchQuery.toLowerCase()),
 )
 }

 // Filtre minimum de targets
 if (viewMode === 'common') {
 filtered = filtered.filter((item) => {
 const targetsCount = Object.keys(item.domain_intersection).length
 return targetsCount >= minTargets
 })
 }

 // Tri
 filtered.sort((a, b) => {
 let aVal = 0
 let bVal = 0

 if (sortBy === 'backlinks') {
 aVal = Object.values(a.domain_intersection).reduce(
 (sum, t) => sum + (t.backlinks || 0),
 0,
 )
 bVal = Object.values(b.domain_intersection).reduce(
 (sum, t) => sum + (t.backlinks || 0),
 0,
 )
 } else if (sortBy === 'targets') {
 aVal = Object.keys(a.domain_intersection).length
 bVal = Object.keys(b.domain_intersection).length
 } else if (sortBy === 'domains') {
 aVal = Object.values(a.domain_intersection).reduce(
 (sum, t) => sum + (t.referring_domains || 0),
 0,
 )
 bVal = Object.values(b.domain_intersection).reduce(
 (sum, t) => sum + (t.referring_domains || 0),
 0,
 )
 }

 return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
 })

 return filtered
 }, [data.items, searchQuery, minTargets, sortBy, sortOrder, viewMode])

 // Domaines communs (pointent vers tous les targets)
 const commonDomains = useMemo(() => {
 return data.items.filter((item) => {
 return Object.keys(item.domain_intersection).length === stats.targetCount
 })
 }, [data.items, stats.targetCount])

 return (
 <div className="space-y-6">
 {/* Métriques clés */}
 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
 <MetricCard
 label="Domaines Référents"
 value={stats.totalReferringDomains.toLocaleString()}
 icon={<Globe className="h-5 w-5" />}
 color="blue"
 subtitle="Sites analysés"
 />
 <MetricCard
 label="Targets Analysées"
 value={stats.targetCount.toString()}
 icon={<Target className="h-5 w-5" />}
 color="purple"
 subtitle="Domaines cibles"
 />
 <MetricCard
 label="Backlinks Moyens"
 value={stats.avgBacklinksPerDomain.toLocaleString()}
 icon={<LinkIcon className="h-5 w-5" />}
 color="green"
 subtitle="Par domaine référent"
 />
 <MetricCard
 label="Domaines Communs"
 value={commonDomains.length.toLocaleString()}
 icon={<GitMerge className="h-5 w-5" />}
 color="orange"
 subtitle={`Vers ${stats.targetCount} targets`}
 />
 </div>

 {/* Navigation */}
 <div className="flex flex-wrap gap-2 rounded-xl border border bg-card p-4 shadow-sm">
 <ViewTab
 active={viewMode === 'overview'}
 onClick={() => setViewMode('overview')}
 icon={<BarChart3 className="h-4 w-4" />}
 label="Vue d'ensemble"
 />
 <ViewTab
 active={viewMode === 'all'}
 onClick={() => setViewMode('all')}
 icon={<Globe className="h-4 w-4" />}
 label="Tous les domaines"
 />
 <ViewTab
 active={viewMode === 'common'}
 onClick={() => setViewMode('common')}
 icon={<GitMerge className="h-4 w-4" />}
 label={`Domaines communs (${commonDomains.length})`}
 />
 </div>

 {/* Vue Overview */}
 {viewMode === 'overview' && (
 <OverviewView
 stats={stats}
 targets={data.targets}
 commonCount={commonDomains.length}
 />
 )}

 {/* Vue All Domains */}
 {viewMode === 'all' && (
 <AllDomainsView
 domains={filteredDomains}
 targets={data.targets}
 searchQuery={searchQuery}
 setSearchQuery={setSearchQuery}
 sortBy={sortBy}
 setSortBy={setSortBy}
 sortOrder={sortOrder}
 setSortOrder={setSortOrder}
 />
 )}

 {/* Vue Common Domains */}
 {viewMode === 'common' && (
 <CommonDomainsView
 domains={filteredDomains}
 targets={data.targets}
 searchQuery={searchQuery}
 setSearchQuery={setSearchQuery}
 minTargets={minTargets}
 setMinTargets={setMinTargets}
 sortBy={sortBy}
 setSortBy={setSortBy}
 sortOrder={sortOrder}
 setSortOrder={setSortOrder}
 targetCount={stats.targetCount}
 />
 )}
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

function ViewTab({
 active,
 onClick,
 icon,
 label,
}: {
 active: boolean
 onClick: () => void
 icon: React.ReactNode
 label: string
}) {
 return (
 <button
 onClick={onClick}
 className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
 active
 ? 'bg-blue-600 text-white shadow-md'
 : 'bg-gray-50 text-gray-700 hover:bg-muted/50'
 }`}
 >
 {icon}
 {label}
 </button>
 )
}

function OverviewView({
 stats,
 targets,
 commonCount,
}: {
 stats: DomainIntersectionStats
 targets: Record<string, string>
 commonCount: number
}) {
 return (
 <div className="space-y-6">
 {/* Targets analysées */}
 <div className="rounded-xl border border bg-card p-6 shadow-sm">
 <div className="mb-4 flex items-center gap-2">
 <Target className="h-5 w-5 text-purple-500" />
 <h3 className="text-lg font-bold text-foreground">
 Domaines Cibles Analysés
 </h3>
 </div>
 <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
 {Object.entries(targets).map(([id, domain]) => (
 <div
 key={id}
 className="flex items-center gap-3 rounded-lg border-2-purple-200 bg-purple-50 p-4"
 >
 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-lg font-bold text-white">
 {id}
 </div>
 <div className="min-w-0 flex-1">
 <a
 href={`https://${domain}`}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-1 font-semibold text-purple-900 hover:text-purple-700 hover:underline"
 >
 <span className="truncate">{domain}</span>
 <ExternalLink className="h-3 w-3 flex-shrink-0" />
 </a>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Matrice d'intersection */}
 <div className="rounded-xl border border bg-card p-6 shadow-sm">
 <div className="mb-4 flex items-center gap-2">
 <GitMerge className="h-5 w-5 text-orange-500" />
 <h3 className="text-lg font-bold text-foreground">
 Matrice d&apos;Intersection
 </h3>
 </div>
 <div className="space-y-3">
 {Object.entries(stats.intersectionMatrix)
 .sort((a, b) => Number(b[0]) - Number(a[0]))
 .map(([targetsCount, domainsCount]) => {
 const percentage =
 (domainsCount / stats.totalReferringDomains) * 100
 return (
 <div key={targetsCount} className="flex items-center gap-4">
 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-700">
 {targetsCount}
 </div>
 <div className="flex-1">
 <div className="mb-1 flex items-center justify-between">
 <span className="text-sm font-medium text-gray-700">
 {domainsCount} domaine{domainsCount > 1 ? 's' : ''}{' '}
 pointe{domainsCount > 1 ? 'nt' : ''} vers {targetsCount}{' '}
 target{Number(targetsCount) > 1 ? 's' : ''}
 </span>
 <span className="text-sm font-semibold text-orange-600">
 {percentage.toFixed(1)}%
 </span>
 </div>
 <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
 <div
 className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
 style={{ width: `${percentage}%` }}
 />
 </div>
 </div>
 <div className="text-2xl font-bold text-orange-600">
 {domainsCount}
 </div>
 </div>
 )
 })}
 </div>
 {commonCount > 0 && (
 <div className="mt-6 rounded-lg border-2-green-200 bg-green-50 p-4">
 <div className="flex items-center gap-3">
 <Award className="h-6 w-6 text-green-600" />
 <div>
 <p className="font-semibold text-green-900">
 {commonCount} domaine{commonCount > 1 ? 's' : ''} commun
 {commonCount > 1 ? 's' : ''}
 </p>
 <p className="text-sm text-green-700">
 Ces domaines pointent vers TOUTES vos targets (
 {stats.targetCount}) - opportunités premium !
 </p>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Top domaines référents */}
 <div className="rounded-xl border border bg-card p-6 shadow-sm">
 <div className="mb-4 flex items-center gap-2">
 <TrendingUp className="h-5 w-5 text-green-500" />
 <h3 className="text-lg font-bold text-foreground">
 Top 10 Domaines Référents
 </h3>
 </div>
 <div className="space-y-2">
 {stats.topReferringDomains.map((item, idx) => (
 <div
 key={idx}
 className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
 >
 <div className="flex items-center gap-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
 {idx + 1}
 </div>
 <a
 href={`https://${item.domain}`}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-1 font-medium text-foreground hover:text-blue-600 hover:underline"
 >
 {item.domain}
 <ExternalLink className="h-3 w-3" />
 </a>
 </div>
 <div className="flex items-center gap-6">
 <div className="text-right">
 <div className="text-sm text-gray-600">Backlinks</div>
 <div className="text-lg font-bold text-green-600">
 {item.totalBacklinks.toLocaleString()}
 </div>
 </div>
 <div className="text-right">
 <div className="text-sm text-gray-600">Targets</div>
 <div className="text-lg font-bold text-purple-600">
 {item.targetsCount}/{stats.targetCount}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Top TLDs */}
 <div className="rounded-xl border border bg-card p-6 shadow-sm">
 <div className="mb-4 flex items-center gap-2">
 <Globe className="h-5 w-5 text-blue-500" />
 <h3 className="text-lg font-bold text-foreground">
 Top Extensions (TLD)
 </h3>
 </div>
 <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
 {stats.topTLDs.map((item, idx) => (
 <div
 key={idx}
 className="rounded-lg border-2-gray-200 bg-gray-50 p-4 text-center"
 >
 <div className="text-xl font-bold text-blue-600">.{item.tld}</div>
 <div className="mt-1 text-sm text-gray-600">
 {item.count} domaines
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}

function AllDomainsView({
 domains,
 targets,
 searchQuery,
 setSearchQuery,
 sortBy,
 setSortBy,
 sortOrder,
 setSortOrder,
}: {
 domains: DomainIntersectionItem[]
 targets: Record<string, string>
 searchQuery: string
 setSearchQuery: (query: string) => void
 sortBy: 'backlinks' | 'targets' | 'domains'
 setSortBy: (sort: 'backlinks' | 'targets' | 'domains') => void
 sortOrder: 'asc' | 'desc'
 setSortOrder: (order: 'asc' | 'desc') => void
}) {
 return (
 <div className="space-y-6">
 {/* Filtres */}
 <div className="rounded-xl border border bg-card p-6 shadow-sm">
 <div className="grid grid-cols-1 gap-4">
 {/* Recherche */}
 <div>
 <label className="mb-2 block text-sm font-semibold text-gray-700">
 Rechercher
 </label>
 <div className="relative">
 <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Nom de domaine..."
 className="w-full rounded-lg border border py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
 />
 </div>
 </div>

 {/* Tri */}
 <div>
 <span className="mb-2 block text-sm font-semibold text-gray-700">
 Trier par
 </span>
 <div className="flex gap-2">
 <button
 onClick={() => {
 setSortBy('backlinks')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
 sortBy === 'backlinks'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 Backlinks <ArrowUpDown className="h-3 w-3" />
 </button>
 <button
 onClick={() => {
 setSortBy('targets')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
 sortBy === 'targets'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 Targets <ArrowUpDown className="h-3 w-3" />
 </button>
 <button
 onClick={() => {
 setSortBy('domains')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
 sortBy === 'domains'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 Domaines <ArrowUpDown className="h-3 w-3" />
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Liste */}
 <div className="rounded-xl border bg-card shadow-sm">
 <div className="border-b border px-6 py-4">
 <h3 className="font-semibold text-foreground">
 {domains.length} domaine{domains.length > 1 ? 's' : ''} référent
 {domains.length > 1 ? 's' : ''}
 </h3>
 </div>
 <div className="divide-y divide-gray-100">
 {domains.slice(0, 50).map((item, idx) => (
 <DomainIntersectionCard key={idx} item={item} targets={targets} />
 ))}
 </div>
 </div>
 </div>
 )
}

function CommonDomainsView({
 domains,
 targets,
 searchQuery,
 setSearchQuery,
 minTargets,
 setMinTargets,
 sortBy,
 setSortBy,
 sortOrder,
 setSortOrder,
 targetCount,
}: {
 domains: DomainIntersectionItem[]
 targets: Record<string, string>
 searchQuery: string
 setSearchQuery: (query: string) => void
 minTargets: number
 setMinTargets: (min: number) => void
 sortBy: 'backlinks' | 'targets' | 'domains'
 setSortBy: (sort: 'backlinks' | 'targets' | 'domains') => void
 sortOrder: 'asc' | 'desc'
 setSortOrder: (order: 'asc' | 'desc') => void
 targetCount: number
}) {
 return (
 <div className="space-y-6">
 {/* Info Box */}
 <div className="rounded-xl border-2-green-200 bg-green-50 p-6">
 <div className="flex items-start gap-3">
 <Zap className="h-6 w-6 flex-shrink-0 text-green-600" />
 <div>
 <h3 className="font-semibold text-green-900">
 Opportunités de Backlinks Communes
 </h3>
 <p className="mt-1 text-sm text-green-700">
 Ces domaines pointent vers plusieurs de vos concurrents.
 Contactez-les pour obtenir un backlink vers votre site !
 </p>
 </div>
 </div>
 </div>

 {/* Filtres */}
 <div className="rounded-xl border border bg-card p-6 shadow-sm">
 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
 {/* Recherche */}
 <div>
 <label className="mb-2 block text-sm font-semibold text-gray-700">
 Rechercher
 </label>
 <div className="relative">
 <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Nom de domaine..."
 className="w-full rounded-lg border border py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
 />
 </div>
 </div>

 {/* Minimum targets */}
 <div>
 <label className="mb-2 block text-sm font-semibold text-gray-700">
 Minimum de targets ciblées
 </label>
 <select
 value={minTargets}
 onChange={(e) => setMinTargets(Number(e.target.value))}
 className="w-full rounded-lg border border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
 >
 {Array.from({ length: targetCount - 1 }, (_, i) => i + 2).map(
 (num) => (
 <option key={num} value={num}>
 {num} targets ou plus
 </option>
 ),
 )}
 </select>
 </div>
 </div>

 {/* Tri */}
 <div className="mt-4">
 <span className="mb-2 block text-sm font-semibold text-gray-700">
 Trier par
 </span>
 <div className="flex gap-2">
 <button
 onClick={() => {
 setSortBy('backlinks')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
 sortBy === 'backlinks'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 Backlinks <ArrowUpDown className="h-3 w-3" />
 </button>
 <button
 onClick={() => {
 setSortBy('targets')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
 sortBy === 'targets'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 Targets <ArrowUpDown className="h-3 w-3" />
 </button>
 <button
 onClick={() => {
 setSortBy('domains')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
 sortBy === 'domains'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 Domaines <ArrowUpDown className="h-3 w-3" />
 </button>
 </div>
 </div>
 </div>

 {/* Liste */}
 <div className="rounded-xl border bg-card shadow-sm">
 <div className="border-b border px-6 py-4">
 <h3 className="font-semibold text-foreground">
 {domains.length} domaine{domains.length > 1 ? 's' : ''} commun
 {domains.length > 1 ? 's' : ''}
 </h3>
 </div>
 {domains.length === 0 ? (
 <div className="flex flex-col items-center justify-center p-16 text-center">
 <Filter className="h-16 w-16 text-gray-300" />
 <h3 className="mt-4 text-xl font-semibold">
 Aucun domaine trouvé
 </h3>
 <p className="mt-2 text-gray-600">
 Essayez de réduire le nombre minimum de targets
 </p>
 </div>
 ) : (
 <div className="divide-y divide-gray-100">
 {domains.slice(0, 50).map((item, idx) => (
 <DomainIntersectionCard
 key={idx}
 item={item}
 targets={targets}
 highlighted
 />
 ))}
 </div>
 )}
 </div>
 </div>
 )
}

function DomainIntersectionCard({
 item,
 targets,
 highlighted,
}: {
 item: DomainIntersectionItem
 targets: Record<string, string>
 highlighted?: boolean
}) {
 const targetsCount = Object.keys(item.domain_intersection).length
 const totalBacklinks = Object.values(item.domain_intersection).reduce(
 (sum, t) => sum + (t.backlinks || 0),
 0,
 )
 const totalReferringDomains = Object.values(item.domain_intersection).reduce(
 (sum, t) => sum + (t.referring_domains || 0),
 0,
 )

 return (
 <div
 className={`p-6 hover:bg-gray-50 ${highlighted ? 'bg-green-50/30' : ''}`}
 >
 <div className="mb-4 flex items-start justify-between">
 {/* Domain */}
 <div className="flex items-center gap-3">
 <Globe className="h-5 w-5 text-gray-400" />
 <a
 href={`https://${item.referring_domain}`}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-1 text-lg font-semibold text-blue-600 hover:text-blue-700 hover:underline"
 >
 {item.referring_domain}
 <ExternalLink className="h-4 w-4" />
 </a>
 </div>

 {/* Badge */}
 <div className="flex items-center gap-2">
 <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
 {targetsCount}/{Object.keys(targets).length} targets
 </span>
 {targetsCount === Object.keys(targets).length && (
 <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
 ⭐ TOUTES
 </span>
 )}
 </div>
 </div>

 {/* Stats globales */}
 <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
 <div className="rounded-lg bg-green-50 p-3">
 <div className="text-xs font-medium text-green-600">
 Total Backlinks
 </div>
 <div className="mt-1 text-xl font-bold text-green-700">
 {totalBacklinks.toLocaleString()}
 </div>
 </div>
 <div className="rounded-lg bg-blue-50 p-3">
 <div className="text-xs font-medium text-blue-600">
 Domaines Référents
 </div>
 <div className="mt-1 text-xl font-bold text-blue-700">
 {totalReferringDomains.toLocaleString()}
 </div>
 </div>
 <div className="rounded-lg bg-purple-50 p-3">
 <div className="text-xs font-medium text-purple-600">
 Targets Pointées
 </div>
 <div className="mt-1 text-xl font-bold text-purple-700">
 {targetsCount}/{Object.keys(targets).length}
 </div>
 </div>
 </div>

 {/* Détail par target */}
 <div className="space-y-2">
 <div className="text-sm font-semibold text-gray-700">
 Détail par target :
 </div>
 <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
 {Object.entries(item.domain_intersection).map(
 ([targetId, targetData]) => (
 <div
 key={targetId}
 className="flex items-center gap-3 rounded-lg border border bg-card p-3"
 >
 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
 {targetId}
 </div>
 <div className="min-w-0 flex-1">
 <div className="truncate text-sm font-medium text-foreground">
 {targets[targetId]}
 </div>
 <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-600">
 <span>
 {(targetData.backlinks || 0).toLocaleString()} BL
 </span>
 <span>•</span>
 <span>
 {(targetData.referring_domains || 0).toLocaleString()} RD
 </span>
 </div>
 </div>
 </div>
 ),
 )}
 </div>
 </div>
 </div>
 )
}

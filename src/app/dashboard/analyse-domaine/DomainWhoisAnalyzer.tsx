'use client'

import {
 AlertCircle,
 ArrowUpDown,
 BarChart3,
 Calendar,
 CheckCircle,
 Clock,
 ExternalLink,
 Globe,
 Link as LinkIcon,
 Search,
 Shield,
 TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type {
 DomainWhoisItem,
 DomainWhoisResponse,
 DomainWhoisStats,
} from './action'
import { calculateDomainWhoisStats } from './utils'

interface DomainWhoisAnalyzerProps {
 data: DomainWhoisResponse
}

export default function DomainWhoisAnalyzer({
 data,
}: DomainWhoisAnalyzerProps) {
 const [viewMode, setViewMode] = useState<'overview' | 'domains' | 'expired'>(
 'overview',
 )
 const [searchQuery, setSearchQuery] = useState('')
 const [filterStatus, setFilterStatus] = useState<
 'all' | 'expired' | 'active'
 >('all')
 const [sortBy, setSortBy] = useState<
 'backlinks' | 'keywords' | 'etv' | 'expiration'
 >('backlinks')
 const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

 // Calculer les stats
 const stats: DomainWhoisStats = useMemo(() => {
 return calculateDomainWhoisStats(data.items)
 }, [data.items])

 // Filtrer et trier les domaines
 const filteredDomains = useMemo(() => {
 let filtered = [...data.items]

 // Recherche
 if (searchQuery) {
 filtered = filtered.filter((item) =>
 item.domain.toLowerCase().includes(searchQuery.toLowerCase()),
 )
 }

 // Filtre statut
 if (filterStatus === 'expired') {
 filtered = filtered.filter((item) => !item.registered)
 } else if (filterStatus === 'active') {
 filtered = filtered.filter((item) => item.registered)
 }

 // Tri
 filtered.sort((a, b) => {
 let aVal = 0
 let bVal = 0

 if (sortBy === 'backlinks') {
 aVal = a.backlinks_info?.backlinks || 0
 bVal = b.backlinks_info?.backlinks || 0
 } else if (sortBy === 'keywords') {
 aVal = a.metrics?.organic?.count || 0
 bVal = b.metrics?.organic?.count || 0
 } else if (sortBy === 'etv') {
 aVal = a.metrics?.organic?.etv || 0
 bVal = b.metrics?.organic?.etv || 0
 } else if (sortBy === 'expiration') {
 aVal = a.expiration_datetime
 ? new Date(a.expiration_datetime).getTime()
 : 0
 bVal = b.expiration_datetime
 ? new Date(b.expiration_datetime).getTime()
 : 0
 }

 return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
 })

 return filtered
 }, [data.items, searchQuery, filterStatus, sortBy, sortOrder])

 // Filtrer uniquement les domaines expirés
 const expiredDomains = useMemo(() => {
 return data.items.filter((item) => !item.registered)
 }, [data.items])

 return (
 <div className="space-y-6">
 {/* En-tête avec métriques clés */}
 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
 <MetricCard
 label="Total Domaines"
 value={stats.totalDomains.toLocaleString()}
 icon={<Globe className="h-5 w-5" />}
 color="blue"
 subtitle="Dans la base de données"
 />
 <MetricCard
 label="Domaines Expirés"
 value={stats.expiredDomains.toLocaleString()}
 icon={<AlertCircle className="h-5 w-5" />}
 color="orange"
 subtitle={`${((stats.expiredDomains / stats.totalDomains) * 100).toFixed(1)}% du total`}
 />
 <MetricCard
 label="Backlinks Moyen"
 value={Math.round(stats.avgBacklinks).toLocaleString()}
 icon={<LinkIcon className="h-5 w-5" />}
 color="green"
 subtitle={`${Math.round(stats.avgReferringDomains)} domaines référents`}
 />
 <MetricCard
 label="Keywords Moyen"
 value={Math.round(stats.avgOrganicKeywords).toLocaleString()}
 icon={<TrendingUp className="h-5 w-5" />}
 color="purple"
 subtitle={`$${Math.round(stats.avgETV).toLocaleString()} ETV`}
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
 active={viewMode === 'domains'}
 onClick={() => setViewMode('domains')}
 icon={<Globe className="h-4 w-4" />}
 label="Tous les domaines"
 />
 <ViewTab
 active={viewMode === 'expired'}
 onClick={() => setViewMode('expired')}
 icon={<AlertCircle className="h-4 w-4" />}
 label={`Domaines expirés (${stats.expiredDomains})`}
 />
 </div>

 {/* Vue Overview */}
 {viewMode === 'overview' && <OverviewView stats={stats} />}

 {/* Vue Domains */}
 {viewMode === 'domains' && (
 <DomainsView
 domains={filteredDomains}
 searchQuery={searchQuery}
 setSearchQuery={setSearchQuery}
 filterStatus={filterStatus}
 setFilterStatus={setFilterStatus}
 sortBy={sortBy}
 setSortBy={setSortBy}
 sortOrder={sortOrder}
 setSortOrder={setSortOrder}
 />
 )}

 {/* Vue Expired */}
 {viewMode === 'expired' && (
 <ExpiredDomainsView
 domains={expiredDomains}
 searchQuery={searchQuery}
 setSearchQuery={setSearchQuery}
 sortBy={sortBy}
 setSortBy={setSortBy}
 sortOrder={sortOrder}
 setSortOrder={setSortOrder}
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

function OverviewView({ stats }: { stats: DomainWhoisStats }) {
 return (
 <div className="space-y-6">
 {/* Statistiques générales */}
 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
 <div className="rounded-xl border-2-blue-200 bg-blue-50 p-6">
 <div className="mb-4 flex items-center gap-2">
 <CheckCircle className="h-5 w-5 text-blue-600" />
 <h3 className="text-lg font-bold text-blue-900">Domaines Actifs</h3>
 </div>
 <div className="text-3xl font-bold tracking-tight text-blue-700">
 {stats.activeDomains}
 </div>
 <div className="mt-2 text-sm text-blue-600">
 {((stats.activeDomains / stats.totalDomains) * 100).toFixed(1)}% du
 total
 </div>
 </div>

 <div className="rounded-xl border-2-orange-200 bg-orange-50 p-6">
 <div className="mb-4 flex items-center gap-2">
 <AlertCircle className="h-5 w-5 text-orange-600" />
 <h3 className="text-lg font-bold text-orange-900">
 Domaines Expirés
 </h3>
 </div>
 <div className="text-3xl font-bold tracking-tight text-orange-700">
 {stats.expiredDomains}
 </div>
 <div className="mt-2 text-sm text-orange-600">
 Opportunités disponibles
 </div>
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

 {/* Top domaines par backlinks */}
 <div className="rounded-xl border border bg-card p-6 shadow-sm">
 <div className="mb-4 flex items-center gap-2">
 <LinkIcon className="h-5 w-5 text-green-500" />
 <h3 className="text-lg font-bold text-foreground">
 Top Domaines par Backlinks
 </h3>
 </div>
 <div className="space-y-2">
 {stats.topByBacklinks.map((item, idx) => (
 <div
 key={idx}
 className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
 >
 <div className="flex items-center gap-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
 {idx + 1}
 </div>
 <span className="font-medium text-foreground">{item.domain}</span>
 </div>
 <div className="flex items-center gap-4">
 <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
 <div
 className="h-full bg-green-600"
 style={{
 width: `${(item.backlinks / stats.topByBacklinks[0].backlinks) * 100}%`,
 }}
 />
 </div>
 <span className="w-20 text-right text-lg font-bold text-green-600">
 {item.backlinks.toLocaleString()}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Top domaines par Keywords */}
 <div className="rounded-xl border border bg-card p-6 shadow-sm">
 <div className="mb-4 flex items-center gap-2">
 <TrendingUp className="h-5 w-5 text-purple-500" />
 <h3 className="text-lg font-bold text-foreground">
 Top Domaines par Keywords
 </h3>
 </div>
 <div className="space-y-2">
 {stats.topByKeywords.map((item, idx) => (
 <div
 key={idx}
 className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
 >
 <div className="flex items-center gap-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
 {idx + 1}
 </div>
 <span className="font-medium text-foreground">{item.domain}</span>
 </div>
 <div className="flex items-center gap-4">
 <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
 <div
 className="h-full bg-purple-600"
 style={{
 width: `${(item.keywords / stats.topByKeywords[0].keywords) * 100}%`,
 }}
 />
 </div>
 <span className="w-20 text-right text-lg font-bold text-purple-600">
 {item.keywords.toLocaleString()}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}

function DomainsView({
 domains,
 searchQuery,
 setSearchQuery,
 filterStatus,
 setFilterStatus,
 sortBy,
 setSortBy,
 sortOrder,
 setSortOrder,
}: {
 domains: DomainWhoisItem[]
 searchQuery: string
 setSearchQuery: (query: string) => void
 filterStatus: 'all' | 'expired' | 'active'
 setFilterStatus: (status: 'all' | 'expired' | 'active') => void
 sortBy: 'backlinks' | 'keywords' | 'etv' | 'expiration'
 setSortBy: (sort: 'backlinks' | 'keywords' | 'etv' | 'expiration') => void
 sortOrder: 'asc' | 'desc'
 setSortOrder: (order: 'asc' | 'desc') => void
}) {
 return (
 <div className="space-y-6">
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

 {/* Filtre Statut */}
 <div>
 <label className="mb-2 block text-sm font-semibold text-gray-700">
 Statut
 </label>
 <select
 value={filterStatus}
 onChange={(e) =>
 setFilterStatus(e.target.value as 'all' | 'expired' | 'active')
 }
 className="w-full rounded-lg border border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
 >
 <option value="all">Tous les domaines</option>
 <option value="expired">Expirés uniquement</option>
 <option value="active">Actifs uniquement</option>
 </select>
 </div>
 </div>

 {/* Tri */}
 <div className="mt-4 flex items-center gap-4">
 <span className="text-sm font-semibold text-gray-700">
 Trier par:
 </span>
 <button
 onClick={() => {
 setSortBy('backlinks')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
 sortBy === 'backlinks'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 Backlinks <ArrowUpDown className="h-3 w-3" />
 </button>
 <button
 onClick={() => {
 setSortBy('keywords')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
 sortBy === 'keywords'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 Keywords <ArrowUpDown className="h-3 w-3" />
 </button>
 <button
 onClick={() => {
 setSortBy('etv')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
 sortBy === 'etv'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 ETV <ArrowUpDown className="h-3 w-3" />
 </button>
 </div>
 </div>

 {/* Liste des domaines */}
 <div className="rounded-xl border bg-card shadow-sm">
 <div className="border-b border px-6 py-4">
 <h3 className="font-semibold text-foreground">
 {domains.length} domaine{domains.length > 1 ? 's' : ''}
 </h3>
 </div>
 <div className="divide-y divide-gray-100">
 {domains.slice(0, 50).map((domain, idx) => (
 <DomainCard key={idx} domain={domain} />
 ))}
 </div>
 </div>
 </div>
 )
}

function ExpiredDomainsView({
 domains,
 searchQuery,
 setSearchQuery,
 sortBy,
 setSortBy,
 sortOrder,
 setSortOrder,
}: {
 domains: DomainWhoisItem[]
 searchQuery: string
 setSearchQuery: (query: string) => void
 sortBy: 'backlinks' | 'keywords' | 'etv' | 'expiration'
 setSortBy: (sort: 'backlinks' | 'keywords' | 'etv' | 'expiration') => void
 sortOrder: 'asc' | 'desc'
 setSortOrder: (order: 'asc' | 'desc') => void
}) {
 // Filtrer et trier
 const filtered = useMemo(() => {
 let result = [...domains]

 if (searchQuery) {
 result = result.filter((item) =>
 item.domain.toLowerCase().includes(searchQuery.toLowerCase()),
 )
 }

 result.sort((a, b) => {
 let aVal = 0
 let bVal = 0

 if (sortBy === 'backlinks') {
 aVal = a.backlinks_info?.backlinks || 0
 bVal = b.backlinks_info?.backlinks || 0
 } else if (sortBy === 'keywords') {
 aVal = a.metrics?.organic?.count || 0
 bVal = b.metrics?.organic?.count || 0
 } else if (sortBy === 'etv') {
 aVal = a.metrics?.organic?.etv || 0
 bVal = b.metrics?.organic?.etv || 0
 } else if (sortBy === 'expiration') {
 aVal = a.expiration_datetime
 ? new Date(a.expiration_datetime).getTime()
 : 0
 bVal = b.expiration_datetime
 ? new Date(b.expiration_datetime).getTime()
 : 0
 }

 return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
 })

 return result
 }, [domains, searchQuery, sortBy, sortOrder])

 if (domains.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center rounded-xl border-2-dashed border bg-card p-16 text-center">
 <CheckCircle className="h-16 w-16 text-green-300" />
 <h3 className="mt-4 text-xl font-semibold">
 Aucun domaine expiré
 </h3>
 <p className="mt-2 text-gray-600">
 Tous les domaines de la liste sont actuellement actifs
 </p>
 </div>
 )
 }

 return (
 <div className="space-y-6">
 {/* Alert */}
 <div className="rounded-xl border-2-orange-200 bg-orange-50 p-6">
 <div className="flex items-start gap-3">
 <AlertCircle className="h-6 w-6 flex-shrink-0 text-orange-600" />
 <div>
 <h3 className="font-semibold text-orange-900">
 {domains.length} domaine{domains.length > 1 ? 's' : ''} expiré
 {domains.length > 1 ? 's' : ''} disponible
 {domains.length > 1 ? 's' : ''}
 </h3>
 <p className="mt-1 text-sm text-orange-700">
 Ces domaines ne sont plus enregistrés et peuvent potentiellement
 être rachetés. Vérifiez leur historique avant tout achat.
 </p>
 </div>
 </div>
 </div>

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
 setSortBy('keywords')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
 sortBy === 'keywords'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 Keywords <ArrowUpDown className="h-3 w-3" />
 </button>
 <button
 onClick={() => {
 setSortBy('etv')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
 sortBy === 'etv'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 ETV <ArrowUpDown className="h-3 w-3" />
 </button>
 <button
 onClick={() => {
 setSortBy('expiration')
 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
 }}
 className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
 sortBy === 'expiration'
 ? 'bg-blue-600 text-white'
 : 'bg-muted/50 text-gray-700 hover:bg-gray-200'
 }`}
 >
 Expiration <ArrowUpDown className="h-3 w-3" />
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Liste */}
 <div className="rounded-xl border bg-card shadow-sm">
 <div className="border-b border px-6 py-4">
 <h3 className="font-semibold text-foreground">
 {filtered.length} domaine{filtered.length > 1 ? 's' : ''} trouvé
 {filtered.length > 1 ? 's' : ''}
 </h3>
 </div>
 <div className="divide-y divide-gray-100">
 {filtered.slice(0, 50).map((domain, idx) => (
 <DomainCard key={idx} domain={domain} showExpiredBadge />
 ))}
 </div>
 </div>
 </div>
 )
}

function DomainCard({
 domain,
 showExpiredBadge,
}: {
 domain: DomainWhoisItem
 showExpiredBadge?: boolean
}) {
 const getDaysUntilExpiration = () => {
 if (!domain.expiration_datetime) return null
 const now = new Date()
 const expiration = new Date(domain.expiration_datetime)
 const days = Math.floor(
 (expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
 )
 return days
 }

 const daysUntilExpiration = getDaysUntilExpiration()

 return (
 <div className="p-6 hover:bg-gray-50">
 <div className="flex items-start gap-4">
 {/* Content */}
 <div className="min-w-0 flex-1">
 {/* Domain Name */}
 <div className="mb-3 flex items-center gap-3">
 <Globe className="h-5 w-5 flex-shrink-0 text-gray-400" />
 <a
 href={`https://${domain.domain}`}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-1 text-lg font-semibold text-blue-600 hover:text-blue-700 hover:underline"
 >
 {domain.domain}
 <ExternalLink className="h-4 w-4" />
 </a>
 <span className="rounded-full bg-muted/50 px-3 py-1 text-xs font-semibold text-gray-700">
 .{domain.tld}
 </span>
 {!domain.registered && showExpiredBadge && (
 <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
 EXPIRÉ
 </span>
 )}
 {domain.registered && (
 <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
 ACTIF
 </span>
 )}
 </div>

 {/* Metrics Grid */}
 <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
 <div className="rounded-lg bg-green-50 p-3">
 <div className="text-xs font-medium text-green-600">
 Backlinks
 </div>
 <div className="mt-1 text-xl font-bold text-green-700">
 {domain.backlinks_info?.backlinks?.toLocaleString() || 0}
 </div>
 <div className="mt-0.5 text-xs text-green-600">
 {domain.backlinks_info?.referring_main_domains || 0} domaines
 </div>
 </div>

 <div className="rounded-lg bg-purple-50 p-3">
 <div className="text-xs font-medium text-purple-600">
 Keywords
 </div>
 <div className="mt-1 text-xl font-bold text-purple-700">
 {domain.metrics?.organic?.count?.toLocaleString() || 0}
 </div>
 <div className="mt-0.5 text-xs text-purple-600">organiques</div>
 </div>

 <div className="rounded-lg bg-blue-50 p-3">
 <div className="text-xs font-medium text-blue-600">ETV</div>
 <div className="mt-1 text-xl font-bold text-blue-700">
 $
 {Math.round(domain.metrics?.organic?.etv || 0).toLocaleString()}
 </div>
 <div className="mt-0.5 text-xs text-blue-600">valeur estimée</div>
 </div>

 <div className="rounded-lg bg-orange-50 p-3">
 <div className="text-xs font-medium text-orange-600">
 {domain.registered ? 'Expire dans' : 'Expiré depuis'}
 </div>
 <div className="mt-1 text-xl font-bold text-orange-700">
 {daysUntilExpiration !== null
 ? `${Math.abs(daysUntilExpiration)}j`
 : 'N/A'}
 </div>
 <div className="mt-0.5 text-xs text-orange-600">
 {domain.expiration_datetime
 ? new Date(domain.expiration_datetime).toLocaleDateString(
 'fr-FR',
 )
 : 'Inconnue'}
 </div>
 </div>
 </div>

 {/* Dates */}
 {(domain.created_datetime || domain.updated_datetime) && (
 <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
 {domain.created_datetime && (
 <div className="flex items-center gap-1">
 <Calendar className="h-3 w-3" />
 <span>
 Créé:{' '}
 {new Date(domain.created_datetime).toLocaleDateString(
 'fr-FR',
 )}
 </span>
 </div>
 )}
 {domain.updated_datetime && (
 <div className="flex items-center gap-1">
 <Clock className="h-3 w-3" />
 <span>
 MAJ:{' '}
 {new Date(domain.updated_datetime).toLocaleDateString(
 'fr-FR',
 )}
 </span>
 </div>
 )}
 {domain.backlinks_info?.dofollow !== undefined && (
 <div className="flex items-center gap-1">
 <Shield className="h-3 w-3" />
 <span>
 {domain.backlinks_info.dofollow} dofollow /{' '}
 {(domain.backlinks_info.backlinks || 0) -
 domain.backlinks_info.dofollow}{' '}
 nofollow
 </span>
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 </div>
 )
}

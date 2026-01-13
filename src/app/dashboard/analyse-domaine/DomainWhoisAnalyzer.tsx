'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import type { DomainWhoisItem, DomainWhoisResponse, DomainWhoisStats } from './action'
import { calculateDomainWhoisStats } from './utils'

interface DomainWhoisAnalyzerProps {
  data: DomainWhoisResponse
}

export default function DomainWhoisAnalyzer({ data }: DomainWhoisAnalyzerProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'domains' | 'expired'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'expired' | 'active'>('all')
  const [sortBy, setSortBy] = useState<'backlinks' | 'keywords' | 'etv' | 'expiration'>('backlinks')
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
      filtered = filtered.filter((item) => item.domain.toLowerCase().includes(searchQuery.toLowerCase()))
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
        aVal = a.expiration_datetime ? new Date(a.expiration_datetime).getTime() : 0
        bVal = b.expiration_datetime ? new Date(b.expiration_datetime).getTime() : 0
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
      <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
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
        </CardContent>
      </Card>

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
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400',
  }

  return (
    <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="dashboard-body-sm text-muted-foreground">{label}</p>
            <p className="dashboard-heading-1 mt-2">{value}</p>
            {subtitle && <p className="dashboard-text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`rounded-xl border p-3 ${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
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
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition-all ${
        active
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-white/80 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800'
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-2 border-blue-200/80 bg-gradient-to-br from-blue-50/80 to-blue-100/50 shadow-lg dark:border-blue-800/40 dark:from-blue-950/30 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="dashboard-heading-3 text-blue-900 dark:text-blue-100">Domaines Actifs</h3>
            </div>
            <div className="dashboard-heading-1 text-blue-700 dark:text-blue-300">{stats.activeDomains}</div>
            <div className="dashboard-body-sm mt-2 text-blue-600 dark:text-blue-400">
              {((stats.activeDomains / stats.totalDomains) * 100).toFixed(1)}% du total
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-2 border-orange-200/80 bg-gradient-to-br from-orange-50/80 to-orange-100/50 shadow-lg dark:border-orange-800/40 dark:from-orange-950/30 dark:to-orange-900/20">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/40">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="dashboard-heading-3 text-orange-900 dark:text-orange-100">Domaines Expirés</h3>
            </div>
            <div className="dashboard-heading-1 text-orange-700 dark:text-orange-300">{stats.expiredDomains}</div>
            <div className="dashboard-body-sm mt-2 text-orange-600 dark:text-orange-400">Opportunités disponibles</div>
          </CardContent>
        </Card>
      </div>

      {/* Top TLDs */}
      <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="dashboard-heading-3">Top Extensions (TLD)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {stats.topTLDs.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border-2 border-gray-200/80 bg-gradient-to-br from-gray-50/80 to-gray-100/50 p-4 text-center dark:border-gray-800/40 dark:from-gray-900/50 dark:to-gray-800/30"
              >
                <div className="dashboard-heading-4 text-blue-600 dark:text-blue-400">.{item.tld}</div>
                <div className="dashboard-body-sm text-muted-foreground mt-1">{item.count} domaines</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top domaines par backlinks */}
      <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/40">
              <LinkIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="dashboard-heading-3">Top Domaines par Backlinks</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topByBacklinks.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-gradient-to-r from-green-50/50 to-transparent p-4 dark:border-gray-800/40 dark:from-green-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-sm font-bold text-white shadow-md">
                    {idx + 1}
                  </div>
                  <span className="dashboard-heading-4">{item.domain}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2.5 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600"
                      style={{
                        width: `${(item.backlinks / stats.topByBacklinks[0].backlinks) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="dashboard-heading-4 w-24 text-right text-green-600 dark:text-green-400">
                    {item.backlinks.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top domaines par Keywords */}
      <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/40">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="dashboard-heading-3">Top Domaines par Keywords</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topByKeywords.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-gradient-to-r from-purple-50/50 to-transparent p-4 dark:border-gray-800/40 dark:from-purple-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-sm font-bold text-white shadow-md">
                    {idx + 1}
                  </div>
                  <span className="dashboard-heading-4">{item.domain}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2.5 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                      style={{
                        width: `${(item.keywords / stats.topByKeywords[0].keywords) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="dashboard-heading-4 w-24 text-right text-purple-600 dark:text-purple-400">
                    {item.keywords.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
      <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Recherche */}
            <div>
              <label className="dashboard-heading-4 mb-2 block">Rechercher</label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom de domaine..."
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-xl border-2 border-gray-200 bg-white py-3 pr-4 pl-10 focus:ring-4 dark:border-gray-800 dark:bg-gray-900/50"
                />
              </div>
            </div>

            {/* Filtre Statut */}
            <div>
              <label className="dashboard-heading-4 mb-2 block">Statut</label>
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as 'all' | 'expired' | 'active')}
              >
                <SelectTrigger className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-mist-600">
                  <SelectItem value="all" className="hover:cursor-pointer hover:bg-mist-500">
                    Tous les domaines
                  </SelectItem>
                  <SelectItem value="expired" className="hover:cursor-pointer hover:bg-mist-500">
                    Expirés uniquement
                  </SelectItem>
                  <SelectItem value="active" className="hover:cursor-pointer hover:bg-mist-500">
                    Actifs uniquement
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tri */}
          <div className="mt-6">
            <span className="dashboard-heading-4 mb-3 block">Trier par:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSortBy('backlinks')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  sortBy === 'backlinks'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                Backlinks <ArrowUpDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setSortBy('keywords')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  sortBy === 'keywords'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                Keywords <ArrowUpDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setSortBy('etv')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  sortBy === 'etv'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                ETV <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des domaines */}
      <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
        <CardHeader className="border-b border-gray-200/80 dark:border-gray-800/50">
          <CardTitle className="dashboard-heading-3">
            {domains.length} domaine{domains.length > 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100 p-0 dark:divide-gray-800/50">
          {domains.slice(0, 50).map((domain, idx) => (
            <DomainCard key={idx} domain={domain} />
          ))}
        </CardContent>
      </Card>
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
      result = result.filter((item) => item.domain.toLowerCase().includes(searchQuery.toLowerCase()))
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
        aVal = a.expiration_datetime ? new Date(a.expiration_datetime).getTime() : 0
        bVal = b.expiration_datetime ? new Date(b.expiration_datetime).getTime() : 0
      }

      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })

    return result
  }, [domains, searchQuery, sortBy, sortOrder])

  if (domains.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center border-2 border-dashed p-16 text-center">
        <div className="rounded-full bg-green-100 p-6 dark:bg-green-900/40">
          <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400" />
        </div>
        <h3 className="dashboard-heading-3 mt-6">Aucun domaine expiré</h3>
        <p className="dashboard-body-sm text-muted-foreground mt-2">
          Tous les domaines de la liste sont actuellement actifs
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      <Card className="relative overflow-hidden border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 via-orange-50/90 to-orange-100/50 shadow-lg dark:border-orange-600 dark:from-orange-950/40 dark:via-orange-950/30 dark:to-orange-900/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-md">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="dashboard-heading-3 text-orange-900 dark:text-orange-100">
                {domains.length} domaine{domains.length > 1 ? 's' : ''} expiré
                {domains.length > 1 ? 's' : ''} disponible
                {domains.length > 1 ? 's' : ''}
              </h3>
              <p className="dashboard-body-sm mt-2 text-orange-700 dark:text-orange-300">
                Ces domaines ne sont plus enregistrés et peuvent potentiellement être rachetés. Vérifiez leur historique
                avant tout achat.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Recherche */}
            <div>
              <label className="dashboard-heading-4 mb-2 block">Rechercher</label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom de domaine..."
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-xl border-2 border-gray-200 bg-white py-3 pr-4 pl-10 focus:ring-4 dark:border-gray-800 dark:bg-gray-900/50"
                />
              </div>
            </div>

            {/* Tri */}
            <div>
              <span className="dashboard-heading-4 mb-3 block">Trier par</span>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <button
                  onClick={() => {
                    setSortBy('backlinks')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    sortBy === 'backlinks'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-white/80 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  Backlinks <ArrowUpDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSortBy('keywords')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    sortBy === 'keywords'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-white/80 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  Keywords <ArrowUpDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSortBy('etv')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    sortBy === 'etv'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-white/80 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  ETV <ArrowUpDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSortBy('expiration')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    sortBy === 'expiration'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-white/80 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  Expiration <ArrowUpDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
        <CardHeader className="border-b border-gray-200/80 dark:border-gray-800/50">
          <CardTitle className="dashboard-heading-3">
            {filtered.length} domaine{filtered.length > 1 ? 's' : ''} trouvé
            {filtered.length > 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100 p-0 dark:divide-gray-800/50">
          {filtered.slice(0, 50).map((domain, idx) => (
            <DomainCard key={idx} domain={domain} showExpiredBadge />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function DomainCard({ domain, showExpiredBadge }: { domain: DomainWhoisItem; showExpiredBadge?: boolean }) {
  const getDaysUntilExpiration = () => {
    if (!domain.expiration_datetime) return null
    const now = new Date()
    const expiration = new Date(domain.expiration_datetime)
    const days = Math.floor((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const daysUntilExpiration = getDaysUntilExpiration()

  return (
    <div className="p-6 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
      <div className="flex items-start gap-4">
        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Domain Name */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10">
              <Globe className="h-5 w-5 text-teal-500" />
            </div>
            <a
              href={`https://${domain.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="dashboard-heading-4 flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
            >
              {domain.domain}
              <ExternalLink className="h-4 w-4" />
            </a>
            <span className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-300">
              .{domain.tld}
            </span>
            {!domain.registered && showExpiredBadge && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
                EXPIRÉ
              </span>
            )}
            {domain.registered && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                ACTIF
              </span>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-green-200/80 bg-gradient-to-br from-green-50/80 to-green-100/50 p-4 dark:border-green-800/40 dark:from-green-950/30 dark:to-green-900/20">
              <div className="dashboard-body-sm text-green-600 dark:text-green-400">Backlinks</div>
              <div className="dashboard-heading-2 mt-1.5 text-green-700 dark:text-green-300">
                {domain.backlinks_info?.backlinks?.toLocaleString() || 0}
              </div>
              <div className="dashboard-text-xs mt-1 text-green-600 dark:text-green-400">
                {domain.backlinks_info?.referring_main_domains || 0} domaines
              </div>
            </div>

            <div className="rounded-xl border border-purple-200/80 bg-gradient-to-br from-purple-50/80 to-purple-100/50 p-4 dark:border-purple-800/40 dark:from-purple-950/30 dark:to-purple-900/20">
              <div className="dashboard-body-sm text-purple-600 dark:text-purple-400">Keywords</div>
              <div className="dashboard-heading-2 mt-1.5 text-purple-700 dark:text-purple-300">
                {domain.metrics?.organic?.count?.toLocaleString() || 0}
              </div>
              <div className="dashboard-text-xs mt-1 text-purple-600 dark:text-purple-400">organiques</div>
            </div>

            <div className="rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/80 to-blue-100/50 p-4 dark:border-blue-800/40 dark:from-blue-950/30 dark:to-blue-900/20">
              <div className="dashboard-body-sm text-blue-600 dark:text-blue-400">ETV</div>
              <div className="dashboard-heading-2 mt-1.5 text-blue-700 dark:text-blue-300">
                ${Math.round(domain.metrics?.organic?.etv || 0).toLocaleString()}
              </div>
              <div className="dashboard-text-xs mt-1 text-blue-600 dark:text-blue-400">valeur estimée</div>
            </div>

            <div className="rounded-xl border border-orange-200/80 bg-gradient-to-br from-orange-50/80 to-orange-100/50 p-4 dark:border-orange-800/40 dark:from-orange-950/30 dark:to-orange-900/20">
              <div className="dashboard-body-sm text-orange-600 dark:text-orange-400">
                {domain.registered ? 'Expire dans' : 'Expiré depuis'}
              </div>
              <div className="dashboard-heading-2 mt-1.5 text-orange-700 dark:text-orange-300">
                {daysUntilExpiration !== null ? `${Math.abs(daysUntilExpiration)}j` : 'N/A'}
              </div>
              <div className="dashboard-text-xs mt-1 text-orange-600 dark:text-orange-400">
                {domain.expiration_datetime
                  ? new Date(domain.expiration_datetime).toLocaleDateString('fr-FR')
                  : 'Inconnue'}
              </div>
            </div>
          </div>

          {/* Dates */}
          {(domain.created_datetime || domain.updated_datetime) && (
            <div className="dashboard-text-xs text-muted-foreground mt-4 flex flex-wrap gap-4">
              {domain.created_datetime && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Créé: {new Date(domain.created_datetime).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              {domain.updated_datetime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>MAJ: {new Date(domain.updated_datetime).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              {domain.backlinks_info?.dofollow !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  <span>
                    {domain.backlinks_info.dofollow} dofollow /{' '}
                    {(domain.backlinks_info.backlinks || 0) - domain.backlinks_info.dofollow} nofollow
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

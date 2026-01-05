'use client'

import {
  ArrowUpDown,
  BarChart3,
  CheckCircle,
  ExternalLink,
  Filter,
  Globe,
  Link as LinkIcon,
  Search,
  Shield,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { BacklinkItem, BacklinksResponse } from './action'
import { calculateBacklinkStats, type BacklinkStats } from './utils'

interface BacklinksAnalyzerProps {
  data: BacklinksResponse
  target: string
}

export default function BacklinksAnalyzer({
  data,
  target,
}: BacklinksAnalyzerProps) {
  const [viewMode, setViewMode] = useState<
    'overview' | 'backlinks' | 'anchors' | 'domains'
  >('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'dofollow' | 'nofollow'>(
    'all',
  )
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'lost'>(
    'all',
  )
  const [sortBy, setSortBy] = useState<'rank' | 'domain_rank' | 'spam_score'>(
    'rank',
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Calculer les stats
  const stats: BacklinkStats = useMemo(() => {
    return calculateBacklinkStats(data.items)
  }, [data.items])

  // Filtrer et trier les backlinks
  const filteredBacklinks = useMemo(() => {
    let filtered = [...data.items]

    // Recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.domain_from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.url_from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.anchor &&
            item.anchor.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filtre dofollow/nofollow
    if (filterType === 'dofollow') {
      filtered = filtered.filter((item) => item.dofollow)
    } else if (filterType === 'nofollow') {
      filtered = filtered.filter((item) => !item.dofollow)
    }

    // Filtre new/lost
    if (filterStatus === 'new') {
      filtered = filtered.filter((item) => item.is_new)
    } else if (filterStatus === 'lost') {
      filtered = filtered.filter((item) => item.is_lost)
    }

    // Tri
    filtered.sort((a, b) => {
      let aVal = 0
      let bVal = 0

      if (sortBy === 'rank') {
        aVal = a.rank || 0
        bVal = b.rank || 0
      } else if (sortBy === 'domain_rank') {
        aVal = a.domain_from_rank || 0
        bVal = b.domain_from_rank || 0
      } else if (sortBy === 'spam_score') {
        aVal = a.backlink_spam_score || 0
        bVal = b.backlink_spam_score || 0
      }

      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })

    return filtered
  }, [data.items, searchQuery, filterType, filterStatus, sortBy, sortOrder])

  return (
    <div className="space-y-6">
      {/* En-tête avec métriques clés */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Backlinks"
          value={stats.totalBacklinks.toLocaleString()}
          icon={<LinkIcon className="h-5 w-5" />}
          color="blue"
          subtitle={`${stats.uniqueDomains} domaines uniques`}
        />
        <MetricCard
          label="Dofollow"
          value={stats.dofollowCount.toLocaleString()}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
          subtitle={`${((stats.dofollowCount / stats.totalBacklinks) * 100).toFixed(0)}% du total`}
        />
        <MetricCard
          label="Domain Rank Moyen"
          value={stats.avgDomainRank.toFixed(0)}
          icon={<TrendingUp className="h-5 w-5" />}
          color="purple"
          subtitle="Autorité des domaines"
        />
        <MetricCard
          label="Spam Score Moyen"
          value={`${stats.avgSpamScore.toFixed(0)}%`}
          icon={<Shield className="h-5 w-5" />}
          color={stats.avgSpamScore > 50 ? 'orange' : 'green'}
          subtitle={
            stats.avgSpamScore > 50 ? 'Attention requise' : 'Qualité correcte'
          }
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <ViewTab
          active={viewMode === 'overview'}
          onClick={() => setViewMode('overview')}
          icon={<BarChart3 className="h-4 w-4" />}
          label="Vue d'ensemble"
        />
        <ViewTab
          active={viewMode === 'backlinks'}
          onClick={() => setViewMode('backlinks')}
          icon={<LinkIcon className="h-4 w-4" />}
          label="Backlinks"
        />
        <ViewTab
          active={viewMode === 'anchors'}
          onClick={() => setViewMode('anchors')}
          icon={<Filter className="h-4 w-4" />}
          label="Anchors"
        />
        <ViewTab
          active={viewMode === 'domains'}
          onClick={() => setViewMode('domains')}
          icon={<Globe className="h-4 w-4" />}
          label="Domaines"
        />
      </div>

      {/* Vue Overview */}
      {viewMode === 'overview' && <OverviewView stats={stats} />}

      {/* Vue Backlinks */}
      {viewMode === 'backlinks' && (
        <BacklinksView
          backlinks={filteredBacklinks}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      )}

      {/* Vue Anchors */}
      {viewMode === 'anchors' && <AnchorsView anchors={stats.topAnchors} />}

      {/* Vue Domains */}
      {viewMode === 'domains' && <DomainsView backlinks={data.items} />}
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
    <div className="rounded-xl border-2 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
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
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function OverviewView({ stats }: { stats: BacklinkStats }) {
  return (
    <div className="space-y-6">
      {/* Statistiques de statut */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">
                {stats.newBacklinks}
              </div>
              <div className="text-sm font-medium text-green-600">
                Nouveaux backlinks
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-3">
              <TrendingDown className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">
                {stats.lostBacklinks}
              </div>
              <div className="text-sm font-medium text-red-600">
                Backlinks perdus
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-3">
              <XCircle className="h-6 w-6 text-orange-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-700">
                {stats.brokenBacklinks}
              </div>
              <div className="text-sm font-medium text-orange-600">
                Liens cassés
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top pays */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Top Pays</h3>
        <div className="space-y-2">
          {stats.topCountries.slice(0, 10).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {item.country || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${(item.count / stats.topCountries[0].count) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-12 text-right font-semibold text-gray-700">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top TLDs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Top TLDs</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {stats.topTLDs.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4 text-center"
            >
              <div className="text-xl font-bold text-blue-600">.{item.tld}</div>
              <div className="mt-1 text-sm text-gray-600">
                {item.count} backlinks
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BacklinksView({
  backlinks,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: {
  backlinks: BacklinkItem[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterType: 'all' | 'dofollow' | 'nofollow'
  setFilterType: (type: 'all' | 'dofollow' | 'nofollow') => void
  filterStatus: 'all' | 'new' | 'lost'
  setFilterStatus: (status: 'all' | 'new' | 'lost') => void
  sortBy: 'rank' | 'domain_rank' | 'spam_score'
  setSortBy: (sort: 'rank' | 'domain_rank' | 'spam_score') => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (order: 'asc' | 'desc') => void
}) {
  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Domaine, URL ou anchor..."
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filtre Type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous</option>
              <option value="dofollow">Dofollow</option>
              <option value="nofollow">Nofollow</option>
            </select>
          </div>

          {/* Filtre Statut */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous</option>
              <option value="new">Nouveaux</option>
              <option value="lost">Perdus</option>
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
              setSortBy('rank')
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
            }}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              sortBy === 'rank'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rank <ArrowUpDown className="h-3 w-3" />
          </button>
          <button
            onClick={() => {
              setSortBy('domain_rank')
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
            }}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              sortBy === 'domain_rank'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Domain Rank <ArrowUpDown className="h-3 w-3" />
          </button>
          <button
            onClick={() => {
              setSortBy('spam_score')
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
            }}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              sortBy === 'spam_score'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Spam Score <ArrowUpDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Liste des backlinks */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="font-semibold text-gray-900">
            {backlinks.length} backlink{backlinks.length > 1 ? 's' : ''}
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {backlinks.slice(0, 50).map((backlink, idx) => (
            <BacklinkCard key={idx} backlink={backlink} />
          ))}
        </div>
      </div>
    </div>
  )
}

function BacklinkCard({ backlink }: { backlink: BacklinkItem }) {
  const getSpamScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100'
    if (score >= 40) return 'text-orange-600 bg-orange-100'
    return 'text-green-600 bg-green-100'
  }

  return (
    <div className="p-6 hover:bg-gray-50">
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700">
            {backlink.rank}
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Domain */}
          <div className="mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="font-semibold text-gray-900">
              {backlink.domain_from}
            </span>
            <span className="text-sm text-gray-500">
              (DR: {backlink.domain_from_rank})
            </span>
            {backlink.is_new && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                NEW
              </span>
            )}
            {backlink.is_lost && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                LOST
              </span>
            )}
          </div>

          {/* URL From */}
          <div className="mb-2">
            <a
              href={backlink.url_from}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="truncate">{backlink.url_from}</span>
            </a>
          </div>

          {/* Anchor */}
          {backlink.anchor && (
            <div className="mb-2 rounded-lg bg-gray-100 p-2">
              <span className="text-sm text-gray-700">
                <span className="font-semibold">Anchor:</span> {backlink.anchor}
              </span>
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold ${
                backlink.dofollow
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {backlink.dofollow ? 'Dofollow' : 'Nofollow'}
            </span>
            <span
              className={`rounded-full px-2 py-1 font-semibold ${getSpamScoreColor(backlink.backlink_spam_score)}`}
            >
              Spam: {backlink.backlink_spam_score}%
            </span>
            <span>PR: {backlink.page_from_rank}</span>
            <span>Links: {backlink.links_count}</span>
            {backlink.page_from_language && (
              <span>Lang: {backlink.page_from_language}</span>
            )}
            {backlink.first_seen && (
              <span>
                First:{' '}
                {new Date(backlink.first_seen).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnchorsView({
  anchors,
}: {
  anchors: Array<{ anchor: string; count: number }>
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="font-semibold text-gray-900">Top Anchor Texts</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {anchors.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-6 hover:bg-gray-50"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900">{item.anchor}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600"
                  style={{
                    width: `${(item.count / anchors[0].count) * 100}%`,
                  }}
                />
              </div>
              <span className="w-16 text-right font-bold text-blue-600">
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DomainsView({ backlinks }: { backlinks: BacklinkItem[] }) {
  const domainStats = useMemo(() => {
    const domains = new Map<
      string,
      {
        domain: string
        count: number
        avgRank: number
        avgSpamScore: number
        dofollow: number
        nofollow: number
      }
    >()

    backlinks.forEach((backlink) => {
      if (!domains.has(backlink.domain_from)) {
        domains.set(backlink.domain_from, {
          domain: backlink.domain_from,
          count: 0,
          avgRank: 0,
          avgSpamScore: 0,
          dofollow: 0,
          nofollow: 0,
        })
      }

      const stats = domains.get(backlink.domain_from)!
      stats.count++
      stats.avgRank += backlink.domain_from_rank
      stats.avgSpamScore += backlink.backlink_spam_score
      if (backlink.dofollow) {
        stats.dofollow++
      } else {
        stats.nofollow++
      }
    })

    // Calculer les moyennes
    domains.forEach((stats) => {
      stats.avgRank = stats.avgRank / stats.count
      stats.avgSpamScore = stats.avgSpamScore / stats.count
    })

    return Array.from(domains.values()).sort((a, b) => b.count - a.count)
  }, [backlinks])

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="font-semibold text-gray-900">
          Domaines référents ({domainStats.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {domainStats.slice(0, 50).map((stats, idx) => (
          <div key={idx} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <span className="font-semibold text-gray-900">
                    {stats.domain}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span>Domain Rank: {stats.avgRank.toFixed(0)}</span>
                  <span>Spam Score: {stats.avgSpamScore.toFixed(0)}%</span>
                  <span className="text-green-600">
                    {stats.dofollow} dofollow
                  </span>
                  <span className="text-gray-500">
                    {stats.nofollow} nofollow
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.count}
                </div>
                <div className="text-xs text-gray-500">backlinks</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

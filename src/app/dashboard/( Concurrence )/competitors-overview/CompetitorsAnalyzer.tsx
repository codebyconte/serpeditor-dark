'use client'

import {
  ArrowUpDown,
  BarChart3,
  Crown,
  DollarSign,
  ExternalLink,
  Filter,
  Globe,
  Search,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { CompetitorItem, CompetitorsResponse } from './action'
import { calculateCompetitorsStats, type CompetitorsStats } from './utils'

interface CompetitorsAnalyzerProps {
  data: CompetitorsResponse
  target: string
}

export default function CompetitorsAnalyzer({
  data,
}: CompetitorsAnalyzerProps) {
  const [viewMode, setViewMode] = useState<
    'overview' | 'competitors' | 'comparison'
  >('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<
    'intersections' | 'keywords' | 'etv' | 'position'
  >('intersections')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([])

  // Calculer les stats
  const stats: CompetitorsStats = useMemo(() => {
    return calculateCompetitorsStats(data.items)
  }, [data.items])

  // Filtrer et trier les concurrents
  const filteredCompetitors = useMemo(() => {
    let filtered = [...data.items]

    // Recherche
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.domain.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Tri
    filtered.sort((a, b) => {
      let aVal = 0
      let bVal = 0

      if (sortBy === 'intersections') {
        aVal = a.intersections || 0
        bVal = b.intersections || 0
      } else if (sortBy === 'keywords') {
        aVal = a.metrics?.organic?.count || 0
        bVal = b.metrics?.organic?.count || 0
      } else if (sortBy === 'etv') {
        aVal = a.metrics?.organic?.etv || 0
        bVal = b.metrics?.organic?.etv || 0
      } else if (sortBy === 'position') {
        aVal = a.avg_position || 0
        bVal = b.avg_position || 0
      }

      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })

    return filtered
  }, [data.items, searchQuery, sortBy, sortOrder])

  const toggleCompetitorSelection = (domain: string) => {
    setSelectedCompetitors(
      (prev) =>
        prev.includes(domain)
          ? prev.filter((d) => d !== domain)
          : [...prev, domain].slice(0, 5), // Max 5 pour la comparaison
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec métriques clés */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Concurrents"
          value={stats.totalCompetitors.toLocaleString()}
          icon={<Target className="h-5 w-5" />}
          color="blue"
          subtitle="Domaines identifiés"
        />
        <MetricCard
          label="Mots-clés communs"
          value={Math.round(stats.avgKeywordsIntersection).toLocaleString()}
          icon={<TrendingUp className="h-5 w-5" />}
          color="green"
          subtitle="Moyenne par concurrent"
        />
        <MetricCard
          label="Keywords Organic"
          value={stats.totalOrganicKeywords.toLocaleString()}
          icon={<BarChart3 className="h-5 w-5" />}
          color="purple"
          subtitle="Total tous concurrents"
        />
        <MetricCard
          label="ETV Moyen"
          value={`$${Math.round(stats.avgETV).toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          color="orange"
          subtitle="Valeur estimée du trafic"
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
          active={viewMode === 'competitors'}
          onClick={() => setViewMode('competitors')}
          icon={<Target className="h-4 w-4" />}
          label="Liste des concurrents"
        />
        <ViewTab
          active={viewMode === 'comparison'}
          onClick={() => setViewMode('comparison')}
          icon={<Filter className="h-4 w-4" />}
          label={`Comparaison (${selectedCompetitors.length})`}
        />
      </div>

      {/* Vue Overview */}
      {viewMode === 'overview' && <OverviewView stats={stats} />}

      {/* Vue Competitors */}
      {viewMode === 'competitors' && (
        <CompetitorsView
          competitors={filteredCompetitors}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedCompetitors={selectedCompetitors}
          toggleCompetitorSelection={toggleCompetitorSelection}
        />
      )}

      {/* Vue Comparison */}
      {viewMode === 'comparison' && (
        <ComparisonView
          competitors={data.items.filter((c) =>
            selectedCompetitors.includes(c.domain),
          )}
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

function OverviewView({ stats }: { stats: CompetitorsStats }) {
  return (
    <div className="space-y-6">
      {/* Top concurrents par mots-clés */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-900">
            Top Concurrents par Mots-clés
          </h3>
        </div>
        <div className="space-y-2">
          {stats.topCompetitorsByKeywords.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {idx + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {item.domain}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${(item.count / stats.topCompetitorsByKeywords[0].count) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-20 text-right text-lg font-bold text-blue-600">
                  {item.count.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top concurrents par ETV */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-bold text-gray-900">
            Top Concurrents par Valeur du Trafic
          </h3>
        </div>
        <div className="space-y-2">
          {stats.topCompetitorsByETV.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {idx + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {item.domain}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-green-600"
                    style={{
                      width: `${(item.etv / stats.topCompetitorsByETV[0].etv) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-24 text-right text-lg font-bold text-green-600">
                  ${Math.round(item.etv).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top concurrents par position */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900">
            Meilleurs Positionnements
          </h3>
        </div>
        <div className="space-y-2">
          {stats.topCompetitorsByPosition.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                  {idx + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {item.domain}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-purple-100 px-4 py-2">
                <span className="text-sm font-medium text-purple-700">
                  Position moyenne: {item.position.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CompetitorsView({
  competitors,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  selectedCompetitors,
  toggleCompetitorSelection,
}: {
  competitors: CompetitorItem[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: 'intersections' | 'keywords' | 'etv' | 'position'
  setSortBy: (sort: 'intersections' | 'keywords' | 'etv' | 'position') => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (order: 'asc' | 'desc') => void
  selectedCompetitors: string[]
  toggleCompetitorSelection: (domain: string) => void
}) {
  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tri */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Trier par
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSortBy('intersections')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
                className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  sortBy === 'intersections'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Intersection <ArrowUpDown className="h-3 w-3" />
              </button>
              <button
                onClick={() => {
                  setSortBy('keywords')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
                className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  sortBy === 'keywords'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ETV <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des concurrents */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="font-semibold text-gray-900">
            {competitors.length} concurrent{competitors.length > 1 ? 's' : ''}
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {competitors.slice(0, 50).map((competitor, idx) => (
            <CompetitorCard
              key={idx}
              competitor={competitor}
              isSelected={selectedCompetitors.includes(competitor.domain)}
              onToggle={() => toggleCompetitorSelection(competitor.domain)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CompetitorCard({
  competitor,
  isSelected,
  onToggle,
}: {
  competitor: CompetitorItem
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <div className="p-6 hover:bg-gray-50">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Domain */}
          <div className="mb-3 flex items-center gap-2">
            <Globe className="h-5 w-5 flex-shrink-0 text-gray-400" />
            <a
              href={`https://${competitor.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              {competitor.domain}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="text-xs font-medium text-blue-600">
                Intersection
              </div>
              <div className="mt-1 text-xl font-bold text-blue-700">
                {competitor.intersections?.toLocaleString() || 0}
              </div>
              <div className="mt-0.5 text-xs text-blue-600">
                mots-clés communs
              </div>
            </div>

            <div className="rounded-lg bg-green-50 p-3">
              <div className="text-xs font-medium text-green-600">
                Keywords Organic
              </div>
              <div className="mt-1 text-xl font-bold text-green-700">
                {competitor.metrics?.organic?.count?.toLocaleString() || 0}
              </div>
              <div className="mt-0.5 text-xs text-green-600">total</div>
            </div>

            <div className="rounded-lg bg-purple-50 p-3">
              <div className="text-xs font-medium text-purple-600">ETV</div>
              <div className="mt-1 text-xl font-bold text-purple-700">
                $
                {Math.round(
                  competitor.metrics?.organic?.etv || 0,
                ).toLocaleString()}
              </div>
              <div className="mt-0.5 text-xs text-purple-600">
                valeur estimée
              </div>
            </div>

            <div className="rounded-lg bg-orange-50 p-3">
              <div className="text-xs font-medium text-orange-600">
                Position Moy.
              </div>
              <div className="mt-1 text-xl font-bold text-orange-700">
                {competitor.avg_position?.toFixed(1) || 'N/A'}
              </div>
              <div className="mt-0.5 text-xs text-orange-600">
                dans les SERPs
              </div>
            </div>
          </div>

          {/* Position Distribution */}
          {competitor.metrics?.organic && (
            <div className="mt-4">
              <div className="mb-2 text-xs font-semibold text-gray-700">
                Distribution des positions
              </div>
              <div className="flex gap-1">
                {[
                  {
                    label: '1',
                    count: competitor.metrics.organic.pos_1,
                    color: 'bg-green-500',
                  },
                  {
                    label: '2-3',
                    count: competitor.metrics.organic.pos_2_3,
                    color: 'bg-green-400',
                  },
                  {
                    label: '4-10',
                    count: competitor.metrics.organic.pos_4_10,
                    color: 'bg-blue-400',
                  },
                  {
                    label: '11-20',
                    count: competitor.metrics.organic.pos_11_20,
                    color: 'bg-yellow-400',
                  },
                  {
                    label: '21-30',
                    count: competitor.metrics.organic.pos_21_30,
                    color: 'bg-orange-400',
                  },
                ].map((pos, idx) => (
                  <div key={idx} className="group relative flex-1">
                    <div
                      className={`h-2 rounded ${pos.color}`}
                      style={{
                        width: `${(pos.count / (competitor.metrics?.organic?.count || 1)) * 100}%`,
                      }}
                    />
                    <div className="invisible absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:visible">
                      {pos.label}: {pos.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ComparisonView({ competitors }: { competitors: CompetitorItem[] }) {
  if (competitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
        <Filter className="h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          Aucun concurrent sélectionné
        </h3>
        <p className="mt-2 text-gray-600">
          Sélectionnez jusqu&apos;à 5 concurrents dans la liste pour les
          comparer
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tableau de comparaison */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Domaine
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Intersection
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Keywords
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                ETV
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Pos. Moy.
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Top 3
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Top 10
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {competitors.map((competitor, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {competitor.domain}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-blue-600">
                    {competitor.intersections?.toLocaleString() || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-green-600">
                    {competitor.metrics?.organic?.count?.toLocaleString() || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-purple-600">
                    $
                    {Math.round(
                      competitor.metrics?.organic?.etv || 0,
                    ).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-orange-600">
                    {competitor.avg_position?.toFixed(1) || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-900">
                    {(
                      (competitor.metrics?.organic?.pos_1 || 0) +
                      (competitor.metrics?.organic?.pos_2_3 || 0)
                    ).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-900">
                    {(
                      competitor.metrics?.organic?.pos_4_10 || 0
                    ).toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'

import {
  ArrowUpDown,
  Award,
  BarChart3,
  DollarSign,
  ExternalLink,
  Eye,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type {
  KeywordGapItem,
  KeywordGapResponse,
  KeywordGapStats,
} from './action'
import { calculateKeywordGapStats } from './utils'

interface KeywordGapAnalyzerProps {
  data: KeywordGapResponse
  isGapMode: boolean // true = gaps, false = communs
}

export default function KeywordGapAnalyzer({
  data,
  isGapMode,
}: KeywordGapAnalyzerProps) {
  const [viewMode, setViewMode] = useState<
    'overview' | 'keywords' | 'easy-wins'
  >('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [minVolume, setMinVolume] = useState(0)
  const [competitionFilter, setCompetitionFilter] = useState<
    'all' | 'LOW' | 'MEDIUM' | 'HIGH'
  >('all')
  const [sortBy, setSortBy] = useState<'volume' | 'etv' | 'position' | 'cpc'>(
    'volume',
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Calculer les stats
  const stats: KeywordGapStats = useMemo(() => {
    return calculateKeywordGapStats(data)
  }, [data])

  // Filtrer et trier
  const filteredKeywords = useMemo(() => {
    let filtered = [...data.items]

    // Recherche
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.keyword_data?.keyword
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    }

    // Volume minimum
    if (minVolume > 0) {
      filtered = filtered.filter(
        (item) =>
          (item.keyword_data?.keyword_info?.search_volume || 0) >= minVolume,
      )
    }

    // Compétition
    if (competitionFilter !== 'all') {
      filtered = filtered.filter((item) => {
        const competition = item.keyword_data?.keyword_info?.competition
        if (competition === null || competition === undefined) {
          return false
        }
        const level =
          competition < 0.33 ? 'LOW' : competition < 0.66 ? 'MEDIUM' : 'HIGH'
        return level === competitionFilter
      })
    }

    // Tri
    filtered.sort((a, b) => {
      let aVal = 0
      let bVal = 0

      if (sortBy === 'volume') {
        aVal = a.keyword_data?.keyword_info?.search_volume || 0
        bVal = b.keyword_data?.keyword_info?.search_volume || 0
      } else if (sortBy === 'cpc') {
        aVal = a.keyword_data?.keyword_info?.cpc || 0
        bVal = b.keyword_data?.keyword_info?.cpc || 0
      } else if (sortBy === 'position') {
        aVal = a.first_domain_serp_element?.rank_absolute || 999
        bVal = b.first_domain_serp_element?.rank_absolute || 999
      } else if (sortBy === 'etv') {
        const aPos = a.first_domain_serp_element?.rank_absolute || 999
        const bPos = b.first_domain_serp_element?.rank_absolute || 999
        const aVol = a.keyword_data?.keyword_info?.search_volume || 0
        const bVol = b.keyword_data?.keyword_info?.search_volume || 0
        const aETV = a.first_domain_serp_element?.etv || 0
        const bETV = b.first_domain_serp_element?.etv || 0
        aVal =
          aETV || estimateETV(aVol, aPos, a.keyword_data?.keyword_info?.cpc)
        bVal =
          bETV || estimateETV(bVol, bPos, b.keyword_data?.keyword_info?.cpc)
      }

      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })

    return filtered
  }, [data.items, searchQuery, minVolume, competitionFilter, sortBy, sortOrder])

  return (
    <div className="space-y-6">
      {/* Métriques clés */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={isGapMode ? 'Opportunités Trouvées' : 'Mots-clés Communs'}
          value={stats.totalKeywords.toLocaleString()}
          icon={<Target className="h-5 w-5" />}
          color="blue"
          subtitle={isGapMode ? 'Mots-clés manquants' : 'Positions partagées'}
        />
        <MetricCard
          label="Volume Total"
          value={stats.totalSearchVolume.toLocaleString()}
          icon={<TrendingUp className="h-5 w-5" />}
          color="purple"
          subtitle={`${stats.avgSearchVolume.toLocaleString()}/mot-clé`}
        />
        <MetricCard
          label="ETV Total"
          value={`$${Math.round(stats.totalETV).toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
          subtitle="Valeur estimée/mois"
        />
        <MetricCard
          label={isGapMode ? 'Easy Wins' : 'Position Moyenne'}
          value={
            isGapMode
              ? stats.easyWins.length.toString()
              : Math.round(stats.avgPosition).toString()
          }
          icon={
            isGapMode ? (
              <Zap className="h-5 w-5" />
            ) : (
              <Award className="h-5 w-5" />
            )
          }
          color="orange"
          subtitle={isGapMode ? 'Faible compétition' : 'Du concurrent'}
        />
      </div>

      {/* Alert mode */}
      {isGapMode && (
        <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 flex-shrink-0 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-900">
                Mode Écart de Mots-clés (Keyword Gap)
              </h3>
              <p className="mt-1 text-sm text-orange-700">
                Ces mots-clés sont positionnés par{' '}
                <strong>{Object.values(data.targets)[0] as string}</strong> mais
                PAS par{' '}
                <strong>{Object.values(data.targets)[1] as string}</strong>. Ce
                sont vos opportunités SEO !
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <ViewTab
          active={viewMode === 'overview'}
          onClick={() => setViewMode('overview')}
          icon={<BarChart3 className="h-4 w-4" />}
          label="Vue d'ensemble"
        />
        <ViewTab
          active={viewMode === 'keywords'}
          onClick={() => setViewMode('keywords')}
          icon={<Search className="h-4 w-4" />}
          label="Tous les mots-clés"
        />
        {isGapMode && stats.easyWins.length > 0 && (
          <ViewTab
            active={viewMode === 'easy-wins'}
            onClick={() => setViewMode('easy-wins')}
            icon={<Zap className="h-4 w-4" />}
            label={`Easy Wins (${stats.easyWins.length})`}
          />
        )}
      </div>

      {/* Vue Overview */}
      {viewMode === 'overview' && (
        <OverviewView
          stats={stats}
          targets={data.targets}
          isGapMode={isGapMode}
        />
      )}

      {/* Vue Keywords */}
      {viewMode === 'keywords' && (
        <KeywordsView
          keywords={filteredKeywords}
          targets={data.targets}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          minVolume={minVolume}
          setMinVolume={setMinVolume}
          competitionFilter={competitionFilter}
          setCompetitionFilter={setCompetitionFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      )}

      {/* Vue Easy Wins */}
      {viewMode === 'easy-wins' && isGapMode && (
        <EasyWinsView easyWins={stats.easyWins} />
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

function OverviewView({
  stats,
  targets,
  isGapMode,
}: {
  stats: KeywordGapStats
  targets: Record<string, string>
  isGapMode: boolean
}) {
  return (
    <div className="space-y-6">
      {/* Targets */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900">Domaines Analysés</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                1
              </div>
              <div className="text-sm font-semibold text-green-700">
                {isGapMode ? 'Concurrent (positionné)' : 'Domaine 1'}
              </div>
            </div>
            <a
              href={`https://${Object.values(targets)[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-lg font-bold text-green-900 hover:text-green-700 hover:underline"
            >
              {Object.values(targets)[0]}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                2
              </div>
              <div className="text-sm font-semibold text-red-700">
                {isGapMode ? 'Votre site (non positionné)' : 'Domaine 2'}
              </div>
            </div>
            <a
              href={`https://${Object.values(targets)[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-lg font-bold text-red-900 hover:text-red-700 hover:underline"
            >
              {Object.values(targets)[1]}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Distribution des positions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900">
            Distribution des Positions {isGapMode ? '(Concurrent)' : ''}
          </h3>
        </div>
        <div className="space-y-3">
          <PositionBar
            label="Top 3"
            count={stats.positionDistribution.top3}
            total={stats.totalKeywords}
            color="green"
          />
          <PositionBar
            label="Top 10"
            count={stats.positionDistribution.top10}
            total={stats.totalKeywords}
            color="blue"
          />
          <PositionBar
            label="Top 20"
            count={stats.positionDistribution.top20}
            total={stats.totalKeywords}
            color="purple"
          />
          <PositionBar
            label="Top 50"
            count={stats.positionDistribution.top50}
            total={stats.totalKeywords}
            color="orange"
          />
          <PositionBar
            label="Top 100"
            count={stats.positionDistribution.top100}
            total={stats.totalKeywords}
            color="gray"
          />
        </div>
      </div>

      {/* Distribution par intent */}
      {Object.keys(stats.intentDistribution).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-bold text-gray-900">
              Intention de Recherche
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(stats.intentDistribution)
              .sort((a, b) => (b[1] as number) - (a[1] as number))
              .map(([intent, count]) => (
                <div
                  key={intent}
                  className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 text-center"
                >
                  <div className="text-2xl font-bold text-purple-700">
                    {count as number}
                  </div>
                  <div className="mt-1 text-sm font-medium text-purple-600">
                    {intent}
                  </div>
                  <div className="mt-0.5 text-xs text-purple-500">
                    {(((count as number) / stats.totalKeywords) * 100).toFixed(
                      1,
                    )}
                    %
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Distribution par compétition */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-bold text-gray-900">
            Niveau de Compétition
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(stats.competitionDistribution)
            .sort((a, b) => {
              const order = { LOW: 0, MEDIUM: 1, HIGH: 2, UNKNOWN: 3 }
              return (
                (order[a[0] as keyof typeof order] || 999) -
                (order[b[0] as keyof typeof order] || 999)
              )
            })
            .map(([level, count]) => {
              const colors = {
                LOW: 'border-green-200 bg-green-50 text-green-700',
                MEDIUM: 'border-orange-200 bg-orange-50 text-orange-700',
                HIGH: 'border-red-200 bg-red-50 text-red-700',
                UNKNOWN: 'border-gray-200 bg-gray-50 text-gray-700',
              }
              return (
                <div
                  key={level}
                  className={`rounded-lg border-2 p-4 text-center ${colors[level as keyof typeof colors]}`}
                >
                  <div className="text-2xl font-bold">{count as number}</div>
                  <div className="mt-1 text-sm font-medium">{level}</div>
                  <div className="mt-0.5 text-xs">
                    {(((count as number) / stats.totalKeywords) * 100).toFixed(
                      1,
                    )}
                    %
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Top keywords par volume */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900">
            Top 10 par Volume de Recherche
          </h3>
        </div>
        <div className="space-y-2">
          {stats.topKeywordsByVolume.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {item.keyword}
                  </div>
                  <div className="text-xs text-gray-600">
                    Position: {item.position}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Volume</div>
                  <div className="text-lg font-bold text-purple-600">
                    {item.searchVolume.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">ETV</div>
                  <div className="text-lg font-bold text-green-600">
                    ${item.etv.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top keywords par ETV */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-bold text-gray-900">
            Top 10 par Valeur (ETV)
          </h3>
        </div>
        <div className="space-y-2">
          {stats.topKeywordsByETV.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {item.keyword}
                  </div>
                  <div className="text-xs text-gray-600">
                    Position: {item.position}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-gray-600">ETV</div>
                  <div className="text-lg font-bold text-green-600">
                    ${item.etv.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Volume</div>
                  <div className="text-lg font-bold text-purple-600">
                    {item.searchVolume.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PositionBar({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: 'green' | 'blue' | 'purple' | 'orange' | 'gray'
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0
  const colors = {
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    gray: 'bg-gray-600',
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 text-sm font-medium text-gray-700">{label}</div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
          <span>{count} mots-clés</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full ${colors[color]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function KeywordsView({
  keywords,
  targets,
  searchQuery,
  setSearchQuery,
  minVolume,
  setMinVolume,
  competitionFilter,
  setCompetitionFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: {
  keywords: KeywordGapItem[]
  targets: Record<string, string>
  searchQuery: string
  setSearchQuery: (query: string) => void
  minVolume: number
  setMinVolume: (min: number) => void
  competitionFilter: 'all' | 'LOW' | 'MEDIUM' | 'HIGH'
  setCompetitionFilter: (filter: 'all' | 'LOW' | 'MEDIUM' | 'HIGH') => void
  sortBy: 'volume' | 'etv' | 'position' | 'cpc'
  setSortBy: (sort: 'volume' | 'etv' | 'position' | 'cpc') => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (order: 'asc' | 'desc') => void
}) {
  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                placeholder="Mot-clé..."
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Volume minimum */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Volume minimum
            </label>
            <select
              value={minVolume}
              onChange={(e) => setMinVolume(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Tous</option>
              <option value={100}>100+</option>
              <option value={500}>500+</option>
              <option value={1000}>1,000+</option>
              <option value={5000}>5,000+</option>
              <option value={10000}>10,000+</option>
            </select>
          </div>

          {/* Compétition */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Compétition
            </label>
            <select
              value={competitionFilter}
              onChange={(e) =>
                setCompetitionFilter(
                  e.target.value as 'all' | 'LOW' | 'MEDIUM' | 'HIGH',
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes</option>
              <option value="LOW">Faible</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Élevée</option>
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
                setSortBy('volume')
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                sortBy === 'volume'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Volume <ArrowUpDown className="h-3 w-3" />
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
            <button
              onClick={() => {
                setSortBy('position')
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                sortBy === 'position'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Position <ArrowUpDown className="h-3 w-3" />
            </button>
            <button
              onClick={() => {
                setSortBy('cpc')
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                sortBy === 'cpc'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              CPC <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="font-semibold text-gray-900">
            {keywords.length} mot{keywords.length > 1 ? 's' : ''}-clé
            {keywords.length > 1 ? 's' : ''}
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {keywords.slice(0, 50).map((item, idx) => (
            <KeywordCard key={idx} item={item} targets={targets} />
          ))}
        </div>
      </div>
    </div>
  )
}

function EasyWinsView({
  easyWins,
}: {
  easyWins: Array<{
    keyword: string
    searchVolume: number
    competition: string
    position: number
  }>
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 flex-shrink-0 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900">
              Opportunités &quot;Easy Wins&quot;
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Ces mots-clés ont une faible/moyenne compétition avec un bon
              volume de recherche. Votre concurrent est déjà bien positionné -
              c&apos;est votre chance de les rattraper facilement !
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="font-semibold text-gray-900">
            {easyWins.length} opportunité{easyWins.length > 1 ? 's' : ''} Easy
            Win
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {easyWins.map((item, idx) => (
            <div key={idx} className="p-6 hover:bg-green-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {item.keyword}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${
                          item.competition === 'LOW'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {item.competition}
                      </span>
                      <span>Position: #{item.position}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Volume</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {item.searchVolume.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KeywordCard({
  item,
  targets,
}: {
  item: KeywordGapItem
  targets: Record<string, string>
}) {
  const keywordInfo = item.keyword_data?.keyword_info
  const serpElement = item.first_domain_serp_element
  const position = serpElement?.rank_absolute || 999
  const searchVolume = keywordInfo?.search_volume || 0
  const cpc = keywordInfo?.cpc || 0
  const competitionValue = keywordInfo?.competition || null
  const competition =
    competitionValue === null
      ? 'UNKNOWN'
      : competitionValue < 0.33
        ? 'LOW'
        : competitionValue < 0.66
          ? 'MEDIUM'
          : 'HIGH'
  const etv = serpElement?.etv || estimateETV(searchVolume, position, cpc)
  const title = serpElement?.title || ''
  const url = serpElement?.url || ''

  const competitionColors = {
    LOW: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-orange-100 text-orange-700',
    HIGH: 'bg-red-100 text-red-700',
    UNKNOWN: 'bg-gray-100 text-gray-700',
  }

  const positionColor =
    position <= 3
      ? 'text-green-600'
      : position <= 10
        ? 'text-blue-600'
        : 'text-orange-600'

  return (
    <div className="p-6 hover:bg-gray-50">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h4 className="text-lg font-semibold text-gray-900">
              {item.keyword_data?.keyword || ''}
            </h4>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${competitionColors[competition as keyof typeof competitionColors]}`}
            >
              {competition}
            </span>
          </div>
          {serpElement && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              {title}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className={`text-3xl font-bold ${positionColor}`}>#{position}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-purple-50 p-3">
          <div className="text-xs font-medium text-purple-600">Volume</div>
          <div className="mt-1 text-xl font-bold text-purple-700">
            {searchVolume.toLocaleString()}
          </div>
          <div className="mt-0.5 text-xs text-purple-600">/mois</div>
        </div>

        <div className="rounded-lg bg-green-50 p-3">
          <div className="text-xs font-medium text-green-600">ETV</div>
          <div className="mt-1 text-xl font-bold text-green-700">
            ${etv.toLocaleString()}
          </div>
          <div className="mt-0.5 text-xs text-green-600">/mois</div>
        </div>

        <div className="rounded-lg bg-blue-50 p-3">
          <div className="text-xs font-medium text-blue-600">CPC</div>
          <div className="mt-1 text-xl font-bold text-blue-700">
            ${cpc.toFixed(2)}
          </div>
          <div className="mt-0.5 text-xs text-blue-600">par clic</div>
        </div>

        <div className="rounded-lg bg-orange-50 p-3">
          <div className="text-xs font-medium text-orange-600">Position</div>
          <div className="mt-1 text-xl font-bold text-orange-700">
            #{position}
          </div>
          <div className="mt-0.5 text-xs text-orange-600">
            {Object.values(targets)[0]}
          </div>
        </div>
      </div>

      {serpElement?.description && (
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">Description: </span>
          {serpElement.description}
        </div>
      )}
    </div>
  )
}

function estimateETV(
  searchVolume: number,
  position: number,
  cpc: number | null,
): number {
  if (position > 100) return 0

  const ctrByPosition: Record<number, number> = {
    1: 0.28,
    2: 0.15,
    3: 0.11,
    4: 0.08,
    5: 0.07,
    6: 0.05,
    7: 0.04,
    8: 0.03,
    9: 0.03,
    10: 0.02,
  }

  const ctr = position <= 10 ? ctrByPosition[position] : 0.01
  const clicks = searchVolume * ctr
  const value = cpc ? clicks * cpc : clicks * 0.5

  return Math.round(value)
}

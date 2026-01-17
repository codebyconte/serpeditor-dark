'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  ArrowUpDown,
  Award,
  BarChart3,
  DollarSign,
  ExternalLink,
  Eye,
  Lightbulb,
  Search,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { KeywordGapItem, KeywordGapResponse, KeywordGapStats } from './action'
import { calculateKeywordGapStats } from './utils'

interface KeywordGapAnalyzerProps {
  data: KeywordGapResponse
  isGapMode: boolean // true = gaps, false = communs
}

export default function KeywordGapAnalyzer({ data, isGapMode }: KeywordGapAnalyzerProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'keywords' | 'easy-wins'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [minVolume, setMinVolume] = useState(0)
  const [competitionFilter, setCompetitionFilter] = useState<'all' | 'LOW' | 'MEDIUM' | 'HIGH'>('all')
  const [sortBy, setSortBy] = useState<'volume' | 'etv' | 'position' | 'cpc'>('volume')
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
        item.keyword_data?.keyword?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Volume minimum
    if (minVolume > 0) {
      filtered = filtered.filter((item) => (item.keyword_data?.keyword_info?.search_volume || 0) >= minVolume)
    }

    // Compétition
    if (competitionFilter !== 'all') {
      filtered = filtered.filter((item) => {
        const competition = item.keyword_data?.keyword_info?.competition
        if (competition === null || competition === undefined) {
          return false
        }
        const level = competition < 0.33 ? 'LOW' : competition < 0.66 ? 'MEDIUM' : 'HIGH'
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
        aVal = aETV || estimateETV(aVol, aPos, a.keyword_data?.keyword_info?.cpc)
        bVal = bETV || estimateETV(bVol, bPos, b.keyword_data?.keyword_info?.cpc)
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
          value={isGapMode ? stats.easyWins.length.toString() : Math.round(stats.avgPosition).toString()}
          icon={isGapMode ? <Zap className="h-5 w-5" /> : <Award className="h-5 w-5" />}
          color="orange"
          subtitle={isGapMode ? 'Faible compétition' : 'Du concurrent'}
        />
      </div>

      {/* Alert mode */}
      {isGapMode && (
        <Card className="border-mist-100 bg-mist-700">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div>
                <h3 className="dashboard-heading-4 text-foreground">Mode Écart de Mots-clés (Keyword Gap)</h3>
                <p className="dashboard-body-sm mt-1">
                  Ces mots-clés sont positionnés par <strong>{Object.values(data.targets)[0] as string}</strong> mais
                  PAS par <strong>{Object.values(data.targets)[1] as string}</strong>. Ce sont vos opportunités SEO !
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-mist-400 p-4 shadow-sm">
        <button
          type="button"
          onClick={() => setViewMode('overview')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all focus:outline-none ${
            viewMode === 'overview' ? 'border-mist-600 bg-mist-600 text-white shadow' : ''
          } `}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Vue d&apos;ensemble</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('keywords')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all focus:outline-none ${
            viewMode === 'keywords' ? 'border-mist-600 bg-mist-600 text-white shadow' : ''
          } `}
        >
          <Search className="h-4 w-4" />
          <span>Tous les mots-clés</span>
        </button>
        {isGapMode && stats.easyWins.length > 0 && (
          <button
            type="button"
            onClick={() => setViewMode('easy-wins')}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all focus:outline-none ${
              viewMode === 'easy-wins' ? 'border-mist-600 bg-mist-600 text-white shadow' : ''
            } `}
          >
            <Zap className="h-4 w-4" />
            <span>{`Easy Wins (${stats.easyWins.length})`}</span>
          </button>
        )}
      </div>

      {/* Vue Overview */}
      {viewMode === 'overview' && <OverviewView stats={stats} targets={data.targets} isGapMode={isGapMode} />}

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
      {viewMode === 'easy-wins' && isGapMode && <EasyWinsView easyWins={stats.easyWins} />}
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
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="dashboard-body-sm text-muted-foreground">{label}</p>
            <p className="dashboard-heading-1 mt-2">{value}</p>
            {subtitle && <p className="dashboard-text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`rounded-lg border p-3 ${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="text-primary h-5 w-5" />
            <CardTitle className="dashboard-heading-3">Domaines Analysés</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                    1
                  </div>
                  <div className="dashboard-body-sm font-semibold text-green-500">
                    {isGapMode ? 'Concurrent (positionné)' : 'Domaine 1'}
                  </div>
                </div>
                <a
                  href={`https://${Object.values(targets)[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-lg font-bold text-green-500 hover:text-green-400 hover:underline"
                >
                  {Object.values(targets)[0]}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                    2
                  </div>
                  <div className="dashboard-body-sm font-semibold text-red-500">
                    {isGapMode ? 'Votre site (non positionné)' : 'Domaine 2'}
                  </div>
                </div>
                <a
                  href={`https://${Object.values(targets)[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-lg font-bold text-red-500 hover:text-red-400 hover:underline"
                >
                  {Object.values(targets)[1]}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Distribution des positions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="text-primary h-5 w-5" />
            <CardTitle className="dashboard-heading-3">
              Distribution des Positions {isGapMode ? '(Concurrent)' : ''}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Distribution par intent */}
      {Object.keys(stats.intentDistribution).length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="text-primary h-5 w-5" />
              <CardTitle className="dashboard-heading-3">Intention de Recherche</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(stats.intentDistribution)
                .sort((a, b) => (b[1] as number) - (a[1] as number))
                .map(([intent, count]) => (
                  <Card key={intent} className="border-purple-500/20 bg-purple-500/5">
                    <CardContent className="p-4 text-center">
                      <div className="dashboard-heading-2 text-purple-500">{count as number}</div>
                      <div className="dashboard-body-sm mt-1 font-medium text-purple-400">{intent}</div>
                      <div className="dashboard-text-xs mt-0.5 text-purple-500/70">
                        {(((count as number) / stats.totalKeywords) * 100).toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distribution par compétition */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="text-primary h-5 w-5" />
            <CardTitle className="dashboard-heading-3">Niveau de Compétition</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(stats.competitionDistribution)
              .sort((a, b) => {
                const order = { LOW: 0, MEDIUM: 1, HIGH: 2, UNKNOWN: 3 }
                return (order[a[0] as keyof typeof order] || 999) - (order[b[0] as keyof typeof order] || 999)
              })
              .map(([level, count]) => {
                const colors = {
                  LOW: 'border-green-500/20 bg-green-500/5 text-green-500',
                  MEDIUM: 'border-orange-500/20 bg-orange-500/5 text-orange-500',
                  HIGH: 'border-red-500/20 bg-red-500/5 text-red-500',
                  UNKNOWN: 'border-border bg-muted text-muted-foreground',
                }
                return (
                  <Card key={level} className={`border-2 text-center ${colors[level as keyof typeof colors]}`}>
                    <CardContent className="p-4">
                      <div className="dashboard-heading-2">{count as number}</div>
                      <div className="dashboard-body-sm mt-1 font-medium">{level}</div>
                      <div className="dashboard-text-xs mt-0.5">
                        {(((count as number) / stats.totalKeywords) * 100).toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Top keywords par volume */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            <CardTitle className="dashboard-heading-3">Top 10 par Volume de Recherche</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.topKeywordsByVolume.map((item, idx) => (
              <Card key={idx} className="bg-muted/30">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-sm font-bold text-purple-500">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="dashboard-body font-medium">{item.keyword}</div>
                      <div className="dashboard-text-xs text-muted-foreground">Position: {item.position}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="dashboard-body-sm text-muted-foreground">Volume</div>
                      <div className="dashboard-heading-4 text-purple-500">{item.searchVolume.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="dashboard-body-sm text-muted-foreground">ETV</div>
                      <div className="dashboard-heading-4 text-green-500">${item.etv.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top keywords par ETV */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="text-primary h-5 w-5" />
            <CardTitle className="dashboard-heading-3">Top 10 par Valeur (ETV)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.topKeywordsByETV.map((item, idx) => (
              <Card key={idx} className="bg-muted/30">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-sm font-bold text-green-500">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="dashboard-body font-medium">{item.keyword}</div>
                      <div className="dashboard-text-xs text-muted-foreground">Position: {item.position}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="dashboard-body-sm text-muted-foreground">ETV</div>
                      <div className="dashboard-heading-4 text-green-500">${item.etv.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="dashboard-body-sm text-muted-foreground">Volume</div>
                      <div className="dashboard-heading-4 text-purple-500">{item.searchVolume.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
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
      <div className="dashboard-body-sm w-20 font-medium">{label}</div>
      <div className="flex-1">
        <div className="dashboard-text-xs text-muted-foreground mb-1 flex items-center justify-between">
          <span>{count} mots-clés</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
          <div className={`h-full ${colors[color]}`} style={{ width: `${percentage}%` }} />
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
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Recherche */}
            <div>
              <label className="dashboard-body-sm mb-2 block font-semibold">Rechercher</label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Mot-clé..."
                  className="w-full pl-10"
                />
              </div>
            </div>

            {/* Volume minimum */}
            <div>
              <label className="dashboard-body-sm mb-2 block font-semibold">Volume minimum</label>
              <select
                value={minVolume}
                onChange={(e) => setMinVolume(Number(e.target.value))}
                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
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
              <label className="dashboard-body-sm mb-2 block font-semibold">Compétition</label>
              <select
                value={competitionFilter}
                onChange={(e) => setCompetitionFilter(e.target.value as 'all' | 'LOW' | 'MEDIUM' | 'HIGH')}
                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
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
            <span className="dashboard-body-sm mb-2 block font-semibold">Trier par</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSortBy('volume')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
                className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  sortBy === 'volume'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                CPC <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      <Card>
        <CardHeader className="border-border border-b">
          <CardTitle className="dashboard-heading-4">
            {keywords.length} mot{keywords.length > 1 ? 's' : ''}-clé
            {keywords.length > 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-border divide-y p-0">
          {keywords.slice(0, 50).map((item, idx) => (
            <KeywordCard key={idx} item={item} targets={targets} />
          ))}
        </CardContent>
      </Card>
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
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 shrink-0 text-green-500" />
            <div>
              <h3 className="dashboard-heading-4 text-foreground">Opportunités &quot;Easy Wins&quot;</h3>
              <p className="dashboard-body-sm mt-1">
                Ces mots-clés ont une faible/moyenne compétition avec un bon volume de recherche. Votre concurrent est
                déjà bien positionné - c&apos;est votre chance de les rattraper facilement !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-border border-b">
          <CardTitle className="dashboard-heading-4">
            {easyWins.length} opportunité{easyWins.length > 1 ? 's' : ''} Easy Win
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-border divide-y p-0">
          {easyWins.map((item, idx) => (
            <div key={idx} className="p-6 transition-colors hover:bg-green-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="dashboard-heading-4">{item.keyword}</div>
                    <div className="dashboard-body-sm text-muted-foreground mt-1 flex items-center gap-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${
                          item.competition === 'LOW'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-orange-500/10 text-orange-500'
                        }`}
                      >
                        {item.competition}
                      </span>
                      <span>Position: #{item.position}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="dashboard-body-sm text-muted-foreground">Volume</div>
                  <div className="dashboard-heading-2 text-purple-500">{item.searchVolume.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function KeywordCard({ item, targets }: { item: KeywordGapItem; targets: Record<string, string> }) {
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
    LOW: 'bg-green-500/10 text-green-500',
    MEDIUM: 'bg-orange-500/10 text-orange-500',
    HIGH: 'bg-red-500/10 text-red-500',
    UNKNOWN: 'bg-muted text-muted-foreground',
  }

  const positionColor = position <= 3 ? 'text-green-500' : position <= 10 ? 'text-blue-500' : 'text-orange-500'

  return (
    <CardContent className="hover:bg-muted/30 p-6 transition-colors">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h4 className="dashboard-heading-4">{item.keyword_data?.keyword || ''}</h4>
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
              className="dashboard-body-sm text-primary flex items-center gap-1 hover:underline"
            >
              {title}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className={`dashboard-heading-1 ${positionColor}`}>#{position}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-3">
            <div className="dashboard-text-xs font-medium text-purple-500">Volume</div>
            <div className="dashboard-heading-3 mt-1 text-purple-500">{searchVolume.toLocaleString()}</div>
            <div className="dashboard-text-xs mt-0.5 text-purple-500/70">/mois</div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-3">
            <div className="dashboard-text-xs font-medium text-green-500">ETV</div>
            <div className="dashboard-heading-3 mt-1 text-green-500">${etv.toLocaleString()}</div>
            <div className="dashboard-text-xs mt-0.5 text-green-500/70">/mois</div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-3">
            <div className="dashboard-text-xs font-medium text-blue-500">CPC</div>
            <div className="dashboard-heading-3 mt-1 text-blue-500">${cpc.toFixed(2)}</div>
            <div className="dashboard-text-xs mt-0.5 text-blue-500/70">par clic</div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-3">
            <div className="dashboard-text-xs font-medium text-orange-500">Position</div>
            <div className="dashboard-heading-3 mt-1 text-orange-500">#{position}</div>
            <div className="dashboard-text-xs mt-0.5 text-orange-500/70">{Object.values(targets)[0]}</div>
          </CardContent>
        </Card>
      </div>

      {serpElement?.description && (
        <div className="dashboard-body-sm text-muted-foreground mt-4">
          <span className="font-semibold">Description: </span>
          {serpElement.description}
        </div>
      )}
    </CardContent>
  )
}

function estimateETV(searchVolume: number, position: number, cpc: number | null): number {
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

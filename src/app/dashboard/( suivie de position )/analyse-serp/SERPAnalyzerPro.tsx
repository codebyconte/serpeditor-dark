'use client'

import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  Globe,
  Loader2,
  Minus,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  compareSERPs,
  type HistoricalSERPItem,
  type HistoricalSERPSnapshot,
  type OrganicSERPItem,
  type SERPComparison,
} from './action'

// Type guard pour vérifier si un item est organique
const isOrganicItem = (item: HistoricalSERPItem): item is OrganicSERPItem =>
  item.type === 'organic'

interface SERPAnalyzerProProps {
  data: HistoricalSERPSnapshot[]
  keyword: string
}

export default function SERPAnalyzerPro({
  data,
  keyword,
}: SERPAnalyzerProProps) {
  const [viewMode, setViewMode] = useState<
    'comparison' | 'domains' | 'timeline' | 'features'
  >('comparison')
  const [domainFilter, setDomainFilter] = useState('')
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set())
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null)
  const [comparison, setComparison] = useState<SERPComparison | null>(null)
  const [loadingComparison, setLoadingComparison] = useState(false)

  // Analyser les données
  const analytics = useMemo(() => {
    if (!data.length) return null

    const sortedData = [...data].sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    )

    // Extraire tous les domaines uniques
    const domainsMap = new Map<
      string,
      {
        domain: string
        appearances: number
        positions: number[]
        avgPosition: number
        bestPosition: number
        worstPosition: number
        trend: 'up' | 'down' | 'stable'
        history: Array<{
          date: string
          position: number | null
          title?: string
          url?: string
        }>
      }
    >()

    sortedData.forEach((snapshot) => {
      snapshot.items.forEach((item) => {
        if (!isOrganicItem(item)) return

        const domain = item.domain
        if (!domainsMap.has(domain)) {
          domainsMap.set(domain, {
            domain,
            appearances: 0,
            positions: [],
            avgPosition: 0,
            bestPosition: 100,
            worstPosition: 0,
            trend: 'stable',
            history: [],
          })
        }

        const domainData = domainsMap.get(domain)!
        domainData.appearances++
        domainData.positions.push(item.rank_absolute)
        domainData.bestPosition = Math.min(
          domainData.bestPosition,
          item.rank_absolute,
        )
        domainData.worstPosition = Math.max(
          domainData.worstPosition,
          item.rank_absolute,
        )
        domainData.history.push({
          date: snapshot.datetime,
          position: item.rank_absolute,
          title: item.title,
          url: item.url,
        })
      })

      domainsMap.forEach((domainData, domain) => {
        const hasPosition = snapshot.items.some(
          (item) => isOrganicItem(item) && item.domain === domain,
        )
        if (!hasPosition) {
          domainData.history.push({
            date: snapshot.datetime,
            position: null,
          })
        }
      })
    })

    domainsMap.forEach((domainData) => {
      domainData.avgPosition =
        domainData.positions.reduce((sum, pos) => sum + pos, 0) /
        domainData.positions.length

      const recentPositions = domainData.positions.slice(-3)
      const earlyPositions = domainData.positions.slice(0, 3)
      const recentAvg =
        recentPositions.reduce((sum, pos) => sum + pos, 0) /
        recentPositions.length
      const earlyAvg =
        earlyPositions.reduce((sum, pos) => sum + pos, 0) /
        earlyPositions.length

      if (recentAvg < earlyAvg - 2) domainData.trend = 'up'
      else if (recentAvg > earlyAvg + 2) domainData.trend = 'down'
      else domainData.trend = 'stable'

      domainData.history.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
    })

    const domains = Array.from(domainsMap.values()).sort(
      (a, b) => a.avgPosition - b.avgPosition,
    )

    // Analyser les features SERP
    const featuresMap = new Map<string, number>()
    sortedData.forEach((snapshot) => {
      snapshot.items.forEach((item) => {
        if (item.type !== 'organic' && item.type !== 'paid') {
          const count = featuresMap.get(item.type) || 0
          featuresMap.set(item.type, count + 1)
        }
      })
    })

    return {
      snapshots: sortedData,
      domains,
      features: Array.from(featuresMap.entries()).sort((a, b) => b[1] - a[1]),
      totalSnapshots: sortedData.length,
    }
  }, [data])

  // Charger la comparaison automatiquement (dernier vs avant-dernier)
  useEffect(() => {
    if (!analytics || analytics.snapshots.length < 2) return

    const loadComparison = async () => {
      setLoadingComparison(true)
      try {
        const latest = analytics.snapshots[analytics.snapshots.length - 1]
        const previous = analytics.snapshots[analytics.snapshots.length - 2]
        const comp = await compareSERPs(previous, latest)
        setComparison(comp)
      } catch (error) {
        console.error('Error loading comparison:', error)
      } finally {
        setLoadingComparison(false)
      }
    }

    loadComparison()
  }, [analytics])

  if (!analytics) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">Aucune donnée disponible</p>
      </div>
    )
  }

  const filteredDomains = analytics.domains.filter((d) =>
    d.domain.toLowerCase().includes(domainFilter.toLowerCase()),
  )

  const currentSnapshot = selectedSnapshot
    ? analytics.snapshots.find((s) => s.datetime === selectedSnapshot)
    : analytics.snapshots[analytics.snapshots.length - 1]

  return (
    <div className="space-y-6">
      {/* En-tête avec informations du mot-clé */}
      <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Analyse SERP : &quot;{keyword}&quot;
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Analyse historique de l&apos;évolution des résultats de recherche
              Google
            </p>
          </div>
          <div className="rounded-lg bg-white p-3 shadow-sm">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Métriques SEO clés */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Périodes analysées"
          value={analytics.totalSnapshots}
          icon={<Calendar className="h-5 w-5" />}
          color="blue"
          subtitle={`${analytics.totalSnapshots} snapshot${analytics.totalSnapshots > 1 ? 's' : ''} historique${analytics.totalSnapshots > 1 ? 's' : ''}`}
        />
        <MetricCard
          label="Concurrents identifiés"
          value={analytics.domains.length}
          icon={<Globe className="h-5 w-5" />}
          color="green"
          subtitle={`${analytics.domains.length} domaine${analytics.domains.length > 1 ? 's' : ''} dans le top 100`}
        />
        <MetricCard
          label="Mouvements SERP"
          value={comparison?.totalChanges || 0}
          icon={<Activity className="h-5 w-5" />}
          color="orange"
          subtitle={
            loadingComparison
              ? 'Calcul en cours...'
              : comparison
                ? `${comparison.newDomains.length} nouveaux, ${comparison.lostDomains.length} sortis`
                : 'Comparaison non disponible'
          }
        />
        <MetricCard
          label="Stabilité du marché"
          value={
            comparison
              ? `${(100 - comparison.volatilityScore * 100).toFixed(0)}%`
              : 'N/A'
          }
          icon={<TrendingUp className="h-5 w-5" />}
          color="purple"
          subtitle={
            comparison
              ? comparison.volatilityScore < 0.3
                ? 'Marché stable'
                : comparison.volatilityScore < 0.6
                  ? 'Marché modéré'
                  : 'Marché volatile'
              : 'Non calculé'
          }
        />
      </div>

      {/* Navigation avec descriptions SEO */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Vues d&apos;analyse disponibles
          </h3>
          <p className="text-xs text-gray-500">
            Sélectionnez une vue pour analyser différents aspects de la SERP
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ViewTab
            active={viewMode === 'comparison'}
            onClick={() => setViewMode('comparison')}
            icon={<BarChart3 className="h-4 w-4" />}
            label="Évolution SERP"
            description="Comparaison entre périodes"
          />
          <ViewTab
            active={viewMode === 'timeline'}
            onClick={() => setViewMode('timeline')}
            icon={<Calendar className="h-4 w-4" />}
            label="Historique détaillé"
            description="Vue chronologique complète"
          />
          <ViewTab
            active={viewMode === 'domains'}
            onClick={() => setViewMode('domains')}
            icon={<Globe className="h-4 w-4" />}
            label="Analyse concurrentielle"
            description="Performance des domaines"
          />
          <ViewTab
            active={viewMode === 'features'}
            onClick={() => setViewMode('features')}
            icon={<Star className="h-4 w-4" />}
            label="Rich Results"
            description="Features SERP détectées"
          />
        </div>
      </div>

      {/* Vue Comparaison */}
      {viewMode === 'comparison' && (
        <ComparisonView
          comparison={comparison}
          loading={loadingComparison}
          snapshots={analytics.snapshots}
        />
      )}

      {/* Vue Timeline */}
      {viewMode === 'timeline' && (
        <TimelineView
          snapshots={analytics.snapshots}
          selectedSnapshot={currentSnapshot}
          onSelectSnapshot={setSelectedSnapshot}
        />
      )}

      {/* Vue Domaines */}
      {viewMode === 'domains' && (
        <DomainsView
          domains={filteredDomains}
          domainFilter={domainFilter}
          setDomainFilter={setDomainFilter}
          expandedDomains={expandedDomains}
          setExpandedDomains={setExpandedDomains}
        />
      )}

      {/* Vue Features */}
      {viewMode === 'features' && <FeaturesView analytics={analytics} />}
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
  description,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  description?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-lg px-4 py-3 text-left font-medium transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold">{label}</span>
      </div>
      {description && (
        <span
          className={`text-xs ${active ? 'text-blue-100' : 'text-gray-500'}`}
        >
          {description}
        </span>
      )}
    </button>
  )
}

function ComparisonView({
  comparison,
  loading,
  snapshots,
}: {
  comparison: SERPComparison | null
  loading: boolean
  snapshots: any[]
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Comparaison en cours...</span>
      </div>
    )
  }

  if (!comparison) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">
          {snapshots.length < 2
            ? 'Au moins 2 snapshots nécessaires pour la comparaison'
            : 'Impossible de charger la comparaison'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête de comparaison avec contexte SEO */}
      <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Analyse comparative des SERP
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Comparaison entre le{' '}
              <span className="font-semibold">
                {new Date(comparison.date1).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>{' '}
              et le{' '}
              <span className="font-semibold">
                {new Date(comparison.date2).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Analyse des changements de positions, nouveaux entrants et
              domaines sortis du top 100
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-700">
              {(comparison.volatilityScore * 100).toFixed(1)}%
            </div>
            <div className="text-xs font-medium text-gray-600">
              Taux de volatilité
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {comparison.volatilityScore < 0.3
                ? 'SERP stable'
                : comparison.volatilityScore < 0.6
                  ? 'SERP modérée'
                  : 'SERP très volatile'}
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques SEO détaillées */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3">
                <TrendingUp className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-700">
                  {comparison.newDomains.length}
                </div>
                <div className="mt-1 text-sm font-semibold text-green-800">
                  Nouveaux entrants
                </div>
                <div className="mt-1 text-xs text-green-600">
                  Domaines apparus dans le top 100
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-3">
                <TrendingDown className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <div className="text-3xl font-bold text-red-700">
                  {comparison.lostDomains.length}
                </div>
                <div className="mt-1 text-sm font-semibold text-red-800">
                  Domaines sortis
                </div>
                <div className="mt-1 text-xs text-red-600">
                  Domaines disparus du top 100
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <Activity className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-700">
                  {
                    comparison.positionChanges.filter((c) => c.change !== 0)
                      .length
                  }
                </div>
                <div className="mt-1 text-sm font-semibold text-blue-800">
                  Changements de position
                </div>
                <div className="mt-1 text-xs text-blue-600">
                  Domaines ayant bougé dans le classement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vue organisée par sections pour consultant SEO */}
      <div className="space-y-6">
        {/* Section 1: Top 10 - Les positions les plus importantes */}
        {comparison.positionChanges.filter(
          (c) => c.newPosition <= 10 && c.change !== 0,
        ).length > 0 && (
          <div className="overflow-hidden rounded-xl border-2 border-yellow-200 bg-yellow-50 shadow-sm">
            <div className="border-b-2 border-yellow-300 bg-yellow-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    🎯 Top 10 - Positions stratégiques
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Évolution des domaines dans les 10 premières positions
                    (zones de forte visibilité)
                  </p>
                </div>
                <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                  <div className="text-2xl font-bold text-yellow-700">
                    {
                      comparison.positionChanges.filter(
                        (c) => c.newPosition <= 10 && c.change !== 0,
                      ).length
                    }
                  </div>
                  <div className="text-xs text-gray-600">mouvements</div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Position finale
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Domaine
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Position initiale
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Évolution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Page classée
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparison.positionChanges
                    .filter((c) => c.newPosition <= 10 && c.change !== 0)
                    .sort((a, b) => a.newPosition - b.newPosition)
                    .map((change, idx) => (
                      <tr
                        key={`top10-${idx}`}
                        className="hover:bg-yellow-50/50"
                      >
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-bold ${
                              change.newPosition <= 3
                                ? 'bg-green-100 text-green-800'
                                : change.newPosition <= 10
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {change.newPosition}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {change.domain}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-medium text-gray-600">
                            #{change.oldPosition}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {change.change > 0 ? (
                              <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-700">
                                <ArrowUp className="h-4 w-4" />
                                <span className="font-bold">
                                  +{change.change}
                                </span>
                                <span className="text-xs">places</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-red-700">
                                <ArrowDown className="h-4 w-4" />
                                <span className="font-bold">
                                  {Math.abs(change.change)}
                                </span>
                                <span className="text-xs">places</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="max-w-md px-6 py-4">
                          <div className="truncate text-sm text-gray-600">
                            {change.title}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 2: Nouveaux entrants - Triés par position */}
        {comparison.newDomains.length > 0 && (
          <div className="overflow-hidden rounded-xl border-2 border-green-200 bg-green-50 shadow-sm">
            <div className="border-b-2 border-green-300 bg-green-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    ✨ Nouveaux entrants dans le top 100
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Domaines qui sont apparus dans les résultats de recherche
                    (triés par position finale)
                  </p>
                </div>
                <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                  <div className="text-2xl font-bold text-green-700">
                    {comparison.newDomains.length}
                  </div>
                  <div className="text-xs text-gray-600">nouveaux</div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Domaine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Page classée
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...comparison.newDomains]
                    .sort((a, b) => a.position - b.position)
                    .map((item, idx) => (
                      <tr key={`new-${idx}`} className="hover:bg-green-50/50">
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-bold ${
                              item.position <= 3
                                ? 'bg-green-100 text-green-800'
                                : item.position <= 10
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {item.position}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {item.domain}
                            </span>
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                              NOUVEAU
                            </span>
                          </div>
                        </td>
                        <td className="max-w-md px-6 py-4">
                          <div className="truncate text-sm text-gray-600">
                            {item.title}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Principaux mouvements (hors top 10) - Triés par amplitude */}
        {comparison.positionChanges.filter(
          (c) => c.newPosition > 10 && c.change !== 0,
        ).length > 0 && (
          <div className="overflow-hidden rounded-xl border-2 border-blue-200 bg-blue-50 shadow-sm">
            <div className="border-b-2 border-blue-300 bg-blue-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    📊 Principaux mouvements (positions 11-100)
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Domaines ayant le plus bougé, triés par amplitude de
                    changement
                  </p>
                </div>
                <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                  <div className="text-2xl font-bold text-blue-700">
                    {
                      comparison.positionChanges.filter(
                        (c) => c.newPosition > 10 && c.change !== 0,
                      ).length
                    }
                  </div>
                  <div className="text-xs text-gray-600">mouvements</div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Évolution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Domaine
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Avant
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Après
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Page classée
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparison.positionChanges
                    .filter((c) => c.newPosition > 10 && c.change !== 0)
                    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
                    .slice(0, 30)
                    .map((change, idx) => (
                      <tr key={`move-${idx}`} className="hover:bg-blue-50/50">
                        <td className="px-6 py-4">
                          {change.change > 0 ? (
                            <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-700">
                              <ArrowUp className="h-4 w-4" />
                              <span className="font-bold">
                                +{change.change}
                              </span>
                              <span className="text-xs">places</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-red-700">
                              <ArrowDown className="h-4 w-4" />
                              <span className="font-bold">{change.change}</span>
                              <span className="text-xs">places</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {change.domain}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-medium text-gray-600">
                            #{change.oldPosition}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-medium text-gray-900">
                            #{change.newPosition}
                          </span>
                        </td>
                        <td className="max-w-md px-6 py-4">
                          <div className="truncate text-sm text-gray-600">
                            {change.title}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 4: Domaines sortis - Triés par ancienne position */}
        {comparison.lostDomains.length > 0 && (
          <div className="overflow-hidden rounded-xl border-2 border-red-200 bg-red-50 shadow-sm">
            <div className="border-b-2 border-red-300 bg-red-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    ⚠️ Domaines sortis du top 100
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Domaines qui ne sont plus présents dans les résultats (triés
                    par ancienne position)
                  </p>
                </div>
                <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                  <div className="text-2xl font-bold text-red-700">
                    {comparison.lostDomains.length}
                  </div>
                  <div className="text-xs text-gray-600">sortis</div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Ancienne position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Domaine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Dernière page classée
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...comparison.lostDomains]
                    .sort((a, b) => a.previousPosition - b.previousPosition)
                    .map((item, idx) => (
                      <tr key={`lost-${idx}`} className="hover:bg-red-50/50">
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-bold ${
                              item.previousPosition <= 3
                                ? 'bg-red-100 text-red-800'
                                : item.previousPosition <= 10
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {item.previousPosition}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {item.domain}
                            </span>
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                              SORTI
                            </span>
                          </div>
                        </td>
                        <td className="max-w-md px-6 py-4">
                          <div className="truncate text-sm text-gray-600">
                            {item.title}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TimelineView({
  snapshots,
  selectedSnapshot,
  onSelectSnapshot,
}: {
  snapshots: HistoricalSERPSnapshot[]
  selectedSnapshot: HistoricalSERPSnapshot | undefined
  onSelectSnapshot: (datetime: string | null) => void
}) {
  return (
    <div className="space-y-6">
      {/* Sélection du snapshot */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Sélectionner une période d&apos;analyse
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Choisissez une date pour voir l&apos;état détaillé de la SERP à ce
            moment précis
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {snapshots.map((snapshot) => (
            <button
              key={snapshot.datetime}
              onClick={() => onSelectSnapshot(snapshot.datetime)}
              className={`rounded-lg border-2 p-3 text-center transition-all ${
                selectedSnapshot?.datetime === snapshot.datetime
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-xs font-medium text-gray-500">
                {new Date(snapshot.datetime).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </div>
              <div className="mt-1 text-xs text-gray-600">
                {snapshot.items_count} résultats
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Affichage du snapshot sélectionné */}
      {selectedSnapshot && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  SERP du{' '}
                  {new Date(selectedSnapshot.datetime).toLocaleDateString(
                    'fr-FR',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  )}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedSnapshot.items.filter(isOrganicItem).length} résultat
                  {selectedSnapshot.items.filter(isOrganicItem).length > 1
                    ? 's'
                    : ''}{' '}
                  organique
                  {selectedSnapshot.items.filter(isOrganicItem).length > 1
                    ? 's'
                    : ''}{' '}
                  dans le top 100
                </p>
              </div>
              <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                <div className="text-sm font-semibold text-gray-700">
                  {selectedSnapshot.items_count} éléments SERP
                </div>
                <div className="text-xs text-gray-500">
                  Tous types confondus
                </div>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {selectedSnapshot.items
              .filter(isOrganicItem)
              .slice(0, 20)
              .map((item, idx) => (
                <div key={idx} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 font-bold ${
                        item.rank_absolute <= 3
                          ? 'border-green-200 bg-green-100 text-green-800'
                          : item.rank_absolute <= 10
                            ? 'border-blue-200 bg-blue-100 text-blue-800'
                            : 'border-gray-200 bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.rank_absolute}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-sm text-gray-600">
                        {item.domain}
                      </div>
                      <h4 className="mb-2 text-base font-medium text-blue-600 hover:text-blue-700">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.title}
                        </a>
                      </h4>
                      <div className="mb-2 truncate text-sm text-green-700">
                        {item.url}
                      </div>
                      {item.description && (
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DomainsView({
  domains,
  domainFilter,
  setDomainFilter,
  expandedDomains,
  setExpandedDomains,
}: {
  domains: any[]
  domainFilter: string
  setDomainFilter: (filter: string) => void
  expandedDomains: Set<string>
  setExpandedDomains: (domains: Set<string>) => void
}) {
  const toggleDomain = (domain: string) => {
    const newExpanded = new Set(expandedDomains)
    if (newExpanded.has(domain)) {
      newExpanded.delete(domain)
    } else {
      newExpanded.add(domain)
    }
    setExpandedDomains(newExpanded)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Analyse concurrentielle
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Analysez la performance et l&apos;évolution de chaque concurrent
            dans le temps
          </p>
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            placeholder="Rechercher un domaine ou concurrent..."
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {domains.length} domaine{domains.length > 1 ? 's' : ''} trouvé
          {domains.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-3">
        {domains.map((domain) => (
          <DomainCard
            key={domain.domain}
            domain={domain}
            isExpanded={expandedDomains.has(domain.domain)}
            onToggle={() => toggleDomain(domain.domain)}
          />
        ))}
      </div>
    </div>
  )
}

function DomainCard({
  domain,
  isExpanded,
  onToggle,
}: {
  domain: any
  isExpanded: boolean
  onToggle: () => void
}) {
  const getTrendIcon = () => {
    if (domain.trend === 'up')
      return <TrendingUp className="h-5 w-5 text-green-600" />
    if (domain.trend === 'down')
      return <TrendingDown className="h-5 w-5 text-red-600" />
    return <Minus className="h-5 w-5 text-gray-400" />
  }

  const getAvgPositionColor = () => {
    if (domain.avgPosition <= 3) return 'text-green-600'
    if (domain.avgPosition <= 10) return 'text-blue-600'
    if (domain.avgPosition <= 20) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-gray-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-4">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">
                {domain.domain}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                {domain.appearances} apparitions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getAvgPositionColor()}`}>
                {domain.avgPosition.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Moy</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {domain.bestPosition}
              </div>
              <div className="text-xs text-gray-500">Best</div>
            </div>
            <div className="text-center">{getTrendIcon()}</div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h5 className="mb-4 font-semibold text-gray-900">
            Historique des positions
          </h5>
          <div className="space-y-2">
            {domain.history.map((entry: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-white p-3"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(entry.date).toLocaleString('fr-FR')}
                  </div>
                  {entry.title && (
                    <div className="mt-1 truncate text-xs text-gray-600">
                      {entry.title}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  {entry.position ? (
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                      {entry.position}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">Absent</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FeaturesView({ analytics }: { analytics: any }) {
  const getFeatureLabel = (type: string) => {
    const labels: Record<string, string> = {
      featured_snippet: 'Featured Snippet',
      people_also_ask: 'People Also Ask',
      local_pack: 'Local Pack',
      knowledge_graph: 'Knowledge Graph',
      images: 'Images',
      videos: 'Vidéos',
      top_stories: 'Top Stories',
      shopping: 'Shopping',
      map: 'Map',
      carousel: 'Carousel',
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Rich Results &amp; Features SERP
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Analyse des éléments enrichis présents dans les résultats de
            recherche Google
          </p>
          <p className="mt-2 text-xs text-gray-500">
            {analytics.features.length} type
            {analytics.features.length > 1 ? 's' : ''} de feature
            {analytics.features.length > 1 ? 's' : ''} détecté
            {analytics.features.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {analytics.features.map(([type, count]: [string, number]) => (
          <div
            key={type}
            className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {getFeatureLabel(type)}
                </h4>
                <p className="mt-1 text-xs text-gray-600">Feature SERP</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-xs text-gray-500">détections</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart2,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  Globe,
  Loader2,
  Minus,
  RefreshCw,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  analyzeSERPVolatility,
  compareSERPs,
  type HistoricalSERPItem,
  type HistoricalSERPSnapshot,
  type OrganicSERPItem,
  type SERPComparison,
} from './action'

// Type guard pour vérifier si un item est organique
const isOrganicItem = (item: HistoricalSERPItem): item is OrganicSERPItem => item.type === 'organic'

interface SERPAnalyzerProProps {
  data: HistoricalSERPSnapshot[]
  keyword: string
}

export default function SERPAnalyzerPro({ data, keyword }: SERPAnalyzerProProps) {
  const [viewMode, setViewMode] = useState<'comparison' | 'domains' | 'timeline' | 'features' | 'volatility'>(
    'comparison',
  )
  const [domainFilter, setDomainFilter] = useState('')
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set())
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null)
  const [comparison, setComparison] = useState<SERPComparison | null>(null)
  const [loadingComparison, setLoadingComparison] = useState(false)
  const [selectedSnapshot1, setSelectedSnapshot1] = useState<string | null>(null)
  const [selectedSnapshot2, setSelectedSnapshot2] = useState<string | null>(null)
  const [volatilityAnalysis, setVolatilityAnalysis] = useState<{
    averageVolatility: number
    maxVolatility: number
    minVolatility: number
    trend: 'increasing' | 'decreasing' | 'stable'
    comparisons?: SERPComparison[]
  } | null>(null)
  const [loadingVolatility, setLoadingVolatility] = useState(false)

  // Analyser les données
  const analytics = useMemo(() => {
    if (!data.length) return null

    const sortedData = [...data].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

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
        domainData.bestPosition = Math.min(domainData.bestPosition, item.rank_absolute)
        domainData.worstPosition = Math.max(domainData.worstPosition, item.rank_absolute)
        domainData.history.push({
          date: snapshot.datetime,
          position: item.rank_absolute,
          title: item.title,
          url: item.url,
        })
      })

      domainsMap.forEach((domainData, domain) => {
        const hasPosition = snapshot.items.some((item) => isOrganicItem(item) && item.domain === domain)
        if (!hasPosition) {
          domainData.history.push({
            date: snapshot.datetime,
            position: null,
          })
        }
      })
    })

    domainsMap.forEach((domainData) => {
      domainData.avgPosition = domainData.positions.reduce((sum, pos) => sum + pos, 0) / domainData.positions.length

      const recentPositions = domainData.positions.slice(-3)
      const earlyPositions = domainData.positions.slice(0, 3)
      const recentAvg = recentPositions.reduce((sum, pos) => sum + pos, 0) / recentPositions.length
      const earlyAvg = earlyPositions.reduce((sum, pos) => sum + pos, 0) / earlyPositions.length

      if (recentAvg < earlyAvg - 2) domainData.trend = 'up'
      else if (recentAvg > earlyAvg + 2) domainData.trend = 'down'
      else domainData.trend = 'stable'

      domainData.history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    })

    const domains = Array.from(domainsMap.values()).sort((a, b) => a.avgPosition - b.avgPosition)

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
        // Initialiser les snapshots sélectionnés
        setSelectedSnapshot1(previous.datetime)
        setSelectedSnapshot2(latest.datetime)
      } catch (error) {
        console.error('Error loading comparison:', error)
      } finally {
        setLoadingComparison(false)
      }
    }

    loadComparison()
  }, [analytics])

  // Charger l'analyse de volatilité globale
  useEffect(() => {
    if (!analytics || analytics.snapshots.length < 2) return

    const loadVolatility = async () => {
      setLoadingVolatility(true)
      try {
        const volatility = await analyzeSERPVolatility(analytics.snapshots)
        setVolatilityAnalysis(volatility)
      } catch (error) {
        console.error('Error loading volatility:', error)
      } finally {
        setLoadingVolatility(false)
      }
    }

    loadVolatility()
  }, [analytics])

  // Comparer deux snapshots personnalisés
  const handleCustomComparison = async () => {
    if (!analytics || !selectedSnapshot1 || !selectedSnapshot2) return

    const snap1 = analytics.snapshots.find((s) => s.datetime === selectedSnapshot1)
    const snap2 = analytics.snapshots.find((s) => s.datetime === selectedSnapshot2)

    if (!snap1 || !snap2) return

    setLoadingComparison(true)
    try {
      const comp = await compareSERPs(snap1, snap2)
      setComparison(comp)
    } catch (error) {
      console.error('Error loading comparison:', error)
    } finally {
      setLoadingComparison(false)
    }
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="text-muted-foreground mx-auto h-12 w-12" />
          <p className="dashboard-body-sm mt-4">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    )
  }

  const filteredDomains = analytics.domains.filter((d) => d.domain.toLowerCase().includes(domainFilter.toLowerCase()))

  const currentSnapshot = selectedSnapshot
    ? analytics.snapshots.find((s) => s.datetime === selectedSnapshot)
    : analytics.snapshots[analytics.snapshots.length - 1]

  return (
    <div className="space-y-6">
      {/* En-tête avec informations du mot-clé */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="dashboard-heading-2">Analyse SERP : &quot;{keyword}&quot;</h2>
              <p className="dashboard-body-sm text-muted-foreground mt-1">
                Analyse historique de l&apos;évolution des résultats de recherche Google
              </p>
            </div>
            <div className="bg-primary rounded-lg p-3">
              <Search className="text-primary-foreground h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques SEO clés */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
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
          label="Volatilité globale"
          value={
            volatilityAnalysis
              ? `${(volatilityAnalysis.averageVolatility * 100).toFixed(1)}%`
              : loadingVolatility
                ? '...'
                : 'N/A'
          }
          icon={<Zap className="h-5 w-5" />}
          color="purple"
          subtitle={
            volatilityAnalysis
              ? volatilityAnalysis.trend === 'increasing'
                ? 'Tendance à la hausse'
                : volatilityAnalysis.trend === 'decreasing'
                  ? 'Tendance à la baisse'
                  : 'Tendance stable'
              : loadingVolatility
                ? 'Calcul en cours...'
                : 'Non calculé'
          }
        />
        <MetricCard
          label="Stabilité du marché"
          value={comparison ? `${(100 - comparison.volatilityScore * 100).toFixed(0)}%` : 'N/A'}
          icon={<TrendingUp className="h-5 w-5" />}
          color="blue"
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
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-4">Vues d&apos;analyse disponibles</CardTitle>
          <CardDescription>Sélectionnez une vue pour analyser différents aspects de la SERP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <ViewTab
              active={viewMode === 'comparison'}
              onClick={() => setViewMode('comparison')}
              icon={<BarChart3 className="h-4 w-4" />}
              label="Évolution SERP"
              description="Comparaison entre périodes"
            />
            <ViewTab
              active={viewMode === 'volatility'}
              onClick={() => setViewMode('volatility')}
              icon={<Zap className="h-4 w-4" />}
              label="Analyse de volatilité"
              description="Tendances et stabilité"
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
        </CardContent>
      </Card>

      {/* Vue Comparaison */}
      {viewMode === 'comparison' && (
        <ComparisonView
          comparison={comparison}
          loading={loadingComparison}
          snapshots={analytics.snapshots}
          selectedSnapshot1={selectedSnapshot1}
          selectedSnapshot2={selectedSnapshot2}
          onSelectSnapshot1={setSelectedSnapshot1}
          onSelectSnapshot2={setSelectedSnapshot2}
          onCompare={handleCustomComparison}
        />
      )}

      {/* Vue Volatilité */}
      {viewMode === 'volatility' && (
        <VolatilityView
          volatilityAnalysis={volatilityAnalysis}
          loading={loadingVolatility}
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
    blue: 'bg-primary/10 text-primary border-primary/20',
    green: 'bg-primary/10 text-primary border-primary/20',
    orange: 'bg-accent/10 text-accent border-accent/20',
    purple: 'bg-primary/10 text-primary border-primary/20',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="dashboard-body-sm font-medium">{label}</p>
            <p className="dashboard-heading-1 mt-2">{value}</p>
            {subtitle && <p className="dashboard-body-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`rounded-lg border p-3 ${colorClasses[color]}`}>{icon}</div>
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
  description,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  description?: string
}) {
  return (
    <Button
      onClick={onClick}
      color={active ? 'dark/light' : 'light'}
      className={`flex h-auto flex-col items-start gap-1 px-4 py-3 text-left ${
        active
          ? 'border border-mist-100 bg-mist-600 text-white hover:cursor-pointer'
          : 'hover:text-accent-foreground border border-mist-100 hover:cursor-pointer hover:bg-mist-500'
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="dashboard-heading-4">{label}</span>
      </div>
      {description && (
        <span className={`dashboard-body-sm ${active ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {description}
        </span>
      )}
    </Button>
  )
}

function ComparisonView({
  comparison,
  loading,
  snapshots,
  selectedSnapshot1,
  selectedSnapshot2,
  onSelectSnapshot1,
  onSelectSnapshot2,
  onCompare,
}: {
  comparison: SERPComparison | null
  loading: boolean
  snapshots: HistoricalSERPSnapshot[]
  selectedSnapshot1: string | null
  selectedSnapshot2: string | null
  onSelectSnapshot1: (datetime: string) => void
  onSelectSnapshot2: (datetime: string) => void
  onCompare: () => void
}) {
  if (snapshots.length < 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="text-muted-foreground mx-auto h-12 w-12" />
          <p className="dashboard-heading-4 mt-4">Au moins 2 snapshots nécessaires pour la comparaison</p>
          <p className="dashboard-body-sm text-muted-foreground mt-2">
            Actuellement : {snapshots.length} snapshot{snapshots.length > 1 ? 's' : ''} disponible
            {snapshots.length > 1 ? 's' : ''}
          </p>
          <p className="dashboard-body-sm text-muted-foreground mt-2">
            Essayez d&apos;élargir votre plage de dates pour obtenir plus de données historiques
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="dashboard-body-sm ml-3">Comparaison en cours...</span>
        </CardContent>
      </Card>
    )
  }

  if (!comparison) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="text-muted-foreground mx-auto h-12 w-12" />
          <p className="dashboard-body-sm mt-4">Impossible de charger la comparaison</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur de snapshots personnalisé */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="dashboard-heading-4 flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Comparaison personnalisée
          </CardTitle>
          <CardDescription>
            Sélectionnez deux périodes à comparer pour analyser l&apos;évolution de la SERP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="dashboard-body-sm mb-2 block font-semibold">Période 1 (avant)</label>
              <Select value={selectedSnapshot1 || ''} onValueChange={onSelectSnapshot1}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-mist-600">
                  {snapshots.map((snapshot) => (
                    <SelectItem
                      key={snapshot.datetime}
                      value={snapshot.datetime}
                      className="hover:cursor-pointer hover:bg-mist-500"
                    >
                      {new Date(snapshot.datetime).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="dashboard-body-sm mb-2 block font-semibold">Période 2 (après)</label>
              <Select value={selectedSnapshot2 || ''} onValueChange={onSelectSnapshot2}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-mist-600">
                  {snapshots.map((snapshot) => (
                    <SelectItem
                      key={snapshot.datetime}
                      value={snapshot.datetime}
                      className="hover:cursor-pointer hover:bg-mist-500"
                    >
                      {new Date(snapshot.datetime).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={onCompare}
                disabled={!selectedSnapshot1 || !selectedSnapshot2}
                className="w-full bg-mist-100 text-black hover:cursor-pointer hover:bg-mist-200"
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                Comparer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* En-tête de comparaison avec contexte SEO */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="dashboard-heading-3">Analyse comparative des SERP</CardTitle>
              <p className="dashboard-body-sm text-muted-foreground mt-1">
                Comparaison entre le{' '}
                <span className="text-foreground font-semibold">
                  {new Date(comparison.date1).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>{' '}
                et le{' '}
                <span className="text-foreground font-semibold">
                  {new Date(comparison.date2).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
              <p className="dashboard-body-sm text-muted-foreground mt-2">
                Analyse des changements de positions, nouveaux entrants et domaines sortis du top 100
              </p>
            </div>
            <Card className="bg-card">
              <CardContent className="p-4 text-center">
                <div className="text-primary text-3xl font-bold">{(comparison.volatilityScore * 100).toFixed(1)}%</div>
                <div className="dashboard-body-sm font-medium">Taux de volatilité</div>
                <div className="dashboard-body-sm text-muted-foreground mt-1">
                  {comparison.volatilityScore < 0.3
                    ? 'SERP stable'
                    : comparison.volatilityScore < 0.6
                      ? 'SERP modérée'
                      : 'SERP très volatile'}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques SEO détaillées */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 rounded-lg p-3">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <div>
                  <div className="text-primary text-3xl font-bold">{comparison.newDomains.length}</div>
                  <div className="dashboard-body-sm mt-1 font-semibold">Nouveaux entrants</div>
                  <div className="dashboard-text-xs text-muted-foreground mt-1">Domaines apparus dans le top 100</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-destructive/20 rounded-lg p-3">
                  <TrendingDown className="text-destructive h-6 w-6" />
                </div>
                <div>
                  <div className="text-destructive text-3xl font-bold">{comparison.lostDomains.length}</div>
                  <div className="dashboard-body-sm mt-1 font-semibold">Domaines sortis</div>
                  <div className="dashboard-text-xs text-muted-foreground mt-1">Domaines disparus du top 100</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 rounded-lg p-3">
                  <Activity className="text-primary h-6 w-6" />
                </div>
                <div>
                  <div className="text-primary text-3xl font-bold">
                    {comparison.positionChanges.filter((c) => c.change !== 0).length}
                  </div>
                  <div className="dashboard-body-sm mt-1 font-semibold">Changements de position</div>
                  <div className="dashboard-text-xs text-muted-foreground mt-1">
                    Domaines ayant bougé dans le classement
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vue organisée par sections pour consultant SEO */}
      <div className="space-y-6">
        {/* Section 1: Top 10 - Les positions les plus importantes */}
        {comparison.positionChanges.filter((c) => c.newPosition <= 10 && c.change !== 0).length > 0 && (
          <Card className="border-primary/30 bg-primary/5 overflow-hidden">
            <CardHeader className="border-primary/20 bg-primary/10 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="dashboard-heading-4">Top 10 - Positions stratégiques</CardTitle>
                  <CardDescription className="dashboard-body-sm mt-1">
                    Évolution des domaines dans les 10 premières positions (zones de forte visibilité)
                  </CardDescription>
                </div>
                <Card className="bg-card">
                  <CardContent className="px-4 py-2">
                    <div className="text-primary text-2xl font-bold">
                      {comparison.positionChanges.filter((c) => c.newPosition <= 10 && c.change !== 0).length}
                    </div>
                    <div className="dashboard-body-sm">mouvements</div>
                  </CardContent>
                </Card>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Position finale
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Domaine
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-center font-semibold tracking-wider uppercase">
                      Position initiale
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-center font-semibold tracking-wider uppercase">
                      Évolution
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Page classée
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparison.positionChanges
                    .filter((c) => c.newPosition <= 10 && c.change !== 0)
                    .sort((a, b) => a.newPosition - b.newPosition)
                    .map((change, idx) => (
                      <tr key={`top10-${idx}`} className="hover:bg-primary/5">
                        <td className="px-6 py-4">
                          <Badge
                            color={change.newPosition <= 3 ? 'green' : change.newPosition <= 10 ? 'blue' : 'zinc'}
                            className="h-8 w-8 items-center justify-center rounded-lg font-bold"
                          >
                            {change.newPosition}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="dashboard-body font-semibold">{change.domain}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="dashboard-body-sm font-medium">#{change.oldPosition}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {change.change > 0 ? (
                              <Badge color="green" className="flex items-center gap-1 rounded-full px-3 py-1">
                                <ArrowUp className="h-4 w-4" />
                                <span className="font-bold">+{change.change}</span>
                                <span className="text-xs">places</span>
                              </Badge>
                            ) : (
                              <Badge color="red" className="flex items-center gap-1 rounded-full px-3 py-1">
                                <ArrowDown className="h-4 w-4" />
                                <span className="font-bold">{Math.abs(change.change)}</span>
                                <span className="text-xs">places</span>
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="max-w-md px-6 py-4">
                          <div className="dashboard-body-sm truncate">{change.title}</div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Section 2: Nouveaux entrants - Triés par position */}
        {comparison.newDomains.length > 0 && (
          <Card className="border-primary/30 bg-primary/5 overflow-hidden">
            <CardHeader className="border-primary/20 bg-primary/10 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="dashboard-heading-4">Nouveaux entrants dans le top 100</CardTitle>
                  <CardDescription className="dashboard-body-sm mt-1">
                    Domaines qui sont apparus dans les résultats de recherche (triés par position finale)
                  </CardDescription>
                </div>
                <Card className="bg-card">
                  <CardContent className="px-4 py-2">
                    <div className="text-primary text-2xl font-bold">{comparison.newDomains.length}</div>
                    <div className="dashboard-body-sm">nouveaux</div>
                  </CardContent>
                </Card>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Position
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Domaine
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Page classée
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...comparison.newDomains]
                    .sort((a, b) => a.position - b.position)
                    .map((item, idx) => (
                      <tr key={`new-${idx}`} className="hover:bg-primary/5">
                        <td className="px-6 py-4">
                          <Badge
                            color={item.position <= 3 ? 'green' : item.position <= 10 ? 'blue' : 'zinc'}
                            className="h-8 w-8 items-center justify-center rounded-lg font-bold"
                          >
                            {item.position}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="dashboard-body font-semibold">{item.domain}</span>
                            <Badge color="green" className="text-xs font-semibold">
                              NOUVEAU
                            </Badge>
                          </div>
                        </td>
                        <td className="max-w-md px-6 py-4">
                          <div className="dashboard-body-sm truncate">{item.title}</div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Section 3: Principaux mouvements (hors top 10) - Triés par amplitude */}
        {comparison.positionChanges.filter((c) => c.newPosition > 10 && c.change !== 0).length > 0 && (
          <Card className="border-primary/30 bg-primary/5 overflow-hidden">
            <CardHeader className="border-primary/20 bg-primary/10 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="dashboard-heading-4">Principaux mouvements (positions 11-100)</CardTitle>
                  <CardDescription className="dashboard-body-sm mt-1">
                    Domaines ayant le plus bougé, triés par amplitude de changement
                  </CardDescription>
                </div>
                <Card className="bg-card">
                  <CardContent className="px-4 py-2">
                    <div className="text-primary text-2xl font-bold">
                      {comparison.positionChanges.filter((c) => c.newPosition > 10 && c.change !== 0).length}
                    </div>
                    <div className="dashboard-body-sm">mouvements</div>
                  </CardContent>
                </Card>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Évolution
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Domaine
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-center font-semibold tracking-wider uppercase">
                      Avant
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-center font-semibold tracking-wider uppercase">
                      Après
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
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
                      <tr key={`move-${idx}`} className="hover:bg-primary/5">
                        <td className="px-6 py-4">
                          {change.change > 0 ? (
                            <Badge color="green" className="flex items-center gap-1 rounded-full px-3 py-1">
                              <ArrowUp className="h-4 w-4" />
                              <span className="font-bold">+{change.change}</span>
                              <span className="text-xs">places</span>
                            </Badge>
                          ) : (
                            <Badge color="red" className="flex items-center gap-1 rounded-full px-3 py-1">
                              <ArrowDown className="h-4 w-4" />
                              <span className="font-bold">{change.change}</span>
                              <span className="text-xs">places</span>
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="dashboard-body font-semibold">{change.domain}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="dashboard-body-sm font-medium">#{change.oldPosition}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="dashboard-body font-medium">#{change.newPosition}</span>
                        </td>
                        <td className="max-w-md px-6 py-4">
                          <div className="dashboard-body-sm truncate">{change.title}</div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Section 4: Domaines sortis - Triés par ancienne position */}
        {comparison.lostDomains.length > 0 && (
          <Card className="border-destructive/30 bg-destructive/5 overflow-hidden">
            <CardHeader className="border-destructive/20 bg-destructive/10 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="dashboard-heading-4">Domaines sortis du top 100</CardTitle>
                  <CardDescription className="dashboard-body-sm mt-1">
                    Domaines qui ne sont plus présents dans les résultats (triés par ancienne position)
                  </CardDescription>
                </div>
                <Card className="bg-card">
                  <CardContent className="px-4 py-2">
                    <div className="text-destructive text-2xl font-bold">{comparison.lostDomains.length}</div>
                    <div className="dashboard-body-sm">sortis</div>
                  </CardContent>
                </Card>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Ancienne position
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Domaine
                    </th>
                    <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                      Dernière page classée
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...comparison.lostDomains]
                    .sort((a, b) => a.previousPosition - b.previousPosition)
                    .map((item, idx) => (
                      <tr key={`lost-${idx}`} className="hover:bg-destructive/5">
                        <td className="px-6 py-4">
                          <Badge
                            color={item.previousPosition <= 3 ? 'red' : item.previousPosition <= 10 ? 'orange' : 'zinc'}
                            className="h-8 w-8 items-center justify-center rounded-lg font-bold"
                          >
                            {item.previousPosition}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="dashboard-body font-semibold">{item.domain}</span>
                            <Badge color="red" className="text-xs font-semibold">
                              SORTI
                            </Badge>
                          </div>
                        </td>
                        <td className="max-w-md px-6 py-4">
                          <div className="dashboard-body-sm truncate">{item.title}</div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
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
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-4">Sélectionner une période d&apos;analyse</CardTitle>
          <CardDescription>
            Choisissez une date pour voir l&apos;état détaillé de la SERP à ce moment précis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {snapshots.map((snapshot) => (
              <Button
                key={snapshot.datetime}
                onClick={() => onSelectSnapshot(snapshot.datetime)}
                className={`rounded-lg border border-2 border-mist-100 p-3 text-center transition-all hover:cursor-pointer hover:bg-mist-500 ${
                  selectedSnapshot?.datetime === snapshot.datetime
                    ? 'border-mist-100 bg-mist-600 text-white hover:cursor-pointer'
                    : 'border-mist-100 hover:border-mist-100 hover:bg-mist-500'
                }`}
              >
                <div className="dashboard-body-sm font-medium">
                  {new Date(snapshot.datetime).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </div>
                <div className="dashboard-body-sm mt-1">{snapshot.items_count} résultats</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Affichage du snapshot sélectionné */}
      {selectedSnapshot && (
        <Card>
          <CardHeader className="bg-muted">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="dashboard-heading-4">
                  SERP du{' '}
                  {new Date(selectedSnapshot.datetime).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </CardTitle>
                <CardDescription className="dashboard-body-sm mt-1">
                  {selectedSnapshot.items.filter(isOrganicItem).length} résultat
                  {selectedSnapshot.items.filter(isOrganicItem).length > 1 ? 's' : ''} organique
                  {selectedSnapshot.items.filter(isOrganicItem).length > 1 ? 's' : ''} dans le top 100
                </CardDescription>
              </div>
              <Card className="bg-card">
                <CardContent className="px-4 py-2">
                  <div className="dashboard-body-sm font-semibold">{selectedSnapshot.items_count} éléments SERP</div>
                  <div className="dashboard-body-sm text-muted-foreground">Tous types confondus</div>
                </CardContent>
              </Card>
            </div>
          </CardHeader>
          <CardContent className="divide-border divide-y">
            {selectedSnapshot.items
              .filter(isOrganicItem)
              .slice(0, 20)
              .map((item, idx) => (
                <div key={idx} className="hover:bg-muted/50 p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 font-bold ${
                        item.rank_absolute <= 3
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : item.rank_absolute <= 10
                            ? 'border-primary/20 bg-primary/5 text-primary'
                            : 'border-border bg-muted text-foreground'
                      }`}
                    >
                      {item.rank_absolute}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="dashboard-body-sm mb-1">{item.domain}</div>
                      <h4 className="text-primary hover:text-primary/80 mb-2 text-base font-medium">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                      </h4>
                      <div className="text-muted-foreground mb-2 truncate text-sm">{item.url}</div>
                      {item.description && <p className="dashboard-body-sm line-clamp-2">{item.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
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
  domains: Array<{
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
  }>
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
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-4">Analyse concurrentielle</CardTitle>
          <CardDescription>
            Analysez la performance et l&apos;évolution de chaque concurrent dans le temps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
            <Input
              type="text"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              placeholder="Rechercher un domaine ou concurrent..."
              className="pl-10"
            />
          </div>
          <p className="dashboard-body-sm text-muted-foreground mt-2">
            {domains.length} domaine{domains.length > 1 ? 's' : ''} trouvé
            {domains.length > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

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
  domain: {
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
  isExpanded: boolean
  onToggle: () => void
}) {
  const getTrendIcon = () => {
    if (domain.trend === 'up') return <TrendingUp className="text-primary h-5 w-5" />
    if (domain.trend === 'down') return <TrendingDown className="text-destructive h-5 w-5" />
    return <Minus className="text-muted-foreground h-5 w-5" />
  }

  const getAvgPositionColor = () => {
    if (domain.avgPosition <= 3) return 'text-primary'
    if (domain.avgPosition <= 10) return 'text-primary'
    if (domain.avgPosition <= 20) return 'text-accent'
    return 'text-muted-foreground'
  }

  return (
    <Card className="overflow-hidden hover:shadow-md">
      <button onClick={onToggle} className="hover:bg-muted/50 w-full p-6 text-left">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-4">
            {isExpanded ? (
              <ChevronDown className="text-muted-foreground h-5 w-5" />
            ) : (
              <ChevronRight className="text-muted-foreground h-5 w-5" />
            )}
            <div className="flex-1">
              <h4 className="dashboard-heading-4">{domain.domain}</h4>
              <p className="dashboard-body-sm mt-1">{domain.appearances} apparitions</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getAvgPositionColor()}`}>{domain.avgPosition.toFixed(1)}</div>
              <div className="dashboard-body-sm">Moy</div>
            </div>
            <div className="text-center">
              <div className="text-primary text-xl font-bold">{domain.bestPosition}</div>
              <div className="dashboard-body-sm">Best</div>
            </div>
            <div className="text-center">{getTrendIcon()}</div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <CardContent className="bg-muted border-t p-6">
          <h5 className="dashboard-heading-4 mb-4">Historique des positions</h5>
          <div className="space-y-2">
            {domain.history.map((entry, idx) => (
              <Card key={idx} className="bg-card">
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex-1">
                    <div className="dashboard-body-sm font-medium">{new Date(entry.date).toLocaleString('fr-FR')}</div>
                    {entry.title && (
                      <div className="dashboard-body-sm text-muted-foreground mt-1 truncate">{entry.title}</div>
                    )}
                  </div>
                  <div className="ml-4">
                    {entry.position ? (
                      <Badge color="blue" className="h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
                        {entry.position}
                      </Badge>
                    ) : (
                      <div className="dashboard-body-sm text-muted-foreground">Absent</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function VolatilityView({
  volatilityAnalysis,
  loading,
  snapshots,
}: {
  volatilityAnalysis: {
    averageVolatility: number
    maxVolatility: number
    minVolatility: number
    trend: 'increasing' | 'decreasing' | 'stable'
    comparisons?: SERPComparison[]
  } | null
  loading: boolean
  snapshots: HistoricalSERPSnapshot[]
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="dashboard-body-sm ml-3">Analyse de volatilité en cours...</span>
        </CardContent>
      </Card>
    )
  }

  if (!volatilityAnalysis || snapshots.length < 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="text-muted-foreground mx-auto h-12 w-12" />
          <p className="dashboard-heading-4 mt-4">Analyse de volatilité non disponible</p>
          <p className="dashboard-body-sm text-muted-foreground mt-2">
            Au moins 2 snapshots sont nécessaires pour analyser la volatilité
          </p>
        </CardContent>
      </Card>
    )
  }

  const volatilityLevel =
    volatilityAnalysis.averageVolatility < 0.3
      ? { label: 'Faible', color: 'primary', description: 'SERP très stable' }
      : volatilityAnalysis.averageVolatility < 0.6
        ? { label: 'Modérée', color: 'accent', description: 'SERP moyennement volatile' }
        : { label: 'Élevée', color: 'destructive', description: 'SERP très volatile' }

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble de la volatilité */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <CardTitle className="dashboard-heading-3 flex items-center gap-2">
                <Zap className="text-primary h-6 w-6" />
                Analyse de volatilité globale
              </CardTitle>
              <p className="dashboard-body-sm text-muted-foreground mt-2">
                Analyse de la stabilité de la SERP sur {snapshots.length} périodes
              </p>
              <p className="dashboard-body-sm text-muted-foreground mt-1">
                Du{' '}
                {new Date(snapshots[0].datetime).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                au{' '}
                {new Date(snapshots[snapshots.length - 1].datetime).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Card className="bg-card">
              <CardContent className="p-6 text-center">
                <div
                  className={`text-4xl font-bold ${
                    volatilityLevel.color === 'primary'
                      ? 'text-primary'
                      : volatilityLevel.color === 'accent'
                        ? 'text-accent'
                        : 'text-destructive'
                  }`}
                >
                  {(volatilityAnalysis.averageVolatility * 100).toFixed(1)}%
                </div>
                <div className="dashboard-body-sm mt-2 font-semibold">Volatilité {volatilityLevel.label}</div>
                <div className="dashboard-body-sm text-muted-foreground mt-1">{volatilityLevel.description}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Métriques de volatilité */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="dashboard-heading-4">Volatilité moyenne</h4>
              <Activity className="text-primary h-5 w-5" />
            </div>
            <div className="text-primary text-3xl font-bold">
              {(volatilityAnalysis.averageVolatility * 100).toFixed(1)}%
            </div>
            <p className="dashboard-body-sm text-muted-foreground mt-2">
              Niveau moyen de changement entre les périodes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="dashboard-heading-4">Volatilité maximale</h4>
              <TrendingUp className="text-destructive h-5 w-5" />
            </div>
            <div className="text-destructive text-3xl font-bold">
              {(volatilityAnalysis.maxVolatility * 100).toFixed(1)}%
            </div>
            <p className="dashboard-body-sm text-muted-foreground mt-2">
              Plus grand changement observé entre deux périodes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="dashboard-heading-4">Volatilité minimale</h4>
              <TrendingDown className="text-primary h-5 w-5" />
            </div>
            <div className="text-primary text-3xl font-bold">
              {(volatilityAnalysis.minVolatility * 100).toFixed(1)}%
            </div>
            <p className="dashboard-body-sm text-muted-foreground mt-2">
              Plus petit changement observé entre deux périodes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tendance de volatilité */}
      <Card
        className={`overflow-hidden ${
          volatilityAnalysis.trend === 'increasing'
            ? 'border-destructive/30 bg-destructive/5'
            : volatilityAnalysis.trend === 'decreasing'
              ? 'border-primary/30 bg-primary/5'
              : 'border-primary/20 bg-primary/5'
        }`}
      >
        <CardHeader
          className={`border-b ${
            volatilityAnalysis.trend === 'increasing'
              ? 'border-destructive/20 bg-destructive/10'
              : volatilityAnalysis.trend === 'decreasing'
                ? 'border-primary/20 bg-primary/10'
                : 'border-primary/20 bg-primary/10'
          }`}
        >
          <div className="flex items-center gap-3">
            {volatilityAnalysis.trend === 'increasing' ? (
              <TrendingUp className="text-destructive h-8 w-8" />
            ) : volatilityAnalysis.trend === 'decreasing' ? (
              <TrendingDown className="text-primary h-8 w-8" />
            ) : (
              <Minus className="text-primary h-8 w-8" />
            )}
            <div>
              <h4 className="dashboard-heading-3">
                Tendance :{' '}
                {volatilityAnalysis.trend === 'increasing'
                  ? 'Volatilité croissante'
                  : volatilityAnalysis.trend === 'decreasing'
                    ? 'Volatilité décroissante'
                    : 'Volatilité stable'}
              </h4>
              <p className="dashboard-body-sm mt-1">
                {volatilityAnalysis.trend === 'increasing'
                  ? 'La SERP devient de plus en plus instable au fil du temps'
                  : volatilityAnalysis.trend === 'decreasing'
                    ? 'La SERP se stabilise progressivement'
                    : 'La SERP maintient un niveau de volatilité constant'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="dashboard-body">
            {volatilityAnalysis.trend === 'increasing' && (
              <>
                <strong>Recommandation :</strong> La SERP est en phase d&apos;instabilité. C&apos;est le moment idéal
                pour optimiser votre contenu et tenter de gagner des positions. Les algorithmes de Google sont en train
                de réévaluer les résultats.
              </>
            )}
            {volatilityAnalysis.trend === 'decreasing' && (
              <>
                <strong>Recommandation :</strong> La SERP se stabilise. Les positions actuelles ont tendance à se figer.
                Concentrez-vous sur la consolidation de vos positions et l&apos;amélioration continue de votre contenu.
              </>
            )}
            {volatilityAnalysis.trend === 'stable' && (
              <>
                <strong>Recommandation :</strong> La SERP maintient un niveau de volatilité constant. Surveillez
                régulièrement vos positions et soyez prêt à réagir rapidement aux changements.
              </>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Historique des comparaisons */}
      {volatilityAnalysis.comparisons && volatilityAnalysis.comparisons.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted">
            <CardTitle className="dashboard-heading-4">Historique des changements</CardTitle>
            <CardDescription>Évolution de la volatilité entre chaque période consécutive</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="dashboard-body-sm border-border border-b px-6 py-3 text-left font-semibold tracking-wider uppercase">
                    Période
                  </th>
                  <th className="dashboard-body-sm border-border border-b px-6 py-3 text-center font-semibold tracking-wider uppercase">
                    Volatilité
                  </th>
                  <th className="dashboard-body-sm border-border border-b px-6 py-3 text-center font-semibold tracking-wider uppercase">
                    Nouveaux
                  </th>
                  <th className="dashboard-body-sm border-border border-b px-6 py-3 text-center font-semibold tracking-wider uppercase">
                    Sortis
                  </th>
                  <th className="dashboard-body-sm border-border border-b px-6 py-3 text-center font-semibold tracking-wider uppercase">
                    Changements
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {volatilityAnalysis.comparisons.map((comp, idx) => {
                  const volatilityPercent = (comp.volatilityScore * 100).toFixed(1)
                  const isHighVolatility = comp.volatilityScore >= 0.6
                  const isMediumVolatility = comp.volatilityScore >= 0.3 && comp.volatilityScore < 0.6

                  return (
                    <tr key={idx} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="dashboard-body-sm font-medium">
                          {new Date(comp.date1).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                          {' → '}
                          {new Date(comp.date2).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge
                          color={isHighVolatility ? 'red' : isMediumVolatility ? 'yellow' : 'green'}
                          className="rounded-full px-3 py-1 text-sm font-bold"
                        >
                          {volatilityPercent}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="dashboard-body text-primary font-semibold">+{comp.newDomains.length}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="dashboard-body text-destructive font-semibold">
                          -{comp.lostDomains.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="dashboard-body text-primary font-semibold">
                          {comp.positionChanges.filter((c) => c.change !== 0).length}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Graphique simple de volatilité (représentation textuelle) */}
      {volatilityAnalysis.comparisons && volatilityAnalysis.comparisons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="dashboard-heading-4">Graphique de volatilité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {volatilityAnalysis.comparisons.map((comp, idx) => {
                const width = Math.max(5, comp.volatilityScore * 100)
                const isHighVolatility = comp.volatilityScore >= 0.6
                const isMediumVolatility = comp.volatilityScore >= 0.3 && comp.volatilityScore < 0.6

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="dashboard-body-sm w-24 shrink-0 text-right">
                      {new Date(comp.date2).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`h-8 rounded transition-all ${
                          isHighVolatility ? 'bg-destructive' : isMediumVolatility ? 'bg-accent' : 'bg-primary'
                        }`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <div className="dashboard-body-sm w-16 shrink-0 font-semibold">
                      {(comp.volatilityScore * 100).toFixed(1)}%
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="bg-primary h-4 w-4 rounded" />
                <span className="dashboard-body-sm">Faible (&lt;30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-accent h-4 w-4 rounded" />
                <span className="dashboard-body-sm">Modérée (30-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-destructive h-4 w-4 rounded" />
                <span className="dashboard-body-sm">Élevée (&gt;60%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function FeaturesView({
  analytics,
}: {
  analytics: {
    snapshots: HistoricalSERPSnapshot[]
    domains: Array<{
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
    }>
    features: Array<[string, number]>
    totalSnapshots: number
  }
}) {
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
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-4">Rich Results &amp; Features SERP</CardTitle>
          <CardDescription>
            Analyse des éléments enrichis présents dans les résultats de recherche Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="dashboard-body-sm text-muted-foreground">
            {analytics.features.length} type
            {analytics.features.length > 1 ? 's' : ''} de feature
            {analytics.features.length > 1 ? 's' : ''} détecté
            {analytics.features.length > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {analytics.features.map(([type, count]) => (
          <Card key={type} className="hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="dashboard-heading-4">{getFeatureLabel(type)}</h4>
                  <p className="dashboard-body-sm text-muted-foreground mt-1">Feature SERP</p>
                </div>
                <div className="text-right">
                  <div className="text-primary text-2xl font-bold">{count}</div>
                  <div className="dashboard-body-sm text-muted-foreground">détections</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import type { DomainIntersectionItem, DomainIntersectionResponse, DomainIntersectionStats } from './action'
import { calculateIntersectionStats } from './utils'

interface DomainIntersectionAnalyzerProps {
  data: DomainIntersectionResponse
}

export default function DomainIntersectionAnalyzer({ data }: DomainIntersectionAnalyzerProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'all' | 'common'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [minTargets, setMinTargets] = useState(2)
  const [sortBy, setSortBy] = useState<'backlinks' | 'targets' | 'domains'>('backlinks')
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
      filtered = filtered.filter((item) => item.referring_domain?.toLowerCase().includes(searchQuery.toLowerCase()))
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
        aVal = Object.values(a.domain_intersection).reduce((sum, t) => sum + (t.backlinks || 0), 0)
        bVal = Object.values(b.domain_intersection).reduce((sum, t) => sum + (t.backlinks || 0), 0)
      } else if (sortBy === 'targets') {
        aVal = Object.keys(a.domain_intersection).length
        bVal = Object.keys(b.domain_intersection).length
      } else if (sortBy === 'domains') {
        aVal = Object.values(a.domain_intersection).reduce((sum, t) => sum + (t.referring_domains || 0), 0)
        bVal = Object.values(b.domain_intersection).reduce((sum, t) => sum + (t.referring_domains || 0), 0)
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
      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          <div className="flex w-full flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                viewMode === 'overview'
                  ? 'border-mist-400 bg-mist-100 text-mist-600 shadow-md'
                  : 'border-muted bg-transparent'
              } `}
            >
              <BarChart3 className="h-4 w-4" />
              Vue d&apos;ensemble
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                viewMode === 'all'
                  ? 'border-mist-400 bg-mist-100 text-mist-700 shadow-md'
                  : 'border-muted bg-transparent'
              } `}
            >
              <Globe className="h-4 w-4" />
              Tous les domaines
            </button>
            <button
              type="button"
              onClick={() => setViewMode('common')}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                viewMode === 'common'
                  ? 'border-mist-400 bg-mist-100 text-mist-700 shadow-md'
                  : 'border-muted bg-transparent'
              } `}
            >
              <GitMerge className="h-4 w-4" />
              {`Domaines communs (${commonDomains.length})`}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Vue Overview */}
      {viewMode === 'overview' && (
        <OverviewView stats={stats} targets={data.targets} commonCount={commonDomains.length} />
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
    blue: 'bg-primary/10 text-primary border-primary/20',
    green: 'bg-primary/10 text-primary border-primary/20',
    orange: 'bg-primary/10 text-primary border-primary/20',
    purple: 'bg-primary/10 text-primary border-primary/20',
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
  commonCount,
}: {
  stats: DomainIntersectionStats
  targets: Record<string, string>
  commonCount: number
}) {
  return (
    <div className="space-y-6">
      {/* Targets analysées */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="text-primary h-5 w-5" />
            <CardTitle className="dashboard-heading-3">Domaines Cibles Analysés</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(targets).map(([id, domain]) => (
              <Card key={id} className="border-primary/20 bg-primary/5">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                    {id}
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={`https://${domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 flex items-center gap-1 font-semibold hover:underline"
                    >
                      <span className="truncate">{domain}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Matrice d'intersection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GitMerge className="text-primary h-5 w-5" />
            <CardTitle className="dashboard-heading-3">Matrice d&apos;Intersection</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.intersectionMatrix)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([targetsCount, domainsCount]) => {
                const percentage = (domainsCount / stats.totalReferringDomains) * 100
                return (
                  <div key={targetsCount} className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
                      {targetsCount}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="dashboard-body-sm">
                          {domainsCount} domaine{domainsCount > 1 ? 's' : ''} pointe
                          {domainsCount > 1 ? 'nt' : ''} vers {targetsCount} target
                          {Number(targetsCount) > 1 ? 's' : ''}
                        </span>
                        <span className="dashboard-body-sm text-primary font-semibold">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                        <div className="bg-primary h-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                    <div className="dashboard-heading-2 text-primary">{domainsCount}</div>
                  </div>
                )
              })}
          </div>
          {commonCount > 0 && (
            <Card className="border-primary/20 bg-primary/5 mt-6">
              <CardContent className="flex items-center gap-3 p-4">
                <Award className="text-primary h-6 w-6" />
                <div>
                  <p className="dashboard-body-sm font-semibold">
                    {commonCount} domaine{commonCount > 1 ? 's' : ''} commun
                    {commonCount > 1 ? 's' : ''}
                  </p>
                  <p className="dashboard-text-xs text-muted-foreground">
                    Ces domaines pointent vers TOUTES vos targets ({stats.targetCount}) - opportunités premium !
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Top domaines référents */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            <CardTitle className="dashboard-heading-3">Top 10 Domaines Référents</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.topReferringDomains.map((item, idx) => (
              <Card key={idx} className="bg-muted/30">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                      {idx + 1}
                    </div>
                    <a
                      href={`https://${item.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary flex items-center gap-1 font-medium hover:underline"
                    >
                      {item.domain}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="dashboard-text-xs text-muted-foreground">Backlinks</div>
                      <div className="dashboard-heading-4 text-primary">{item.totalBacklinks.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="dashboard-text-xs text-muted-foreground">Targets</div>
                      <div className="dashboard-heading-4 text-primary">
                        {item.targetsCount}/{stats.targetCount}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top TLDs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="text-primary h-5 w-5" />
            <CardTitle className="dashboard-heading-3">Top Extensions (TLD)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {stats.topTLDs.map((item, idx) => (
              <Card key={idx} className="border-border bg-card text-center">
                <CardContent className="p-4">
                  <div className="dashboard-heading-3 text-primary">.{item.tld}</div>
                  <div className="dashboard-body-sm text-muted-foreground mt-1">{item.count} domaines</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
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
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Recherche */}
            <div>
              <label className="dashboard-body-sm mb-2 block font-semibold">Rechercher</label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom de domaine..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tri */}
            <div>
              <span className="dashboard-body-sm mb-2 block font-semibold">Trier par</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSortBy('backlinks')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                  variant="outline"
                  className={`flex flex-1 items-center justify-center gap-1 transition-colors ${
                    sortBy === 'backlinks' ? 'border-mist-400 bg-mist-100 text-mist-600' : ''
                  }`}
                >
                  Backlinks <ArrowUpDown className="h-3 w-3" />
                </Button>
                <Button
                  onClick={() => {
                    setSortBy('targets')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                  variant="outline"
                  className={`flex flex-1 items-center justify-center gap-1 transition-colors ${
                    sortBy === 'targets' ? 'border-mist-400 bg-mist-100 text-mist-600' : ''
                  }`}
                >
                  Targets <ArrowUpDown className="h-3 w-3" />
                </Button>
                <Button
                  onClick={() => {
                    setSortBy('domains')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                  variant="outline"
                  className={`flex flex-1 items-center justify-center gap-1 transition-colors ${
                    sortBy === 'domains' ? 'border-mist-400 bg-mist-100 text-mist-600' : ''
                  }`}
                >
                  Domaines <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-3">
            {domains.length} domaine{domains.length > 1 ? 's' : ''} référent
            {domains.length > 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-border divide-y">
          {domains.slice(0, 50).map((item, idx) => (
            <DomainIntersectionCard key={idx} item={item} targets={targets} />
          ))}
        </CardContent>
      </Card>
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
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-6">
          <Zap className="text-primary h-6 w-6 shrink-0" />
          <div>
            <h3 className="dashboard-heading-4">Opportunités de Backlinks Communes</h3>
            <p className="dashboard-body-sm text-muted-foreground mt-1">
              Ces domaines pointent vers plusieurs de vos concurrents. Contactez-les pour obtenir un backlink vers votre
              site !
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Recherche */}
            <div>
              <label className="dashboard-body-sm mb-2 block font-semibold">Rechercher</label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom de domaine..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Minimum targets */}
            <div>
              <label className="dashboard-body-sm mb-2 block font-semibold">Minimum de targets ciblées</label>
              <Select value={minTargets.toString()} onValueChange={(val) => setMinTargets(Number(val))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-mist-600">
                  {Array.from({ length: targetCount - 1 }, (_, i) => i + 2).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} targets ou plus
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tri */}
          <div className="mt-4">
            <span className="dashboard-body-sm mb-2 block font-semibold">Trier par</span>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSortBy('backlinks')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
                variant={sortBy === 'backlinks' ? 'default' : 'outline'}
                className={`flex flex-1 items-center justify-center gap-1 transition-colors ${
                  sortBy === 'backlinks' ? 'border-mist-400 bg-mist-100 text-mist-600' : ''
                }`}
              >
                Backlinks <ArrowUpDown className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => {
                  setSortBy('targets')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
                variant={sortBy === 'targets' ? 'default' : 'outline'}
                className={`flex flex-1 items-center justify-center gap-1 transition-colors ${
                  sortBy === 'targets' ? 'border-mist-400 bg-mist-100 text-mist-600' : ''
                }`}
              >
                Targets <ArrowUpDown className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => {
                  setSortBy('domains')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
                variant={sortBy === 'domains' ? 'default' : 'outline'}
                className={`flex flex-1 items-center justify-center gap-1 transition-colors ${
                  sortBy === 'domains' ? 'border-mist-400 bg-mist-100 text-mist-600' : ''
                }`}
              >
                Domaines <ArrowUpDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-3">
            {domains.length} domaine{domains.length > 1 ? 's' : ''} commun
            {domains.length > 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <Filter className="text-muted-foreground h-16 w-16" />
              <h3 className="dashboard-heading-3 mt-4">Aucun domaine trouvé</h3>
              <p className="dashboard-body-sm text-muted-foreground mt-2">
                Essayez de réduire le nombre minimum de targets
              </p>
            </div>
          ) : (
            <div className="divide-border divide-y">
              {domains.slice(0, 50).map((item, idx) => (
                <DomainIntersectionCard key={idx} item={item} targets={targets} highlighted />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
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
  const totalBacklinks = Object.values(item.domain_intersection).reduce((sum, t) => sum + (t.backlinks || 0), 0)
  const totalReferringDomains = Object.values(item.domain_intersection).reduce(
    (sum, t) => sum + (t.referring_domains || 0),
    0,
  )

  return (
    <Card className={`hover:bg-accent ${highlighted ? 'bg-primary/5' : ''}`}>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          {/* Domain */}
          <div className="flex items-center gap-3">
            <Globe className="text-muted-foreground h-5 w-5" />
            <a
              href={`https://${item.referring_domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-lg font-semibold hover:underline"
            >
              {item.referring_domain}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-semibold">
              {targetsCount}/{Object.keys(targets).length} targets
            </span>
            {targetsCount === Object.keys(targets).length && (
              <span className="bg-primary/20 text-primary rounded-full px-3 py-1 text-sm font-semibold">⭐ TOUTES</span>
            )}
          </div>
        </div>

        {/* Stats globales */}
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          <Card className="bg-primary/5">
            <CardContent className="p-3">
              <div className="dashboard-text-xs text-primary font-medium">Total Backlinks</div>
              <div className="dashboard-heading-3 text-primary mt-1">{totalBacklinks.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="p-3">
              <div className="dashboard-text-xs text-primary font-medium">Domaines Référents</div>
              <div className="dashboard-heading-3 text-primary mt-1">{totalReferringDomains.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="p-3">
              <div className="dashboard-text-xs text-primary font-medium">Targets Pointées</div>
              <div className="dashboard-heading-3 text-primary mt-1">
                {targetsCount}/{Object.keys(targets).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Détail par target */}
        <div className="space-y-2">
          <div className="dashboard-body-sm font-semibold">Détail par target :</div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {Object.entries(item.domain_intersection).map(([targetId, targetData]) => (
              <Card key={targetId} className="border-border bg-card">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    {targetId}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">{targets[targetId]}</div>
                    <div className="dashboard-text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{(targetData.backlinks || 0).toLocaleString()} BL</span>
                      <span>•</span>
                      <span>{(targetData.referring_domains || 0).toLocaleString()} RD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

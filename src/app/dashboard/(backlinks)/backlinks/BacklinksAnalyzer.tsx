'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

export default function BacklinksAnalyzer({ data }: BacklinksAnalyzerProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'backlinks' | 'anchors' | 'domains'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'dofollow' | 'nofollow'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'lost'>('all')
  const [sortBy, setSortBy] = useState<'rank' | 'domain_rank' | 'spam_score'>('rank')
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
          (item.anchor && item.anchor.toLowerCase().includes(searchQuery.toLowerCase())),
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
          subtitle={`${stats.uniqueDomains} domaines uniques`}
        />
        <MetricCard
          label="Dofollow"
          value={stats.dofollowCount.toLocaleString()}
          icon={<CheckCircle className="h-5 w-5" />}
          subtitle={`${((stats.dofollowCount / stats.totalBacklinks) * 100).toFixed(0)}% du total`}
        />
        <MetricCard
          label="Domain Rank Moyen"
          value={stats.avgDomainRank.toFixed(0)}
          icon={<TrendingUp className="h-5 w-5" />}
          subtitle="Autorité des domaines"
        />
        <MetricCard
          label="Spam Score Moyen"
          value={`${stats.avgSpamScore.toFixed(0)}%`}
          icon={<Shield className="h-5 w-5" />}
          subtitle={stats.avgSpamScore > 50 ? 'Attention requise' : 'Qualité correcte'}
        />
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          <ViewTab
            active={viewMode === 'overview'}
            onClick={() => setViewMode('overview')}
            icon={<BarChart3 className="h-4 w-4 select-none hover:cursor-pointer data-[state=active]:bg-red-500" />}
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
        </CardContent>
      </Card>

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
  subtitle,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  subtitle?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-6">
        <div className="flex-1">
          <p className="dashboard-body-sm text-muted-foreground">{label}</p>
          <p className="dashboard-heading-2 mt-2">{value}</p>
          {subtitle && <p className="text-muted-foreground dashboard-text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`bg-primary/10 text-primary border-primary/20 rounded-lg border p-3`}>{icon}</div>
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
      className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-medium transition-all ${
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-md'
          : 'bg-muted/50 text-muted-foreground hover:border-primary/30 hover:bg-muted hover:text-foreground border-transparent'
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
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-3 p-6">
            <div className="bg-primary/10 rounded-lg p-3">
              <TrendingUp className="text-primary h-6 w-6" />
            </div>
            <div>
              <div className="dashboard-heading-2 text-primary">{stats.newBacklinks}</div>
              <div className="dashboard-body-sm text-muted-foreground">Nouveaux backlinks</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-6">
            <div className="bg-destructive/10 rounded-lg p-3">
              <TrendingDown className="text-destructive h-6 w-6" />
            </div>
            <div>
              <div className="dashboard-heading-2 text-destructive">{stats.lostBacklinks}</div>
              <div className="dashboard-body-sm text-muted-foreground">Backlinks perdus</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-3 p-6">
            <div className="bg-primary/10 rounded-lg p-3">
              <XCircle className="text-primary h-6 w-6" />
            </div>
            <div>
              <div className="dashboard-heading-2 text-primary">{stats.brokenBacklinks}</div>
              <div className="dashboard-body-sm text-muted-foreground">Liens cassés</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top pays */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-3">Top Pays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.topCountries.slice(0, 10).map((item, idx) => (
              <div key={idx} className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <Globe className="text-muted-foreground h-5 w-5" />
                  <span className="dashboard-body-sm font-medium">{item.country || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-muted h-2 w-32 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full"
                      style={{
                        width: `${(item.count / stats.topCountries[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="dashboard-body-sm w-12 text-right font-semibold">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top TLDs */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-3">Top TLDs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {stats.topTLDs.map((item, idx) => (
              <Card key={idx} className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 text-center">
                  <div className="dashboard-heading-3 text-primary">.{item.tld}</div>
                  <div className="dashboard-text-xs text-muted-foreground mt-1">{item.count} backlinks</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
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
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Recherche */}
            <div className="md:col-span-2">
              <label className="dashboard-body-sm mb-2 block font-semibold">Recherche</label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Domaine, URL ou anchor..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtre Type */}
            <div>
              <label className="dashboard-body-sm mb-2 block font-semibold">Type</label>
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value as 'all' | 'dofollow' | 'nofollow')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="dofollow">Dofollow</SelectItem>
                  <SelectItem value="nofollow">Nofollow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre Statut */}
            <div>
              <label className="dashboard-body-sm mb-2 block font-semibold">Statut</label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | 'new' | 'lost')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="new">Nouveaux</SelectItem>
                  <SelectItem value="lost">Perdus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tri */}
          <div className="mt-4 flex items-center gap-4">
            <span className="dashboard-body-sm font-semibold">Trier par:</span>
            <Button
              variant={sortBy === 'rank' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSortBy('rank')
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }}
            >
              Rank <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
            <Button
              variant={sortBy === 'domain_rank' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSortBy('domain_rank')
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }}
            >
              Domain Rank <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
            <Button
              variant={sortBy === 'spam_score' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSortBy('spam_score')
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }}
            >
              Spam Score <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des backlinks */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-3">
            {backlinks.length} backlink{backlinks.length > 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-border divide-y">
          {backlinks.slice(0, 50).map((backlink, idx) => (
            <BacklinkCard key={idx} backlink={backlink} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function BacklinkCard({ backlink }: { backlink: BacklinkItem }) {
  const getSpamScoreColor = (score: number): 'red' | 'orange' | 'green' => {
    if (score >= 70) return 'red'
    if (score >= 40) return 'orange'
    return 'green'
  }

  return (
    <div className="hover:bg-muted/50 p-6 transition-colors">
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div className="shrink-0">
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg font-bold">
            {backlink.rank}
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Domain */}
          <div className="mb-2 flex items-center gap-2">
            <Globe className="text-muted-foreground h-4 w-4 shrink-0" />
            <span className="dashboard-body-sm font-semibold">{backlink.domain_from}</span>
            <span className="dashboard-text-xs text-muted-foreground">(DR: {backlink.domain_from_rank})</span>
            {backlink.is_new && <Badge color="green">NEW</Badge>}
            {backlink.is_lost && <Badge color="red">LOST</Badge>}
          </div>

          {/* URL From */}
          <div className="mb-2">
            <a
              href={backlink.url_from}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 dashboard-body-sm flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="truncate">{backlink.url_from}</span>
            </a>
          </div>

          {/* Anchor */}
          {backlink.anchor && (
            <div className="bg-muted/50 mb-2 rounded-lg p-2">
              <span className="dashboard-body-sm">
                <span className="font-semibold">Anchor:</span> {backlink.anchor}
              </span>
            </div>
          )}

          {/* Metadata */}
          <div className="dashboard-text-xs flex flex-wrap items-center gap-3">
            <Badge color={backlink.dofollow ? 'green' : 'zinc'}>{backlink.dofollow ? 'Dofollow' : 'Nofollow'}</Badge>
            <Badge color={getSpamScoreColor(backlink.backlink_spam_score)}>Spam: {backlink.backlink_spam_score}%</Badge>
            <span className="text-muted-foreground">PR: {backlink.page_from_rank}</span>
            <span className="text-muted-foreground">Links: {backlink.links_count}</span>
            {backlink.page_from_language && (
              <span className="text-muted-foreground">Lang: {backlink.page_from_language}</span>
            )}
            {backlink.first_seen && (
              <span className="text-muted-foreground">
                First: {new Date(backlink.first_seen).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnchorsView({ anchors }: { anchors: Array<{ anchor: string; count: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="dashboard-heading-3">Top Anchor Texts</CardTitle>
      </CardHeader>
      <CardContent className="divide-border divide-y">
        {anchors.map((item, idx) => (
          <div key={idx} className="hover:bg-muted/50 flex items-center justify-between p-6 transition-colors">
            <div className="flex-1">
              <div className="dashboard-body-sm font-medium">{item.anchor}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-muted h-2 w-48 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full"
                  style={{
                    width: `${(item.count / anchors[0].count) * 100}%`,
                  }}
                />
              </div>
              <span className="text-primary dashboard-body-sm w-16 text-right font-bold">{item.count}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader>
        <CardTitle className="dashboard-heading-3">Domaines référents ({domainStats.length})</CardTitle>
      </CardHeader>
      <CardContent className="divide-border divide-y">
        {domainStats.slice(0, 50).map((stats, idx) => (
          <div key={idx} className="hover:bg-muted/50 p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Globe className="text-muted-foreground h-5 w-5" />
                  <span className="dashboard-body-sm font-semibold">{stats.domain}</span>
                </div>
                <div className="dashboard-body-sm flex flex-wrap gap-3">
                  <span className="text-muted-foreground">Domain Rank: {stats.avgRank.toFixed(0)}</span>
                  <span className="text-muted-foreground">Spam Score: {stats.avgSpamScore.toFixed(0)}%</span>
                  <span className="text-primary">{stats.dofollow} dofollow</span>
                  <span className="text-muted-foreground">{stats.nofollow} nofollow</span>
                </div>
              </div>
              <div className="text-right">
                <div className="dashboard-heading-2 text-primary">{stats.count}</div>
                <div className="dashboard-text-xs text-muted-foreground">backlinks</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

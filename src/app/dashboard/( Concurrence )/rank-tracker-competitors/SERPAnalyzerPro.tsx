'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Eye,
  Globe,
  Info,
  Search,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { SERPCompetitor, SERPCompetitorsResponse } from './actions'

interface SERPAnalyzerProProps {
  competitorsData: SERPCompetitorsResponse
  keyword: string
}

export default function SERPAnalyzerPro({ competitorsData }: SERPAnalyzerProProps) {
  const [sortBy, setSortBy] = useState<'rating' | 'etv' | 'visibility' | 'avg_position' | 'keywords_count'>('rating')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [domainFilter, setDomainFilter] = useState('')
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'insights'>('table')

  // Trier et filtrer les concurrents
  const sortedCompetitors = useMemo(() => {
    const filtered = competitorsData.items.filter((competitor) =>
      competitor.domain.toLowerCase().includes(domainFilter.toLowerCase()),
    )

    filtered.sort((a, b) => {
      let aValue: number
      let bValue: number

      switch (sortBy) {
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'etv':
          aValue = a.etv
          bValue = b.etv
          break
        case 'visibility':
          aValue = a.visibility
          bValue = b.visibility
          break
        case 'avg_position':
          aValue = a.avg_position
          bValue = b.avg_position
          break
        case 'keywords_count':
          aValue = a.keywords_count
          bValue = b.keywords_count
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    return filtered
  }, [competitorsData.items, sortBy, sortOrder, domainFilter])

  // Calculer les statistiques globales
  const stats = useMemo(() => {
    const competitors = competitorsData.items
    const totalETV = competitors.reduce((sum, c) => sum + c.etv, 0)
    const avgRating = competitors.reduce((sum, c) => sum + c.rating, 0) / competitors.length
    const avgVisibility = competitors.reduce((sum, c) => sum + c.visibility, 0) / competitors.length
    const avgPosition = competitors.reduce((sum, c) => sum + c.avg_position, 0) / competitors.length

    // Top 3 par ETV
    const top3ByETV = [...competitors].sort((a, b) => b.etv - a.etv).slice(0, 3)

    // Concurrents dans le top 10
    const top10Competitors = competitors.filter((c) => c.avg_position <= 10)

    // Opportunités (positions 11-20)
    const opportunities = competitors.filter((c) => c.avg_position > 10 && c.avg_position <= 20)

    return {
      totalETV,
      avgRating,
      avgVisibility,
      avgPosition,
      top3ByETV,
      top10Competitors: top10Competitors.length,
      opportunities: opportunities.length,
    }
  }, [competitorsData.items])

  // Insights SEO
  const insights = useMemo(() => {
    const competitors = competitorsData.items
    const topCompetitor = competitors[0] // Déjà trié par rating par défaut

    // Domination du marché
    const marketShare = topCompetitor ? (topCompetitor.etv / stats.totalETV) * 100 : 0

    // Distribution des positions
    const top3Count = competitors.filter((c) => c.avg_position <= 3).length
    const top10Count = competitors.filter((c) => c.avg_position <= 10).length

    return {
      marketShare,
      topCompetitor,
      top3Count,
      top10Count,
    }
  }, [competitorsData.items, stats.totalETV])

  return (
    <div className="space-y-6">
      {/* En-tête avec métriques clés */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Concurrents identifiés"
          value={competitorsData.items.length}
          icon={<Users className="h-5 w-5" />}
          color="blue"
          subtitle={`${competitorsData.total_count} au total • ${competitorsData.seed_keywords.length} mot-clé${competitorsData.seed_keywords.length > 1 ? 'x' : ''}`}
        />
        <MetricCard
          label="ETV total du marché"
          value={new Intl.NumberFormat('fr-FR', {
            maximumFractionDigits: 0,
          }).format(stats.totalETV)}
          icon={<BarChart3 className="h-5 w-5" />}
          color="green"
          subtitle={`Trafic mensuel estimé`}
        />
        <MetricCard
          label="Visibilité moyenne"
          value={`${(stats.avgVisibility * 100).toFixed(1)}%`}
          icon={<Eye className="h-5 w-5" />}
          color="purple"
          subtitle={`Position moy: ${stats.avgPosition.toFixed(1)}`}
        />
        <MetricCard
          label="Top 10"
          value={stats.top10Competitors}
          icon={<Target className="h-5 w-5" />}
          color="orange"
          subtitle={`Concurrents bien positionnés`}
        />
      </div>

      {/* Insights SEO */}
      {viewMode === 'insights' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 rounded-lg p-3">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="dashboard-heading-4">Leader du marché</CardTitle>
                  <p className="dashboard-body-sm text-muted-foreground mt-1">
                    {insights.topCompetitor?.domain || 'N/A'}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <div className="dashboard-heading-2 text-primary">{insights.marketShare.toFixed(1)}%</div>
                      <div className="dashboard-text-xs text-muted-foreground">Part de marché ETV</div>
                    </div>
                    <div>
                      <div className="dashboard-heading-2 text-primary">{insights.topCompetitor?.rating || 0}</div>
                      <div className="dashboard-text-xs text-muted-foreground">Rating SEO</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 rounded-lg p-3">
                  <Activity className="text-primary h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="dashboard-heading-4">Distribution des positions</CardTitle>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="dashboard-body-sm text-muted-foreground">Top 3</span>
                      <span className="dashboard-body-sm font-semibold">{insights.top3Count} domaines</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="dashboard-body-sm text-muted-foreground">Top 10</span>
                      <span className="dashboard-body-sm font-semibold">{insights.top10Count} domaines</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="dashboard-body-sm text-muted-foreground">Opportunités</span>
                      <span className="dashboard-body-sm font-semibold">{stats.opportunities} domaines (11-20)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation des vues */}
      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          <Button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 ${
              viewMode === 'table' ? 'text-primary-foreground bg-mist-600 font-semibold' : ''
            }`}
            variant={viewMode === 'table' ? 'default' : 'outline'}
          >
            <BarChart3 className="h-4 w-4" />
            Vue tableau
          </Button>
          <Button
            onClick={() => setViewMode('insights')}
            className={`flex items-center gap-2 ${
              viewMode === 'insights' ? 'text-primary-foreground bg-mist-600 font-semibold' : ''
            }`}
            variant={viewMode === 'insights' ? 'default' : 'outline'}
          >
            <Info className="h-4 w-4" />
            Insights SEO
          </Button>
        </CardContent>
      </Card>

      {/* Filtres et tri */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Recherche par domaine */}
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Rechercher un domaine..."
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tri */}
            <div className="flex items-center gap-2">
              <label className="dashboard-body-sm font-medium">Trier par:</label>
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(value as 'rating' | 'etv' | 'visibility' | 'avg_position' | 'keywords_count')
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="rating">Rating (visibilité relative)</SelectItem>
                  <SelectItem value="etv">ETV (trafic estimé)</SelectItem>
                  <SelectItem value="visibility">Visibilité SERP</SelectItem>
                  <SelectItem value="avg_position">Position moyenne</SelectItem>
                  <SelectItem value="keywords_count">Nombre de mots-clés</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                variant="outline"
                size="icon"
                title={sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
              >
                {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des concurrents */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted">
          <div className="flex items-center justify-between">
            <CardTitle className="dashboard-heading-4">
              Analyse détaillée des concurrents ({sortedCompetitors.length})
            </CardTitle>
            <CardDescription className="dashboard-body-sm">
              Cliquez sur un domaine pour voir les positions par mot-clé
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Rang</TableHead>
                <TableHead className="text-left">Domaine</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead className="text-center">ETV</TableHead>
                <TableHead className="text-center">Visibilité</TableHead>
                <TableHead className="text-center">Pos. moy.</TableHead>
                <TableHead className="text-center">Pos. méd.</TableHead>
                <TableHead className="text-center">Mots-clés</TableHead>
                <TableHead className="text-center">SERP items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompetitors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center">
                    <AlertTriangle className="text-muted-foreground mx-auto h-12 w-12" />
                    <p className="dashboard-body-sm text-muted-foreground mt-4">Aucun concurrent trouvé</p>
                  </TableCell>
                </TableRow>
              ) : (
                sortedCompetitors.map((competitor, index) => (
                  <CompetitorRow
                    key={competitor.domain}
                    competitor={competitor}
                    rank={index + 1}
                    seedKeywords={competitorsData.seed_keywords}
                    isExpanded={expandedDomain === competitor.domain}
                    onToggleExpand={() =>
                      setExpandedDomain(expandedDomain === competitor.domain ? null : competitor.domain)
                    }
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
            <p className="dashboard-body-sm text-muted-foreground font-medium">{label}</p>
            <p className="dashboard-heading-1 mt-2">{value}</p>
            {subtitle && <p className="dashboard-text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`rounded-lg border p-3 ${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function CompetitorRow({
  competitor,
  rank,
  seedKeywords,
  isExpanded,
  onToggleExpand,
}: {
  competitor: SERPCompetitor
  rank: number
  seedKeywords: string[]
  isExpanded: boolean
  onToggleExpand: () => void
}) {
  const getRatingColor = (rating: number): 'green' | 'blue' | 'orange' | 'red' => {
    if (rating >= 90) return 'green'
    if (rating >= 70) return 'blue'
    if (rating >= 50) return 'orange'
    return 'red'
  }

  const getVisibilityColor = (visibility: number) => {
    if (visibility >= 0.8) return 'text-primary'
    if (visibility >= 0.5) return 'text-primary'
    if (visibility >= 0.2) return 'text-accent'
    return 'text-destructive'
  }

  const getPositionBadgeColor = (position: number): 'green' | 'blue' | 'orange' | 'zinc' => {
    if (position <= 3) return 'green'
    if (position <= 10) return 'blue'
    if (position <= 20) return 'orange'
    return 'zinc'
  }

  return (
    <>
      <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={onToggleExpand}>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="dashboard-body font-semibold">#{rank}</span>
            {rank <= 3 && (
              <Badge color="yellow" className="text-xs font-semibold">
                TOP {rank}
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="text-muted-foreground h-4 w-4" />
            ) : (
              <ChevronRight className="text-muted-foreground h-4 w-4" />
            )}
            <Globe className="text-muted-foreground h-4 w-4" />
            <a
              href={`https://${competitor.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="dashboard-body text-primary hover:text-primary/80 font-medium hover:underline"
            >
              {competitor.domain}
            </a>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="text-accent h-4 w-4" />
            <Badge color={getRatingColor(competitor.rating)} className="text-xs font-semibold">
              {competitor.rating}
            </Badge>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex flex-col items-center">
            <span className="dashboard-body font-semibold">
              {new Intl.NumberFormat('fr-FR', {
                maximumFractionDigits: 0,
              }).format(competitor.etv)}
            </span>
            <span className="dashboard-text-xs text-muted-foreground">trafic/mois</span>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex flex-col items-center">
            <span className={`dashboard-body font-semibold ${getVisibilityColor(competitor.visibility)}`}>
              {(competitor.visibility * 100).toFixed(1)}%
            </span>
            <span className="dashboard-text-xs text-muted-foreground">SERP</span>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <span className="dashboard-body font-medium">{competitor.avg_position.toFixed(1)}</span>
        </TableCell>
        <TableCell className="text-center">
          <span className="dashboard-body font-medium">{competitor.median_position}</span>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Search className="text-muted-foreground h-4 w-4" />
            <span className="dashboard-body font-medium">{competitor.keywords_count}</span>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <span className="dashboard-body font-medium">{competitor.relevant_serp_items}</span>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-primary/5">
          <TableCell colSpan={9} className="p-6">
            <div className="space-y-4">
              <h4 className="dashboard-heading-4">Positions détaillées par mot-clé</h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {seedKeywords.map((keyword) => {
                  const positions = competitor.keywords_positions[keyword] || []
                  const bestPosition = positions.length > 0 ? Math.min(...positions) : null
                  const avgPos = positions.length > 0 ? positions.reduce((a, b) => a + b, 0) / positions.length : null

                  return (
                    <Card key={keyword}>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="dashboard-body font-medium">{keyword}</span>
                          {bestPosition && (
                            <Badge color={getPositionBadgeColor(bestPosition)} className="text-xs font-semibold">
                              Pos. {bestPosition}
                            </Badge>
                          )}
                        </div>
                        {positions.length > 0 ? (
                          <div className="space-y-1">
                            <div className="dashboard-text-xs flex items-center justify-between">
                              <span className="text-muted-foreground">Meilleure:</span>
                              <span className="dashboard-body-sm font-semibold">{bestPosition}</span>
                            </div>
                            {positions.length > 1 && (
                              <div className="dashboard-text-xs flex items-center justify-between">
                                <span className="text-muted-foreground">Moyenne:</span>
                                <span className="dashboard-body-sm font-semibold">{avgPos?.toFixed(1)}</span>
                              </div>
                            )}
                            {positions.length > 1 && (
                              <div className="dashboard-text-xs text-muted-foreground flex items-center gap-1">
                                <span>Toutes:</span>
                                <span className="font-mono">{positions.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="dashboard-text-xs text-muted-foreground">Non classé pour ce mot-clé</div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

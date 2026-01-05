// 📁 app/dashboard/backlinks/domaines-referents/referring-domains-content.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SpinnerCustom } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  HelpCircle,
  Link2,
  Loader2,
  Search,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useActionState, useMemo, useState, useTransition } from 'react'
import { fetchReferringDomains, type ReferringDomainsState } from './action'

export function ReferringDomainsContent() {
  const initialState: ReferringDomainsState = { success: false }
  const [state, formAction, isPending] = useActionState(
    fetchReferringDomains,
    initialState,
  )
  const [isTransitionPending, startTransition] = useTransition()

  const [target, setTarget] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  // Tri et filtrage
  const [sortBy, setSortBy] = useState<
    'rank' | 'backlinks' | 'spam_score' | 'first_seen'
  >('rank')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterSpamScore, setFilterSpamScore] = useState<
    'all' | 'low' | 'medium' | 'high'
  >('all')
  const [searchDomain, setSearchDomain] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentPage(1) // Reset pagination
    const formData = new FormData()
    formData.set('target', target.trim())
    formData.set('offset', '0')
    formData.set('limit', '100') // Valeur par défaut de 100
    formData.set('backlinks_status_type', 'live') // Fixé à 'live'
    startTransition(() => {
      formAction(formData)
    })
  }

  // Filtrage et tri
  const filteredAndSortedItems = useMemo(() => {
    if (!state.result?.items) return []

    let items = [...state.result.items]

    // Filtre par recherche de domaine
    if (searchDomain.trim()) {
      items = items.filter((item) =>
        item.domain.toLowerCase().includes(searchDomain.toLowerCase()),
      )
    }

    // Filtre par spam score
    if (filterSpamScore !== 'all') {
      items = items.filter((item) => {
        if (filterSpamScore === 'low') return item.backlinks_spam_score < 30
        if (filterSpamScore === 'medium')
          return (
            item.backlinks_spam_score >= 30 && item.backlinks_spam_score < 60
          )
        if (filterSpamScore === 'high') return item.backlinks_spam_score >= 60
        return true
      })
    }

    // Tri
    items.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'rank') {
        comparison = a.rank - b.rank
      } else if (sortBy === 'backlinks') {
        comparison = a.backlinks - b.backlinks
      } else if (sortBy === 'spam_score') {
        comparison = a.backlinks_spam_score - b.backlinks_spam_score
      } else if (sortBy === 'first_seen') {
        comparison =
          new Date(a.first_seen).getTime() - new Date(b.first_seen).getTime()
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return items
  }, [state.result?.items, searchDomain, filterSpamScore, sortBy, sortOrder])

  // Pagination
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage)

  // Calculs agrégés
  const aggregatedMetrics = useMemo(() => {
    if (!state.result?.items) return null

    const totalBacklinks = state.result.items.reduce(
      (sum, item) => sum + item.backlinks,
      0,
    )
    const avgSpamScore =
      state.result.items.reduce(
        (sum, item) => sum + item.backlinks_spam_score,
        0,
      ) / state.result.items.length
    const totalReferringPages = state.result.items.reduce(
      (sum, item) => sum + item.referring_pages,
      0,
    )
    const avgRank =
      state.result.items.reduce((sum, item) => sum + item.rank, 0) /
      state.result.items.length

    // Statistiques par statut (pour le mode "all")
    const liveCount = state.result.items.filter(
      (item) => !item.lost_date,
    ).length
    const lostCount = state.result.items.filter((item) => item.lost_date).length

    // Top TLDs
    const tldCount: Record<string, number> = {}
    state.result.items.forEach((item) => {
      Object.entries(item.referring_links_tld || {}).forEach(([tld, count]) => {
        tldCount[tld] = (tldCount[tld] || 0) + count
      })
    })
    const topTlds = Object.entries(tldCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Top Countries
    const countryCount: Record<string, number> = {}
    state.result.items.forEach((item) => {
      Object.entries(item.referring_links_countries || {}).forEach(
        ([country, count]) => {
          if (country) {
            // Ignore empty country codes
            countryCount[country] = (countryCount[country] || 0) + count
          }
        },
      )
    })
    const topCountries = Object.entries(countryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Spam score distribution - utiliser TOUS les items retournés
    const allItems = state.result.items
    const lowSpam = allItems.filter(
      (item) => item.backlinks_spam_score < 30,
    ).length
    const mediumSpam = allItems.filter(
      (item) =>
        item.backlinks_spam_score >= 30 && item.backlinks_spam_score < 60,
    ).length
    const highSpam = allItems.filter(
      (item) => item.backlinks_spam_score >= 60,
    ).length

    return {
      totalBacklinks,
      avgSpamScore,
      totalReferringPages,
      avgRank,
      topTlds,
      topCountries,
      lowSpam,
      mediumSpam,
      highSpam,
      liveCount,
      lostCount,
    }
  }, [state.result])

  // Helper pour les badges de spam score
  const getSpamScoreBadge = (score: number): 'green' | 'yellow' | 'red' => {
    if (score < 30) return 'green'
    if (score < 60) return 'yellow'
    return 'red'
  }

  // Helper pour formater les nombres
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  // Helper pour formater les dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Domaines Référents</h1>
              <p className="text-sm text-muted-foreground">
                Analysez tous les domaines qui créent des backlinks vers votre
                site
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analyser les domaines référents</CardTitle>
                <CardDescription>
                  Entrez un nom de domaine ou une URL complète
                </CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Découvrez tous les domaines qui créent des liens vers votre
                    site, avec leurs métriques détaillées.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target">Domaine ou URL cible</Label>
                <Input
                  id="target"
                  name="target"
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="exemple.fr ou https://exemple.fr/page"
                  disabled={isPending || isTransitionPending}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Domaine: exemple.fr | URL: https://exemple.fr/page
                  <br />
                  Analyse des backlinks actifs uniquement (live)
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isPending || isTransitionPending || !target}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyser les domaines référents
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Erreur */}
        {state.error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">Erreur</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {state.error}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {isPending && (
          <Card className="mb-6">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <SpinnerCustom />
              <p className="mt-4 font-medium">
                Récupération des domaines référents...
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Cela peut prendre quelques secondes
              </p>
            </CardContent>
          </Card>
        )}

        {/* Résultats */}
        {state.success && state.result && aggregatedMetrics && (
          <>
            {/* Métriques globales */}
            <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Domaines
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatNumber(state.result.total_count)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    domaines référents uniques
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Backlinks
                  </CardTitle>
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatNumber(aggregatedMetrics.totalBacklinks)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    liens entrants totaux
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Spam Score Moyen
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Math.round(aggregatedMetrics.avgSpamScore)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    qualité des backlinks
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Rank Moyen
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Math.round(aggregatedMetrics.avgRank)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    autorité moyenne des domaines
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Distribution du Spam Score */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Qualité des Domaines Référents</CardTitle>
                    <CardDescription>
                      Distribution par niveau de spam score
                      {state.result.total_count > state.result.items.length ? (
                        <span>
                          {' '}
                          sur {formatNumber(state.result.items.length)} domaines
                          analysés (sur {formatNumber(state.result.total_count)}{' '}
                          au total dans la base)
                        </span>
                      ) : (
                        <span>
                          {' '}
                          sur {formatNumber(state.result.items.length)} domaines
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge color="zinc">
                    {formatNumber(state.result.items.length)} analysés
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="font-medium">Faible (0-29%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatNumber(aggregatedMetrics.lowSpam)}
                        </span>
                        <span className="text-muted-foreground">
                          (
                          {state.result.items.length > 0
                            ? Math.round(
                                (aggregatedMetrics.lowSpam /
                                  state.result.items.length) *
                                  100,
                              )
                            : 0}
                          %)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={
                        state.result.items.length > 0
                          ? (aggregatedMetrics.lowSpam /
                              state.result.items.length) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <span className="font-medium">Moyen (30-59%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatNumber(aggregatedMetrics.mediumSpam)}
                        </span>
                        <span className="text-muted-foreground">
                          (
                          {state.result.items.length > 0
                            ? Math.round(
                                (aggregatedMetrics.mediumSpam /
                                  state.result.items.length) *
                                  100,
                              )
                            : 0}
                          %)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={
                        state.result.items.length > 0
                          ? (aggregatedMetrics.mediumSpam /
                              state.result.items.length) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="font-medium">Élevé (60-100%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatNumber(aggregatedMetrics.highSpam)}
                        </span>
                        <span className="text-muted-foreground">
                          (
                          {state.result.items.length > 0
                            ? Math.round(
                                (aggregatedMetrics.highSpam /
                                  state.result.items.length) *
                                  100,
                              )
                            : 0}
                          %)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={
                        state.result.items.length > 0
                          ? (aggregatedMetrics.highSpam /
                              state.result.items.length) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top TLDs & Countries */}
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Extensions (TLD)</CardTitle>
                  <CardDescription>
                    Extensions de domaine les plus fréquentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aggregatedMetrics.topTlds.map(([tld, count], idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Badge color="zinc">.{tld}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatNumber(count)} liens
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Pays</CardTitle>
                  <CardDescription>
                    Répartition géographique des backlinks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aggregatedMetrics.topCountries.map(
                      ([country, count], idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <Badge color="zinc">{country}</Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(count)} liens
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtres et tri */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filtres et tri</CardTitle>
                <CardDescription>
                  Affinez votre recherche parmi les résultats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="searchDomain">Rechercher un domaine</Label>
                    <Input
                      id="searchDomain"
                      placeholder="Filtrer par nom..."
                      value={searchDomain}
                      onChange={(e) => {
                        setSearchDomain(e.target.value)
                        setCurrentPage(1)
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filterSpamScore">Spam Score</Label>
                    <Select
                      value={filterSpamScore}
                      onValueChange={(val) => {
                        setFilterSpamScore(
                          val as 'all' | 'low' | 'medium' | 'high',
                        )
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger id="filterSpamScore">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="low">Faible (0-29%)</SelectItem>
                        <SelectItem value="medium">Moyen (30-59%)</SelectItem>
                        <SelectItem value="high">Élevé (60-100%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sortBy">Trier par</Label>
                    <Select
                      value={sortBy}
                      onValueChange={(val) =>
                        setSortBy(
                          val as
                            | 'rank'
                            | 'backlinks'
                            | 'spam_score'
                            | 'first_seen',
                        )
                      }
                    >
                      <SelectTrigger id="sortBy">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rank">Rank</SelectItem>
                        <SelectItem value="backlinks">Backlinks</SelectItem>
                        <SelectItem value="spam_score">Spam Score</SelectItem>
                        <SelectItem value="first_seen">
                          Date de découverte
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Ordre</Label>
                    <Select
                      value={sortOrder}
                      onValueChange={(val) =>
                        setSortOrder(val as 'asc' | 'desc')
                      }
                    >
                      <SelectTrigger id="sortOrder">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Décroissant</SelectItem>
                        <SelectItem value="asc">Croissant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(searchDomain || filterSpamScore !== 'all') && (
                  <div className="mt-4 flex items-center gap-2">
                    <Badge color="blue">
                      {filteredAndSortedItems.length} /{' '}
                      {state.result?.items.length || 0} domaines
                    </Badge>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchDomain('')
                        setFilterSpamScore('all')
                        setCurrentPage(1)
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Table des domaines */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Liste des Domaines Référents</CardTitle>
                    <CardDescription>
                      {formatNumber(filteredAndSortedItems.length)} domaines
                      affichés
                    </CardDescription>
                  </div>
                  <Badge color="zinc">
                    Coût API: ${state.cost?.toFixed(4) || '0'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Domaine</TableHead>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead className="w-[100px]">Backlinks</TableHead>
                        <TableHead className="w-[100px]">Pages Réf.</TableHead>
                        <TableHead className="w-[100px]">Spam Score</TableHead>
                        <TableHead className="w-[120px]">
                          Première Vue
                        </TableHead>
                        <TableHead className="w-[80px]">TLD</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedItems?.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col gap-1">
                              <a
                                href={`https://${item.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline"
                              >
                                {item.domain}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              <div className="flex items-center gap-2">
                                {item.lost_date ? (
                                  <Badge color="red" className="w-fit text-xs">
                                    Perdu le {formatDate(item.lost_date)}
                                  </Badge>
                                ) : (
                                  <Badge
                                    color="green"
                                    className="w-fit text-xs"
                                  >
                                    Actif
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge color="blue">{item.rank}</Badge>
                          </TableCell>
                          <TableCell>{formatNumber(item.backlinks)}</TableCell>
                          <TableCell>
                            {formatNumber(item.referring_pages)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={getSpamScoreBadge(
                                item.backlinks_spam_score,
                              )}
                            >
                              {item.backlinks_spam_score}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(item.first_seen)}
                          </TableCell>
                          <TableCell>
                            {Object.keys(item.referring_links_tld || {})[0] && (
                              <Badge color="zinc">
                                .{Object.keys(item.referring_links_tld)[0]}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} sur {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}

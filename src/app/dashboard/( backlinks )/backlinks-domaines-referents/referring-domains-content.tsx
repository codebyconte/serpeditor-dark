// 📁 app/dashboard/backlinks/domaines-referents/referring-domains-content.tsx
'use client'

import { Button } from '@/components/elements/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SpinnerCustom } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TooltipProvider } from '@/components/ui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Link2,
  Loader2,
  Search,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useActionState, useMemo, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fetchReferringDomains, type ReferringDomainsState } from './action'

const referringDomainsFormSchema = z.object({
  target: z
    .string()
    .min(1, 'Le domaine ou l&apos;URL est requis')
    .refine(
      (url) => {
        // Nettoyer l'URL
        let cleaned = url.trim()
        cleaned = cleaned.replace(/^https?:\/\//, '')
        cleaned = cleaned.replace(/^www\./, '')
        cleaned = cleaned.replace(/\/$/, '')

        // Vérifier qu'il n'y a pas d'espaces
        if (cleaned.includes(' ')) {
          return false
        }

        // Vérifier le format du domaine (exemple.com) ou URL complète
        const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
        const urlPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/

        return domainPattern.test(cleaned) || urlPattern.test(cleaned)
      },
      {
        message: 'Format invalide. Utilisez un domaine (exemple.com) ou une URL complète (https://exemple.com/page)',
      },
    ),
})

type ReferringDomainsFormValues = z.infer<typeof referringDomainsFormSchema>

export function ReferringDomainsContent() {
  const initialState: ReferringDomainsState = { success: false }
  const [state, formAction, isPending] = useActionState(fetchReferringDomains, initialState)
  const [isTransitionPending, startTransition] = useTransition()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  // Tri et filtrage
  const [sortBy, setSortBy] = useState<'rank' | 'backlinks' | 'spam_score' | 'first_seen'>('rank')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterSpamScore, setFilterSpamScore] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [searchDomain, setSearchDomain] = useState('')

  const form = useForm<ReferringDomainsFormValues>({
    resolver: zodResolver(referringDomainsFormSchema),
    mode: 'onChange',
    defaultValues: {
      target: '',
    },
  })

  const onSubmit = (values: ReferringDomainsFormValues) => {
    setCurrentPage(1) // Reset pagination
    const formData = new FormData()
    formData.set('target', values.target.trim())
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

    const sourceItems = state.result.items
    let items = [...sourceItems]

    // Filtre par recherche de domaine
    if (searchDomain.trim()) {
      items = items.filter((item) => item.domain.toLowerCase().includes(searchDomain.toLowerCase()))
    }

    // Filtre par spam score
    if (filterSpamScore !== 'all') {
      items = items.filter((item) => {
        if (filterSpamScore === 'low') return item.backlinks_spam_score < 30
        if (filterSpamScore === 'medium') return item.backlinks_spam_score >= 30 && item.backlinks_spam_score < 60
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
        comparison = new Date(a.first_seen).getTime() - new Date(b.first_seen).getTime()
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return items
  }, [state.result, searchDomain, filterSpamScore, sortBy, sortOrder])

  // Pagination
  const paginatedItems = filteredAndSortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage)

  // Calculs agrégés
  const aggregatedMetrics = useMemo(() => {
    if (!state.result?.items) return null

    const totalBacklinks = state.result.items.reduce((sum, item) => sum + item.backlinks, 0)
    const avgSpamScore =
      state.result.items.reduce((sum, item) => sum + item.backlinks_spam_score, 0) / state.result.items.length
    const totalReferringPages = state.result.items.reduce((sum, item) => sum + item.referring_pages, 0)
    const avgRank = state.result.items.reduce((sum, item) => sum + item.rank, 0) / state.result.items.length

    // Statistiques par statut (pour le mode "all")
    const liveCount = state.result.items.filter((item) => !item.lost_date).length
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
      Object.entries(item.referring_links_countries || {}).forEach(([country, count]) => {
        if (country) {
          // Ignore empty country codes
          countryCount[country] = (countryCount[country] || 0) + count
        }
      })
    })
    const topCountries = Object.entries(countryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Spam score distribution - utiliser TOUS les items retournés
    const allItems = state.result.items
    const lowSpam = allItems.filter((item) => item.backlinks_spam_score < 30).length
    const mediumSpam = allItems.filter(
      (item) => item.backlinks_spam_score >= 30 && item.backlinks_spam_score < 60,
    ).length
    const highSpam = allItems.filter((item) => item.backlinks_spam_score >= 60).length

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
      <div className="container mx-auto">
        {/* Header */}

        {/* Formulaire */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analyser les domaines référents</CardTitle>
                <CardDescription>Entrez un nom de domaine ou une URL complète</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domaine ou URL cible</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="exemple.fr ou https://exemple.fr/page"
                          disabled={isPending || isTransitionPending}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            form.trigger('target')
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full hover:cursor-pointer"
                  disabled={isPending || isTransitionPending}
                >
                  {isPending || isTransitionPending ? (
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
            </Form>
          </CardContent>
        </Card>

        {/* Erreur */}
        {state.error && (
          <Card className="border-destructive/50 bg-destructive/5 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-destructive mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-destructive font-semibold">Erreur</p>
                  <p className="text-muted-foreground mt-1 text-sm">{state.error}</p>
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
              <p className="mt-4 font-medium">Récupération des domaines référents...</p>
              <p className="text-muted-foreground mt-2 text-sm">Cela peut prendre quelques secondes</p>
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
                  <CardTitle className="text-sm font-medium">Total Domaines</CardTitle>
                  <Users className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatNumber(state.result.total_count)}</div>
                  <p className="text-muted-foreground text-xs">domaines référents uniques</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Backlinks</CardTitle>
                  <Link2 className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatNumber(aggregatedMetrics.totalBacklinks)}</div>
                  <p className="text-muted-foreground text-xs">liens entrants totaux</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Spam Score Moyen</CardTitle>
                  <Shield className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Math.round(aggregatedMetrics.avgSpamScore)}%</div>
                  <p className="text-muted-foreground text-xs">qualité des backlinks</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rank Moyen</CardTitle>
                  <TrendingUp className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Math.round(aggregatedMetrics.avgRank)}</div>
                  <p className="text-muted-foreground text-xs">autorité moyenne des domaines</p>
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
                          sur {formatNumber(state.result.items.length)} domaines analysés (sur{' '}
                          {formatNumber(state.result.total_count)} au total dans la base)
                        </span>
                      ) : (
                        <span> sur {formatNumber(state.result.items.length)} domaines</span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge color="zinc">{formatNumber(state.result.items.length)} analysés</Badge>
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
                        <span className="font-medium">{formatNumber(aggregatedMetrics.lowSpam)}</span>
                        <span className="text-muted-foreground">
                          (
                          {state.result.items.length > 0
                            ? Math.round((aggregatedMetrics.lowSpam / state.result.items.length) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={
                        state.result.items.length > 0
                          ? (aggregatedMetrics.lowSpam / state.result.items.length) * 100
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
                        <span className="font-medium">{formatNumber(aggregatedMetrics.mediumSpam)}</span>
                        <span className="text-muted-foreground">
                          (
                          {state.result.items.length > 0
                            ? Math.round((aggregatedMetrics.mediumSpam / state.result.items.length) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={
                        state.result.items.length > 0
                          ? (aggregatedMetrics.mediumSpam / state.result.items.length) * 100
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
                        <span className="font-medium">{formatNumber(aggregatedMetrics.highSpam)}</span>
                        <span className="text-muted-foreground">
                          (
                          {state.result.items.length > 0
                            ? Math.round((aggregatedMetrics.highSpam / state.result.items.length) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={
                        state.result.items.length > 0
                          ? (aggregatedMetrics.highSpam / state.result.items.length) * 100
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
                  <CardDescription>Extensions de domaine les plus fréquentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aggregatedMetrics.topTlds.map(([tld, count], idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge color="zinc">.{tld}</Badge>
                        </div>
                        <span className="text-muted-foreground text-sm">{formatNumber(count)} liens</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Pays</CardTitle>
                  <CardDescription>Répartition géographique des backlinks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aggregatedMetrics.topCountries.map(([country, count], idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="text-muted-foreground h-4 w-4" />
                          <Badge color="zinc">{country}</Badge>
                        </div>
                        <span className="text-muted-foreground text-sm">{formatNumber(count)} liens</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtres et tri */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filtres et tri</CardTitle>
                <CardDescription>Affinez votre recherche parmi les résultats</CardDescription>
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
                        setFilterSpamScore(val as 'all' | 'low' | 'medium' | 'high')
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger id="filterSpamScore" className="hover:cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-mist-600">
                        <SelectItem value="all" className="hover:cursor-pointer hover:bg-mist-500">
                          Tous
                        </SelectItem>
                        <SelectItem value="low" className="hover:cursor-pointer hover:bg-mist-500">
                          Faible (0-29%)
                        </SelectItem>
                        <SelectItem value="medium" className="hover:cursor-pointer hover:bg-mist-500">
                          Moyen (30-59%)
                        </SelectItem>
                        <SelectItem value="high" className="hover:cursor-pointer hover:bg-mist-500">
                          Élevé (60-100%)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sortBy">Trier par</Label>
                    <Select
                      value={sortBy}
                      onValueChange={(val) => setSortBy(val as 'rank' | 'backlinks' | 'spam_score' | 'first_seen')}
                    >
                      <SelectTrigger id="sortBy" className="hover:cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-mist-600">
                        <SelectItem value="rank" className="hover:cursor-pointer hover:bg-mist-500">
                          Rank
                        </SelectItem>
                        <SelectItem value="backlinks" className="hover:cursor-pointer hover:bg-mist-500">
                          Backlinks
                        </SelectItem>
                        <SelectItem value="spam_score" className="hover:cursor-pointer hover:bg-mist-500">
                          Spam Score
                        </SelectItem>
                        <SelectItem value="first_seen" className="hover:cursor-pointer hover:bg-mist-500">
                          Date de découverte
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Ordre</Label>
                    <Select value={sortOrder} onValueChange={(val) => setSortOrder(val as 'asc' | 'desc')}>
                      <SelectTrigger id="sortOrder" className="hover:cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-mist-600">
                        <SelectItem value="desc" className="hover:cursor-pointer hover:bg-mist-500">
                          Décroissant
                        </SelectItem>
                        <SelectItem value="asc" className="hover:cursor-pointer hover:bg-mist-500">
                          Croissant
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(searchDomain || filterSpamScore !== 'all') && (
                  <div className="mt-4 flex items-center gap-2">
                    <Badge color="blue">
                      {filteredAndSortedItems.length} / {state.result?.items.length || 0} domaines
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
                    <CardDescription>{formatNumber(filteredAndSortedItems.length)} domaines affichés</CardDescription>
                  </div>
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
                        <TableHead className="w-[120px]">Première Vue</TableHead>
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
                                  <Badge color="green" className="w-fit text-xs">
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
                          <TableCell>{formatNumber(item.referring_pages)}</TableCell>
                          <TableCell>
                            <Badge color={getSpamScoreBadge(item.backlinks_spam_score)}>
                              {item.backlinks_spam_score}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{formatDate(item.first_seen)}</TableCell>
                          <TableCell>
                            {Object.keys(item.referring_links_tld || {})[0] && (
                              <Badge color="zinc">.{Object.keys(item.referring_links_tld)[0]}</Badge>
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
                    <p className="text-muted-foreground text-sm">
                      Page {currentPage} sur {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

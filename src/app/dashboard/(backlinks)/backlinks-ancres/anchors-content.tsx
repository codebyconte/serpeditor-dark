// 📁 app/dashboard/backlinks/ancres/anchors-content.tsx
'use client'

import { Button } from '@/components/elements/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { SpinnerCustom } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Anchor, ChevronLeft, ChevronRight, Link2, Loader2, Shield, Tag, TrendingUp } from 'lucide-react'
import { useActionState, useMemo, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fetchAnchors, type AnchorsState } from './action'

const anchorsFormSchema = z.object({
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

type AnchorsFormValues = z.infer<typeof anchorsFormSchema>

export function AnchorsContent() {
  const initialState: AnchorsState = { success: false }
  const [state, formAction, isPending] = useActionState(fetchAnchors, initialState)
  const [isTransitionPending, startTransition] = useTransition()

  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 50

  const form = useForm<AnchorsFormValues>({
    resolver: zodResolver(anchorsFormSchema),
    mode: 'onChange',
    defaultValues: {
      target: '',
    },
  })

  const onSubmit = (values: AnchorsFormValues) => {
    setCurrentPage(1)
    setSearchTerm('')
    const formData = new FormData()
    formData.set('target', values.target.trim())
    formData.set('offset', '0')
    formData.set('limit', '100') // Valeur par défaut de 100
    formData.set('backlinks_status_type', 'live') // Toujours "live" par défaut
    startTransition(() => {
      formAction(formData)
    })
  }

  // Classification des ancres
  const classifyAnchor = (anchor: string | null, targetDomain: string): string => {
    if (!anchor || anchor.trim() === '') return 'Vide'

    const lowerAnchor = anchor.toLowerCase()
    const cleanDomain = targetDomain.replace(/^www\./i, '').split('/')[0]

    // Branded
    if (lowerAnchor.includes(cleanDomain.split('.')[0])) return 'Branded'

    // URL
    if (lowerAnchor.includes('http') || lowerAnchor.includes('www.')) return 'URL'

    // Generic
    const genericTerms = [
      'cliquez ici',
      'click here',
      'en savoir plus',
      'read more',
      'voir plus',
      'here',
      'ici',
      'lien',
      'link',
      'site',
      'website',
      'page',
    ]
    if (genericTerms.some((term) => lowerAnchor.includes(term))) return 'Générique'

    // Image
    if (lowerAnchor.includes('jpg') || lowerAnchor.includes('png') || lowerAnchor.includes('image')) return 'Image'

    // Long-tail (plus de 5 mots)
    if (anchor.split(' ').length > 5) return 'Long-tail'

    // Exact/Partial match (supposé basé sur la présence de mots-clés)
    return 'Exact/Partial'
  }

  // Filtrage par recherche
  const filteredItems = useMemo(() => {
    if (!state.result?.items) return []
    if (!searchTerm) return state.result.items

    return state.result.items.filter((item) => item.anchor?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  }, [state.result, searchTerm])

  // Pagination
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  // Calculs agrégés
  const aggregatedMetrics = useMemo(() => {
    if (!state.result?.items) return null

    const totalBacklinks = state.result.items.reduce((sum, item) => sum + item.backlinks, 0)
    const avgSpamScore =
      state.result.items.reduce((sum, item) => sum + item.backlinks_spam_score, 0) / state.result.items.length

    // Distribution des types d'ancres
    const anchorTypes: Record<string, number> = {}
    state.result.items.forEach((item) => {
      const type = classifyAnchor(item.anchor ?? null, state.result!.target)
      anchorTypes[type] = (anchorTypes[type] || 0) + item.backlinks
    })

    // Ancres avec le plus de backlinks
    const topAnchors = [...state.result.items].sort((a, b) => b.backlinks - a.backlinks).slice(0, 10)

    // Distribution dofollow/nofollow
    const totalNofollow = state.result.items.reduce((sum, item) => sum + item.referring_pages_nofollow, 0)
    const totalPages = state.result.items.reduce((sum, item) => sum + item.referring_pages, 0)
    const dofollowPercent = ((totalPages - totalNofollow) / totalPages) * 100

    // Top types de liens
    const linkTypes: Record<string, number> = {}
    state.result.items.forEach((item) => {
      Object.entries(item.referring_links_types || {}).forEach(([type, count]) => {
        linkTypes[type] = (linkTypes[type] || 0) + count
      })
    })
    const topLinkTypes = Object.entries(linkTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Ancres cassées
    const brokenAnchors = state.result.items.filter((item) => item.broken_backlinks > 0).length

    return {
      totalBacklinks,
      avgSpamScore,
      anchorTypes,
      topAnchors,
      dofollowPercent,
      topLinkTypes,
      brokenAnchors,
    }
  }, [state.result])

  // Helper pour les badges de spam score
  const getSpamScoreBadge = (score: number): 'green' | 'yellow' | 'red' => {
    if (score < 30) return 'green'
    if (score < 60) return 'yellow'
    return 'red'
  }

  // Helper pour les badges de type d'ancre
  const getAnchorTypeBadge = (type: string): 'green' | 'blue' | 'zinc' | 'red' => {
    const colors: Record<string, 'green' | 'blue' | 'zinc' | 'red'> = {
      Branded: 'green',
      'Exact/Partial': 'blue',
      Générique: 'zinc',
      URL: 'zinc',
      'Long-tail': 'blue',
      Image: 'zinc',
      Vide: 'red',
    }
    return colors[type] || 'zinc'
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
    <div className="container mx-auto">
      {/* Formulaire */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analyser un domaine ou une URL</CardTitle>
          <CardDescription>Analysez la distribution des ancres de vos backlinks</CardDescription>
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

              <Button type="submit" className="w-full" disabled={isPending || isTransitionPending}>
                {isPending || isTransitionPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Anchor className="mr-2 h-4 w-4" />
                    Analyser les ancres
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
            <p className="mt-4 font-medium">Récupération des ancres...</p>
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
                <CardTitle className="text-sm font-medium">Total Ancres</CardTitle>
                <Tag className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(state.result.total_count)}</div>
                <p className="text-muted-foreground text-xs">ancres uniques trouvées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Backlinks</CardTitle>
                <Link2 className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(aggregatedMetrics.totalBacklinks)}</div>
                <p className="text-muted-foreground text-xs">liens avec ancre</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dofollow</CardTitle>
                <TrendingUp className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.round(aggregatedMetrics.dofollowPercent)}%</div>
                <p className="text-muted-foreground text-xs">liens dofollow</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spam Score Moyen</CardTitle>
                <Shield className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.round(aggregatedMetrics.avgSpamScore)}%</div>
                <p className="text-muted-foreground text-xs">qualité des ancres</p>
              </CardContent>
            </Card>
          </div>

          {/* Distribution des types d'ancres */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Distribution des Types d&apos;Ancres</CardTitle>
              <CardDescription>Répartition par catégorie de texte d&apos;ancre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(aggregatedMetrics.anchorTypes)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count], idx) => {
                    const percentage = (count / aggregatedMetrics.totalBacklinks) * 100
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Badge color={getAnchorTypeBadge(type)}>{type}</Badge>
                          </div>
                          <span className="text-muted-foreground">
                            {formatNumber(count)} backlinks ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Top 10 Ancres */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Top 10 Ancres par Volume</CardTitle>
              <CardDescription>Les ancres générant le plus de backlinks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aggregatedMetrics.topAnchors.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Badge color="blue">{idx + 1}</Badge>
                      <div>
                        <p className="font-medium">
                          {item.anchor && item.anchor.length > 60
                            ? item.anchor.substring(0, 60) + '...'
                            : item.anchor || '(vide)'}
                        </p>
                        <div className="mt-1 flex gap-2">
                          <Badge color="zinc" className="text-xs">
                            {formatNumber(item.referring_domains)} domaines
                          </Badge>
                          <Badge color={getSpamScoreBadge(item.backlinks_spam_score)} className="text-xs">
                            Spam: {item.backlinks_spam_score}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatNumber(item.backlinks)}</p>
                      <p className="text-muted-foreground text-xs">backlinks</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Types de liens */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Types de Liens</CardTitle>
              <CardDescription>Répartition par type de lien HTML</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {aggregatedMetrics.topLinkTypes.map(([type, count], idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Badge color="zinc">{type}</Badge>
                    </div>
                    <span className="font-medium">{formatNumber(count)} liens</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recherche et filtres */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rechercher une Ancre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Rechercher dans les ancres..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="max-w-md"
                />
                {searchTerm && (
                  <Button
                    onClick={() => {
                      setSearchTerm('')
                      setCurrentPage(1)
                    }}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
              {searchTerm && (
                <p className="text-muted-foreground mt-2 text-sm">{filteredItems.length} résultat(s) trouvé(s)</p>
              )}
            </CardContent>
          </Card>

          {/* Table des ancres */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste Complète des Ancres</CardTitle>
                  <CardDescription>
                    {formatNumber(filteredItems.length)} ancres {searchTerm && `(filtrées)`}
                  </CardDescription>
                </div>
                <Badge color="zinc">Coût API: ${state.cost?.toFixed(4) || '0'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ancre</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead className="w-[80px]">Rank</TableHead>
                      <TableHead className="w-[100px]">Backlinks</TableHead>
                      <TableHead className="w-[100px]">Domaines</TableHead>
                      <TableHead className="w-[100px]">Spam Score</TableHead>
                      <TableHead className="w-[120px]">Première Vue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.map((item, idx) => {
                      const anchorType = classifyAnchor(item.anchor ?? null, state.result!.target)
                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            <div className="max-w-md">
                              <p className="truncate">{item.anchor || '(vide)'}</p>
                              {item.lost_date && (
                                <Badge color="red" className="mt-1 text-xs">
                                  Perdu le {formatDate(item.lost_date)}
                                </Badge>
                              )}
                              {item.broken_backlinks > 0 && (
                                <Badge color="zinc" className="mt-1 text-xs">
                                  {item.broken_backlinks} liens cassés
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge color={getAnchorTypeBadge(anchorType)}>{anchorType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge color="blue">{item.rank}</Badge>
                          </TableCell>
                          <TableCell>{formatNumber(item.backlinks)}</TableCell>
                          <TableCell>{formatNumber(item.referring_domains)}</TableCell>
                          <TableCell>
                            <Badge color={getSpamScoreBadge(item.backlinks_spam_score)}>
                              {item.backlinks_spam_score}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{formatDate(item.first_seen)}</TableCell>
                        </TableRow>
                      )
                    })}
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
                    <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <Button
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
  )
}

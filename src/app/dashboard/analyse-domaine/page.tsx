'use client'

import { ClientPageHeader } from '@/components/dashboard/client-page-header'
import { Button } from '@/components/elements/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Globe, Hourglass, Link, Loader2, Search, TimerOff, WholeWord } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getDomainWhoisOverview, type DomainWhoisResponse } from './action'
import DomainWhoisAnalyzer from './DomainWhoisAnalyzer'

// Schéma de validation avec validation conditionnelle
const domainSearchSchema = z
  .object({
    searchType: z.enum(['expiring', 'expired', 'keywords', 'backlinks']),
    daysUntilExpiration: z.number().min(1).max(365).optional(),
    minKeywords: z.number().min(1).optional(),
    minBacklinks: z.number().min(1).optional(),
    tldFilter: z.string().optional(),
    limit: z.number().min(1).max(1000).optional(),
  })
  .refine(
    (data) => {
      if (data.searchType === 'expiring') {
        return data.daysUntilExpiration !== undefined
      }
      return true
    },
    {
      message: 'Veuillez sélectionner un nombre de jours',
      path: ['daysUntilExpiration'],
    },
  )
  .refine(
    (data) => {
      if (data.searchType === 'keywords') {
        return data.minKeywords !== undefined && data.minKeywords > 0
      }
      return true
    },
    {
      message: 'Veuillez entrer un minimum de keywords',
      path: ['minKeywords'],
    },
  )
  .refine(
    (data) => {
      if (data.searchType === 'backlinks') {
        return data.minBacklinks !== undefined && data.minBacklinks > 0
      }
      return true
    },
    {
      message: 'Veuillez entrer un minimum de backlinks',
      path: ['minBacklinks'],
    },
  )

type DomainSearchFormValues = z.infer<typeof domainSearchSchema>

export default function DomainWhoisAnalyzerPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [domainsData, setDomainsData] = useState<DomainWhoisResponse | null>(null)

  const form = useForm<DomainSearchFormValues>({
    resolver: zodResolver(domainSearchSchema),
    defaultValues: {
      searchType: 'expiring',
      daysUntilExpiration: 30,
      minKeywords: 100,
      minBacklinks: 1000,
      tldFilter: '',
      limit: 100,
    },
  })

  const searchType = form.watch('searchType')

  const onSubmit = async (values: DomainSearchFormValues) => {
    setLoading(true)
    setError(null)
    setDomainsData(null)

    try {
      let filters: Array<unknown> = []
      let orderBy: string[] = []
      const limit = values.limit || 100

      // Fonction helper pour formater les dates au format API
      // Format attendu: "YYYY-MM-DD HH:mm:ss +00:00"
      const formatDateForAPI = (date: Date): string => {
        const year = date.getUTCFullYear()
        const month = String(date.getUTCMonth() + 1).padStart(2, '0')
        const day = String(date.getUTCDate()).padStart(2, '0')
        const hours = String(date.getUTCHours()).padStart(2, '0')
        const minutes = String(date.getUTCMinutes()).padStart(2, '0')
        const seconds = String(date.getUTCSeconds()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} +00:00`
      }

      // Construire les filtres selon le type de recherche
      if (values.searchType === 'expiring') {
        // ⏰ Domaines qui expirent bientôt (actifs avec expiration proche)
        // Filtre: domaines enregistrés (registered = true) qui expirent entre maintenant et X jours
        const now = new Date()
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + (values.daysUntilExpiration || 30))

        filters = [
          ['registered', '=', true],
          'and',
          ['expiration_datetime', '<', formatDateForAPI(futureDate)],
          'and',
          ['expiration_datetime', '>', formatDateForAPI(now)],
        ]
        orderBy = ['expiration_datetime,asc']
      } else if (values.searchType === 'expired') {
        // 💀 Domaines déjà expirés (disponibles à racheter)
        // Filtre: domaines non enregistrés (registered = false)
        filters = [['registered', '=', false]]
        orderBy = ['metrics.organic.count,desc']
      } else if (values.searchType === 'keywords') {
        // 📊 Domaines avec beaucoup de keywords
        // Filtre: domaines avec un nombre minimum de keywords organiques
        filters = [['metrics.organic.count', '>=', values.minKeywords || 100]]
        orderBy = ['metrics.organic.count,desc']
      } else if (values.searchType === 'backlinks') {
        // 🔗 Domaines avec beaucoup de backlinks
        // Filtre: domaines avec un nombre minimum de backlinks
        filters = [['backlinks_info.backlinks', '>=', values.minBacklinks || 1000]]
        orderBy = ['backlinks_info.backlinks,desc']
      }

      // Ajouter le filtre TLD si spécifié
      // Le TLD dans l'API est sans le point (ex: "com", "fr", "net")
      if (values.tldFilter && values.tldFilter.trim()) {
        const tldValue = values.tldFilter.trim().replace(/^\./, '').toLowerCase()
        if (tldValue) {
          filters = [filters, 'and', ['tld', '=', tldValue]]
        }
      }

      const result = await getDomainWhoisOverview({
        filters,
        orderBy,
        limit,
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError('Aucun domaine trouvé avec ces critères')
        } else {
          setDomainsData(result.data)
        }
      } else {
        setError(result.error || 'Erreur lors de la récupération des domaines')
      }
    } catch (err) {
      setError('Une erreur est survenue')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-8 pb-12">
      <ClientPageHeader
        title="Analyseur de Domaines WHOIS"
        description="Trouvez des domaines expirés ou qui expirent bientôt avec leur historique SEO"
        icon={Globe}
        iconClassName="border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 text-teal-500"
      />

      {/* Formulaire */}
      <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
        <CardContent className="p-6 lg:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Type de recherche */}
              <FormField
                control={form.control}
                name="searchType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dashboard-heading-4 mb-4 block">Type de recherche</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <button
                          type="button"
                          onClick={() => field.onChange('expiring')}
                          disabled={loading}
                          className={`rounded-xl border-2 p-4 text-left transition-all ${
                            field.value === 'expiring'
                              ? 'border-orange-500 bg-gradient-to-br from-orange-50/80 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20'
                              : 'border border-gray-200 bg-white/80 dark:border-gray-800 dark:bg-gray-900/50'
                          }`}
                        >
                          <div className="mb-2 text-2xl">
                            <Hourglass />
                          </div>
                          <div className="dashboard-heading-4">Expirent bientôt</div>
                          <div className="dashboard-body-sm mt-1">Domaines actifs proches de l&apos;expiration</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => field.onChange('expired')}
                          disabled={loading}
                          className={`rounded-xl border-2 p-4 text-left transition-all ${
                            field.value === 'expired'
                              ? 'border-red-500 bg-gradient-to-br from-red-50/80 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20'
                              : 'border border-gray-200 bg-white/80 dark:border-gray-800 dark:bg-gray-900/50'
                          }`}
                        >
                          <div className="mb-2 text-2xl">
                            <TimerOff />
                          </div>
                          <div className="dashboard-heading-4">Déjà expirés</div>
                          <div className="dashboard-body-sm mt-1">Domaines disponibles à racheter</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => field.onChange('keywords')}
                          disabled={loading}
                          className={`rounded-xl border-2 p-4 text-left transition-all ${
                            field.value === 'keywords'
                              ? 'border-purple-500 bg-gradient-to-br from-purple-50/80 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20'
                              : 'border border-gray-200 bg-white/80 dark:border-gray-800 dark:bg-gray-900/50'
                          }`}
                        >
                          <div className="mb-2 text-2xl">
                            {' '}
                            <WholeWord />{' '}
                          </div>
                          <div className="dashboard-heading-4">Par Keywords</div>
                          <div className="dashboard-body-sm mt-1">Domaines avec beaucoup de mots-clés</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => field.onChange('backlinks')}
                          disabled={loading}
                          className={`rounded-xl border-2 p-4 text-left transition-all ${
                            field.value === 'backlinks'
                              ? 'border-green-500 bg-gradient-to-br from-green-50/80 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20'
                              : 'border border-gray-200 bg-white/80 dark:border-gray-800 dark:bg-gray-900/50'
                          }`}
                        >
                          <div className="mb-2 text-2xl">
                            <Link />
                          </div>
                          <div className="dashboard-heading-4">Par Backlinks</div>
                          <div className="dashboard-body-sm mt-1">Domaines avec beaucoup de liens</div>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Critères spécifiques */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Jours jusqu'à expiration (si expiring) */}
                {searchType === 'expiring' && (
                  <FormField
                    control={form.control}
                    name="daysUntilExpiration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dashboard-heading-4">Expire dans les prochains</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString() || '30'}
                          disabled={loading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-mist-600">
                            <SelectItem value="7" className="hover:cursor-pointer hover:bg-mist-500">
                              7 jours
                            </SelectItem>
                            <SelectItem value="15" className="hover:cursor-pointer hover:bg-mist-500">
                              15 jours
                            </SelectItem>
                            <SelectItem value="30" className="hover:cursor-pointer hover:bg-mist-500">
                              30 jours
                            </SelectItem>
                            <SelectItem value="60" className="hover:cursor-pointer hover:bg-mist-500">
                              60 jours
                            </SelectItem>
                            <SelectItem value="90" className="hover:cursor-pointer hover:bg-mist-500">
                              90 jours
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Min Keywords (si keywords) */}
                {searchType === 'keywords' && (
                  <FormField
                    control={form.control}
                    name="minKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dashboard-heading-4">Minimum de keywords</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            min="1"
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Min Backlinks (si backlinks) */}
                {searchType === 'backlinks' && (
                  <FormField
                    control={form.control}
                    name="minBacklinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dashboard-heading-4">Minimum de backlinks</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            min="1"
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* TLD Filter */}
                <FormField
                  control={form.control}
                  name="tldFilter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dashboard-heading-4">Extension (TLD) - optionnel</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="com, fr, net..."
                          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Info Box */}
              <div className="border-primary/30 from-primary/5 via-primary/5 to-primary/10 dark:from-primary/10 dark:via-primary/10 dark:to-primary/20 rounded-xl border-2 bg-gradient-to-r p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <Globe className="text-primary h-5 w-5" />
                  </div>
                  <div className="dashboard-body-sm text-primary">
                    <strong className="font-semibold">Astuce :</strong> Les domaines expirés avec un bon historique SEO
                    (backlinks, keywords) peuvent être d&apos;excellentes opportunités pour créer des PBN ou lancer de
                    nouveaux projets avec une autorité existante.
                  </div>
                </div>
              </div>

              {/* Bouton */}
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full gap-3 rounded-xl text-base font-semibold shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Recherche en cours...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Rechercher des domaines
                  </>
                )}
              </Button>
            </form>
          </Form>

          {error && (
            <div className="border-destructive/50 bg-destructive/10 mt-6 flex items-start gap-3 rounded-xl border-2 p-4">
              <AlertCircle className="text-destructive h-5 w-5 shrink-0" />
              <div>
                <p className="dashboard-heading-4 text-destructive">Erreur</p>
                <p className="dashboard-body-sm text-destructive/90">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      {loading && (
        <Card className="flex flex-col items-center justify-center border-2 p-16">
          <Loader2 className="text-primary h-16 w-16 animate-spin" />
          <p className="dashboard-body-lg mt-4">Recherche de domaines en cours...</p>
          <p className="dashboard-body-sm mt-2">Cela peut prendre quelques secondes</p>
        </Card>
      )}

      {!loading && domainsData && (
        <div className="space-y-6">
          <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10">
                    <Globe className="h-6 w-6 text-teal-500" />
                  </div>
                  <div>
                    <h2 className="dashboard-heading-2">{domainsData.total_count.toLocaleString()} domaines trouvés</h2>
                    <p className="dashboard-body-sm mt-1">
                      {domainsData.items_count} affichés
                      {searchType === 'expiring' &&
                        ` • Expirent dans les ${form.getValues('daysUntilExpiration')} jours`}
                      {searchType === 'expired' && ' • Domaines expirés disponibles'}
                      {searchType === 'keywords' && ` • Minimum ${form.getValues('minKeywords')} keywords`}
                      {searchType === 'backlinks' && ` • Minimum ${form.getValues('minBacklinks')} backlinks`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {searchType === 'expiring' && (
                    <span className="rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
                      Expirent bientôt
                    </span>
                  )}
                  {searchType === 'expired' && (
                    <span className="text-destructive/90 rounded-lg bg-red-100 px-3 py-1 text-sm font-medium dark:bg-red-950/30 dark:text-red-400">
                      Expirés
                    </span>
                  )}
                  {searchType === 'keywords' && (
                    <span className="rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                      Keywords
                    </span>
                  )}
                  {searchType === 'backlinks' && (
                    <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      🔗 Backlinks
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <DomainWhoisAnalyzer data={domainsData} />
        </div>
      )}
    </div>
  )
}

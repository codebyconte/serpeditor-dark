'use client'

import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/elements/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Globe, Info, Loader2, Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getDomainOverview, type DomainOverviewResponse } from './action'
import DomainOverview from './DomainOverview'

const domainSchema = z.object({
  domain: z
    .string()
    .min(1, 'Veuillez entrer un domaine')
    .refine(
      (val) => {
        // Nettoyer le domaine pour la validation
        let clean = val.trim()
        clean = clean.replace(/^https?:\/\//, '')
        clean = clean.replace(/^www\./, '')
        clean = clean.replace(/\/$/, '')
        // Vérifier que c'est un domaine valide (contient au moins un point et pas d'espaces)
        return clean.includes('.') && !clean.includes(' ') && clean.length > 3
      },
      {
        message: 'Format de domaine invalide. Exemple : exemple.com ou www.exemple.com',
      },
    ),
})

export function DomainOverviewContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [overviewData, setOverviewData] = useState<DomainOverviewResponse | null>(null)

  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: '',
    },
  })

  async function onSubmit(values: z.infer<typeof domainSchema>) {
    // Nettoyer le domaine
    let cleanDomain = values.domain.trim()
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '')
    cleanDomain = cleanDomain.replace(/^www\./, '')
    cleanDomain = cleanDomain.replace(/\/$/, '')

    setLoading(true)
    setError(null)
    setOverviewData(null)

    try {
      const result = await getDomainOverview({
        target: cleanDomain,
        locationCode: 2250, // France par défaut
        languageCode: 'fr', // Français par défaut
        limit: 100,
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError('Aucune donnée trouvée pour ce domaine')
        } else {
          setOverviewData(result.data)
        }
      } else {
        setError(result.error || 'Erreur lors de la récupération des données')
      }
    } catch (err) {
      setError('Une erreur est survenue')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-foreground p-6">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Vue d'Ensemble du Domaine"
          description="Analysez la performance SEO globale de n'importe quel domaine en quelques secondes"
          icon={Globe}
          iconClassName="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 text-primary"
        />

        {/* Formulaire */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Info box */}
                <Alert className="border-primary/20 bg-primary/5">
                  <Info className="text-primary h-5 w-5" />
                  <AlertTitle className="text-foreground">Que va vous révéler cet outil ?</AlertTitle>
                  <AlertDescription className="text-muted-foreground">
                    Découvrez instantanément le nombre de mots-clés positionnés, la distribution des positions (Top 3,
                    Top 10, etc.), la valeur du trafic organique, les tendances (nouveaux mots-clés, positions perdues)
                    et la stratégie SEO vs SEA.
                  </AlertDescription>
                </Alert>

                {/* Input domaine */}
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domaine à analyser</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} placeholder="exemple.com" disabled={loading} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Bouton */}
                <Button
                  type="submit"
                  disabled={loading || !form.watch('domain')?.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:border-primary/50 flex w-full items-center justify-center gap-3 rounded-xl border-2 py-4 text-lg font-semibold shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Analyser le domaine
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Résultats */}
        {loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-16">
              <Loader2 className="text-primary h-16 w-16 animate-spin" />
              <p className="dashboard-body-lg mt-4 font-medium">Analyse du domaine en cours...</p>
              <p className="text-muted-foreground mt-2">Récupération des métriques SEO et positions</p>
            </CardContent>
          </Card>
        )}

        {!loading && overviewData && (
          <div>
            <Card className="mb-6">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <TrendingUp className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="dashboard-heading-3">Analyse complétée</h2>
                    <p className="">
                      {overviewData.items[0]?.metrics.organic.count.toLocaleString()} mots-clés organiques détectés
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary rounded-lg px-4 py-2 text-sm font-medium">
                    Données en temps réel
                  </span>
                </div>
              </CardContent>
            </Card>

            <DomainOverview data={overviewData} />
          </div>
        )}
      </div>
    </div>
  )
}

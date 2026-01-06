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

export default function DomainOverviewPage() {
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
    <div className="text-foreground min-h-screen p-6">
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

        {!loading && !overviewData && !error && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center border-2 border-dashed p-16 text-center">
              <div className="bg-primary/10 rounded-full p-6">
                <Globe className="text-primary h-12 w-12" />
              </div>
              <h3 className="dashboard-heading-3 mt-6">Analysez la performance SEO d&apos;un domaine</h3>
              <p className="mt-2 max-w-md">
                Obtenez une vue d&apos;ensemble complète : mots-clés positionnés, distribution des positions, valeur du
                trafic, tendances et stratégie SEO/SEA
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6 text-left">
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 text-2xl">🎯</div>
                    <h4 className="dashboard-heading-4">Positions détaillées</h4>
                    <p className="text-muted-foreground mt-1">Top 3, Top 10, Top 20... Distribution complète</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 text-2xl">💰</div>
                    <h4 className="dashboard-heading-4">Valeur du trafic</h4>
                    <p className="text-muted-foreground mt-1">Estimation du coût équivalent en Google Ads</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 text-2xl">📈</div>
                    <h4 className="dashboard-heading-4">Tendances</h4>
                    <p className="text-muted-foreground mt-1">Nouveaux mots-clés, positions gagnées/perdues</p>
                  </CardContent>
                </Card>
              </div>

              {/* Exemples */}
              <Alert className="border-primary/20 bg-primary/5 mt-8">
                <Info className="text-primary h-5 w-5" />
                <AlertTitle className="text-foreground">💡 Exemples de domaines :</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['amazon.fr', 'leboncoin.fr', 'cdiscount.com', 'fnac.com', 'decathlon.fr'].map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => form.setValue('domain', example)}
                        className="bg-background hover:bg-accent text-foreground border-border rounded-lg border px-3 py-1 text-sm font-medium transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Section explicative */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <h2 className="dashboard-heading-2 mb-6">Comment utiliser cette analyse ?</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="dashboard-heading-4 mb-3 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    1
                  </span>
                  Analysez vos concurrents
                </h3>
                <p className="text-muted-foreground">
                  Identifiez les forces et faiblesses de vos concurrents directs. Comparez leur nombre de mots-clés,
                  leurs positions dominantes et leur stratégie SEO vs SEA pour découvrir des opportunités.
                </p>
              </div>

              <div>
                <h3 className="dashboard-heading-4 mb-3 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    2
                  </span>
                  Évaluez un client potentiel
                </h3>
                <p className="text-muted-foreground">
                  Avant de proposer vos services SEO, analysez la situation actuelle du client : nombre de mots-clés,
                  positions faibles à améliorer, opportunités inexploitées et potentiel de croissance.
                </p>
              </div>

              <div>
                <h3 className="dashboard-heading-4 mb-3 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    3
                  </span>
                  Suivez votre évolution
                </h3>
                <p className="text-muted-foreground">
                  Analysez régulièrement votre propre domaine pour suivre vos tendances : nouveaux mots-clés gagnés,
                  positions améliorées, et la valeur croissante de votre trafic organique.
                </p>
              </div>

              <div>
                <h3 className="dashboard-heading-4 mb-3 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    4
                  </span>
                  Benchmark votre niche
                </h3>
                <p className="text-muted-foreground">
                  Comparez plusieurs acteurs de votre secteur pour identifier le leader SEO, les stratégies payantes
                  dominantes, et positionner votre site dans le paysage concurrentiel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métriques expliquées */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <h2 className="dashboard-heading-2 mb-6">Comprendre les métriques</h2>

            <div className="space-y-4">
              <Alert className="border-l-primary bg-primary/5 border-l-4">
                <AlertTitle className="text-foreground">Mots-clés organiques</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Nombre total de mots-clés sur lesquels le domaine apparaît dans les résultats Google (positions
                  1-100). Plus le nombre est élevé, plus le domaine est visible.
                </AlertDescription>
              </Alert>

              <Alert className="border-l-primary bg-primary/5 border-l-4">
                <AlertTitle className="text-foreground">Trafic estimé (ETV)</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Estimated Traffic Value : nombre de visites mensuelles estimées en fonction du volume de recherche et
                  des positions. Plus le domaine est bien positionné sur des mots-clés recherchés, plus l&apos;ETV est
                  élevé.
                </AlertDescription>
              </Alert>

              <Alert className="border-l-primary bg-primary/5 border-l-4">
                <AlertTitle className="text-foreground">Valeur du trafic organique</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Coût estimé en Google Ads pour obtenir le même trafic. Si un site a 10,000$ de valeur organique, cela
                  signifie qu&apos;il devrait dépenser 10,000$/mois en publicité pour remplacer ce trafic gratuit.
                </AlertDescription>
              </Alert>

              <Alert className="border-l-primary bg-primary/5 border-l-4">
                <AlertTitle className="text-foreground">Tendances (Nouveaux, En hausse, Perdus)</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  <ul className="list-inside list-disc">
                    <li>
                      <strong>Nouveaux</strong> : Mots-clés fraîchement positionnés (bon signe)
                    </li>
                    <li>
                      <strong>En hausse</strong> : Positions améliorées (stratégie SEO efficace)
                    </li>
                    <li>
                      <strong>En baisse</strong> : Positions dégradées (vigilance nécessaire)
                    </li>
                    <li>
                      <strong>Perdus</strong> : Ne sont plus dans le Top 100 (problème à corriger)
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

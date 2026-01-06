'use client'

import { ClientPageHeader } from '@/components/dashboard/client-page-header'
import { Button } from '@/components/elements/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Search, Target } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getCompetitors, type CompetitorsResponse } from './action'
import CompetitorsAnalyzer from './CompetitorsAnalyzer'

const competitorsSchema = z.object({
  target: z
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
  excludeTopDomains: z.boolean(),
})

export default function CompetitorsAnalyzerPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [competitorsData, setCompetitorsData] = useState<CompetitorsResponse | null>(null)

  const form = useForm<z.infer<typeof competitorsSchema>>({
    resolver: zodResolver(competitorsSchema),
    defaultValues: {
      target: '',
      excludeTopDomains: false,
    },
  })

  async function onSubmit(values: z.infer<typeof competitorsSchema>) {
    // Nettoyer le domaine
    let cleanTarget = values.target.trim()
    cleanTarget = cleanTarget.replace(/^https?:\/\//, '')
    cleanTarget = cleanTarget.replace(/^www\./, '')
    cleanTarget = cleanTarget.replace(/\/$/, '')

    setLoading(true)
    setError(null)
    setCompetitorsData(null)

    try {
      const result = await getCompetitors(cleanTarget, {
        excludeTopDomains: values.excludeTopDomains,
        orderBy: ['metrics.organic.count,desc'],
      })

      if (result.success && result.data) {
        // Si on a des items, afficher les résultats
        if (result.data.items.length > 0) {
          setCompetitorsData(result.data)
        } else if (result.data.total_count > 0) {
          // Si total_count > 0 mais items vide, il y a des concurrents mais pas dans cette page
          setError(
            `Il y a ${result.data.total_count} concurrent(s) identifié(s) pour ce domaine, mais aucun résultat n&apos;a pu être chargé.`,
          )
        } else {
          // Aucun concurrent trouvé
          setError(
            'Aucun concurrent trouvé pour ce domaine. Le domaine n&apos;a peut-être pas encore de positions dans les résultats de recherche Google pour les mots-clés analysés.',
          )
        }
      } else {
        setError(result.error || 'Erreur lors de la récupération des concurrents')
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
        <ClientPageHeader
          title="Analyseur de Concurrents"
          description="Identifiez vos principaux concurrents SEO et analysez leur stratégie"
          icon={Target}
          iconClassName="border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/10 text-orange-500"
        />

        {/* Formulaire */}
        <div className="bg-card mb-8 rounded-2xl border p-8 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Target */}
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dashboard-heading-4">Domaine à analyser</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Target className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                        <Input
                          {...field}
                          placeholder="exemple.com"
                          className="focus:border-ring focus:ring-ring/20 w-full rounded-xl border-2 py-3 pr-4 pl-12 text-lg focus:ring-4"
                          disabled={loading}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="dashboard-body-sm">
                      Entrez le domaine sans https:// ni www.
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Info localisation et langue */}
              <div className="border-primary/20 bg-primary/5 rounded-lg border px-4 py-3">
                <p className="dashboard-body-sm text-primary">
                  <span className="font-semibold">Localisation :</span> France (2250) •{' '}
                  <span className="font-semibold">Langue :</span> Français (fr)
                </p>
              </div>

              {/* Exclude Top Domains */}
              <FormField
                control={form.control}
                name="excludeTopDomains"
                render={({ field }) => (
                  <FormItem>
                    <div className="bg-card hover:bg-card flex items-center gap-3 rounded-xl border-2 px-4 py-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                      </FormControl>
                      <FormLabel className="dashboard-body-sm cursor-pointer font-medium">
                        Exclure les sites majeurs (Wikipedia, Amazon, etc.)
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bouton */}
              <Button
                type="submit"
                disabled={loading || !form.watch('target')?.trim()}
                className="flex w-full items-center justify-center gap-3 rounded-xl border-2 py-4 text-base font-semibold shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Analyser les concurrents
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
        </div>

        {/* Résultats */}
        {loading && (
          <div className="bg-card flex flex-col items-center justify-center rounded-2xl border p-16">
            <Loader2 className="text-primary h-16 w-16 animate-spin" />
            <p className="dashboard-body-lg mt-4">Analyse des concurrents en cours...</p>
            <p className="dashboard-body-sm mt-2">Cela peut prendre quelques secondes</p>
          </div>
        )}

        {!loading && competitorsData && (
          <div className="api-response">
            <div className="api-response-header">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Target className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h2 className="dashboard-heading-3">{competitorsData.target}</h2>
                  <p className="dashboard-body-sm mt-1">
                    {competitorsData.total_count} concurrents trouvés • France • Français
                  </p>
                </div>
              </div>
            </div>

            <div className="api-response-content">
              <CompetitorsAnalyzer data={competitorsData} target={competitorsData.target} />
            </div>
          </div>
        )}

        {!loading && !competitorsData && !error && (
          <div className="border-2-dashed bg-card flex flex-col items-center justify-center rounded-2xl border p-16 text-center">
            <div className="bg-primary/10 rounded-full p-6">
              <Target className="text-primary h-12 w-12" />
            </div>
            <h3 className="dashboard-heading-3 mt-6">Analysez vos concurrents SEO</h3>
            <p className="dashboard-body-sm mt-2 max-w-md">
              Identifiez qui se positionne sur les mêmes mots-clés que vous et découvrez leurs stratégies
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <div className="bg-card rounded-xl border p-4">
                <div className="mb-2 text-2xl">🎯</div>
                <h4 className="dashboard-heading-4">Identifiez vos rivaux</h4>
                <p className="dashboard-body-sm mt-1">Découvrez qui se bat pour les mêmes positions</p>
              </div>
              <div className="bg-card rounded-xl border p-4">
                <div className="mb-2 text-2xl">📊</div>
                <h4 className="dashboard-heading-4">Analysez leur force</h4>
                <p className="dashboard-body-sm mt-1">Keywords, ETV, positions et distribution</p>
              </div>
              <div className="bg-card rounded-xl border p-4">
                <div className="mb-2 text-2xl">🚀</div>
                <h4 className="dashboard-heading-4">Optimisez votre stratégie</h4>
                <p className="dashboard-body-sm mt-1">Trouvez des opportunités de mots-clés</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

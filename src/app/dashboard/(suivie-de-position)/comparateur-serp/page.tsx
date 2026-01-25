'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Calendar, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getHistoricalSERP, type HistoricalSERPResponse } from './action'
import SERPAnalyzerPro from './SERPAnalyzerPro'

const serpFormSchema = z.object({
  keyword: z.string().min(1, 'Le mot-clé est requis'),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

type SerpFormValues = z.infer<typeof serpFormSchema>

// Valeurs fixes pour le public français
const LOCATION_CODE = 2250 // France
const LANGUAGE_CODE = 'fr' // Français

export default function SERPAnalyzerPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serpData, setSerpData] = useState<HistoricalSERPResponse | null>(null)

  const form = useForm<SerpFormValues>({
    resolver: zodResolver(serpFormSchema),
    defaultValues: {
      keyword: '',
      dateFrom: '',
      dateTo: '',
    },
  })

  const onSubmit = async (values: SerpFormValues) => {
    setLoading(true)
    setError(null)
    setSerpData(null)

    try {
      const result = await getHistoricalSERP(values.keyword.trim(), LOCATION_CODE, LANGUAGE_CODE, {
        ...(values.dateFrom && { dateFrom: values.dateFrom }),
        ...(values.dateTo && { dateTo: values.dateTo }),
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError(
            "Aucun historique SERP trouvé pour ce mot-clé sur cette période. Essayez d'élargir votre plage de dates ou utilisez un mot-clé plus générique.",
          )
        } else if (result.data.items.length === 1) {
          setError(
            `Seulement 1 snapshot trouvé. Pour une analyse complète (comparaisons, volatilité), au moins 2 snapshots sont nécessaires. Essayez d'élargir votre plage de dates.`,
          )
          setSerpData(result.data)
        } else {
          setSerpData(result.data)
        }
      } else {
        const errorMessage = result.error || 'Erreur lors de la récupération des données'

        if (errorMessage.includes('401') || errorMessage.includes('403')) {
          setError("Erreur d'authentification API. Vérifiez vos identifiants.")
        } else if (errorMessage.includes('429')) {
          setError('Limite de requêtes API atteinte. Veuillez patienter quelques minutes.')
        } else if (errorMessage.includes('500')) {
          setError('Erreur serveur. Réessayez dans quelques instants.')
        } else {
          setError(errorMessage)
        }
      }
    } catch {
      setError("Une erreur est survenue lors de la connexion à l'API. Vérifiez votre connexion internet.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl space-y-8 py-8">
      <Card className="border-primary/20 bg-primary/5 my-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg">
              <Search className="text-primary-foreground h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">Analyseur SERP Historique</h1>
              <p className="dashboard-body-lg text-muted-foreground mt-2">Analysez l&apos;évolution des SERP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-2">Paramètres d&apos;analyse</CardTitle>
          <CardDescription>Configurez votre recherche d&apos;historique SERP</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Mot-clé */}
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dashboard-heading-4">Mot-clé à analyser</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                        <Input
                          placeholder="Exemple: agence seo paris"
                          className="pl-12"
                          disabled={loading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Entrez le mot-clé pour lequel vous souhaitez analyser l&apos;historique SERP
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Période */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dateFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dashboard-heading-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date de début (optionnel)
                      </FormLabel>
                      <FormControl>
                        <Input type="date" disabled={loading} {...field} />
                      </FormControl>
                      <FormDescription>Date de début de la période d&apos;analyse</FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dashboard-heading-4">Date de fin (optionnel)</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={loading} {...field} />
                      </FormControl>
                      <FormDescription>Date de fin de la période d&apos;analyse</FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bouton */}
              <Button
                type="submit"
                disabled={loading || !form.watch('keyword')?.trim()}
                className="w-full bg-mist-100 text-black hover:cursor-pointer hover:bg-mist-200"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Analyser l&apos;historique SERP
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
        <Card className="min-h-[400px]">
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-16">
            <Loader2 className="text-primary h-16 w-16 animate-spin" />
            <p className="dashboard-body-lg mt-4">Récupération de l&apos;historique SERP...</p>
            <p className="dashboard-body-sm text-muted-foreground mt-2">Cela peut prendre quelques secondes</p>
          </CardContent>
        </Card>
      )}

      {!loading && serpData && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-lg p-3">
                <Search className="text-primary-foreground h-6 w-6" />
              </div>
              <div>
                <CardTitle className="dashboard-heading-2">{serpData.keyword}</CardTitle>
                <CardDescription className="dashboard-body-sm mt-1">
                  {serpData.items.length} snapshot{serpData.items.length > 1 ? 's' : ''} historique
                  {serpData.items.length > 1 ? 's' : ''}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SERPAnalyzerPro data={serpData.items} keyword={serpData.keyword} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

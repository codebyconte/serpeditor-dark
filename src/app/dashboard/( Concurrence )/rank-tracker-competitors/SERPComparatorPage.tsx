'use client'

import { Button } from '@/components/elements/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getSERPCompetitors, type SERPCompetitorsResponse } from './actions'
import SERPAnalyzerPro from './SERPAnalyzerPro'

const competitorFormSchema = z.object({
  keyword: z.string().min(1, 'Le mot-clé est requis'),
})

type CompetitorFormValues = z.infer<typeof competitorFormSchema>

export default function SERPComparatorPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [competitorsData, setCompetitorsData] = useState<SERPCompetitorsResponse | null>(null)
  const [searchedKeyword, setSearchedKeyword] = useState('')

  const form = useForm<CompetitorFormValues>({
    resolver: zodResolver(competitorFormSchema),
    defaultValues: {
      keyword: '',
    },
  })

  const onSubmit = async (values: CompetitorFormValues) => {
    setLoading(true)
    setError(null)
    setCompetitorsData(null)

    try {
      const result = await getSERPCompetitors([values.keyword.trim()], {
        limit: 100,
        orderBy: ['rating,desc'],
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError('Aucun concurrent trouvé pour ce mot-clé. Essayez avec un autre mot-clé.')
        } else {
          setCompetitorsData(result.data)
          setSearchedKeyword(values.keyword.trim())
        }
      } else {
        setError(result.error || 'Erreur lors de la récupération des données')
      }
    } catch {
      setError('Une erreur est survenue lors de la recherche')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 py-8">
      {/* Formulaire de recherche */}
      <Card>
        <CardHeader>
          <CardDescription>Entrez un mot-clé pour identifier vos concurrents dans les résultats Google</CardDescription>
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
                      Le mot-clé pour lequel vous souhaitez identifier les concurrents dans les résultats de recherche
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bouton de recherche */}
              <Button type="submit" disabled={loading || !form.watch('keyword')?.trim()} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Identifier les concurrents
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Erreur */}
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
            <p className="dashboard-body-lg mt-4">Identification des concurrents en cours...</p>
            <p className="dashboard-body-sm text-muted-foreground mt-2">
              Analyse des domaines présents dans les résultats de recherche
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && competitorsData && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-lg p-3">
                  <Search className="text-primary-foreground h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="dashboard-heading-2">
                    Analyse des concurrents : &quot;{searchedKeyword}&quot;
                  </CardTitle>
                  <CardDescription className="dashboard-body-sm mt-1">
                    {competitorsData.total_count} concurrent
                    {competitorsData.total_count > 1 ? 's' : ''} identifié
                    {competitorsData.total_count > 1 ? 's' : ''} dans les résultats de recherche Google
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SERPAnalyzerPro competitorsData={competitorsData} keyword={searchedKeyword} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

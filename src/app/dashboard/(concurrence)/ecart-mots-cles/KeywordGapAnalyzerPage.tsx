'use client'

import { Button } from '@/components/elements/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, GitCompare, Info, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getKeywordGap, type KeywordGapResponse } from './action'
import KeywordGapAnalyzer from './KeywordGapAnalyzer'

// Fonction pour nettoyer un domaine
function cleanDomain(domain: string): string {
  let clean = domain.trim()
  clean = clean.replace(/^https?:\/\//, '')
  clean = clean.replace(/^www\./, '')
  clean = clean.replace(/\/$/, '')
  return clean
}

const keywordGapSchema = z
  .object({
    target1: z
      .string()
      .min(1, 'Veuillez entrer le premier domaine')
      .refine(
        (val) => {
          const clean = cleanDomain(val)
          return clean.includes('.') && !clean.includes(' ') && clean.length > 3
        },
        {
          message: 'Format de domaine invalide. Exemple : exemple.com',
        },
      ),
    target2: z
      .string()
      .min(1, 'Veuillez entrer le deuxième domaine')
      .refine(
        (val) => {
          const clean = cleanDomain(val)
          return clean.includes('.') && !clean.includes(' ') && clean.length > 3
        },
        {
          message: 'Format de domaine invalide. Exemple : votresite.com',
        },
      ),
    analysisMode: z.enum(['gaps', 'common']),
  })
  .refine((data) => cleanDomain(data.target1) !== cleanDomain(data.target2), {
    message: 'Les deux domaines doivent être différents',
    path: ['target2'],
  })

export default function KeywordGapAnalyzerPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [keywordData, setKeywordData] = useState<KeywordGapResponse | null>(null)

  const form = useForm<z.infer<typeof keywordGapSchema>>({
    resolver: zodResolver(keywordGapSchema),
    defaultValues: {
      target1: '',
      target2: '',
      analysisMode: 'gaps',
    },
  })

  const analysisMode = form.watch('analysisMode')

  async function onSubmit(values: z.infer<typeof keywordGapSchema>) {
    const cleanTarget1 = cleanDomain(values.target1)
    const cleanTarget2 = cleanDomain(values.target2)

    setLoading(true)
    setError(null)
    setKeywordData(null)

    try {
      const result = await getKeywordGap({
        target1: cleanTarget1,
        target2: cleanTarget2,
        locationCode: 2250, // France
        languageCode: 'fr', // Français
        intersections: values.analysisMode === 'common', // false = gaps, true = communs
        includeSubdomains: true, // Inclure les sous-domaines par défaut
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError('Aucun mot-clé trouvé avec ces critères')
        } else {
          setKeywordData(result.data)
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
    <div className="">
      <div className="mx-auto max-w-7xl">
        {/* Formulaire */}
        <div className="bg-card mb-8 rounded-2xl border p-8 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Explication mode */}
              <Alert className="border-primary/30 bg-primary/5">
                <Info className="text-primary h-5 w-5 shrink-0" />
                <AlertTitle className="text-primary">Modes d&apos;analyse</AlertTitle>
                <AlertDescription className="text-primary text-sm">
                  <strong className="font-semibold">Mode Écart :</strong> Trouvez les mots-clés où votre concurrent se
                  positionne mais PAS vous. Ce sont vos meilleures opportunités !
                  <br />
                  <strong className="mt-2 block font-semibold">Mode Communs :</strong> Comparez vos positions communes
                  pour identifier où vous devez progresser.
                </AlertDescription>
              </Alert>

              {/* Mode d'analyse */}
              <FormField
                control={form.control}
                name="analysisMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Mode d&apos;analyse</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => field.onChange('gaps')}
                          disabled={loading}
                          className={`rounded-xl border-2 p-6 text-left transition-all ${
                            field.value === 'gaps'
                              ? 'border-mist-100 bg-mist-600'
                              : 'border-border bg-card hover:bg-accent'
                          }`}
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <span className="dashboard-heading-4">Écart de Mots-clés</span>
                          </div>
                          <p className="text-muted-foreground">
                            <strong>Concurrent positionné, VOUS NON</strong>
                            <br />
                            Découvrez les opportunités SEO manquées
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => field.onChange('common')}
                          disabled={loading}
                          className={`rounded-xl border-2 p-6 text-left transition-all ${
                            field.value === 'common'
                              ? 'border-mist-100 bg-mist-600'
                              : 'border-border bg-card hover:bg-accent'
                          }`}
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <GitCompare className="text-primary h-6 w-6" />
                            <span className="dashboard-heading-4">Mots-clés Communs</span>
                          </div>
                          <p className="text-muted-foreground">
                            <strong>Les 2 sont positionnés</strong>
                            <br />
                            Comparez vos positions pour progresser
                          </p>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Domaines */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Target 1 */}
                <FormField
                  control={form.control}
                  name="target1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        {analysisMode === 'gaps' ? (
                          <>
                            Concurrent <span className="text-green-500">(positionné)</span>{' '}
                            <span className="text-destructive">*</span>
                          </>
                        ) : (
                          <>
                            Domaine 1 <span className="text-destructive">*</span>
                          </>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="exemple.com"
                          disabled={loading}
                          className="focus:border-green-500 focus:ring-green-500/20"
                          {...field}
                        />
                      </FormControl>
                      {analysisMode === 'gaps' && (
                        <FormDescription className="dashboard-text-xs">
                          Le concurrent qui SE POSITIONNE sur les mots-clés
                        </FormDescription>
                      )}
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Target 2 */}
                <FormField
                  control={form.control}
                  name="target2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        {analysisMode === 'gaps' ? (
                          <>
                            Votre site <span className="text-destructive">(non positionné)</span>{' '}
                            <span className="text-destructive">*</span>
                          </>
                        ) : (
                          <>
                            Domaine 2 <span className="text-destructive">*</span>
                          </>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="votresite.com"
                          disabled={loading}
                          className="focus:border-red-500 focus:ring-red-500/20"
                          {...field}
                        />
                      </FormControl>
                      {analysisMode === 'gaps' && (
                        <FormDescription className="dashboard-text-xs">
                          Votre site qui NE SE POSITIONNE PAS sur ces mots-clés
                        </FormDescription>
                      )}
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bouton */}
              <Button type="submit" disabled={loading} className="w-full hover:cursor-pointer" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    {analysisMode === 'gaps' ? 'Trouver les opportunités' : 'Comparer les positions'}
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
            <p className="mt-4 text-lg font-medium">
              {analysisMode === 'gaps' ? 'Recherche des opportunités SEO...' : 'Analyse des positions communes...'}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">Cela peut prendre quelques secondes</p>
          </div>
        )}

        {!loading && keywordData && (
          <div>
            <div className="bg-card mb-6 flex items-center justify-between rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-foreground text-xl font-bold">
                    {keywordData.total_count.toLocaleString()} mot
                    {keywordData.total_count > 1 ? 's' : ''}-clé
                    {keywordData.total_count > 1 ? 's' : ''} {analysisMode === 'gaps' ? "d'opportunité" : 'commun'}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {keywordData.items_count} affichés • Analyse{' '}
                    {analysisMode === 'gaps' ? 'des écarts' : 'comparative'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {analysisMode === 'gaps' ? (
                  <span className="rounded-lg bg-mist-200 px-4 py-2 text-sm font-medium text-mist-700">
                    Opportunités SEO
                  </span>
                ) : (
                  <span className="bg-primary/10 text-primary rounded-lg px-4 py-2 text-sm font-medium">
                    Positions communes
                  </span>
                )}
              </div>
            </div>

            <KeywordGapAnalyzer data={keywordData} isGapMode={analysisMode === 'gaps'} />
          </div>
        )}
      </div>
    </div>
  )
}

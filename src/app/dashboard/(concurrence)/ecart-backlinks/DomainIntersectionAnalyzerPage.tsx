'use client'

import { Button, SoftButton } from '@/components/elements/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, GitMerge, Loader2, Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getDomainIntersection, type DomainIntersectionResponse } from './action'
import DomainIntersectionAnalyzer from './DomainIntersectionAnalyzer'

// Fonction pour nettoyer un domaine
function cleanDomain(domain: string): string {
  let clean = domain.trim()
  clean = clean.replace(/^https?:\/\//, '')
  clean = clean.replace(/^www\./, '')
  clean = clean.replace(/\/$/, '')
  return clean
}

const domainIntersectionSchema = z.object({
  targets: z
    .array(
      z
        .string()
        .min(1, 'Veuillez entrer un domaine')
        .refine(
          (val) => {
            const clean = cleanDomain(val)
            return clean.includes('.') && !clean.includes(' ') && clean.length > 3
          },
          {
            message: 'Format de domaine invalide. Exemple : exemple.com',
          },
        ),
    )
    .min(2, 'Veuillez entrer au moins 2 domaines')
    .max(5, 'Maximum 5 domaines autorisés'),
  excludeTargets: z.array(z.string()),
})

export default function DomainIntersectionAnalyzerPage() {
  const [showExclude, setShowExclude] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intersectionData, setIntersectionData] = useState<DomainIntersectionResponse | null>(null)

  type FormValues = {
    targets: string[]
    excludeTargets: string[]
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(domainIntersectionSchema),
    defaultValues: {
      targets: ['', ''],
      excludeTargets: [],
    },
  })

  const {
    fields: targetFields,
    append: appendTarget,
    remove: removeTarget,
  } = useFieldArray({
    control: form.control,
    // @ts-expect-error - Type inference issue with useFieldArray
    name: 'targets',
  })

  const {
    fields: excludeFields,
    append: appendExclude,
    remove: removeExclude,
  } = useFieldArray({
    control: form.control,
    // @ts-expect-error - Type inference issue with useFieldArray
    name: 'excludeTargets',
  })

  const addTarget = () => {
    if (targetFields.length < 5) {
      appendTarget('')
    }
  }

  const addExcludeTarget = () => {
    if (excludeFields.length < 10) {
      appendExclude('')
    }
  }

  async function onSubmit(values: z.infer<typeof domainIntersectionSchema>) {
    // Nettoyer les targets
    const cleanedTargets = values.targets.map((t) => cleanDomain(t)).filter((t) => t.length > 0)

    if (cleanedTargets.length < 2) {
      setError('Veuillez entrer au moins 2 domaines cibles')
      return
    }

    // Créer l'objet targets
    const targetsObject: Record<string, string> = {}
    cleanedTargets.forEach((target, idx) => {
      targetsObject[String(idx + 1)] = target
    })

    // Nettoyer les exclusions
    const cleanedExcludes = values.excludeTargets?.map((t) => cleanDomain(t)).filter((t) => t.length > 0)

    setLoading(true)
    setError(null)
    setIntersectionData(null)

    try {
      const result = await getDomainIntersection({
        targets: targetsObject,
        excludeTargets: cleanedExcludes && cleanedExcludes.length > 0 ? cleanedExcludes : undefined,
        intersectionMode: 'all', // Mode fixé à "all"
        limit: 100, // Limite fixée à 100
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError('Aucun domaine trouvé avec ces critères')
        } else {
          setIntersectionData(result.data)
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
        <Card className="mb-8">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Explication */}
                <Alert className="border-primary/20 bg-primary/5">
                  <GitMerge className="text-primary h-5 w-5 shrink-0" />
                  <AlertTitle className="text-primary">Comment ça marche ?</AlertTitle>
                  <AlertDescription className="text-primary text-sm">
                    Entrez les domaines de vos concurrents. L&apos;outil trouvera les sites qui pointent vers plusieurs
                    d&apos;entre eux - ce sont vos meilleures opportunités de backlinks car ces sites sont déjà
                    intéressés par votre thématique !
                  </AlertDescription>
                </Alert>

                {/* Domaines cibles */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <FormLabel className="dashboard-body-sm font-semibold">
                      Domaines Cibles <span className="text-destructive">*</span>
                    </FormLabel>
                    <span className="dashboard-text-xs text-muted-foreground">
                      {form.watch('targets').filter((t) => t.trim()).length}/5 domaines
                    </span>
                  </div>
                  <div className="space-y-3">
                    {targetFields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`targets.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                                {index + 1}
                              </div>
                              <FormControl>
                                <Input
                                  placeholder="exemple.com ou https://exemple.com/page"
                                  disabled={loading}
                                  {...field}
                                />
                              </FormControl>
                              {targetFields.length > 2 && (
                                <Button
                                  type="button"
                                  onClick={() => removeTarget(index)}
                                  disabled={loading}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <X className="h-5 w-5" />
                                </Button>
                              )}
                            </div>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  {targetFields.length < 5 && (
                    <SoftButton
                      type="button"
                      onClick={addTarget}
                      disabled={loading}
                      className="mt-3 w-full"
                      color="light"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un domaine cible
                    </SoftButton>
                  )}
                </div>

                {/* Domaines à exclure */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <SoftButton
                      type="button"
                      onClick={() => setShowExclude(!showExclude)}
                      className="dashboard-body-sm font-semibold"
                    >
                      {showExclude ? '▼' : '▶'} Exclure certains domaines (optionnel)
                    </SoftButton>
                    {(form.watch('excludeTargets')?.filter((t) => t.trim()).length ?? 0) > 0 && (
                      <span className="dashboard-text-xs text-muted-foreground">
                        {form.watch('excludeTargets')?.filter((t) => t.trim()).length ?? 0}/10 exclusions
                      </span>
                    )}
                  </div>

                  {showExclude && (
                    <Card className="space-y-3">
                      <CardContent className="p-4">
                        {excludeFields.length === 0 ? (
                          <p className="dashboard-body-sm text-muted-foreground">Aucune exclusion configurée</p>
                        ) : (
                          excludeFields.map((field, index) => (
                            <FormField
                              key={field.id}
                              control={form.control}
                              name={`excludeTargets.${index}`}
                              render={({ field }) => (
                                <FormItem className="mb-3">
                                  <div className="flex items-center gap-3">
                                    <FormControl>
                                      <Input placeholder="domaine-a-exclure.com" disabled={loading} {...field} />
                                    </FormControl>
                                    <Button
                                      type="button"
                                      onClick={() => removeExclude(index)}
                                      disabled={loading}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />
                          ))
                        )}
                        {excludeFields.length < 10 && (
                          <SoftButton type="button" onClick={addExcludeTarget} disabled={loading} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une exclusion
                          </SoftButton>
                        )}
                        <FormDescription className="dashboard-text-xs mt-2">
                          Les résultats excluront les domaines qui pointent vers ces sites
                        </FormDescription>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Bouton */}
                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Analyser l&apos;intersection
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
          <div className="bg-card flex flex-col items-center justify-center rounded-2xl border p-16">
            <Loader2 className="text-primary h-16 w-16 animate-spin" />
            <p className="mt-4 text-lg font-medium">Analyse de l&apos;intersection en cours...</p>
            <p className="text-muted-foreground mt-2 text-sm">Recherche des domaines communs entre vos targets</p>
          </div>
        )}

        {!loading && intersectionData && (
          <div>
            <div className="bg-card mb-6 flex items-center justify-between rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <GitMerge className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-foreground text-xl font-bold">
                    {intersectionData.total_count.toLocaleString()} domaines référents trouvés
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {intersectionData.items_count} affichés • {Object.keys(intersectionData.targets).length} targets
                    analysées
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-lg px-3 py-1 text-sm font-medium">Tous</span>
              </div>
            </div>

            <DomainIntersectionAnalyzer data={intersectionData} />
          </div>
        )}
      </div>
    </div>
  )
}

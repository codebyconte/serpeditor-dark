'use client'

import { Button } from '@/components/elements/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link as LinkIcon, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { getBacklinks, type BacklinksResponse } from './action'
import BacklinksAnalyzer from './BacklinksAnalyzer'

const backlinksFormSchema = z.object({
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

type BacklinksFormValues = z.infer<typeof backlinksFormSchema>

export default function FormBacklinksAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [backlinksData, setBacklinksData] = useState<BacklinksResponse | null>(null)

  const form = useForm<BacklinksFormValues>({
    resolver: zodResolver(backlinksFormSchema),
    defaultValues: {
      target: '',
    },
  })

  const onSubmit = async (values: BacklinksFormValues) => {
    setLoading(true)
    setBacklinksData(null)

    const loadingToast = toast.loading('Analyse des backlinks en cours...')

    try {
      const result = await getBacklinks(values.target.trim(), {
        includeSubdomains: true,
        includeIndirectLinks: true,
        excludeInternalBacklinks: true,
        orderBy: ['rank,desc'],
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          toast.error('Aucun backlink trouvé pour cette cible', { id: loadingToast })
        } else {
          setBacklinksData(result.data)
          toast.success(`${result.data.total_count.toLocaleString()} backlinks trouvés`, { id: loadingToast })
        }
      } else {
        toast.error(result.error || 'Erreur lors de la récupération des backlinks', { id: loadingToast })
      }
    } catch (err) {
      console.error(err)
      toast.error('Une erreur est survenue lors de l&apos;analyse', { id: loadingToast })
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
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domaine ou URL à analyser</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LinkIcon className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                          <Input
                            {...field}
                            placeholder="exemple.com ou https://exemple.com/page"
                            className="border-2-input bg-background focus:border-ring focus:ring-ring/20 pr-4 pl-12 text-lg focus:ring-4"
                            disabled={loading}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Pour un domaine, tapez sans https:// ni www. Pour une page, utilisez l&apos;URL complète.
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full hover:cursor-pointer">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Analyser les backlinks
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Résultats */}
        {loading && (
          <Card>
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-16">
              <Loader2 className="text-primary h-16 w-16 animate-spin" />
              <p className="mt-4 text-lg font-medium">Analyse des backlinks en cours...</p>
              <p className="text-muted-foreground mt-2 text-sm">Cela peut prendre quelques secondes</p>
            </CardContent>
          </Card>
        )}

        {!loading && backlinksData && (
          <div>
            <Card className="mb-6">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <LinkIcon className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="dashboard-heading-3">{backlinksData.target}</h2>
                    <p className="text-muted-foreground dashboard-body-sm mt-1">
                      {backlinksData.total_count.toLocaleString()} backlinks trouvés • {backlinksData.items_count}{' '}
                      affichés
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <BacklinksAnalyzer data={backlinksData} target={backlinksData.target} />
          </div>
        )}
      </div>
    </div>
  )
}

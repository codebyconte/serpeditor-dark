// 📁 app/dashboard/keyword-magic/components/search-form.tsx
'use client'

import { Button } from '@/components/elements/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Filter, Loader2, Search, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Schéma de validation Zod
const searchFormSchema = z.object({
  keyword: z.string().min(1, 'Le mot-clé est requis'),
  minVolume: z.string().optional(),
  maxVolume: z.string().optional(),
  minCPC: z.string().optional(),
  maxCPC: z.string().optional(),
  competitionLevel: z.enum(['all', 'low', 'medium', 'high']),
})

interface SearchFormProps {
  keyword: string
  onKeywordChange: (value: string) => void
  minVolume: string
  maxVolume: string
  minCPC: string
  maxCPC: string
  competitionLevel: string
  onMinVolumeChange: (value: string) => void
  onMaxVolumeChange: (value: string) => void
  onMinCPCChange: (value: string) => void
  onMaxCPCChange: (value: string) => void
  onCompetitionLevelChange: (value: string) => void
  onSearch: () => void
  isLoading: boolean
}

export function SearchForm({
  keyword,
  onKeywordChange,
  minVolume,
  maxVolume,
  minCPC,
  maxCPC,
  competitionLevel,
  onMinVolumeChange,
  onMaxVolumeChange,
  onMinCPCChange,
  onMaxCPCChange,
  onCompetitionLevelChange,
  onSearch,
  isLoading,
}: SearchFormProps) {
  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      keyword: keyword || '',
      minVolume: minVolume || '',
      maxVolume: maxVolume || '',
      minCPC: minCPC || '',
      maxCPC: maxCPC || '',
      competitionLevel: ((competitionLevel as 'all' | 'low' | 'medium' | 'high') || 'all') as
        | 'all'
        | 'low'
        | 'medium'
        | 'high',
    },
  })

  // Synchroniser les valeurs du formulaire avec les props externes
  useEffect(() => {
    form.setValue('keyword', keyword)
  }, [keyword, form])

  useEffect(() => {
    form.setValue('minVolume', minVolume)
  }, [minVolume, form])

  useEffect(() => {
    form.setValue('maxVolume', maxVolume)
  }, [maxVolume, form])

  useEffect(() => {
    form.setValue('minCPC', minCPC)
  }, [minCPC, form])

  useEffect(() => {
    form.setValue('maxCPC', maxCPC)
  }, [maxCPC, form])

  useEffect(() => {
    form.setValue(
      'competitionLevel',
      ((competitionLevel as 'all' | 'low' | 'medium' | 'high') || 'all') as 'all' | 'low' | 'medium' | 'high',
    )
  }, [competitionLevel, form])

  // Surveiller les changements et mettre à jour le parent
  const watchedValues = form.watch()

  useEffect(() => {
    if (watchedValues.keyword !== keyword) {
      onKeywordChange(watchedValues.keyword || '')
    }
  }, [watchedValues.keyword, keyword, onKeywordChange])

  useEffect(() => {
    if (watchedValues.minVolume !== minVolume) {
      onMinVolumeChange(watchedValues.minVolume || '')
    }
  }, [watchedValues.minVolume, minVolume, onMinVolumeChange])

  useEffect(() => {
    if (watchedValues.maxVolume !== maxVolume) {
      onMaxVolumeChange(watchedValues.maxVolume || '')
    }
  }, [watchedValues.maxVolume, maxVolume, onMaxVolumeChange])

  useEffect(() => {
    if (watchedValues.minCPC !== minCPC) {
      onMinCPCChange(watchedValues.minCPC || '')
    }
  }, [watchedValues.minCPC, minCPC, onMinCPCChange])

  useEffect(() => {
    if (watchedValues.maxCPC !== maxCPC) {
      onMaxCPCChange(watchedValues.maxCPC || '')
    }
  }, [watchedValues.maxCPC, maxCPC, onMaxCPCChange])

  useEffect(() => {
    if (watchedValues.competitionLevel !== competitionLevel) {
      onCompetitionLevelChange(watchedValues.competitionLevel || 'all')
    }
  }, [watchedValues.competitionLevel, competitionLevel, onCompetitionLevelChange])

  const onSubmit = (values: z.infer<typeof searchFormSchema>) => {
    // Mettre à jour tous les états du parent avant de lancer la recherche
    onKeywordChange(values.keyword)
    onMinVolumeChange(values.minVolume || '')
    onMaxVolumeChange(values.maxVolume || '')
    onMinCPCChange(values.minCPC || '')
    onMaxCPCChange(values.maxCPC || '')
    onCompetitionLevelChange(values.competitionLevel)
    // Lancer la recherche
    onSearch()
  }

  return (
    <Card className="border-2-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Recherche de mots-clés
        </CardTitle>
        <CardDescription>Entrez un mot-clé seed pour découvrir des opportunités</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Recherche principale */}
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Ex: marketing digital, recette gateau..."
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && form.handleSubmit(onSubmit)(e)}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading || !form.watch('keyword')?.trim()}
                className="hover:cursor-pointer"
                size="md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recherche...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyser
                  </>
                )}
              </Button>
            </div>

            {/* Filtres avancés */}
            <details className="group rounded-lg border p-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-medium">
                <Filter className="h-4 w-4" />
                Filtres avancés
                <span className="text-muted-foreground ml-auto text-sm group-open:hidden">Cliquez pour ouvrir</span>
              </summary>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="minVolume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume minimum</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" min="0" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxVolume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume maximum</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10000" min="0" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="competitionLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau de concurrence</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card">
                          <SelectItem value="all">Tous niveaux</SelectItem>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="high">Élevé</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minCPC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPC minimum ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.50" min="0" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxCPC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPC maximum ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="5.00" min="0" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </details>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

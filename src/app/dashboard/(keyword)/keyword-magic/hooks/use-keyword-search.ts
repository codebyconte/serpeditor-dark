// 📁 app/dashboard/keyword-magic/hooks/use-keyword-search.ts
'use client'

import { useCallback, useState } from 'react'
import { fetchKeywordIdeas, fetchKeywordSuggestions, fetchRelatedKeywords } from '../action'
import type { APIResponse, FilterExpression, KeywordItem } from '../types'

interface SearchParams {
  keyword: string
  locationCode: number
  languageCode: string
  minVolume?: string
  maxVolume?: string
  minCPC?: string
  maxCPC?: string
  competitionLevel?: string
}

export function useKeywordSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestionsData, setSuggestionsData] = useState<APIResponse<KeywordItem> | null>(null)
  const [ideasData, setIdeasData] = useState<APIResponse<KeywordItem> | null>(null)
  const [relatedData, setRelatedData] = useState<APIResponse<KeywordItem> | null>(null)

  const buildFilters = useCallback((params: SearchParams): FilterExpression | undefined => {
    const filterConditions: Array<[string, string, string | number]> = []

    if (params.minVolume?.trim()) {
      filterConditions.push(['keyword_info.search_volume', '>=', parseInt(params.minVolume)])
    }
    if (params.maxVolume?.trim()) {
      filterConditions.push(['keyword_info.search_volume', '<=', parseInt(params.maxVolume)])
    }
    if (params.minCPC?.trim()) {
      filterConditions.push(['keyword_info.cpc', '>=', parseFloat(params.minCPC)])
    }
    if (params.maxCPC?.trim()) {
      filterConditions.push(['keyword_info.cpc', '<=', parseFloat(params.maxCPC)])
    }
    if (params.competitionLevel && params.competitionLevel !== 'all') {
      filterConditions.push(['keyword_info.competition_level', '=', params.competitionLevel.toUpperCase()])
    }

    if (filterConditions.length === 0) return undefined
    if (filterConditions.length === 1) return filterConditions[0]

    // Construire l'expression de filtre combinée
    let result: FilterExpression = filterConditions[0]
    for (let i = 1; i < filterConditions.length; i++) {
      result = [result, 'and', filterConditions[i]] as FilterExpression
    }
    return result
  }, [])

  const searchSuggestions = useCallback(
    async (params: SearchParams) => {
      if (!params.keyword.trim()) {
        setError('Veuillez entrer un mot-clé')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const filters = buildFilters(params)
        const result = await fetchKeywordSuggestions({
          keyword: params.keyword.trim(),
          locationCode: params.locationCode,
          languageCode: params.languageCode,
          filters,
          limit: 1000,
          includeSerp: true,
          includeClickstream: false,
        })

        if (result.success && result.results) {
          setSuggestionsData(result)
        } else {
          setError(result.error || 'Erreur lors de la recherche')
        }
      } catch {
        setError('Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    },
    [buildFilters],
  )

  const searchRelated = useCallback(
    async (params: SearchParams) => {
      if (!params.keyword.trim()) {
        setError('Veuillez entrer un mot-clé')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const filters = buildFilters(params)
        const result = await fetchRelatedKeywords({
          keyword: params.keyword.trim(),
          locationCode: params.locationCode,
          languageCode: params.languageCode,
          filters,
          depth: 2,
          limit: 1000,
          includeSerp: true,
          includeClickstream: false,
        })

        if (result.success && result.results) {
          setRelatedData(result)
        } else {
          setError(result.error || 'Erreur lors de la recherche')
        }
      } catch {
        setError('Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    },
    [buildFilters],
  )

  const searchIdeas = useCallback(
    async (params: SearchParams) => {
      if (!params.keyword.trim()) {
        setError('Veuillez entrer un mot-clé')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const filters = buildFilters(params)
        const trimmedKeyword = params.keyword.trim()
        const result = await fetchKeywordIdeas({
          keyword: trimmedKeyword,
          keywords: [trimmedKeyword],
          locationCode: params.locationCode,
          languageCode: params.languageCode,
          filters,
          limit: 1000,
          includeSerp: true,
          includeClickstream: false,
        })

        if (result.success && result.results) {
          setIdeasData(result)
        } else {
          setError(result.error || 'Erreur lors de la recherche')
        }
      } catch {
        setError('Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    },
    [buildFilters],
  )

  const searchAll = useCallback(
    async (params: SearchParams) => {
      if (!params.keyword.trim()) {
        setError('Veuillez entrer un mot-clé')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const filters = buildFilters(params)
        const baseParams = {
          keyword: params.keyword.trim(),
          locationCode: params.locationCode,
          languageCode: params.languageCode,
          filters,
          limit: 1000,
          includeSerp: true,
          includeClickstream: false,
        }

        // Lancer tous les appels API en parallèle
        const [suggestionsResult, relatedResult, ideasResult] = await Promise.allSettled([
          fetchKeywordSuggestions(baseParams),
          fetchRelatedKeywords({ ...baseParams, depth: 2 }),
          fetchKeywordIdeas({
            ...baseParams,
            keyword: params.keyword.trim(),
            keywords: [params.keyword.trim()],
          }),
        ])

        // Traiter les résultats
        if (suggestionsResult.status === 'fulfilled') {
          if (suggestionsResult.value.success) {
            setSuggestionsData(suggestionsResult.value)
          }
        }

        if (relatedResult.status === 'fulfilled') {
          if (relatedResult.value.success) {
            setRelatedData(relatedResult.value)
          }
        }

        if (ideasResult.status === 'fulfilled') {
          if (ideasResult.value.success) {
            setIdeasData(ideasResult.value)
          }
        }

        // Vérifier s'il y a des erreurs
        const errors: string[] = []
        if (suggestionsResult.status === 'fulfilled' && !suggestionsResult.value.success) {
          errors.push(suggestionsResult.value.error || 'Erreur suggestions')
        }
        if (relatedResult.status === 'fulfilled' && !relatedResult.value.success) {
          errors.push(relatedResult.value.error || 'Erreur related')
        }
        if (ideasResult.status === 'fulfilled' && !ideasResult.value.success) {
          errors.push(ideasResult.value.error || 'Erreur ideas')
        }

        if (errors.length > 0 && errors.length === 3) {
          // Toutes les requêtes ont échoué
          setError(errors[0] || 'Erreur lors de la recherche')
        } else if (errors.length > 0) {
          // Certaines ont échoué mais pas toutes
          console.warn('Certaines requêtes ont échoué:', errors)
        }
      } catch {
        setError('Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    },
    [buildFilters],
  )

  const clearResults = useCallback(() => {
    setSuggestionsData(null)
    setIdeasData(null)
    setRelatedData(null)
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    suggestionsData,
    ideasData,
    relatedData,
    searchSuggestions,
    searchRelated,
    searchIdeas,
    searchAll,
    clearResults,
  }
}

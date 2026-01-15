// 📁 app/dashboard/keyword-magic/components/keyword-magic-content.tsx
'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AlertTriangle, Download, Lightbulb, Link2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useKeywordSearch } from '../hooks/use-keyword-search'
import { useKeywordSelection } from '../hooks/use-keyword-selection'
import type { KeywordItem } from '../types'
import { KeywordsTable } from './keywords-table'
import { SearchForm } from './search-form'

export function KeywordMagicContent() {
  // État de base
  const [keyword, setKeyword] = useState('')
  const [activeTab, setActiveTab] = useState<'suggestions' | 'related' | 'ideas' | 'all'>('suggestions')
  const [searchTerm, setSearchTerm] = useState('')

  // Filtres
  const [minVolume, setMinVolume] = useState('')
  const [maxVolume, setMaxVolume] = useState('')
  const [minCPC, setMinCPC] = useState('')
  const [maxCPC, setMaxCPC] = useState('')
  const [competitionLevel, setCompetitionLevel] = useState('all')

  // Hooks personnalisés
  const {
    isLoading,
    error,
    suggestionsData,
    ideasData,
    relatedData,
    searchSuggestions,
    searchRelated,
    searchIdeas,
    searchAll,
  } = useKeywordSearch()

  const { toggleKeyword, toggleAll } = useKeywordSelection()

  // Gestion de la recherche - Lance TOUS les appels API en parallèle
  const handleSearch = async () => {
    const params = {
      keyword,
      locationCode: 2250,
      languageCode: 'fr',
      minVolume,
      maxVolume,
      minCPC,
      maxCPC,
      competitionLevel,
    }

    // Toujours lancer tous les appels API en parallèle, peu importe l'onglet actif
    await searchAll(params)
  }

  // Récupération des données selon l'onglet (données brutes de l'API)
  const getCurrentData = (): KeywordItem[] => {
    switch (activeTab) {
      case 'suggestions':
        return suggestionsData?.results || []
      case 'related':
        return relatedData?.results || []
      case 'ideas':
        return ideasData?.results || []
      case 'all':
        // Combiner toutes les données disponibles
        return [...(suggestionsData?.results || []), ...(relatedData?.results || []), ...(ideasData?.results || [])]
      default:
        return []
    }
  }

  // Fonction helper pour obtenir keyword_info depuis n'importe quelle structure
  const getKeywordInfo = (item: KeywordItem) => {
    // Pour related_keywords, les données sont dans keyword_data
    if (item.keyword_data?.keyword_info) {
      return item.keyword_data.keyword_info
    }
    // Sinon, utiliser keyword_info directement
    return item.keyword_info
  }

  // Récupération des données selon l'onglet
  const currentData = getCurrentData()

  // Filtrage local : réappliquer les filtres côté client pour garantir la cohérence
  const filteredData = currentData.filter((item) => {
    // Filtre de recherche textuelle
    if (searchTerm && !item.keyword.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Réappliquer les filtres API côté client pour garantir la cohérence
    const keywordInfo = getKeywordInfo(item)

    // Filtre volume minimum
    if (minVolume?.trim()) {
      const minVol = parseInt(minVolume)
      const volume = keywordInfo?.search_volume || 0
      if (volume < minVol) {
        return false
      }
    }

    // Filtre volume maximum
    if (maxVolume?.trim()) {
      const maxVol = parseInt(maxVolume)
      const volume = keywordInfo?.search_volume || 0
      if (volume > maxVol) {
        return false
      }
    }

    // Filtre CPC minimum
    if (minCPC?.trim()) {
      const minCpc = parseFloat(minCPC)
      const cpc = keywordInfo?.cpc || 0
      if (cpc < minCpc) {
        return false
      }
    }

    // Filtre CPC maximum
    if (maxCPC?.trim()) {
      const maxCpc = parseFloat(maxCPC)
      const cpc = keywordInfo?.cpc || 0
      if (cpc > maxCpc) {
        return false
      }
    }

    // Filtre niveau de concurrence
    if (competitionLevel && competitionLevel !== 'all') {
      const itemCompetitionLevel = keywordInfo?.competition_level?.toUpperCase() || ''
      const filterLevel = competitionLevel.toUpperCase()
      if (itemCompetitionLevel !== filterLevel) {
        return false
      }
    }

    return true
  })

  // Vérifier si on a des données pour l'onglet actif après filtrage
  const hasDataForCurrentTab = filteredData.length > 0

  // Export CSV
  const handleExport = () => {
    const headers = ['Mot-clé', 'Volume', 'CPC', 'Concurrence', 'Difficulté']
    const rows = filteredData.map((item) => [
      item.keyword,
      item.keyword_info?.search_volume || 0,
      (item.keyword_info?.cpc || 0).toFixed(2),
      item.keyword_info?.competition_level || 'UNKNOWN',
      item.keyword_properties?.keyword_difficulty || 'N/A',
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `keywords-${keyword}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Formulaire de recherche */}
        <SearchForm
          keyword={keyword}
          onKeywordChange={setKeyword}
          minVolume={minVolume}
          maxVolume={maxVolume}
          minCPC={minCPC}
          maxCPC={maxCPC}
          competitionLevel={competitionLevel}
          onMinVolumeChange={setMinVolume}
          onMaxVolumeChange={setMaxVolume}
          onMinCPCChange={setMinCPC}
          onMaxCPCChange={setMaxCPC}
          onCompetitionLevelChange={setCompetitionLevel}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Erreur */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Résultats - Afficher si au moins un onglet a des données */}
        {(suggestionsData?.results?.length || 0) > 0 ||
        (relatedData?.results?.length || 0) > 0 ||
        (ideasData?.results?.length || 0) > 0 ? (
          <>
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="suggestions" className={activeTab === 'suggestions' ? 'bg-mist-600' : ''}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Suggestions
                  </TabsTrigger>
                  <TabsTrigger value="related" className={activeTab === 'related' ? 'bg-mist-600' : ''}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Associés
                  </TabsTrigger>
                  <TabsTrigger value="ideas" className={activeTab === 'ideas' ? 'bg-mist-600' : ''}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Idées
                  </TabsTrigger>
                  <TabsTrigger value="all" className={activeTab === 'all' ? 'bg-mist-600' : ''}>
                    Tous
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>

              {/* Recherche dans résultats */}
              <Card>
                <CardContent className="pt-6">
                  <Input
                    placeholder="Rechercher dans les résultats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Tableau ou message vide pour l'onglet actif */}
              {hasDataForCurrentTab ? (
                <Card>
                  <CardContent className="p-0">
                    <KeywordsTable
                      data={filteredData}
                      onToggleKeyword={toggleKeyword}
                      onToggleAll={toggleAll}
                      maxRows={100}
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Sparkles className="text-muted-foreground/50 mx-auto h-16 w-16" />
                    <p className="mt-4 font-medium">
                      Aucun résultat pour l&apos;onglet &quot;
                      {activeTab === 'suggestions'
                        ? 'Suggestions'
                        : activeTab === 'related'
                          ? 'Associés'
                          : activeTab === 'ideas'
                            ? 'Idées'
                            : 'Tous'}
                      &quot;
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Les filtres appliqués ne correspondent à aucun résultat pour cet onglet. Essayez de modifier vos
                      filtres ou de changer d&apos;onglet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </Tabs>
          </>
        ) : (
          /* État vide - Aucune recherche effectuée */
          !isLoading &&
          !error && (
            <Card>
              <CardContent className="py-16 text-center">
                <Sparkles className="text-muted-foreground/50 mx-auto h-16 w-16" />
                <p className="mt-4 font-medium">Commencez votre recherche</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Entrez un mot-clé pour découvrir des milliers d&apos;opportunités
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </TooltipProvider>
  )
}

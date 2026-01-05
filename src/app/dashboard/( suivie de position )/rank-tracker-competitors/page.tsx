'use client'

import { AlertCircle, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { getSERPCompetitors, type SERPCompetitorsResponse } from './actions'
import SERPAnalyzerPro from './SERPAnalyzerPro'

export default function SERPComparatorPage() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [competitorsData, setCompetitorsData] =
    useState<SERPCompetitorsResponse | null>(null)
  const [searchedKeyword, setSearchedKeyword] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!keyword.trim()) {
      setError('Veuillez entrer un mot-clé')
      return
    }

    setLoading(true)
    setError(null)
    setCompetitorsData(null)

    try {
      const result = await getSERPCompetitors([keyword.trim()], {
        limit: 100,
        orderBy: ['rating,desc'],
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError(
            'Aucun concurrent trouvé pour ce mot-clé. Essayez avec un autre mot-clé.',
          )
        } else {
          setCompetitorsData(result.data)
          setSearchedKeyword(keyword.trim())
        }
      } else {
        setError(result.error || 'Erreur lors de la récupération des données')
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la recherche')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Analyse des concurrents SEO
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Identifiez vos principaux concurrents dans les résultats de
            recherche Google et analysez leur performance
          </p>
        </div>

        {/* Formulaire de recherche */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Mot-clé */}
            <div>
              <label
                htmlFor="keyword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Mot-clé à analyser
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="keyword"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Exemple: agence seo paris"
                  className="w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-12 text-lg transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Info localisation et langue */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Localisation :</span> France
                (2250) • <span className="font-semibold">Langue :</span>{' '}
                Français (fr)
              </p>
            </div>

            {/* Bouton de recherche */}
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Identifier les concurrents
                </>
              )}
            </button>
          </form>

          {/* Erreur */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Erreur</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Résultats */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-16">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
            <p className="mt-4 text-lg font-medium text-gray-700">
              Identification des concurrents en cours...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Analyse des domaines présents dans les résultats de recherche
            </p>
          </div>
        )}

        {!loading && competitorsData && (
          <div>
            {/* Info sur la recherche */}
            <div className="mb-6 flex items-center justify-between rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Analyse des concurrents : &quot;{searchedKeyword}&quot;
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {competitorsData.total_count} concurrent
                    {competitorsData.total_count > 1 ? 's' : ''} identifié
                    {competitorsData.total_count > 1 ? 's' : ''} dans les
                    résultats de recherche Google
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                <div className="text-sm font-semibold text-gray-700">
                  Localisation
                </div>
                <div className="text-xs text-gray-500">
                  France (2250) • Français (fr)
                </div>
              </div>
            </div>

            {/* Composant d'analyse */}
            <SERPAnalyzerPro
              competitorsData={competitorsData}
              keyword={searchedKeyword}
            />
          </div>
        )}

        {/* État vide initial */}
        {!loading && !competitorsData && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
            <div className="rounded-full bg-blue-100 p-6">
              <Search className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Identifiez vos concurrents SEO
            </h3>
            <p className="mt-2 max-w-md text-gray-600">
              Entrez un mot-clé pour découvrir qui sont vos principaux
              concurrents dans les résultats de recherche Google et analyser
              leur performance.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">🎯</div>
                <h4 className="font-semibold text-gray-900">
                  Identification des concurrents
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Découvrez tous les domaines qui apparaissent pour votre
                  mot-clé
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">📊</div>
                <h4 className="font-semibold text-gray-900">
                  Métriques avancées
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  ETV, Rating, Visibility et positions moyennes
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">🔍</div>
                <h4 className="font-semibold text-gray-900">
                  Analyse détaillée
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Nombre de mots-clés classés et positions par domaine
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

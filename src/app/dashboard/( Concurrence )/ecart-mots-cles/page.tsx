'use client'

import {
  AlertCircle,
  GitCompare,
  Info,
  Loader2,
  Search,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { getKeywordGap, type KeywordGapResponse } from './action'
import KeywordGapAnalyzer from './KeywordGapAnalyzer'

export default function KeywordGapAnalyzerPage() {
  const [target1, setTarget1] = useState('')
  const [target2, setTarget2] = useState('')
  const [analysisMode, setAnalysisMode] = useState<'gaps' | 'common'>('gaps')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [keywordData, setKeywordData] = useState<KeywordGapResponse | null>(
    null,
  )

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanTarget1 = target1.trim()
    const cleanTarget2 = target2.trim()

    if (!cleanTarget1 || !cleanTarget2) {
      setError('Veuillez entrer les 2 domaines')
      return
    }

    if (cleanTarget1 === cleanTarget2) {
      setError('Les 2 domaines doivent être différents')
      return
    }

    setLoading(true)
    setError(null)
    setKeywordData(null)

    try {
      const result = await getKeywordGap({
        target1: cleanTarget1,
        target2: cleanTarget2,
        locationCode: 2250, // France
        languageCode: 'fr', // Français
        intersections: analysisMode === 'common', // false = gaps, true = communs
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Analyseur d&apos;Écart de Mots-clés
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Découvrez les opportunités SEO où vos concurrents se positionnent
            mais pas vous
          </p>
        </div>

        {/* Formulaire */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Explication mode */}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="text-sm text-blue-700">
                  <strong className="font-semibold">
                    Mode Écart (recommandé) :
                  </strong>{' '}
                  Trouvez les mots-clés où votre concurrent se positionne mais
                  PAS vous. Ce sont vos meilleures opportunités !
                  <br />
                  <strong className="mt-2 block font-semibold">
                    Mode Communs :
                  </strong>{' '}
                  Comparez vos positions communes pour identifier où vous devez
                  progresser.
                </div>
              </div>
            </div>

            {/* Mode d'analyse */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Mode d&apos;analyse
              </label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setAnalysisMode('gaps')}
                  disabled={loading}
                  className={`rounded-xl border-2 p-6 text-left transition-all ${
                    analysisMode === 'gaps'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-orange-500" />
                    <span className="text-lg font-bold text-gray-900">
                      Écart de Mots-clés
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Concurrent positionné, VOUS NON</strong>
                    <br />
                    Découvrez les opportunités SEO manquées
                  </p>
                  {analysisMode === 'gaps' && (
                    <div className="mt-3 rounded-lg bg-orange-100 px-3 py-2 text-xs font-semibold text-orange-700">
                      ✅ RECOMMANDÉ
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAnalysisMode('common')}
                  disabled={loading}
                  className={`rounded-xl border-2 p-6 text-left transition-all ${
                    analysisMode === 'common'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <GitCompare className="h-6 w-6 text-blue-500" />
                    <span className="text-lg font-bold text-gray-900">
                      Mots-clés Communs
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Les 2 sont positionnés</strong>
                    <br />
                    Comparez vos positions pour progresser
                  </p>
                </button>
              </div>
            </div>

            {/* Domaines */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Target 1 */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {analysisMode === 'gaps' ? (
                    <>
                      Concurrent{' '}
                      <span className="text-green-600">(positionné)</span>{' '}
                      <span className="text-red-500">*</span>
                    </>
                  ) : (
                    <>
                      Domaine 1 <span className="text-red-500">*</span>
                    </>
                  )}
                </label>
                <input
                  type="text"
                  value={target1}
                  onChange={(e) => setTarget1(e.target.value)}
                  placeholder="exemple.com"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                  disabled={loading}
                />
                {analysisMode === 'gaps' && (
                  <p className="mt-1 text-xs text-gray-600">
                    🎯 Le concurrent qui SE POSITIONNE sur les mots-clés
                  </p>
                )}
              </div>

              {/* Target 2 */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {analysisMode === 'gaps' ? (
                    <>
                      Votre site{' '}
                      <span className="text-red-600">(non positionné)</span>{' '}
                      <span className="text-red-500">*</span>
                    </>
                  ) : (
                    <>
                      Domaine 2 <span className="text-red-500">*</span>
                    </>
                  )}
                </label>
                <input
                  type="text"
                  value={target2}
                  onChange={(e) => setTarget2(e.target.value)}
                  placeholder="votresite.com"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                  disabled={loading}
                />
                {analysisMode === 'gaps' && (
                  <p className="mt-1 text-xs text-gray-600">
                    ❌ Votre site qui NE SE POSITIONNE PAS sur ces mots-clés
                  </p>
                )}
              </div>
            </div>

            {/* Info locale */}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="text-sm text-blue-700">
                  <strong className="font-semibold">Configuration :</strong> 🇫🇷
                  France • Langue : Français • Résultats : 100 (par défaut)
                </div>
              </div>
            </div>

            {/* Info visuelle du mode */}
            {analysisMode === 'gaps' && (
              <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center justify-center gap-8 text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
                      ✓
                    </div>
                    <span className="text-green-700">
                      {target1 || 'Concurrent'} positionné
                    </span>
                  </div>
                  <div className="text-2xl text-orange-500">→</div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
                      ✗
                    </div>
                    <span className="text-red-700">
                      {target2 || 'Votre site'} NON positionné
                    </span>
                  </div>
                  <div className="text-2xl">🎯</div>
                  <div className="rounded-lg bg-orange-600 px-4 py-2 text-white">
                    OPPORTUNITÉS !
                  </div>
                </div>
              </div>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading || !target1.trim() || !target2.trim()}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-lg font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  {analysisMode === 'gaps'
                    ? 'Trouver les opportunités'
                    : 'Comparer les positions'}
                </>
              )}
            </button>
          </form>

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
              {analysisMode === 'gaps'
                ? 'Recherche des opportunités SEO...'
                : 'Analyse des positions communes...'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Cela peut prendre quelques secondes
            </p>
          </div>
        )}

        {!loading && keywordData && (
          <div>
            <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-lg p-3 ${
                    analysisMode === 'gaps' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}
                >
                  {analysisMode === 'gaps' ? (
                    <Zap className="h-6 w-6 text-orange-600" />
                  ) : (
                    <GitCompare className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {keywordData.total_count.toLocaleString()} mot
                    {keywordData.total_count > 1 ? 's' : ''}-clé
                    {keywordData.total_count > 1 ? 's' : ''}{' '}
                    {analysisMode === 'gaps' ? "d'opportunité" : 'commun'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {keywordData.items_count} affichés • Analyse{' '}
                    {analysisMode === 'gaps' ? 'des écarts' : 'comparative'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {analysisMode === 'gaps' ? (
                  <span className="rounded-lg bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
                    🎯 Opportunités SEO
                  </span>
                ) : (
                  <span className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                    📊 Positions communes
                  </span>
                )}
              </div>
            </div>

            <KeywordGapAnalyzer
              data={keywordData}
              isGapMode={analysisMode === 'gaps'}
            />
          </div>
        )}

        {!loading && !keywordData && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
            <div
              className={`rounded-full p-6 ${
                analysisMode === 'gaps' ? 'bg-orange-100' : 'bg-blue-100'
              }`}
            >
              {analysisMode === 'gaps' ? (
                <Zap className="h-12 w-12 text-orange-600" />
              ) : (
                <GitCompare className="h-12 w-12 text-blue-600" />
              )}
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              {analysisMode === 'gaps'
                ? 'Découvrez vos opportunités SEO'
                : 'Comparez vos positions'}
            </h3>
            <p className="mt-2 max-w-md text-gray-600">
              {analysisMode === 'gaps'
                ? 'Identifiez les mots-clés où votre concurrent se positionne mais pas vous'
                : 'Analysez les mots-clés où vous êtes tous les deux positionnés'}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">
                  {analysisMode === 'gaps' ? '🎯' : '📊'}
                </div>
                <h4 className="font-semibold text-gray-900">
                  {analysisMode === 'gaps'
                    ? 'Opportunités ciblées'
                    : 'Analyse comparative'}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {analysisMode === 'gaps'
                    ? 'Mots-clés manquants dans votre stratégie'
                    : 'Positions côte à côte'}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">⚡</div>
                <h4 className="font-semibold text-gray-900">Easy Wins</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Faible compétition, fort potentiel
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">💰</div>
                <h4 className="font-semibold text-gray-900">Valeur estimée</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Volume, CPC et ETV détaillés
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

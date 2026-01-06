'use client'

import { ClientPageHeader } from '@/components/dashboard/client-page-header'
import { AlertCircle, GitCompare, Info, Loader2, Search, Zap } from 'lucide-react'
import { useState } from 'react'
import { getKeywordGap, type KeywordGapResponse } from './action'
import KeywordGapAnalyzer from './KeywordGapAnalyzer'

export default function KeywordGapAnalyzerPage() {
  const [target1, setTarget1] = useState('')
  const [target2, setTarget2] = useState('')
  const [analysisMode, setAnalysisMode] = useState<'gaps' | 'common'>('gaps')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [keywordData, setKeywordData] = useState<KeywordGapResponse | null>(null)

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
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <ClientPageHeader
          title="Analyseur d'Écart de Mots-clés"
          description="Découvrez les opportunités SEO où vos concurrents se positionnent mais pas vous"
          icon={Zap}
        />

        {/* Formulaire */}
        <div className="bg-card mb-8 rounded-2xl border p-8 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Explication mode */}
            <div className="border-2-primary/30 bg-primary/5 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="text-primary h-5 w-5 flex-shrink-0" />
                <div className="text-primary text-sm">
                  <strong className="font-semibold">Mode Écart (recommandé) :</strong> Trouvez les mots-clés où votre
                  concurrent se positionne mais PAS vous. Ce sont vos meilleures opportunités !
                  <br />
                  <strong className="mt-2 block font-semibold">Mode Communs :</strong> Comparez vos positions communes
                  pour identifier où vous devez progresser.
                </div>
              </div>
            </div>

            {/* Mode d'analyse */}
            <div>
              <label className="text-foreground mb-3 block text-sm font-semibold">Mode d&apos;analyse</label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setAnalysisMode('gaps')}
                  disabled={loading}
                  className={`rounded-xl border-2 p-6 text-left transition-all ${
                    analysisMode === 'gaps' ? 'border-orange-500 bg-orange-50' : 'bg-card hover:bg-card border'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-orange-500" />
                    <span className="text-foreground text-lg font-bold">Écart de Mots-clés</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
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
                    analysisMode === 'common' ? 'bg-primary/5 border-blue-500' : 'bg-card hover:bg-card border'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <GitCompare className="h-6 w-6 text-blue-500" />
                    <span className="text-foreground text-lg font-bold">Mots-clés Communs</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
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
                <label className="text-foreground mb-2 block text-sm font-semibold">
                  {analysisMode === 'gaps' ? (
                    <>
                      Concurrent <span className="text-green-600">(positionné)</span>{' '}
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
                  className="w-full rounded-xl border-2 px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                  disabled={loading}
                />
                {analysisMode === 'gaps' && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    🎯 Le concurrent qui SE POSITIONNE sur les mots-clés
                  </p>
                )}
              </div>

              {/* Target 2 */}
              <div>
                <label className="text-foreground mb-2 block text-sm font-semibold">
                  {analysisMode === 'gaps' ? (
                    <>
                      Votre site <span className="text-destructive">(non positionné)</span>{' '}
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
                  className="w-full rounded-xl border-2 px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                  disabled={loading}
                />
                {analysisMode === 'gaps' && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    ❌ Votre site qui NE SE POSITIONNE PAS sur ces mots-clés
                  </p>
                )}
              </div>
            </div>

            {/* Info locale */}
            <div className="border-2-primary/30 bg-primary/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Info className="text-primary h-5 w-5 flex-shrink-0" />
                <div className="text-primary text-sm">
                  <strong className="font-semibold">Configuration :</strong> 🇫🇷 France • Langue : Français • Résultats :
                  100 (par défaut)
                </div>
              </div>
            </div>

            {/* Info visuelle du mode */}
            {analysisMode === 'gaps' && (
              <div className="border-2-orange-200 rounded-xl bg-orange-50 p-4">
                <div className="flex items-center justify-center gap-8 text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
                      ✓
                    </div>
                    <span className="text-green-700">{target1 || 'Concurrent'} positionné</span>
                  </div>
                  <div className="text-2xl text-orange-500">→</div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
                      ✗
                    </div>
                    <span className="text-destructive/90">{target2 || 'Votre site'} NON positionné</span>
                  </div>
                  <div className="text-2xl">🎯</div>
                  <div className="rounded-lg bg-orange-600 px-4 py-2 text-white">OPPORTUNITÉS !</div>
                </div>
              </div>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading || !target1.trim() || !target2.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-3 rounded-xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  {analysisMode === 'gaps' ? 'Trouver les opportunités' : 'Comparer les positions'}
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="border-2-destructive/50 bg-destructive/10 mt-6 flex items-start gap-3 rounded-xl p-4">
              <AlertCircle className="text-destructive h-5 w-5 flex-shrink-0" />
              <div>
                <p className="text-destructive font-semibold">Erreur</p>
                <p className="text-destructive/90 text-sm">{error}</p>
              </div>
            </div>
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
                <div className={`rounded-lg p-3 ${analysisMode === 'gaps' ? 'bg-orange-100' : 'bg-primary/10'}`}>
                  {analysisMode === 'gaps' ? (
                    <Zap className="h-6 w-6 text-orange-600" />
                  ) : (
                    <GitCompare className="text-primary h-6 w-6" />
                  )}
                </div>
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
                  <span className="rounded-lg bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
                    🎯 Opportunités SEO
                  </span>
                ) : (
                  <span className="bg-primary/10 text-primary rounded-lg px-4 py-2 text-sm font-medium">
                    📊 Positions communes
                  </span>
                )}
              </div>
            </div>

            <KeywordGapAnalyzer data={keywordData} isGapMode={analysisMode === 'gaps'} />
          </div>
        )}

        {!loading && !keywordData && !error && (
          <div className="border-2-dashed bg-card flex flex-col items-center justify-center rounded-2xl border p-16 text-center">
            <div className={`rounded-full p-6 ${analysisMode === 'gaps' ? 'bg-orange-100' : 'bg-primary/10'}`}>
              {analysisMode === 'gaps' ? (
                <Zap className="h-12 w-12 text-orange-600" />
              ) : (
                <GitCompare className="text-primary h-12 w-12" />
              )}
            </div>
            <h3 className="text-foreground mt-6 text-xl font-semibold">
              {analysisMode === 'gaps' ? 'Découvrez vos opportunités SEO' : 'Comparez vos positions'}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              {analysisMode === 'gaps'
                ? 'Identifiez les mots-clés où votre concurrent se positionne mais pas vous'
                : 'Analysez les mots-clés où vous êtes tous les deux positionnés'}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <div className="bg-card rounded-xl border p-4">
                <div className="mb-2 text-2xl">{analysisMode === 'gaps' ? '🎯' : '📊'}</div>
                <h4 className="text-foreground font-semibold">
                  {analysisMode === 'gaps' ? 'Opportunités ciblées' : 'Analyse comparative'}
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  {analysisMode === 'gaps' ? 'Mots-clés manquants dans votre stratégie' : 'Positions côte à côte'}
                </p>
              </div>
              <div className="bg-card rounded-xl border p-4">
                <div className="mb-2 text-2xl">⚡</div>
                <h4 className="text-foreground font-semibold">Easy Wins</h4>
                <p className="text-muted-foreground mt-1 text-sm">Faible compétition, fort potentiel</p>
              </div>
              <div className="bg-card rounded-xl border p-4">
                <div className="mb-2 text-2xl">💰</div>
                <h4 className="text-foreground font-semibold">Valeur estimée</h4>
                <p className="text-muted-foreground mt-1 text-sm">Volume, CPC et ETV détaillés</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

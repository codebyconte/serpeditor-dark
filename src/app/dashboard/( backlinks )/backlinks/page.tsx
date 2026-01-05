'use client'

import { AlertCircle, Link as LinkIcon, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { getBacklinks, type BacklinksResponse } from './action'
import BacklinksAnalyzer from './BacklinksAnalyzer'

export default function BacklinksAnalyzerPage() {
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [backlinksData, setBacklinksData] = useState<BacklinksResponse | null>(
    null,
  )

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!target.trim()) {
      setError('Veuillez entrer un domaine ou une URL')
      return
    }

    setLoading(true)
    setError(null)
    setBacklinksData(null)

    try {
      const result = await getBacklinks(target.trim(), {
        includeSubdomains: true,
        includeIndirectLinks: true,
        excludeInternalBacklinks: true,
        orderBy: ['rank,desc'],
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError('Aucun backlink trouvé pour cette cible')
        } else {
          setBacklinksData(result.data)
        }
      } else {
        setError(result.error || 'Erreur lors de la récupération des backlinks')
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
            Analyseur de Backlinks
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Analysez le profil de backlinks d&apos;un domaine avec DataForSEO
          </p>
        </div>

        {/* Formulaire */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Target */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Domaine ou URL à analyser
              </label>
              <div className="relative">
                <LinkIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="exemple.com ou https://exemple.com/page"
                  className="w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-12 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Pour un domaine, tapez sans https:// ni www. Pour une page,
                utilisez l&apos;URL complète.
              </p>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading || !target.trim()}
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
                  Analyser les backlinks
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
              Analyse des backlinks en cours...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Cela peut prendre quelques secondes
            </p>
          </div>
        )}

        {!loading && backlinksData && (
          <div>
            <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <LinkIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {backlinksData.target}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {backlinksData.total_count.toLocaleString()} backlinks
                    trouvés • {backlinksData.items_count} affichés
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-gray-100 px-4 py-2">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  Mode: {backlinksData.mode.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <BacklinksAnalyzer
              data={backlinksData}
              target={backlinksData.target}
            />
          </div>
        )}

        {!loading && !backlinksData && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
            <div className="rounded-full bg-blue-100 p-6">
              <LinkIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Analysez votre profil de backlinks
            </h3>
            <p className="mt-2 max-w-md text-gray-600">
              Découvrez qui pointe vers votre site, analysez la qualité des
              liens et identifiez les opportunités d&apos;amélioration
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">🔗</div>
                <h4 className="font-semibold text-gray-900">Profil complet</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Tous les backlinks avec métadonnées détaillées
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">📊</div>
                <h4 className="font-semibold text-gray-900">
                  Statistiques avancées
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Domain Rank, Spam Score, pays, TLD
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">🎯</div>
                <h4 className="font-semibold text-gray-900">
                  Analyse des anchors
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Distribution et optimisation des textes d&apos;ancrage
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

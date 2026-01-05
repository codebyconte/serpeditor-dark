'use client'

import { ClientPageHeader } from '@/components/dashboard/client-page-header'
import { AlertCircle, Loader2, Search, Target } from 'lucide-react'
import { useState } from 'react'
import { getCompetitors, type CompetitorsResponse } from './action'
import CompetitorsAnalyzer from './CompetitorsAnalyzer'

export default function CompetitorsAnalyzerPage() {
  const [target, setTarget] = useState('')
  const [excludeTopDomains, setExcludeTopDomains] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [competitorsData, setCompetitorsData] =
    useState<CompetitorsResponse | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!target.trim()) {
      setError('Veuillez entrer un domaine')
      return
    }

    setLoading(true)
    setError(null)
    setCompetitorsData(null)

    try {
      const result = await getCompetitors(target.trim(), {
        excludeTopDomains,
        orderBy: ['metrics.organic.count,desc'],
      })

      if (result.success && result.data) {
        // Si on a des items, afficher les résultats
        if (result.data.items.length > 0) {
          setCompetitorsData(result.data)
        } else if (result.data.total_count > 0) {
          // Si total_count > 0 mais items vide, il y a des concurrents mais pas dans cette page
          setError(
            `Il y a ${result.data.total_count} concurrent(s) identifié(s) pour ce domaine, mais aucun résultat n&apos;a pu être chargé.`,
          )
        } else {
          // Aucun concurrent trouvé
          setError(
            'Aucun concurrent trouvé pour ce domaine. Le domaine n&apos;a peut-être pas encore de positions dans les résultats de recherche Google pour les mots-clés analysés.',
          )
        }
      } else {
        setError(
          result.error || 'Erreur lors de la récupération des concurrents',
        )
      }
    } catch (err) {
      setError('Une erreur est survenue')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6 text-foreground">
      <div className="mx-auto max-w-7xl">
        <ClientPageHeader
          title="Analyseur de Concurrents"
          description="Identifiez vos principaux concurrents SEO et analysez leur stratégie"
          icon={Target}
          iconClassName="border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/10 text-orange-500"
        />

        {/* Formulaire */}
        <div className="mb-8 rounded-2xl border bg-card p-8 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Target */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Domaine à analyser
              </label>
              <div className="relative">
                <Target className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="exemple.com"
                  className="w-full rounded-xl border-2 border py-3 pr-4 pl-12 text-lg focus:border-ring focus:ring-4 focus:ring-ring/20"
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Entrez le domaine sans https:// ni www.
              </p>
            </div>

            {/* Info localisation et langue */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-sm text-primary">
                <span className="font-semibold">Localisation :</span> France
                (2250) • <span className="font-semibold">Langue :</span>{' '}
                Français (fr)
              </p>
            </div>

            {/* Exclude Top Domains */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Options
              </label>
              <label className="flex items-center gap-3 rounded-xl border-2 border bg-card px-4 py-3 hover:bg-card">
                <input
                  type="checkbox"
                  checked={excludeTopDomains}
                  onChange={(e) => setExcludeTopDomains(e.target.checked)}
                  disabled={loading}
                  className="h-5 w-5 rounded border text-primary focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-foreground">
                  Exclure les sites majeurs (Wikipedia, Amazon, etc.)
                </span>
              </label>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading || !target.trim()}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-lg font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Analyser les concurrents
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-destructive/50 bg-destructive/10 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">Erreur</p>
                <p className="text-sm text-destructive/90">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Résultats */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-16">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium text-foreground">
              Analyse des concurrents en cours...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Cela peut prendre quelques secondes
            </p>
          </div>
        )}

        {!loading && competitorsData && (
          <div>
            <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {competitorsData.target}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {competitorsData.total_count} concurrents trouvés • France •
                    Français
                  </p>
                </div>
              </div>
            </div>

            <CompetitorsAnalyzer
              data={competitorsData}
              target={competitorsData.target}
            />
          </div>
        )}

        {!loading && !competitorsData && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border bg-card p-16 text-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Target className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">
              Analysez vos concurrents SEO
            </h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              Identifiez qui se positionne sur les mêmes mots-clés que vous et
              découvrez leurs stratégies
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 text-2xl">🎯</div>
                <h4 className="font-semibold text-foreground">
                  Identifiez vos rivaux
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Découvrez qui se bat pour les mêmes positions
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 text-2xl">📊</div>
                <h4 className="font-semibold text-foreground">
                  Analysez leur force
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keywords, ETV, positions et distribution
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 text-2xl">🚀</div>
                <h4 className="font-semibold text-foreground">
                  Optimisez votre stratégie
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Trouvez des opportunités de mots-clés
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

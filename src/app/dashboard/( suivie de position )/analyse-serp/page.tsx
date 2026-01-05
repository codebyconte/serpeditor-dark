'use client'

import { ClientPageHeader } from '@/components/dashboard/client-page-header'
import { AlertCircle, Calendar, Globe, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { getHistoricalSERP, type HistoricalSERPResponse } from './action'
import SERPAnalyzerPro from './SERPAnalyzerPro'

export default function SERPAnalyzerPage() {
  const [keyword, setKeyword] = useState('')
  const [locationCode, setLocationCode] = useState(2250)
  const [languageCode, setLanguageCode] = useState('fr')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serpData, setSerpData] = useState<HistoricalSERPResponse | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!keyword.trim()) {
      setError('Veuillez entrer un mot-clé')
      return
    }

    setLoading(true)
    setError(null)
    setSerpData(null)

    try {
      const result = await getHistoricalSERP(
        keyword.trim(),
        locationCode,
        languageCode,
        {
          ...(dateFrom && { dateFrom }),
          ...(dateTo && { dateTo }),
        },
      )

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError('Aucun historique trouvé pour ce mot-clé sur cette période.')
        } else {
          setSerpData(result.data)
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
    <div className="min-h-screen p-6 text-foreground">
      <div className="mx-auto max-w-7xl">
        <ClientPageHeader
          title="Analyseur SERP Historique"
          description="Analysez l'évolution des SERP sur 365 jours avec DataForSEO Labs"
          icon={Search}
          iconClassName="border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-500"
        />

        {/* Formulaire */}
        <div className="mb-8 rounded-2xl border bg-card p-8 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Mot-clé */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Mot-clé à analyser
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Exemple: agence seo paris"
                  className="w-full rounded-xl border-2 border py-3 pr-4 pl-12 text-lg focus:border-ring focus:ring-4 focus:ring-ring/20"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  <Globe className="mr-1 inline h-4 w-4" />
                  Localisation
                </label>
                <select
                  value={locationCode}
                  onChange={(e) => setLocationCode(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border px-4 py-3 focus:border-ring focus:ring-4 focus:ring-ring/20"
                  disabled={loading}
                >
                  <option value={2250}>France</option>
                  <option value={2840}>États-Unis</option>
                  <option value={2826}>Royaume-Uni</option>
                  <option value={2276}>Allemagne</option>
                  <option value={2724}>Espagne</option>
                  <option value={2380}>Italie</option>
                  <option value={2056}>Belgique</option>
                  <option value={2756}>Suisse</option>
                  <option value={2124}>Canada</option>
                </select>
              </div>

              {/* Langue */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Langue
                </label>
                <select
                  value={languageCode}
                  onChange={(e) => setLanguageCode(e.target.value)}
                  className="w-full rounded-xl border-2 border px-4 py-3 focus:border-ring focus:ring-4 focus:ring-ring/20"
                  disabled={loading}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                </select>
              </div>
            </div>

            {/* Période */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  <Calendar className="mr-1 inline h-4 w-4" />
                  Date de début (optionnel)
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-xl border-2 border px-4 py-3 focus:border-ring focus:ring-4 focus:ring-ring/20"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Date de fin (optionnel)
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-xl border-2 border px-4 py-3 focus:border-ring focus:ring-4 focus:ring-ring/20"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
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
                  Analyser l&apos;historique SERP
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
              Récupération de l&apos;historique SERP...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Cela peut prendre quelques secondes
            </p>
          </div>
        )}

        {!loading && serpData && (
          <div>
            <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {serpData.keyword}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {serpData.items.length} snapshots historiques
                  </p>
                </div>
              </div>
            </div>

            <SERPAnalyzerPro data={serpData.items} keyword={serpData.keyword} />
          </div>
        )}

        {!loading && !serpData && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card p-16 text-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Search className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">
              Analysez l&apos;historique SERP
            </h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              Suivez l&apos;évolution des positions sur 365 jours avec des
              données historiques précises
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 text-2xl">📊</div>
                <h4 className="font-semibold text-foreground">
                  365 jours d&apos;historique
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Données SERP mensuelles complètes
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 text-2xl">🎯</div>
                <h4 className="font-semibold text-foreground">
                  Comparaison automatique
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Analyse des changements entre périodes
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 text-2xl">📈</div>
                <h4 className="font-semibold text-foreground">
                  Suivi des domaines
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Historique détaillé par concurrent
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

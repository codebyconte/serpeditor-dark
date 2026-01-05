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
      const result = await getHistoricalSERP(keyword.trim(), locationCode, languageCode, {
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      })

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
    <div className="text-foreground min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <ClientPageHeader
          title="Analyseur SERP Historique"
          description="Analysez l'évolution des SERP sur 365 jours avec DataForSEO Labs"
          icon={Search}
          iconClassName="border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-500"
        />

        {/* Formulaire */}
        <div className="bg-card mb-8 rounded-2xl border p-8 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Mot-clé */}
            <div>
              <label className="dashboard-heading-4 mb-2 block">Mot-clé à analyser</label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Exemple: agence seo paris"
                  className="focus:border-ring focus:ring-ring/20 w-full rounded-xl border-2 py-3 pr-4 pl-12 text-lg focus:ring-4"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Location */}
              <div>
                <label className="dashboard-heading-4 mb-2 block">
                  <Globe className="mr-1 inline h-4 w-4" />
                  Localisation
                </label>
                <select
                  value={locationCode}
                  onChange={(e) => setLocationCode(Number(e.target.value))}
                  className="focus:border-ring focus:ring-ring/20 w-full rounded-xl border-2 px-4 py-3 focus:ring-4"
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
                <label className="dashboard-heading-4 mb-2 block">Langue</label>
                <select
                  value={languageCode}
                  onChange={(e) => setLanguageCode(e.target.value)}
                  className="focus:border-ring focus:ring-ring/20 w-full rounded-xl border-2 px-4 py-3 focus:ring-4"
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
                <label className="dashboard-heading-4 mb-2 block">
                  <Calendar className="mr-1 inline h-4 w-4" />
                  Date de début (optionnel)
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="focus:border-ring focus:ring-ring/20 w-full rounded-xl border-2 px-4 py-3 focus:ring-4"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="dashboard-heading-4 mb-2 block">Date de fin (optionnel)</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="focus:border-ring focus:ring-ring/20 w-full rounded-xl border-2 px-4 py-3 focus:ring-4"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:border-primary/50 flex w-full items-center justify-center gap-3 rounded-xl border-2 py-4 text-base font-semibold shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="border-destructive/50 bg-destructive/10 mt-6 flex items-start gap-3 rounded-xl border-2 p-4">
              <AlertCircle className="text-destructive h-5 w-5 shrink-0" />
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
            <p className="dashboard-body-lg mt-4">Récupération de l&apos;historique SERP...</p>
            <p className="dashboard-body-sm mt-2">Cela peut prendre quelques secondes</p>
          </div>
        )}

        {!loading && serpData && (
          <div className="api-response">
            <div className="api-response-header">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Search className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h2 className="dashboard-heading-3">{serpData.keyword}</h2>
                  <p className="dashboard-body-sm mt-1">{serpData.items.length} snapshots historiques</p>
                </div>
              </div>
            </div>

            <div className="api-response-content">
              <SERPAnalyzerPro data={serpData.items} keyword={serpData.keyword} />
            </div>
          </div>
        )}

        {!loading && !serpData && !error && (
          <div className="bg-card flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 text-center">
            <div className="bg-primary/10 rounded-full p-6">
              <Search className="text-primary h-12 w-12" />
            </div>
            <h3 className="dashboard-heading-3 mt-6">Analysez l&apos;historique SERP</h3>
            <p className="dashboard-body-sm mt-2 max-w-md">
              Suivez l&apos;évolution des positions sur 365 jours avec des données historiques précises
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <div className="bg-card rounded-xl border p-4">
                <div className="mb-2 text-2xl">📊</div>
                <h4 className="dashboard-heading-4">365 jours d&apos;historique</h4>
                <p className="dashboard-body-sm mt-1">Données SERP mensuelles complètes</p>
              </div>
              <div className="bg-card rounded-xl border p-4">
                <div className="mb-2 text-2xl">🎯</div>
                <h4 className="dashboard-heading-4">Comparaison automatique</h4>
                <p className="dashboard-body-sm mt-1">Analyse des changements entre périodes</p>
              </div>
              <div className="bg-card rounded-xl border p-4">
                <div className="mb-2 text-2xl">📈</div>
                <h4 className="dashboard-heading-4">Suivi des domaines</h4>
                <p className="dashboard-body-sm mt-1">Historique détaillé par concurrent</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

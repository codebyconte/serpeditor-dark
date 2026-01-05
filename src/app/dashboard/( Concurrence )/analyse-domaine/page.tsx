'use client'

import { AlertCircle, Calendar, Globe, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { getDomainWhoisOverview, type DomainWhoisResponse } from './action'
import DomainWhoisAnalyzer from './DomainWhoisAnalyzer'

export default function DomainWhoisAnalyzerPage() {
  const [searchType, setSearchType] = useState<
    'expiring' | 'expired' | 'keywords' | 'backlinks'
  >('expiring')
  const [daysUntilExpiration, setDaysUntilExpiration] = useState(30)
  const [minKeywords, setMinKeywords] = useState(100)
  const [minBacklinks, setMinBacklinks] = useState(1000)
  const [tldFilter, setTldFilter] = useState('')
  const [limit, setLimit] = useState(100)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [domainsData, setDomainsData] = useState<DomainWhoisResponse | null>(
    null,
  )

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)
    setDomainsData(null)

    try {
      let filters: Array<unknown> = []
      let orderBy: string[] = []

      // Construire les filtres selon le type de recherche
      if (searchType === 'expiring') {
        // Domaines qui expirent bientôt (actifs avec expiration proche)
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + daysUntilExpiration)

        filters = [
          ['registered', '=', true],
          'and',
          ['expiration_datetime', '<', futureDate.toISOString()],
          'and',
          ['expiration_datetime', '>', new Date().toISOString()],
        ]
        orderBy = ['expiration_datetime,asc']
      } else if (searchType === 'expired') {
        // Domaines expirés
        filters = [['registered', '=', false]]
        orderBy = ['metrics.organic.count,desc']
      } else if (searchType === 'keywords') {
        // Domaines avec beaucoup de keywords
        filters = [['metrics.organic.count', '>=', minKeywords]]
        orderBy = ['metrics.organic.count,desc']
      } else if (searchType === 'backlinks') {
        // Domaines avec beaucoup de backlinks
        filters = [['backlinks_info.backlinks', '>=', minBacklinks]]
        orderBy = ['backlinks_info.backlinks,desc']
      }

      // Ajouter le filtre TLD si spécifié
      if (tldFilter) {
        filters = [filters, 'and', ['tld', '=', tldFilter.replace('.', '')]]
      }

      const result = await getDomainWhoisOverview({
        filters,
        orderBy,
        limit,
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError('Aucun domaine trouvé avec ces critères')
        } else {
          setDomainsData(result.data)
        }
      } else {
        setError(result.error || 'Erreur lors de la récupération des domaines')
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Analyseur de Domaines WHOIS
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Trouvez des domaines expirés ou qui expirent bientôt avec leur
            historique SEO
          </p>
        </div>

        {/* Formulaire */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Type de recherche */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type de recherche
              </label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setSearchType('expiring')}
                  disabled={loading}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    searchType === 'expiring'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-2 text-2xl">⏰</div>
                  <div className="font-semibold text-gray-900">
                    Expirent bientôt
                  </div>
                  <div className="text-xs text-gray-600">
                    Domaines actifs proches de l&apos;expiration
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchType('expired')}
                  disabled={loading}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    searchType === 'expired'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-2 text-2xl">💀</div>
                  <div className="font-semibold text-gray-900">
                    Déjà expirés
                  </div>
                  <div className="text-xs text-gray-600">
                    Domaines disponibles à racheter
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchType('keywords')}
                  disabled={loading}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    searchType === 'keywords'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-2 text-2xl">📊</div>
                  <div className="font-semibold text-gray-900">
                    Par Keywords
                  </div>
                  <div className="text-xs text-gray-600">
                    Domaines avec beaucoup de mots-clés
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchType('backlinks')}
                  disabled={loading}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    searchType === 'backlinks'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-2 text-2xl">🔗</div>
                  <div className="font-semibold text-gray-900">
                    Par Backlinks
                  </div>
                  <div className="text-xs text-gray-600">
                    Domaines avec beaucoup de liens
                  </div>
                </button>
              </div>
            </div>

            {/* Critères spécifiques */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Jours jusqu'à expiration (si expiring) */}
              {searchType === 'expiring' && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Expire dans les prochains
                  </label>
                  <select
                    value={daysUntilExpiration}
                    onChange={(e) =>
                      setDaysUntilExpiration(Number(e.target.value))
                    }
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                    disabled={loading}
                  >
                    <option value={7}>7 jours</option>
                    <option value={15}>15 jours</option>
                    <option value={30}>30 jours</option>
                    <option value={60}>60 jours</option>
                    <option value={90}>90 jours</option>
                  </select>
                </div>
              )}

              {/* Min Keywords (si keywords) */}
              {searchType === 'keywords' && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Minimum de keywords
                  </label>
                  <input
                    type="number"
                    value={minKeywords}
                    onChange={(e) => setMinKeywords(Number(e.target.value))}
                    min="1"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                    disabled={loading}
                  />
                </div>
              )}

              {/* Min Backlinks (si backlinks) */}
              {searchType === 'backlinks' && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Minimum de backlinks
                  </label>
                  <input
                    type="number"
                    value={minBacklinks}
                    onChange={(e) => setMinBacklinks(Number(e.target.value))}
                    min="1"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                    disabled={loading}
                  />
                </div>
              )}

              {/* TLD Filter */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Extension (TLD) - optionnel
                </label>
                <input
                  type="text"
                  value={tldFilter}
                  onChange={(e) => setTldFilter(e.target.value)}
                  placeholder="com, fr, net..."
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                  disabled={loading}
                />
              </div>

              {/* Limite */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Nombre de résultats
                </label>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                  disabled={loading}
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={250}>250</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                </select>
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="text-sm text-blue-700">
                  <strong className="font-semibold">Astuce :</strong> Les
                  domaines expirés avec un bon historique SEO (backlinks,
                  keywords) peuvent être d&apos;excellentes opportunités pour
                  créer des PBN ou lancer de nouveaux projets avec une autorité
                  existante.
                </div>
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-lg font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Recherche en cours...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Rechercher des domaines
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
              Recherche de domaines en cours...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Cela peut prendre quelques secondes
            </p>
          </div>
        )}

        {!loading && domainsData && (
          <div>
            <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {domainsData.total_count.toLocaleString()} domaines trouvés
                  </h2>
                  <p className="text-sm text-gray-600">
                    {domainsData.items_count} affichés
                    {searchType === 'expiring' &&
                      ` • Expirent dans les ${daysUntilExpiration} jours`}
                    {searchType === 'expired' &&
                      ' • Domaines expirés disponibles'}
                    {searchType === 'keywords' &&
                      ` • Minimum ${minKeywords} keywords`}
                    {searchType === 'backlinks' &&
                      ` • Minimum ${minBacklinks} backlinks`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {searchType === 'expiring' && (
                  <span className="rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                    ⏰ Expirent bientôt
                  </span>
                )}
                {searchType === 'expired' && (
                  <span className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                    💀 Expirés
                  </span>
                )}
                {searchType === 'keywords' && (
                  <span className="rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                    📊 Keywords
                  </span>
                )}
                {searchType === 'backlinks' && (
                  <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    🔗 Backlinks
                  </span>
                )}
              </div>
            </div>

            <DomainWhoisAnalyzer data={domainsData} />
          </div>
        )}

        {!loading && !domainsData && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
            <div className="rounded-full bg-blue-100 p-6">
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Trouvez des opportunités de domaines
            </h3>
            <p className="mt-2 max-w-md text-gray-600">
              Recherchez des domaines expirés ou qui expirent bientôt avec leur
              historique SEO complet
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">💎</div>
                <h4 className="font-semibold text-gray-900">
                  Domaines à forte valeur
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Avec backlinks et keywords existants
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">🎯</div>
                <h4 className="font-semibold text-gray-900">Filtres avancés</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Par TLD, keywords, backlinks
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-2xl">⚡</div>
                <h4 className="font-semibold text-gray-900">
                  Données en temps réel
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Informations WHOIS à jour
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

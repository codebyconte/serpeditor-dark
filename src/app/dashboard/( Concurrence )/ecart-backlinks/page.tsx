'use client'

import { ClientPageHeader } from '@/components/dashboard/client-page-header'
import {
  AlertCircle,
  GitMerge,
  Loader2,
  Plus,
  Search,
  Target,
  X,
} from 'lucide-react'
import { useState } from 'react'
import {
  getDomainIntersection,
  type DomainIntersectionResponse,
} from './action'
import DomainIntersectionAnalyzer from './DomainIntersectionAnalyzer'

export default function DomainIntersectionAnalyzerPage() {
  const [targets, setTargets] = useState<string[]>(['', ''])
  const [excludeTargets, setExcludeTargets] = useState<string[]>([])
  const [showExclude, setShowExclude] = useState(false)
  const [intersectionMode, setIntersectionMode] = useState<'all' | 'partial'>(
    'partial',
  )
  const [limit, setLimit] = useState(100)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intersectionData, setIntersectionData] =
    useState<DomainIntersectionResponse | null>(null)

  const addTarget = () => {
    if (targets.length < 20) {
      setTargets([...targets, ''])
    }
  }

  const removeTarget = (index: number) => {
    if (targets.length > 2) {
      setTargets(targets.filter((_, i) => i !== index))
    }
  }

  const updateTarget = (index: number, value: string) => {
    const newTargets = [...targets]
    newTargets[index] = value
    setTargets(newTargets)
  }

  const addExcludeTarget = () => {
    if (excludeTargets.length < 10) {
      setExcludeTargets([...excludeTargets, ''])
    }
  }

  const removeExcludeTarget = (index: number) => {
    setExcludeTargets(excludeTargets.filter((_, i) => i !== index))
  }

  const updateExcludeTarget = (index: number, value: string) => {
    const newExcludeTargets = [...excludeTargets]
    newExcludeTargets[index] = value
    setExcludeTargets(newExcludeTargets)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    // Nettoyer et valider les targets
    const cleanedTargets = targets
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    if (cleanedTargets.length < 2) {
      setError('Veuillez entrer au moins 2 domaines cibles')
      return
    }

    // Créer l'objet targets
    const targetsObject: Record<string, string> = {}
    cleanedTargets.forEach((target, idx) => {
      targetsObject[String(idx + 1)] = target
    })

    // Nettoyer les exclusions
    const cleanedExcludes = excludeTargets
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    setLoading(true)
    setError(null)
    setIntersectionData(null)

    try {
      const result = await getDomainIntersection({
        targets: targetsObject,
        excludeTargets:
          cleanedExcludes.length > 0 ? cleanedExcludes : undefined,
        intersectionMode,
        limit,
      })

      if (result.success && result.data) {
        if (result.data.items.length === 0) {
          setError('Aucun domaine trouvé avec ces critères')
        } else {
          setIntersectionData(result.data)
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
          title="Analyseur d'Intersection de Domaines"
          description="Trouvez les sites qui pointent vers plusieurs de vos concurrents"
          icon={GitMerge}
          iconClassName="border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-rose-500/10 text-pink-500"
        />

        {/* Formulaire */}
        <div className="mb-8 rounded-2xl border bg-card p-8 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Explication */}
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <GitMerge className="h-5 w-5 flex-shrink-0 text-primary" />
                <div className="text-sm text-primary">
                  <strong className="font-semibold">Comment ça marche ?</strong>{' '}
                  Entrez les domaines de vos concurrents. L&apos;outil trouvera
                  les sites qui pointent vers plusieurs d&apos;entre eux - ce
                  sont vos meilleures opportunités de backlinks car ces sites
                  sont déjà intéressés par votre thématique !
                </div>
              </div>
            </div>

            {/* Domaines cibles */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Domaines Cibles <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-muted-foreground">
                  {targets.filter((t) => t.trim()).length}/20 domaines
                </span>
              </div>
              <div className="space-y-3">
                {targets.map((target, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={target}
                      onChange={(e) => updateTarget(index, e.target.value)}
                      placeholder="exemple.com ou https://exemple.com/page"
                      className="flex-1 rounded-xl border-2 border px-4 py-3 focus:border-ring focus:ring-4 focus:ring-ring/20"
                      disabled={loading}
                    />
                    {targets.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeTarget(index)}
                        disabled={loading}
                        className="rounded-lg border-2 border-destructive/50 bg-destructive/10 p-3 text-destructive hover:bg-red-100 disabled:opacity-50"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {targets.length < 20 && (
                <button
                  type="button"
                  onClick={addTarget}
                  disabled={loading}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border bg-card py-3 text-sm font-semibold text-foreground hover:border-gray-400 hover:bg-muted disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un domaine cible
                </button>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                💡 Entrez les domaines de vos concurrents directs (sans www, ou
                avec URL complète pour une page spécifique)
              </p>
            </div>

            {/* Domaines à exclure */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowExclude(!showExclude)}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-foreground"
                >
                  {showExclude ? '▼' : '▶'} Exclure certains domaines
                  (optionnel)
                </button>
                {excludeTargets.filter((t) => t.trim()).length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {excludeTargets.filter((t) => t.trim()).length}/10
                    exclusions
                  </span>
                )}
              </div>

              {showExclude && (
                <div className="space-y-3 rounded-xl border bg-card p-4">
                  {excludeTargets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune exclusion configurée
                    </p>
                  ) : (
                    excludeTargets.map((exclude, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={exclude}
                          onChange={(e) =>
                            updateExcludeTarget(index, e.target.value)
                          }
                          placeholder="domaine-a-exclure.com"
                          className="flex-1 rounded-lg border-2 border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => removeExcludeTarget(index)}
                          disabled={loading}
                          className="rounded-lg border border-red-200 bg-red-50 p-2 text-destructive hover:bg-red-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                  {excludeTargets.length < 10 && (
                    <button
                      type="button"
                      onClick={addExcludeTarget}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border bg-card py-2 text-sm font-medium text-foreground hover:bg-card"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter une exclusion
                    </button>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Les résultats excluront les domaines qui pointent vers ces
                    sites
                  </p>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Mode intersection */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Mode d&apos;intersection
                </label>
                <select
                  value={intersectionMode}
                  onChange={(e) =>
                    setIntersectionMode(e.target.value as 'all' | 'partial')
                  }
                  className="w-full rounded-xl border-2 border px-4 py-3 focus:border-ring focus:ring-4 focus:ring-ring/20"
                  disabled={loading}
                >
                  <option value="partial">
                    Partiel (domaines communs uniquement)
                  </option>
                  <option value="all">Tous (incluant domaines uniques)</option>
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  {intersectionMode === 'partial'
                    ? '✅ Recommandé : Affiche uniquement les sites qui pointent vers plusieurs targets'
                    : '⚠️ Affiche tous les backlinks, même ceux vers une seule target'}
                </p>
              </div>

              {/* Limite */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Nombre de résultats
                </label>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border px-4 py-3 focus:border-ring focus:ring-4 focus:ring-ring/20"
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

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading || targets.filter((t) => t.trim()).length < 2}
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
                  Analyser l&apos;intersection
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
              Analyse de l&apos;intersection en cours...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Recherche des domaines communs entre vos targets
            </p>
          </div>
        )}

        {!loading && intersectionData && (
          <div>
            <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <GitMerge className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {intersectionData.total_count.toLocaleString()} domaines
                    référents trouvés
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {intersectionData.items_count} affichés •{' '}
                    {Object.keys(intersectionData.targets).length} targets
                    analysées
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-lg px-3 py-1 text-sm font-medium ${
                    intersectionMode === 'partial'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {intersectionMode === 'partial'
                    ? '🎯 Intersection'
                    : '📊 Tous'}
                </span>
              </div>
            </div>

            <DomainIntersectionAnalyzer data={intersectionData} />
          </div>
        )}

        {!loading && !intersectionData && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border bg-card p-16 text-center">
            <div className="rounded-full bg-purple-100 p-6">
              <Target className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">
              Analysez vos concurrents
            </h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              Entrez les domaines de vos concurrents pour découvrir quels sites
              pointent vers eux
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 text-2xl">🎯</div>
                <h4 className="font-semibold text-foreground">
                  Opportunités ciblées
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Trouvez les sites qui connaissent déjà votre secteur
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 text-2xl">🔗</div>
                <h4 className="font-semibold text-foreground">
                  Backlinks qualifiés
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sites qui pointent vers plusieurs concurrents
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 text-2xl">⚡</div>
                <h4 className="font-semibold text-foreground">
                  Stratégie efficace
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Contactez-les pour obtenir un lien
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

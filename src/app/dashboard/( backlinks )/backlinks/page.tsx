'use client'

import { ClientPageHeader } from '@/components/dashboard/client-page-header'
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
 <div className="min-h-screen p-6">
 <div className="mx-auto max-w-7xl">
 <ClientPageHeader
 title="Analyseur de Backlinks"
 description="Analysez le profil de backlinks d'un domaine avec DataForSEO"
 icon={LinkIcon}
 iconClassName="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-500"
 />

 {/* Formulaire */}
 <div className="mb-8 rounded-2xl border bg-card p-8 shadow-lg">
 <form onSubmit={handleSearch} className="space-y-6">
 {/* Target */}
 <div>
 <label className="mb-2 block text-sm font-semibold">
 Domaine ou URL à analyser
 </label>
 <div className="relative">
 <LinkIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
 <input
 type="text"
 value={target}
 onChange={(e) => setTarget(e.target.value)}
 placeholder="exemple.com ou https://exemple.com/page"
 className="w-full rounded-xl border-2-input bg-background py-3 pr-4 pl-12 text-lg focus:border-ring focus:ring-4 focus:ring-ring/20"
 disabled={loading}
 />
 </div>
 <p className="mt-2 text-sm text-muted-foreground">
 Pour un domaine, tapez sans https:// ni www. Pour une page,
 utilisez l&apos;URL complète.
 </p>
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
 Analyser les backlinks
 </>
 )}
 </button>
 </form>

 {error && (
 <div className="mt-6 flex items-start gap-3 rounded-xl border-2-destructive/50 bg-destructive/10 p-4">
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
 <p className="mt-4 text-lg font-medium">
 Analyse des backlinks en cours...
 </p>
 <p className="mt-2 text-sm text-muted-foreground">
 Cela peut prendre quelques secondes
 </p>
 </div>
 )}

 {!loading && backlinksData && (
 <div>
 <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="rounded-lg bg-primary/10 p-3">
 <LinkIcon className="h-6 w-6 text-primary" />
 </div>
 <div>
 <h2 className="text-xl font-bold">
 {backlinksData.target}
 </h2>
 <p className="text-sm text-muted-foreground">
 {backlinksData.total_count.toLocaleString()} backlinks
 trouvés • {backlinksData.items_count} affichés
 </p>
 </div>
 </div>
 <div className="rounded-lg bg-muted px-4 py-2">
 <span className="text-sm font-medium capitalize">
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
 <div className="flex flex-col items-center justify-center rounded-2xl border-2-dashed bg-card/50 p-16 text-center">
 <div className="rounded-full bg-primary/10 p-6">
 <LinkIcon className="h-12 w-12 text-primary" />
 </div>
 <h3 className="mt-6 text-xl font-semibold">
 Analysez votre profil de backlinks
 </h3>
 <p className="mt-2 max-w-md text-muted-foreground">
 Découvrez qui pointe vers votre site, analysez la qualité des
 liens et identifiez les opportunités d&apos;amélioration
 </p>
 <div className="mt-8 grid grid-cols-3 gap-6 text-left">
 <div className="rounded-xl border bg-card p-4">
 <div className="mb-2 text-2xl">🔗</div>
 <h4 className="font-semibold">Profil complet</h4>
 <p className="mt-1 text-sm text-muted-foreground">
 Tous les backlinks avec métadonnées détaillées
 </p>
 </div>
 <div className="rounded-xl border bg-card p-4">
 <div className="mb-2 text-2xl">📊</div>
 <h4 className="font-semibold">
 Statistiques avancées
 </h4>
 <p className="mt-1 text-sm text-muted-foreground">
 Domain Rank, Spam Score, pays, TLD
 </p>
 </div>
 <div className="rounded-xl border bg-card p-4">
 <div className="mb-2 text-2xl">🎯</div>
 <h4 className="font-semibold">
 Analyse des anchors
 </h4>
 <p className="mt-1 text-sm text-muted-foreground">
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

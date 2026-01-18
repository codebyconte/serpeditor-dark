'use client'

import { Button as DashboardButton } from '@/components/dashboard/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dashboard/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowDown, ArrowUp, Eye, Loader2, Plus, RefreshCw, Search, Trash2, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  addKeyword,
  deleteKeyword,
  getDomains,
  getHistoricalRankOverview,
  getKeywordHistory,
  getTrackedKeywords,
  updateAllKeywordPositions,
  updateKeywordMetrics,
  updateKeywordPosition,
} from './action'

interface Domain {
  id: string
  name: string
  url: string
}

interface DomainMetrics {
  organic: {
    pos_1: number
    pos_2_3: number
    pos_4_10: number
    pos_11_20: number
    pos_21_30: number
    pos_31_40: number
    pos_41_50: number
    pos_51_60: number
    pos_61_70: number
    pos_71_80: number
    pos_81_90: number
    pos_91_100: number
    etv: number
    count: number
    estimated_paid_traffic_cost: number
    is_new: number
    is_up: number
    is_down: number
    is_lost: number
    clickstream_etv?: number
    clickstream_gender_distribution?: {
      female: number
      male: number
    }
    clickstream_age_distribution?: {
      '18-24': number
      '25-34': number
      '35-44': number
      '45-54': number
      '55-64': number
    }
  }
  paid: {
    pos_1: number
    pos_2_3: number
    pos_4_10: number
    pos_11_20: number
    pos_21_30: number
    pos_31_40: number
    pos_41_50: number
    pos_51_60: number
    pos_61_70: number
    pos_71_80: number
    pos_81_90: number
    pos_91_100: number
    etv: number
    count: number
    estimated_paid_traffic_cost: number
    is_new: number
    is_up: number
    is_down: number
    is_lost: number
    clickstream_etv?: number
    clickstream_gender_distribution?: {
      female: number
      male: number
    }
    clickstream_age_distribution?: {
      '18-24': number
      '25-34': number
      '35-44': number
      '45-54': number
      '55-64': number
    }
  }
}

interface HistoricalDataItem {
  se_type: string
  year: number
  month: number
  metrics: DomainMetrics
}

interface TrackedKeyword {
  id: string
  keyword: string
  projectId: string
  locationCode: number
  languageCode: string
  rankGroup: number | null
  rankAbsolute: number | null
  previousRank: number | null
  rankedUrl: string | null
  searchVolume: number | null
  cpc: number | null
  competition: number | null
  competitionLevel: string | null
  visibilityScore: number | null
  estimatedCtr: number | null
  estimatedTraffic: number | null
  createdAt: Date
  updatedAt: Date
  lastCheckedAt: Date | null
  project: {
    id: string
    url: string
  }
}

export default function RankOverviewContent() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [overviewData, setOverviewData] = useState<DomainMetrics | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalDataItem[]>([])
  const [trackedKeywords, setTrackedKeywords] = useState<TrackedKeyword[]>([])
  const [loadingKeywords, setLoadingKeywords] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [addingKeyword, setAddingKeyword] = useState(false)
  const [showPaidMetrics, setShowPaidMetrics] = useState(false)
  const [loadingKeywordData, setLoadingKeywordData] = useState<Record<string, boolean>>({})
  const [deletingKeywords, setDeletingKeywords] = useState<Set<string>>(new Set())
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [keywordToDelete, setKeywordToDelete] = useState<{
    id: string
    keyword: string
  } | null>(null)
  const [updatingPositions, setUpdatingPositions] = useState(false)
  const [updatingKeywordId, setUpdatingKeywordId] = useState<string | null>(null)
  const [selectedKeywordForDetails, setSelectedKeywordForDetails] = useState<TrackedKeyword | null>(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [keywordHistory, setKeywordHistory] = useState<
    Array<{
      id: string
      rankGroup: number | null
      rankAbsolute: number | null
      checkedAt: Date
    }>
  >([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Charger les domaines au montage
  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    const result = await getDomains()
    if (result.success && 'data' in result && result.data) {
      setDomains(result.data)
      if (result.data.length > 0) {
        setSelectedDomain(result.data[0].url)
        setSelectedProjectId(result.data[0].id)
      }
    }
  }

  const loadTrackedKeywords = useCallback(async () => {
    if (!selectedProjectId) return
    setLoadingKeywords(true)
    try {
      const result = await getTrackedKeywords(selectedProjectId)
      if (result.success && 'data' in result && result.data) {
        setTrackedKeywords(result.data)
      } else if (result.error) {
        toast.error(result.error || 'Erreur lors du chargement des mots-clés')
      }
    } catch (error) {
      console.error('Error loading tracked keywords:', error)
      toast.error('Erreur lors du chargement des mots-clés')
    } finally {
      setLoadingKeywords(false)
    }
  }, [selectedProjectId])

  const loadKeywordData = async (keyword: TrackedKeyword) => {
    if (loadingKeywordData[keyword.id]) return

    setLoadingKeywordData((prev) => ({ ...prev, [keyword.id]: true }))
    const toastId = toast.loading('Chargement des métriques...')
    try {
      // Utiliser la nouvelle fonction qui sauvegarde en base
      const result = await updateKeywordMetrics(keyword.id)
      if (result.success) {
        toast.success('Métriques mises à jour avec succès', { id: toastId })
        // Recharger les mots-clés pour afficher les nouvelles données
        await loadTrackedKeywords()
      } else {
        toast.error(result.error || 'Erreur lors du chargement des métriques', { id: toastId })
      }
    } catch (error) {
      console.error('Error loading keyword data:', error)
      toast.error('Erreur lors du chargement des métriques', { id: toastId })
    } finally {
      setLoadingKeywordData((prev) => ({ ...prev, [keyword.id]: false }))
    }
  }

  const handleUpdateAllPositions = async () => {
    if (!selectedProjectId) return

    setUpdatingPositions(true)
    const toastId = toast.loading('Mise à jour des positions en cours...')
    try {
      const result = await updateAllKeywordPositions(selectedProjectId)
      if (result.success) {
        toast.success('Positions mises à jour avec succès', { id: toastId })
        await loadTrackedKeywords()
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour des positions', { id: toastId })
      }
    } catch (error) {
      console.error('Error updating positions:', error)
      toast.error('Erreur lors de la mise à jour des positions', { id: toastId })
    } finally {
      setUpdatingPositions(false)
    }
  }

  const handleUpdateKeywordPosition = async (keywordId: string) => {
    setUpdatingKeywordId(keywordId)
    try {
      const result = await updateKeywordPosition(keywordId)
      if (result.success) {
        toast.success('Position mise à jour avec succès')
        await loadTrackedKeywords()
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour de la position')
      }
    } catch (error) {
      console.error('Error updating keyword position:', error)
      toast.error('Erreur lors de la mise à jour de la position')
    } finally {
      setUpdatingKeywordId(null)
    }
  }

  const handleViewDetails = async (keyword: TrackedKeyword) => {
    setSelectedKeywordForDetails(keyword)
    setIsDetailPanelOpen(true)
    // Charger l'historique
    setLoadingHistory(true)
    try {
      const result = await getKeywordHistory(keyword.id, 90)
      if (result.success && 'data' in result && result.data) {
        setKeywordHistory(result.data)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleDeleteClick = (keyword: TrackedKeyword) => {
    setKeywordToDelete({ id: keyword.id, keyword: keyword.keyword })
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!keywordToDelete) return

    setDeletingKeywords((prev) => new Set(prev).add(keywordToDelete.id))
    try {
      const result = await deleteKeyword(keywordToDelete.id)
      if (result.success) {
        toast.success('Mot-clé supprimé avec succès')
        setIsDeleteDialogOpen(false)
        setKeywordToDelete(null)
        await loadTrackedKeywords()
      } else {
        toast.error(result.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting keyword:', error)
      toast.error('Erreur lors de la suppression du mot-clé')
    } finally {
      setDeletingKeywords((prev) => {
        const next = new Set(prev)
        next.delete(keywordToDelete.id)
        return next
      })
    }
  }

  useEffect(() => {
    loadTrackedKeywords()
  }, [loadTrackedKeywords])

  const handleAddKeyword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newKeyword.trim() || !selectedProjectId) return

    setAddingKeyword(true)
    const toastId = toast.loading('Ajout du mot-clé en cours...')
    try {
      const formData = new FormData()
      formData.set('keyword', newKeyword.trim())
      formData.set('projectId', selectedProjectId)
      formData.set('locationCode', '2250')
      formData.set('languageCode', 'fr')

      const result = await addKeyword(formData)
      if (result.success) {
        toast.success('Mot-clé ajouté avec succès', { id: toastId })
        setNewKeyword('')
        setIsAddDialogOpen(false)
        await loadTrackedKeywords()
      } else {
        toast.error(result.error || 'Erreur lors de l&apos;ajout du mot-clé', { id: toastId })
      }
    } catch (error) {
      console.error('Error adding keyword:', error)
      toast.error('Erreur lors de l&apos;ajout du mot-clé', { id: toastId })
    } finally {
      setAddingKeyword(false)
    }
  }

  // Charger les données quand un domaine est sélectionné
  const loadData = useCallback(async () => {
    if (!selectedDomain) return

    try {
      // Charger Historical Rank Overview
      const historicalResult = await getHistoricalRankOverview(selectedDomain, 2250, 'fr')

      if (
        historicalResult.success &&
        'data' in historicalResult &&
        historicalResult.data &&
        historicalResult.data.items &&
        historicalResult.data.items.length > 0
      ) {
        // Trier par année et mois (le plus récent en premier)
        const sortedItems = [...historicalResult.data.items].sort((a, b) => {
          if (a.year !== b.year) {
            return b.year - a.year
          }
          return b.month - a.month
        })

        // Définir les données du dernier mois pour l'aperçu
        const latestItem = sortedItems[0]
        setOverviewData(latestItem.metrics)

        // Stocker toutes les données historiques
        setHistoricalData(sortedItems)
      } else {
        if (historicalResult.error) {
          toast.error(historicalResult.error || 'Erreur lors du chargement des données historiques')
        }
        setOverviewData(null)
        setHistoricalData([])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Erreur lors du chargement des données historiques')
      setOverviewData(null)
      setHistoricalData([])
    }
  }, [selectedDomain])

  // Charger les données automatiquement quand le domaine change ou la page change
  useEffect(() => {
    if (selectedDomain && domains.length > 0) {
      loadData()
    }
  }, [selectedDomain, loadData, domains.length])

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return '-'
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  const formatCurrency = (num: number | null | undefined) => {
    if (num === null || num === undefined) return '-'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(num)
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection du domaine */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vue d&apos;ensemble des positions</h1>
          <p className="text-muted-foreground mt-1">Suivez les performances de vos domaines sur Google</p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedDomain}
            onValueChange={(url) => {
              setSelectedDomain(url)
              const domain = domains.find((d) => d.url === url)
              if (domain) {
                setSelectedProjectId(domain.id)
              }
            }}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Sélectionner un domaine" />
            </SelectTrigger>
            <SelectContent className="bg-mist-600">
              {domains.map((domain) => (
                <SelectItem key={domain.id} value={domain.url}>
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métriques globales - Organique */}
      {overviewData && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Métriques organiques</h2>
            <Button variant="outline" className="h-9" onClick={() => setShowPaidMetrics(!showPaidMetrics)}>
              {showPaidMetrics ? 'Masquer' : 'Afficher'} les métriques payantes
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mots-clés positionnés</CardTitle>
                <TrendingUp className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(overviewData.organic.count)}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge color="green" className="text-xs">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    {overviewData.organic.is_up}
                  </Badge>
                  <Badge color="red" className="text-xs">
                    <ArrowDown className="mr-1 h-3 w-3" />
                    {overviewData.organic.is_down}
                  </Badge>
                  {overviewData.organic.is_new > 0 && (
                    <Badge color="blue" className="text-xs">
                      +{overviewData.organic.is_new} nouveau
                    </Badge>
                  )}
                  {overviewData.organic.is_lost > 0 && (
                    <Badge color="zinc" className="text-xs">
                      -{overviewData.organic.is_lost} perdu
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top 3</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overviewData.organic.pos_1 + overviewData.organic.pos_2_3)}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">{overviewData.organic.pos_1} en position 1</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top 10</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(overviewData.organic.pos_4_10)}</div>
                <p className="text-muted-foreground mt-1 text-xs">Positions 4-10</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trafic estimé (ETV)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(Math.round(overviewData.organic.etv))}</div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Valeur: {formatCurrency(overviewData.organic.estimated_paid_traffic_cost)}
                </p>
                {overviewData.organic.clickstream_etv && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    Clickstream ETV: {formatNumber(Math.round(overviewData.organic.clickstream_etv))}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Métriques payantes */}
          {showPaidMetrics && overviewData.paid && (
            <>
              <h2 className="text-xl font-semibold">Métriques payantes</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mots-clés payants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(overviewData.paid.count)}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge color="green" className="text-xs">
                        <ArrowUp className="mr-1 h-3 w-3" />
                        {overviewData.paid.is_up}
                      </Badge>
                      <Badge color="red" className="text-xs">
                        <ArrowDown className="mr-1 h-3 w-3" />
                        {overviewData.paid.is_down}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top 3 Payant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(overviewData.paid.pos_1 + overviewData.paid.pos_2_3)}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">{overviewData.paid.pos_1} en position 1</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ETV Payant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(Math.round(overviewData.paid.etv))}</div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Coût estimé: {formatCurrency(overviewData.paid.estimated_paid_traffic_cost)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top 10 Payant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(overviewData.paid.pos_4_10)}</div>
                    <p className="text-muted-foreground mt-1 text-xs">Positions 4-10</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Distribution par genre et âge (si disponible) */}
          {overviewData.organic.clickstream_gender_distribution &&
            overviewData.organic.clickstream_age_distribution && (
              <Card>
                <CardHeader>
                  <CardTitle>Démographie du trafic (Clickstream)</CardTitle>
                  <CardDescription>Répartition par genre et âge basée sur les données clickstream</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-sm font-medium">Par genre</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Femme</span>
                          <span className="font-medium">
                            {overviewData.organic.clickstream_gender_distribution.female || 0}%
                          </span>
                        </div>
                        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                          <div
                            className="h-full bg-pink-500"
                            style={{
                              width: `${overviewData.organic.clickstream_gender_distribution.female || 0}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Homme</span>
                          <span className="font-medium">
                            {overviewData.organic.clickstream_gender_distribution.male || 0}%
                          </span>
                        </div>
                        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${overviewData.organic.clickstream_gender_distribution.male || 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-3 text-sm font-medium">Par âge</h3>
                      <div className="space-y-2">
                        {Object.entries(overviewData.organic.clickstream_age_distribution).map(([age, percentage]) => (
                          <div key={age}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{age} ans</span>
                              <span className="font-medium">{percentage || 0}%</span>
                            </div>
                            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                              <div
                                className="h-full bg-purple-500"
                                style={{
                                  width: `${percentage || 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
        </>
      )}

      {/* Distribution des positions */}
      {overviewData && (
        <Card>
          <CardHeader>
            <CardTitle>Distribution des positions</CardTitle>
            <CardDescription>Répartition de vos mots-clés par tranches de positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{overviewData.organic.pos_1}</div>
                <div className="text-muted-foreground text-sm">Position 1</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{overviewData.organic.pos_2_3}</div>
                <div className="text-muted-foreground text-sm">Pos. 2-3</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{overviewData.organic.pos_4_10}</div>
                <div className="text-muted-foreground text-sm">Pos. 4-10</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{overviewData.organic.pos_11_20}</div>
                <div className="text-muted-foreground text-sm">Pos. 11-20</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{overviewData.organic.pos_21_30}</div>
                <div className="text-muted-foreground text-sm">Pos. 21-30</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mots-clés suivis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mots-clés suivis</CardTitle>
              <CardDescription>Gérez les mots-clés que vous souhaitez suivre pour ce projet</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {trackedKeywords.length > 0 && (
                <Button
                  onClick={handleUpdateAllPositions}
                  disabled={!selectedProjectId || updatingPositions}
                  variant="outline"
                >
                  {updatingPositions ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Mettre à jour les positions
                    </>
                  )}
                </Button>
              )}
              <Button onClick={() => setIsAddDialogOpen(true)} disabled={!selectedProjectId}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un mot-clé
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingKeywords ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : trackedKeywords.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Aucun mot-clé n&apos;est suivi pour ce projet.</p>
              <Button onClick={() => setIsAddDialogOpen(true)} disabled={!selectedProjectId}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter votre premier mot-clé
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mot-clé</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>CPC</TableHead>
                    <TableHead>Difficulté</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Dernière vérification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trackedKeywords.map((kw) => {
                    const isLoading = loadingKeywordData[kw.id]
                    const isDeleting = deletingKeywords.has(kw.id)

                    return (
                      <TableRow key={kw.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{kw.keyword}</span>
                            {(!kw.searchVolume || !kw.cpc) && !isLoading && (
                              <Button
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => loadKeywordData(kw)}
                                title="Charger les métriques manquantes (Volume, CPC, Difficulté)"
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            {/* Position actuelle */}
                            <div className="flex items-center gap-2">
                              {kw.rankGroup !== null ? (
                                <>
                                  <Badge
                                    className={
                                      kw.rankGroup <= 3
                                        ? 'bg-green-500'
                                        : kw.rankGroup <= 10
                                          ? 'bg-blue-500'
                                          : kw.rankGroup <= 20
                                            ? 'bg-yellow-500'
                                            : 'bg-gray-500'
                                    }
                                  >
                                    #{kw.rankGroup}
                                  </Badge>
                                  {kw.rankAbsolute && (
                                    <span className="text-muted-foreground text-xs">(abs: {kw.rankAbsolute})</span>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted-foreground">Non classé</span>
                              )}
                            </div>
                            {/* Ancienne position et évolution */}
                            {kw.previousRank !== null && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">Précédent: #{kw.previousRank}</span>
                                {kw.rankGroup !== null && (
                                  <>
                                    {kw.rankGroup < kw.previousRank ? (
                                      <Badge color="green" className="flex items-center gap-1 text-xs">
                                        <ArrowUp className="h-3 w-3" />+{kw.previousRank - kw.rankGroup}
                                      </Badge>
                                    ) : kw.rankGroup > kw.previousRank ? (
                                      <Badge color="red" className="flex items-center gap-1 text-xs">
                                        <ArrowDown className="h-3 w-3" />-{kw.rankGroup - kw.previousRank}
                                      </Badge>
                                    ) : (
                                      <Badge color="zinc" className="text-xs">
                                        =
                                      </Badge>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            {kw.previousRank === null && kw.rankGroup !== null && (
                              <span className="text-xs text-blue-600">Nouvelle position</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {kw.searchVolume ? (
                            formatNumber(kw.searchVolume)
                          ) : isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {kw.cpc ? (
                            formatCurrency(kw.cpc)
                          ) : kw.cpc === null ? (
                            '-'
                          ) : isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {kw.competition !== null && kw.competition !== undefined ? (
                            `${Math.round(kw.competition * 100)}%`
                          ) : kw.competitionLevel ? (
                            <Badge color="zinc">{kw.competitionLevel}</Badge>
                          ) : isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {kw.locationCode} ({kw.languageCode})
                          </span>
                        </TableCell>
                        <TableCell>
                          {kw.lastCheckedAt ? (
                            <span className="text-muted-foreground text-sm">
                              {new Date(kw.lastCheckedAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Jamais</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewDetails(kw)}
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateKeywordPosition(kw.id)}
                              disabled={updatingKeywordId === kw.id}
                              title="Vérifier la position"
                            >
                              {updatingKeywordId === kw.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDeleteClick(kw)}
                              disabled={isDeleting}
                              title="Supprimer"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-red-500" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Données historiques */}
      {historicalData.length > 0 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Évolution historique</CardTitle>
              <CardDescription>Données de positionnement sur les 6 derniers mois (organique et payant)</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Période</TableHead>
                    <TableHead colSpan={2} className="text-center">
                      Organique
                    </TableHead>
                    <TableHead colSpan={2} className="text-center">
                      Payant
                    </TableHead>
                    <TableHead>ETV Organique</TableHead>
                    <TableHead>ETV Clickstream</TableHead>
                    <TableHead>Évolution</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Mots-clés</TableHead>
                    <TableHead>Top 3</TableHead>
                    <TableHead>Mots-clés</TableHead>
                    <TableHead>Top 3</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicalData.slice(0, 6).map((item, idx) => {
                    const monthName = new Date(item.year, item.month - 1).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    })
                    const prevItem = idx < historicalData.length - 1 ? historicalData[idx + 1] : null
                    const etvChange = prevItem && item.metrics.organic.etv - prevItem.metrics.organic.etv
                    const countChange = prevItem && item.metrics.organic.count - prevItem.metrics.organic.count
                    const paidCountChange = prevItem && item.metrics.paid.count - prevItem.metrics.paid.count

                    return (
                      <TableRow key={`${item.year}-${item.month}`}>
                        <TableCell className="font-medium">{monthName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {formatNumber(item.metrics.organic.count)}
                            {countChange !== null && countChange !== 0 && (
                              <Badge color={countChange > 0 ? 'green' : 'red'} className="text-xs">
                                {countChange > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                {Math.abs(countChange).toLocaleString('fr-FR')}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatNumber(item.metrics.organic.pos_1 + item.metrics.organic.pos_2_3)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {formatNumber(item.metrics.paid.count)}
                            {paidCountChange !== null && paidCountChange !== 0 && (
                              <Badge color={paidCountChange > 0 ? 'green' : 'red'} className="text-xs">
                                {paidCountChange > 0 ? (
                                  <ArrowUp className="h-3 w-3" />
                                ) : (
                                  <ArrowDown className="h-3 w-3" />
                                )}
                                {Math.abs(paidCountChange).toLocaleString('fr-FR')}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatNumber(item.metrics.paid.pos_1 + item.metrics.paid.pos_2_3)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{formatNumber(Math.round(item.metrics.organic.etv))}</span>
                            {etvChange !== null && etvChange !== 0 && (
                              <span className={`text-xs ${etvChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {etvChange > 0 ? '+' : ''}
                                {formatNumber(Math.round(etvChange))}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.metrics.organic.clickstream_etv ? (
                            <span className="font-medium">
                              {formatNumber(Math.round(item.metrics.organic.clickstream_etv))}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.metrics.organic.is_new > 0 && (
                              <Badge color="blue" className="text-xs">
                                +{item.metrics.organic.is_new.toLocaleString('fr-FR')}
                              </Badge>
                            )}
                            {item.metrics.organic.is_up > 0 && (
                              <Badge color="green" className="text-xs">
                                <ArrowUp className="h-3 w-3" />
                                {item.metrics.organic.is_up.toLocaleString('fr-FR')}
                              </Badge>
                            )}
                            {item.metrics.organic.is_down > 0 && (
                              <Badge color="red" className="text-xs">
                                <ArrowDown className="h-3 w-3" />
                                {item.metrics.organic.is_down.toLocaleString('fr-FR')}
                              </Badge>
                            )}
                            {item.metrics.organic.is_lost > 0 && (
                              <Badge color="zinc" className="text-xs">
                                -{item.metrics.organic.is_lost.toLocaleString('fr-FR')}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour ajouter un mot-clé */}
      <Dialog open={isAddDialogOpen} onClose={setIsAddDialogOpen}>
        <form onSubmit={handleAddKeyword}>
          <DialogTitle>Ajouter un mot-clé à suivre</DialogTitle>
          <DialogDescription>
            Ajoutez un mot-clé pour suivre sa position dans les résultats de recherche Google pour ce projet.
          </DialogDescription>
          <DialogBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Mot-clé</Label>
                <Input
                  id="keyword"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Ex: référencement naturel"
                  required
                  disabled={addingKeyword}
                />
              </div>
              <div className="bg-muted text-muted-foreground rounded-lg p-3 text-sm">
                <p>
                  <strong>Projet:</strong> {domains.find((d) => d.id === selectedProjectId)?.name || 'Non sélectionné'}
                </p>
                <p className="mt-1">
                  <strong>Localisation:</strong> France (2250) - Français (fr)
                </p>
              </div>
            </div>
          </DialogBody>
          <DialogActions>
            <DashboardButton
              plain
              onClick={() => {
                setIsAddDialogOpen(false)
                setNewKeyword('')
              }}
              disabled={addingKeyword}
            >
              Annuler
            </DashboardButton>
            <DashboardButton color="indigo" type="submit" disabled={addingKeyword || !newKeyword.trim()}>
              {addingKeyword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout...
                </>
              ) : (
                'Ajouter'
              )}
            </DashboardButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog de confirmation pour supprimer un mot-clé */}
      <Dialog open={isDeleteDialogOpen} onClose={setIsDeleteDialogOpen}>
        <DialogTitle>Supprimer le mot-clé</DialogTitle>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer le mot-clé <strong>&quot;{keywordToDelete?.keyword}&quot;</strong> ? Cette
          action est irréversible.
        </DialogDescription>
        <DialogBody>
          <p className="text-muted-foreground text-sm">
            Toutes les données associées à ce mot-clé seront également supprimées.
          </p>
        </DialogBody>
        <DialogActions>
          <DashboardButton
            plain
            onClick={() => {
              setIsDeleteDialogOpen(false)
              setKeywordToDelete(null)
            }}
            disabled={keywordToDelete ? deletingKeywords.has(keywordToDelete.id) : false}
          >
            Annuler
          </DashboardButton>
          <DashboardButton
            color="red"
            onClick={handleConfirmDelete}
            disabled={!keywordToDelete || (keywordToDelete ? deletingKeywords.has(keywordToDelete.id) : false)}
          >
            {keywordToDelete && deletingKeywords.has(keywordToDelete.id) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              'Supprimer'
            )}
          </DashboardButton>
        </DialogActions>
      </Dialog>

      {/* Panel latéral pour les détails du mot-clé */}
      <Sheet open={isDetailPanelOpen} onOpenChange={setIsDetailPanelOpen}>
        <SheetContent className="overflow-y-auto bg-mist-600 p-4 sm:max-w-2xl">
          {selectedKeywordForDetails && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedKeywordForDetails.keyword}</SheetTitle>
                <SheetDescription>Détails et historique de position</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Métriques actuelles */}
                <div>
                  <h3 className="dashboard-heading-4 mb-3">Métriques actuelles</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="dashboard-body-sm font-medium">Position</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="dashboard-heading-2">
                          {selectedKeywordForDetails.rankGroup ? (
                            <>
                              #{selectedKeywordForDetails.rankGroup}
                              {selectedKeywordForDetails.rankAbsolute && (
                                <span className="text-muted-foreground dashboard-body-sm ml-2">
                                  (abs: {selectedKeywordForDetails.rankAbsolute})
                                </span>
                              )}
                            </>
                          ) : (
                            'Non classé'
                          )}
                        </div>
                        {selectedKeywordForDetails.previousRank !== null && (
                          <div className="text-muted-foreground dashboard-text-xs mt-2">
                            Position précédente: #{selectedKeywordForDetails.previousRank}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="dashboard-body-sm font-medium">Volume de recherche</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="dashboard-heading-2">
                          {selectedKeywordForDetails.searchVolume
                            ? formatNumber(selectedKeywordForDetails.searchVolume)
                            : '-'}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="dashboard-body-sm font-medium">Score de visibilité</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="dashboard-heading-2">
                          {selectedKeywordForDetails.visibilityScore
                            ? `${selectedKeywordForDetails.visibilityScore.toFixed(1)}/100`
                            : '-'}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="dashboard-body-sm font-medium">Trafic estimé</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="dashboard-heading-2">
                          {selectedKeywordForDetails.estimatedTraffic
                            ? formatNumber(selectedKeywordForDetails.estimatedTraffic)
                            : '-'}
                        </div>
                        {selectedKeywordForDetails.estimatedCtr && (
                          <div className="text-muted-foreground dashboard-text-xs mt-2">
                            CTR: {(selectedKeywordForDetails.estimatedCtr * 100).toFixed(1)}%
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {selectedKeywordForDetails.cpc && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="dashboard-body-sm font-medium">CPC</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="dashboard-heading-2">{formatCurrency(selectedKeywordForDetails.cpc)}</div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedKeywordForDetails.competition !== null && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="dashboard-body-sm font-medium">Compétition</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="dashboard-heading-2">
                            {Math.round(selectedKeywordForDetails.competition * 100)}%
                          </div>
                          {selectedKeywordForDetails.competitionLevel && (
                            <Badge color="zinc" className="mt-2">
                              {selectedKeywordForDetails.competitionLevel}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Historique des positions */}
                <div>
                  <h3 className="dashboard-heading-4 mb-3">Historique des positions</h3>
                  {loadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : keywordHistory.length > 0 ? (
                    <Card>
                      <CardContent className="p-0">
                        <div className="max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Position absolue</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {keywordHistory.map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell className="dashboard-body-sm">
                                    {new Date(entry.checkedAt).toLocaleDateString('fr-FR', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </TableCell>
                                  <TableCell>
                                    {entry.rankGroup !== null ? (
                                      <Badge
                                        className={
                                          entry.rankGroup <= 3
                                            ? 'bg-green-500'
                                            : entry.rankGroup <= 10
                                              ? 'bg-blue-500'
                                              : entry.rankGroup <= 20
                                                ? 'bg-yellow-500'
                                                : 'bg-gray-500'
                                        }
                                      >
                                        #{entry.rankGroup}
                                      </Badge>
                                    ) : (
                                      <span className="text-muted-foreground">Non classé</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {entry.rankAbsolute !== null ? (
                                      <span className="text-muted-foreground dashboard-body-sm">
                                        #{entry.rankAbsolute}
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Aucun historique disponible</p>
                        <p className="text-muted-foreground dashboard-text-xs mt-2">
                          L&apos;historique sera créé lors des prochaines vérifications de position
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Informations supplémentaires */}
                <div>
                  <h3 className="dashboard-heading-4 mb-3">Informations</h3>
                  <Card>
                    <CardContent className="space-y-3 pt-6">
                      <div className="flex items-center justify-between">
                        <span className="dashboard-body-sm text-muted-foreground">Localisation</span>
                        <Badge color="zinc">
                          {selectedKeywordForDetails.locationCode} ({selectedKeywordForDetails.languageCode})
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="dashboard-body-sm text-muted-foreground">Dernière vérification</span>
                        <span className="dashboard-body-sm">
                          {selectedKeywordForDetails.lastCheckedAt
                            ? new Date(selectedKeywordForDetails.lastCheckedAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Jamais'}
                        </span>
                      </div>
                      {selectedKeywordForDetails.rankedUrl && (
                        <div className="flex items-start justify-between">
                          <span className="dashboard-body-sm text-muted-foreground">URL classée</span>
                          <a
                            href={selectedKeywordForDetails.rankedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dashboard-body-sm text-primary hover:underline"
                          >
                            {selectedKeywordForDetails.rankedUrl}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

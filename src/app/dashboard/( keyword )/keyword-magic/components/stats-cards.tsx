// 📁 app/dashboard/keyword-magic/components/stats-cards.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, BarChart3, Sparkles, TrendingUp } from 'lucide-react'
import type { KeywordItem } from '../types'

interface StatsCardsProps {
  data: KeywordItem[]
  selectedCount: number
}

export function StatsCards({ data, selectedCount }: StatsCardsProps) {
  const totalVolume = data.reduce(
    (sum, item) => sum + (item.keyword_info?.search_volume || 0),
    0,
  )

  const avgCPC =
    data.length > 0
      ? data.reduce((sum, item) => sum + (item.keyword_info?.cpc || 0), 0) /
        data.length
      : 0

  const highCompetition = data.filter(
    (item) => item.keyword_info?.competition_level === 'HIGH',
  ).length

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total mots-clés</CardTitle>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {data.length.toLocaleString('fr-FR')}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {selectedCount > 0 &&
              `${selectedCount} sélectionné${selectedCount > 1 ? 's' : ''}`}
            {selectedCount === 0 && 'Aucune sélection'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volume total</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {totalVolume.toLocaleString('fr-FR')}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">recherches/mois</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPC moyen</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${avgCPC.toFixed(2)}</div>
          <p className="mt-1 text-xs text-muted-foreground">par clic</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Haute concurrence
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{highCompetition}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {data.length > 0
              ? `${((highCompetition / data.length) * 100).toFixed(0)}% du total`
              : 'N/A'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

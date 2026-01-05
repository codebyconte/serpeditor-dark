// 📁 app/dashboard/keyword-magic/components/search-form.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, Loader2, Search, Sparkles } from 'lucide-react'

interface SearchFormProps {
  keyword: string
  onKeywordChange: (value: string) => void
  minVolume: string
  maxVolume: string
  minCPC: string
  maxCPC: string
  competitionLevel: string
  onMinVolumeChange: (value: string) => void
  onMaxVolumeChange: (value: string) => void
  onMinCPCChange: (value: string) => void
  onMaxCPCChange: (value: string) => void
  onCompetitionLevelChange: (value: string) => void
  onSearch: () => void
  isLoading: boolean
}

export function SearchForm({
  keyword,
  onKeywordChange,
  minVolume,
  maxVolume,
  minCPC,
  maxCPC,
  competitionLevel,
  onMinVolumeChange,
  onMaxVolumeChange,
  onMinCPCChange,
  onMaxCPCChange,
  onCompetitionLevelChange,
  onSearch,
  isLoading,
}: SearchFormProps) {
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Recherche de mots-clés
        </CardTitle>
        <CardDescription>
          Entrez un mot-clé seed pour découvrir des opportunités
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recherche principale */}
        <div className="flex gap-3">
          <Input
            placeholder="Ex: marketing digital, recette gateau..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && onSearch()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={onSearch} disabled={isLoading || !keyword.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recherche...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyser
              </>
            )}
          </Button>
        </div>

        {/* Filtres avancés */}
        <details className="group rounded-lg border p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-medium">
            <Filter className="h-4 w-4" />
            Filtres avancés
            <span className="ml-auto text-sm text-muted-foreground group-open:hidden">
              Cliquez pour ouvrir
            </span>
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="minVolume">Volume minimum</Label>
              <Input
                id="minVolume"
                type="number"
                placeholder="100"
                value={minVolume}
                onChange={(e) => onMinVolumeChange(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxVolume">Volume maximum</Label>
              <Input
                id="maxVolume"
                type="number"
                placeholder="10000"
                value={maxVolume}
                onChange={(e) => onMaxVolumeChange(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="competition">Niveau de concurrence</Label>
              <Select
                value={competitionLevel}
                onValueChange={onCompetitionLevelChange}
              >
                <SelectTrigger id="competition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="high">Élevé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minCPC">CPC minimum ($)</Label>
              <Input
                id="minCPC"
                type="number"
                step="0.01"
                placeholder="0.50"
                value={minCPC}
                onChange={(e) => onMinCPCChange(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxCPC">CPC maximum ($)</Label>
              <Input
                id="maxCPC"
                type="number"
                step="0.01"
                placeholder="5.00"
                value={maxCPC}
                onChange={(e) => onMaxCPCChange(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}

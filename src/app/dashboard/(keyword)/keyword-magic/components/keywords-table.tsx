// 📁 app/dashboard/keyword-magic/components/keywords-table.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { KeywordItem } from '../types'

interface KeywordsTableProps {
  data: KeywordItem[]
  onToggleKeyword: (keyword: string) => void
  onToggleAll: (keywords: string[]) => void
  maxRows?: number
}

export function KeywordsTable({ data, onToggleKeyword, onToggleAll, maxRows = 100 }: KeywordsTableProps) {
  const displayData = data.slice(0, maxRows)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                onCheckedChange={() => onToggleAll(displayData.map((item) => item.keyword))}
                aria-label="Sélectionner tout"
              />
            </TableHead>
            <TableHead className="min-w-[200px]">Mot-clé</TableHead>
            <TableHead className="text-right">Volume</TableHead>
            <TableHead className="text-right">CPC</TableHead>
            <TableHead>Concurrence</TableHead>
            <TableHead className="text-right">Difficulté</TableHead>
            <TableHead>SERP Features</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Aucun résultat trouvé
              </TableCell>
            </TableRow>
          ) : (
            displayData.map((item, index) => (
              <TableRow key={`${item.keyword}-${index}`}>
                <TableCell>
                  <Checkbox
                    onCheckedChange={() => onToggleKeyword(item.keyword)}
                    aria-label={`Sélectionner ${item.keyword}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.keyword}</TableCell>
                <TableCell className="text-right">
                  {(item.keyword_info?.search_volume || 0).toLocaleString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">${(item.keyword_info?.cpc || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    color={
                      item.keyword_info?.competition_level === 'HIGH'
                        ? 'red'
                        : item.keyword_info?.competition_level === 'MEDIUM'
                          ? 'yellow'
                          : 'zinc'
                    }
                  >
                    {item.keyword_info?.competition_level || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge color="zinc">{item.keyword_properties?.keyword_difficulty || 'N/A'}</Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-mist-600">
                      <p>Difficulté SEO: Plus le score est élevé, plus le mot-clé est difficile à ranker</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.serp_info?.serp_item_types?.slice(0, 3).map((type, i) => (
                      <Badge key={i} color="yellow" className="text-xs">
                        {type.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                    {(item.serp_info?.serp_item_types?.length || 0) > 3 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge color="zinc" className="text-xs">
                            +{(item.serp_info?.serp_item_types?.length || 0) - 3}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-mist-600">
                          <div className="max-w-xs">{item.serp_info?.serp_item_types?.slice(3).join(', ')}</div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {data.length > maxRows && (
        <div className="text-muted-foreground border-t p-4 text-center text-sm">
          Affichage de {maxRows} sur {data.length} résultats
        </div>
      )}
    </div>
  )
}

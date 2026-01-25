'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Download,
  Loader2,
  AlertTriangle,
  FileSpreadsheet,
  X,
  Settings2,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Export CSV utility
function exportToCSV<TData>(
  data: TData[],
  columns: ColumnDef<TData>[],
  filename: string
) {
  const headers = columns
    .filter((col) => 'accessorKey' in col || 'header' in col)
    .map((col) => {
      if (typeof col.header === 'string') return col.header
      if ('accessorKey' in col) return String(col.accessorKey)
      return ''
    })
    .filter(Boolean)
    .join(',')

  const rows = data.map((row) => {
    return columns
      .filter((col) => 'accessorKey' in col)
      .map((col) => {
        const key = 'accessorKey' in col ? col.accessorKey : ''
        const value = (row as Record<string, unknown>)[key as string]
        const stringValue = String(value ?? '')
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  })

  const csv = [headers, ...rows].join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Props interface
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  error?: string | null
  searchKey?: string
  searchPlaceholder?: string
  exportFilename?: string
  showColumnToggle?: boolean
  showExport?: boolean
  showSearch?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  emptyMessage?: string
  emptyDescription?: string
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  error = null,
  searchKey,
  searchPlaceholder = 'Rechercher...',
  exportFilename = 'export',
  showColumnToggle = true,
  showExport = true,
  showSearch = true,
  pageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  emptyMessage = 'Aucune donnée',
  emptyDescription = 'Les données apparaîtront ici une fois disponibles.',
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 p-16">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute h-14 w-14 animate-spin rounded-full border-2 border-transparent border-t-primary" />
            <div className="absolute h-10 w-10 animate-spin rounded-full border-2 border-transparent border-t-primary/50 [animation-direction:reverse] [animation-duration:1.5s]" />
          </div>
        </div>
        <p className="text-sm font-medium text-foreground">Chargement des données...</p>
        <p className="mt-1 text-xs text-muted-foreground">Cette opération peut prendre quelques secondes</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 p-16">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
        </div>
        <p className="text-sm font-medium text-foreground">Erreur lors du chargement</p>
        <p className="mt-1 max-w-md text-center text-xs text-muted-foreground">{error}</p>
      </div>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 p-16">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-muted/20 blur-xl" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-muted/50">
            <FileSpreadsheet className="h-7 w-7 text-muted-foreground" />
          </div>
        </div>
        <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
        <p className="mt-1 max-w-md text-center text-xs text-muted-foreground">{emptyDescription}</p>
      </div>
    )
  }

  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const totalRows = table.getFilteredRowModel().rows.length

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          {showSearch && (
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchKey ? (table.getColumn(searchKey)?.getFilterValue() as string) ?? '' : globalFilter}
                onChange={(e) => {
                  if (searchKey) {
                    table.getColumn(searchKey)?.setFilterValue(e.target.value)
                  } else {
                    setGlobalFilter(e.target.value)
                  }
                }}
                className="border-white/10 bg-white/5 pl-9 focus:border-primary/50"
              />
              {(searchKey ? table.getColumn(searchKey)?.getFilterValue() : globalFilter) && (
                <button
                  onClick={() => {
                    if (searchKey) {
                      table.getColumn(searchKey)?.setFilterValue('')
                    } else {
                      setGlobalFilter('')
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="hidden text-sm text-muted-foreground lg:block">
            <span className="font-medium text-foreground">{totalRows.toLocaleString('fr-FR')}</span> résultat
            {totalRows > 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Page size */}
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">Afficher</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[70px] border-white/10 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Column toggle */}
          {showColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10">
                  <Settings2 className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Colonnes</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export */}
          {showExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(data, columns, exportFilename)}
              className="border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Exporter</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/5 bg-linear-to-b from-mist-800/40 to-mist-900/40">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-white/5 bg-mist-900/80 hover:bg-mist-900/80">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          'flex items-center gap-2',
                          header.column.getCanSort() && 'cursor-pointer select-none transition-colors hover:text-foreground'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="flex h-4 w-4 items-center justify-center">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ArrowUp className="h-3.5 w-3.5 text-primary" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ArrowDown className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'border-white/5 transition-colors hover:bg-white/5',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Aucun résultat trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 bg-mist-900/50 px-4 py-3 sm:flex-row">
            <div className="text-sm text-muted-foreground">
              Page <span className="font-medium text-foreground">{currentPage}</span> sur{' '}
              <span className="font-medium text-foreground">{totalPages}</span>
              {' • '}
              <span className="font-medium text-foreground">{totalRows.toLocaleString('fr-FR')}</span> résultats
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages: (number | 'ellipsis')[] = []
                  const maxVisible = 5

                  if (totalPages <= maxVisible) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i)
                  } else {
                    pages.push(1)
                    if (currentPage > 3) pages.push('ellipsis')
                    const start = Math.max(2, currentPage - 1)
                    const end = Math.min(totalPages - 1, currentPage + 1)
                    for (let i = start; i <= end; i++) pages.push(i)
                    if (currentPage < totalPages - 2) pages.push('ellipsis')
                    pages.push(totalPages)
                  }

                  return pages.map((page, idx) =>
                    page === 'ellipsis' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => table.setPageIndex(page - 1)}
                        className={cn(
                          'h-8 w-8',
                          currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {page}
                      </Button>
                    )
                  )
                })()}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => table.setPageIndex(totalPages - 1)}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Column helper for common patterns
export const columnHelper = {
  // Sortable header
  sortableHeader: (label: string) => {
    return ({ column }: { column: { getToggleSortingHandler: () => void } }) => (
      <span className="flex items-center gap-1">{label}</span>
    )
  },

  // Number cell with formatting
  numberCell: (value: number | null | undefined) => {
    if (value == null) return <span className="text-muted-foreground">-</span>
    return <span className="tabular-nums">{value.toLocaleString('fr-FR')}</span>
  },

  // Percentage cell
  percentageCell: (value: number | null | undefined, decimals = 2) => {
    if (value == null) return <span className="text-muted-foreground">-</span>
    return <span className="tabular-nums">{value.toFixed(decimals)}%</span>
  },

  // Currency cell
  currencyCell: (value: number | null | undefined, currency = 'EUR') => {
    if (value == null) return <span className="text-muted-foreground">-</span>
    return (
      <span className="tabular-nums">
        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(value)}
      </span>
    )
  },

  // Position badge
  positionBadge: (value: number | null | undefined) => {
    if (value == null) return <span className="text-muted-foreground">-</span>
    const pos = Number(value)
    let colorClass = 'text-muted-foreground bg-muted/50'
    if (pos <= 3) colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    else if (pos <= 10) colorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    else if (pos <= 20) colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    else colorClass = 'text-red-400 bg-red-500/10 border-red-500/20'

    return (
      <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold', colorClass)}>
        #{pos}
      </span>
    )
  },

  // Trend cell with arrow
  trendCell: (current: number, previous: number | null | undefined) => {
    if (previous == null) {
      return <span className="tabular-nums">{current.toLocaleString('fr-FR')}</span>
    }
    const diff = current - previous
    const pct = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : '0'
    const isPositive = diff > 0
    const isNegative = diff < 0

    return (
      <div className="flex items-center gap-2">
        <span className="tabular-nums">{current.toLocaleString('fr-FR')}</span>
        {diff !== 0 && (
          <span
            className={cn(
              'flex items-center text-xs font-medium',
              isPositive && 'text-emerald-400',
              isNegative && 'text-red-400'
            )}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(Number(pct))}%
          </span>
        )}
      </div>
    )
  },

  // Competition/difficulty badge
  competitionBadge: (level: string | null | undefined) => {
    if (!level) return <span className="text-muted-foreground">-</span>
    const levelLower = level.toLowerCase()
    let colorClass = 'text-muted-foreground bg-muted/50'
    if (levelLower === 'high' || levelLower === 'hard') {
      colorClass = 'text-red-400 bg-red-500/10 border-red-500/20'
    } else if (levelLower === 'medium' || levelLower === 'moderate') {
      colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    } else if (levelLower === 'low' || levelLower === 'easy') {
      colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }

    return (
      <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize', colorClass)}>
        {level}
      </span>
    )
  },

  // URL cell with truncation
  urlCell: (url: string | null | undefined, maxLength = 40) => {
    if (!url) return <span className="text-muted-foreground">-</span>
    const displayUrl = url.length > maxLength ? url.substring(0, maxLength) + '...' : url
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary transition-colors hover:underline"
        onClick={(e) => e.stopPropagation()}
        title={url}
      >
        {displayUrl}
      </a>
    )
  },

  // Date cell
  dateCell: (date: string | Date | null | undefined, format: 'short' | 'long' | 'relative' = 'short') => {
    if (!date) return <span className="text-muted-foreground">-</span>
    const d = new Date(date)

    if (format === 'relative') {
      const now = new Date()
      const diffMs = now.getTime() - d.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays === 0) return <span>Aujourd&apos;hui</span>
      if (diffDays === 1) return <span>Hier</span>
      if (diffDays < 7) return <span>Il y a {diffDays} jours</span>
      if (diffDays < 30) return <span>Il y a {Math.floor(diffDays / 7)} sem.</span>
    }

    if (format === 'long') {
      return <span>{d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
    }

    return <span>{d.toLocaleDateString('fr-FR')}</span>
  },
}

'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { formatLimit, getUsagePercentage, isNearLimit, isUnlimited, USAGE_LABELS } from '@/lib/plan-limits'
import type { UsageType } from '@/lib/plan-limits'

interface UsageData {
  current: number
  limit: number
  remaining: number
}

interface UsageStatsData {
  plan: string
  usage: Record<UsageType, UsageData>
  periodStart: string
  periodEnd: string
}

function ProgressBar({ current, limit, className }: { current: number; limit: number; className?: string }) {
  const percentage = getUsagePercentage(current, limit)
  const unlimited = isUnlimited(limit)
  const nearLimit = isNearLimit(current, limit)
  const atLimit = percentage >= 100

  return (
    <div className={clsx('h-2 w-full rounded-full bg-muted', className)}>
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-300',
          unlimited && 'bg-green-500',
          !unlimited && !nearLimit && !atLimit && 'bg-primary',
          !unlimited && nearLimit && !atLimit && 'bg-yellow-500',
          !unlimited && atLimit && 'bg-destructive'
        )}
        style={{ width: unlimited ? '0%' : `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}

function UsageItem({ label, usage }: { label: string; usage: UsageData }) {
  const percentage = getUsagePercentage(usage.current, usage.limit)
  const unlimited = isUnlimited(usage.limit)
  const nearLimit = isNearLimit(usage.current, usage.limit)
  const atLimit = percentage >= 100

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={clsx(
            'font-medium',
            unlimited && 'text-green-600',
            !unlimited && !nearLimit && !atLimit && 'text-foreground',
            !unlimited && nearLimit && !atLimit && 'text-yellow-600',
            !unlimited && atLimit && 'text-destructive'
          )}
        >
          {unlimited ? (
            'Illimité'
          ) : (
            <>
              {usage.current.toLocaleString('fr-FR')} / {formatLimit(usage.limit)}
            </>
          )}
        </span>
      </div>
      <ProgressBar current={usage.current} limit={usage.limit} />
    </div>
  )
}

export function UsageStats() {
  const [data, setData] = useState<UsageStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/usage')
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error || 'Erreur lors du chargement')
        }
      } catch {
        setError('Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [])

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-2 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (!data) return null

  const periodEnd = new Date(data.periodEnd)
  const daysRemaining = Math.ceil((periodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Usage mensuel</h3>
          <p className="text-sm text-muted-foreground">
            Forfait <span className="font-medium text-primary">{data.plan}</span> — {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
          </p>
        </div>
        <a
          href="/dashboard/abonnement"
          className="text-sm font-medium text-primary hover:underline"
        >
          Changer de forfait
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Limites statiques */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Limites du compte
          </h4>
          <UsageItem label={USAGE_LABELS.projects} usage={data.usage.projects} />
          <UsageItem label={USAGE_LABELS.trackedKeywords} usage={data.usage.trackedKeywords} />
        </div>

        {/* Limites mensuelles */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Usage mensuel
          </h4>
          <UsageItem label={USAGE_LABELS.keywordSearches} usage={data.usage.keywordSearches} />
          <UsageItem label={USAGE_LABELS.backlinkAnalyses} usage={data.usage.backlinkAnalyses} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UsageItem label={USAGE_LABELS.auditPages} usage={data.usage.auditPages} />
        <UsageItem label={USAGE_LABELS.domainAnalyses} usage={data.usage.domainAnalyses} />
        <UsageItem label={USAGE_LABELS.exports} usage={data.usage.exports} />
        <UsageItem label={USAGE_LABELS.serpHistories} usage={data.usage.serpHistories} />
        <UsageItem label={USAGE_LABELS.aiVisibilityRequests} usage={data.usage.aiVisibilityRequests} />
      </div>
    </div>
  )
}

/**
 * Version compacte pour afficher dans la sidebar ou header
 */
export function UsageStatsCompact() {
  const [data, setData] = useState<UsageStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/usage')
        const result = await response.json()
        if (result.success) {
          setData(result.data)
        }
      } catch {
        // Silently fail for compact version
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [])

  if (loading || !data) return null

  // Calculer le pourcentage global d'utilisation
  const usageTypes = ['keywordSearches', 'backlinkAnalyses', 'auditPages', 'domainAnalyses'] as const
  const percentages = usageTypes
    .map((type) => {
      const usage = data.usage[type]
      if (isUnlimited(usage.limit)) return 0
      return getUsagePercentage(usage.current, usage.limit)
    })
    .filter((p) => p > 0)

  const avgPercentage = percentages.length > 0
    ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
    : 0

  const nearLimit = avgPercentage >= 80
  const atLimit = avgPercentage >= 100

  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={clsx(
          'h-2 w-2 rounded-full',
          !nearLimit && !atLimit && 'bg-green-500',
          nearLimit && !atLimit && 'bg-yellow-500',
          atLimit && 'bg-destructive'
        )}
      />
      <span className="text-muted-foreground">
        {data.plan} — {avgPercentage}% utilisé
      </span>
    </div>
  )
}

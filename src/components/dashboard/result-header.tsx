import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface ResultHeaderProps {
  icon?: LucideIcon
  iconClassName?: string
  title: string
  subtitle?: string
  badge?: ReactNode
}

export function ResultHeader({ icon: Icon, iconClassName, title, subtitle, badge }: ResultHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={iconClassName || 'rounded-lg bg-primary/10 p-3'}>
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {badge && <div className="flex items-center gap-2">{badge}</div>}
    </div>
  )
}

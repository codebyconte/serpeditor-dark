import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  iconClassName?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, icon: Icon, iconClassName, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
              iconClassName || 'border-primary/20 bg-primary/10'
            }`}
          >
            <Icon className={`h-6 w-6 ${iconClassName ? '' : 'text-primary'}`} />
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

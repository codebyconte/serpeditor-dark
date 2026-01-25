import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  iconClassName?: string
  actions?: ReactNode
  badge?: string
}

export function PageHeader({ title, description, icon: Icon, iconClassName, actions, badge }: PageHeaderProps) {
  return (
    <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left section with icon and text */}
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 rounded-2xl bg-primary/20 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
            <div
              className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-lg transition-all duration-300 ${
                iconClassName || 'border-primary/20 bg-linear-to-br from-primary/20 via-primary/10 to-primary/5'
              }`}
            >
              <Icon className={`h-7 w-7 ${iconClassName ? '' : 'text-primary'}`} />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">{title}</h1>
            {badge && (
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
          )}
        </div>
      </div>

      {/* Actions section */}
      {actions && (
        <div className="flex shrink-0 items-center gap-2 sm:ml-4">
          {actions}
        </div>
      )}

      {/* Decorative gradient line */}
      <div className="absolute -bottom-4 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </div>
  )
}

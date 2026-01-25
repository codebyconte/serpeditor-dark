import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  children?: ReactNode
  variant?: 'default' | 'minimal'
}

export function EmptyState({ icon: Icon, title, description, children, variant = 'default' }: EmptyStateProps) {
  if (variant === 'minimal') {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
        {Icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-linear-to-b from-mist-800/50 to-mist-900/50 p-12 text-center backdrop-blur-sm md:p-16">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative">
        {Icon && (
          <div className="relative mx-auto mb-6 inline-flex">
            <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 shadow-2xl">
              <Icon className="h-10 w-10 text-primary" />
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">{title}</h3>
        {description && (
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  )
}

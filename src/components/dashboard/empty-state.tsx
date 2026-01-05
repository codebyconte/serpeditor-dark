import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  children?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card/50 p-16 text-center">
      {Icon && (
        <div className="rounded-full bg-primary/10 p-6">
          <Icon className="h-12 w-12 text-primary" />
        </div>
      )}
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-muted-foreground">{description}</p>}
      {children && <div className="mt-8 w-full">{children}</div>}
    </div>
  )
}

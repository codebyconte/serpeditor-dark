import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  title?: string
  description?: string
}

export function LoadingState({ title = 'Chargement en cours...', description }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-16">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 text-lg font-medium">{title}</p>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

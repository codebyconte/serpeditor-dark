import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message: string
}

export function ErrorState({ title = 'Erreur', message }: ErrorStateProps) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-destructive/50 bg-destructive/10 p-4">
      <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
      <div>
        <p className="font-semibold text-destructive">{title}</p>
        <p className="text-sm text-destructive/90">{message}</p>
      </div>
    </div>
  )
}

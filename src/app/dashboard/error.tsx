'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft, Home, RefreshCw, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        {/* Background glow effects */}
        <div className="absolute -inset-4 rounded-3xl bg-red-500/10 blur-3xl" />

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-mist-800/90 to-mist-900/90 shadow-2xl backdrop-blur-xl">
          {/* Decorative gradient line at top */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-500/50 to-transparent" />

          {/* Content */}
          <div className="p-8 text-center">
            {/* Icon with glow */}
            <div className="relative mx-auto mb-6 inline-flex">
              <div className="absolute inset-0 rounded-full bg-red-500/30 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-red-500/20 bg-linear-to-br from-red-500/20 to-red-500/5">
                <AlertTriangle className="h-10 w-10 text-red-400" />
              </div>
            </div>

            {/* Title and description */}
            <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">Une erreur s&apos;est produite</h1>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
              Désolé, quelque chose n&apos;a pas fonctionné comme prévu. Notre équipe a été notifiée.
            </p>

            {/* Suggestions card */}
            <div className="mt-8 rounded-xl border border-white/5 bg-white/5 p-5 text-left">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Que pouvez-vous faire ?</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>Essayez de recharger la page</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>Retournez au tableau de bord principal</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    Contactez notre support :{' '}
                    <a
                      href="mailto:contact@serpeditor.fr"
                      className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      <Mail className="h-3 w-3" />
                      contact@serpeditor.fr
                    </a>
                  </span>
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={reset}
                size="lg"
                className="group relative overflow-hidden bg-primary text-primary-foreground transition-all hover:bg-primary/90"
              >
                <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                Réessayer
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                size="lg"
                className="border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Home className="mr-2 h-4 w-4" />
                Tableau de bord
              </Button>
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="lg"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </div>
          </div>

          {/* Decorative gradient line at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </div>
  )
}

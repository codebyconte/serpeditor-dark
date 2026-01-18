'use client' // Error boundaries must be Client Components

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react'
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
    // Log the error to an error reporting service
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-mist-800 p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-red-500/20 bg-gradient-to-br from-red-500/10 via-background to-background shadow-xl">
          <CardHeader className="space-y-4 pb-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 shadow-lg">
              <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-400">
                Une erreur s&apos;est produite
              </CardTitle>
              <CardDescription className="text-base">
                Désolé, quelque chose n&apos;a pas fonctionné comme prévu. Notre équipe a été notifiée et travaille à
                résoudre le problème.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
          

            {/* Suggestions d'actions */}
            <div className="rounded-lg border border-mist-200 bg-mist-50 p-4 dark:border-mist-800 dark:bg-mist-950">
              <h3 className="mb-3 font-semibold">Que pouvez-vous faire ?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Essayez de recharger la page en cliquant sur &quot;Réessayer&quot;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Retournez au tableau de bord principal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    Si le problème persiste, contactez notre support à{' '}
                    <a
                      href="mailto:contact@serpeditor.fr"
                      className="font-medium text-primary underline hover:no-underline"
                    >
                      contact@serpeditor.fr
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-6 sm:flex-row">
            <Button
              onClick={reset}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Button>
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Page précédente
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

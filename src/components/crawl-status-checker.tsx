// 📁 components/crawl-status-checker.tsx
'use client'

import { checkIfTaskReady } from '@/app/dashboard/audit-de-site/[projectId]/action'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, CheckCircle2, Search, Sparkles, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export function CrawlStatusChecker({ taskId }: { taskId: string }) {
  const [status, setStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [message, setMessage] = useState("Vérification de l'état de l'analyse...")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let isMounted = true

    // Animation de progression simulée
    const updateProgress = () => {
      if (isMounted && status === 'checking') {
        setProgress((prev) => {
          // Augmenter progressivement jusqu'à 90%
          if (prev < 90) {
            return Math.min(prev + Math.random() * 5, 90)
          }
          return prev
        })
      }
    }

    // Mettre à jour la progression toutes les 2 secondes
    const progressInterval = setInterval(updateProgress, 2000)

    const checkStatus = async () => {
      try {
        const result = await checkIfTaskReady(taskId)

        if (!result.success) {
          if (isMounted) {
            setStatus('error')
            setMessage(result.error || 'Erreur lors de la vérification du statut')
            setProgress(0)
            clearInterval(interval)
            clearInterval(progressInterval)
          }
          return
        }

        if (result.isReady) {
          if (isMounted) {
            setProgress(100)
            setStatus('ready')
            setMessage('Analyse terminée avec succès !')
            clearInterval(interval)
            clearInterval(progressInterval)
            // Attendre un peu pour permettre à l'utilisateur de voir le message
            setTimeout(() => window.location.reload(), 2000)
          }
        } else {
          if (isMounted) {
            setMessage(`Analyse en cours...`)
          }
        }
      } catch (error) {
        console.error('Erreur inattendue dans checkStatus:', error)
        if (isMounted) {
          setStatus('error')
          setMessage('Erreur lors de la vérification du statut')
          setProgress(0)
          clearInterval(interval)
          clearInterval(progressInterval)
        }
      }
    }

    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkStatus, 30000)
    // Premier appel immédiat
    checkStatus()

    // Nettoyage
    return () => {
      isMounted = false
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [taskId, status])

  if (status === 'checking') {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-primary/20 from-primary/5 via-background to-primary/5 border-2 bg-gradient-to-br shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
                <Search className="text-primary h-8 w-8 animate-pulse" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold">Analyse en cours</CardTitle>
                <CardDescription className="mt-2 text-base">{message}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Progression de l&apos;analyse</span>
                <span className="text-primary font-semibold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="bg-primary/10 h-3" />
            </div>

            <div className="bg-muted/50 rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Spinner className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Nous analysons votre site web</p>
                  <p className="text-muted-foreground text-xs">
                    Cette opération peut prendre quelques minutes. Les résultats s&apos;afficheront automatiquement une
                    fois l&apos;analyse terminée.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="bg-background flex items-center gap-2 rounded-lg border p-3">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium">Analyse des pages</span>
              </div>
              <div className="bg-background flex items-center gap-2 rounded-lg border p-3">
                <Search className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium">Vérification SEO</span>
              </div>
              <div className="bg-background flex items-center gap-2 rounded-lg border p-3">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-medium">Génération rapport</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'ready') {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="via-background border-2 border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 shadow-lg">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Analyse terminée !
                </CardTitle>
                <CardDescription className="mt-2 text-base">{message}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium">Votre rapport SEO est prêt. Redirection en cours...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="via-background border-2 border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5 shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 shadow-lg">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Erreur lors de l&apos;analyse
                </CardTitle>
                <CardDescription className="mt-2 text-base">{message}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">Nous n&apos;avons pas pu terminer l&apos;analyse</p>
                  <p className="text-muted-foreground text-xs">
                    Veuillez vérifier votre connexion internet ou réessayer dans quelques instants. Si le problème
                    persiste, contactez le support.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

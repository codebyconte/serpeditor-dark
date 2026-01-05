// 📁 app/dashboard/new-project/page.tsx
'use client'

import { Button } from '@/components/dashboard/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import {
  ArrowLeft,
  CheckCircle2,
  Globe,
  Lock,
  Shield,
  Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const requestGoogleAccess = async () => {
    setIsLoading(true)
    try {
      await authClient.linkSocial({
        provider: 'google',
        callbackURL: '/dashboard/new-project',
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
      })
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error)
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: 'Connexion sécurisée',
      description: 'OAuth 2.0 - Aucun mot de passe partagé',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Lock,
      title: 'Accès en lecture seule',
      description: 'Consultation uniquement de vos données Search Console',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Sparkles,
      title: 'Contrôle total',
      description: "Révoquez l'accès à tout moment depuis votre compte Google",
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <Button
            plain
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-lg">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Créer un nouveau projet
              </h1>
              <p className="mt-2 text-muted-foreground">
                Connectez votre compte Google Search Console pour commencer
              </p>
            </div>
          </div>
        </div>

        {/* Card principale */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="border-b pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <FcGoogle className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">
                  Connecter Google Search Console
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  Accédez à vos données SEO en toute sécurité
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Description */}
            <div className="rounded-xl border bg-gradient-to-r from-blue-50/50 via-primary/5 to-purple-50/50 p-5 dark:from-blue-950/20 dark:via-primary/10 dark:to-purple-950/20">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Pour ajouter un projet, vous devez d&apos;abord autoriser
                    l&apos;accès à votre compte Google.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cela nous permet de récupérer vos sites et leurs données en
                    toute sécurité via l&apos;API officielle de Google.
                  </p>
                </div>
              </div>
            </div>

            {/* Avantages */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Avantages
              </h3>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={index}
                      className="group rounded-lg border bg-card p-4 transition-all hover:shadow-md"
                    >
                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${feature.bgColor} transition-transform group-hover:scale-110`}
                      >
                        <Icon className={`h-5 w-5 ${feature.color}`} />
                      </div>
                      <h4 className="mb-1 text-sm font-semibold">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Prêt à commencer ?
                </span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                plain
                onClick={() => router.back()}
                className="flex-1"
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                color="indigo"
                onClick={requestGoogleAccess}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FcGoogle className="h-5 w-5" />
                    Connecter avec Google
                  </span>
                )}
              </Button>
            </div>

            {/* Note de sécurité */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs text-muted-foreground">
                <Lock className="mr-1.5 inline h-3.5 w-3.5" />
                Vos données restent privées et sécurisées. Nous n&apos;avons
                accès qu&apos;aux informations nécessaires pour générer vos
                rapports SEO.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

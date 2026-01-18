import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'
import { AlertTriangle, Globe, Link2, Shield, Target, TrendingUp } from 'lucide-react'
import { BacklinksContent } from './backlinks-content'

export const metadata: Metadata = {
  title: 'Profil de Backlinks - Vue d\'ensemble',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function BacklinksPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Hero Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl">
              <Link2 className="text-primary h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">Profil de Backlinks : Votre Carte d&apos;Identité SEO</h1>
              <p className="dashboard-body-lg mt-2">
                Obtenez une <strong>radiographie complète</strong> de votre profil de backlinks : nombre total de liens,
                domaines référents, qualité, santé, géographie, et <strong>problèmes à corriger</strong>. C&apos;est
                l&apos;outil indispensable pour évaluer la <strong>force SEO</strong> de n&apos;importe quel domaine et
                identifier les actions prioritaires pour progresser.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BacklinksContent />

      {/* Fonctionnalités clés */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
              <Link2 className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="dashboard-heading-2">Analysez la force de votre profil de backlinks</CardTitle>
              <p className="text-muted-foreground dashboard-body-sm mt-1">
                Obtenez une vue d&apos;ensemble complète de votre autorité SEO et identifiez les problèmes à corriger en
                priorité.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Section 1 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <TrendingUp className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">Évaluez votre autorité SEO en un coup d&apos;œil</AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Consultez le nombre total de backlinks et de domaines référents pointant vers votre site.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Comparez votre Domain Rank (0-100) avec vos concurrents pour évaluer votre position sur le marché.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Visualisez le ratio dofollow/nofollow pour vérifier la qualité de votre profil de liens.</span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 2 */}
          <Alert className="border-l-destructive bg-destructive/5 border-l-4">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">Détectez et corrigez les problèmes critiques</AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    Identifiez les backlinks cassés qui pointent vers des pages 404/500 et récupérez jusqu&apos;à 20% de
                    jus SEO perdu.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    Découvrez les pages de votre site en erreur qui reçoivent des backlinks et créez des redirections
                    301.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    Surveillez votre Spam Score pour détecter les attaques de Negative SEO et protéger votre
                    référencement.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 3 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Globe className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Analysez la diversité et la géographie de vos backlinks
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Vérifiez la diversité des IPs et sous-réseaux pour garantir un profil de backlinks naturel.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Découvrez les pays d&apos;origine de vos backlinks et assurez-vous qu&apos;ils correspondent à votre
                    marché cible.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Identifiez les types de plateformes (blogs, médias, sites institutionnels) qui font des liens vers
                    vous.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 4 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Target className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Benchmark vos concurrents et identifiez les opportunités
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Comparez votre profil avec celui de vos concurrents pour comprendre pourquoi ils vous surpassent.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Fixez-vous des objectifs d&apos;acquisition de backlinks basés sur l&apos;écart avec la concurrence.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Suivez l&apos;évolution mensuelle de votre Domain Rank et nombre de domaines référents.</span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 5 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Shield className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Obtenez un score de santé et un plan d&apos;action clair
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Consultez votre score de santé global (0-100) pour évaluer la qualité de votre profil en un coup
                    d&apos;œil.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Recevez des recommandations prioritaires et actionnables pour améliorer votre autorité SEO.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Exportez les données pour créer des rapports clients professionnels et suivre vos progrès.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </main>
  )
}

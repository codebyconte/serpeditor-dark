// 📁 app/dashboard/backlinks/domaines-referents/page.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'
import { Award, Globe, Target, TrendingUp } from 'lucide-react'
import { ReferringDomainsContent } from './referring-domains-content'

export const metadata: Metadata = {
  title: 'Domaines Référents',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ReferringDomainsPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl">
              <Globe className="text-primary h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">Découvrez tous les domaines qui font des liens vers votre site</h1>
              <p className="dashboard-body-lg mt-2">
                Obtenez la liste complète des domaines référents avec leurs métriques d&apos;autorité, nombre de
                backlinks et date de première détection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <ReferringDomainsContent />

      {/* Fonctionnalités clés */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="dashboard-heading-2">Fonctionnalités principales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Section 1 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Globe className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Identifiez tous les sites qui font des liens vers vous
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Consultez la liste exhaustive de tous les domaines uniques qui pointent vers votre site ou une URL
                    spécifique.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Visualisez le nombre de backlinks provenant de chaque domaine pour identifier vos plus gros
                    supporters.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Découvrez les domaines principaux (avec au moins un lien dofollow) vs les domaines secondaires
                    (uniquement nofollow).
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 2 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Award className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Évaluez la qualité et l&apos;autorité de chaque domaine référent
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Analysez le Domain Rank (0-100) de chaque domaine référent pour prioriser les plus puissants.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Filtrez par Domain Rank minimum (ex: DR &gt; 40) pour vous concentrer sur les backlinks de qualité.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Identifiez les domaines avec forte autorité mais peu de backlinks vers vous (opportunité d&apos;en
                    obtenir plus).
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 3 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Target className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">Trouvez des opportunités de netlinking ciblées</AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Comparez votre liste de domaines référents avec celle de vos concurrents pour identifier les
                    opportunités manquées.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Repérez les domaines qui font plusieurs liens vers vous et contactez-les pour obtenir des liens
                    supplémentaires.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Analysez les extensions de domaine (.fr, .com, .org) pour diversifier votre profil de backlinks.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 4 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <TrendingUp className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">Surveillez les nouveaux domaines et les pertes</AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Détectez les nouveaux domaines qui ont commencé à faire des liens vers vous .</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Identifiez les domaines perdus (dernière détection &gt; 90 jours) et contactez-les pour récupérer
                    les liens.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Suivez l&apos;évolution du nombre de domaines référents mois après mois pour mesurer
                    l&apos;efficacité de vos campagnes.
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

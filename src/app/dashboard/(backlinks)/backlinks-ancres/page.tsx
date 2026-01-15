// 📁 app/dashboard/backlinks/ancres/page.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Anchor, Eye, Shield, Target, TrendingUp } from 'lucide-react'
import { AnchorsContent } from './anchors-content'

export const metadata = {
  title: 'Analyse des Ancres | Dashboard SEO',
  description: "Analysez les textes d'ancre utilisés dans vos backlinks pour optimiser votre profil de liens",
}

export default function AnchorsPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl">
              <Anchor className="text-primary h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">Analysez tous les textes d&apos;ancrage de vos backlinks</h1>
              <p className="dashboard-body-lg mt-2">
                Découvrez les mots-clés utilisés dans les liens pointant vers votre site et optimisez votre profil
                d&apos;anchor texts pour éviter les pénalités Google.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <AnchorsContent />
      {/* Fonctionnalités clés */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="dashboard-heading-2">Fonctionnalités principales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Section 1 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Eye className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Découvrez tous les anchor texts pointant vers votre site
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Consultez la liste complète de tous les textes d&apos;ancrage utilisés dans vos backlinks avec leur
                    fréquence.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Identifiez les anchor texts les plus populaires et découvrez comment les gens parlent naturellement
                    de votre marque.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Visualisez le nombre de backlinks et de domaines référents pour chaque anchor text spécifique.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 2 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Target className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Identifiez les opportunités de mots-clés stratégiques
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Découvrez les mots-clés pour lesquels vous recevez naturellement des backlinks et renforcez votre
                    positionnement.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Repérez les anchor texts commerciaux (avec intention d&apos;achat) vs informationnels pour adapter
                    votre stratégie.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Analysez les anchor texts de vos concurrents pour découvrir les mots-clés qu&apos;ils ciblent dans
                    leur stratégie de netlinking.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 3 */}
          <Alert className="border-l-destructive bg-destructive/5 border-l-4">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Détectez la sur-optimisation et évitez les pénalités Google
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    Vérifiez si un anchor text exact match apparaît dans plus de 30% de vos backlinks (risque de
                    pénalité Penguin).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    Identifiez les anchor texts suspects ou sur-optimisés (trop commerciaux, bourrés de mots-clés) à
                    désavouer.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    Assurez-vous d&apos;avoir un ratio naturel : 60-70% branded/générique, 20-25% partial match, 5-10%
                    exact match.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 4 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Shield className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Construisez un profil d&apos;anchor texts naturel et diversifié
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Analysez la distribution de vos anchor texts : branded (nom de marque), générique (&quot;cliquez
                    ici&quot;), partial match, exact match.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Identifiez les manques dans votre profil (trop d&apos;exact match ? pas assez de branded ?) et
                    corrigez progressivement.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Guidez vos campagnes d&apos;outreach en variant les anchor texts demandés pour maintenir un profil
                    naturel.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 5 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <TrendingUp className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Suivez l&apos;évolution et optimisez votre stratégie d&apos;ancrage
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Surveillez l&apos;apparition de nouveaux anchor texts pour détecter les campagnes spontanées ou les
                    attaques Negative SEO.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Comparez votre distribution d&apos;anchor texts avec celle de vos concurrents les mieux classés pour
                    identifier les patterns gagnants.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Exportez les données pour créer des rapports d&apos;audit SEO et justifier vos recommandations de
                    netlinking auprès de vos clients.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Bonus tip */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Shield className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">Règle d&apos;or</AlertTitle>
            <AlertDescription className="dashboard-body-sm">
              Un profil d&apos;anchor texts naturel devrait ressembler à ceci : 60-70% branded/générique (&quot;Nom de
              marque&quot;, &quot;site&quot;, &quot;cliquez ici&quot;), 20-25% partial match (&quot;meilleur consultant
              SEO&quot;), 5-10% exact match (&quot;consultant SEO Paris&quot;). Si votre exact match dépasse 30%, vous
              êtes en zone rouge !
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </main>
  )
}

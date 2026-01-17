// 📁 app/dashboard/backlinks/nouveaux-perdus/page.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, BarChart3, Calendar, Target, TrendingUp, Zap } from 'lucide-react'
import { NewLostBacklinksContent } from './new-lost-backlinks-content'

export const metadata = {
  title: 'Backlinks Nouveaux & Perdus | Dashboard SEO',
  description: "Suivez l'évolution temporelle de vos backlinks : nouveaux liens acquis et liens perdus",
}

export default function NewLostBacklinksPage() {
  return (
    <main className="text-foreground min-h-screen max-w-7xl mx-auto py-8">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"></div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">Suivez l&apos;évolution de vos backlinks dans le temps</h1>
              <p className="dashboard-body-lg mt-2">
                Visualisez l&apos;historique complet de vos backlinks gagnés et perdus, jour par jour, pour mesurer
                l&apos;efficacité de vos campagnes de netlinking.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <NewLostBacklinksContent />

      {/* Fonctionnalités clés */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <CardTitle className="dashboard-heading-2">Fonctionnalités principales</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Section 1 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Calendar className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Visualisez l&apos;historique complet de votre profil de backlinks
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Consultez l&apos;évolution jour par jour du nombre total de backlinks et de domaines référents sur les
                    12 derniers mois.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Identifiez les périodes de croissance et de déclin pour comprendre l&apos;impact de vos actions SEO
                    passées.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Comparez l&apos;évolution de votre profil avec celle de vos concurrents pour évaluer votre vitesse de
                    progression.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 2 */}
          <Alert>
            <Zap className="h-5 w-5 text-green-600" />
            <AlertTitle className="dashboard-heading-4">Détectez les nouveaux backlinks acquis chaque jour</AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-600">•</span>
                  <span>
                    Découvrez combien de nouveaux backlinks et domaines référents vous gagnez quotidiennement,
                    hebdomadairement ou mensuellement.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-600">•</span>
                  <span>
                    Identifiez les pics d&apos;acquisition pour comprendre quelles campagnes (guest posting, PR, contenu
                    viral) ont le mieux fonctionné.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-600">•</span>
                  <span>
                    Suivez votre taux d&apos;acquisition moyen et fixez-vous des objectifs mensuels basés sur vos
                    performances passées.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 3 */}
          <Alert>
            <AlertCircle className="text-destructive h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Surveillez les backlinks perdus et réagissez rapidement
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    Détectez immédiatement les baisses anormales de backlinks qui peuvent signaler un problème
                    technique ou une attaque Negative SEO.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    Identifiez les jours où vous avez perdu le plus de backlinks et analysez les causes (site down,
                    pages supprimées, migration).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    Comparez vos pertes avec vos acquisitions pour calculer votre taux de croissance net (nouveaux -
                    perdus).
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 4 */}
          <Alert>
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <AlertTitle className="dashboard-heading-4">Analysez les tendances et patterns de votre profil</AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-purple-600">•</span>
                  <span>
                    Repérez les tendances saisonnières dans l&apos;acquisition de backlinks (ex: baisse en été, hausse en
                    fin d&apos;année).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-purple-600">•</span>
                  <span>
                    Identifiez les périodes de stagnation où vous n&apos;acquérez pas de nouveaux domaines référents et
                    ajustez votre stratégie.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-purple-600">•</span>
                  <span>
                    Visualisez la corrélation entre vos actions marketing (lancement produit, campagne PR) et les pics
                    d&apos;acquisition de backlinks.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 5 */}
          <Alert>
            <Target className="h-5 w-5 text-orange-600" />
            <AlertTitle className="dashboard-heading-4">
              Mesurez l&apos;efficacité de vos campagnes de netlinking
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-orange-600">•</span>
                  <span>
                    Calculez votre ROI netlinking en comparant les investissements (guest posts, outreach) avec
                    l&apos;acquisition réelle de backlinks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-orange-600">•</span>
                  <span>
                    Créez des rapports clients visuels montrant la croissance du profil de backlinks mois après mois
                    avec graphiques d&apos;évolution.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-orange-600">•</span>
                  <span>
                    Exportez les données historiques pour analyser les corrélations avec votre trafic organique et vos
                    positions dans les SERP.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Bonus tip */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <TrendingUp className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">Indicateurs clés à surveiller</AlertTitle>
            <AlertDescription className="dashboard-body-sm">
              <p className="mt-2">
                Un profil sain devrait avoir un ratio nouveaux/perdus d&apos;au moins <strong>2:1</strong> (2 backlinks
                gagnés pour 1 perdu). Si vous perdez plus que vous n&apos;acquérez pendant 2 mois consécutifs, c&apos;est un
                signal d&apos;alarme qui nécessite une action immédiate. Objectif :{' '}
                <strong>+10-20 nouveaux domaines référents/mois</strong> minimum pour une croissance constante.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </main>
  )
}

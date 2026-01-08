import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Filter, Target, TrendingUp } from 'lucide-react'
import FormBacklinksAnalyzer from './FormBacklinksAnalyzer'

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Introduction */}

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"></div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">Liste Détaillée des Backlinks</h1>
              <p className="dashboard-body-lg mt-2">
                Obtenez la <strong>liste complète de tous les backlinks</strong> pointant vers un domaine ou une URL
                spécifique, avec détails sur chaque lien : source, anchor text, type, autorité, date de détection...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <FormBacklinksAnalyzer />

      {/* Comment utiliser */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="dashboard-heading-2">Fonctionnalités principales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Section 1 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Eye className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">Visualisez tous les détails de chaque backlink</AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Consultez l&apos;URL source, l&apos;URL cible, l&apos;anchor text et le type de lien
                    (dofollow/nofollow) pour chaque backlink.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Identifiez le Domain Rank de chaque source pour prioriser les backlinks les plus puissants.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Vérifiez l&apos;emplacement du lien (contenu, sidebar, footer) pour évaluer sa valeur SEO réelle.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 2 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Filter className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">
              Filtrez et triez pour trouver exactement ce que vous cherchez
            </AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Filtrez par type de lien, Domain Rank minimum, anchor text ou date de détection pour affiner vos
                    résultats.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Triez par Domain Rank, date ou anchor text pour identifier rapidement les meilleurs backlinks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Créez des segments personnalisés (nouveaux backlinks, backlinks perdus, backlinks toxiques) pour
                    différentes analyses.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 3 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <Target className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">Trouvez des opportunités cachées dans votre profil</AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Identifiez vos pages les plus linkées pour reproduire leur succès et créer du contenu similaire.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Analysez les anchor texts pour détecter les opportunités de mots-clés ou les risques de
                    sur-optimisation.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Découvrez les nouveaux backlinks acquis dans les 30 derniers jours et remerciez les webmasters.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Section 4 */}
          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <TrendingUp className="text-primary h-5 w-5" />
            <AlertTitle className="dashboard-heading-4">Surveillez et récupérez les backlinks perdus</AlertTitle>
            <AlertDescription>
              <ul className="dashboard-body-sm mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Détectez les backlinks inactifs depuis plus de 90 jours et vérifiez s&apos;ils sont définitivement
                    perdus.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Contactez les webmasters pour récupérer les backlinks perdus avant qu&apos;il ne soit trop tard.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Suivez l&apos;évolution de votre profil de backlinks mois après mois et mesurez l&apos;impact de vos
                    actions.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

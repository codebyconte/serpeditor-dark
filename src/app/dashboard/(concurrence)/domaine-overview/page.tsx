import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Globe, Info } from 'lucide-react'
import type { Metadata } from 'next'
import { DomainOverviewContent } from './domain-overview-content'

export const metadata: Metadata = {
  title: 'Vue d\'ensemble du Domaine',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DomainOverviewPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {' '}
      <DomainOverviewContent />{' '}
      <div className="container mx-auto space-y-6 px-4 py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center border-2 border-dashed p-16 text-center">
            <div className="bg-primary/10 rounded-full p-6">
              <Globe className="text-primary h-12 w-12" />
            </div>
            <h3 className="dashboard-heading-3 mt-6">Analysez la performance SEO d&apos;un domaine</h3>
            <p className="mt-2 max-w-md">
              Obtenez une vue d&apos;ensemble complète : mots-clés positionnés, distribution des positions, valeur du
              trafic, tendances et stratégie SEO/SEA
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-left">
              <Card>
                <CardContent className="p-4">
                  <h4 className="dashboard-heading-4">Positions détaillées</h4>
                  <p className="text-muted-foreground mt-1">Top 3, Top 10, Top 20... Distribution complète</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="dashboard-heading-4">Valeur du trafic</h4>
                  <p className="text-muted-foreground mt-1">Estimation du coût équivalent en Google Ads</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="dashboard-heading-4">Tendances</h4>
                  <p className="text-muted-foreground mt-1">Nouveaux mots-clés, positions gagnées/perdues</p>
                </CardContent>
              </Card>
            </div>

            {/* Exemples */}
            <Alert className="border-primary/20 bg-primary/5 mt-8">
              <Info className="text-primary h-5 w-5" />
              <AlertTitle className="text-foreground">Exemples de domaines :</AlertTitle>
              <AlertDescription>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['amazon.fr', 'leboncoin.fr', 'cdiscount.com', 'fnac.com', 'decathlon.fr'].map((example) => (
                    <button
                      key={example}
                      type="button"
                      className="bg-background hover:bg-accent text-foreground border-border rounded-lg border px-3 py-1 text-sm font-medium transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        {/* Section explicative */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <h2 className="dashboard-heading-2 mb-6">Comment utiliser cette analyse ?</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="dashboard-heading-4 mb-3 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    1
                  </span>
                  Analysez vos concurrents
                </h3>
                <p className="text-muted-foreground">
                  Identifiez les forces et faiblesses de vos concurrents directs. Comparez leur nombre de mots-clés,
                  leurs positions dominantes et leur stratégie SEO vs SEA pour découvrir des opportunités.
                </p>
              </div>

              <div>
                <h3 className="dashboard-heading-4 mb-3 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    2
                  </span>
                  Évaluez un client potentiel
                </h3>
                <p className="text-muted-foreground">
                  Avant de proposer vos services SEO, analysez la situation actuelle du client : nombre de mots-clés,
                  positions faibles à améliorer, opportunités inexploitées et potentiel de croissance.
                </p>
              </div>

              <div>
                <h3 className="dashboard-heading-4 mb-3 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    3
                  </span>
                  Suivez votre évolution
                </h3>
                <p className="text-muted-foreground">
                  Analysez régulièrement votre propre domaine pour suivre vos tendances : nouveaux mots-clés gagnés,
                  positions améliorées, et la valeur croissante de votre trafic organique.
                </p>
              </div>

              <div>
                <h3 className="dashboard-heading-4 mb-3 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    4
                  </span>
                  Benchmark votre niche
                </h3>
                <p className="text-muted-foreground">
                  Comparez plusieurs acteurs de votre secteur pour identifier le leader SEO, les stratégies payantes
                  dominantes, et positionner votre site dans le paysage concurrentiel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Métriques expliquées */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <h2 className="dashboard-heading-2 mb-6">Comprendre les métriques</h2>

            <div className="space-y-4">
              <Alert className="border-l-primary bg-primary/5 border-l-4">
                <AlertTitle className="text-foreground">Mots-clés organiques</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Nombre total de mots-clés sur lesquels le domaine apparaît dans les résultats Google (positions
                  1-100). Plus le nombre est élevé, plus le domaine est visible.
                </AlertDescription>
              </Alert>

              <Alert className="border-l-primary bg-primary/5 border-l-4">
                <AlertTitle className="text-foreground">Trafic estimé (ETV)</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Estimated Traffic Value : nombre de visites mensuelles estimées en fonction du volume de recherche et
                  des positions. Plus le domaine est bien positionné sur des mots-clés recherchés, plus l&apos;ETV est
                  élevé.
                </AlertDescription>
              </Alert>

              <Alert className="border-l-primary bg-primary/5 border-l-4">
                <AlertTitle className="text-foreground">Valeur du trafic organique</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Coût estimé en Google Ads pour obtenir le même trafic. Si un site a 10,000$ de valeur organique, cela
                  signifie qu&apos;il devrait dépenser 10,000$/mois en publicité pour remplacer ce trafic gratuit.
                </AlertDescription>
              </Alert>

              <Alert className="border-l-primary bg-primary/5 border-l-4">
                <AlertTitle className="text-foreground">Tendances (Nouveaux, En hausse, Perdus)</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  <ul className="list-inside list-disc">
                    <li>
                      <strong>Nouveaux</strong> : Mots-clés fraîchement positionnés (bon signe)
                    </li>
                    <li>
                      <strong>En hausse</strong> : Positions améliorées (stratégie SEO efficace)
                    </li>
                    <li>
                      <strong>En baisse</strong> : Positions dégradées (vigilance nécessaire)
                    </li>
                    <li>
                      <strong>Perdus</strong> : Ne sont plus dans le Top 100 (problème à corriger)
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

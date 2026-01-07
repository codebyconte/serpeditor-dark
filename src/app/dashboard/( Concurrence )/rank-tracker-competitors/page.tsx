import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Activity,
  Award,
  BarChart3,
  CheckCircle2,
  Crown,
  Eye,
  Layers,
  Lightbulb,
  PieChart,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import SERPComparatorPage from './SERPComparatorPage'

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 py-8">
      {/* Hero Section */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg">
              <Users className="text-primary-foreground h-8 w-8" />
            </div>
            <div className="flex-1">
              <CardTitle className="dashboard-heading-1">
                Analyse des Concurrents SERP : Qui Domine Votre Marché ?
              </CardTitle>
              <CardDescription className="dashboard-body-lg text-muted-foreground mt-2">
                Découvrez <strong>tous les domaines</strong> qui apparaissent dans les résultats Google pour vos
                mots-clés cibles. Identifiez le <strong>leader du marché</strong>, les <strong>challengers</strong>,
                votre <strong>position relative</strong>, et les <strong>opportunités</strong> pour progresser.
                L&apos;outil stratégique par excellence pour comprendre votre paysage concurrentiel !
              </CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>

      <SERPComparatorPage />

      {/* Concept clé */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
              <Eye className="text-primary-foreground h-6 w-6" />
            </div>
            <CardTitle className="dashboard-heading-2">Qu&apos;est-ce que l&apos;analyse SERP Competitors ?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="dashboard-body text-foreground">
            Pour un ou plusieurs mots-clés, cet outil <strong>scanne les résultats Google</strong> (la SERP = Search
            Engine Results Page) et identifie <strong>tous les domaines</strong> présents. Il calcule ensuite leur{' '}
            <strong>visibilité</strong>, leur <strong>part de marché</strong> (en trafic estimé), et leur{' '}
            <strong>rating SEO</strong>.
          </p>

          <Card className="border-primary/20 bg-card">
            <CardContent className="p-6">
              <div className="mb-4 text-center">
                <p className="dashboard-body-sm font-semibold">Exemple : Vous analysez le mot-clé &quot;phone&quot;</p>
              </div>

              <div className="space-y-3">
                {/* Position 1 */}
                <Card className="border-primary/30 bg-primary/10">
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                      #1
                    </div>
                    <div className="flex-1">
                      <p className="dashboard-body font-bold">apps.apple.com</p>
                      <div className="dashboard-text-xs text-muted-foreground flex items-center gap-4">
                        <span>167 200 trafic/mois</span>
                        <span className="text-primary">• 100% visibilité</span>
                        <span className="text-primary">• Rating: 99</span>
                      </div>
                    </div>
                    <Crown className="text-accent h-6 w-6" />
                  </CardContent>
                </Card>

                {/* Position 2 */}
                <Card className="border-primary/30 bg-primary/10">
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                      #2
                    </div>
                    <div className="flex-1">
                      <p className="dashboard-body font-bold">www.bestbuy.com</p>
                      <div className="dashboard-text-xs text-muted-foreground flex items-center gap-4">
                        <span>89 100 trafic/mois</span>
                        <span className="text-primary">• 90% visibilité</span>
                        <span className="text-primary">• Rating: 98</span>
                      </div>
                    </div>
                    <Award className="text-primary h-5 w-5" />
                  </CardContent>
                </Card>

                {/* Position 3 */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                      #3
                    </div>
                    <div className="flex-1">
                      <p className="dashboard-body font-bold">play.google.com</p>
                      <div className="dashboard-text-xs text-muted-foreground flex items-center gap-4">
                        <span>53 515 trafic/mois</span>
                        <span className="text-primary">• 80% visibilité</span>
                        <span className="text-primary">• Rating: 97</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="dashboard-text-xs text-muted-foreground text-center">+ 64 autres concurrents...</div>
              </div>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong>Résultat :</strong> En un coup d&apos;œil, vous voyez qui <strong>domine</strong> ce mot-clé
                    (Apple), qui sont les <strong>challengers</strong> (BestBuy, Google Play), et quelle est la{' '}
                    <strong>part de marché</strong> de chacun.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Les 4 insights clés */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-2 text-center">
            Les 4 Insights Stratégiques que vous obtiendrez
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 1. Leader du marché */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  1
                </div>
                <div>
                  <CardTitle className="dashboard-heading-4">Identifiez le Leader du Marché</CardTitle>
                  <CardDescription className="dashboard-body-sm">Qui capte le plus de trafic ?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="border-primary/20 bg-card">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Crown className="text-primary h-6 w-6" />
                    <span className="dashboard-body font-semibold">apps.apple.com</span>
                    <Badge color="yellow" className="ml-auto text-xs font-bold">
                      LEADER
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="dashboard-heading-2 text-primary">45.9%</div>
                      <div className="dashboard-text-xs text-muted-foreground">Part de marché ETV</div>
                    </div>
                    <div className="text-center">
                      <div className="dashboard-heading-2 text-primary">99</div>
                      <div className="dashboard-text-xs text-muted-foreground">Rating SEO</div>
                    </div>
                    <div className="text-center">
                      <div className="dashboard-heading-2 text-primary">167k</div>
                      <div className="dashboard-text-xs text-muted-foreground">Trafic/mois</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong> Utilité :</strong> Analysez en détail le leader : <strong>pourquoi</strong> il domine
                    (autorité de domaine, backlinks, contenu optimisé), et <strong>comment</strong> vous pouvez
                    apprendre de sa stratégie.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 2. Distribution du marché */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  2
                </div>
                <div>
                  <CardTitle className="dashboard-heading-4">Visualisez la Distribution du Marché</CardTitle>
                  <CardDescription className="dashboard-body-sm">Répartition des positions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="border-primary/20 bg-card">
                <CardContent className="p-4">
                  <div className="dashboard-body-sm mb-3 font-semibold">Distribution des 67 concurrents :</div>

                  <div className="space-y-3">
                    <div>
                      <div className="dashboard-body-sm mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <div className="bg-primary h-3 w-3 rounded-full" />
                          <strong>Top 3</strong> (Positions 1-3)
                        </span>
                        <span className="text-primary font-bold">3 domaines</span>
                      </div>
                      <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
                        <div className="bg-primary h-full" style={{ width: '4.5%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="dashboard-body-sm mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <div className="bg-primary h-3 w-3 rounded-full" />
                          <strong>Top 10</strong> (Positions 4-10)
                        </span>
                        <span className="text-primary font-bold">5 domaines</span>
                      </div>
                      <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
                        <div className="bg-primary h-full" style={{ width: '7.5%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="dashboard-body-sm mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <div className="bg-accent h-3 w-3 rounded-full" />
                          <strong>Opportunités</strong> (Positions 11-20)
                        </span>
                        <span className="text-accent font-bold">0 domaines</span>
                      </div>
                      <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
                        <div className="bg-accent h-full" style={{ width: '0%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="dashboard-body-sm mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <div className="bg-muted-foreground h-3 w-3 rounded-full" />
                          <strong>Autres</strong> (Positions 21+)
                        </span>
                        <span className="font-bold">59 domaines</span>
                      </div>
                      <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
                        <div className="bg-muted-foreground h-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong>Utilité :</strong> Comprenez à quel point le marché est <strong>concentré</strong> (peu de
                    gagnants dans le Top 10) ou <strong>fragmenté</strong> (beaucoup de compétiteurs). Ici, c&apos;est
                    très concentré : 5 domaines seulement dominent.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 3. Opportunités de progression */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  3
                </div>
                <div>
                  <CardTitle className="dashboard-heading-4">Identifiez les Opportunités de Progression</CardTitle>
                  <CardDescription className="dashboard-body-sm">Qui pouvez-vous dépasser ?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="border-primary/20 bg-card">
                <CardContent className="p-4">
                  <p className="dashboard-body-sm mb-3">
                    Repérez les concurrents <strong>juste devant vous</strong> (positions 11-20) avec un rating
                    similaire. Ce sont vos cibles prioritaires pour progresser rapidement.
                  </p>

                  <div className="space-y-2">
                    <Card className="border-primary/30 bg-primary/10">
                      <CardContent className="p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="dashboard-body-sm font-bold">concurrent-x.com</span>
                          <Badge color="green" className="text-xs font-bold">
                            CIBLE FACILE
                          </Badge>
                        </div>
                        <div className="dashboard-text-xs text-muted-foreground flex items-center gap-4">
                          <span>Position #12</span>
                          <span>Rating: 65 (vs vous: 62)</span>
                          <span className="text-primary">Écart: -3 points </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-accent/30 bg-accent/10">
                      <CardContent className="p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="dashboard-body-sm font-bold">concurrent-y.com</span>
                          <Badge color="orange" className="text-xs font-bold">
                            CIBLE MOYENNE
                          </Badge>
                        </div>
                        <div className="dashboard-text-xs text-muted-foreground flex items-center gap-4">
                          <span>Position #8</span>
                          <span>Rating: 72 (vs vous: 62)</span>
                          <span className="text-accent">Écart: -10 points</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong>Stratégie :</strong> Concentrez vos efforts SEO (backlinks, optimisation on-page) pour
                    dépasser les <strong>concurrents proches</strong>. Gagnez 5-10 places avant de viser le Top 3.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Métriques expliquées */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-2 flex items-center gap-3">
            <BarChart3 className="text-primary h-6 w-6" />
            Comprendre les Métriques Clés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <Star className="text-primary h-5 w-5" />
              <AlertDescription>
                <h4 className="dashboard-heading-4 mb-1 font-semibold">Rating SEO (0-100)</h4>
                <p className="dashboard-body-sm">
                  <strong>Score de visibilité relative</strong> calculé en fonction de la position, du volume de
                  recherche et de la présence dans les SERP Features. 100 = position #1 parfaite, 0 = invisible.
                </p>
                <div className="dashboard-text-xs mt-2 space-y-1">
                  <div>
                    • <strong>90-100 :</strong> Leader absolu (positions 1-2)
                  </div>
                  <div>
                    • <strong>70-89 :</strong> Très bien positionné (positions 3-5)
                  </div>
                  <div>
                    • <strong>50-69 :</strong> Visible mais améliorable (positions 6-10)
                  </div>
                  <div>
                    • <strong>&lt;50 :</strong> Faible visibilité (positions 11+)
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <Activity className="text-primary h-5 w-5" />
              <AlertDescription>
                <h4 className="dashboard-heading-4 mb-1 font-semibold">ETV (Estimated Traffic Value)</h4>
                <p className="dashboard-body-sm">
                  <strong>Trafic mensuel estimé</strong> en fonction du volume de recherche et du taux de clic (CTR)
                  attendu pour chaque position. Plus le domaine est bien positionné, plus son ETV est élevé.
                </p>
                <div className="bg-primary/10 dashboard-text-xs mt-2 rounded p-2">
                  <strong>Exemple :</strong> Position #1 = 30% du trafic total, Position #5 = 5% du trafic
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <Eye className="text-primary h-5 w-5" />
              <AlertDescription>
                <h4 className="dashboard-heading-4 mb-1 font-semibold">Visibilité (%)</h4>
                <p className="dashboard-body-sm">
                  <strong>Pourcentage de présence</strong> dans la SERP. 100% = visible sur tous les mots-clés analysés
                  en position optimale. Inclut les SERP Features (Featured Snippet, Images, etc.).
                </p>
                <div className="dashboard-text-xs mt-2 space-y-1">
                  <div>
                    • <strong>100% :</strong> Présent partout, positions excellentes
                  </div>
                  <div>
                    • <strong>50-99% :</strong> Bonne couverture, quelques absences
                  </div>
                  <div>
                    • <strong>&lt;50% :</strong> Présence partielle ou faible
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <Target className="text-primary h-5 w-5" />
              <AlertDescription>
                <h4 className="dashboard-heading-4 mb-1 font-semibold">Position Moyenne vs Médiane</h4>
                <p className="dashboard-body-sm">
                  <strong>Moyenne :</strong> Position moyenne sur tous les mots-clés. <br />
                  <strong>Médiane :</strong> Position centrale (50% au-dessus, 50% en dessous). Si moyenne ≠ médiane, il
                  y a des <strong>outliers</strong> (positions extrêmes).
                </p>
                <div className="bg-primary/10 dashboard-text-xs mt-2 rounded p-2">
                  <strong>Exemple :</strong> Moyenne 3.2, Médiane 3 = positions cohérentes dans le Top 3-4
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <PieChart className="text-primary h-5 w-5" />
              <AlertDescription>
                <h4 className="dashboard-heading-4 mb-1 font-semibold">Part de Marché ETV</h4>
                <p className="dashboard-body-sm">
                  <strong>Pourcentage du trafic total</strong> capté par ce domaine par rapport à tous les concurrents.
                  Le leader a souvent 30-50% du marché.
                </p>
                <div className="bg-primary/10 dashboard-text-xs mt-2 rounded p-2">
                  <strong>Exemple :</strong> Apple = 45.9% (167k/364k trafic total)
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <Layers className="text-primary h-5 w-5" />
              <AlertDescription>
                <h4 className="dashboard-heading-4 mb-1 font-semibold">SERP Items</h4>
                <p className="dashboard-body-sm">
                  <strong>Nombre d&apos;éléments</strong> de ce domaine présents dans la SERP (résultats organiques,
                  Featured Snippet, Images, Vidéos, etc.). Plus c&apos;est élevé, plus la présence est forte.
                </p>
                <div className="bg-primary/10 dashboard-text-xs mt-2 rounded p-2">
                  <strong>Exemple :</strong> 1 SERP item = résultat organique simple, 3+ = présence multiple (Featured +
                  Organic + Images)
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Stratégies d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-2 flex items-center gap-3">
            <Lightbulb className="text-accent h-6 w-6" />3 Stratégies pour Exploiter Cette Analyse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stratégie 1 */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  1
                </div>
                <CardTitle className="dashboard-heading-4">Benchmark Compétitif : Analysez le Leader</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="dashboard-body-sm mb-3">
                Une fois que vous avez identifié le <strong>domaine #1</strong>, allez l&apos;analyser en profondeur :
              </p>
              <ul className="dashboard-body-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong>Backlinks :</strong> Combien de domaines référents ? Quelle qualité ?
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong>Contenu :</strong> Longueur, structure, mots-clés secondaires utilisés ?
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong>SERP Features :</strong> Présent dans Featured Snippet, Images, Vidéos ?
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong>Autorité :</strong> Domain Rating (DR), ancienneté, popularité ?
                  </span>
                </li>
              </ul>
              <Alert className="border-primary/20 bg-primary/5 mt-3">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong>Objectif :</strong> Comprendre <strong>pourquoi</strong> il domine et répliquer ses forces
                    (pas copier son contenu, mais adopter sa stratégie).
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Stratégie 2 */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  2
                </div>
                <CardTitle className="dashboard-heading-4">
                  Progression Tactique : Ciblez les Concurrents Proches
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="dashboard-body-sm mb-3">
                Ne visez pas directement le #1 si vous êtes #30. Progressez <strong>étape par étape</strong> :
              </p>
              <div className="space-y-2">
                <Card className="border-primary/20 bg-card">
                  <CardContent className="flex items-start gap-3 p-3">
                    <Zap className="text-primary mt-1 h-5 w-5 shrink-0" />
                    <div className="flex-1">
                      <h4 className="dashboard-body-sm mb-1 font-semibold">Étape 1 : Dépasser les #25-#30</h4>
                      <p className="dashboard-text-xs text-muted-foreground">
                        Optimisez votre page, ajoutez 5-10 backlinks de qualité, améliorez votre contenu. Objectif :
                        entrer dans le <strong>Top 20</strong>.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card">
                  <CardContent className="flex items-start gap-3 p-3">
                    <Zap className="text-primary mt-1 h-5 w-5 shrink-0" />
                    <div className="flex-1">
                      <h4 className="dashboard-body-sm mb-1 font-semibold">Étape 2 : Viser le #15-#20</h4>
                      <p className="dashboard-text-xs text-muted-foreground">
                        Enrichissez votre contenu avec des sections manquantes, ajoutez des visuels, ciblez les People
                        Also Ask. Objectif : <strong>Top 15</strong>.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card">
                  <CardContent className="flex items-start gap-3 p-3">
                    <Zap className="text-primary mt-1 h-5 w-5 shrink-0" />
                    <div className="flex-1">
                      <h4 className="dashboard-body-sm mb-1 font-semibold">Étape 3 : Attaquer le Top 10</h4>
                      <p className="dashboard-text-xs text-muted-foreground">
                        Campagne de backlinks agressive, content upgrade massif, ciblage Featured Snippet. Objectif :{' '}
                        <strong>Page 1</strong>.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Alert className="border-primary/20 bg-primary/5 mt-3">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong>Objectif :</strong> Gagner 5-10 places à la fois plutôt que de viser directement le sommet
                    (plus réaliste et motivant).
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Stratégie 3 */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  3
                </div>
                <CardTitle className="dashboard-heading-4">
                  Opportunité Alternative : Pivotez vers des Mots-Clés Plus Accessibles
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="dashboard-body-sm mb-3">
                Si vous constatez que le marché est <strong>trop saturé</strong> (67 concurrents dont 5 géants dans le
                Top 10), il peut être plus judicieux de pivoter :
              </p>
              <Card className="border-primary/20 bg-card">
                <CardContent className="p-4">
                  <h4 className="dashboard-heading-4 mb-2 font-semibold">
                    Exemple : &quot;phone&quot; est trop compétitif
                  </h4>
                  <p className="dashboard-text-xs text-muted-foreground mb-2">Alternatives à cibler :</p>
                  <ul className="dashboard-body-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <Target className="text-primary h-4 w-4" />
                      <span>
                        <strong>&quot;best phone for seniors&quot;</strong> (niche moins saturée)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="text-primary h-4 w-4" />
                      <span>
                        <strong>&quot;phone comparison tool&quot;</strong> (intention différente)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="text-primary h-4 w-4" />
                      <span>
                        <strong>&quot;phone under $300&quot;</strong> (longue traîne)
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Alert className="border-primary/20 bg-primary/5 mt-3">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong>Objectif :</strong> Construire de l&apos;autorité sur des mots-clés{' '}
                    <strong>moins compétitifs</strong> avant de revenir attaquer les mots-clés majeurs.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Exemple concret */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-3">Cas d&apos;usage complet</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2 font-semibold">Scénario :</h4>
              <p className="dashboard-body-sm">
                Vous avez un e-commerce de smartphones et voulez ranker sur &quot;best budget phones 2025&quot;.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2 font-semibold">Résultat de l&apos;analyse :</h4>
              <div className="dashboard-body-sm space-y-2">
                <div>
                  • <strong>43 concurrents</strong> identifiés
                </div>
                <div>
                  • <strong>Leader :</strong> wirecutter.com (NYTimes) - Rating 98, 85k trafic/mois
                </div>
                <div>
                  • <strong>Top 3 :</strong> TechRadar, CNET, Tom&apos;s Guide (médias établis)
                </div>
                <div>
                  • <strong>Vous :</strong> #22/43 - Rating 48, 1 200 trafic/mois
                </div>
                <div>
                  • <strong>Écart :</strong> -83 800 trafic/mois vs le leader
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/40 bg-primary/10">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2 font-semibold">Décision Stratégique :</h4>
              <div className="dashboard-body-sm space-y-2">
                <p>
                  <strong>Constat :</strong> Le Top 10 est dominé par des <strong>géants</strong> (NYTimes, CNET).
                  Difficile d&apos;entrer dans le Top 10 rapidement.
                </p>
                <p className="mt-2">
                  <strong>Stratégie :</strong>
                </p>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>
                    <strong>Court terme :</strong> Cibler la longue traîne &quot;best budget phones under $200 for
                    students&quot; (moins de concurrents)
                  </li>
                  <li>
                    <strong>Moyen terme :</strong> Créer un comparateur interactif unique pour se différencier et
                    obtenir des backlinks
                  </li>
                  <li>
                    <strong>Long terme :</strong> Construire l&apos;autorité du domaine, puis revenir attaquer
                    &quot;best budget phones 2025&quot;
                  </li>
                </ol>
              </div>
              <Alert className="border-primary/20 bg-primary/5 mt-3">
                <AlertDescription className="dashboard-text-xs">
                  Résultat : Plan réaliste sur 12 mois au lieu de s&apos;épuiser sur un objectif inatteignable à court
                  terme.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

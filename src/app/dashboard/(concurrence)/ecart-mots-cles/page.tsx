import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  GitCompare,
  Info,
  Lightbulb,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react'
import KeywordGapAnalyzerPage from './KeywordGapAnalyzerPage'

export const metadata: Metadata = {
  title: 'Écart de Mots-Clés (Keyword Gap)',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Card className="border-primary/20 bg-primary/5 my-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg">
              <Zap className="text-primary-foreground h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="dashboard-heading-1">Analyseur d&apos;Écart de Mots-clés (Keyword Gap)</h2>
              <p className="dashboard-body-lg text-muted-foreground mt-2">
                Comparez votre profil de mots-clés avec celui d&apos;un concurrent et découvrez{' '}
                <strong className="text-foreground">où vous perdez du trafic</strong> et{' '}
                <strong className="text-foreground">où vous pouvez progresser</strong>. La stratégie SEO la plus
                efficace pour identifier des centaines d&apos;opportunités en quelques minutes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Hero Section */}
      <KeywordGapAnalyzerPage />

      {/* Choix du mode - Comparaison visuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-2 text-center">Choisissez votre mode d&apos;analyse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* MODE ÉCART (Recommandé) */}
            <Card className="group border-primary/30 bg-primary/5 relative transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-xl shadow-lg">
                    <Zap className="text-primary-foreground h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="dashboard-heading-2">Mode Écart</h4>
                    <p className="dashboard-body-sm text-muted-foreground">Trouvez vos opportunités manquées</p>
                  </div>
                </div>

                {/* Explication visuelle */}
                <Card className="border-border bg-card mb-4">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                          <CheckCircle2 className="text-primary-foreground h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="dashboard-body-sm font-semibold">
                            Concurrent : <span className="text-primary">POSITIONNÉ ✓</span>
                          </p>
                          <p className="dashboard-text-xs text-muted-foreground">Il apparaît dans le Top 100 Google</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="dashboard-heading-3 text-primary">VS</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-destructive flex h-10 w-10 items-center justify-center rounded-full">
                          <XCircle className="text-destructive-foreground h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="dashboard-body-sm font-semibold">
                            Vous : <span className="text-destructive">NON POSITIONNÉ ✗</span>
                          </p>
                          <p className="dashboard-text-xs text-muted-foreground">
                            Vous n&apos;apparaissez pas dans le Top 100
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary text-primary-foreground mt-4 flex items-center justify-center gap-2 rounded-lg p-3 text-sm font-bold">
                      <Target className="h-4 w-4" />= OPPORTUNITÉ SEO !
                    </div>
                  </CardContent>
                </Card>

                {/* Bénéfices */}
                <div className="space-y-2">
                  <h5 className="dashboard-heading-4">Ce que vous allez découvrir :</h5>
                  <ul className="dashboard-body-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-foreground">Opportunités ciblées</strong> : Les mots-clés manquants dans
                        votre stratégie de contenu
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-foreground">Easy Wins</strong> : Mots-clés à faible compétition mais
                        fort potentiel de trafic
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-foreground">Valeur estimée</strong> : Volume de recherche, CPC et ETV
                        (valeur du trafic) pour chaque opportunité
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-foreground">Plan de contenu</strong> : Liste concrète de sujets à
                        couvrir pour rattraper votre concurrent
                      </span>
                    </li>
                  </ul>
                </div>

                <Alert className="border-primary/20 bg-primary/5 mt-4">
                  <Info className="text-primary h-4 w-4" />
                  <AlertDescription className="dashboard-text-xs">
                    <strong>Exemple concret :</strong> Nike se positionne sur &quot;chaussures running marathon&quot; en
                    position #3, mais vous n&apos;apparaissez pas → Créez un guide complet sur ce sujet !
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* MODE COMMUNS */}
            <Card className="group border-border bg-card transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="bg-accent flex h-14 w-14 items-center justify-center rounded-xl shadow-lg">
                    <GitCompare className="text-accent-foreground h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="dashboard-heading-2">Mode Communs</h4>
                    <p className="dashboard-body-sm text-muted-foreground">Comparez vos positions directes</p>
                  </div>
                </div>

                {/* Explication visuelle */}
                <Card className="border-border bg-card mb-4">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                          <CheckCircle2 className="text-primary-foreground h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="dashboard-body-sm font-semibold">
                            Concurrent : <span className="text-primary">Position #3</span>
                          </p>
                          <p className="dashboard-text-xs text-muted-foreground">Il est bien positionné</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="dashboard-heading-3 text-primary">VS</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full">
                          <AlertCircle className="text-accent-foreground h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="dashboard-body-sm font-semibold">
                            Vous : <span className="text-accent-foreground">Position #15</span>
                          </p>
                          <p className="dashboard-text-xs text-muted-foreground">Vous êtes positionné mais plus bas</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-accent text-accent-foreground mt-4 flex items-center justify-center gap-2 rounded-lg p-3 text-sm font-bold">
                      <TrendingUp className="h-4 w-4" />= MARGE DE PROGRESSION !
                    </div>
                  </CardContent>
                </Card>

                {/* Bénéfices */}
                <div className="space-y-2">
                  <h5 className="dashboard-heading-4">Ce que vous allez découvrir :</h5>
                  <ul className="dashboard-body-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-foreground">Analyse comparative</strong> : Voir côte à côte vos
                        positions vs celles de votre concurrent
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-foreground">Points faibles</strong> : Mots-clés où vous êtes distancé
                        (lui #3, vous #18)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-foreground">Points forts</strong> : Mots-clés où VOUS surpassez votre
                        concurrent
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-foreground">Quick Wins</strong> : Mots-clés où vous êtes #11-20 et
                        pouvez facilement atteindre le Top 10
                      </span>
                    </li>
                  </ul>
                </div>

                <Alert className="border-primary/20 bg-primary/5 mt-4">
                  <Info className="text-primary h-4 w-4" />
                  <AlertDescription className="dashboard-text-xs">
                    <strong>Exemple concret :</strong> Sur &quot;chaussures trail&quot;, Nike est #5 et vous êtes #12 →
                    Optimisez votre contenu pour gagner 7 places et entrer dans le Top 10 !
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Tableau comparatif des 2 modes */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-2 text-center">Quel mode choisir selon votre objectif ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="dashboard-body-sm w-full text-left">
              <thead>
                <tr className="border-border border-b-2">
                  <th className="p-3 font-semibold">Critère</th>
                  <th className="bg-primary/10 text-primary p-3 font-semibold">Mode Écart (Gap)</th>
                  <th className="bg-accent/50 p-3 font-semibold">Mode Communs</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                <tr>
                  <td className="p-3 font-medium">Objectif principal</td>
                  <td className="bg-primary/10 p-3">
                    Trouver de <strong>nouveaux sujets</strong> à couvrir
                  </td>
                  <td className="bg-accent/50 p-3">
                    <strong>Améliorer</strong> vos positions existantes
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Cas d&apos;usage</td>
                  <td className="bg-primary/10 p-3">
                    Créer du <strong>nouveau contenu</strong>
                  </td>
                  <td className="bg-accent/50 p-3">
                    <strong>Optimiser</strong> du contenu existant
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Type d&apos;opportunités</td>
                  <td className="bg-primary/10 p-3">
                    Mots-clés <strong>manquants</strong> dans votre stratégie
                  </td>
                  <td className="bg-accent/50 p-3">
                    Mots-clés où vous pouvez <strong>gagner des places</strong>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">ROI rapide</td>
                  <td className="bg-primary/10 p-3">
                    <strong>Élevé</strong> (Easy Wins à faible compétition)
                  </td>
                  <td className="bg-accent/50 p-3">
                    <strong>Très élevé</strong> (contenus déjà indexés)
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Effort nécessaire</td>
                  <td className="bg-primary/10 p-3">
                    Création de contenu <strong>from scratch</strong>
                  </td>
                  <td className="bg-accent/50 p-3">
                    Optimisation de <strong>pages existantes</strong>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Idéal pour...</td>
                  <td className="bg-primary/10 p-3">
                    <strong>Expansion</strong> de votre couverture sémantique
                  </td>
                  <td className="bg-accent/50 p-3">
                    <strong>Amélioration</strong> de votre positionnement actuel
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Section "Comment ça marche ?" */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-2">Comment utiliser cet outil ? (4 étapes simples)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="dashboard-heading-4 mb-2">Choisissez votre mode</h3>
                <p className="dashboard-body-sm text-muted-foreground">
                  <strong className="text-foreground">Écart</strong> pour trouver de nouveaux sujets,{' '}
                  <strong className="text-foreground">Communs</strong> pour optimiser l&apos;existant
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="dashboard-heading-4 mb-2">Entrez 2 domaines</h3>
                <p className="dashboard-body-sm text-muted-foreground">
                  Concurrent (bien positionné) vs Votre site (ou un autre concurrent)
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="dashboard-heading-4 mb-2">Filtrez & analysez</h3>
                <p className="dashboard-body-sm text-muted-foreground">
                  Triez par volume, ETV, compétition... Identifiez vos Easy Wins
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold shadow-lg">
                  4
                </div>
                <h3 className="dashboard-heading-4 mb-2">Créez votre plan</h3>
                <p className="dashboard-body-sm text-muted-foreground">
                  Exportez et créez vos briefs de contenu ou vos optimisations
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Métriques expliquées */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BarChart3 className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-2">Les métriques que vous allez voir</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">Volume de recherche</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                Nombre de recherches mensuelles moyennes. Ciblez les volumes 500+ pour un impact rapide.
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">ETV (Estimated Traffic Value)</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                Valeur du trafic si vous étiez #1. Un ETV élevé = fort potentiel commercial.
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">Compétition</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                LOW = facile à ranker (Easy Win), MEDIUM = faisable, HIGH = difficile (mais rentable).
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">Position du concurrent</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                Son classement actuel. S&apos;il est #1-3, c&apos;est un mot-clé stratégique pour lui.
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">Votre position (Mode Communs)</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                L&apos;écart avec le concurrent. Si vous êtes #18 et lui #3 = grosse marge de progression.
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">CPC (Coût Par Clic)</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                Prix en Google Ads. CPC élevé = mot-clé à forte valeur commerciale.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Exemples concrets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Exemple Mode Écart */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="text-primary h-6 w-6" />
              <CardTitle className="dashboard-heading-3">Exemple Mode Écart</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="dashboard-body-sm">
              <strong className="text-foreground">Scénario :</strong> Vous vendez des chaussures de sport et analysez
              Nike.
            </p>
            <Card className="bg-card">
              <CardContent className="p-3">
                <p className="dashboard-body-sm mb-2 font-semibold">Résultat :</p>
                <ul className="dashboard-text-xs text-muted-foreground space-y-1">
                  <li>• &quot;chaussures trail femme&quot; → Nike #4, Vous absent</li>
                  <li>• &quot;baskets running marathon&quot; → Nike #2, Vous absent</li>
                  <li>• &quot;sneakers confortables&quot; → Nike #7, Vous absent</li>
                </ul>
              </CardContent>
            </Card>
            <Alert className="border-primary/20 bg-primary/5">
              <AlertDescription className="dashboard-text-xs">
                <strong>Action :</strong> Créez 3 articles/pages ciblant ces mots-clés pour capter ce trafic !
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Exemple Mode Communs */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="text-primary h-6 w-6" />
              <CardTitle className="dashboard-heading-3">Exemple Mode Communs</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="dashboard-body-sm">
              <strong className="text-foreground">Scénario :</strong> Vous et Nike êtes positionnés sur les mêmes
              mots-clés.
            </p>
            <Card className="bg-muted/30">
              <CardContent className="p-3">
                <p className="dashboard-body-sm mb-2 font-semibold">Résultat :</p>
                <ul className="dashboard-text-xs text-muted-foreground space-y-1">
                  <li>• &quot;chaussures running&quot; → Nike #3, Vous #15 (écart -12)</li>
                  <li>• &quot;baskets sport&quot; → Nike #8, Vous #11 (écart -3) Quick Win</li>
                  <li>• &quot;sneakers mode&quot; → Nike #12, Vous #5 (écart +7) Vous gagnez !</li>
                </ul>
              </CardContent>
            </Card>
            <Alert className="border-primary/20 bg-primary/5">
              <AlertDescription className="dashboard-text-xs">
                <strong>Action :</strong> Optimisez &quot;baskets sport&quot; (déjà #11) pour entrer dans le Top 10
                rapidement !
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

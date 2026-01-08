// 📁 app/dashboard/keywords/page.tsx
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertCircle,
  Award,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Eye,
  Info,
  Lightbulb,
  Link2,
  MapPin,
  MessageSquare,
  Search,
  ShoppingCart,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react'
import { KeywordOverviewContent } from './keyword-overview-content'

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 ">
      <Card className="border-primary/20 bg-primary/5 my-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg">
              <Search className="text-primary-foreground h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">
                Vue d&apos;ensemble des mots-clés : Analysez en profondeur vos mots-clés
              </h1>
              <p className="dashboard-body-lg text-muted-foreground mt-2">
                Obtenez une <strong className="text-foreground">vue à 360°</strong> de n&apos;importe quel mot-clé :
                volume de recherche, tendances mensuelles, difficulté SEO, fonctionnalités SERP, backlinks moyens du Top
                10, et <strong className="text-foreground">intention de recherche</strong>. L&apos;outil indispensable
                pour prendre des décisions SEO éclairées !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <KeywordOverviewContent />

      {/* Pourquoi utiliser cet outil */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
              <Trophy className="text-primary-foreground h-6 w-6" />
            </div>
            <CardTitle className="dashboard-heading-2">Pourquoi analyser un mot-clé en profondeur ?</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-primary/20 bg-card">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-1">Évitez les erreurs coûteuses</h4>
                <p className="dashboard-body-sm text-muted-foreground">
                  Ne créez pas de contenu sur un mot-clé trop difficile (difficulté 90+) ou avec un volume trop faible
                  (&lt;100). Économisez du temps et des ressources.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-1">Priorisez les bons mots-clés</h4>
                <p className="dashboard-body-sm text-muted-foreground">
                  Identifiez les mots-clés à{' '}
                  <strong className="text-foreground">volume élevé + difficulté faible</strong> (Quick Wins) et les
                  mots-clés à <strong className="text-foreground">forte valeur commerciale</strong> (CPC élevé).
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-1">Comprenez l&apos;intention</h4>
                <p className="dashboard-body-sm text-muted-foreground">
                  Sachez si l&apos;utilisateur veut <strong className="text-foreground">s&apos;informer</strong>,{' '}
                  <strong className="text-foreground">naviguer</strong>,{' '}
                  <strong className="text-foreground">comparer</strong> ou{' '}
                  <strong className="text-foreground">acheter</strong>. Adaptez votre contenu en conséquence.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 6 sections principales */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-2 text-center">Les 6 analyses que vous obtiendrez</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 1. Vue d'ensemble */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  1
                </div>
                <CardTitle className="dashboard-heading-3">Vue d&apos;Ensemble</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="border-primary/20 bg-card">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Search className="text-primary h-5 w-5" />
                      <span className="dashboard-text-xs font-semibold">VOLUME DE RECHERCHE</span>
                    </div>
                    <div className="dashboard-heading-2">550 000</div>
                    <p className="dashboard-text-xs text-muted-foreground mt-1">recherches mensuelles moyennes</p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-card">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSign className="text-primary h-5 w-5" />
                      <span className="dashboard-text-xs font-semibold">CPC MOYEN</span>
                    </div>
                    <div className="dashboard-heading-2">$6.04</div>
                    <p className="dashboard-text-xs text-muted-foreground mt-1">coût par clic en Google Ads</p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-card">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Target className="text-primary h-5 w-5" />
                      <span className="dashboard-text-xs font-semibold">DIFFICULTÉ</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="dashboard-heading-2">85</div>
                      <span className="bg-destructive/10 text-destructive rounded px-2 py-1 text-xs font-bold">
                        HIGH
                      </span>
                    </div>
                    <p className="dashboard-text-xs text-muted-foreground mt-1">difficulté SEO sur 100</p>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    <strong className="text-foreground">Interprétation :</strong> Ce mot-clé a un{' '}
                    <strong className="text-foreground">volume élevé</strong> (bon) mais une{' '}
                    <strong className="text-foreground">difficulté très haute</strong> (85/100). Il sera difficile de
                    ranker sans autorité de domaine importante et backlinks de qualité.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 2. Tendances */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  2
                </div>
                <CardTitle className="dashboard-heading-3">Tendances Mensuelles</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="border-primary/20 bg-card">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="dashboard-body-sm font-semibold">Évolution sur 12 mois</span>
                    <TrendingUp className="text-primary h-5 w-5" />
                  </div>

                  {/* Simulation graphique simplifié */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="dashboard-text-xs text-muted-foreground w-20">11/2025</span>
                      <div className="bg-muted h-4 flex-1 overflow-hidden rounded-full">
                        <div className="bg-primary h-full" style={{ width: '95%' }} />
                      </div>
                      <span className="dashboard-text-xs w-20 text-right font-semibold">673 000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="dashboard-text-xs text-muted-foreground w-20">10/2025</span>
                      <div className="bg-muted h-4 flex-1 overflow-hidden rounded-full">
                        <div className="bg-primary h-full" style={{ width: '78%' }} />
                      </div>
                      <span className="dashboard-text-xs w-20 text-right font-semibold">550 000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="dashboard-text-xs text-muted-foreground w-20">9/2025</span>
                      <div className="bg-muted h-4 flex-1 overflow-hidden rounded-full">
                        <div className="bg-primary h-full" style={{ width: '95%' }} />
                      </div>
                      <span className="dashboard-text-xs w-20 text-right font-semibold">673 000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="dashboard-text-xs text-muted-foreground w-20">8/2025</span>
                      <div className="bg-muted h-4 flex-1 overflow-hidden rounded-full">
                        <div className="bg-primary h-full" style={{ width: '78%' }} />
                      </div>
                      <span className="dashboard-text-xs w-20 text-right font-semibold">550 000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong className="text-foreground">Utilité :</strong> Détectez les{' '}
                    <strong className="text-foreground">saisonnalités</strong> (ex: &quot;sapin de noël&quot; explose en
                    décembre) et les <strong className="text-foreground">tendances long-terme</strong> (en croissance ou
                    en déclin). Évitez d&apos;investir sur un mot-clé en perte de vitesse.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 3. Concurrence */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  3
                </div>
                <CardTitle className="dashboard-heading-3">Analyse de la Concurrence</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="border-destructive/30 bg-destructive/5 text-center">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-center">
                      <XCircle className="text-destructive h-8 w-8" />
                    </div>
                    <div className="dashboard-heading-1 mb-1">2</div>
                    <h5 className="dashboard-heading-4 mb-2">Forte concurrence</h5>
                    <p className="dashboard-text-xs text-muted-foreground">Difficulté 70-100</p>
                    <div className="bg-destructive/10 text-destructive dashboard-text-xs mt-2 rounded p-2">
                      Mots-clés difficiles à ranker sans autorité forte
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-accent/30 text-center">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-center">
                      <AlertCircle className="text-primary h-8 w-8" />
                    </div>
                    <div className="dashboard-heading-1 mb-1">0</div>
                    <h5 className="dashboard-heading-4 mb-2">Concurrence moyenne</h5>
                    <p className="dashboard-text-xs text-muted-foreground">Difficulté 40-69</p>
                    <div className="bg-primary/10 text-primary dashboard-text-xs mt-2 rounded p-2">
                      Opportunités intéressantes avec effort modéré
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5 text-center">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-center">
                      <CheckCircle2 className="text-primary h-8 w-8" />
                    </div>
                    <div className="dashboard-heading-1 mb-1">0</div>
                    <h5 className="dashboard-heading-4 mb-2">Faible concurrence</h5>
                    <p className="dashboard-text-xs text-muted-foreground">Difficulté 0-39</p>
                    <div className="bg-primary/10 text-primary dashboard-text-xs mt-2 rounded p-2">
                      Quick Wins potentiels - Facile à ranker
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong className="text-foreground">Stratégie recommandée :</strong> Privilégiez les mots-clés à{' '}
                    <strong className="text-foreground">concurrence moyenne ou faible</strong> si vous débutez. Pour les
                    mots-clés très compétitifs, visez d&apos;abord la{' '}
                    <strong className="text-foreground">longue traîne</strong> (versions plus spécifiques).
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 4. Fonctionnalités SERP */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  4
                </div>
                <CardTitle className="dashboard-heading-3">Fonctionnalités SERP (Page de Résultats)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="dashboard-body-sm text-muted-foreground mb-4">
                Google affiche des fonctionnalités spéciales pour ce mot-clé. Votre présence dans ces éléments augmente
                votre <strong className="text-foreground">visibilité</strong> et votre{' '}
                <strong className="text-foreground">CTR</strong> (taux de clic).
              </p>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-3">
                    <Award className="text-primary mx-auto mb-1 h-6 w-6" />
                    <div className="dashboard-text-xs font-semibold">Featured Snippet</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-3">
                    <MessageSquare className="text-primary mx-auto mb-1 h-6 w-6" />
                    <div className="dashboard-text-xs font-semibold">People Also Ask</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-3">
                    <Eye className="text-primary mx-auto mb-1 h-6 w-6" />
                    <div className="dashboard-text-xs font-semibold">Images</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-3">
                    <Search className="text-primary mx-auto mb-1 h-6 w-6" />
                    <div className="dashboard-text-xs font-semibold">Related Searches</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-3">
                    <ShoppingCart className="text-primary mx-auto mb-1 h-6 w-6" />
                    <div className="dashboard-text-xs font-semibold">Product Results</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-3">
                    <MapPin className="text-primary mx-auto mb-1 h-6 w-6" />
                    <div className="dashboard-text-xs font-semibold">Local Pack</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-3">
                    <Eye className="text-primary mx-auto mb-1 h-6 w-6" />
                    <div className="dashboard-text-xs font-semibold">Perspectives</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-3">
                    <Target className="text-primary mx-auto mb-1 h-6 w-6" />
                    <div className="dashboard-text-xs font-semibold">Organic Results</div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong className="text-foreground">Action :</strong> Si vous voyez{' '}
                    <strong className="text-foreground">&quot;People Also Ask&quot;</strong>, intégrez ces questions
                    dans votre contenu pour augmenter vos chances d&apos;apparaître. Si vous voyez{' '}
                    <strong className="text-foreground">&quot;Featured Snippet&quot;</strong>, structurez votre réponse
                    de manière claire (liste, tableau, paragraphe concis).
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 5. Métriques de Backlinks */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  5
                </div>
                <CardTitle className="dashboard-heading-3">Backlinks Moyens du Top 10 Organique</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="dashboard-body-sm text-muted-foreground mb-4">
                Pour ranker sur ce mot-clé, voici les <strong className="text-foreground">statistiques moyennes</strong>{' '}
                des sites qui sont dans le Top 10 de Google :
              </p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-4">
                    <Link2 className="text-primary mx-auto mb-2 h-6 w-6" />
                    <div className="dashboard-heading-2">176 047</div>
                    <div className="dashboard-text-xs text-muted-foreground">Backlinks totaux</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-4">
                    <CheckCircle2 className="text-primary mx-auto mb-2 h-6 w-6" />
                    <div className="dashboard-heading-2">167 309</div>
                    <div className="dashboard-text-xs text-muted-foreground">Backlinks Dofollow</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-4">
                    <Target className="text-primary mx-auto mb-2 h-6 w-6" />
                    <div className="dashboard-heading-2">172 030</div>
                    <div className="dashboard-text-xs text-muted-foreground">Pages référentes</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card text-center">
                  <CardContent className="p-4">
                    <Award className="text-primary mx-auto mb-2 h-6 w-6" />
                    <div className="dashboard-heading-2">1 665</div>
                    <div className="dashboard-text-xs text-muted-foreground">Domaines référents</div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription className="dashboard-body-sm">
                  <p>
                    {' '}
                    <strong className="text-foreground">Interprétation :</strong> Pour espérer ranker dans le Top 10 sur
                    &quot;phone&quot;, vous devrez avoir un profil de backlinks similaire : minimum{' '}
                    <strong className="text-foreground">1 000+ domaines référents</strong> de qualité. Si vous en avez
                    seulement 100, ce mot-clé est probablement{' '}
                    <strong className="text-foreground">trop compétitif pour l&apos;instant</strong>.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 6. Intention de Recherche */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  6
                </div>
                <CardTitle className="dashboard-heading-3">Intention de Recherche</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="dashboard-body-sm text-muted-foreground mb-4">
                Comprenez <strong className="text-foreground">pourquoi</strong> les gens recherchent ce mot-clé pour
                adapter votre contenu en conséquence :
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card className="border-primary/20 bg-primary/5 text-center">
                  <CardContent className="p-4">
                    <Info className="text-primary mx-auto mb-2 h-8 w-8" />
                    <div className="dashboard-heading-2 mb-1">0</div>
                    <h5 className="dashboard-heading-4 mb-2">Informationnel</h5>
                    <p className="dashboard-text-xs text-muted-foreground">
                      L&apos;utilisateur veut <strong className="text-foreground">apprendre</strong> quelque chose
                    </p>
                    <div className="bg-primary/10 text-primary dashboard-text-xs mt-2 rounded p-2">
                      Ex: &quot;comment&quot;, &quot;pourquoi&quot;, &quot;qu&apos;est-ce que&quot;
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-accent/30 text-center">
                  <CardContent className="p-4">
                    <MapPin className="text-primary mx-auto mb-2 h-8 w-8" />
                    <div className="dashboard-heading-2 mb-1">2</div>
                    <h5 className="dashboard-heading-4 mb-2">Navigationnel</h5>
                    <p className="dashboard-text-xs text-muted-foreground">
                      L&apos;utilisateur cherche un <strong className="text-foreground">site spécifique</strong>
                    </p>
                    <div className="bg-primary/10 text-primary dashboard-text-xs mt-2 rounded p-2">
                      Ex: &quot;Facebook&quot;, &quot;Amazon login&quot;, &quot;Nike store&quot;
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5 text-center">
                  <CardContent className="p-4">
                    <BarChart3 className="text-primary mx-auto mb-2 h-8 w-8" />
                    <div className="dashboard-heading-2 mb-1">0</div>
                    <h5 className="dashboard-heading-4 mb-2">Commercial</h5>
                    <p className="dashboard-text-xs text-muted-foreground">
                      L&apos;utilisateur <strong className="text-foreground">compare</strong> avant d&apos;acheter
                    </p>
                    <div className="bg-primary/10 text-primary dashboard-text-xs mt-2 rounded p-2">
                      Ex: &quot;meilleur&quot;, &quot;comparatif&quot;, &quot;avis&quot;, &quot;vs&quot;
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5 text-center">
                  <CardContent className="p-4">
                    <ShoppingCart className="text-primary mx-auto mb-2 h-8 w-8" />
                    <div className="dashboard-heading-2 mb-1">0</div>
                    <h5 className="dashboard-heading-4 mb-2">Transactionnel</h5>
                    <p className="dashboard-text-xs text-muted-foreground">
                      L&apos;utilisateur est prêt à <strong className="text-foreground">acheter</strong>
                    </p>
                    <div className="bg-primary/10 text-primary dashboard-text-xs mt-2 rounded p-2">
                      Ex: &quot;acheter&quot;, &quot;prix&quot;, &quot;pas cher&quot;, &quot;promo&quot;
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription>
                  <p className="dashboard-body-sm mb-2 font-semibold">
                    Pour le nom de marque ou de service : Intention principale ={' '}
                    <strong className="text-foreground">Navigationnel</strong>
                  </p>
                  <p className="dashboard-text-xs text-muted-foreground">
                    Les gens cherchent probablement à accéder au site d&apos;une marque (Apple, Samsung...) ou à un
                    service.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Comment utiliser l'outil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-2">Comment utiliser cet outil efficacement ?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <h4 className="dashboard-heading-4">1. Validez un mot-clé avant de créer du contenu</h4>
              </div>
              <p className="dashboard-body-sm text-muted-foreground">
                Avant d&apos;écrire un article de 2000 mots, vérifiez que le mot-clé a un{' '}
                <strong className="text-foreground">volume suffisant</strong> (&gt;300/mois) et une{' '}
                <strong className="text-foreground">difficulté raisonnable</strong> par rapport à votre autorité de
                domaine.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Target className="text-primary h-5 w-5" />
                <h4 className="dashboard-heading-4">2. Comparez plusieurs variantes d&apos;un même mot-clé</h4>
              </div>
              <p className="dashboard-body-sm text-muted-foreground">
                Analysez &quot;chaussures running&quot;, &quot;chaussures de running&quot;, &quot;running shoes&quot;
                pour voir lequel a le <strong className="text-foreground">meilleur ratio volume/difficulté</strong>.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="text-primary h-5 w-5" />
                <h4 className="dashboard-heading-4">3. Détectez les tendances saisonnières</h4>
              </div>
              <p className="dashboard-body-sm text-muted-foreground">
                Si vous voyez un pic en décembre pour &quot;cadeau noël&quot;, préparez votre contenu en{' '}
                <strong className="text-foreground">octobre-novembre</strong> pour être prêt au bon moment.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Award className="text-primary h-5 w-5" />
                <h4 className="dashboard-heading-4">4. Adaptez votre contenu à l&apos;intention</h4>
              </div>
              <p className="dashboard-body-sm text-muted-foreground">
                <strong className="text-foreground">Informationnel</strong> → Guide complet, tutoriel
                <br />
                <strong className="text-foreground">Commercial</strong> → Comparatif, top 10, avis
                <br />
                <strong className="text-foreground">Transactionnel</strong> → Page produit, prix, CTA d&apos;achat
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Exemple concret */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Zap className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-2">Cas d&apos;usage concret</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Scénario :</h4>
              <p className="dashboard-body-sm text-muted-foreground">
                Vous voulez ranker sur &quot;chaussures running&quot; pour votre e-commerce. Vous analysez ce mot-clé
                avec l&apos;outil.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Résultats de l&apos;analyse :</h4>
              <div className="space-y-2">
                <div className="dashboard-body-sm flex items-center justify-between">
                  <span className="text-muted-foreground">Volume de recherche :</span>
                  <span className="text-primary font-bold">22 000/mois ✓ (élevé)</span>
                </div>
                <div className="dashboard-body-sm flex items-center justify-between">
                  <span className="text-muted-foreground">Difficulté SEO :</span>
                  <span className="text-destructive font-bold">78/100 ✗ (très difficile)</span>
                </div>
                <div className="dashboard-body-sm flex items-center justify-between">
                  <span className="text-muted-foreground">CPC moyen :</span>
                  <span className="text-primary font-bold">$2.50 ✓ (valeur commerciale)</span>
                </div>
                <div className="dashboard-body-sm flex items-center justify-between">
                  <span className="text-muted-foreground">Backlinks moyens Top 10 :</span>
                  <span className="text-primary font-bold">2 500 domaines référents</span>
                </div>
                <div className="dashboard-body-sm flex items-center justify-between">
                  <span className="text-muted-foreground">Intention :</span>
                  <span className="text-primary font-bold">Commercial + Transactionnel</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/10">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Décision stratégique :</h4>
              <p className="dashboard-body-sm text-muted-foreground">
                Le mot-clé est <strong className="text-foreground">trop compétitif</strong> (78/100) et nécessite 2 500+
                domaines référents. Vous avez seulement 150 domaines référents.
              </p>
              <p className="dashboard-body-sm text-primary mt-2 font-bold">
                Stratégie alternative : Ciblez d&apos;abord la{' '}
                <strong className="text-foreground">longue traîne</strong> :
              </p>
              <ul className="dashboard-body-sm text-muted-foreground mt-2 space-y-1">
                <li>• &quot;chaussures running femme débutant&quot; (difficulté 35, volume 1 200)</li>
                <li>• &quot;meilleures chaussures trail 2025&quot; (difficulté 42, volume 2 400)</li>
                <li>• &quot;chaussures running pronation excessive&quot; (difficulté 28, volume 800)</li>
              </ul>
              <Alert className="border-primary/20 bg-primary/5 mt-3">
                <AlertDescription className="dashboard-text-xs">
                  Une fois que vous aurez construit votre autorité avec ces mots-clés plus faciles, vous pourrez
                  attaquer &quot;chaussures running&quot; !
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* CTA Final */}
      <Card className="border-primary/30 bg-primary shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="dashboard-heading-2 text-primary-foreground mb-2">Prêt à analyser vos mots-clés ?</h3>
              <p className="dashboard-body-sm text-primary-foreground/80">
                Entrez un ou plusieurs mots-clés ci-dessous pour obtenir toutes les données nécessaires à vos décisions
                SEO
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

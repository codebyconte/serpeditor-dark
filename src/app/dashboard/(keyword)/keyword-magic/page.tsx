// 📁 app/dashboard/keyword-magic/page.tsx
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertCircle,
  Award,
  Brain,
  CheckCircle2,
  GitBranch,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import { KeywordMagicContent } from './components/keyword-magic-content'

/**
 * Métadonnées pour la page Recherche de Mots-Clés
 * Note: robots: noindex car c'est une page privée/authentifiée
 * Le title sera combiné avec le template du layout: "Recherche de Mots-Clés | Dashboard SerpEditor"
 */
export const metadata: Metadata = {
  title: 'Recherche de Mots-Clés',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hero Section */}
      <Card className="border-primary/20 bg-primary/5 my-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg">
              <Search className="text-primary-foreground h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">
                Recherche de Mots-Clés : Découvrez des Milliers d&apos;Opportunités
              </h1>
              <p className="dashboard-body-lg text-muted-foreground mt-2">
                Partez d&apos;un simple <strong className="text-foreground">mot-clé de départ</strong> (seed keyword) et
                générez automatiquement des <strong className="text-foreground">centaines d&apos;idées</strong> de
                mots-clés connexes. L&apos;outil indispensable pour construire votre stratégie de contenu et découvrir
                des opportunités que vos concurrents ont manquées !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <KeywordMagicContent />

      {/* Concept clé : Seed Keyword */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
              <Sparkles className="text-primary-foreground h-6 w-6" />
            </div>
            <CardTitle className="dashboard-heading-2">
              Qu&apos;est-ce qu&apos;un &quot;Seed Keyword&quot; (Mot-clé de départ) ?
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="dashboard-body-sm text-muted-foreground">
            Un <strong className="text-foreground">seed keyword</strong> est un mot-clé{' '}
            <strong className="text-foreground">générique</strong> qui représente votre thématique principale. À partir
            de ce mot, l&apos;algorithme va générer des <strong className="text-foreground">variantes</strong>,{' '}
            <strong className="text-foreground">questions</strong>,{' '}
            <strong className="text-foreground">expressions longue traîne</strong>, et{' '}
            <strong className="text-foreground">mots-clés associés</strong>.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-primary/20 bg-card">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-1">Seed Keyword</h4>
                <p className="dashboard-heading-3 mb-2">&quot;phone&quot;</p>
                <p className="dashboard-text-xs text-muted-foreground">Mot-clé générique de départ</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-1">L&apos;outil génère :</h4>
                <div className="dashboard-text-xs space-y-1">
                  <div>• &quot;phone cases&quot;</div>
                  <div>• &quot;best phone 2025&quot;</div>
                  <div>• &quot;phone repair near me&quot;</div>
                  <div>• &quot;cheap smartphones&quot;</div>
                  <div>• &quot;how to fix phone screen&quot;</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-accent/30">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-1">Résultat :</h4>
                <p className="dashboard-body-sm font-bold">+500 idées</p>
                <p className="dashboard-text-xs text-muted-foreground">
                  Des centaines de variations pour construire votre plan de contenu
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Les 3 modes de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-2 text-center">Les 3 Modes de Recherche Expliqués</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode 1 : Suggestions */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl">
                  <Lightbulb className="text-primary-foreground h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="dashboard-heading-3">Suggestions</CardTitle>
                  <p className="dashboard-text-xs text-muted-foreground">
                    Auto-complétion Google & suggestions populaires
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="border-primary/20 bg-card">
                <CardContent className="p-4">
                  <p className="dashboard-body-sm text-muted-foreground mb-3">
                    Ce mode réplique <strong className="text-foreground">l&apos;auto-complétion de Google</strong> (ce
                    qui apparaît quand vous tapez dans la barre de recherche). Ce sont des suggestions basées sur les{' '}
                    <strong className="text-foreground">recherches réelles des utilisateurs</strong>.
                  </p>

                  <Card className="bg-muted mb-3">
                    <CardContent className="p-3">
                      <div className="dashboard-text-xs mb-2 font-semibold">
                        Exemple : Vous entrez &quot;phone&quot;
                      </div>
                      <div className="dashboard-body-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Search className="text-primary h-4 w-4" />
                          <span className="font-medium">phone cases</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Search className="text-primary h-4 w-4" />
                          <span className="font-medium">phone repair</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Search className="text-primary h-4 w-4" />
                          <span className="font-medium">phone number lookup</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Search className="text-primary h-4 w-4" />
                          <span className="font-medium">phone store near me</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert className="border-primary/20 bg-primary/5">
                    <AlertDescription className="dashboard-body-sm">
                      <p>
                        {' '}
                        <strong className="text-foreground">Pourquoi c&apos;est puissant :</strong> Ce sont des
                        recherches <strong className="text-foreground">authentiques</strong> que les gens font
                        réellement. Si Google les suggère, c&apos;est qu&apos;elles sont{' '}
                        <strong className="text-foreground">populaires</strong> !
                      </p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Alert className="border-l-primary bg-primary/5 mt-4 border-l-4">
                <AlertDescription>
                  <p className="dashboard-body-sm font-semibold">Idéal pour :</p>
                  <ul className="dashboard-body-sm text-muted-foreground mt-2 space-y-1">
                    <li>
                      • Découvrir les <strong className="text-foreground">requêtes populaires</strong> de votre niche
                    </li>
                    <li>
                      • Identifier les <strong className="text-foreground">besoins réels</strong> des utilisateurs
                    </li>
                    <li>
                      • Trouver des idées de contenu{' '}
                      <strong className="text-foreground">alignées avec la demande</strong>
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Mode 2 : Associés */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl">
                  <GitBranch className="text-primary-foreground h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="dashboard-heading-3"> Associés</CardTitle>
                  <p className="dashboard-text-xs text-muted-foreground">Mots-clés sémantiquement liés</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="border-primary/20 bg-card">
                <CardContent className="p-4">
                  <p className="dashboard-body-sm text-muted-foreground mb-3">
                    Ce mode trouve des mots-clés <strong className="text-foreground">connexes sémantiquement</strong> à
                    votre seed keyword, même s&apos;ils ne contiennent pas le mot exact. Google considère ces mots-clés
                    comme étant dans le même <strong className="text-foreground">champ lexical</strong>.
                  </p>

                  <Card className="bg-muted mb-3">
                    <CardContent className="p-3">
                      <div className="dashboard-text-xs mb-2 font-semibold">
                        Exemple : Vous entrez &quot;phone&quot;
                      </div>
                      <div className="dashboard-body-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <GitBranch className="text-primary h-4 w-4" />
                          <span className="font-medium">smartphone</span>
                          <span className="dashboard-text-xs text-muted-foreground">(synonyme)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitBranch className="text-primary h-4 w-4" />
                          <span className="font-medium">mobile device</span>
                          <span className="dashboard-text-xs text-muted-foreground">(terme associé)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitBranch className="text-primary h-4 w-4" />
                          <span className="font-medium">iPhone alternatives</span>
                          <span className="dashboard-text-xs text-muted-foreground">(sous-thématique)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitBranch className="text-primary h-4 w-4" />
                          <span className="font-medium">Android vs iOS</span>
                          <span className="dashboard-text-xs text-muted-foreground">(comparaison liée)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert className="border-primary/20 bg-primary/5">
                    <AlertDescription className="dashboard-body-sm">
                      <p>
                        {' '}
                        <strong className="text-foreground">Pourquoi c&apos;est puissant :</strong> Vous découvrez des
                        mots-clés <strong className="text-foreground">connexes</strong> auxquels vous n&apos;auriez pas
                        pensé. Parfait pour{' '}
                        <strong className="text-foreground">élargir votre couverture sémantique</strong> !
                      </p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Alert className="border-l-primary bg-primary/5 mt-4 border-l-4">
                <AlertDescription>
                  <p className="dashboard-body-sm font-semibold">Idéal pour :</p>
                  <ul className="dashboard-body-sm text-muted-foreground mt-2 space-y-1">
                    <li>
                      • Explorer des <strong className="text-foreground">angles différents</strong> de votre thématique
                    </li>
                    <li>
                      • Trouver des <strong className="text-foreground">synonymes</strong> et variantes
                    </li>
                    <li>
                      • Enrichir votre <strong className="text-foreground">cocon sémantique</strong> (SEO avancé)
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Mode 3 : Idées */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl">
                  <Brain className="text-primary-foreground h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="dashboard-heading-3"> Idées</CardTitle>
                  <p className="dashboard-text-xs text-muted-foreground">Combinaison algorithmique avancée</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="border-primary/20 bg-card">
                <CardContent className="p-4">
                  <p className="dashboard-body-sm text-muted-foreground mb-3">
                    Ce mode utilise un <strong className="text-foreground">algorithme intelligent</strong> qui combine
                    les deux modes précédents + des variations créatives (questions, modificateurs, expressions longue
                    traîne). C&apos;est le mode le plus <strong className="text-foreground">exhaustif</strong>.
                  </p>

                  <Card className="bg-muted mb-3">
                    <CardContent className="p-3">
                      <div className="dashboard-text-xs mb-2 font-semibold">
                        Exemple : Vous entrez &quot;phone&quot;
                      </div>
                      <div className="dashboard-body-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Brain className="text-primary h-4 w-4" />
                          <span className="font-medium">best phone for gaming 2025</span>
                          <span className="dashboard-text-xs text-muted-foreground">(longue traîne)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="text-primary h-4 w-4" />
                          <span className="font-medium">how to choose a phone</span>
                          <span className="dashboard-text-xs text-muted-foreground">(question)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="text-primary h-4 w-4" />
                          <span className="font-medium">phone with best camera under $500</span>
                          <span className="dashboard-text-xs text-muted-foreground">(modificateur prix)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="text-primary h-4 w-4" />
                          <span className="font-medium">phone comparison tool</span>
                          <span className="dashboard-text-xs text-muted-foreground">(outil connexe)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert className="border-primary/20 bg-primary/5">
                    <AlertDescription className="dashboard-body-sm">
                      <p>
                        {' '}
                        <strong className="text-foreground">Pourquoi c&apos;est puissant :</strong> Vous obtenez le{' '}
                        <strong className="text-foreground">maximum d&apos;idées</strong> possibles. C&apos;est parfait
                        pour créer un <strong className="text-foreground">plan de contenu complet</strong> sur plusieurs
                        mois !
                      </p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Alert className="border-l-primary bg-primary/5 mt-4 border-l-4">
                <AlertDescription>
                  <p className="dashboard-body-sm font-semibold">Idéal pour :</p>
                  <ul className="dashboard-body-sm text-muted-foreground mt-2 space-y-1">
                    <li>
                      • Construire une <strong className="text-foreground">liste exhaustive</strong> de mots-clés
                    </li>
                    <li>
                      • Trouver des <strong className="text-foreground">questions fréquentes</strong> (People Also Ask)
                    </li>
                    <li>
                      • Découvrir des <strong className="text-foreground">opportunités nichées</strong> (longue traîne)
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Stratégie de tri des résultats */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Target className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-2">Comment identifier les meilleures opportunités ?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Wins */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="text-primary h-6 w-6" />
                <CardTitle className="dashboard-heading-3">1. Les &quot;Quick Wins&quot;</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="dashboard-body-sm text-muted-foreground mb-4">
                Ce sont les mots-clés à <strong className="text-foreground">volume intéressant</strong> avec une{' '}
                <strong className="text-foreground">faible difficulté</strong>. Faciles et rapides à ranker !
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="border-primary/20 bg-card">
                  <CardContent className="p-4">
                    <h4 className="dashboard-heading-4 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Critères d&apos;un Quick Win
                    </h4>
                    <ul className="dashboard-body-sm text-muted-foreground space-y-1">
                      <li>
                        • <strong className="text-foreground">Volume :</strong> 500 - 5 000/mois (suffisant mais pas
                        saturé)
                      </li>
                      <li>
                        • <strong className="text-foreground">Difficulté :</strong> 0-39 (faible ou moyenne-basse)
                      </li>
                      <li>
                        • <strong className="text-foreground">Concurrence :</strong> LOW ou MEDIUM
                      </li>
                      <li>
                        • <strong className="text-foreground">CPC :</strong> $0.50+ (valeur commerciale)
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-primary/10">
                  <CardContent className="p-4">
                    <h4 className="dashboard-heading-4 mb-2">Exemple de Quick Win</h4>
                    <Card className="bg-card">
                      <CardContent className="p-2">
                        <strong className="dashboard-body-sm">rotary phone brands</strong>
                        <div className="dashboard-text-xs text-muted-foreground mt-1 space-y-1">
                          <div>Volume : 10/mois</div>
                          <div>Difficulté : 5/100</div>
                          <div>Concurrence : LOW</div>
                        </div>
                      </CardContent>
                    </Card>
                    <p className="dashboard-text-xs text-primary mt-2">
                      Ultra-facile à ranker, parfait pour construire de l&apos;autorité sur une niche !
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Mots-clés à fort potentiel */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="text-primary h-6 w-6" />
                <CardTitle className="dashboard-heading-3">2. Les &quot;High Value&quot;</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="dashboard-body-sm text-muted-foreground mb-4">
                Mots-clés plus difficiles mais avec un <strong className="text-foreground">volume élevé</strong> et une{' '}
                <strong className="text-foreground">forte valeur commerciale</strong>. À cibler sur le long terme.
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="border-primary/20 bg-card">
                  <CardContent className="p-4">
                    <h4 className="dashboard-heading-4 mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Critères d&apos;un High Value
                    </h4>
                    <ul className="dashboard-body-sm text-muted-foreground space-y-1">
                      <li>
                        • <strong className="text-foreground">Volume :</strong> 10 000+ /mois (fort potentiel trafic)
                      </li>
                      <li>
                        • <strong className="text-foreground">Difficulté :</strong> 50-70 (challengeant mais faisable)
                      </li>
                      <li>
                        • <strong className="text-foreground">CPC :</strong> $5+ (très forte valeur commerciale)
                      </li>
                      <li>
                        • <strong className="text-foreground">Intention :</strong> Commercial ou Transactionnel
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-primary/10">
                  <CardContent className="p-4">
                    <h4 className="dashboard-heading-4 mb-2">Exemple de High Value</h4>
                    <Card className="bg-card">
                      <CardContent className="p-2">
                        <strong className="dashboard-body-sm">seo marketing tool</strong>
                        <div className="dashboard-text-xs text-muted-foreground mt-1 space-y-1">
                          <div>Volume : 49 500/mois</div>
                          <div>Difficulté : 49/100</div>
                          <div>CPC : $17.45</div>
                        </div>
                      </CardContent>
                    </Card>
                    <p className="dashboard-text-xs text-primary mt-2">
                      Fort volume + CPC élevé = opportunité très lucrative à long terme !
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Mots-clés à éviter */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="text-destructive h-6 w-6" />
                <CardTitle className="dashboard-heading-3">3. Les &quot;À Éviter&quot;</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="dashboard-body-sm text-muted-foreground mb-4">
                Mots-clés qui ne valent pas l&apos;investissement en temps/ressources.
              </p>

              <div className="space-y-3">
                <Card className="border-destructive/30 bg-card">
                  <CardContent className="p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <AlertCircle className="text-destructive h-4 w-4" />
                      <span className="dashboard-body-sm font-semibold">Volume trop faible + Difficulté élevée</span>
                    </div>
                    <p className="dashboard-text-xs text-muted-foreground">
                      Ex: Volume &lt;50/mois + Difficulté &gt;60 → Effort disproportionné par rapport au ROI
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-destructive/30 bg-card">
                  <CardContent className="p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <AlertCircle className="text-destructive h-4 w-4" />
                      <span className="dashboard-body-sm font-semibold">Intention non-alignée avec votre business</span>
                    </div>
                    <p className="dashboard-text-xs text-muted-foreground">
                      Ex: Si vous vendez des produits, évitez les mots-clés purement informationnels sans potentiel de
                      conversion
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-destructive/30 bg-card">
                  <CardContent className="p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <AlertCircle className="text-destructive h-4 w-4" />
                      <span className="dashboard-body-sm font-semibold">CPC = $0.00 + Volume élevé</span>
                    </div>
                    <p className="dashboard-text-xs text-muted-foreground">
                      Souvent signe d&apos;un mot-clé <strong className="text-foreground">informatif</strong> sans
                      valeur commerciale (sauf si c&apos;est votre objectif)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Workflow recommandé */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-2">Workflow en 5 étapes pour exploiter les résultats</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
              1
            </div>
            <div className="flex-1">
              <h4 className="dashboard-heading-4 mb-1">Entrez un seed keyword large</h4>
              <p className="dashboard-body-sm text-muted-foreground">
                Commencez par un mot-clé <strong className="text-foreground">générique</strong> de votre thématique (ex:
                &quot;phone&quot;, &quot;seo&quot;, &quot;marketing&quot;). Plus il est large, plus vous aurez
                d&apos;idées.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
              2
            </div>
            <div className="flex-1">
              <h4 className="dashboard-heading-4 mb-1">Testez les 3 modes (Suggestions, Associés, Idées)</h4>
              <p className="dashboard-body-sm text-muted-foreground">
                Lancez une recherche dans chaque mode pour couvrir{' '}
                <strong className="text-foreground">tous les angles</strong>. Vous aurez des centaines d&apos;idées à
                analyser.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
              3
            </div>
            <div className="flex-1">
              <h4 className="dashboard-heading-4 mb-1">Filtrez par Quick Wins</h4>
              <p className="dashboard-body-sm text-muted-foreground">
                Activez les filtres : <strong className="text-foreground">Difficulté &lt; 40</strong>,{' '}
                <strong className="text-foreground">Volume &gt; 500</strong>. Triez par volume décroissant. Ce sont vos
                priorités immédiates.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
              4
            </div>
            <div className="flex-1">
              <h4 className="dashboard-heading-4 mb-1">Analysez les SERP Features</h4>
              <p className="dashboard-body-sm text-muted-foreground">
                Repérez les mots-clés avec <strong className="text-foreground">&quot;People Also Ask&quot;</strong>,{' '}
                <strong className="text-foreground">&quot;Featured Snippet&quot;</strong> → Structurez votre contenu
                pour les capturer.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
              5
            </div>
            <div className="flex-1">
              <h4 className="dashboard-heading-4 mb-1">Exportez et créez votre plan de contenu</h4>
              <p className="dashboard-body-sm text-muted-foreground">
                Téléchargez en CSV, organisez par clusters thématiques, et{' '}
                <strong className="text-foreground">priorisez</strong> : Quick Wins d&apos;abord, High Value ensuite.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemple concret complet */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-2">Exemple complet pas-à-pas</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Scénario :</h4>
              <p className="dashboard-body-sm text-muted-foreground">
                Vous avez un blog sur la productivité et voulez créer du contenu sur les outils SEO.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Étape 1 : Seed Keyword</h4>
              <p className="dashboard-body-sm text-muted-foreground">
                Vous entrez <strong className="text-foreground">&quot;seo tool&quot;</strong> comme mot-clé de départ.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Étape 2 : Mode &quot;Idées&quot;</h4>
              <p className="dashboard-body-sm text-muted-foreground mb-2">L&apos;outil génère 487 mots-clés :</p>
              <div className="dashboard-text-xs text-muted-foreground space-y-1">
                <div>• seo marketing tool (49 500 vol, 49 diff, $17.45 CPC)</div>
                <div>• best free seo tools (8 100 vol, 35 diff, $12.30 CPC)</div>
                <div>• seo analysis tool (5 400 vol, 42 diff, $8.90 CPC)</div>
                <div>• local seo tools (1 900 vol, 28 diff, $6.50 CPC)</div>
                <div>• ... et 483 autres</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Étape 3 : Filtrage & Priorisation</h4>
              <div className="space-y-2">
                <Alert className="border-l-primary bg-primary/5 border-l-4">
                  <AlertDescription>
                    <strong className="dashboard-body-sm">Quick Wins identifiés :</strong>
                    <div className="dashboard-text-xs text-muted-foreground mt-1">
                      • &quot;local seo tools&quot; (1 900 vol, 28 diff)
                      <br />• &quot;seo tools for beginners&quot; (720 vol, 22 diff)
                    </div>
                  </AlertDescription>
                </Alert>
                <Alert className="border-l-primary bg-primary/5 border-l-4">
                  <AlertDescription>
                    <strong className="dashboard-body-sm">High Value (moyen terme) :</strong>
                    <div className="dashboard-text-xs text-muted-foreground mt-1">
                      • &quot;seo marketing tool&quot; (49 500 vol, 49 diff, $17.45)
                      <br />• &quot;best free seo tools&quot; (8 100 vol, 35 diff, $12.30)
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/10">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Plan de Contenu Final :</h4>
              <ol className="dashboard-body-sm text-muted-foreground space-y-1">
                <li>
                  <strong className="text-foreground">Semaine 1-2 :</strong> Article sur &quot;local seo tools&quot;
                  (Quick Win)
                </li>
                <li>
                  <strong className="text-foreground">Semaine 3-4 :</strong> Guide &quot;seo tools for beginners&quot;
                  (Quick Win)
                </li>
                <li>
                  <strong className="text-foreground">Mois 2 :</strong> Comparatif &quot;best free seo tools&quot; (High
                  Value)
                </li>
                <li>
                  <strong className="text-foreground">Mois 3 :</strong> Review &quot;seo marketing tool&quot; (High
                  Value + forte autorité nécessaire)
                </li>
              </ol>
              <Alert className="border-primary/20 bg-primary/5 mt-3">
                <AlertDescription className="dashboard-text-xs">
                  Résultat : Plan de contenu de 3 mois avec priorités claires et ROI maximisé !
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
              <h3 className="dashboard-heading-2 text-primary-foreground mb-2">
                Prêt à découvrir des centaines d&apos;opportunités ?
              </h3>
              <p className="dashboard-body-sm text-primary-foreground/80">
                Entrez un mot-clé de départ et laissez l&apos;algorithme générer des idées de contenu pour les 6
                prochains mois !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

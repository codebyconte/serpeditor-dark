import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, BarChart3, CheckCircle2, Globe, Lightbulb, Link2, Search, Target, Trophy, Zap } from 'lucide-react'
import DomainIntersectionAnalyzerPage from './DomainIntersectionAnalyzerPage'

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hero Section */}
      <Card className="border-primary/20 bg-primary/5 my-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg">
              <Link2 className="text-primary-foreground h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">Possibilités de backlinks : Trouvez vos opportunités chaudes</h1>
              <p className="dashboard-body-lg text-muted-foreground mt-2">
                Découvrez les sites qui font déjà des backlinks vers{' '}
                <strong className="text-foreground">plusieurs de vos concurrents</strong>. Ce sont vos{' '}
                <strong className="text-foreground">meilleures opportunités</strong> car ces sites sont déjà intéressés
                par votre thématique et ont l&apos;habitude de créer des liens dans votre secteur !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DomainIntersectionAnalyzerPage />

      {/* Concept clé - Pourquoi c'est si puissant */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
              <Zap className="text-primary-foreground h-6 w-6" />
            </div>
            <CardTitle className="dashboard-heading-2">Pourquoi cette stratégie est-elle si efficace ?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="dashboard-body-sm">
            Imaginez que vous vendez des chaussures de running. Si un site fait un backlink vers{' '}
            <strong className="text-foreground">Nike</strong>, <strong className="text-foreground">Adidas</strong> ET{' '}
            <strong className="text-foreground">Asics</strong>, cela signifie que :
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-primary/20 bg-card">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-1">Thématique pertinente</h4>
                <p className="dashboard-body-sm text-muted-foreground">
                  Ce site parle de chaussures de sport, exactement votre domaine !
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-1">Ouvert aux partenariats</h4>
                <p className="dashboard-body-sm text-muted-foreground">
                  Il a déjà créé 3 liens vers des marques similaires, donc il est réceptif.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-1">Opportunité chaude</h4>
                <p className="dashboard-body-sm text-muted-foreground">
                  Votre taux de succès pour obtenir un backlink sera beaucoup plus élevé !
                </p>
              </CardContent>
            </Card>
          </div>

          <Alert className="border-l-primary bg-primary/5 border-l-4">
            <AlertDescription className="dashboard-body-sm font-semibold">
              Résultat : Au lieu de contacter 100 sites au hasard avec un taux de réussite de 1-2%, vous contactez des
              sites qualifiés avec un taux de réussite de 10-20% !
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Schéma visuel - Comment ça marche */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-2 text-center">
            Comment fonctionne la détection des opportunités de backlinks ?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Schéma visuel */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="mb-4 text-center">
                <p className="dashboard-body-sm font-semibold">Vous analysez 3 concurrents :</p>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="border-primary/30 bg-card text-center">
                  <CardContent className="p-4">
                    <Globe className="text-primary mx-auto mb-2 h-8 w-8" />
                    <p className="dashboard-heading-4">nike.com</p>
                    <p className="dashboard-text-xs text-muted-foreground">Concurrent 1</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/30 bg-card text-center">
                  <CardContent className="p-4">
                    <Globe className="text-primary mx-auto mb-2 h-8 w-8" />
                    <p className="dashboard-heading-4">adidas.com</p>
                    <p className="dashboard-text-xs text-muted-foreground">Concurrent 2</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/30 bg-card text-center">
                  <CardContent className="p-4">
                    <Globe className="text-primary mx-auto mb-2 h-8 w-8" />
                    <p className="dashboard-heading-4">asics.com</p>
                    <p className="dashboard-text-xs text-muted-foreground">Concurrent 3</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-4 text-center">
                <div className="bg-primary text-primary-foreground inline-block rounded-full px-4 py-2 text-sm font-bold">
                  ⬇ L&apos;OUTIL TROUVE ⬇
                </div>
              </div>

              {/* Sites qui font des liens vers plusieurs concurrents */}
              <div className="space-y-3">
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="text-primary h-6 w-6" />
                      <div>
                        <p className="dashboard-heading-4">runningmagazine.com</p>
                        <p className="dashboard-text-xs text-muted-foreground">Pointe vers les 3 ! </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-bold">
                        Nike ✓
                      </span>
                      <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-bold">
                        Adidas ✓
                      </span>
                      <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-bold">
                        Asics ✓
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-accent/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Award className="text-primary h-6 w-6" />
                      <div>
                        <p className="dashboard-heading-4">sportblog.fr</p>
                        <p className="dashboard-text-xs text-muted-foreground">Pointe vers 2 sur 3</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-bold">
                        Nike ✓
                      </span>
                      <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-bold">
                        Adidas ✓
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-primary/20 bg-primary/5 mt-4">
                <AlertDescription className="dashboard-body-sm text-center font-bold">
                  Ces sites sont vos opportunités chaudes !
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Puissance du système */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-5 w-5" />
                  Plus d&apos;intersections = Meilleure opportunité
                </h4>
                <p className="dashboard-body-sm text-muted-foreground">
                  Un site qui pointe vers <strong className="text-foreground">5 de vos concurrents</strong> est une
                  opportunité en OR ! Il connaît votre secteur et sera très réceptif à votre contenu.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <h4 className="dashboard-heading-4 mb-2 flex items-center gap-2">
                  <Target className="text-primary h-5 w-5" />
                  Analysez jusqu&apos;à 5 domaines
                </h4>
                <p className="dashboard-body-sm text-muted-foreground">
                  Plus vous ajoutez de concurrents (max 5), plus vous affinez vos résultats. Les sites qui pointent vers
                  3-4-5 concurrents sont des pépites !
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Comment l'utiliser - 4 étapes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-2">Comment utiliser cet outil ? (4 étapes)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="dashboard-heading-4 mb-2">Identifiez vos concurrents</h3>
                <p className="dashboard-body-sm text-muted-foreground">
                  Listez 2 à 5 concurrents directs qui sont bien positionnés dans votre niche (ex: Nike, Adidas, Asics,
                  Puma, Reebok)
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="dashboard-heading-4 mb-2">Lancez l&apos;analyse</h3>
                <p className="dashboard-body-sm text-muted-foreground">
                  Entrez les domaines dans l&apos;outil. L&apos;algorithme va croiser leurs profils de backlinks et
                  trouver les intersections
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="dashboard-heading-4 mb-2">Analysez les résultats</h3>
                <p className="dashboard-body-sm text-muted-foreground">
                  Triez par nombre de targets pointées (3/5, 4/5...). Plus le chiffre est élevé, plus c&apos;est une
                  opportunité chaude !
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold shadow-lg">
                  4
                </div>
                <h3 className="dashboard-heading-4 mb-2">Contactez-les</h3>
                <p className="dashboard-body-sm text-muted-foreground">
                  Préparez un email personnalisé et proposez votre contenu. Taux de réussite bien plus élevé que du cold
                  outreach !
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
            <CardTitle className="dashboard-heading-2">Comprendre les métriques</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">Targets Pointées (ex: 2/2, 3/5)</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                <strong className="text-foreground">Le chiffre le plus important !</strong> Indique vers combien de vos
                concurrents ce domaine pointe. &quot;3/5&quot; = il pointe vers 3 de vos 5 concurrents analysés. Plus
                c&apos;est élevé, mieux c&apos;est !
                <div className="bg-primary/10 dashboard-text-xs mt-2 rounded p-2">
                  <strong>Priorisez :</strong> <span className="inline">5/5 &gt; 4/5 &gt; 3/5 &gt; 2/5</span>
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">Total Backlinks (BL)</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                Nombre total de backlinks que ce domaine a créé vers vos concurrents. Un nombre élevé indique qu&apos;il
                fait régulièrement des liens dans votre secteur.
                <div className="bg-primary/10 dashboard-text-xs mt-2 rounded p-2">
                  <strong>Exemple :</strong> 111 BL = ce site a fait 111 liens vers vos concurrents
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">Domaines Référents (RD)</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                Nombre de domaines uniques parmi vos concurrents vers lesquels ce site fait des backlinks. Si vous
                analysez 5 concurrents et que RD = 4, il pointe vers 4 d&apos;entre eux.
                <div className="bg-primary/10 dashboard-text-xs mt-2 rounded p-2">
                  <strong>Bon signe :</strong> RD élevé = site très connecté à votre niche
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">Top Extensions (TLD)</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                Les extensions de domaine des sites référents (.com, .fr, .org...). Indique la diversité et la qualité
                des backlinks. Les .edu et .gov sont très valorisés.
                <div className="bg-primary/10 dashboard-text-xs mt-2 rounded p-2">
                  <strong>Préférez :</strong> .com, .org, .edu, .gov pour plus d&apos;autorité
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">Détail par Target</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                Affiche pour chaque concurrent le nombre de backlinks (BL) et de domaines référents (RD) provenant de ce
                site. Utile pour voir qui reçoit le plus de liens.
                <div className="bg-primary/10 dashboard-text-xs mt-2 rounded p-2">
                  <strong>Exemple :</strong> nike.com : 40 BL • 2 RD
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-primary bg-primary/5 border-l-4">
              <AlertTitle className="dashboard-heading-4">Domaine Référent</AlertTitle>
              <AlertDescription className="dashboard-body-sm text-muted-foreground">
                Le site qui fait les backlinks vers vos concurrents. C&apos;est LUI que vous devez contacter ! Vérifiez
                son autorité de domaine et sa pertinence thématique.
                <div className="bg-primary/10 dashboard-text-xs mt-2 rounded p-2">
                  <strong>Vérifiez :</strong> Autorité, trafic, thématique avant de contacter
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Stratégies d'utilisation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-2">3 Stratégies pour maximiser vos résultats</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stratégie 1 */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  1
                </div>
                <h3 className="dashboard-heading-3">Priorisez les intersections élevées</h3>
              </div>
              <p className="dashboard-body-sm text-muted-foreground mb-3">
                Commencez par contacter les sites qui pointent vers{' '}
                <strong className="text-foreground">4 ou 5 de vos concurrents</strong>. Ce sont les opportunités les
                plus chaudes avec le meilleur taux de conversion.
              </p>
              <Card className="bg-card">
                <CardContent className="p-3">
                  <p className="dashboard-body-sm">
                    <strong>Exemple d&apos;email :</strong>
                    <br />
                    <em className="text-muted-foreground">
                      &quot;Bonjour, j&apos;ai remarqué que vous avez publié des articles sur Nike, Adidas et Asics.
                      J&apos;ai créé un guide complet sur [votre sujet] qui pourrait intéresser votre audience...&quot;
                    </em>
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Stratégie 2 */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  2
                </div>
                <h3 className="dashboard-heading-3">Analysez le contexte des backlinks</h3>
              </div>
              <p className="dashboard-body-sm text-muted-foreground mb-3">
                Avant de contacter un site, visitez-le et regardez{' '}
                <strong className="text-foreground">dans quel contexte</strong> il a fait des liens vers vos concurrents
                : article de blog, comparatif, liste de ressources...
              </p>
              <div className="space-y-2">
                <div className="dashboard-body-sm flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  <span>
                    <strong className="text-foreground">Liste de ressources</strong> → Proposez d&apos;être ajouté
                  </span>
                </div>
                <div className="dashboard-body-sm flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  <span>
                    <strong className="text-foreground">Article de blog</strong> → Suggérez votre contenu comme source
                    complémentaire
                  </span>
                </div>
                <div className="dashboard-body-sm flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  <span>
                    <strong className="text-foreground">Comparatif</strong> → Demandez à être inclus dans la comparaison
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stratégie 3 */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                  3
                </div>
                <h3 className="dashboard-heading-3">Créez du contenu irrésistible</h3>
              </div>
              <p className="dashboard-body-sm text-muted-foreground mb-3">
                Ces sites ont déjà prouvé qu&apos;ils créent des liens vers du contenu de qualité dans votre secteur.
                Pour maximiser vos chances, proposez du contenu{' '}
                <strong className="text-foreground">encore meilleur</strong> que celui de vos concurrents.
              </p>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <Card className="bg-card text-center">
                  <CardContent className="p-3">
                    <strong className="dashboard-body-sm">Données exclusives</strong>
                    <p className="dashboard-text-xs text-muted-foreground">Études, statistiques originales</p>
                  </CardContent>
                </Card>
                <Card className="bg-card text-center">
                  <CardContent className="p-3">
                    <strong className="dashboard-body-sm">Visuels attractifs</strong>
                    <p className="dashboard-text-xs text-muted-foreground">Infographies, schémas, vidéos</p>
                  </CardContent>
                </Card>
                <Card className="bg-card text-center">
                  <CardContent className="p-3">
                    <strong className="dashboard-body-sm">Valeur unique</strong>
                    <p className="dashboard-text-xs text-muted-foreground">Angle inédit, expertise pointue</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Exemple concret */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="text-primary h-6 w-6" />
            <CardTitle className="dashboard-heading-2">Exemple concret d&apos;utilisation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Scénario :</h4>
              <p className="dashboard-body-sm text-muted-foreground">
                Vous êtes un e-commerce de chaussures de trail. Vous analysez 4 concurrents : Salomon, Hoka, La
                Sportiva, Altra.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Résultat de l&apos;outil :</h4>
              <div className="space-y-2">
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="flex items-center justify-between p-2">
                    <span className="dashboard-body-sm font-medium">trailrunning-magazine.fr</span>
                    <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-bold">
                      4/4 targets
                    </span>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-accent/30">
                  <CardContent className="flex items-center justify-between p-2">
                    <span className="dashboard-body-sm font-medium">outdoor-blog.com</span>
                    <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-bold">
                      3/4 targets
                    </span>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-accent/20">
                  <CardContent className="flex items-center justify-between p-2">
                    <span className="dashboard-body-sm font-medium">montagne-passion.fr</span>
                    <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-bold">
                      2/4 targets
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <h4 className="dashboard-heading-4 mb-2">Action à prendre :</h4>
              <ol className="dashboard-body-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>
                    Contactez en priorité <strong className="text-foreground">trailrunning-magazine.fr</strong> (4/4)
                    avec un article exclusif sur le trail ultra-distance
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>
                    Proposez à <strong className="text-foreground">outdoor-blog.com</strong> de compléter leur
                    comparatif existant avec votre marque
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>
                    Créez une infographie sur &quot;Les meilleures chaussures par type de terrain&quot; et proposez-la à{' '}
                    <strong className="text-foreground">montagne-passion.fr</strong>
                  </span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Alert className="border-primary/30 bg-primary/10">
            <AlertDescription className="dashboard-body-sm font-bold">
              Résultat attendu : 3 backlinks de qualité en 2-3 semaines, au lieu de 50-100 emails cold outreach avec un
              taux de réponse de 2% !
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Eye,
  Globe,
  Link2,
  Server,
  Shield,
  TrendingUp,
  Wrench,
  XCircle,
} from 'lucide-react'
import { BacklinksContent } from './backlinks-content'

export default async function BacklinksPage() {
  return (
    <main className="container mx-auto min-h-screen space-y-6 px-4 py-8">
      {/* Hero Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl">
              <Link2 className="text-primary h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="dashboard-heading-1">Profil de Backlinks : Votre Carte d&apos;Identité SEO</h1>
              <p className="dashboard-body-lg mt-2">
                Obtenez une <strong>radiographie complète</strong> de votre profil de backlinks : nombre total de liens,
                domaines référents, qualité, santé, géographie, et <strong>problèmes à corriger</strong>. C&apos;est
                l&apos;outil indispensable pour évaluer la <strong>force SEO</strong> de n&apos;importe quel domaine et
                identifier les actions prioritaires pour progresser.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BacklinksContent />

      {/* Métriques clés */}
      <Card>
        <CardHeader>
          <CardTitle className="dashboard-heading-3">Métriques Clés Analysées</CardTitle>
          <CardDescription>Indicateurs essentiels pour évaluer votre profil de backlinks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Backlinks */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Link2 className="text-primary h-5 w-5" />
                  <span className="dashboard-body-sm font-semibold">Total Backlinks</span>
                </div>
                <div className="dashboard-heading-2 mb-1">1 552 109</div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge color="green">100% dofollow</Badge>
                  <span className="text-muted-foreground text-xs">0 nofollow</span>
                </div>
                <p className="dashboard-text-xs text-muted-foreground">
                  Nombre total de liens pointant vers votre site. Les <strong>dofollow transmettent du jus SEO</strong>.
                </p>
              </CardContent>
            </Card>

            {/* Domaines Référents */}
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Globe className="text-accent h-5 w-5" />
                  <span className="dashboard-body-sm font-semibold">Domaines Référents</span>
                </div>
                <div className="dashboard-heading-2 mb-1">2 644</div>
                <div className="text-muted-foreground mb-2 text-xs">2 470 domaines principaux</div>
                <p className="dashboard-text-xs text-muted-foreground">
                  Nombre de <strong>sites uniques</strong> qui font des liens vers vous. C&apos;est la{' '}
                  <strong>métrique #1</strong> pour l&apos;autorité.
                </p>
              </CardContent>
            </Card>

            {/* Domain Rank */}
            <Card className="">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="dashboard-body-sm font-semibold">Domain Rank</span>
                </div>
                <div className="mb-1 flex items-baseline gap-2">
                  <div className="dashboard-heading-2">49</div>
                  <span className="text-muted-foreground text-sm">/100</span>
                  <Badge color="green">Bon</Badge>
                </div>
                <p className="dashboard-text-xs text-muted-foreground">
                  Score d&apos;autorité de votre domaine. <strong>0-30 :</strong> faible, <strong>31-50 :</strong>{' '}
                  moyen, <strong>51-70 :</strong> bon, <strong>71+ :</strong> excellent.
                </p>
              </CardContent>
            </Card>

            {/* Spam Score */}
            <Card className="">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span className="dashboard-body-sm font-semibold">Spam Score</span>
                </div>
                <div className="mb-1 flex items-baseline gap-2">
                  <div className="dashboard-heading-2">19</div>
                  <span className="text-muted-foreground text-sm">/100</span>
                  <Badge color="green">Faible</Badge>
                </div>
                <p className="dashboard-text-xs text-muted-foreground">
                  Niveau de liens toxiques ou spam. <strong>0-30 :</strong> bon, <strong>31-60 :</strong> moyen,{' '}
                  <strong>61+ :</strong> dangereux (pénalité Google).
                </p>
              </CardContent>
            </Card>

            {/* Infrastructure */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Server className="text-primary h-5 w-5" />
                  <span className="dashboard-body-sm font-semibold">Diversité IPs</span>
                </div>
                <div className="mb-1 flex items-center gap-3">
                  <div>
                    <div className="dashboard-heading-3">2 055</div>
                    <div className="text-muted-foreground text-xs">IPs uniques</div>
                  </div>
                  <div>
                    <div className="dashboard-heading-3">1 394</div>
                    <div className="text-muted-foreground text-xs">Sous-réseaux</div>
                  </div>
                </div>
                <p className="dashboard-text-xs text-muted-foreground">
                  Grande diversité d&apos;IPs = <strong>profil naturel</strong> et non manipulé.
                </p>
              </CardContent>
            </Card>

            {/* Score de santé */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="dashboard-body-sm font-semibold">Score de Santé</span>
                </div>
                <div className="mb-1 flex items-baseline gap-2">
                  <div className="dashboard-heading-2">81</div>
                  <span className="text-muted-foreground text-sm">/100</span>
                  <Badge color="green">Excellent</Badge>
                </div>
                <p className="dashboard-text-xs text-muted-foreground">
                  Évaluation globale de la qualité de votre profil basée sur tous les indicateurs.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Problèmes détectés */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <CardTitle className="dashboard-heading-3">Problèmes Détectés & Actions Prioritaires</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Backlinks cassés */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="dashboard-body-sm font-semibold">1 746 Backlinks cassés</span>
                </div>
                <Badge color="red">URGENT</Badge>
              </div>
              <p className="dashboard-body-sm mb-3">
                1 746 sites font des liens vers des pages qui <strong>n&apos;existent plus</strong> (erreur 404/500).
                Ces liens ne transmettent <strong>aucun jus SEO</strong>.
              </p>
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <div className="dashboard-body-sm mb-1 flex items-center gap-2 font-semibold">
                  <Wrench className="h-4 w-4" />
                  Actions recommandées :
                </div>
                <ul className="dashboard-text-xs space-y-1">
                  <li>
                    • <strong>Créez des redirections 301</strong> depuis les URLs cassées vers les pages appropriées
                  </li>
                  <li>
                    • <strong>Contactez les webmasters</strong> pour qu&apos;ils mettent à jour les liens
                  </li>
                  <li>
                    • <strong>Restaurez le contenu</strong> si la page avait beaucoup de backlinks
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pages cassées */}
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="dashboard-body-sm font-semibold">82 Pages cassées</span>
                </div>
                <Badge color="orange">IMPORTANT</Badge>
              </div>
              <p className="dashboard-body-sm mb-2">
                82 pages de votre site renvoient des erreurs. Mauvaise expérience utilisateur et pénalité SEO
                potentielle.
              </p>
              <div className="dashboard-text-xs text-muted-foreground">
                <strong>Action :</strong> Réparez les pages importantes (avec backlinks) ou créez des redirections 301.
              </div>
            </CardContent>
          </Card>

          {/* Spam backlinks */}
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="dashboard-body-sm font-semibold">Spam backlinks : 20 points</span>
                </div>
                <Badge color="green">BON</Badge>
              </div>
              <p className="dashboard-body-sm">
                Excellent ! Vos backlinks proviennent de <strong>sources fiables</strong>. Continuez à éviter les fermes
                de liens et les sites douteux.
              </p>
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="dashboard-body-sm font-semibold">Impact SEO</AlertTitle>
            <AlertDescription className="dashboard-text-xs">
              <p>
                Corriger ces problèmes peut récupérer <strong>jusqu&apos;à 20% de jus SEO perdu</strong> et améliorer
                significativement votre ranking !
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Géographie & Diversité */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Géographie */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="text-primary h-5 w-5" />
              <CardTitle className="dashboard-heading-4">Géographie des Backlinks</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <span className="text-sm">🇩🇪</span>
              </div>
              <div className="flex-1">
                <div className="dashboard-text-xs mb-1 flex items-center justify-between">
                  <span className="font-medium">Allemagne</span>
                  <span className="font-bold">71%</span>
                </div>
                <Progress value={71} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <span className="text-sm">🌍</span>
              </div>
              <div className="flex-1">
                <div className="dashboard-text-xs mb-1 flex items-center justify-between">
                  <span className="font-medium">Inconnu</span>
                  <span className="font-bold">19.3%</span>
                </div>
                <Progress value={19.3} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <span className="text-sm">🇺🇸</span>
              </div>
              <div className="flex-1">
                <div className="dashboard-text-xs mb-1 flex items-center justify-between">
                  <span className="font-medium">États-Unis</span>
                  <span className="font-bold">0.1%</span>
                </div>
                <Progress value={0.1} className="h-2" />
              </div>
            </div>
            <Alert className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="dashboard-text-xs">
                Si vous ciblez la France mais 90% de vos BL viennent d&apos;Allemagne, cela peut limiter votre ranking
                en France.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Types de plateformes */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="text-accent h-5 w-5" />
              <CardTitle className="dashboard-heading-4">Types de Plateformes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-2">
              <span className="dashboard-body-sm">Organizations</span>
              <Badge color="zinc">819k (52.8%)</Badge>
            </div>
            <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-2">
              <span className="dashboard-body-sm">Blogs</span>
              <Badge color="zinc">5.7k (0.4%)</Badge>
            </div>
            <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-2">
              <span className="dashboard-body-sm">CMS (WordPress...)</span>
              <Badge color="zinc">5k (0.3%)</Badge>
            </div>
            <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-2">
              <span className="dashboard-body-sm">News</span>
              <Badge color="zinc">1.3k (0.1%)</Badge>
            </div>
            <Alert className="mt-3">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="dashboard-text-xs">
                Diversité = profil naturel. Si 100% viennent de forums/répertoires → suspect pour Google.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Conseil final */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <TrendingUp className="text-primary h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="dashboard-heading-4 mb-3">Stratégie d&apos;Amélioration en 3 Étapes</h4>
              <ol className="dashboard-body-sm space-y-2">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>
                    <strong>Correction urgente :</strong> Fixez les 1 746 backlinks cassés et les 82 pages en erreur
                    (redirections 301)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>
                    <strong>Acquisition stratégique :</strong> Visez des domaines avec Domain Rank &gt; 40 et Spam Score
                    &lt; 30
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>
                    <strong>Surveillance :</strong> Vérifiez mensuellement les nouveaux backlinks/perdus et le Spam
                    Score
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

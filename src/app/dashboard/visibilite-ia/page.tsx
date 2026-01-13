import { Card, CardContent } from '@/components/ui/card'
import { Award, Brain, Lightbulb, Target, TrendingUp, Zap } from 'lucide-react'
import FormAi from './formAi'

export default function VisibiliteIAPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 py-8 pb-12">
      {/* Hero Section - Amélioré */}
      <Card className="border-primary/20 from-primary/5 dark:from-primary/10 relative overflow-hidden bg-gradient-to-br via-purple-50/50 to-pink-50/50 shadow-lg dark:via-purple-950/20 dark:to-pink-950/20">
        <CardContent className="relative p-8 lg:p-10">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-lg lg:h-20 lg:w-20">
              <Brain className="h-8 w-8 text-white lg:h-10 lg:w-10" />
            </div>
            <div className="flex-1 space-y-3">
              <h1 className="dashboard-heading-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-300">
                Optimisez votre visibilité dans l&apos;ère de l&apos;Intelligence Artificielle
              </h1>
              <p className="dashboard-body-lg text-muted-foreground max-w-3xl leading-relaxed">
                L&apos;AIO (AI Optimization) est le nouveau SEO. Analysez comment les IA comme ChatGPT, Claude et
                Perplexity citent votre contenu et optimisez votre stratégie pour la recherche conversationnelle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <FormAi />

      <div className="space-y-8">
        {/* Introduction AIO - Design amélioré */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-violet-200/60 bg-gradient-to-br from-violet-50/80 via-purple-50/80 to-pink-50/80 p-6 shadow-md backdrop-blur-sm lg:p-8 dark:border-violet-800/40 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)] opacity-50" />
          {/* Stats rapides */}
          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-violet-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-violet-800/40 dark:bg-gray-900/50">
              <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">LLMs Analysés</div>
              <div className="mt-1 text-sm font-bold text-violet-600 dark:text-violet-400">
                ChatGPT, Claude, Perplexity
              </div>
            </div>

            <div className="rounded-xl border border-purple-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-purple-800/40 dark:bg-gray-900/50">
              <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">Évolution Majeure</div>
              <div className="mt-1 text-sm font-bold text-purple-600 dark:text-purple-400">
                50% des recherches en 2026
              </div>
            </div>

            <div className="rounded-xl border border-pink-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-pink-800/40 dark:bg-gray-900/50">
              <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">Nouveau Critère</div>
              <div className="mt-1 text-sm font-bold text-pink-600 dark:text-pink-400">Citations IA = Position #1</div>
            </div>
          </div>
        </div>

        {/* Pourquoi l'AIO est crucial - Design amélioré */}
        <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
          <CardContent className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <h3 className="dashboard-heading-3 text-gray-900 dark:text-gray-100">
                Pourquoi l&apos;optimisation pour l&apos;IA est cruciale en 2026 ?
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Point 1 */}
              <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-transparent p-5 dark:border-blue-900/30 dark:from-blue-950/20">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    L&apos;évolution du comportement de recherche
                  </h4>
                </div>
                <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                    <span>
                      50% des recherches passeront par des assistants IA en 2026 (ChatGPT, Perplexity, Bing Chat) selon
                      Gartner.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                    <span>
                      Les utilisateurs posent des questions naturelles et longues au lieu de taper des mots-clés courts.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                    <span>
                      Les réponses IA remplacent progressivement le clic vers les sites web (zero-click search
                      amplifié).
                    </span>
                  </li>
                </ul>
              </div>

              {/* Point 2 */}
              <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-transparent p-5 dark:border-purple-900/30 dark:from-purple-950/20">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    Les citations IA deviennent le nouveau ranking
                  </h4>
                </div>
                <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
                    <span>
                      Être cité par ChatGPT ou Perplexity devient aussi crucial que ranker #1 sur Google en termes de
                      visibilité.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
                    <span>
                      Les sites non cités par les IA perdront jusqu&apos;à 70% de leur trafic organique d&apos;ici 2027.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
                    <span>
                      La fréquence de citation détermine votre &quot;share of voice&quot; dans l&apos;espace
                      conversationnel.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Point 3 */}
              <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50/50 to-transparent p-5 dark:border-green-900/30 dark:from-green-950/20">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    L&apos;E-E-A-T devient 10x plus important
                  </h4>
                </div>
                <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600 dark:bg-green-400" />
                    <span>
                      Les IA privilégient massivement les sites avec expertise démontrée, données originales et sources
                      vérifiables.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600 dark:bg-green-400" />
                    <span>
                      Contenu structuré (FAQ, listes, tableaux), auteurs identifiés et dates de mise à jour sont
                      indispensables.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600 dark:bg-green-400" />
                    <span>
                      Les sites avec E-E-A-T faible sont systématiquement ignorés par les LLMs, même avec bon ranking
                      Google.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Point 4 */}
              <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50/50 to-transparent p-5 dark:border-orange-900/30 dark:from-orange-950/20">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/40">
                    <Lightbulb className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    Anticipez maintenant pour un avantage compétitif
                  </h4>
                </div>
                <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-600 dark:bg-orange-400" />
                    <span>
                      Les sites qui optimisent dès aujourd&apos;hui pour l&apos;AIO auront un avantage de 12-18 mois sur
                      leurs concurrents.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-600 dark:bg-orange-400" />
                    <span>
                      Il faut 6-12 mois pour que les LLMs intègrent vos nouvelles sources dans leurs bases de
                      connaissances.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-600 dark:bg-orange-400" />
                    <span>
                      Créer du contenu AIO-optimized maintenant = dominer votre niche dans la recherche
                      conversationnelle de demain.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guide rapide d'optimisation - Design amélioré */}
        <Card className="relative overflow-hidden border-2 border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 via-indigo-50/70 to-purple-50/50 shadow-lg dark:border-indigo-800/40 dark:from-indigo-950/40 dark:via-indigo-950/30 dark:to-purple-950/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent)]" />
          <CardContent className="relative p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <h3 className="dashboard-heading-3 text-indigo-900 dark:text-indigo-100">
                5 Actions Concrètes pour Optimiser Votre Contenu pour l&apos;IA
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
              {[
                {
                  num: 1,
                  title: 'Structurez en Questions-Réponses',
                  desc: 'Format FAQ, listes numérotées, tableaux comparatifs, définitions concises. Les IA adorent extraire et citer les contenus structurés.',
                },
                {
                  num: 2,
                  title: 'Apportez des Données Originales',
                  desc: 'Créez des études, sondages, statistiques uniques. Les IA citent massivement les sources avec données vérifiables et chiffrées (10x plus que le contenu générique).',
                },
                {
                  num: 3,
                  title: 'Démontrez Votre Expertise (E-E-A-T)',
                  desc: "Auteurs identifiés avec bio, sources citées, dates de publication/mise à jour visibles, témoignages clients. Plus l'expertise est visible, plus les IA font confiance.",
                },
                {
                  num: 4,
                  title: 'Langage Naturel et Conversationnel',
                  desc: 'Écrivez comme vous parlez. Optimisez pour "Comment faire X ?" plutôt que "faire X". Les requêtes IA sont plus longues et naturelles que sur Google.',
                },
                {
                  num: 5,
                  title: 'Mise à Jour Régulière et Récence',
                  desc: 'Les IA privilégient les contenus récents (6-12 derniers mois). Ajoutez des dates de publication et "Mis à jour le [date]" bien visibles. Actualisez vos stats et exemples.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-xl border border-indigo-100/80 bg-white/80 p-4 backdrop-blur-sm dark:border-indigo-900/40 dark:bg-gray-900/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-bold text-white shadow-md">
                    {item.num}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h4>
                    <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Warning box - Design amélioré */}
        <Card className="relative overflow-hidden border-l-4 border-amber-500 bg-gradient-to-r from-amber-50 via-amber-50/90 to-orange-50/50 shadow-lg dark:border-amber-600 dark:from-amber-950/40 dark:via-amber-950/30 dark:to-orange-950/30">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,158,11,0.1),transparent)]" />
          <CardContent className="relative p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <strong className="block text-base font-bold text-amber-900 dark:text-amber-100">
                  Point de bascule imminent :
                </strong>
                <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
                  Nous sommes à un point de bascule historique. Les premiers sites qui maîtriseront l&apos;AIO
                  domineront leur niche dans l&apos;ère post-Google. Ne ratez pas cette transition comme certains ont
                  raté celle du mobile en 2010 ou du SEO en 2005. Les outils ci-dessous vous permettent d&apos;analyser
                  votre visibilité IA et celle de vos concurrents{' '}
                  <strong className="font-semibold">dès maintenant</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

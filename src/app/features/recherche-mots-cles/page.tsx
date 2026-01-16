import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { Screenshot } from '@/components/elements/screenshot'
import { Section } from '@/components/elements/section'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { CallToActionSimpleCentered } from '@/components/sections/call-to-action-simple-centered'
import { FAQsTwoColumnAccordion, Faq } from '@/components/sections/faqs-two-column-accordion'
import { Feature, FeaturesThreeColumn } from '@/components/sections/features-three-column'
import { HeroLeftAlignedWithDemo } from '@/components/sections/hero-left-aligned-with-demo'
import {
  BarChart3,
  Brain,
  CheckCircle2,
  DollarSign,
  Eye,
  FileQuestion,
  Link2,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Outil de Recherche de Mots-Clés SEO | 213M+ Keywords | Essai Gratuit 7 Jours',
  description:
    "Découvrez l'outil de recherche de mots-clés le plus puissant pour le marché français. 213M+ keywords, volume exact, difficulté et analyse concurrentielle.",
  keywords: [
    'recherche de mots cles',
    'mots cles seo',
    'trouver des mots cles',
    'outil mots cles',
    'mots cles longue traine',
    'analyse sémantique',
  ],
}

export default function RechercheMotsClesPage() {
  return (
    <>
      <Main>
        {/* Hero Section */}
        <HeroLeftAlignedWithDemo
          id="hero"
          eyebrow={<AnnouncementBadge href="/pricing" text="Nouveau : 213M+ Mots-Clés Français" cta="Voir l'offre" />}
          headline="Recherche de Mots-Clés SEO — L'Outil Professionnel pour Dominer votre Thématique"
          subheadline={
            <>
              <p>
                Vous ne savez pas sur quels <strong>mots-clés</strong> vous positionner pour attirer du trafic qualifié
                ? Vous en avez assez des outils qui donnent des volumes imprécis ou des données incomplètes ?
              </p>
              <p>
                Accédez à <strong>SerpEditor</strong>, la plateforme de <strong>recherche de mots-clés</strong> dotée de
                la plus grande base de données française (213M+ keywords). Identifiez les opportunités rentables,
                analysez vos concurrents et construisez une stratégie de contenu qui génère réellement des ventes.
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Démarrer mon essai gratuit de 7 jours (sans CB)
              </ButtonLink>
              <PlainButtonLink href="#features" size="lg">
                Découvrir les fonctionnalités <ArrowNarrowRightIcon />
              </PlainButtonLink>
            </div>
          }
          demo={
            <Screenshot className="rounded-lg" wallpaper="blue" placement="bottom">
              <Image
                className="bg-black/75 not-dark:hidden"
                src="/recherche-mot-cle.webp"
                alt="Outil de recherche de mots-clés SEO - Interface SerpEditor"
                width={1800}
                height={1250}
                priority
              />
              <Image
                className="bg-white/75 dark:hidden"
                src="/recherche-mot-cle.webp"
                alt="Outil de recherche de mots-clés SEO - Interface SerpEditor"
                width={1800}
                height={1250}
                priority
              />
            </Screenshot>
          }
          footer={
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-mist-700 dark:text-mist-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Accès illimité à la base 213M+</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Inscription en 30s</span>
              </div>
            </div>
          }
        />

        {/* CTA Section */}
        <Section id="cta-hero" className="bg-primary/5">
          <div className="flex flex-col items-center gap-6 text-center">
            <Subheading>Prenez des décisions basées sur la Data, pas sur l&apos;intuition</Subheading>
            <Text className="max-w-2xl">
              Accédez à l&apos;intégralité de nos outils de recherche et d&apos;analyse.
            </Text>
            <ButtonLink href="/register" size="lg">
              Démarrer mon essai gratuit de 7 jours (sans CB)
            </ButtonLink>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-mist-600 dark:text-mist-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Accès illimité à la base 213M+</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Inscription en 30s</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Features Section */}
        <Section id="features">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Des fonctionnalités conçues pour les experts SEO</Subheading>
              <Text className="mx-auto max-w-3xl">
                Notre module de <strong>recherche de mots-clés</strong> se divise en trois outils complémentaires pour
                couvrir 100% de vos besoins stratégiques.
              </Text>
            </div>

            <FeaturesThreeColumn
              features={
                <>
                  <Feature
                    icon={<BarChart3 className="h-5 w-5" />}
                    headline="1. Vue d'ensemble des mots-clés : Analysez en profondeur"
                    subheadline={
                      <>
                        <p>
                          Obtenez une vue à 360° de n&apos;importe quel mot-clé pour valider son potentiel avant
                          d&apos;investir du temps en rédaction.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <BarChart3 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Analyse complète</strong> : Volume de recherche exact, tendances mensuelles et CPC
                              moyen.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Brain className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Intention de recherche</strong> : Notre algorithme identifie si l&apos;utilisateur
                              veut s&apos;informer ou acheter.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Difficulté SEO</strong> : Un score précis pour savoir si vous pouvez réellement
                              atteindre le Top 10.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Link2 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Métriques SERP</strong> : Backlinks moyens des concurrents et fonctionnalités
                              affichées par Google (Images, PAA, Snippets).
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<Sparkles className="h-5 w-5" />}
                    headline="2. Générateur de mots-clés : Découvrez des Milliers d'Opportunités"
                    subheadline={
                      <>
                        <p>
                          Partez d&apos;un simple mot-clé de départ (seed keyword) et générez automatiquement des
                          centaines d&apos;idées connexes.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <Zap className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Mots-clés longue traîne</strong> : Identifiez les requêtes de 3+ mots, moins
                              concurrentielles et ultra-rentables.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <FileQuestion className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Questions des internautes</strong> : Trouvez toutes les questions posées sur
                              Google pour alimenter votre blog.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Rocket className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Stratégie de contenu</strong> : Construisez des clusters thématiques cohérents
                              pour devenir une autorité aux yeux de Google.
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<Eye className="h-5 w-5" />}
                    headline="3. Recherche de mots-clés organiques : Espionnez vos concurrents"
                    subheadline={
                      <>
                        <p>
                          Ne perdez plus de temps à chercher : voyez simplement ce qui fonctionne déjà pour les autres.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <Search className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Analyse URL</strong> : Entrez le domaine d&apos;un concurrent et récupérez la
                              liste de tous ses mots-clés.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Gaps de mots-clés</strong> : Identifiez les opportunités que vos concurrents ont
                              saisies et que vous avez manquées.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <DollarSign className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Trafic estimé</strong> : Visualisez les pages qui rapportent le plus de clics à
                              vos rivaux.
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />
                </>
              }
            />
          </div>
        </Section>

        {/* How to find keywords */}
        <Section id="how-to" className="bg-mist-50 dark:bg-mist-950/50">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Comment trouver les bons mots-clés SEO ?</Subheading>
              <Text className="mx-auto max-w-3xl">
                La <strong>recherche de mots-clés</strong> réussie repose sur un équilibre entre volume, difficulté et
                pertinence. Pour trouver les meilleurs termes :
              </Text>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Search className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">1. Utilisez notre générateur</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Listez toutes les variations autour de votre thématique.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Target className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">2. Filtrez par difficulté</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Si votre site est récent, ciblez des mots-clés &quot;Low Difficulty&quot; (0-30).
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Brain className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">3. Vérifiez l&apos;intention</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Assurez-vous que votre page répond exactement à ce que l&apos;internaute cherche (info ou achat).
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">4. Misez sur la longue traîne</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Ces mots-clés convertissent 3x plus que les termes génériques.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Main keyword explanation */}
        <Section>
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-6">
              <Subheading>Quel est le mot-clé principal en SEO ?</Subheading>
              <Text>
                Le <strong>mot-clé principal</strong> est la requête pilier pour laquelle vous optimisez une page
                spécifique. C&apos;est le terme qui doit figurer dans votre balise Title, votre H1 et votre URL.
              </Text>
              <Text>
                Grâce à notre outil de <strong>vue d&apos;ensemble</strong>, vous pouvez comparer plusieurs termes pour
                choisir le mot-clé principal qui a le meilleur rapport <strong>Volume / Difficulté</strong>.
              </Text>
            </div>
          </div>
        </Section>

        {/* Comparison Table */}
        <Section id="comparison" className="bg-mist-50 dark:bg-mist-950/50">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Pourquoi choisir SerpEditor pour vos analyses ?</Subheading>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-mist-200 dark:border-mist-800">
                    <th className="px-6 py-4 text-left font-semibold">Fonctionnalité</th>
                    <th className="px-6 py-4 text-center font-semibold">Google Keyword Planner</th>
                    <th className="px-6 py-4 text-center font-semibold">Concurrents (SE Ranking, etc.)</th>
                    <th className="text-primary px-6 py-4 text-center font-semibold">SerpEditor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Volume de recherche</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">Fourchettes floues</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Difficulté SEO</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌ Non</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Intention de recherche</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌ Non</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Base de données FR</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">Limitée</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">~100M</td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">213M+ (Record)</td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Essai Gratuit</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌ Limité</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Prix / Mois</td>
                    <td className="px-6 py-4 text-center font-semibold">0€</td>
                    <td className="px-6 py-4 text-center font-semibold">50€ - 120€</td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">39€ (Pack Complet)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* FAQs */}
        <FAQsTwoColumnAccordion
          id="faqs"
          headline="Questions fréquentes"
          subheadline={<p>Tout ce que vous devez savoir sur notre outil de recherche de mots-clés</p>}
        >
          <Faq
            question="Puis-je utiliser le générateur de mots-clés gratuitement ?"
            answer={
              <>
                <p>
                  Pour garantir la fraîcheur de nos données et la puissance de nos serveurs, l&apos;accès complet
                  nécessite un compte. Vous pouvez toutefois bénéficier de <strong>7 jours d&apos;essai gratuit</strong>{' '}
                  pour tester toutes les fonctionnalités (recherche, audit, backlinks) sans sortir votre carte bancaire.
                </p>
              </>
            }
          />
          <Faq
            question="C'est quoi un mot-clé de longue traîne ?"
            answer={
              <>
                <p>
                  Il s&apos;agit de requêtes de plus de 3 mots, très spécifiques (ex: &quot;recherche de mots cles pour
                  referencement immobilier&quot;). Ils ont moins de volume mais une concurrence plus faible et un taux
                  de conversion bien plus élevé.
                </p>
              </>
            }
          />
          <Faq
            question="Comment est calculée la difficulté des mots-clés ?"
            answer={
              <>
                <p>
                  Nous analysons la force des 10 premiers résultats Google : autorité du domaine, nombre de backlinks et
                  qualité du contenu. Cela vous donne un score de 0 à 100 pour évaluer vos chances de ranker.
                </p>
              </>
            }
          />
        </FAQsTwoColumnAccordion>

        {/* Final CTA */}
        <CallToActionSimpleCentered
          id="final-cta"
          headline="Prêt à transformer votre SEO ?"
          subheadline={
            <>
              <p>
                Ne laissez plus vos concurrents prendre les meilleures places sur Google. Utilisez l&apos;outil de{' '}
                <strong>recherche de mots-clés</strong> le plus complet du marché français.
              </p>
            </>
          }
          cta={
            <div className="flex flex-col items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Démarrer mon essai gratuit (Sans CB)
              </ButtonLink>
              <Text className="text-sm text-mist-600 dark:text-mist-500">
                Accès complet à la base de 213M+ mots-clés - Recherche de concurrents - Audit technique - Suivi de
                positions
              </Text>
              <Text className="text-sm text-mist-600 dark:text-mist-500">
                Déjà client ? <PlainButtonLink href="/login">Connectez-vous ici</PlainButtonLink>
              </Text>
            </div>
          }
        />
      </Main>
    </>
  )
}

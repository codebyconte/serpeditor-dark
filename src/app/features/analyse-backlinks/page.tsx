import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { Screenshot } from '@/components/elements/screenshot'
import { Section } from '@/components/elements/section'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import { CallToActionSimpleCentered } from '@/components/sections/call-to-action-simple-centered'
import { FAQsAccordion, Faq } from '@/components/sections/faqs-accordion'
import { Feature, FeaturesThreeColumn } from '@/components/sections/features-three-column'
import {
  FooterCategory,
  FooterLink,
  FooterWithNewsletterFormCategoriesAndSocialIcons,
  NewsletterForm,
  SocialLink,
} from '@/components/sections/footer-with-newsletter-form-categories-and-social-icons'
import { HeroCenteredWithDemo } from '@/components/sections/hero-centered-with-demo'
import {
  NavbarLink,
  NavbarLogo,
  NavbarWithLinksActionsAndCenteredLogo,
} from '@/components/sections/navbar-with-links-actions-and-centered-logo'
import {
  AlertTriangle,
  Anchor,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Link2,
  Search,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: "Analyse de Backlinks Gratuit — Vérifiez le Netlinking de n'importe quel site",
  description:
    "Outil complet d'analyse de backlinks : domaines référents, ancres, liens nouveaux et perdus. Surveillez votre netlinking et celui de vos concurrents avec SerpEditor.",
  keywords: [
    'analyse de backlinks',
    'check backlinks',
    'backlinks checker',
    'domaines référents',
    'ancres de liens',
    'nouveaux backlinks',
    'netlinking',
  ],
}

export default function AnalyseBacklinksPage() {
  return (
    <>
      <NavbarWithLinksActionsAndCenteredLogo
        id="navbar"
        links={
          <>
            <NavbarLink href="/features">Fonctionnalités</NavbarLink>
            <NavbarLink href="/pricing">Tarifs</NavbarLink>
            <NavbarLink href="/blog">Blog</NavbarLink>
            <NavbarLink href="/login" className="sm:hidden">
              Connexion
            </NavbarLink>
          </>
        }
        logo={
          <NavbarLogo href="/">
            <Image src="/serpeditor.svg" alt="SerpEditor Outil SEO" className="dark:hidden" width={85} height={28} />
            <Image
              src="/serpeditor-white.svg"
              alt="SerpEditor Outil SEO"
              className="not-dark:hidden"
              width={85}
              height={28}
            />
          </NavbarLogo>
        }
        actions={
          <>
            <PlainButtonLink href="/login" className="max-sm:hidden">
              Connexion
            </PlainButtonLink>
            <ButtonLink href="/register">Essai Gratuit</ButtonLink>
          </>
        }
      />
      <Main>
        {/* Hero Section */}
        <HeroCenteredWithDemo
          id="hero"
          eyebrow={
            <AnnouncementBadge
              href="/pricing"
              text="Nouveau : 2,8 Trillions de Backlinks Analysés"
              cta="Voir l'offre"
            />
          }
          headline="Analyse de Backlinks — Le Vérificateur de Liens le plus Complet"
          subheadline={
            <>
              <p>
                Vous voulez savoir qui fait des liens vers votre site ou celui de vos concurrents ?{' '}
                <strong>L&apos;analyse de backlinks est le pilier central du SEO off-page.</strong> Sans une vision
                claire de votre profil de liens, vous naviguez à l&apos;aveugle.
              </p>
              <p>
                Découvrez <strong>SerpEditor</strong>, l&apos;outil d&apos;<strong>analyse de backlinks</strong> qui
                vous donne accès à une base de données mondiale de <strong>2,8 trillions de liens</strong>. Identifiez
                vos liens toxiques, découvrez les stratégies de vos concurrents et boostez votre autorité de domaine
                (Domain Rating).
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Essayer gratuitement pendant 7 jours
              </ButtonLink>
              <PlainButtonLink href="/features" size="lg">
                Découvrir les fonctionnalités <ArrowNarrowRightIcon />
              </PlainButtonLink>
            </div>
          }
          demo={
            <Screenshot className="rounded-lg" wallpaper="purple" placement="bottom">
              <Image
                className="bg-black/75 not-dark:hidden"
                src="/backlinks.webp"
                alt="Outil d'analyse de backlinks et netlinking - Interface SerpEditor"
                width={1800}
                height={1250}
                priority
              />
              <Image
                className="bg-white/75 dark:hidden"
                src="/backlinks.webp"
                alt="Outil d'analyse de backlinks et netlinking - Interface SerpEditor"
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
                <span>2,8 Trillions de liens</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Mis à jour toutes les 15 min</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Essai gratuit 7 jours (Sans CB)</span>
              </div>
            </div>
          }
        />

        {/* Features Section */}
        <Section id="features">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Un module d&apos;analyse de backlinks à 360°</Subheading>
              <Text className="mx-auto max-w-3xl">
                Notre outil ne se contente pas de lister les liens. Il fournit une suite complète de rapports pour une
                maîtrise totale de votre netlinking.
              </Text>
            </div>

            <FeaturesThreeColumn
              features={
                <>
                  <Feature
                    icon={<BarChart3 className="h-5 w-5" />}
                    headline="1. Vue d'ensemble du Netlinking"
                    subheadline={
                      <>
                        <p>
                          Obtenez un tableau de bord instantané de la force d&apos;un domaine pour évaluer rapidement
                          son autorité.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Domain Rating (DR)</strong> : Notre score d&apos;autorité basé sur la qualité et
                              quantité des liens.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Globe className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Nombre de domaines référents</strong> : Le nombre de sites uniques qui vous font
                              un lien.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Link2 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Nombre total de backlinks</strong> : Volume global de liens pointant vers vous.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Trafic organique estimé</strong> : Voyez si les sites qui vous lient ont eux-mêmes
                              du trafic.
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<Search className="h-5 w-5" />}
                    headline="2. Tous les Backlinks (Rapport détaillé)"
                    subheadline={
                      <>
                        <p>Plongez dans le détail de chaque lien entrant pour une analyse approfondie.</p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <Link2 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Type de lien</strong> : Dofollow vs Nofollow pour identifier la transmission
                              d&apos;autorité.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Status code</strong> : Liens actifs vs liens cassés (404) pour maintenir un profil
                              sain.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Globe className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Plateforme</strong> : Identifiez s&apos;il s&apos;agit d&apos;un blog, d&apos;un
                              forum ou d&apos;un annuaire.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>First seen / Last seen</strong> : Suivez la fraîcheur de chaque lien et détectez
                              les liens perdus.
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<Globe className="h-5 w-5" />}
                    headline="3. Domaines Référents"
                    subheadline={
                      <>
                        <p>
                          Analysez la qualité des sites qui vous citent pour optimiser votre stratégie de netlinking.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <BarChart3 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Liste des domaines uniques</strong> avec leur propre score d&apos;autorité pour
                              prioriser vos actions.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Target className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>IP et Subnets</strong> : Vérifiez la diversité de vos sources de liens pour éviter
                              les pénalités.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Globe className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Pays d&apos;origine</strong> : Votre netlinking est-il cohérent avec votre marché
                              ?
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<Anchor className="h-5 w-5" />}
                    headline="4. Analyse des Ancres de liens"
                    subheadline={
                      <>
                        <p>
                          Maîtrisez votre profil d&apos;ancres pour éviter les pénalités Google Penguin et optimiser
                          votre stratégie.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <BarChart3 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Répartition des ancres</strong> : Ancres de marque, ancres optimisées, ancres
                              génériques pour un profil équilibré.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Target className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Densité des mots-clés</strong> : Ne sur-optimisez pas vos textes de liens pour
                              rester naturel.
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<TrendingUp className="h-5 w-5" />}
                    headline="5. Liens Nouveaux et Perdus"
                    subheadline={
                      <>
                        <p>
                          Surveillez l&apos;évolution de votre netlinking en temps réel pour réagir rapidement aux
                          changements.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Nouveaux backlinks</strong> : Identifiez immédiatement qui vient de vous citer
                              pour capitaliser sur ces opportunités.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <TrendingDown className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Backlinks perdus</strong> : Réagissez vite si un partenaire retire un lien
                              précieux ou si une page devient cassée.
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

        {/* Why Backlinks Matter */}
        <Section id="why" className="bg-mist-50 dark:bg-mist-950/50">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Pourquoi l&apos;analyse de backlinks est cruciale en SEO ?</Subheading>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Shield className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">1. Les backlinks sont le signal de confiance #1 pour Google</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Google voit chaque lien comme un &quot;vote&quot; de confiance. Plus vous avez de{' '}
                  <strong>backlinks de qualité</strong> provenant de domaines autoritaires, plus Google considère votre
                  site comme fiable et le positionne en haut de la SERP.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <AlertTriangle className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">2. Identifier et supprimer les liens toxiques</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Tous les liens ne sont pas bons. Une <strong>analyse de backlinks</strong> régulière permet de
                  détecter les liens provenant de sites de spam ou de réseaux de sites (PBN) qui pourraient entraîner
                  une pénalité manuelle.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Eye className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">3. Découvrir les secrets de vos concurrents</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  L&apos;<strong>analyse de backlinks concurrentielle</strong> est la stratégie la plus rapide pour
                  obtenir des liens. Entrez l&apos;URL de votre concurrent, voyez quels sites lui font des liens, et
                  contactez ces mêmes sites.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* What makes a good backlink */}
        <Section>
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-6">
              <Subheading>Qu&apos;est-ce qu&apos;un bon backlink ? (Critères d&apos;analyse)</Subheading>
              <Text>
                Lors de votre <strong>check backlinks</strong>, notre outil évalue chaque lien selon{' '}
                <strong>4 critères fondamentaux</strong> :
              </Text>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="text-primary h-5 w-5" />
                    <h4 className="font-semibold">1. L&apos;Autorité (Domain Rating)</h4>
                  </div>
                  <p className="text-sm text-mist-700 dark:text-mist-400">
                    Un lien provenant du <em>Monde</em> ou de <em>Wikipedia</em> a 1000x plus de poids qu&apos;un lien
                    d&apos;un petit blog inconnu.
                  </p>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Target className="text-primary h-5 w-5" />
                    <h4 className="font-semibold">2. La Pertinence thématique</h4>
                  </div>
                  <p className="text-sm text-mist-700 dark:text-mist-400">
                    Si vous vendez des chaussures, un lien depuis un blog de mode est bien plus puissant qu&apos;un lien
                    depuis un site de cuisine.
                  </p>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Link2 className="text-primary h-5 w-5" />
                    <h4 className="font-semibold">3. Le Type de lien (Dofollow)</h4>
                  </div>
                  <p className="text-sm text-mist-700 dark:text-mist-400">
                    Seuls les liens &quot;Dofollow&quot; transmettent du &quot;jus SEO&quot; (autorité). Les liens
                    &quot;Nofollow&quot; (réseaux sociaux, commentaires) sont utiles pour le trafic mais moins pour le
                    ranking.
                  </p>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="text-primary h-5 w-5" />
                    <h4 className="font-semibold">4. Le Placement du lien</h4>
                  </div>
                  <p className="text-sm text-mist-700 dark:text-mist-400">
                    Un lien contextuel au milieu d&apos;un article a plus de valeur qu&apos;un lien caché dans le footer
                    (bas de page).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Comparison Table */}
        <Section id="comparison" className="bg-mist-50 dark:bg-mist-950/50">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Comparatif : Pourquoi SerpEditor surpasse la concurrence ?</Subheading>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-mist-200 dark:border-mist-800">
                    <th className="px-6 py-4 text-left font-semibold">Fonctionnalité</th>
                    <th className="px-6 py-4 text-center font-semibold">Ahrefs</th>
                    <th className="px-6 py-4 text-center font-semibold">Ranxplorer</th>
                    <th className="text-primary px-6 py-4 text-center font-semibold">SerpEditor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Base de liens</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">2,6T+</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">~1T</td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">2,8T+ (Record)</td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Fréquence de mise à jour</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">15 min</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">24h</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Nouveaux / Perdus</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Analyse des ancres</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Estimation trafic</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Prix / mois</td>
                    <td className="px-6 py-4 text-center font-semibold">~119€</td>
                    <td className="px-6 py-4 text-center font-semibold">~79€</td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">39€ (Pack Complet)</td>
                  </tr>
                  <tr className="border-t border-mist-200 dark:border-mist-800">
                    <td className="px-6 py-4 font-medium">Essai sans CB</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* FAQs */}
        <FAQsAccordion
          id="faqs"
          headline="Questions fréquentes sur l'analyse de backlinks"
          subheadline={<p>Tout ce que vous devez savoir sur notre outil d&apos;analyse de backlinks</p>}
        >
          <Faq
            question="Puis-je utiliser le backlink checker gratuitement ?"
            answer={
              <>
                <p>
                  Nous proposons un <strong>essai gratuit de 7 jours sans carte bancaire</strong>. Cela vous permet
                  d&apos;accéder à l&apos;intégralité de notre base de données (2,8 trillions de liens) pour effectuer
                  une <strong>analyse de backlinks</strong> complète de votre site et de vos concurrents.
                </p>
              </>
            }
          />
          <Faq
            question="C'est quoi un domaine référent ?"
            answer={
              <>
                <p>
                  Un domaine référent est un site web unique qui pointe vers votre site. Si le site A fait 10 liens vers
                  vous, vous avez <strong>10 backlinks</strong> mais seulement <strong>1 domaine référent</strong>. Pour
                  Google, le nombre de domaines référents est souvent plus important que le nombre total de liens.
                </p>
              </>
            }
          />
          <Faq
            question="Comment obtenir plus de backlinks ?"
            answer={
              <>
                <ul className="space-y-2">
                  <li>
                    <strong>Le Link Baiting</strong> : Créez du contenu exceptionnel (études, infographies) que les gens
                    voudront citer.
                  </li>
                  <li>
                    <strong>Le Guest Blogging</strong> : Écrivez des articles invités sur des sites partenaires.
                  </li>
                  <li>
                    <strong>La Récupération de liens cassés</strong> : Identifiez les liens morts chez vos concurrents
                    et proposez votre lien en remplacement.
                  </li>
                  <li>
                    <strong>Le Netlinking direct</strong> : Contactez des influenceurs de votre thématique.
                  </li>
                </ul>
              </>
            }
          />
          <Faq
            question="Combien de temps faut-il pour qu'un nouveau backlink impacte mon SEO ?"
            answer={
              <>
                <p>
                  En général, Google prend entre <strong>2 semaines et 2 mois</strong> pour crawler un nouveau lien et
                  ajuster vos positions. Notre outil détecte les nouveaux liens en seulement 15 minutes, vous donnant
                  une longueur d&apos;avance sur votre stratégie.
                </p>
              </>
            }
          />
        </FAQsAccordion>

        {/* Final CTA */}
        <CallToActionSimpleCentered
          id="final-cta"
          headline="Prêt à booster votre autorité de domaine ?"
          subheadline={
            <>
              <p>
                Ne laissez plus vos concurrents dominer la SERP grâce à leur netlinking. Utilisez l&apos;outil d&apos;
                <strong>analyse de backlinks</strong> le plus précis du marché français pour prendre le dessus.
              </p>
            </>
          }
          cta={
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <ButtonLink href="/register" size="lg">
                  Démarrer l&apos;essai gratuit de 7 jours (Sans CB)
                </ButtonLink>
                <PlainButtonLink href="/pricing" size="lg">
                  Voir les tarifs
                </PlainButtonLink>
              </div>
            </div>
          }
        />
      </Main>
      <FooterWithNewsletterFormCategoriesAndSocialIcons
        id="footer"
        cta={
          <NewsletterForm
            headline="Restez en avance en SEO"
            subheadline={
              <p>
                Recevez chaque semaine des conseils pratiques, des astuces SEO, et des mises à jour de notre outil pour
                booster votre visibilité en ligne directement dans votre boîte mail.
              </p>
            }
            action="#"
          />
        }
        links={
          <>
            <FooterCategory title="Fonctionnalités">
              <FooterLink href="/features/recherche-mots-cles">Recherche de mots-clés</FooterLink>
              <FooterLink href="/features/analyse-mots-cles-concurrents">Analyse Mots-Clés Concurrents</FooterLink>
              <FooterLink href="/features/analyse-seo">Analyse SEO</FooterLink>
              <FooterLink href="/features/suivi-position-seo">Suivi de position SEO</FooterLink>
              <FooterLink href="/features/analyse-backlinks">Analyse de backlinks</FooterLink>
            </FooterCategory>
            <FooterCategory title="Resources">
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/outils-seo-gratuits">Outils SEO Gratuits</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </FooterCategory>
            <FooterCategory title="Legal">
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/mentions-legales">Mentions Légales</FooterLink>
              <FooterLink href="/conditions-generales-vente">Conditions Générales de Vente</FooterLink>
            </FooterCategory>
          </>
        }
        fineprint="© 2025 SerpEditor, Inc."
        socialLinks={
          <>
            <SocialLink href="https://x.com" name="X">
              <XIcon />
            </SocialLink>
            <SocialLink href="https://www.youtube.com" name="YouTube">
              <YouTubeIcon />
            </SocialLink>
          </>
        }
      />
    </>
  )
}

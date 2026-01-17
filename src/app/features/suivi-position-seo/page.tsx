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
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'
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
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  History,
  RefreshCw,
  Search,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'

export const metadata: Metadata = {
  title: 'Suivi Position SEO : Outil de Tracking Précis & Analyse SERP',
  description:
    'Dominez Google avec notre outil de suivi position SEO. Analyse des pages positionnées, historique SERP et métriques organiques en temps réel. Essai gratuit 7 jours.',
  keywords: [
    'suivi position seo',
    'outil suivi position',
    'pages positionnées',
    'analyse serp historique',
    'suivi de position google',
  ],
}

export default function SuiviPositionSEOPage() {
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
          eyebrow={<AnnouncementBadge href="/pricing" text="Nouveau : Suivi en Temps Réel" cta="Voir l'offre" />}
          headline="Suivi Position SEO — Un Dashboard conçu pour la performance organique"
          subheadline={
            <>
              <p>
                Suivez vos domaines sur Google avec des métriques mises à jour en temps réel. Oubliez les outils
                complexes et illisibles. Nous avons condensé la puissance du SEO technique dans une interface intuitive.
              </p>
              <p>
                Obtenez une vision claire de vos performances : mots-clés positionnés, pages principales, historique
                SERP et analyse concurrentielle en un seul endroit.
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Accéder à mon Dashboard (Essai 7 jours sans CB)
              </ButtonLink>
              <PlainButtonLink href="/features" size="lg">
                Découvrir les fonctionnalités <ArrowNarrowRightIcon />
              </PlainButtonLink>
            </div>
          }
          demo={
            <Screenshot className="rounded-lg" wallpaper="green" placement="bottom">
              <Image
                className="bg-black/75 not-dark:hidden"
                src="/suivie-position.webp"
                alt="Outil de suivi de position SEO - Dashboard SerpEditor"
                width={1800}
                height={1250}
                priority
              />
              <Image
                className="bg-white/75 dark:hidden"
                src="/suivie-position.webp"
                alt="Outil de suivi de position SEO - Dashboard SerpEditor"
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
                <span>Mots-clés positionnés</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Top 3 & Top 10</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Analyseur SERP Historique</span>
              </div>
            </div>
          }
        />

        {/* Features Section */}
        <Section id="features">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Les 3 Piliers de notre outil de Suivi Position SEO</Subheading>
              <Text className="mx-auto max-w-3xl">
                Oubliez les outils complexes et illisibles. Nous avons condensé la puissance du SEO technique dans une
                interface intuitive.
              </Text>
            </div>

            <FeaturesThreeColumn
              features={
                <>
                  <Feature
                    icon={<BarChart3 className="h-5 w-5" />}
                    headline="1. Vue d'ensemble des positions"
                    subheadline={
                      <>
                        <p>
                          Obtenez une lecture instantanée de vos performances globales sur Google pour prendre des
                          décisions éclairées.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Mots-clés positionnés</strong> : Suivez le volume total de mots-clés pour lesquels
                              vous apparaissez.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <RefreshCw className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Dynamique du profil</strong> : Visualisez vos mots-clés en progression, en baisse,
                              les nouveaux entrants et les perdus.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Target className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Distribution du Top</strong> : Identifiez précisément combien de requêtes sont en{' '}
                              <strong>Position 1</strong>, dans le <strong>Top 3</strong> ou dans le{' '}
                              <strong>Top 10</strong>.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Activity className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Métriques Organiques</strong> : Analysez vos clics totaux, vos impressions et
                              votre CTR moyen.
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<FileText className="h-5 w-5" />}
                    headline="2. Pages Principales : Le cœur de votre trafic"
                    subheadline={
                      <>
                        <p>
                          Ne suivez pas seulement des mots-clés, suivez la performance réelle de vos URLs pour optimiser
                          votre contenu.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <BarChart3 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Performances détaillées</strong> : Voyez quelles pages génèrent le plus
                              d&apos;impressions et de clics sur les 30 derniers jours.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Tracking des changements</strong> : Identifiez les pages qui gagnent ou perdent de
                              la visibilité pour ajuster vos contenus.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Zap className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Filtrage par Domaine</strong> : Basculez facilement entre vos différents sites
                              pour une gestion multi-projets.
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<History className="h-5 w-5" />}
                    headline="3. Analyseur SERP Historique : Comprenez le marché"
                    subheadline={
                      <>
                        <p>
                          La SERP est vivante. Pour ranker, vous devez comprendre pourquoi Google change d&apos;avis et
                          comment vos concurrents évoluent.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Snapshots Historiques</strong> : Analysez l&apos;état de la SERP à des dates
                              précises pour comprendre l&apos;impact des Core Updates.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Eye className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Mouvements des concurrents</strong> : Voyez qui entre et qui sort du Top 100 pour
                              un mot-clé donné (ex: agence seo paris).
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Search className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Analyse de sortie</strong> : Identifiez les domaines qui perdent leurs positions
                              (Marquage &quot;SORTI&quot;) et récupérez leur place.
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

        {/* Why Choose Section */}
        <Section id="why" className="bg-mist-50 dark:bg-mist-950/50">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Pourquoi choisir notre solution de suivi position SEO ?</Subheading>
              <Text className="mx-auto max-w-3xl">
                Dans un secteur saturé d&apos;outils, nous misons sur la <strong>clarté</strong> et l&apos;
                <strong>actionnabilité</strong> des données.
              </Text>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <RefreshCw className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">1. Données Fraîches</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Vos positions sont vérifiées et actualisées pour vous offrir une réactivité maximale. Plus besoin
                  d&apos;attendre 48h pour voir vos résultats.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Target className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">2. Focus sur la conversion</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Nous ne vous donnons pas de &quot;score de visibilité&quot; flou. Nous vous donnons des{' '}
                  <strong>clics</strong>, des <strong>impressions</strong> et des <strong>positions réelles</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Eye className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">3. Analyse de la concurrence</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Notre analyseur SERP vous permet de voir l&apos;historique complet des classements de n&apos;importe
                  quel domaine, pas seulement le vôtre.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Comparison Table */}
        <Section id="comparison" className="bg-mist-50 dark:bg-mist-950/50">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Comparatif : Pourquoi nous surpassons les outils classiques ?</Subheading>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-mist-200 dark:border-mist-800">
                    <th className="px-6 py-4 text-left font-semibold">Fonctionnalité</th>
                    <th className="px-6 py-4 text-center font-semibold">Google Search Console</th>
                    <th className="px-6 py-4 text-center font-semibold">Outils SEO Standards</th>
                    <th className="text-primary px-6 py-4 text-center font-semibold">Notre Solution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Vitesse des données</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">Retard de 48h-72h</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">Quotidien</td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">Temps Réel / Refresh manuel</td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Historique SERP</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌ Limité</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Détail Pages</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">Top Pages + Métriques CTR</td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Mouvements SERP</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌ Non</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">
                      Détection &quot;SORTI/ENTRÉ&quot;
                    </td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Interface</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">Austère</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">Surchargée</td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">Moderne & Rapide</td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Prix / mois</td>
                    <td className="px-6 py-4 text-center font-semibold">0€</td>
                    <td className="px-6 py-4 text-center font-semibold">~120€</td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">39€ (Pack Complet)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Essai sans CB</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌ Rarement</span>
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
          headline="Questions fréquentes sur le suivi position SEO"
          subheadline={<p>Tout ce que vous devez savoir sur notre outil de suivi de positions</p>}
        >
          <Faq
            question="Comment sont calculées les impressions et les clics ?"
            answer={
              <>
                <p>
                  Nous récupérons et croisons les données de positionnement avec les volumes de recherche et les
                  comportements de clics réels sur la SERP pour vous fournir une estimation ultra-précise, proche de la
                  réalité de votre business.
                </p>
              </>
            }
          />
          <Faq
            question="Puis-je analyser l'historique d'un mot-clé que je ne suivais pas ?"
            answer={
              <>
                <p>
                  Oui ! Notre module <strong>Analyseur SERP Historique</strong> vous permet de remonter dans le temps
                  sur n&apos;importe quel mot-clé, même si vous venez de l&apos;ajouter à votre projet. C&apos;est idéal
                  pour l&apos;analyse concurrentielle.
                </p>
              </>
            }
          />
          <Faq
            question="Pourquoi certaines pages sont marquées comme 'SORTI' ?"
            answer={
              <>
                <p>
                  Cela signifie que le domaine ne figure plus dans le Top 100 de Google pour ce mot-clé précis par
                  rapport à l&apos;analyse précédente. C&apos;est une alerte critique pour vos propres pages ou une
                  opportunité si cela arrive à un concurrent.
                </p>
              </>
            }
          />
        </FAQsAccordion>

        {/* Final CTA */}
        <CallToActionSimpleCentered
          id="final-cta"
          headline="Prêt à conquérir la première page ?"
          subheadline={
            <>
              <p>
                Arrêtez de naviguer à vue. Utilisez l&apos;outil de <strong>suivi position SEO</strong> qui vous donne
                les clés de la SERP.
              </p>
            </>
          }
          cta={
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <ButtonLink href="/register" size="lg">
                  Démarrer l&apos;essai gratuit (Sans CB)
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
            </FooterCategory>
            <FooterCategory title="Legal">
              <FooterLink href="/privacy-policy">Politique de confidentialité</FooterLink>
              <FooterLink href="/mentions-legales">Mentions Légales</FooterLink>
              <FooterLink href="/conditions-generales-vente">Conditions Générales de Vente</FooterLink>
            </FooterCategory>
          </>
        }
        fineprint="© 2025 SerpEditor, Inc."
        socialLinks={
          <>
           <SocialLink href="https://x.com/serpeditor" name="X">
              <XIcon />
            </SocialLink>
            <SocialLink href="https://www.facebook.com/profile.php?id=61586300626787" name="Facebook">
              <FacebookIcon />
            </SocialLink>
            <SocialLink href="https://www.youtube.com/channel/UCClqn8e1fy2SFNPRJZXpp3Q" name="YouTube">
              <YouTubeIcon />
            </SocialLink>
            <SocialLink href="https://www.tiktok.com/@serpeditor" name="TikTok">
              <TiktokIcon />
            </SocialLink>
          </>
        }
      />
    </>
  )
}

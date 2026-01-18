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
import { FAQsTwoColumnAccordion, Faq } from '@/components/sections/faqs-two-column-accordion'
import { Feature, FeaturesThreeColumn } from '@/components/sections/features-three-column'

import {
  FooterCategory,
  FooterLink,
  FooterWithNewsletterFormCategoriesAndSocialIcons,
  NewsletterForm,
  SocialLink,
} from '@/components/sections/footer-with-newsletter-form-categories-and-social-icons'
import { HeroLeftAlignedWithDemo } from '@/components/sections/hero-left-aligned-with-demo'
import {
  NavbarLink,
  NavbarLogo,
  NavbarWithLinksActionsAndCenteredLogo,
} from '@/components/sections/navbar-with-links-actions-and-centered-logo'
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Eye,
  FileSearch,
  Link2,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serpeditor.fr'

export const metadata: Metadata = {
  title: 'Analyse Mots-Clés Concurrents : Révélez leur Stratégie SEO',
  description:
    'Effectuez une analyse de mots-clés concurrents complète. Utilisez notre Keyword Gap pour découvrir les opportunités manquées et boostez votre trafic organique.',
  keywords: [
    'analyse mots-clés concurrents',
    'analyse de concurrents',
    'analyse concurrents',
    'analyse des concurrents',
    "analyseur d'écart de mots-clés",
    'keyword gap',
  ],
  alternates: {
    canonical: `${baseUrl}/features/analyse-mots-cles-concurrents`,
  },
  openGraph: {
    title: 'Analyse Mots-Clés Concurrents | Keyword Gap & Espionnage SEO',
    description: 'Découvrez les mots-clés de vos concurrents et identifiez les opportunités manquées avec notre Keyword Gap.',
    url: `${baseUrl}/features/analyse-mots-cles-concurrents`,
    siteName: 'SerpEditor',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: `${baseUrl}/analyse-concurence.webp`,
        width: 1800,
        height: 1250,
        alt: 'Outil d\'analyse de mots-clés concurrents - Interface SerpEditor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Analyse Mots-Clés Concurrents | Keyword Gap & Espionnage SEO',
    description: 'Révélez la stratégie SEO de vos concurrents et volez leur trafic.',
    images: [`${baseUrl}/analyse-concurence.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * JSON-LD pour la page Analyse Mots-Clés Concurrents
 * Inclut: WebPage, SoftwareApplication, FAQPage, BreadcrumbList
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/features/analyse-mots-cles-concurrents#webpage`,
      "url": `${baseUrl}/features/analyse-mots-cles-concurrents`,
      "name": "Analyse Mots-Clés Concurrents : Révélez leur Stratégie SEO",
      "isPartOf": {
        "@id": `${baseUrl}/#website`
      },
      "about": {
        "@id": `${baseUrl}/#software`
      },
      "description": "Outil d'analyse de mots-clés concurrents avec Keyword Gap. Identifiez les opportunités SEO et espionnez la stratégie de vos rivaux.",
      "inLanguage": "fr-FR",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Accueil",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Fonctionnalités",
            "item": `${baseUrl}/features`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Analyse Mots-Clés Concurrents",
            "item": `${baseUrl}/features/analyse-mots-cles-concurrents`
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}/features/analyse-mots-cles-concurrents#software`,
      "name": "SerpEditor - Analyse Mots-Clés Concurrents",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "SEO Software",
      "operatingSystem": "Web",
      "description": "Outil d'analyse concurrentielle SEO avec Keyword Gap. Découvrez les mots-clés de vos rivaux et identifiez les opportunités.",
      "offers": {
        "@type": "Offer",
        "price": "39",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2025-12-31"
      },
      "featureList": [
        "Keyword Gap Analysis",
        "Mots-clés organiques des concurrents",
        "Identification des concurrents",
        "Vue d'ensemble des domaines",
        "Possibilités de mots-clés",
        "Trafic organique estimé",
        "Pages les plus performantes",
        "Analyse comparative multi-concurrents"
      ],
      "screenshot": `${baseUrl}/analyse-concurence.webp`
    },
    {
      "@type": "FAQPage",
      "@id": `${baseUrl}/features/analyse-mots-cles-concurrents#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "C'est quoi l'analyse de mots-clés concurrents ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "L'analyse de mots-clés concurrents consiste à découvrir sur quels mots-clés vos rivaux se positionnent dans Google. Cela permet d'identifier rapidement les opportunités SEO que vous avez manquées et de copier les stratégies qui fonctionnent déjà."
          }
        },
        {
          "@type": "Question",
          "name": "Comment utiliser le Keyword Gap ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le Keyword Gap compare votre site avec jusqu'à 4 concurrents simultanément. Il révèle les mots-clés sur lesquels vos concurrents rankent mais pas vous (les gaps), ceux où vous êtes tous présents, et ceux où vous dominez seul."
          }
        },
        {
          "@type": "Question",
          "name": "Combien de concurrents puis-je analyser ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le plan Free permet d'analyser 10 domaines par mois de manière basique. Le plan Pro permet 100 analyses complètes, et le plan Agency jusqu'à 1 000 analyses mensuelles avec des données détaillées."
          }
        }
      ]
    }
  ]
}


export default function AnalyseMotsClesConcurrentsPage() {
  return (
    <>
      {/* JSON-LD pour le SEO structuré */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
        <HeroLeftAlignedWithDemo
          id="hero"
          eyebrow={
            <AnnouncementBadge href="/pricing" text="Nouveau : Analyse Concurrentielle Avancée" cta="Voir l'offre" />
          }
          headline="Analyse Mots-Clés Concurrents — Identifiez vos Opportunités de Croissance"
          subheadline={
            <>
              <p>
                Pourquoi réinventer la roue quand vos concurrents ont déjà fait le travail de recherche ? L&apos;
                <strong>analyse de mots-clés concurrents</strong> est la méthode la plus rapide pour construire un plan
                de contenu qui génère du trafic.
              </p>
              <p>
                Avec <strong>SerpEditor</strong>, accédez à un module d&apos;
                <strong>analyse concurrentielle SEO</strong> de nouvelle génération. Ne vous contentez pas de lister des
                mots-clés : analysez leur valeur commerciale, la difficulté de positionnement et la stratégie SEA de vos
                adversaires pour prendre des décisions basées sur la donnée réelle.
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Lancer l&apos;analyse
              </ButtonLink>
              <PlainButtonLink href="#features" size="lg">
                Découvrir les fonctionnalités <ArrowNarrowRightIcon />
              </PlainButtonLink>
            </div>
          }
          demo={
            <Screenshot className="rounded-lg" wallpaper="brown" placement="bottom">
              <Image
                className="bg-black/75 not-dark:hidden"
                src="/serpeditor.webp"
                alt="Outil d'analyse de mots-clés concurrents - Interface SerpEditor"
                width={1800}
                height={1250}
                priority
              />
              <Image
                className="bg-white/75 dark:hidden"
                src="/serpeditor.webp"
                alt="Outil d'analyse de mots-clés concurrents - Interface SerpEditor"
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
                <span>250M+ mots-clés analysés</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Détection de Keyword Gap</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Estimation Valeur Trafic</span>
              </div>
            </div>
          }
        />

        {/* Features Section */}
        <Section id="features">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Une suite complète pour l&apos;analyse des concurrents</Subheading>
              <Text className="mx-auto max-w-3xl">
                Notre outil a été conçu pour répondre aux besoins des consultants SEO les plus exigeants, avec une
                interface moderne et des données mises à jour quotidiennement.
              </Text>
            </div>

            <FeaturesThreeColumn
              features={
                <>
                  <Feature
                    icon={<BarChart3 className="h-5 w-5" />}
                    headline="1. Recherche Organique : Le miroir de leur succès"
                    subheadline={
                      <>
                        <p>
                          Analysez la performance SEO de n&apos;importe quel domaine ou URL spécifique pour comprendre
                          leur stratégie.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <BarChart3 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Vue d&apos;ensemble complète</strong> : Découvrez le nombre de mots-clés
                              positionnés et leur distribution dans le Top 3, Top 10 et Top 20.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <DollarSign className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Valeur du trafic</strong> : Estimez combien votre concurrent devrait payer en
                              Google Ads (SEA) pour obtenir le même trafic organique.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Tendances</strong> : Suivez les nouveaux mots-clés sur lesquels ils viennent
                              d&apos;apparaître et ceux qu&apos;ils ont perdus.
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<Target className="h-5 w-5" />}
                    headline="2. Analyseur d'Écart de Mots-clés (Keyword Gap)"
                    subheadline={
                      <>
                        <p>
                          C&apos;est l&apos;outil stratégique par excellence pour identifier des centaines
                          d&apos;opportunités en quelques minutes.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <Users className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Comparaison directe</strong> : Comparez votre profil avec jusqu&apos;à 4
                              concurrents simultanément.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Mots-clés manquants</strong> : Identifiez les termes où tous vos concurrents sont
                              classés, mais pas vous.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Zap className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Mots-clés &quot;Frappables&quot;</strong> : Trouvez les requêtes où vous êtes en
                              page 2 alors que vos concurrents sont en page 1.
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<Link2 className="h-5 w-5" />}
                    headline="3. Possibilités de Backlinks (Backlink Gap)"
                    subheadline={
                      <>
                        <p>
                          Parce que l&apos;analyse sémantique ne suffit pas, identifiez aussi leurs sources
                          d&apos;autorité pour compléter votre stratégie.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <Zap className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Opportunités chaudes</strong> : Découvrez les sites qui font des liens vers
                              plusieurs de vos concurrents mais pas vers vous.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Target className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Confiance thématique</strong> : Ces sites sont déjà intéressés par votre secteur,
                              ce sont vos cibles prioritaires pour votre netlinking.
                            </span>
                          </li>
                        </ul>
                      </>
                    }
                  />

                  <Feature
                    icon={<Eye className="h-5 w-5" />}
                    headline="4. Analyse des Concurrents SERP"
                    subheadline={
                      <>
                        <p>
                          Identifiez qui domine réellement votre marché sur Google pour ajuster votre stratégie de
                          positionnement.
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <Users className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Leader vs Challengers</strong> : Visualisez votre position relative par rapport
                              aux acteurs historiques et aux nouveaux entrants.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <FileSearch className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              <strong>Analyse granulaire</strong> : Repérez les sous-dossiers ou blogs de vos
                              concurrents qui performent le mieux pour copier leur structure de contenu.
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

        {/* How to Section */}
        <Section id="how-to" className="bg-mist-50 dark:bg-mist-950/50">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Comment mener une analyse de mots-clés concurrents efficace ?</Subheading>
              <Text className="mx-auto max-w-3xl">
                Pour surpasser les leaders, vous devez suivre une méthodologie rigoureuse en utilisant notre{' '}
                <strong>grille d&apos;analyse des concurrents</strong> :
              </Text>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Users className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">1. Identifier les concurrents directs et indirects</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Ne suivez pas seulement vos rivaux commerciaux, suivez aussi les sites médias qui
                  &quot;squattent&quot; les premières positions sur vos requêtes informatives.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <DollarSign className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">2. Extraire les mots-clés à fort ROI</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Priorisez les termes avec une intention transactionnelle ou commerciale (CPC élevé) pour maximiser
                  votre retour sur investissement.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Target className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">3. Analyser l&apos;intention de recherche</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Pour chaque mot-clé trouvé chez le concurrent, vérifiez si votre page répond mieux à l&apos;attente de
                  l&apos;internaute (Contenu plus riche, vidéo, FAQ).
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-white p-6 dark:bg-mist-900">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold">4. Surveiller les mouvements</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Le SEO est une course. Utilisez nos rapports de tendances pour détecter quand un concurrent commence à
                  investir une nouvelle thématique.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Comparison Table */}
        <Section id="comparison" className="bg-mist-50 dark:bg-mist-950/50">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Pourquoi SerpEditor est le meilleur outil d&apos;analyse concurrentielle ?</Subheading>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-mist-200 dark:border-mist-800">
                    <th className="px-6 py-4 text-left font-semibold">Fonctionnalité</th>
                    <th className="px-6 py-4 text-center font-semibold">Google Keyword Planner</th>
                    <th className="px-6 py-4 text-center font-semibold">Concurrents (Semrush/Ahrefs)</th>
                    <th className="text-primary px-6 py-4 text-center font-semibold">SerpEditor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Historique des données</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">Limité</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">12-15 ans</td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">15 ans + Temps Réel</td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Analyseur d&apos;écart (Gap)</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌ Non</span>
                    </td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">✅ Oui (Très cher)</td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">✅ Inclus (39€/mo)</td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Estimation Coût Ads</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">Précision Chirurgicale</td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Données Backlinks</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌ Non</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">2,8 Trillions de liens</td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Interface</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">Complexe</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">Surchargée</td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">Moderne & Intuitive</td>
                  </tr>
                  <tr className="border-b border-mist-100 dark:border-mist-900">
                    <td className="px-6 py-4 font-medium">Support Français</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌ Non</span>
                    </td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-400">❌ Limité</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="text-primary mx-auto h-5 w-5" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Essai Gratuit</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">❌ CB Requise</span>
                    </td>
                    <td className="text-primary px-6 py-4 text-center font-semibold">7 Jours (Sans CB)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* FAQs */}
        <FAQsTwoColumnAccordion
          id="faqs"
          headline="Questions fréquentes sur l'analyse de concurrents"
          subheadline={<p>Tout ce que vous devez savoir sur notre outil d&apos;analyse concurrentielle</p>}
        >
          <Faq
            question="Comment trouver les mots-clés sur lesquels mes concurrents ne sont pas ?"
            answer={
              <>
                <p>
                  Utilisez notre module <strong>Keyword Gap</strong>. En comparant votre domaine à celui de vos
                  concurrents, filtrez les résultats pour afficher uniquement vos mots-clés &quot;uniques&quot;. Cela
                  vous permet de renforcer vos positions là où vous avez déjà une longueur d&apos;avance.
                </p>
              </>
            }
          />
          <Faq
            question="Quelle est la différence entre concurrents directs et indirects ?"
            answer={
              <>
                <p>
                  Un concurrent direct vend le même produit que vous. Un concurrent indirect (comme un blog ou
                  Wikipedia) traite du même sujet et capte votre audience sur Google. Une bonne{' '}
                  <strong>analyse des concurrents marketing</strong> doit inclure les deux pour maximiser votre
                  visibilité.
                </p>
              </>
            }
          />
          <Faq
            question="Est-ce légal d'analyser les mots-clés de ses concurrents ?"
            answer={
              <>
                <p>
                  Absolument. Les données de positionnement sur Google sont publiques. Nos outils de{' '}
                  <strong>check de mots-clés concurrents</strong> se contentent de scanner les résultats de recherche et
                  de les organiser pour vous faire gagner du temps.
                </p>
              </>
            }
          />
        </FAQsTwoColumnAccordion>

        {/* Final CTA */}
        <CallToActionSimpleCentered
          id="final-cta"
          headline="Prêt à déloger vos concurrents du Top 1 ?"
          subheadline={
            <>
              <p>
                Ne les laissez plus capturer votre trafic. Utilisez l&apos;
                <strong>outil d&apos;analyse des concurrents</strong> le plus complet pour identifier leurs faiblesses
                et transformer leurs succès en vos opportunités.
              </p>
            </>
          }
          cta={
            <div className="flex flex-col items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Démarrer mon essai gratuit (Sans CB)
              </ButtonLink>
              <Text className="text-sm text-mist-600 dark:text-mist-500">
                Accès complet pendant 7 jours : Keyword Gap, Backlink Gap et Analyse Organique.
              </Text>
              <Text className="text-sm text-mist-600 dark:text-mist-500">
                ✅ Inscription en 30s - ✅ Zéro risque - ✅ Support expert SEO
              </Text>
              <Text className="text-sm text-mist-600 dark:text-mist-500">
                Déjà client ? <PlainButtonLink href="/login">Connectez-vous ici</PlainButtonLink>
              </Text>
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

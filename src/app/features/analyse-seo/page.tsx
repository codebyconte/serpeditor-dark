import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { Screenshot } from '@/components/elements/screenshot'
import { Section } from '@/components/elements/section'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'
import { CallToActionSimpleCentered } from '@/components/sections/call-to-action-simple-centered'
import { Faq, FAQsTwoColumnAccordion } from '@/components/sections/faqs-two-column-accordion'
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
import { CheckCircle2, FileSearch, Gauge, Shield } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serpeditor.fr'

export const metadata: Metadata = {
  title: 'Analyse SEO : Obtenez votre On-Page Score et Audit Technique',
  description:
    'Réalisez une analyse SEO chirurgicale de votre site. On-Page Score, détection des balises manquantes, erreurs de crawl et contenu dupliqué.',
  keywords: [
    'analyse seo',
    'analyse site seo',
    'outil analyse seo',
    'on-page score seo',
    'analyse technique seo',
    'analyse seo en ligne',
  ],
  alternates: {
    canonical: `${baseUrl}/features/analyse-seo`,
  },
  openGraph: {
    title: 'Analyse SEO : Audit Technique Complet de votre Site',
    description: 'Analysez la santé SEO de votre site en 60 secondes. Score technique, erreurs de crawl et recommandations priorisées.',
    url: `${baseUrl}/features/analyse-seo`,
    siteName: 'SerpEditor',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: `${baseUrl}/audit-de-site.webp`,
        width: 1800,
        height: 1250,
        alt: "Outil d'analyse et d'audit SEO technique - Interface SerpEditor",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Analyse SEO : Audit Technique Complet de votre Site',
    description: 'Scan de 120+ points techniques pour optimiser votre référencement.',
    images: [`${baseUrl}/audit-de-site.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * JSON-LD pour la page Analyse SEO
 * Inclut: WebPage, SoftwareApplication, FAQPage, BreadcrumbList
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/features/analyse-seo#webpage`,
      "url": `${baseUrl}/features/analyse-seo`,
      "name": "Analyse SEO : Obtenez votre On-Page Score et Audit Technique",
      "isPartOf": {
        "@id": `${baseUrl}/#website`
      },
      "about": {
        "@id": `${baseUrl}/#software`
      },
      "description": "Outil d'analyse SEO professionnel pour auditer votre site. Score technique, détection des erreurs et recommandations priorisées.",
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
            "name": "Analyse SEO",
            "item": `${baseUrl}/features/analyse-seo`
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}/features/analyse-seo#software`,
      "name": "SerpEditor - Analyse SEO & Audit Technique",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "SEO Software",
      "operatingSystem": "Web",
      "description": "Outil d'analyse SEO technique pour auditer votre site. Scan de 120+ points, détection des erreurs et recommandations.",
      "offers": {
        "@type": "Offer",
        "price": "39",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2025-12-31"
      },
      "featureList": [
        "Scan de 120+ points techniques",
        "Score de santé SEO global",
        "Détection erreurs 404",
        "Analyse des balises meta",
        "Vérification du balisage sémantique",
        "Analyse de vitesse de chargement",
        "Détection du contenu dupliqué",
        "Recommandations priorisées"
      ],
      "screenshot": `${baseUrl}/audit-de-site.webp`
    },
    {
      "@type": "FAQPage",
      "@id": `${baseUrl}/features/analyse-seo#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Qu'est-ce qu'une analyse SEO technique ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Une analyse SEO technique est un audit approfondi de tous les éléments techniques de votre site qui impactent votre référencement : vitesse de chargement, structure HTML, balises meta, erreurs 404, redirections, robots.txt, sitemap XML, etc. Notre outil scanne plus de 120 points pour identifier tous les blocages."
          }
        },
        {
          "@type": "Question",
          "name": "Combien de pages puis-je analyser ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le plan Free permet d'auditer jusqu'à 100 pages. Le plan Pro vous donne accès à 10 000 pages par mois (10 audits maximum) et le plan Agency offre 100 000 pages par mois avec une file d'attente illimitée pour les gros sites."
          }
        },
        {
          "@type": "Question",
          "name": "À quelle fréquence dois-je faire un audit SEO ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Il est recommandé de faire une analyse SEO complète au minimum une fois par mois pour détecter les nouvelles erreurs et suivre l'évolution de votre score de santé. Si vous publiez beaucoup de contenu, un audit hebdomadaire est idéal."
          }
        }
      ]
    }
  ]
}

export default function AnalyseSeoPage() {
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
        <HeroCenteredWithDemo
          id="hero"
          headline="Analyse SEO — Mesurez la Santé de votre Site avec Précision"
          subheadline={
            <>
              <p>
                L&apos;<strong>analyse SEO</strong> moderne ne peut plus se contenter de généralités. Pour ranker en
                2026, vous avez besoin de données brutes et de métriques techniques exploitables. Notre{' '}
                <strong>outil d&apos;analyse SEO</strong> utilise les protocoles de crawl les plus avancés pour scanner
                l&apos;intégralité de votre structure et vous fournir un diagnostic sans complaisance.
              </p>
              <p>
                Grâce à notre technologie d&apos;analyse on-page, nous identifions chaque blocage qui empêche vos pages
                de monter sur Google. <strong>Obtenez votre score de santé SEO en 60 secondes</strong> et transformez
                vos points faibles en leviers de croissance.
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Démarrer mon essai gratuit de 7 jours (sans CB){' '}
              </ButtonLink>
              <PlainButtonLink href="#features" size="lg">
                Découvrir les fonctionnalités <ArrowNarrowRightIcon />
              </PlainButtonLink>
            </div>
          }
          demo={
            <Screenshot className="rounded-lg" wallpaper="blue" placement="bottom">
              <Image
                className="bg-black/75"
                src="/audit-de-site.webp"
                alt="Outil d'analyse SEO technique"
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
                <span>Score de Santé (0-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Check Balises (H1, Titres, Métas)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Analyse de Crawl & Indexabilité</span>
              </div>
            </div>
          }
        />

        {/* CTA Section */}
        <Section id="cta-hero" className="bg-primary/5">
          <div className="flex flex-col items-center gap-6 text-center">
            <Subheading>Calculez votre On-Page Score instantanément</Subheading>
            <Text className="max-w-2xl">
              Notre moteur d&apos;analyse scanne <strong>120+ points de contrôle</strong> pour évaluer votre domaine et
              vous fournir un rapport de synthèse complet.
            </Text>
            <ButtonLink href="/register" size="lg">
              Lancer l&apos;Analyse SEO
            </ButtonLink>
          </div>
        </Section>

        {/* Features Section */}
        <Section id="features">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Une Analyse SEO basée sur des données techniques réelles</Subheading>
              <Text className="mx-auto max-w-3xl">
                Contrairement aux outils basiques, SerpEditor fournit une synthèse complète de votre domaine en
                s&apos;appuyant sur des métriques de précision chirurgicale.
              </Text>
            </div>
            <FeaturesThreeColumn
              features={
                <>
                  <Feature
                    icon={<Gauge className="h-6 w-6" />}
                    headline="Le On-Page Score : Votre indicateur de performance"
                    subheadline={
                      <>
                        <p>
                          Nous calculons un <strong>score de santé (onpage_score)</strong> global pour votre site. Ce
                          score prend en compte :
                        </p>
                        <ul className="mt-4 list-inside list-disc space-y-2 text-sm">
                          <li>
                            <strong>Les erreurs critiques</strong> : Liens cassés (4xx), erreurs serveurs (5xx) et pages
                            non indexables
                          </li>
                          <li>
                            <strong>Les avertissements</strong> : Balises H1 manquantes, titres dupliqués ou
                            méta-descriptions trop longues
                          </li>
                          <li>
                            <strong>L&apos;optimisation des ressources</strong> : Poids des images sans attribut alt et
                            temps de réponse du serveur
                          </li>
                        </ul>
                      </>
                    }
                  />
                  <Feature
                    icon={<FileSearch className="h-6 w-6" />}
                    headline="Analyse de la Structure & du Contenu"
                    subheadline={
                      <>
                        <p>
                          Une <strong>analyse site seo</strong> efficace doit révéler la qualité de votre architecture
                          sémantique.
                        </p>
                        <ul className="mt-4 list-inside list-disc space-y-2 text-sm">
                          <li>
                            <strong>Check des Balises</strong> : Vérification systématique des duplicate_title,
                            duplicate_description et de l&apos;absence de balises H1
                          </li>
                          <li>
                            <strong>Détection du Duplicate Content</strong> : Identification des pages ayant un contenu
                            trop similaire qui pourrait diluer votre autorité
                          </li>
                          <li>
                            <strong>Maillage Interne</strong> : Analyse du ratio liens internes/externes pour optimiser
                            la circulation de votre &quot;jus SEO&quot;
                          </li>
                        </ul>
                      </>
                    }
                  />
                  <Feature
                    icon={<Shield className="h-6 w-6" />}
                    headline="Synthèse Technique du Crawl"
                    subheadline={
                      <>
                        <p>Visualisez en un coup d&apos;œil comment Googlebot perçoit votre site.</p>
                        <ul className="mt-4 list-inside list-disc space-y-2 text-sm">
                          <li>
                            <strong>Distribution des Status Codes</strong> : Répartition précise de vos pages (200 OK,
                            301 Redirect, 404 Not Found)
                          </li>
                          <li>
                            <strong>Poids des Pages</strong> : Identification des pages trop lourdes qui ralentissent
                            l&apos;expérience utilisateur (Core Web Vitals)
                          </li>
                          <li>
                            <strong>Gestion du Cache</strong> : Analyse du cache_control et de l&apos;encodage pour
                            garantir une indexation fluide
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

        {/* Comparison Table */}
        <Section>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 text-center">
              <Subheading>Pourquoi notre Analyse SEO est la plus précise ?</Subheading>
              <Text className="mx-auto max-w-3xl">
                Découvrez les avantages de notre outil d&apos;analyse SEO par rapport aux solutions standards.
              </Text>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-mist-950/10 dark:border-white/10">
                    <th className="py-4 pr-6 font-semibold text-mist-950 dark:text-white">Métrique analysée</th>
                    <th className="px-6 py-4 text-center font-semibold text-mist-950 dark:text-white">
                      Outils SEO Standards
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-mist-950 dark:text-white">
                      SerpEditor (On-Page API)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-950/5 dark:divide-white/5">
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Score de Santé
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">Estimation visuelle</td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>On-Page Score (0 à 100)</strong>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Liens Cassés
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">Partiel</td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>Check exhaustif (4xx, 5xx)</strong>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Balises H1/Metas
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">Basique</td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>Détection des doublons & manquants</strong>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Poids des pages
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">
                      <span className="text-red-600">❌ Non</span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>Analyse de la taille (Bytes)</strong>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Duplicate Content
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">
                      <span className="text-red-600">❌ Rarement</span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>Inclus dans la synthèse</strong>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Prix / mois
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">~119€</td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>39€</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* FAQ Section */}
        <FAQsTwoColumnAccordion
          headline="Questions fréquentes sur l'analyse SEO technique"
          subheadline={
            <>
              <p>
                Tout ce que vous devez savoir sur notre <strong>outil d&apos;analyse SEO</strong> et comment
                l&apos;utiliser efficacement.
              </p>
            </>
          }
        >
          <Faq
            question="Qu'est-ce qu'un bon On-Page Score ?"
            answer={
              <>
                <p>
                  Un score supérieur à <strong>80/100</strong> indique un site techniquement sain. Si votre score est
                  inférieur à 60, votre <strong>analyse seo</strong> révèle probablement des erreurs structurelles
                  graves (liens cassés, absence de balises stratégiques) qui freinent votre positionnement.
                </p>
              </>
            }
          />
          <Faq
            question="Comment l'analyse détecte-t-elle le contenu dupliqué ?"
            answer={
              <>
                <p>
                  L&apos;outil compare les signatures de vos pages. Si plusieurs URLs présentent des titres ou des
                  descriptions identiques (duplicate_title, duplicate_description), elles sont signalées pour vous
                  permettre de différencier vos contenus et d&apos;éviter les pénalités.
                </p>
              </>
            }
          />

          <Faq
            question="Combien de temps prend une analyse SEO complète ?"
            answer={
              <>
                <p>
                  Une analyse SEO complète prend généralement <strong>60 secondes</strong> pour une page. Pour un site
                  entier, le temps varie selon le nombre de pages, mais notre moteur est optimisé pour fournir des
                  résultats rapides même sur de gros sites.
                </p>
              </>
            }
          />
          <Faq
            question="L'analyse SEO inclut-elle les Core Web Vitals ?"
            answer={
              <>
                <p>
                  Oui, notre analyse inclut les métriques de performance essentielles comme le temps de chargement, le
                  poids des pages et les Core Web Vitals, qui sont des facteurs de classement importants pour Google.
                </p>
              </>
            }
          />
        </FAQsTwoColumnAccordion>

        {/* Final CTA */}
        <CallToActionSimpleCentered
          headline="Transformez vos données en positions n°1"
          subheadline={
            <>
              <p>
                Ne laissez plus de place au hasard. Utilisez l&apos;<strong>outil d&apos;analyse SEO</strong> qui vous
                donne les vrais chiffres de votre succès.
              </p>
              <p className="mt-4">
                Obtenez votre rapport d&apos;analyse complet : On-Page Score, détection d&apos;erreurs et roadmap
                technique priorisée.
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/register" size="lg">
                Démarrer l&apos;essai gratuit de 7 jours (sans CB)
              </ButtonLink>
              <PlainButtonLink href="/pricing" size="lg">
                Voir les tarifs
              </PlainButtonLink>
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

import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { Screenshot } from '@/components/elements/screenshot'
import { Section } from '@/components/elements/section'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import { CallToActionSimpleCentered } from '@/components/sections/call-to-action-simple-centered'
import { Faq, FAQsAccordion } from '@/components/sections/faqs-accordion'
import { Feature } from '@/components/sections/features-three-column'
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
import { Brain, CheckCircle2, Search } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serpeditor.fr'

export const metadata: Metadata = {
  title: "GEO SEO : Logiciel d'optimisation pour ChatGPT, Perplexity & Gemini",
  description:
    'Passez du SEO au GEO (Generative Engine Optimization). Analysez vos mentions LLM, suivez vos mots-clés IA et dominez les réponses de ChatGPT et Perplexity.',
  keywords: [
    'GEO SEO',
    'Generative Engine Optimization',
    'visibilité IA',
    'AIO SEO',
    'référencement ChatGPT',
    'analyse mentions LLM',
    'optimisation Perplexity',
  ],
  alternates: {
    canonical: `${baseUrl}/features/geo-seo`,
  },
  openGraph: {
    title: 'GEO SEO | Optimisez votre visibilité dans l\'IA (ChatGPT, Perplexity)',
    description: 'Le futur du SEO est le GEO. Analysez vos citations IA, optimisez pour les LLM et dominez les réponses génératives.',
    url: `${baseUrl}/features/geo-seo`,
    siteName: 'SerpEditor',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: `${baseUrl}/geo-seo.webp`,
        width: 1800,
        height: 1250,
        alt: 'Outil GEO SEO - visibilité IA - Interface SerpEditor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GEO SEO | Optimisez votre visibilité dans l\'IA',
    description: 'Dominez ChatGPT, Perplexity et Gemini avec le GEO (Generative Engine Optimization).',
    images: [`${baseUrl}/geo-seo.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * JSON-LD pour la page GEO SEO
 * Inclut: WebPage, SoftwareApplication, FAQPage, BreadcrumbList
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/features/geo-seo#webpage`,
      "url": `${baseUrl}/features/geo-seo`,
      "name": "GEO SEO : Logiciel d'optimisation pour ChatGPT, Perplexity & Gemini",
      "isPartOf": {
        "@id": `${baseUrl}/#website`
      },
      "about": {
        "@id": `${baseUrl}/#software`
      },
      "description": "Outil GEO (Generative Engine Optimization) pour optimiser votre visibilité dans les IA comme ChatGPT, Perplexity et Gemini.",
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
            "name": "GEO SEO",
            "item": `${baseUrl}/features/geo-seo`
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}/features/geo-seo#software`,
      "name": "SerpEditor - GEO SEO & visibilité IA",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "SEO Software",
      "operatingSystem": "Web",
      "description": "Premier outil français de GEO (Generative Engine Optimization). Analysez vos citations dans ChatGPT, Perplexity et Gemini.",
      "offers": {
        "@type": "Offer",
        "price": "39",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2025-12-31"
      },
      "featureList": [
        "Analyse des citations IA",
        "Score de visibilité dans les LLM",
        "Tracking mots-clés ChatGPT",
        "Suivi mentions Perplexity",
        "Analyse sources SGE",
        "Optimisation pour l'IA générative",
        "Comparaison concurrents IA",
        "Recommandations GEO"
      ],
      "screenshot": `${baseUrl}/geo-seo.webp`
    },
    {
      "@type": "FAQPage",
      "@id": `${baseUrl}/features/geo-seo#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "C'est quoi le GEO SEO ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le GEO (Generative Engine Optimization) est la nouvelle discipline du référencement pour l'ère de l'IA. Au lieu d'optimiser pour Google Search, vous optimisez pour être cité par ChatGPT, Perplexity, Gemini et autres agents IA qui génèrent des réponses directes."
          }
        },
        {
          "@type": "Question",
          "name": "Pourquoi investir dans le GEO en 2026 ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "En 2026, plus de 60% des recherches ne génèrent plus de clic car l'IA fournit la réponse directement. Si vous n'êtes pas cité par les LLM, vous perdez une part massive de visibilité. Le GEO vous permet d'anticiper ce changement de paradigme. Disponible à partir du plan Pro."
          }
        },
        {
          "@type": "Question",
          "name": "Comment fonctionne le tracking des citations IA ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Notre outil interroge régulièrement ChatGPT, Perplexity et Gemini avec vos mots-clés cibles, puis analyse si votre marque ou site est cité dans les réponses. Nous mesurons la fréquence, le positionnement et le contexte de vos mentions."
          }
        }
      ]
    }
  ]
}

export default function GeoSeoPage() {
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
          eyebrow={
            <AnnouncementBadge href="/pricing" text="Nouveau : Module visibilité IA & GEO (2026)" cta="Voir l'offre" />
          }
          headline="GEO SEO — Optimisez votre visibilité dans l'ère de l'intelligence artificielle"
          subheadline={
            <>
              <p>
                En 2026, <strong>60% des recherches ne génèrent plus de clic</strong> car l&apos;IA fournit la réponse
                directement. La question n&apos;est plus &quot;comment être premier sur Google&quot;, mais{' '}
                <strong>&quot;comment être cité par l&apos;IA&quot;</strong>. Le{' '}
                <strong>GEO (Generative Engine Optimization)</strong> est la nouvelle frontière du référencement
                naturel.
              </p>
              <p>
                <strong>SerpEditor</strong> vous donne les outils pour ne pas devenir invisible. Analysez comment les
                LLM (Large Language Models) perçoivent votre marque, suivez vos parts de voix dans les réponses
                conversationnelles et adaptez votre contenu pour devenir la source de référence de ChatGPT, Claude et
                Perplexity.
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Commencer gratuitement (sans CB)
              </ButtonLink>
              <PlainButtonLink href="/features" size="lg">
                Découvrir les fonctionnalités <ArrowNarrowRightIcon />
              </PlainButtonLink>
            </div>
          }
          demo={
            <Screenshot className="rounded-lg" wallpaper="blue" placement="bottom">
              <Image
                className="bg-black/75"
                src="/geo-seo.webp"
                alt="Logiciel GEO SEO - visibilité IA et analyse de mentions LLM"
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
                <span>Tracking ChatGPT & Perplexity</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Analyse de Mentions LLM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Audit GEO complet</span>
              </div>
            </div>
          }
        />

        {/* CTA Section */}
        <Section id="cta-hero" className="bg-primary/5">
          <div className="flex flex-col items-center gap-6 text-center">
            <Subheading>Devenez la source citée par les Intelligences Artificielles</Subheading>
            <Text className="max-w-2xl">
              Analysez votre &quot;Share of Voice&quot; dans les moteurs de réponse IA et optimisez votre contenu pour
              être la référence de ChatGPT, Perplexity et Gemini.
            </Text>
            <ButtonLink href="/register" size="lg">
              Analyser ma Visibilité IA
            </ButtonLink>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-mist-600 dark:text-mist-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Sans carte bancaire</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Installation 30s</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Compatible 2026</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Features Section */}
        <Section id="features">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Les outils indispensables pour votre stratégie GEO & AIO</Subheading>
              <Text className="mx-auto max-w-3xl">
                L&apos;<strong>AIO (AI Optimization)</strong> demande des métriques différentes du SEO classique. Nous
                avons développé trois modules exclusifs pour piloter votre stratégie.
              </Text>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Feature
                icon={<Brain className="h-6 w-6" />}
                headline="Analyseur de Mentions LLM"
                subheadline={
                  <>
                    <p>Découvrez en temps réel si votre marque est recommandée par les principaux modèles d&apos;IA.</p>
                    <ul className="mt-4 list-inside list-disc space-y-3 text-sm">
                      <li>
                        Citations & Sources : Identifiez quelles pages sont utilisées comme sources par Perplexity ou
                        Gemini
                      </li>
                      <li>Analyse de Sentiment : Comment l&apos;IA parle-t-elle de vous ?</li>
                      <li>Share of Voice IA : Mesurez votre part de visibilité face à vos concurrents</li>
                    </ul>
                  </>
                }
              />
              <Feature
                icon={<Search className="h-6 w-6" />}
                headline="Analyse de Mots-Clés IA"
                subheadline={
                  <>
                    <p>Les volumes de recherche ne sont plus les mêmes dans un chat conversationnel.</p>
                    <ul className="mt-4 list-inside list-disc space-y-3 text-sm">
                      <li> Volume Conversationnel : Obtenez le volume spécifique aux outils d&apos;IA</li>
                      <li>
                        Analyse d&apos;Intention IA : Comprenez si l&apos;IA classe votre mot-clé comme informatif,
                        transactionnel ou comparatif
                      </li>
                      <li>
                        Top 100 Simultané : Analysez jusqu&apos;à 100 mots-clés pour voir lesquels sont dominés par les
                        AI Overviews (SGE)
                      </li>
                    </ul>
                  </>
                }
              />
            </div>
          </div>
        </Section>

        {/* SEO vs GEO Comparison */}
        <Section>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 text-center">
              <Subheading>SEO vs GEO : Quelle différence en 2026 ?</Subheading>
              <Text className="mx-auto max-w-3xl">
                Le référencement évolue. Découvrez pourquoi le <strong>GEO</strong> devient essentiel pour votre
                visibilité en ligne.
              </Text>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-mist-950/10 dark:border-white/10">
                    <th className="py-4 pr-6 font-semibold text-mist-950 dark:text-white">Caractéristique</th>
                    <th className="px-6 py-4 text-center font-semibold text-mist-950 dark:text-white">SEO Classique</th>
                    <th className="px-6 py-4 text-center font-semibold text-mist-950 dark:text-white">
                      GEO (Generative Engine Optimization)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-950/5 dark:divide-white/5">
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Objectif
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">
                      Être cliqué (Position 1-3)
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>Être cité</strong> comme source de référence
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Format
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">Listes de liens bleus</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">
                      Réponses textuelles synthétiques
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      KPI Principal
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">Trafic organique (Clics)</td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>Share of Voice IA</strong> (Mentions)
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Contenu
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">Mots-clés stratégiques</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">
                      Preuves factuelles, stats et expertise (E-E-A-T)
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Source de trafic
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">Google Search</td>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">
                      ChatGPT Search, Perplexity, Gemini, AI Overviews
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* FAQ Section */}
        <FAQsAccordion
          headline="Questions fréquentes sur le GEO & l'AIO"
          subheadline={
            <>
              <p>
                Tout ce que vous devez savoir sur le <strong>Generative Engine Optimization</strong> et
                l&apos;optimisation pour les intelligences artificielles.
              </p>
            </>
          }
        >
          <Faq
            question="C'est quoi le Generative Engine Optimization (GEO) ?"
            answer={
              <>
                <p>
                  C&apos;est l&apos;ensemble des techniques visant à optimiser la visibilité d&apos;un contenu pour
                  qu&apos;il soit sélectionné et cité par les IA génératives dans leurs réponses. Contrairement au SEO,
                  le GEO se concentre sur la <strong>retrievabilité</strong> et l&apos;autorité de citation.
                </p>
              </>
            }
          />
          <Faq
            question="Pourquoi analyser les mentions LLM ?"
            answer={
              <>
                <p>
                  Si ChatGPT recommande vos concurrents au lieu de vous, vous perdez des clients avant même qu&apos;ils
                  ne fassent une recherche sur Google. L&apos;analyse de mentions permet d&apos;ajuster votre contenu
                  pour que l&apos;IA vous perçoive comme l&apos;expert de votre thématique.
                </p>
              </>
            }
          />
          <Faq
            question="Comment optimiser pour Perplexity ?"
            answer={
              <>
                <p>
                  Perplexity privilégie la fraîcheur et la transparence des sources. Pour y être visible, vous devez
                  publier des études originales, avoir un maillage interne solide et être cité par des sites
                  d&apos;autorité dans votre secteur.
                </p>
              </>
            }
          />
          <Faq
            question="Quelle est la différence entre SEO et GEO ?"
            answer={
              <>
                <p>
                  Le <strong>SEO classique</strong> vise à obtenir des clics depuis Google Search. Le{' '}
                  <strong>GEO</strong> vise à être cité comme source par les IA génératives (ChatGPT, Perplexity,
                  Gemini). Les métriques et stratégies sont différentes : le SEO mesure le trafic, le GEO mesure le
                  Share of Voice dans les réponses IA.
                </p>
              </>
            }
          />
          <Faq
            question="Le GEO remplace-t-il le SEO ?"
            answer={
              <>
                <p>
                  Non, le GEO complète le SEO. En 2026, vous devez optimiser pour les deux : le SEO pour le trafic
                  organique traditionnel et le GEO pour être visible dans les réponses IA. Les deux stratégies sont
                  complémentaires et nécessaires pour une visibilité maximale.
                </p>
              </>
            }
          />
          <Faq
            question="Combien de temps faut-il pour voir des résultats en GEO ?"
            answer={
              <>
                <p>
                  Les résultats en GEO peuvent être plus rapides que le SEO traditionnel car les IA génératives indexent
                  et citent les sources plus rapidement que Google n&apos;indexe les pages. Cependant, cela dépend de la
                  qualité de votre contenu, de votre autorité et de votre stratégie de retrievabilité.
                </p>
              </>
            }
          />
        </FAQsAccordion>

        {/* Final CTA */}
        <CallToActionSimpleCentered
          headline="Ne disparaissez pas des radars de l'IA"
          subheadline={
            <>
              <p>
                La révolution du search est en marche. Utilisez le <strong>premier logiciel GEO</strong> conçu pour le
                marché français et assurez-vous que votre marque reste au cœur des conversations.
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Commencer gratuitement (sans CB) →
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

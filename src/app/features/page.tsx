import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Link } from '@/components/elements/link'
import { Main } from '@/components/elements/main'
import { Screenshot } from '@/components/elements/screenshot'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import { Faq, FAQsTwoColumnAccordion } from '@/components/sections/faqs-two-column-accordion'
import {
  Feature,
  FeaturesStackedAlternatingWithDemos,
} from '@/components/sections/features-stacked-alternating-with-demos'
import {
  FooterCategory,
  FooterLink,
  FooterWithNewsletterFormCategoriesAndSocialIcons,
  NewsletterForm,
  SocialLink,
} from '@/components/sections/footer-with-newsletter-form-categories-and-social-icons'
import { HeroSimpleLeftAligned } from '@/components/sections/hero-simple-left-aligned'
import {
  NavbarLink,
  NavbarLogo,
  NavbarWithLinksActionsAndCenteredLogo,
} from '@/components/sections/navbar-with-links-actions-and-centered-logo'
import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

// SEO OPTIMISÉ POUR "LOGICIEL SEO" & "SOLUTION SEO"
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serpeditor.fr'

export const metadata: Metadata = {
  title: 'Logiciel SEO complet : Toutes les fonctionnalités SerpEditor',
  description:
    'Découvrez le logiciel SEO le plus complet du marché français. Dashboard tout-en-un : Audit technique, Backlinks, Suivi de positions, Visibilité IA et Analyse de domaine.',
  keywords: [
    'logiciel seo',
    'solution seo',
    'outil complet de référencement',
    'suite logicielle seo',
    'audit seo automatique',
    'visibilité IA google',
  ],
  alternates: {
    canonical: `${baseUrl}/features`,
  },
  openGraph: {
    title: 'Logiciel SEO complet | Toutes les fonctionnalités SerpEditor',
    description: 'Dashboard SEO tout-en-un : Audit technique, Backlinks, Suivi de positions, Visibilité IA et plus encore.',
    url: `${baseUrl}/features`,
    siteName: 'SerpEditor',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: `${baseUrl}/serpeditor.webp`,
        width: 3440,
        height: 1990,
        alt: 'Logiciel SEO SerpEditor - Dashboard complet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logiciel SEO complet | Toutes les fonctionnalités SerpEditor',
    description: 'La solution SEO tout-en-un pour dominer Google en 2026.',
    images: [`${baseUrl}/serpeditor.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * JSON-LD pour la page Features
 * Inclut: WebPage, SoftwareApplication, ItemList, FAQPage, BreadcrumbList
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/features#webpage`,
      "url": `${baseUrl}/features`,
      "name": "Logiciel SEO complet : Toutes les fonctionnalités SerpEditor",
      "isPartOf": {
        "@id": `${baseUrl}/#website`
      },
      "about": {
        "@id": `${baseUrl}/#software`
      },
      "description": "Découvrez toutes les fonctionnalités de SerpEditor : Recherche de mots-clés, Suivi de positions, Analyse de backlinks, Audit SEO et Visibilité IA.",
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
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}/features#software`,
      "name": "SerpEditor - Logiciel SEO complet",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "SEO Software",
      "operatingSystem": "Web",
      "description": "Logiciel SEO tout-en-un pour l'audit technique, la recherche de mots-clés, l'analyse de backlinks, le suivi de positions et la visibilité IA.",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "0",
        "highPrice": "99",
        "priceCurrency": "EUR",
        "offerCount": 3
      },
      "featureList": [
        "213M+ mots-clés français",
        "Suivi de positions quotidien",
        "2,8 trillions de backlinks analysés",
        "Audit technique SEO",
        "Analyse de la visibilité IA",
        "Monitoring SERP",
        "Analyse concurrentielle",
        "GEO (Generative Engine Optimization)"
      ],
      "screenshot": `${baseUrl}/serpeditor.webp`
    },
    {
      "@type": "ItemList",
      "name": "Fonctionnalités SerpEditor",
      "description": "Liste complète des modules du logiciel SEO SerpEditor",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "SoftwareApplication",
            "name": "Recherche de Mots-Clés",
            "description": "Accès à 213M+ mots-clés français avec analyse de difficulté et intention de recherche",
            "url": `${baseUrl}/features/recherche-mots-cles`
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "SoftwareApplication",
            "name": "Suivi de Positions",
            "description": "Tracking quotidien des classements Google en Desktop et Mobile",
            "url": `${baseUrl}/features/suivi-position-seo`
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "SoftwareApplication",
            "name": "Visibilité IA & GEO",
            "description": "Analyse de la visibilité dans les moteurs IA (ChatGPT, Perplexity, Gemini)",
            "url": `${baseUrl}/features/geo-seo`
          }
        },
        {
          "@type": "ListItem",
          "position": 4,
          "item": {
            "@type": "SoftwareApplication",
            "name": "Analyse de Backlinks",
            "description": "Base de 2,8 trillions de liens pour auditer votre netlinking",
            "url": `${baseUrl}/features/analyse-backlinks`
          }
        },
        {
          "@type": "ListItem",
          "position": 5,
          "item": {
            "@type": "SoftwareApplication",
            "name": "Audit SEO Technique",
            "description": "Scan de plus de 120 points techniques pour optimiser votre site",
            "url": `${baseUrl}/features/analyse-seo`
          }
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": `${baseUrl}/features#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Pourquoi utiliser un logiciel SEO complet ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "L'utilisation d'un logiciel tout-en-un comme SerpEditor permet de centraliser vos données. Au lieu de payer plusieurs outils pour les mots-clés, l'audit et le suivi, vous avez un dashboard unique qui croise les métriques pour une meilleure prise de décision."
          }
        },
        {
          "@type": "Question",
          "name": "Comment fonctionne le module de visibilité IA ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Notre solution scanne les sources citées par les agents IA (Perplexity, ChatGPT Search). Nous mesurons la fréquence d'apparition de votre marque dans les recommandations générées artificiellement, ce qui est crucial pour le SEO en 2026."
          }
        },
        {
          "@type": "Question",
          "name": "Quelle est la différence entre SerpEditor et les autres outils SEO ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SerpEditor combine tous les modules essentiels (mots-clés, backlinks, audit, suivi de positions, visibilité IA) dans une seule interface, à un prix accessible (39€/mois). Contrairement aux suites premium qui coûtent 100€+ par mois, nous offrons une alternative complète et abordable pour les professionnels du SEO."
          }
        },
        {
          "@type": "Question",
          "name": "Puis-je essayer le logiciel avant de m'abonner ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Oui, nous offrons un plan gratuit sans limitation de temps qui vous permet de tester les fonctionnalités du logiciel avec des quotas limités. Aucune carte bancaire n'est requise. Vous pouvez explorer nos modules de recherche de mots-clés, d'analyse de backlinks, d'audit SEO et bien plus encore."
          }
        }
      ]
    }
  ]
}

export default function FeaturesPage() {
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
        <HeroSimpleLeftAligned
          eyebrow={
            <AnnouncementBadge href="/pricing" text="Nouveau : Pack logiciel complet à 39€/mois" cta="Voir l'offre" />
          }
          headline="Un logiciel SEO tout-en-un pour dominer la SERP en 2026"
          subheadline={
            <>
              <p>
                SerpEditor n&apos;est pas qu&apos;un simple{' '}
                <strong>
                  <Link href="/" className="text-[1.1rem] hover:underline">
                    outil SEO
                  </Link>
                </strong>
                . C&apos;est un logiciel robuste conçu pour les consultants, agences et entrepreneurs qui exigent une
                précision chirurgicale sans payer 120€ par mois.
              </p>
              <p>
                Explorez nos modules natifs : de la recherche de mots-clés à l&apos;analyse de la visibilité IA, notre
                solution couvre 100% de vos besoins en référencement naturel.
              </p>
            </>
          }
        />

        <FeaturesStackedAlternatingWithDemos
          features={
            <>
              {/* MODULE 1: RECHERCHE MOTS-CLÉS */}
              <Feature
                headline="Intelligence Sémantique & Mots-Clés"
                subheadline={
                  <>
                    <p className="text-base">
                      Accédez à <strong>213M+ mots-clés français</strong>. Notre logiciel SEO détecte les clusters
                      thématiques et les opportunités de longue traîne avec une précision inégalée.
                    </p>
                    <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Keyword Magic Tool
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Analyse d&apos;intention (Search Intent)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Volumes de recherche 2026
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Difficulté SEO (KD) réelle
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Volumes de recherche 2026
                      </li>
                    </ul>
                  </>
                }
                cta={
                  <ButtonLink href="/features/recherche-mots-cles">
                    Découvrir l’outil de recherche de mots-clés →
                  </ButtonLink>
                }
                demo={
                  <Screenshot wallpaper="purple" placement="bottom-right">
                    <Image
                      src="/recherche-mot-cle.webp"
                      alt="Logiciel de recherche de mots-clés"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
              />

              {/* MODULE 2: SUIVI POSITION SEO */}
              <Feature
                headline="Suivi de Position & Monitoring SERP"
                subheadline={
                  <>
                    <p className="text-base">
                      Pilotez vos classements avec une mise à jour quotidienne. Notre <strong>solution SEO</strong>{' '}
                      analyse la volatilité de la SERP et identifie les pages qui captent réellement votre trafic.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Tracking quotidien (Desktop & Mobile)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Suivi local & Google Maps
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Comparateur de SERP Historique
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Alertes de chutes de positions
                      </li>
                    </ul>
                  </>
                }
                cta={<ButtonLink href="/features/suivi-position-seo">Découvrir le suivi de position SEO →</ButtonLink>}
                demo={
                  <Screenshot wallpaper="green" placement="bottom-right">
                    <Image
                      src="/suivie-position.webp"
                      alt="Logiciel de suivi de position SEO"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
              />

              {/* MODULE 3: VISIBILITÉ IA (NOUVEAU) */}
              <Feature
                headline="Visibilité IA & GEO (Generative Engine Optimization)"
                subheadline={
                  <>
                    <p className="text-base">
                      Anticipez le futur de Google. Notre logiciel est le premier à intégrer un module de{' '}
                      <strong>Visibilité IA</strong> pour suivre comment ChatGPT, Perplexity et Gemini citent votre
                      marque.
                    </p>
                    <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Score d&apos;influence dans les réponses IA
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Analyse des sources citées par les LLM
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Tracking des citations SGE
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Optimisation IA (GEO)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Tracking des citations SGE
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Optimisation IA (GEO)
                      </li>
                    </ul>
                  </>
                }
                cta={
                  <ButtonLink href="/features/geo-seo" color="dark/light">
                    Découvrir l’outil GEO SEO
                  </ButtonLink>
                }
                demo={
                  <Screenshot wallpaper="blue" placement="bottom-left">
                    <Image src="/geo-seo.webp" alt="Outil de visibilité IA" width={1800} height={1250} />
                  </Screenshot>
                }
              />

              {/* MODULE 4: BACKLINKS */}
              <Feature
                headline="Analyse de Netlinking & Backlinks"
                subheadline={
                  <>
                    <p className="text-base">
                      Audit complet de votre profil de liens via notre base de{' '}
                      <strong>2,8 trillions de backlinks</strong>. Détectez les opportunités de vos concurrents et
                      nettoyez vos liens toxiques.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Domaines référents & Ancres
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Détection Nouveaux / Perdus
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Analyseur de Backlink Gap
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Metrics de Domain Rating (DR)
                      </li>
                    </ul>
                  </>
                }
                cta={
                  <ButtonLink href="/features/analyse-backlinks">Découvrir l’outil d’analyse de backlinks →</ButtonLink>
                }
                demo={
                  <Screenshot wallpaper="brown" placement="bottom-left">
                    <Image src="/backlinks.webp" alt="Logiciel d'analyse de backlinks" width={1800} height={1250} />
                  </Screenshot>
                }
              />

              {/* MODULE 5: AUDIT TECHNIQUE */}
              <Feature
                headline="Audit SEO Technique & Santé du Site"
                subheadline={
                  <>
                    <p className="text-base">
                      Un outil SEO n&apos;est rien sans un crawler performant. Identifiez les erreurs de crawl, de
                      vitesse ... et bien plus .
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Scan de plus de 120 points techniques
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Score de santé SEO global
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" /> Détection des erreurs 404 et redirections
                      </li>
                    </ul>
                  </>
                }
                cta={<ButtonLink href="/features/analyse-seo">Découvrir l’outil d&apos;analyse SEO →</ButtonLink>}
                demo={
                  <Screenshot wallpaper="yellow" placement="bottom-right">
                    <Image src="/audit-de-site.webp" alt="Logiciel d'audit SEO technique" width={1800} height={1250} />
                  </Screenshot>
                }
              />
            </>
          }
        />

        {/* SECTION FAQ POUR DENSITÉ SÉMANTIQUE */}
        <FAQsTwoColumnAccordion
          headline="FAQ — Tout savoir sur notre Logiciel SEO"
          subheadline={
            <>
              <p>
                Découvrez les réponses aux questions les plus fréquentes sur notre solution SEO complète et ses
                fonctionnalités.
              </p>
            </>
          }
        >
          <Faq
            question="Pourquoi utiliser un logiciel SEO complet ?"
            answer={
              <>
                <p>
                  L&apos;utilisation d&apos;un logiciel tout-en-un comme SerpEditor permet de centraliser vos données.
                  Au lieu de payer plusieurs outils pour les mots-clés, l&apos;audit et le suivi, vous avez un dashboard
                  unique qui croise les métriques pour une meilleure prise de décision.
                </p>
              </>
            }
          />
          <Faq
            question="Comment fonctionne le module de visibilité IA ?"
            answer={
              <>
                <p>
                  Notre solution scanne les sources citées par les agents IA (Perplexity, ChatGPT Search). Nous mesurons
                  la fréquence d&apos;apparition de votre marque dans les recommandations générées artificiellement, ce
                  qui est crucial pour le SEO en 2026.
                </p>
              </>
            }
          />
          <Faq
            question="Quelle est la différence entre SerpEditor et les autres outils SEO ?"
            answer={
              <>
                <p>
                  SerpEditor combine tous les modules essentiels (mots-clés, backlinks, audit, suivi de positions,
                  visibilité IA) dans une seule interface, à un prix accessible (39€/mois). Contrairement aux suites
                  premium qui coûtent 100€+ par mois, nous offrons une alternative complète et abordable pour les
                  professionnels du SEO.
                </p>
              </>
            }
          />
          <Faq
            question="Puis-je essayer le logiciel avant de m'abonner ?"
            answer={
              <>
                <p>
                  Oui, nous offrons un <strong>plan gratuit</strong> sans limitation de temps qui vous permet de tester les fonctionnalités du logiciel
                  avec des quotas limités. Aucune carte bancaire n&apos;est requise. Vous pouvez explorer nos modules de recherche de mots-clés, d&apos;analyse de
                  backlinks, d&apos;audit SEO et bien plus encore.
                </p>
              </>
            }
          />
          <Faq
            question="Le logiciel est-il adapté aux agences SEO ?"
            answer={
              <>
                <p>
                  Absolument. SerpEditor est conçu pour les consultants, agences et entrepreneurs qui ont besoin
                  d&apos;un outil professionnel complet. Notre dashboard centralisé permet de gérer plusieurs projets
                  clients et d&apos;exporter des rapports détaillés pour vos clients.
                </p>
              </>
            }
          />
          <Faq
            question="Les données sont-elles mises à jour en temps réel ?"
            answer={
              <>
                <p>
                  Oui, nos données sont mises à jour quotidiennement pour le suivi de positions et les analyses de
                  backlinks. Les audits SEO sont effectués en temps réel lors de chaque scan, garantissant des
                  informations toujours à jour pour vos décisions stratégiques.
                </p>
              </>
            }
          />
        </FAQsTwoColumnAccordion>
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

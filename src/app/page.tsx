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
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { FAQsTwoColumnAccordion, Faq } from '@/components/sections/faqs-two-column-accordion'
import { Feature as FeatureThreeColumn, FeaturesThreeColumn } from '@/components/sections/features-three-column'
import {
  FeatureThreeColumnWithDemos,
  Features as FeaturesThreeColumnWithDemosSection,
} from '@/components/sections/features-three-column-with-demos'
import {
  Feature as FeatureTwoColumnWithDemos,
  FeaturesTwoColumnWithDemos,
} from '@/components/sections/features-two-column-with-demos'
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
import { StatsFourColumns } from '@/components/sections/stats-four-columns'
import { Stat, StatsWithGraph } from '@/components/sections/stats-with-graph'
import { Testimonial, TestimonialThreeColumnGrid } from '@/components/sections/testimonials-three-column-grid'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'
import Image from 'next/image'

// OPTIMISATION 1 : METADATA
// Le titre doit commencer par le mot clé principal.
// La description doit inclure les sémantiques clés (Audit, Backlinks, Mots-clés).
export const metadata: Metadata = {
  title: 'Outil SEO Tout-en-un Français : Audit, Mots-clés & Backlinks (Essai Gratuit)',
  description:
    "L'outil SEO complet pour dominer Google en 2024. Remplacez Semrush pour 39€/mois. +213M mots-clés, Audit technique illimité, Analyse de backlinks et Suivi de positions précis.",
  keywords: ['outil seo', 'logiciel seo', 'audit seo', 'suivi de position google', 'alternative semrush'],
  openGraph: {
    title: 'Outil SEO Tout-en-un Français : SerpEditor',
    description: "L'alternative française aux géants du SEO. Plus puissant, moins cher.",
    images: ['/serpeditor-og.jpg'], // Assure-toi d'avoir une image OG
  },
}

export default function Page() {
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
        {/* OPTIMISATION 2 : HERO SECTION
           Le H1 doit cibler "Outil SEO" directement.
           Le sous-titre doit rassurer sur la complétude de l'outil.
        */}
        <HeroLeftAlignedWithDemo
          id="hero"
          eyebrow={
            <AnnouncementBadge
              href="/pricing"
              text="Nouveau : L'Outil SEO n°1 pour les Freelances"
              cta="Voir l'offre"
            />
          }
          headline="L'Outil SEO Français Tout-en-un pour Dominer Google"
          subheadline={
            <>
              <p>
                Ne jonglez plus entre 5 outils SEO. SerpEditor est l&apos;<strong>outil SEO complet</strong> qui
                centralise tout ce dont vous avez besoin pour ranker 1er : recherche de mots-clés, analyse de backlinks,
                audit technique et suivi de positions.
              </p>
              <p>
                Rejoignez les consultants qui ont remplacé Semrush pour économiser 1200€/an sans sacrifier la
                performance.
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Démarrer mon essai gratuit de 7 jours
              </ButtonLink>
              <PlainButtonLink href="/features" size="lg">
                Découvrir les fonctionnalités <ArrowNarrowRightIcon />
              </PlainButtonLink>
            </div>
          }
          demo={
            <Screenshot className="rounded-lg" wallpaper="blue" placement="bottom">
              {/* Le ALT de l'image est crucial pour Google Images */}
              <Image
                className="bg-black/75 not-dark:hidden"
                src="/serpeditor.webp"
                alt="Tableau de bord de l'outil SEO SerpEditor"
                width={3440}
                height={1990}
                priority
              />
              <Image
                className="bg-white/75 dark:hidden"
                src="/serpeditor.webp"
                alt="Tableau de bord de l'outil SEO SerpEditor"
                width={3440}
                height={1990}
                priority
              />
            </Screenshot>
          }
        />

        {/* OPTIMISATION 3 : PREUVE D'AUTORITÉ IMMÉDIATE
            est un gage de qualité technique pour Google.
        */}
        <StatsWithGraph
          id="database"
          headline="La puissance d'un outil SEO Enterprise, au prix freelance"
          subheadline={
            <p>
              Pour être le <strong>meilleur outil SEO</strong>, SerpEditor s’appuie sur une infrastructure de collecte
              et d’analyse propriétaire optimisée pour le marché français, afin de vous fournir des données précises,
              fraîches et exploitables pour prendre de meilleures décisions SEO.
            </p>
          }
        >
          <Stat stat="213M+" text="Mots-clés FR" />
          <Stat stat="2,8T+" text="Backlinks Analysés" />
          <Stat stat="Daily" text="Mise à jour Positions" />
          <Stat stat="336Md+" text="Pages Crawlées" />
        </StatsWithGraph>

        {/* OPTIMISATION 4 : FEATURES ET SÉMANTIQUE
           Ici, on structure le contenu autour des 3 piliers du SEO.
           Google comprendra que tu couvres tout le spectre.
        */}
        <FeaturesTwoColumnWithDemos
          id="features-demos"
          headline="Pilotez les 5 piliers du référencement avec un seul logiciel"
          subheadline={
            <p>
              SerpEditor n&apos;est pas juste une alternative, c&apos;est votre nouveau QG pour gérer le SEO technique,
              sémantique et la popularité.
            </p>
          }
          features={
            <>
              <FeatureTwoColumnWithDemos
                demo={
                  <Screenshot wallpaper="purple" placement="bottom-right">
                    <Image
                      src="/recherche-mot-cle.webp"
                      alt="Outil de recherche de mots-clés SEO"
                      className="bg-black/75"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
                headline="1. Recherche de Mots-Clés"
                subheadline={
                  <p>
                    Accédez à la plus grande base de données française (213M+). Détectez les opportunités de longue
                    traîne, analysez le volume de recherche réel et espionnez les mots-clés de vos concurrents en un
                    clic.
                  </p>
                }
                cta="Découvrir l’outil de recherche de mots-clés →"
                ctaLink="/features/recherche-mots-cles"
              />
              <FeatureTwoColumnWithDemos
                demo={
                  <Screenshot wallpaper="blue" placement="bottom-left">
                    <Image
                      src="/backlinks.webp"
                      alt="Outil d'analyse de backlinks et netlinking"
                      className="bg-black/75"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
                headline="2. Netlinking & Autorité"
                subheadline={
                  <p>
                    L&apos;autorité est la clé du ranking. Analysez votre profil de backlinks, désavouez les liens
                    toxiques et copiez la stratégie de netlinking de vos concurrents grâce à notre index de 2,8
                    trillions de liens.
                  </p>
                }
                cta="Découvrir l’analyse de backlinks →"
                ctaLink="/features/analyse-backlinks"
              />
            </>
          }
        />

        <FeaturesThreeColumnWithDemosSection
          features={
            <>
              <FeatureThreeColumnWithDemos
                demo={
                  <Screenshot wallpaper="purple" placement="top-right">
                    <Image
                      src="/audit-de-site.webp"
                      alt="Outil d'analyse SEO"
                      className="bg-black/75"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
                headline="3. Audit Technique"
                subheadline={
                  <p>
                    Un site lent ou cassé ne ranke pas. Notre crawler détecte les erreurs 404, les problèmes de balisage
                    et de vitesse pour optimiser votre santé technique.
                  </p>
                }
                cta="Découvrir l’outil d’audit SEO"
                ctaLink="/features/analyse-seo"
              />

              <FeatureThreeColumnWithDemos
                demo={
                  <Screenshot wallpaper="brown" placement="top">
                    <Image
                      src="/suivie-position.webp"
                      alt="Outil de suivi de position SEO"
                      className="bg-black/75"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
                headline="Suivi de Positions (Rank Tracker)"
                subheadline={
                  <p>
                    Suivez l&apos;évolution de vos classements sur Google Mobile et Desktop avec une mise à jour
                    quotidienne et un historique précis.
                  </p>
                }
                cta="Découvrir l’outil de suivi de positions SEO"
                ctaLink="/features/suivi-position-seo"
              />
              <FeatureThreeColumnWithDemos
                demo={
                  <Screenshot wallpaper="yellow" placement="top-left">
                    <Image
                      src="/analyse-concurence.webp"
                      alt="Analyse de la concurrence SEO"
                      className="bg-black/75"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
                headline="Analyse Concurrentielle"
                subheadline={
                  <p>
                    Ne devinez plus. Voyez exactement sur quels mots-clés vos concurrents se positionnent et volez leur
                    trafic.
                  </p>
                }
                cta="Découvrir l’analyse des mots-clés concurrents"
                ctaLink="/features/analyse-mots-cles-concurrents"
              />
            </>
          }
        />

        {/* OPTIMISATION 5 : LE COMPARATIF (Pour la conversion et le mot clé "Alternative")
           On garde cette section car elle prouve la valeur, mais on l'a déplacée après l'explication du produit.
        */}
        <FeaturesThreeColumn
          id="pourquoi"
          headline="Pourquoi c'est l'alternative idéale aux outils coûteux"
          subheadline={
            <p>
              Comparé aux mastodontes comme Semrush ou Ahrefs, SerpEditor est calibré pour la réalité des freelances et
              PME françaises.
            </p>
          }
          features={
            <>
              <FeatureThreeColumn
                headline="Prix Divisé par 3"
                subheadline={
                  <p>
                    Arrêtez de payer pour des fonctionnalités inutiles. À <strong>39€/mois</strong>, vous avez
                    l&apos;équivalent d&apos;un plan Guru chez la concurrence. Une économie de <strong>1200€/an</strong>{' '}
                    immédiate.
                  </p>
                }
              />
              <FeatureThreeColumn
                headline="Ergonomie & Simplicité"
                subheadline={
                  <p>
                    Pas besoin d&apos;une formation de 2 semaines. Notre interface est conçue pour aller droit au but :
                    entrez un domaine, obtenez les données. Point barre.
                  </p>
                }
              />
              <FeatureThreeColumn
                headline="Spécialisé Marché FR"
                subheadline={
                  <p>
                    La plupart des outils SEO sous-estiment les volumes français. Nous utilisons des données locales
                    ultra-précises pour garantir la fiabilité de vos rapports.
                  </p>
                }
              />
            </>
          }
        />

        {/* Section Économies (Très bien pour le CTR et l'engagement) */}
        <Section
          id="economies"
          headline="Calculez votre ROI immédiatement"
          subheadline={<p>L&apos;outil SEO le plus rentable du marché français.</p>}
        >
          <Subheading className="mb-4 text-2xl">Comparatif des coûts annuels</Subheading>
          <StatsFourColumns>
            <Stat
              stat={<span className="text-2xl font-bold text-red-600">1668€ / an</span>}
              text={
                <span>
                  <strong>Semrush</strong>
                </span>
              }
            />
            <Stat
              stat={<span className="text-2xl font-bold text-red-600">~1550€ / an</span>}
              text={
                <span>
                  <strong>Ahrefs</strong>
                </span>
              }
            />
            <Stat
              stat={<span className="text-2xl font-bold text-red-600">708€ / an</span>}
              text={
                <span>
                  <strong>Haloscan</strong>
                </span>
              }
            />
            <Stat
              stat={<span className="text-2xl font-bold text-green-600">468€ / an</span>}
              text={
                <span>
                  <strong>SerpEditor</strong> <span className="text-xs">(Tout inclus)</span>
                </span>
              }
            />
          </StatsFourColumns>
          <Text className="mt-4">
            Investissez l&apos;argent économisé dans la rédaction de contenu ou le netlinking. C&apos;est ça, une
            stratégie SEO intelligente.
          </Text>
        </Section>

        {/* OPTIMISATION 6 : CLUSTERING DE CONTENU & RAISONS
           Ajout de mots clés sémantiques dans les cards
        */}
        <Section
          id="pourquoi-choisir"
          headline="6 Raisons d'adopter SerpEditor pour votre référencement"
          subheadline={<p>Performance, Précision, Prix. Le tiercé gagnant.</p>}
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-mist-900">
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">Base de Mots-clés Massive</Subheading>
                <p className="mb-4">
                  Avec <strong>213+ millions de requêtes</strong>, notre base dépasse largement les standards du marché.
                  Idéal pour trouver des niches inexploitées en France.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-mist-900">
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">Données Temps Réel</Subheading>
                <p className="mb-4">
                  Le SEO bouge vite. Nos positions sont rafraîchies chaque jour et nos métriques de volume proviennent
                  directement de Google Ads.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-mist-900">
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">100% Made in France 🇫🇷</Subheading>
                <p className="mb-4">
                  Un support qui parle votre langue, une facturation claire avec TVA française, et une compréhension des
                  spécificités du Google France.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-mist-900">
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">UX/UI Moderne</Subheading>
                <p className="mb-4">
                  Fini les usines à gaz des années 2010. SerpEditor offre une expérience utilisateur fluide, rapide et
                  pensée pour la productivité.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-mist-900">
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">Support Client 7j/7</Subheading>
                <p className="mb-4">
                  Bloqué sur une analyse ? Notre équipe d&apos;experts SEO vous répond en moins de 24h via le chat
                  intégré.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-mist-900">
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">Liberté Totale</Subheading>
                <p className="mb-4">
                  Zéro engagement. Exportez vos données quand vous voulez. Vous restez chez nous parce que l&apos;outil
                  est bon, pas parce que vous êtes bloqué.
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Témoignages */}
        <TestimonialThreeColumnGrid
          id="testimonials"
          headline="L'avis des experts SEO"
          subheadline="Ils l'utilisent au quotidien pour leurs clients."
        >
          <Testimonial
            quote={
              <p>
                &quot;Enfin un outil SEO qui va à l&apos;essentiel. J&apos;ai tout ce qu&apos;il me faut pour mes audits
                et mon suivi de pos, sans payer 150 balles par mois.&quot;
              </p>
            }
            img={
              <Image
                src="https://assets.tailwindplus.com/avatars/11.webp?size=160"
                alt="Avis outil SEO SerpEditor"
                className="not-dark:bg-white/75 dark:bg-black/75"
                width={160}
                height={160}
              />
            }
            name="Clement L."
            byline="Consultant SEO Senior"
          />
          <Testimonial
            quote={
              <p>
                &quot;La base de données mots-clés est bluffante pour un outil à ce prix. Je trouve des pépites que
                Semrush ne voit même pas sur le marché FR.&quot;
              </p>
            }
            img={
              <Image
                src="https://assets.tailwindplus.com/avatars/12.webp?size=160"
                alt="Avis utilisateur SerpEditor"
                className="not-dark:bg-white/75 dark:bg-black/75"
                width={160}
                height={160}
              />
            }
            name="Thomas R."
            byline="Éditeur de sites"
          />
          <Testimonial
            quote={
              <p>
                &quot;J&apos;ai migré tous mes clients dessus. Le rapport PDF en marque blanche est top pour le
                reporting mensuel. C&apos;est l&apos;outil SEO le plus rentable actuellement.&quot;
              </p>
            }
            img={
              <Image
                src="https://assets.tailwindplus.com/avatars/13.webp?size=160"
                alt="Avis agence SEO"
                className="not-dark:bg-white/75 dark:bg-black/75"
                width={160}
                height={160}
              />
            }
            name="Sarah M."
            byline="Agence Webmarketing"
          />
        </TestimonialThreeColumnGrid>

        {/* OPTIMISATION 7 : FAQ SÉMANTIQUE (Targeting Featured Snippets)
           On répond aux questions "C'est quoi un outil SEO ?" indirectement.
        */}
        <FAQsTwoColumnAccordion id="faqs" headline="Questions fréquentes sur notre outil de référencement">
          <Faq
            id="faq-1"
            question="Qu'est-ce qu'un outil SEO tout-en-un ?"
            answer="Un outil SEO tout-en-un comme SerpEditor permet de centraliser toutes les tâches nécessaires au référencement naturel : audit technique du site, recherche de mots-clés, analyse des backlinks concurrents et suivi du positionnement sur Google. Cela évite de payer plusieurs abonnements différents."
          />
          <Faq
            id="faq-2"
            question="Pourquoi SerpEditor est-il moins cher que Semrush ?"
            answer="Semrush est une suite marketing globale (réseaux sociaux, publicité, content marketing, etc.). SerpEditor se concentre uniquement sur le SEO pur (les fonctionnalités que vous utilisez vraiment). En supprimant le superflu, nous réduisons drastiquement les coûts."
          />
          <Faq
            id="faq-3"
            question="Est-ce un bon outil SEO pour débutant ?"
            answer="Oui, c'est l'outil idéal pour débuter. Contrairement aux usines à gaz du marché, notre interface guide l'utilisateur : scores de difficulté clairs, suggestions automatiques et rapports d'audit priorisés par importance."
          />
          <Faq
            id="faq-4"
            question="Les données sont-elles fiables pour le marché français ?"
            answer="Oui. SerpEditor s’appuie sur une base de données SEO optimisée pour le marché français, avec plus de 200 millions de mots-clés et des millions de pages analysées en continu. Nos données sont recalculées et recoupées régulièrement pour offrir une précision bien supérieure aux outils généralistes internationaux."
          />
          <Faq
            id="faq-5"
            question="Puis-je tester l'outil gratuitement ?"
            answer="Oui, nous offrons un essai gratuit de 7 jours sans obligation de carte bancaire. Vous pouvez lancer votre premier audit et vos premières recherches de mots-clés immédiatement pour voir la puissance de l'outil."
          />
        </FAQsTwoColumnAccordion>

        <CallToActionSimple
          eyebrow="Prêt à booster votre trafic Google ?"
          headline="Rejoignez les experts SEO qui ont choisi la performance au juste prix."
          subheadline="Rejoignez les experts SEO qui ont choisi la performance au juste prix."
          cta={
            <ButtonLink href="/register" size="lg">
              Commencer mon essai gratuit de 7 jours (Sans CB)
            </ButtonLink>
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

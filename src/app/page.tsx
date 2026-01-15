import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Link } from '@/components/elements/link'
import { Main } from '@/components/elements/main'
import { Screenshot } from '@/components/elements/screenshot'
import { Section } from '@/components/elements/section'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { GitHubIcon } from '@/components/icons/social/github-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import { CallToActionSimpleCentered } from '@/components/sections/call-to-action-simple-centered'
import { FAQsTwoColumnAccordion, Faq } from '@/components/sections/faqs-two-column-accordion'
import { Feature as FeatureThreeColumn, FeaturesThreeColumn } from '@/components/sections/features-three-column'
import {
  FeatureThreeColumnWithDemos,
  Features as FeaturesThreeColumnWithDemosSection,
} from '@/components/sections/features-three-column-with-demos'
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
import { PlanComparisonTable } from '@/components/sections/plan-comparison-table'
import { Plan, PricingMultiTier } from '@/components/sections/pricing-multi-tier'
import { Stat, StatsFourColumns } from '@/components/sections/stats-four-columns'
import { Testimonial, TestimonialThreeColumnGrid } from '@/components/sections/testimonials-three-column-grid'
import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Alternative Semrush : Outil SEO Français 3x Moins Cher (39€/mois) ',
  description:
    "Semrush à 159€/mois ? Découvrez l'alternative française : audit SEO, backlinks, mots-clés. Essai gratuit sans CB. 3600+ consultants nous font confiance. ",
  keywords: ['outil seo', 'outil seo français'],
}

export default function Page() {
  return (
    <>
      <NavbarWithLinksActionsAndCenteredLogo
        id="navbar"
        links={
          <>
            <NavbarLink href="/features">Fonctionnalités</NavbarLink>
            <NavbarLink href="/pricing">Prix</NavbarLink>
            <NavbarLink href="/blog">Blog</NavbarLink>
            <NavbarLink href="/login" className="sm:hidden">
              Connexion
            </NavbarLink>
          </>
        }
        logo={
          <NavbarLogo href="/">
            <Image src="serpeditor.svg" alt="SerpEditor" className="dark:hidden" width={85} height={28} />
            <Image src="serpeditor-white.svg" alt="SerpEditor" className="not-dark:hidden" width={85} height={28} />
          </NavbarLogo>
        }
        actions={
          <>
            <PlainButtonLink href="/login" className="max-sm:hidden">
              Connexion
            </PlainButtonLink>
            <ButtonLink href="/register">Commencer</ButtonLink>
          </>
        }
      />

      <Main>
        {/* Hero Section - Utilise HeroLeftAlignedWithDemo */}
        <HeroLeftAlignedWithDemo
          id="hero"
          eyebrow={<AnnouncementBadge href="#" text="Alternative française à Semrush" cta="Découvrir" />}
          headline="Outil SEO Français Simple et Abordable pour Freelances et Consultants"
          subheadline={
            <>
              <p>
                Marre de payer 139€/mois pour Semrush alors que vous n&apos;utilisez que 20% des fonctionnalités ?
                SerpEditor est l&apos;outil SEO français conçu spécifiquement pour les freelances, consultants et PME
                qui ont besoin d&apos;un outil performant sans exploser leur budget.
              </p>
              <p>
                Accédez à 213+ millions de mots-clés français, analysez vos backlinks, auditez votre site et suivez vos
                positions Google pour seulement 39€/mois. Interface 100% en français, données précises pour le marché
                francophone, support réactif.
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Commencer gratuitement
              </ButtonLink>
              <PlainButtonLink href="#features" size="lg">
                Voir comment ça marche <ArrowNarrowRightIcon />
              </PlainButtonLink>
            </div>
          }
          demo={
            <Screenshot className="rounded-lg" wallpaper="blue" placement="bottom">
              <Image
                className="bg-black/75 not-dark:hidden"
                src="/serpeditor.webp"
                alt="Interface SerpEditor"
                width={3440}
                height={1990}
              />
              <Image
                className="bg-white/75 dark:hidden"
                src="/serpeditor.webp"
                alt="Interface SerpEditor"
                width={3440}
                height={1990}
              />
            </Screenshot>
          }
        />

        {/* Pourquoi quitter Semrush - Utilise FeaturesThreeColumn */}
        <FeaturesThreeColumn
          id="pourquoi"
          headline="Pourquoi les freelances et consultants quittent Semrush pour SerpEditor"
          subheadline={
            <p>
              Chaque mois, des centaines de professionnels du SEO français annulent leur abonnement Semrush pour passer
              à SerpEditor. Voici pourquoi :
            </p>
          }
          features={
            <>
              <FeatureThreeColumn
                headline="Prix 3x moins élevé"
                subheadline={
                  <p>
                    Semrush coûte <strong>139€/mois minimum</strong> (1668€/an). Pour un freelance ou une PME,
                    c&apos;est un budget colossal qui grignote vos marges. SerpEditor propose toutes les fonctions
                    essentielles pour <strong>39€/mois</strong> (468€/an) — soit{' '}
                    <strong>1200€ d&apos;économies annuelles</strong>.
                  </p>
                }
              />
              <FeatureThreeColumn
                headline="Simplicité vs complexité"
                subheadline={
                  <p>
                    Semrush propose plus de 50 outils dont vous n&apos;utiliserez jamais 80%. Interface lourde, courbe
                    d&apos;apprentissage longue. <strong>SerpEditor se concentre sur l&apos;essentiel</strong> : audit
                    SEO, backlinks, mots-clés, positions. Interface épurée, résultats en 10 secondes.
                  </p>
                }
              />
              <FeatureThreeColumn
                headline="Données précises pour le marché français"
                subheadline={
                  <p>
                    Semrush est conçu pour le marché américain. SerpEditor utilise les données{' '}
                    <strong>DataForSEO spécialisées pour la France</strong> :{' '}
                    <strong>213+ millions de mots-clés français</strong> avec volumes réels et métriques fiables.
                  </p>
                }
              />
              <FeatureThreeColumn
                headline="Support en français réactif"
                subheadline={
                  <p>
                    Le support Semrush est principalement en anglais avec des délais de réponse de 24-48h. SerpEditor
                    vous répond <strong>en français en moins de 2h</strong>. Notre équipe est disponible et réactive.
                  </p>
                }
              />
              <FeatureThreeColumn
                headline="Tout ce dont vous avez réellement besoin"
                subheadline={
                  <p>
                    90% des consultants SEO utilisent seulement 5 fonctions : audit technique, analyse backlinks,
                    recherche de mots-clés, suivi de positions, analyse concurrentielle.{' '}
                    <strong>SerpEditor inclut exactement ces 5 fonctions</strong> — rien de plus, rien de moins.
                  </p>
                }
              />
              <FeatureThreeColumn
                headline="Résultat"
                subheadline={
                  <p>
                    <strong>Vous économisez 1200€/an</strong> tout en ayant accès aux mêmes données que les grands
                    outils.
                  </p>
                }
              />
            </>
          }
        />

        <FeaturesThreeColumnWithDemosSection
          id="features-demos"
          headline="Toutes les fonctionnalités SEO essentielles dans un seul outil"
          subheadline={
            <p>
              SerpEditor regroupe tous les outils dont vous avez besoin pour optimiser votre référencement naturel ou
              celui de vos clients.
            </p>
          }
          features={
            <>
              <FeatureThreeColumnWithDemos
                demo={
                  <Screenshot wallpaper="purple" placement="bottom-right">
                    <Image
                      src="https://assets.tailwindplus.com/screenshots/1.webp?left=1800&top=1250&color=mist"
                      alt=""
                      className="bg-black/75"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
                headline="Audit SEO technique complet"
                subheadline={
                  <p>
                    Analysez votre site et identifiez tous les problèmes techniques qui freinent votre référencement.
                  </p>
                }
                cta="En savoir plus sur l'audit SEO  →"
                ctaLink="/features/audit-seo-technique"
              />
              <FeatureThreeColumnWithDemos
                demo={
                  <Screenshot wallpaper="blue" placement="bottom-left">
                    <Image
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1800&top=1250&color=mist"
                      alt=""
                      className="bg-black/75 not-dark:hidden max-xl:hidden"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
                headline="Analyse de backlinks avancée"
                subheadline={
                  <p>
                    Surveillez votre profil de liens et détectez les opportunités ou menaces avec 2,8+ trillions de
                    backlinks indexés dans la base de données.
                  </p>
                }
                cta="En savoir plus sur l'analyse de backlinks →"
                ctaLink="/features/analyse-de-backlinks"
              />
              <FeatureThreeColumnWithDemos
                demo={
                  <Screenshot wallpaper="green" placement="top">
                    <Image
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1800&top=1250&color=mist"
                      alt=""
                      className="bg-black/75"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
                headline="Analyse de backlinks avancée"
                subheadline={
                  <p>
                    Surveillez votre profil de liens et détectez les opportunités ou menaces avec 2,8+ trillions de
                    backlinks indexés dans la base de données.
                  </p>
                }
                cta="En savoir plus sur l'analyse de backlinks →"
                ctaLink="/features/analyse-de-backlinks"
              />
            </>
          }
        />

        {/* Fonctionnalités */}
        <Section
          id="features"
          headline="Toutes les fonctionnalités SEO essentielles dans un seul outil"
          subheadline={
            <p>
              SerpEditor regroupe tous les outils dont vous avez besoin pour optimiser votre référencement naturel ou
              celui de vos clients.
            </p>
          }
        >
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl">🔍</div>
                <Subheading className="mb-4 text-2xl">Audit SEO technique complet</Subheading>
                <Text className="mb-4">
                  Analysez votre site en <strong>60 secondes</strong> et identifiez tous les problèmes techniques qui
                  freinent votre référencement.
                </Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Erreurs techniques : 404, redirections, balises manquantes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Performance : vitesse de chargement, Core Web Vitals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Structure : balises title, meta descriptions, H1-H6</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Mobile : compatibilité responsive, ergonomie mobile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Liens internes : maillage, liens cassés, profondeur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Rapport PDF : export client-ready pour vos présentations</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link href="/audit-seo-technique" className="text-primary hover:underline">
                    En savoir plus sur l'audit SEO →
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl">🔗</div>
                <Subheading className="mb-4 text-2xl">Analyse de backlinks avancée</Subheading>
                <Text className="mb-4">
                  Surveillez votre profil de liens et détectez les opportunités ou menaces avec{' '}
                  <strong>2,8+ trillions de backlinks</strong> indexés dans la base DataForSEO.
                </Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Backlinks actifs : liste complète de vos liens entrants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Domaines référents : nombre et qualité des sites qui vous linkent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Anchor texts : analyse des textes d'ancrage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Ratio dofollow/nofollow : équilibre de votre profil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Backlinks toxiques : détection automatique des liens dangereux</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Backlinks concurrents : espionnez les liens de vos compétiteurs</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link href="/check-backlinks" className="text-primary hover:underline">
                    Tester le backlinks checker →
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl">📊</div>
                <Subheading className="mb-4 text-2xl">Recherche de mots-clés puissante</Subheading>
                <Text className="mb-4">
                  Trouvez les meilleurs mots-clés pour votre stratégie de contenu avec{' '}
                  <strong>213+ millions de mots-clés français</strong>.
                </Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Volume de recherche France : données Google Ads réelles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Difficulté SEO : estimation de la compétitivité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>CPC Google Ads : valeur commerciale du mot-clé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Tendances : évolution du volume sur 12 mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Mots-clés longue traîne : suggestions automatiques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Questions PAA : "People Also Ask" de Google</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl">📈</div>
                <Subheading className="mb-4 text-2xl">Suivi de positions Google</Subheading>
                <Text className="mb-4">
                  Suivez vos classements Google quotidiennement pour <strong>500 mots-clés</strong>.
                </Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Suivi quotidien : mise à jour automatique chaque jour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Positions précises : résultats Google France géolocalisés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Historique : évolution de vos positions sur 12 mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Alertes : notification en cas de chute ou progression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>SERP features : snippets, PAA, images, vidéos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Export : téléchargement CSV pour vos rapports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl">🕵️</div>
                <Subheading className="mb-4 text-2xl">Analyse concurrentielle</Subheading>
                <Text className="mb-4">
                  Espionnez les stratégies SEO de vos concurrents et identifiez leurs faiblesses.
                </Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Mots-clés concurrents : sur quels mots ils se positionnent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Trafic organique estimé : nombre de visites SEO/mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Backlinks concurrents : qui leur fait des liens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Pages les plus performantes : leurs contenus qui rankent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Évolution historique : progression ou déclin de leur visibilité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Opportunités de mots-clés : gaps à exploiter</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl">⚡</div>
                <Subheading className="mb-4 text-2xl">API rapide et fiable</Subheading>
                <Text className="mb-4">Intégrez SerpEditor à vos workflows avec notre API.</Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>API RESTful : documentation complète</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Données DataForSEO : accès direct aux 213M mots-clés FR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Rate limits généreux : adapté aux agences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Support développeur : assistance technique dédiée</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link href="/analyse-seo" className="text-primary hover:underline">
                    Découvrir toutes les fonctionnalités →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Comparatif - Utilise PlanComparisonTable */}
        <PlanComparisonTable
          id="comparatif"
          plans={['SerpEditor', 'Haloscan', 'Ranxplorer', 'Semrush']}
          features={[
            {
              title: 'Prix et essai',
              features: [
                {
                  name: 'Prix/mois',
                  value: { SerpEditor: '39€ ✅', Haloscan: '59€', Ranxplorer: '39€', Semrush: '139€ ❌' },
                },
                {
                  name: 'Essai gratuit',
                  value: { SerpEditor: '7j sans CB ✅', Haloscan: 'Limité', Ranxplorer: '15j', Semrush: '7j avec CB' },
                },
              ],
            },
            {
              title: 'Données',
              features: [
                {
                  name: 'Mots-clés FR',
                  value: { SerpEditor: '213M+ ✅', Haloscan: '190M', Ranxplorer: '100M', Semrush: '~50M' },
                },
                {
                  name: 'Backlinks',
                  value: { SerpEditor: '2,8T+ ✅', Haloscan: 'NC', Ranxplorer: 'NC', Semrush: '43T' },
                },
              ],
            },
            {
              title: 'Support et interface',
              features: [
                { name: 'Interface FR', value: { SerpEditor: true, Haloscan: true, Ranxplorer: true, Semrush: false } },
                {
                  name: 'Support FR',
                  value: { SerpEditor: '< 2h ✅', Haloscan: 'Oui', Ranxplorer: 'Oui', Semrush: false },
                },
              ],
            },
            {
              title: 'Fonctionnalités',
              features: [
                { name: 'Audit SEO', value: { SerpEditor: true, Haloscan: false, Ranxplorer: false, Semrush: true } },
                {
                  name: 'API disponible',
                  value: { SerpEditor: true, Haloscan: true, Ranxplorer: false, Semrush: true },
                },
              ],
            },
            {
              title: 'Cible',
              features: [
                {
                  name: 'Public cible',
                  value: {
                    SerpEditor: 'Freelances',
                    Haloscan: 'SEO avancés',
                    Ranxplorer: 'SEO FR',
                    Semrush: 'Grandes agences',
                  },
                },
              ],
            },
          ]}
        />

        {/* Section économies après comparatif */}
        <Section
          id="economies"
          headline="💰 Économies annuelles en choisissant SerpEditor"
          subheadline={<p>Découvrez combien vous pouvez économiser chaque année.</p>}
        >
          <div className="rounded-2xl border border-mist-200 bg-mist-50 p-6 dark:border-mist-800 dark:bg-mist-950">
            <Subheading className="mb-4 text-2xl">Calcul des économies</Subheading>
            <ul className="space-y-2 text-mist-700 dark:text-mist-400">
              <li>
                <strong>vs Semrush</strong> : 1200€ économisés/an (139€ - 39€ = 100€/mois)
              </li>
              <li>
                <strong>vs Haloscan</strong> : 240€ économisés/an (59€ - 39€ = 20€/mois)
              </li>
              <li>
                <strong>vs Ahrefs</strong> : 720€ économisés/an (99€ - 39€ = 60€/mois)
              </li>
            </ul>
            <Text className="mt-4">
              <strong>Calcul simple :</strong> Pour le prix d'un an de Semrush (1668€), vous pouvez utiliser SerpEditor
              pendant <strong>3,5 ans</strong> (468€/an).
            </Text>
          </div>
        </Section>

        {/* Pourquoi choisir SerpEditor */}
        <Section
          id="pourquoi-choisir"
          headline="Pourquoi choisir SerpEditor ?"
          subheadline={<p>6 raisons de faire confiance à l'outil SEO français le plus complet.</p>}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">1. La plus grosse base de mots-clés français</Subheading>
                <Text className="mb-4">
                  Avec <strong>213+ millions de mots-clés français</strong> fournis par DataForSEO, SerpEditor surpasse
                  tous ses concurrents français :
                </Text>
                <ul className="space-y-1 text-mist-700 dark:text-mist-400">
                  <li>• +12% vs Haloscan (190M mots-clés)</li>
                  <li>• +113% vs Ranxplorer (100M mots-clés)</li>
                  <li>• +326% vs Semrush (~50M estimé)</li>
                </ul>
                <Text className="mt-4">
                  <strong>Résultat :</strong> Vous trouvez des opportunités de longue traîne que vos concurrents ne
                  voient pas.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">2. Données fraîches et fiables</Subheading>
                <Text className="mb-4">
                  Les données SerpEditor sont mises à jour <strong>quotidiennement</strong> grâce à l'infrastructure
                  DataForSEO :
                </Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Volumes de recherche réels (Google Ads)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Positions actualisées chaque jour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Backlinks crawlés en continu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Historique depuis 2019</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">3. Conçu pour les freelances français</Subheading>
                <Text className="mb-4">
                  Contrairement aux outils américains adaptés pour la France, SerpEditor est{' '}
                  <strong>pensé dès le départ pour le marché francophone</strong> :
                </Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Interface 100% en français</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Volumes de recherche .fr précis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Support client en français</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Prix adapté aux freelances (39€ vs 139€)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">4. Simplicité sans compromis</Subheading>
                <Text className="mb-4">
                  SerpEditor élimine 80% des fonctions inutiles de Semrush pour se concentrer sur ce qui compte :
                </Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>
                      <strong>1 clic = 1 résultat</strong> (pas de menus complexes)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>
                      <strong>Rapports clairs</strong> (pas de jargon technique)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>
                      <strong>Résultats en 10 secondes</strong> (pas d'attente)
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">5. Support réactif et disponible</Subheading>
                <Text className="mb-4">
                  Besoin d'aide ? Notre équipe répond en <strong>moins de 2 heures</strong> (en français) :
                </Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Chat en direct</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Email : support@serpeditor.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Documentation complète</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>Tutoriels vidéo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Subheading className="mb-4 text-xl">6. Transparence totale</Subheading>
                <Text className="mb-4">
                  Pas de frais cachés, pas d'engagement annuel forcé, pas de coûts additionnels :
                </Text>
                <ul className="space-y-2 text-mist-700 dark:text-mist-400">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>
                      <strong>39€/mois tout inclus</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>
                      <strong>Annulation en 1 clic</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span>
                      <strong>Pas d'augmentation surprise</strong>
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Base de données DataForSEO - Utilise StatsFourColumns */}
        <StatsFourColumns
          id="database"
          headline="Base de données massive alimentée par DataForSEO"
          subheadline={
            <p>
              SerpEditor s&apos;appuie sur <strong>DataForSEO</strong>, l&apos;une des infrastructures de données SEO
              les plus puissantes au monde. Vous bénéficiez ainsi de la même qualité de données que les grands outils
              internationaux, pour une fraction du prix.
            </p>
          }
        >
          <Stat stat="213+" text="Mots-clés français (millions)" />
          <Stat stat="2,8+" text="Backlinks actifs (trillions)" />
          <Stat stat="289+" text="Domaines analysés (millions)" />
          <Stat stat="336+" text="Pages indexées (milliards)" />
          <Stat stat="725+" text="SERPs Google (millions)" />
          <Stat stat="Quotidienne" text="Mise à jour des données" />
        </StatsFourColumns>

        {/* Section complémentaire DataForSEO */}
        <Section id="database-details">
          <div className="rounded-2xl border border-mist-200 bg-mist-50 p-6 dark:border-mist-800 dark:bg-mist-950">
            <Subheading className="mb-4 text-xl">Couverture géographique France</Subheading>
            <ul className="space-y-2 text-mist-700 dark:text-mist-400">
              <li className="flex items-start gap-2">
                <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <span>Tous les mots-clés Google France (.fr)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <span>Volumes de recherche mensuels</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <span>Données Google Ads (CPC, compétition)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <span>Recherches associées et PAA</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <span>Historique depuis 2019</span>
              </li>
            </ul>
            <Text className="mt-4">
              <strong>Pourquoi c'est important ?</strong> Une base de données plus grande = plus d'opportunités de
              mots-clés longue traîne à faible concurrence. Pendant que vos concurrents ciblent les mêmes 100 mots-clés
              génériques, vous identifiez des centaines de variantes moins compétitives mais tout aussi rentables.
            </Text>
            <Text className="mt-2 text-mist-600 italic dark:text-mist-500">
              Propulsé par DataForSEO, leader mondial de la data SEO utilisé par des milliers d'outils SEO
              professionnels.
            </Text>
          </div>
        </Section>

        {/* Pour qui est fait SerpEditor */}
        <Section
          id="pour-qui"
          headline="Pour qui est fait SerpEditor ?"
          subheadline={
            <p>
              SerpEditor est l'outil idéal pour les professionnels qui ont besoin d'analyses SEO fiables sans le prix
              prohibitif des grands outils américains.
            </p>
          }
        >
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl">👨‍💻</div>
                <Subheading className="mb-4 text-xl">Freelances SEO</Subheading>
                <Text className="mb-4">
                  Vous gérez 5-10 clients et avez besoin d'audits SEO, analyses backlinks et suivi de positions.
                  SerpEditor vous offre toutes ces fonctions pour <strong>39€/mois</strong> au lieu de payer 139€ pour
                  Semrush que vous n'utilisez qu'à 20%.
                </Text>
                <Subheading className="mb-2 text-lg">Bénéfices :</Subheading>
                <ul className="space-y-1 text-mist-700 dark:text-mist-400">
                  <li>• Rapports PDF client-ready</li>
                  <li>• Analyse rapide pour devis</li>
                  <li>• ROI immédiat : rentabilisé dès votre premier client</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl">🎯</div>
                <Subheading className="mb-4 text-xl">Consultants marketing digital</Subheading>
                <Text className="mb-4">
                  Vous proposez du SEO en complément de vos services (social media, Google Ads, content marketing).
                  SerpEditor vous permet d'ajouter une corde à votre arc sans investissement massif.
                </Text>
                <Subheading className="mb-2 text-lg">Bénéfices :</Subheading>
                <ul className="space-y-1 text-mist-700 dark:text-mist-400">
                  <li>• Diversification de votre offre</li>
                  <li>• Upsell facile sur vos clients existants</li>
                  <li>• Formation rapide (interface simple)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl">🏢</div>
                <Subheading className="mb-4 text-xl">PME et e-commerçants</Subheading>
                <Text className="mb-4">
                  Vous gérez le SEO de votre site en interne et cherchez un outil abordable pour suivre vos positions et
                  identifier les opportunités de mots-clés.
                </Text>
                <Subheading className="mb-2 text-lg">Bénéfices :</Subheading>
                <ul className="space-y-1 text-mist-700 dark:text-mist-400">
                  <li>• Budget maîtrisé (39€/mois)</li>
                  <li>• Autonomie totale</li>
                  <li>• Suivi quotidien de votre visibilité</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl">🎓</div>
                <Subheading className="mb-4 text-xl">Agences web</Subheading>
                <Text className="mb-4">
                  Vous créez des sites pour vos clients et voulez leur proposer un suivi SEO mensuel ou un audit
                  initial. SerpEditor vous permet de facturer ces services sans coûts fixes élevés.
                </Text>
                <Subheading className="mb-2 text-lg">Bénéfices :</Subheading>
                <ul className="space-y-1 text-mist-700 dark:text-mist-400">
                  <li>• Revenus récurrents faciles</li>
                  <li>• Différenciation vs concurrence</li>
                  <li>• Marges confortables (facturez 150-300€, payez 39€)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Témoignages - Utilise TestimonialThreeColumnGrid directement */}
        <TestimonialThreeColumnGrid
          id="testimonials"
          headline="Ce que disent nos utilisateurs"
          subheadline={<p>4.8/5 — Note moyenne sur 127 avis vérifiés</p>}
        >
          <Testimonial
            quote={
              <p>
                "J'ai utilisé Semrush pendant 3 ans mais j'en avais marre de payer 139€/mois pour utiliser seulement
                l'audit SEO et le suivi de positions. SerpEditor fait exactement la même chose pour 39€. J'ai économisé
                1200€ cette année et je n'ai rien perdu en fonctionnalités."
              </p>
            }
            img={
              <Image
                src="https://assets.tailwindplus.com/avatars/10.webp?size=160"
                alt="Marc D."
                className="not-dark:bg-white/75 dark:bg-black/75"
                width={160}
                height={160}
              />
            }
            name="Marc D."
            byline="Consultant SEO à Lyon"
          />
          <Testimonial
            quote={
              <p>
                "Interface en français, support en français, données France précises... et surtout un prix qui ne ruine
                pas un freelance ! Je recommande SerpEditor à tous mes confrères."
              </p>
            }
            img={
              <Image
                src="https://assets.tailwindplus.com/avatars/11.webp?size=160"
                alt="Sophie L."
                className="not-dark:bg-white/75 dark:bg-black/75"
                width={160}
                height={160}
              />
            }
            name="Sophie L."
            byline="Freelance webmarketing à Nantes"
          />
          <Testimonial
            quote={
              <p>
                "Ce que j'aime chez SerpEditor : pas de fioritures, des résultats clairs en 10 secondes. Je passe moins
                de temps sur l'outil et plus de temps à créer du contenu et des liens. Exactement ce que je cherchais."
              </p>
            }
            img={
              <Image
                src="https://assets.tailwindplus.com/avatars/12.webp?size=160"
                alt="Thomas R."
                className="not-dark:bg-white/75 dark:bg-black/75"
                width={160}
                height={160}
              />
            }
            name="Thomas R."
            byline="Blogueur professionnel"
          />
          <Testimonial
            quote={
              <p>
                "J'ai testé Haloscan, Ranxplorer, SE Ranking et SerpEditor. Pour le marché français et pour un
                freelance, SerpEditor offre le meilleur équilibre entre fonctionnalités, simplicité et prix."
              </p>
            }
            img={
              <Image
                src="https://assets.tailwindplus.com/avatars/13.webp?size=160"
                alt="Julie M."
                className="not-dark:bg-white/75 dark:bg-black/75"
                width={160}
                height={160}
              />
            }
            name="Julie M."
            byline="Consultante SEO freelance"
          />
        </TestimonialThreeColumnGrid>

        {/* FAQ - Utilise FAQsTwoColumnAccordion directement */}
        <FAQsTwoColumnAccordion id="faqs" headline="Questions fréquentes (FAQ)">
          <Faq
            id="faq-1"
            question="Quelle est la différence entre SerpEditor et Semrush ?"
            answer="Les principales différences sont le prix (39€ vs 139€), la simplicité (interface épurée vs complexe) et la cible (freelances français vs grandes agences internationales). SerpEditor se concentre sur les 5 fonctions essentielles utilisées par 90% des SEO, tandis que Semrush propose 50+ outils dont la plupart ne seront jamais utilisés. Les deux s'appuient sur des bases de données professionnelles (DataForSEO pour SerpEditor), mais SerpEditor offre une meilleure couverture du marché français (213M mots-clés vs ~50M pour Semrush)."
          />
          <Faq
            id="faq-2"
            question="SerpEditor est-il vraiment adapté au marché français ?"
            answer="Oui, absolument. SerpEditor utilise les données DataForSEO spécialisées pour la France avec 213+ millions de mots-clés français. Tous les volumes de recherche sont des données Google France réelles, les positions sont géolocalisées sur Google.fr, et l'interface est 100% en français. Contrairement aux outils américains adaptés pour l'international, SerpEditor est optimisé dès le départ pour le marché francophone."
          />
          <Faq
            id="faq-3"
            question="Puis-je annuler mon abonnement facilement ?"
            answer="Oui. Vous pouvez annuler votre abonnement en 1 clic depuis votre compte SerpEditor. Pas de période d'engagement minimale, pas de pénalités, pas de frais cachés. Si vous annulez, vous conservez l'accès jusqu'à la fin de votre période payée, puis l'abonnement s'arrête automatiquement. Pas de reconduction forcée, pas de justification à donner."
          />
          <Faq
            id="faq-4"
            question="Quelle est la taille de votre base de données ?"
            answer="SerpEditor s'appuie sur l'infrastructure DataForSEO, l'une des plus grandes bases de données SEO commerciales au monde : 213+ millions de mots-clés français (vs ~100M pour Ranxplorer, 190M pour Haloscan), 2,8+ trillions de backlinks actifs analysés en continu, 289+ millions de domaines indexés, 336+ milliards de pages crawlées, mise à jour quotidienne des données. Nos données sont équivalentes ou supérieures aux grands outils internationaux, pour une fraction du prix."
          />
          <Faq
            id="faq-5"
            question="L'essai gratuit nécessite-t-il une carte bancaire ?"
            answer="Non. Vous pouvez tester SerpEditor 7 jours gratuitement sans entrer de carte bancaire. Inscrivez-vous avec votre email, explorez toutes les fonctionnalités, et décidez ensuite si vous souhaitez continuer. Aucun prélèvement automatique, aucun engagement. Si vous ne faites rien après les 7 jours, votre compte passe simplement en mode gratuit limité (pas de débit caché)."
          />
          <Faq
            id="faq-6"
            question="Proposez-vous une API ?"
            answer="Oui. SerpEditor inclut un accès API dès le plan à 39€/mois. Notre API RESTful vous donne accès à toutes les données DataForSEO : recherche de mots-clés, analyse backlinks, positions Google, métriques de domaines. Documentation complète disponible, rate limits généreux adaptés aux agences, support développeur en français."
          />
          <Faq
            id="faq-7"
            question="Combien de sites puis-je analyser ?"
            answer="Le plan à 39€/mois inclut : audits SEO illimités (analysez autant de sites que vous voulez), suivi de positions pour 500 mots-clés, analyse backlinks illimitée (n'importe quel domaine), recherche de mots-clés illimitée. Pas de limitation artificielle sur le nombre de sites analysés. Idéal pour les freelances gérant plusieurs clients."
          />
          <Faq
            id="faq-8"
            question="Les données sont-elles mises à jour en temps réel ?"
            answer='Les positions Google et les backlinks sont mis à jour quotidiennement. Les volumes de recherche et métriques de mots-clés sont rafraîchis plusieurs fois par semaine. Pour les données en temps réel absolu (crawl instantané), nous proposons une option "Live Data" en supplément, mais pour 99% des cas d&apos;usage, les données quotidiennes sont largement suffisantes.'
          />
          <Faq
            id="faq-9"
            question="Puis-je exporter mes rapports ?"
            answer="Oui. Tous les rapports SerpEditor peuvent être exportés en PDF (format professionnel pour vos clients) ou CSV (pour vos analyses Excel). Les rapports PDF sont client-ready : design professionnel, votre logo personnalisé, explications claires. Parfait pour facturer vos prestations de consulting."
          />
          <Faq
            id="faq-10"
            question="Offrez-vous une réduction pour les annuels ?"
            answer="Oui. Si vous payez annuellement, vous bénéficiez de 2 mois offerts : Mensuel : 39€/mois = 468€/an, Annuel : 390€/an (soit 32,50€/mois) — Économisez 78€. L'abonnement annuel reste sans engagement : vous pouvez demander un remboursement au prorata si vous changez d'avis."
          />
          <Faq
            id="faq-11"
            question="Proposez-vous des formations ou tutoriels ?"
            answer="Oui. Tous les utilisateurs SerpEditor ont accès à : base de connaissances complète (articles, guides pas-à-pas), tutoriels vidéo (chaque fonctionnalité expliquée en français), webinaires mensuels (sessions live Q&A), support chat (réponse en moins de 2h). Notre objectif : vous rendre autonome rapidement. La plupart des utilisateurs maîtrisent l'outil en moins d'une heure."
          />
        </FAQsTwoColumnAccordion>

        {/* CTA Essai gratuit - Utilise CallToActionSimpleCentered */}
        <CallToActionSimpleCentered
          id="essai-gratuit"
          headline="Commencez votre essai gratuit maintenant"
          subheadline={
            <>
              <p>
                <strong>✅ Essai 7 jours — 100% gratuit, sans carte bancaire</strong>
              </p>
              <p className="mt-4">
                <strong>Ce que vous obtenez pendant l&apos;essai :</strong>
              </p>
              <ul className="mt-2 space-y-1 text-mist-700 dark:text-mist-400">
                <li>• Accès complet à toutes les fonctionnalités</li>
                <li>• 213M+ mots-clés français</li>
                <li>• Audits SEO illimités</li>
                <li>• Analyse backlinks complète</li>
                <li>• Suivi de 500 positions Google</li>
                <li>• Support client en français</li>
              </ul>
              <p className="mt-4">
                <strong>Aucune carte bancaire requise. Aucun engagement. Annulation en 1 clic.</strong>
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/register" size="lg">
                🚀 Créer mon compte gratuit
              </ButtonLink>
            </div>
          }
        />

        {/* Pricing */}
        <Section
          id="pricing"
          headline="Un seul plan, tout inclus : 39€/mois"
          subheadline={<p>Pas de complexité, pas de calculs, pas de mauvaises surprises.</p>}
        >
          <PricingMultiTier
            plans={
              <>
                <Plan
                  name="SerpEditor"
                  price="39"
                  period="€/mois"
                  subheadline={<p>Tout ce dont vous avez besoin pour optimiser votre SEO</p>}
                  badge="Le plus populaire"
                  features={[
                    '213+ millions de mots-clés français',
                    '2,8+ trillions de backlinks',
                    'Audits SEO illimités',
                    'Suivi de 500 mots-clés',
                    'Analyse concurrentielle',
                    'API complète',
                    'Exports PDF/CSV illimités',
                    'Support prioritaire en français',
                  ]}
                  cta={
                    <ButtonLink href="/register" size="lg">
                      Commencer maintenant
                    </ButtonLink>
                  }
                />
              </>
            }
          />

          <div className="mt-8 rounded-2xl border border-mist-200 bg-mist-50 p-6 dark:border-mist-800 dark:bg-mist-950">
            <Subheading className="mb-4 text-xl">💡 Besoin d'un volume supérieur ?</Subheading>
            <Text className="mb-4">
              Vous êtes une agence gérant des dizaines de clients ? Contactez-nous pour un{' '}
              <strong>plan sur mesure</strong> avec :
            </Text>
            <ul className="space-y-2 text-mist-700 dark:text-mist-400">
              <li>• Suivi de 5000+ mots-clés</li>
              <li>• Comptes utilisateurs multiples</li>
              <li>• API rate limits élevés</li>
              <li>• Support prioritaire dédié</li>
              <li>• Formation équipe incluse</li>
            </ul>
            <div className="mt-4">
              <ButtonLink href="/contact" size="lg">
                Contactez-nous pour un devis
              </ButtonLink>
            </div>
          </div>
        </Section>

        {/* Pourquoi attendre - Utilise CallToActionSimpleCentered */}
        <CallToActionSimpleCentered
          id="pourquoi-attendre"
          headline="Pourquoi attendre ? Testez SerpEditor dès aujourd'hui"
          subheadline={
            <>
              <p>
                <strong>Vous hésitez encore ?</strong> Voici un calcul simple :
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-mist-200 dark:border-mist-800">
                      <th className="p-4 text-left font-semibold text-mist-950 dark:text-white">Scénario</th>
                      <th className="p-4 text-left font-semibold text-mist-950 dark:text-white">Coût</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-mist-200 dark:border-mist-800">
                      <td className="p-4 font-medium text-mist-950 dark:text-white">Continuer avec Semrush</td>
                      <td className="p-4 text-mist-700 dark:text-mist-400">
                        139€/mois = <strong>1668€/an</strong>
                      </td>
                    </tr>
                    <tr className="border-b border-mist-200 dark:border-mist-800">
                      <td className="p-4 font-medium text-mist-950 dark:text-white">Passer à SerpEditor</td>
                      <td className="p-4 text-mist-700 dark:text-mist-400">
                        39€/mois = <strong>468€/an</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-primary p-4 font-medium">💰 Économies</td>
                      <td className="text-primary p-4 font-bold">1200€/an</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Text className="mt-6">
                <strong>Avec 1200€ économisés, vous pouvez :</strong>
              </Text>
              <ul className="mt-2 space-y-1 text-mist-700 dark:text-mist-400">
                <li>• Investir dans des backlinks de qualité</li>
                <li>• Embaucher un rédacteur freelance pour votre blog</li>
                <li>• Lancer des campagnes Google Ads</li>
                <li>• Acheter des formations SEO avancées</li>
                <li>• Ou simplement augmenter vos marges</li>
              </ul>
              <Text className="mt-6">
                <strong>
                  La vraie question n&apos;est pas &quot;Pourquoi tester SerpEditor ?&quot; mais &quot;Pourquoi
                  continuer à payer 3x trop cher ?&quot;
                </strong>
              </Text>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/register" size="lg">
                Commencer mon essai gratuit
              </ButtonLink>
            </div>
          }
        />
      </Main>

      <FooterWithNewsletterFormCategoriesAndSocialIcons
        id="footer"
        cta={
          <NewsletterForm
            headline="Restez informé"
            subheadline={
              <p>
                Recevez nos meilleurs conseils SEO et les dernières tendances du marketing digital directement dans
                votre boîte mail.
              </p>
            }
            action="#"
          />
        }
        links={
          <>
            <FooterCategory title="Product">
              <FooterLink href="/features">Fonctionnalités</FooterLink>
              <FooterLink href="/pricing">Prix</FooterLink>
              <FooterLink href="#">Intégrations</FooterLink>
            </FooterCategory>
            <FooterCategory title="Company">
              <FooterLink href="#">À propos</FooterLink>
              <FooterLink href="#">Carrières</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </FooterCategory>
            <FooterCategory title="Resources">
              <FooterLink href="#">Centre d'aide</FooterLink>
              <FooterLink href="#">Documentation API</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </FooterCategory>
            <FooterCategory title="Legal">
              <FooterLink href="/privacy-policy">Politique de confidentialité</FooterLink>
              <FooterLink href="#">Conditions d'utilisation</FooterLink>
              <FooterLink href="#">Sécurité</FooterLink>
            </FooterCategory>
          </>
        }
        fineprint="© 2025 SerpEditor, Inc."
        socialLinks={
          <>
            <SocialLink href="https://x.com" name="X">
              <XIcon />
            </SocialLink>
            <SocialLink href="https://github.com" name="GitHub">
              <GitHubIcon />
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

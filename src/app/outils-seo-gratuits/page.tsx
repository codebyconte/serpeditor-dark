import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { Section } from '@/components/elements/section'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import { CallToActionSimpleCentered } from '@/components/sections/call-to-action-simple-centered'
import { Faq, FAQsTwoColumnAccordion } from '@/components/sections/faqs-two-column-accordion'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import { ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Outils SEO Gratuit 2026 : La Liste Ultime (Audit, Mots-Clés, IA)',
  description:
    'Accédez aux meilleurs outils SEO gratuits en ligne. Audit technique, recherche de mots-clés, analyse de backlinks et visibilité IA. Testez votre site gratuitement.',
  keywords: [
    'outils seo gratuit',
    'outil seo gratuit en ligne',
    'audit seo gratuit',
    'meilleur outil seo gratuit',
    'test seo gratuit',
  ],
}

export default function OutilsSeoGratuitPage() {
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
          headline="Outils SEO gratuit — Boostez votre référencement sans budget"
          subheadline={
            <>
              <p>
                Le SEO ne devrait pas être réservé aux grosses entreprises. En 2026, il existe des dizaines de solutions
                pour analyser votre site gratuitement. Que vous cherchiez un <strong>outil SEO gratuit en ligne</strong>{' '}
                pour un audit rapide ou un générateur de mots-clés, nous avons rassemblé les meilleures ressources du
                marché.
              </p>
              <p>
                Découvrez notre suite d&apos;<strong>outils SEO gratuit</strong> conçue par des experts pour des
                résultats immédiats. Pas de carte bancaire, pas d&apos;engagement : juste de la donnée brute pour vous
                aider à dominer la SERP.
              </p>
            </>
          }
        />

        <Section>
          <div className="flex flex-col items-center gap-10 text-center">
            <Subheading>La suite d’outils SEO gratuits commence ici</Subheading>
            <Text className="max-w-2xl">
              Nous lançons une suite d’outils SEO gratuits pour aider les sites à mieux performer sur Google. Le premier
              disponible est notre audit SEO technique gratuit, qui analyse votre site et détecte vos erreurs en 60
              secondes.
            </Text>
            <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
              {/* Encart 1 : Audit SEO Technique Gratuit */}
              <div className="flex flex-col items-center gap-4 rounded-xl border border-mist-100 bg-white/60 p-6 shadow-sm dark:border-mist-800 dark:bg-mist-950/60">
                <h3 className="text-lg font-semibold">Audit SEO Technique Gratuit</h3>
                <Text>
                  Analysez votre site gratuitement et détectez les erreurs techniques bloquantes en moins de 60
                  secondes.
                </Text>
                <ButtonLink href="/outils-seo-gratuits/audit-seo" size="lg">
                  Lancer l&apos;audit gratuit
                </ButtonLink>
              </div>
            </div>
            <p className="text-sm text-mist-300">
              D’autres outils gratuits arrivent bientôt : analyse sémantique IA, monitoring de positions, et plus
              encore…
            </p>
          </div>
        </Section>

        {/* Tools Categories Section */}
        <Section id="outils">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-6 text-center">
              <Subheading>Le Top des Outils SEO Gratuit par Catégorie</Subheading>
              <Text className="mx-auto max-w-3xl">
                Pour être n°1, nous avons sélectionné les outils indispensables en complément de notre suite SerpEditor.
              </Text>
            </div>

            {/* Category 1: Recherche de Mots-Clés */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-xl font-semibold">Recherche de Mots-Clés & Sémantique</h3>
                  <p className="text-sm text-mist-600 dark:text-mist-400">
                    Découvrez les meilleurs outils gratuits pour votre recherche de mots-clés
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="group bg-mist-900 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Google Keyword Planner</CardTitle>
                    </div>
                    <CardDescription>La base de données officielle de Google Ads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://ads.google.com/home/tools/keyword-planner/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Accéder à l&apos;outil
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>

                <Card className="group bg-mist-900 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">AnswerThePublic</CardTitle>
                    </div>
                    <CardDescription>Pour découvrir les questions que se posent les internautes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://answerthepublic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Accéder à l&apos;outil
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>

                <Card className="group bg-mist-900 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Ubersuggest</CardTitle>
                    </div>
                    <CardDescription>Un outil complet pour débuter votre recherche sémantique</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://neilpatel.com/fr/ubersuggest/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Accéder à l&apos;outil
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Divider />

            {/* Category 2: Analyse de Backlinks */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-xl font-semibold">Analyse de Backlinks (Netlinking)</h3>
                  <p className="text-sm text-mist-600 dark:text-mist-400">
                    Analysez votre profil de liens avec ces outils gratuits
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="group bg-mist-900 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Ahrefs Backlink Checker</CardTitle>
                    </div>
                    <CardDescription>Pour voir les 100 premiers liens de n&apos;importe quel site</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://ahrefs.com/backlink-checker"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Accéder à l&apos;outil
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>

                <Card className="group bg-mist-900 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Moz Link Explorer</CardTitle>
                    </div>
                    <CardDescription>Excellent pour suivre votre Domain Authority (DA)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://moz.com/link-explorer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Accéder à l&apos;outil
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>

                <Card className="group bg-mist-900 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Majestic SEO</CardTitle>
                    </div>
                    <CardDescription>
                      Pour analyser le Trust Flow de vos domaines référents (Version démo)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://majestic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Accéder à l&apos;outil
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Divider />

            {/* Category 3: Audit Technique */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-xl font-semibold">Audit Technique & Performance</h3>
                  <p className="text-sm text-mist-600 dark:text-mist-400">
                    Vérifiez la santé technique de votre site avec ces outils gratuits
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="group bg-mist-900 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Google PageSpeed Insights</CardTitle>
                    </div>
                    <CardDescription>L&apos;outil de référence pour les Core Web Vitals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://pagespeed.web.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Accéder à l&apos;outil
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>

                <Card className="group bg-mist-900 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Google Search Console</CardTitle>
                    </div>
                    <CardDescription>
                      Le seul outil SEO gratuit indispensable pour communiquer avec Google
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Accéder à l&apos;outil
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>

                <Card className="group bg-mist-900 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Screaming Frog</CardTitle>
                    </div>
                    <CardDescription>Crawler complet jusqu&apos;à 500 URLs (Version gratuite)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://www.screamingfrog.co.uk/seo-spider/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Accéder à l&apos;outil
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Section>

        {/* Comparison Table */}
        <Section>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 text-center">
              <Subheading>Pourquoi utiliser les outils gratuits de SerpEditor ?</Subheading>
              <Text className="mx-auto max-w-3xl">
                Découvrez les avantages de nos outils SEO gratuits par rapport aux solutions classiques.
              </Text>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-mist-950/10 dark:border-white/10">
                    <th className="py-4 pr-6 font-semibold text-mist-950 dark:text-white">Fonctionnalité</th>
                    <th className="px-6 py-4 text-center font-semibold text-mist-950 dark:text-white">
                      Outils Gratuits Classiques
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-mist-950 dark:text-white">
                      SerpEditor Gratuit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-950/5 dark:divide-white/5">
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Limites journalières
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">Souvent 1 à 3 recherches</td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>Illimité</strong>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Précision des données
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">Données datées</td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>Temps Réel (Mise à jour 2026)</strong>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-4 pr-6 font-medium text-mist-700 dark:text-mist-400">
                      Support en français
                    </th>
                    <td className="px-6 py-4 text-center text-mist-600 dark:text-mist-500">
                      <span className="text-red-600">❌ Non</span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-mist-950 dark:text-white">
                      <strong>✅ Oui (Expert SEO)</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* FAQ Section */}
        <FAQsTwoColumnAccordion
          headline="Questions fréquentes sur les outils SEO gratuits"
          subheadline={
            <>
              <p>
                Tout ce que vous devez savoir sur les <strong>outils SEO gratuits</strong> et comment les utiliser
                efficacement.
              </p>
            </>
          }
        >
          <Faq
            question="Quel est le meilleur outil SEO gratuit ?"
            answer={
              <>
                <p>
                  Le &quot;meilleur&quot; dépend de votre besoin. Pour la technique, la{' '}
                  <strong>Google Search Console</strong> est imbattable.
                </p>
              </>
            }
          />
          <Faq
            question="Un outil gratuit est-il suffisant pour ranker n°1 ?"
            answer={
              <>
                <p>
                  Pour un blog personnel ou un site local (ex: SEO à Brest), un{' '}
                  <strong>outil SEO gratuit en ligne</strong> est souvent suffisant. Pour des secteurs
                  ultra-concurrentiels, passer à une version pro permet d&apos;automatiser le suivi et d&apos;analyser
                  la concurrence en profondeur.
                </p>
              </>
            }
          />
          <Faq
            question="Comment faire un audit SEO gratuit sans logiciel ?"
            answer={
              <>
                <p>
                  Vous pouvez vérifier manuellement vos balises <code>Title</code> et <code>H1</code> en faisant un clic
                  droit sur votre page &gt; &quot;Inspecter&quot;. Cependant, l&apos;utilisation d&apos;un{' '}
                  <strong>outil SEO gratuit</strong> comme le nôtre vous fera gagner des heures de travail manuel.
                </p>
              </>
            }
          />
          <Faq
            question="Les outils SEO gratuits sont-ils vraiment gratuits ?"
            answer={
              <>
                <p>
                  Oui, nos outils SEO gratuits sont <strong>100% gratuits</strong> sans carte bancaire ni engagement.
                  Certaines fonctionnalités avancées nécessitent un abonnement, mais les bases sont accessibles à tous.
                </p>
              </>
            }
          />
          <Faq
            question="Combien de temps prend un audit SEO gratuit ?"
            answer={
              <>
                <p>
                  Notre audit SEO gratuit prend généralement <strong>60 secondes</strong> pour analyser votre site. Le
                  temps peut varier selon la taille de votre site, mais la plupart des audits sont terminés en moins de
                  2 minutes.
                </p>
              </>
            }
          />
          <Faq
            question="Puis-je utiliser les outils gratuits pour plusieurs sites ?"
            answer={
              <>
                <p>Oui, vous pouvez utiliser nos outils SEO gratuits pour analyser plusieurs sites.</p>
              </>
            }
          />
        </FAQsTwoColumnAccordion>

        {/* Final CTA */}
        <CallToActionSimpleCentered
          headline="Prêt à passer d’amateur à pro en SEO ?"
          subheadline={
            <>
              <p>
                {' '}
                Nos outils gratuits sont parfaits pour démarrer. Mais pour <strong>dominer votre marché</strong>, vous
                aurez besoin d’un <strong>véritable outil SEO professionnel</strong>.{' '}
              </p>
            </>
          }
          cta={
            <div className="flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/" size="lg">
                Passer à l’outil SEO professionnel →
              </ButtonLink>
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

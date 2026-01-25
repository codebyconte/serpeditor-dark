import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Container } from '@/components/elements/container'
import { Main } from '@/components/elements/main'
import { Section } from '@/components/elements/section'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { Faq, FAQsTwoColumnAccordion } from '@/components/sections/faqs-two-column-accordion'
import { Feature, FeaturesThreeColumn } from '@/components/sections/features-three-column'
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
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  FileSearch,
  FileText,
  Globe,
  Link2,
  Rocket,
  Search,
  Shield,
  Smartphone,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { AuditSeoForm } from './audit-seo-form'

export const metadata: Metadata = {
  title: 'Audit SEO gratuit : Analysez votre site en 60s',
  description:
    "Réalisez un audit SEO en ligne complet et gratuit. Analysez +120 points (Technique, Contenu, Backlinks). Outil d'analyse SEO immédiat sans inscription.",
  keywords:
    'audit seo, audit seo gratuit, audit seo technique, outil audit seo, analyse seo, audit site web, audit seo complet',
  alternates: {
    canonical: 'https://www.serpeditor.fr/outils-seo-gratuits/audit-seo',
  },
}

export default function AuditSeoPage() {
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
        {/* HERO SECTION */}
        <HeroSimpleLeftAligned
          id="hero"
          headline="Audit SEO gratuit — Analysez votre site web en 60 secondes"
          subheadline={
            <>
              <p>
                Votre site n&apos;apparaît pas sur Google ? Vous perdez du trafic sans comprendre pourquoi ?{' '}
                <strong>Réalisez un audit SEO gratuit de votre page web</strong> en moins d&apos;une minute et découvrez
                exactement ce qui freine votre référencement naturel.
              </p>
              <p>
                Notre <strong>outil d&apos;audit SEO en ligne</strong> analyse <strong>120+ points de contrôle</strong>{' '}
                : erreurs techniques, problèmes de contenu, vitesse de chargement, compatibilité mobile, liens cassés,
                balises manquantes. <strong>Résultats instantanés sans inscription.</strong>
              </p>
            </>
          }
        />

        {/* FORMULAIRE D'AUDIT */}
        <section className="pb-8">
          <Container>
            <AuditSeoForm />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-mist-600 dark:text-mist-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Sans inscription
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Résultats en 60 secondes
              </span>

              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> 120+ critères SEO
              </span>
            </div>
          </Container>
        </section>

        {/* SECTION : QU'EST-CE QU'UN AUDIT SEO */}
        <Section
          id="definition"
          eyebrow="Comprendre l'audit SEO"
          headline="Qu'est-ce qu'un audit SEO ?"
          subheadline={
            <p>
              Un <strong>audit SEO</strong> (Search Engine Optimization) est une{' '}
              <strong>analyse approfondie de votre site web</strong> qui identifie tous les problèmes techniques, de
              contenu et de structure qui empêchent votre site d&apos;être bien positionné sur Google et les autres
              moteurs de recherche.
            </p>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: AlertTriangle,
                text: 'Les erreurs techniques : pages en erreur 404, redirections cassées, temps de chargement lent',
              },
              {
                icon: FileText,
                text: 'La structure du contenu : balises title, meta descriptions, titres H1-H6, densité de mots-clés',
              },
              {
                icon: Smartphone,
                text: "L'optimisation mobile : compatibilité responsive, ergonomie tactile, Core Web Vitals",
              },
              {
                icon: Zap,
                text: "Les performances : vitesse d'affichage, First Contentful Paint, optimisation images",
              },
              { icon: Link2, text: 'Le maillage interne : liens internes, navigation, profondeur de pages' },
              { icon: Shield, text: 'La sécurité : certificat SSL, protocole HTTPS, contenu mixte' },
              { icon: Globe, text: "L'indexation : présence sitemap.xml, fichier robots.txt, balises canonical" },
            ].map((item, index) => (
              <Card key={index} className="border-green-500/20 bg-green-500/5">
                <CardContent className="flex items-start gap-3 p-4">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <p className="text-sm text-mist-700 dark:text-mist-300">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="border-primary/20 bg-primary/5 mt-8 rounded-xl border p-6">
            <p className="text-mist-700 dark:text-mist-300">
              <strong className="text-mist-950 dark:text-white">En résumé :</strong> Un{' '}
              <strong>audit SEO gratuit</strong> est comme un <strong>check-up médical pour votre site web</strong>. Il
              révèle ce qui fonctionne, ce qui dysfonctionne et surtout, <strong>comment corriger les problèmes</strong>{' '}
              pour améliorer votre visibilité sur les moteurs de recherche.
            </p>
          </div>
        </Section>

        {/* SECTION : LES 4 PILIERS DU SEO */}
        <Section
          id="piliers"
          eyebrow="Les fondamentaux"
          headline="Quels sont les 4 piliers du SEO ?"
          subheadline={
            <p>
              Le <strong>référencement naturel (SEO)</strong> repose sur <strong>4 piliers fondamentaux</strong> qui
              déterminent votre position sur Google. Un audit SEO technique complet examine chacun de ces piliers.
            </p>
          }
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-mist-800/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Zap className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-mist-950 dark:text-white">1. SEO Technique</h3>
                <p className="mb-4 text-sm text-mist-700 dark:text-mist-400">
                  Concerne tous les aspects &quot;invisibles&quot; de votre site web qui permettent aux moteurs de
                  recherche de le crawler et l&apos;indexer correctement.
                </p>
                <ul className="space-y-1 text-sm text-mist-600 dark:text-mist-400">
                  <li>• Vitesse de chargement (Core Web Vitals)</li>
                  <li>• Architecture du site et structure des URLs</li>
                  <li>• Fichiers robots.txt et sitemap.xml</li>
                  <li>• Certificat SSL et HTTPS</li>
                  <li>• Compatibilité mobile</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-mist-800/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <FileText className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-mist-950 dark:text-white">2. SEO On-Page (Contenu)</h3>
                <p className="mb-4 text-sm text-mist-700 dark:text-mist-400">
                  Regroupe toutes les optimisations à l&apos;intérieur de vos pages web : contenu, balises HTML,
                  mots-clés.
                </p>
                <ul className="space-y-1 text-sm text-mist-600 dark:text-mist-400">
                  <li>• Balises title optimisées (50-60 caractères)</li>
                  <li>• Meta descriptions attractives</li>
                  <li>• Structure des titres (H1 unique, H2-H6)</li>
                  <li>• Qualité du contenu</li>
                  <li>• Maillage interne</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-mist-800/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Link2 className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-mist-950 dark:text-white">3. SEO Off-Page (Autorité)</h3>
                <p className="mb-4 text-sm text-mist-700 dark:text-mist-400">
                  Concerne votre réputation en dehors de votre site, principalement via les backlinks.
                </p>
                <ul className="space-y-1 text-sm text-mist-600 dark:text-mist-400">
                  <li>• Nombre et qualité des backlinks</li>
                  <li>• Autorité des sites référents</li>
                  <li>• Diversité des sources de liens</li>
                  <li>• Ancres de liens</li>
                  <li>• Mentions de marque</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-mist-800/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <BarChart3 className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-mist-950 dark:text-white">4. SEO UX (Expérience)</h3>
                <p className="mb-4 text-sm text-mist-700 dark:text-mist-400">
                  Mesure comment les visiteurs interagissent avec votre site. Facteur de ranking majeur depuis Page
                  Experience Update.
                </p>
                <ul className="space-y-1 text-sm text-mist-600 dark:text-mist-400">
                  <li>• Taux de rebond</li>
                  <li>• Temps passé sur le site</li>
                  <li>• Navigation intuitive</li>
                  <li>• Design adapté mobile</li>
                  <li>• Accessibilité</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 rounded-xl border border-mist-200 bg-mist-50 p-6 dark:border-mist-800 dark:bg-mist-900/50">
            <p className="text-mist-700 dark:text-mist-300">
              <strong className="text-primary">Note :</strong> Notre audit SEO gratuit se concentre sur les{' '}
              <strong>piliers 1 et 2</strong> (technique + on-page) qui représentent 70% des optimisations SEO. 
            
            </p>
          </div>
        </Section>

        {/* SECTION : POURQUOI FAIRE UN AUDIT */}
        <Section id="pourquoi" eyebrow="Les bénéfices" headline="Pourquoi faire un audit SEO de votre site web ?">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-mist-800/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Search className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-mist-950 dark:text-white">
                  Identifier ce qui freine votre référencement
                </h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  <strong>95% des sites web ont des erreurs SEO cachées</strong> : pages lentes, balises dupliquées,
                  contenu trop court, liens cassés, site non-mobile-friendly. L&apos;audit révèle exactement quels
                  problèmes affectent votre référencement.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-mist-800/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-mist-950 dark:text-white">
                  Augmenter votre trafic organique
                </h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Le SEO représente en moyenne <strong>53% du trafic total d&apos;un site web</strong>. Un site bien
                  optimisé après audit peut multiplier son trafic par 2-5x en 6 mois et attirer des visiteurs qualifiés
                  gratuitement.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-mist-800/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <Rocket className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-mist-950 dark:text-white">
                  Économiser sur la publicité
                </h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Chaque visiteur provenant de Google est gratuit. 1000 visiteurs/mois par le SEO = 1000€/mois
                  d&apos;économie sur Google Ads, soit <strong>12 000€/an</strong>. L&apos;audit SEO est un
                  investissement rentable rapidement.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-mist-800/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-mist-950 dark:text-white">
                  Détecter les problèmes avant qu&apos;ils ne s&apos;aggravent
                </h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Certaines erreurs non corrigées entraînent : pénalité Google, perte de positions, baisse de trafic
                  jusqu&apos;à -50%, problèmes d&apos;indexation. Un <strong>audit régulier (tous les 3-6 mois)</strong>{' '}
                  prévient ces catastrophes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-mist-800/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <Globe className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-mist-950 dark:text-white">Espionner vos concurrents</h3>
                <p className="text-sm text-mist-700 dark:text-mist-400">
                  Analysez les pages de vos concurrents pour découvrir leurs points faibles, leurs stratégies de
                  mots-clés, leurs optimisations on-page et comparer leur vitesse à la vôtre.
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* SECTION : 120+ POINTS ANALYSÉS */}
        <FeaturesThreeColumn
          id="fonctionnalites"
          eyebrow="120+ points de contrôle"
          headline="Ce que notre audit SEO gratuit analyse"
          subheadline={
            <p>
              Notre <strong>outil d&apos;audit SEO en ligne</strong> examine <strong>plus de 120 critères</strong> sur
              la page que vous choisissez d&apos;analyser.
            </p>
          }
          features={
            <>
              <Feature
                icon={<Zap className="h-5 w-5" />}
                headline="Audit SEO Technique (35 points)"
                subheadline={
                  <ul className="list-inside list-disc space-y-1">
                    <li>Core Web Vitals (LCP, FID, CLS)</li>
                    <li>Temps de chargement total</li>
                    <li>Optimisation des images</li>
                    <li>Minification CSS/JavaScript</li>
                    <li>Certificat SSL valide</li>
                    <li>Redirections (301, 302)</li>
                    <li>Compression GZIP/Brotli</li>
                  </ul>
                }
              />
              <Feature
                icon={<FileSearch className="h-5 w-5" />}
                headline="Analyse On-Page (30 points)"
                subheadline={
                  <ul className="list-inside list-disc space-y-1">
                    <li>Balise title (présence, longueur)</li>
                    <li>Meta description</li>
                    <li>Structure H1-H6</li>
                    <li>Densité des mots-clés</li>
                    <li>Lisibilité du texte</li>
                    <li>Ratio texte/HTML</li>
                    <li>Détection contenu dupliqué</li>
                  </ul>
                }
              />
              <Feature
                icon={<Smartphone className="h-5 w-5" />}
                headline="Compatibilité Mobile (20 points)"
                subheadline={
                  <ul className="list-inside list-disc space-y-1">
                    <li>Design responsive</li>
                    <li>Viewport configuré</li>
                    <li>Taille des boutons tactiles</li>
                    <li>Police lisible sur mobile</li>
                    <li>Vitesse mobile</li>
                    <li>Pop-ups intrusifs</li>
                  </ul>
                }
              />
              <Feature
                icon={<Link2 className="h-5 w-5" />}
                headline="Analyse des Liens (15 points)"
                subheadline={
                  <ul className="list-inside list-disc space-y-1">
                    <li>Liens internes</li>
                    <li>Liens externes</li>
                    <li>Liens cassés (404)</li>
                    <li>Ancres optimisées</li>
                    <li>Attributs nofollow/dofollow</li>
                  </ul>
                }
              />
              <Feature
                icon={<FileText className="h-5 w-5" />}
                headline="Ressources & Assets (10 points)"
                subheadline={
                  <ul className="list-inside list-disc space-y-1">
                    <li>Images (poids, format WebP)</li>
                    <li>Scripts JavaScript</li>
                    <li>Feuilles de style CSS</li>
                    <li>Polices web</li>
                    <li>Favicon présent</li>
                  </ul>
                }
              />
              <Feature
                icon={<Globe className="h-5 w-5" />}
                headline="Données Structurées (10 points)"
                subheadline={
                  <ul className="list-inside list-disc space-y-1">
                    <li>Schema.org (JSON-LD)</li>
                    <li>Open Graph (Facebook)</li>
                    <li>Twitter Cards</li>
                    <li>Breadcrumbs schema</li>
                    <li>Robots meta tag</li>
                  </ul>
                }
              />
            </>
          }
        />

        {/* SECTION : GUIDE ÉTAPE PAR ÉTAPE */}
        <Section
          id="guide"
          eyebrow="Guide pratique"
          headline="Quelles sont les étapes d'un audit SEO ?"
          subheadline={
            <p>
              Réaliser un <strong>audit SEO complet</strong> nécessite de suivre une méthodologie précise. Voici les
              étapes essentielles.
            </p>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Audit gratuit de votre page principale',
                desc: 'Entrez l\'URL de votre page d\'accueil, cliquez sur "Analyser", attendez 60 secondes et consultez les résultats avec votre score SEO /100.',
                time: '2 min',
              },
              {
                step: '2',
                title: "Analysez l'indexation Google",
                desc: 'Utilisez la requête "site:votre-site.com" sur Google pour voir combien de pages sont indexées et vérifiez Google Search Console.',
                time: '15 min',
              },
              {
                step: '3',
                title: 'Audit technique complet',
                desc: 'Vérifiez la vitesse avec PageSpeed Insights, le mobile-friendliness, les erreurs 404, les redirections et les balises canonical.',
                time: '30 min',
              },
              {
                step: '4',
                title: 'Audit du contenu et mots-clés',
                desc: 'Analysez la longueur des pages (>800 mots), la présence des mots-clés dans title/H1/H2, et la qualité du contenu.',
                time: '1h',
              },
              {
                step: '5',
                title: 'Audit du maillage interne',
                desc: 'Vérifiez que toutes vos pages sont accessibles en moins de 3 clics, sans pages orphelines, avec des ancres descriptives.',
                time: '30 min',
              },
              {
                step: '6',
                title: "Priorisation et plan d'action",
                desc: 'Classez les erreurs : Critique 🔴 (404, HTTPS), Important 🟠 (vitesse, contenu), Recommandé 🟡 (images, schema).',
                time: '1h',
              },
            ].map((item) => (
              <Card key={item.step} className="bg-mist-800/50">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                      {item.step}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-mist-500">
                      <Clock className="h-3 w-3" /> {item.time}
                    </span>
                  </div>
                  <h3 className="mb-1 font-semibold text-mist-950 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-mist-700 dark:text-mist-400">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* SECTION : COMPARATIF */}
        <Section
          id="comparatif"
          eyebrow="Comparatif"
          headline="Quel est le meilleur outil gratuit pour un audit SEO ?"
          subheadline={
            <p>
              Voici un <strong>comparatif objectif</strong> des meilleurs outils d&apos;audit SEO gratuits pour vous
              aider à choisir.
            </p>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-mist-200 dark:border-mist-700">
                  <th className="py-4 pr-4 font-semibold text-mist-950 dark:text-white">Outil</th>
                  <th className="px-4 py-4 font-semibold text-mist-700 dark:text-mist-400">Points analysés</th>
                  <th className="px-4 py-4 font-semibold text-mist-700 dark:text-mist-400">Inscription</th>
                  <th className="px-4 py-4 font-semibold text-mist-700 dark:text-mist-400">Note</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-primary/5 border-b border-mist-100 dark:border-mist-800">
                  <td className="text-primary py-3 pr-4 font-semibold">SerpEditor</td>
                  <td className="text-primary px-4 py-3 font-semibold">120+</td>
                  <td className="px-4 py-3 text-green-500">Non requise</td>
                  <td className="text-primary px-4 py-3 font-semibold">5/5</td>
                </tr>
                <tr className="border-b border-mist-100 dark:border-mist-800">
                  <td className="py-3 pr-4 text-mist-950 dark:text-white">Alyze</td>
                  <td className="px-4 py-3 text-mist-700 dark:text-mist-400">~60</td>
                  <td className="px-4 py-3 text-green-500">Non</td>
                  <td className="px-4 py-3 text-mist-700 dark:text-mist-400">4/5</td>
                </tr>
                <tr className="border-b border-mist-100 dark:border-mist-800">
                  <td className="py-3 pr-4 text-mist-950 dark:text-white">PageSpeed Insights</td>
                  <td className="px-4 py-3 text-mist-700 dark:text-mist-400">Performance</td>
                  <td className="px-4 py-3 text-green-500">Non</td>
                  <td className="px-4 py-3 text-mist-700 dark:text-mist-400">4/5</td>
                </tr>
                <tr className="border-b border-mist-100 dark:border-mist-800">
                  <td className="py-3 pr-4 text-mist-950 dark:text-white">SEObility</td>
                  <td className="px-4 py-3 text-mist-700 dark:text-mist-400">~70</td>
                  <td className="px-4 py-3 text-red-500">Oui</td>
                  <td className="px-4 py-3 text-mist-700 dark:text-mist-400">4/5</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-mist-950 dark:text-white">Get-Ranking</td>
                  <td className="px-4 py-3 text-mist-700 dark:text-mist-400">~40</td>
                  <td className="px-4 py-3 text-red-500">Oui</td>
                  <td className="px-4 py-3 text-mist-700 dark:text-mist-400">3/5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* SECTION : ERREURS FRÉQUENTES */}
        <Section
          id="erreurs"
          eyebrow="Problèmes courants"
          headline="Les erreurs SEO les plus fréquentes détectées"
          subheadline={
            <p>
              Après avoir analysé <strong>12 450+ pages web</strong>, voici les 10 erreurs SEO que nous détectons le
              plus souvent.
            </p>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                pct: '78%',
                title: 'Pages lentes (>3s)',
                desc: 'Compressez images en WebP, activez le cache, utilisez un CDN',
              },
              {
                pct: '71%',
                title: 'Images non optimisées',
                desc: 'Format non-optimal, pas de balise alt, trop lourdes',
              },
              { pct: '65%', title: 'Balises title dupliquées', desc: 'Créez des titres uniques de 50-60 caractères' },
              { pct: '58%', title: 'Core Web Vitals insuffisants', desc: 'LCP >2.5s, CLS >0.1, FID >100ms' },
              { pct: '52%', title: 'Site non-mobile-friendly', desc: 'Design non-responsive, texte trop petit' },
              { pct: '51%', title: 'H1 manquant ou dupliqué', desc: '1 seule balise H1 par page avec mot-clé' },
              { pct: '49%', title: 'Meta description manquante', desc: '150-160 caractères, incitative au clic' },
              { pct: '47%', title: 'Contenu trop court (<300 mots)', desc: 'Enrichir avec 800-1500 mots utiles' },
              { pct: '43%', title: 'Liens cassés / erreurs 404', desc: 'Réparer ou rediriger les liens' },
              { pct: '38%', title: 'Absence de SSL/HTTPS', desc: "Installer un certificat SSL (Let's Encrypt)" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg border border-mist-200 p-4 dark:border-mist-700"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-sm font-bold text-red-500">
                  {item.pct}
                </div>
                <div>
                  <h4 className="font-semibold text-mist-950 dark:text-white">{item.title}</h4>
                  <p className="text-sm text-mist-700 dark:text-mist-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* SECTION : GRATUIT VS PREMIUM */}
        <Section
          id="premium"
          eyebrow="Aller plus loin"
          headline="Audit gratuit vs Audit SEO complet SerpEditor"
          subheadline={
            <p>
              Notre outil gratuit est parfait pour un diagnostic rapide d&apos;une page. Pour un audit complet de tout
              votre site, découvrez <strong>SerpEditor Premium</strong>.
            </p>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-mist-200 dark:border-mist-700">
                  <th className="py-4 pr-4 font-semibold text-mist-950 dark:text-white">Fonctionnalité</th>
                  <th className="px-4 py-4 font-semibold text-mist-700 dark:text-mist-400">Audit Gratuit</th>
                  <th className="text-primary px-4 py-4 font-semibold">SerpEditor (39€/mois)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-mist-100 dark:border-mist-800">
                  <td className="py-3 pr-4 text-mist-950 dark:text-white">Pages analysées</td>
                  <td className="px-4 py-3 text-mist-700 dark:text-mist-400">1 page</td>
                  <td className="text-primary px-4 py-3 font-semibold">10 000+ pages crawlées</td>
                </tr>

                <tr className="border-b border-mist-100 dark:border-mist-800">
                  <td className="py-3 pr-4 text-mist-950 dark:text-white">Suivi positions Google</td>
                  <td className="px-4 py-3 text-red-500">Non</td>
                  <td className="text-primary px-4 py-3 font-semibold">500 mots-clés trackés</td>
                </tr>
                <tr className="border-b border-mist-100 dark:border-mist-800">
                  <td className="py-3 pr-4 text-mist-950 dark:text-white">Analyse backlinks</td>
                  <td className="px-4 py-3 text-red-500">Non</td>
                  <td className="text-primary px-4 py-3 font-semibold">2,8T+ liens analysés</td>
                </tr>
                <tr className="border-b border-mist-100 dark:border-mist-800">
                  <td className="py-3 pr-4 text-mist-950 dark:text-white">Recherche mots-clés</td>
                  <td className="px-4 py-3 text-red-500">Non</td>
                  <td className="text-primary px-4 py-3 font-semibold">213M+ keywords FR</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-mist-950 dark:text-white">Support</td>
                  <td className="px-4 py-3 text-mist-700 dark:text-mist-400">Email</td>
                  <td className="text-primary px-4 py-3 font-semibold">email FR (&lt;24h)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/register" size="lg">
              Essayer SerpEditor gratuitement (sans CB)
            </ButtonLink>
          </div>
        </Section>

        {/* SECTION FAQ */}
        <FAQsTwoColumnAccordion id="faq" headline="Questions fréquentes sur l'audit SEO">
          <Faq
            id="faq-1"
            question="Combien coûte un audit SEO ?"
            answer="Les prix varient : Audit gratuit (comme notre outil) = 0€, Freelance SEO = 300-800€, Agence SEO = 1000-5000€, SerpEditor = 39€/mois (audits illimités). Commencez par l'audit gratuit pour identifier les erreurs évidentes."
          />
          <Faq
            id="faq-2"
            question="Combien de temps dure un audit SEO ?"
            answer="Audit automatisé d'1 page (notre outil) : 60 secondes. Audit complet SerpEditor : 5-30 minutes selon la taille du site. Audit manuel par consultant : 3-10 jours. L'application des corrections prendra 1-4 semaines supplémentaires."
          />
          <Faq
            id="faq-3"
            question="À quelle fréquence faut-il faire un audit SEO ?"
            answer="Site vitrine/blog : tous les 6 mois. E-commerce : tous les 3 mois. Site en croissance rapide : tous les mois. Après chaque modification majeure : immédiatement."
          />
          <Faq
            id="faq-4"
            question="Un audit SEO améliore-t-il directement mon référencement ?"
            answer="Non, l'audit est uniquement un diagnostic. Ce qui améliore votre référencement, c'est l'application des recommandations : corriger les erreurs 404, optimiser les balises, améliorer la vitesse. Les premiers effets apparaissent sous 2-6 semaines."
          />
          <Faq
            id="faq-5"
            question="L'audit gratuit analyse-t-il tout mon site ?"
            answer="Non, l'audit gratuit analyse une seule page (votre page d'accueil ou n'importe quelle URL). Pour analyser tout votre site (toutes les pages, maillage interne complet), utilisez SerpEditor (39€/mois) qui crawle jusqu'à 10 000+ pages."
          />
          <Faq
            id="faq-6"
            question="Puis-je faire un audit SEO de mes concurrents ?"
            answer="Oui absolument ! Entrez simplement l'URL de la page concurrente dans notre outil. Vous verrez leurs erreurs techniques, leurs optimisations on-page et pourrez comparer leur performance à la vôtre. C'est 100% légal."
          />
          <Faq
            id="faq-7"
            question="L'outil fonctionne-t-il pour tous les CMS ?"
            answer="Oui, notre outil fonctionne avec WordPress, Shopify, Wix, Prestashop, Drupal, Webflow, Joomla, sites custom/HTML, Next.js, React, Vue.js, Angular, etc. Il analyse le code HTML final rendu par le navigateur."
          />
          <Faq
            id="faq-8"
            question="Que faire si mon score SEO est faible ?"
            answer="Un score faible (<50/100) signifie qu'il y a beaucoup de marge d'amélioration. Corrigez d'abord les erreurs critiques 🔴 (impact fort), puis les avertissements 🟠, et enfin les recommandations 🟡. Un site passant de 35 à 75/100 peut doubler son trafic en 6 mois."
          />
        </FAQsTwoColumnAccordion>

        {/* CTA FINAL */}
        <CallToActionSimple
          eyebrow="Prêt à améliorer votre SEO ?"
          headline="Réalisez votre audit SEO gratuit maintenant"
          subheadline={
            <p>
              Analysez votre site en 60 secondes. Sans inscription. 120+ points analysés. Compatible WordPress, Shopify
              et tous CMS.
            </p>
          }
          cta={
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="#hero" size="lg">
                Lancer l&apos;audit gratuit
              </ButtonLink>
              <PlainButtonLink href="/register" size="lg">
                Essayer SerpEditor Premium
              </PlainButtonLink>
            </div>
          }
        />

        {/* SECTION POURQUOI CHOISIR SERPEDITOR */}
        <Section id="avantages" eyebrow="Nos avantages" headline="Pourquoi choisir notre outil d'audit SEO ?">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Le plus complet', desc: '120 points analysés vs ~40-60 chez les concurrents' },
              { title: 'Résultats en 60s', desc: "Pas d'attente interminable. Rapport instantané." },
              { title: 'Sans inscription', desc: 'Testez immédiatement sans créer de compte' },
              { title: 'Données fiables', desc: 'Infrastructure de référence mondiale' },
              { title: '100% en français', desc: 'Rapport et recommandations en français clair' },
              { title: 'Support gratuit', desc: 'Questions ? Réponse en français sous 24h' },
              { title: 'Tous CMS compatibles', desc: 'WordPress, Shopify, Wix, Prestashop...' },
            ].map((item, index) => (
              <Card key={index} className="bg-mist-800/50">
                <CardContent className="p-4">
                  <h4 className="mb-1 font-semibold text-mist-950 dark:text-white">{item.title}</h4>
                  <p className="text-sm text-mist-700 dark:text-mist-400">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
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

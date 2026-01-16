import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Link } from '@/components/elements/link'
import { Main } from '@/components/elements/main'
import { Screenshot } from '@/components/elements/screenshot'
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
export const metadata: Metadata = {
  title: 'Logiciel SEO Complet : Toutes les Fonctionnalités SerpEditor',
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
}

export default function FeaturesPage() {
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
        <HeroSimpleLeftAligned
          eyebrow={
            <AnnouncementBadge href="/pricing" text="Nouveau : Pack Logiciel Complet à 39€/mois" cta="Voir l'offre" />
          }
          headline="Un Logiciel SEO Tout-en-Un pour Dominer la SERP en 2026"
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
                  Oui, nous offrons un essai gratuit qui vous permet de tester toutes les fonctionnalités du logiciel
                  sans engagement. Vous pouvez explorer nos modules de recherche de mots-clés, d&apos;analyse de
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

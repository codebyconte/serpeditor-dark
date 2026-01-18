import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'
import { DocumentCentered } from '@/components/sections/document-centered'
import {
  FooterCategory,
  FooterLink,
  FooterWithNewsletterFormCategoriesAndSocialIcons,
  NewsletterForm,
  SocialLink,
} from '@/components/sections/footer-with-newsletter-form-categories-and-social-icons'
import {
  NavbarLink,
  NavbarLogo,
  NavbarWithLinksActionsAndCenteredLogo,
} from '@/components/sections/navbar-with-links-actions-and-centered-logo'
import type { Metadata } from 'next'
import Image from 'next/image'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serpeditor.fr'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | SerpEditor - CGV Logiciel SEO',
  description: 'Conditions Générales de Vente de SerpEditor : tarifs, abonnements, paiements et conditions d\'utilisation du logiciel SEO.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/conditions-generales-vente`,
  },
}

/**
 * JSON-LD pour la page CGV
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${baseUrl}/conditions-generales-vente#webpage`,
  "url": `${baseUrl}/conditions-generales-vente`,
  "name": "Conditions Générales de Vente",
  "description": "Conditions Générales de Vente de SerpEditor : tarifs, abonnements et modalités d'utilisation",
  "inLanguage": "fr-FR",
  "isPartOf": {
    "@id": `${baseUrl}/#website`
  },
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
        "name": "Conditions Générales de Vente",
        "item": `${baseUrl}/conditions-generales-vente`
      }
    ]
  }
}

export default function Page() {
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
        <DocumentCentered
          id="document"
          headline="Conditions Générales de Vente"
          subheadline={<p>Dernière mise à jour : 17 janvier 2026.</p>}
        >
          <h2>1. Identité du vendeur</h2>
          <p>
            SerpEditor est édité par :
            <br />
            Nom : <strong>Conte Mouctar</strong>
            <br />
            Statut : Auto-entrepreneur
            <br />
            Adresse : <strong>6 rue du languedoc , 29200 Brest</strong>
            <br />
            SIRET : <strong>82893014900020</strong>
            <br />
            Email : <strong><a href="mailto:contact@serpeditor.fr">contact@serpeditor.fr</a></strong>
          </p>

          <h2>2. Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) ont pour objet de définir les conditions d’accès et
            d’utilisation de la plateforme SerpEditor et de ses services SaaS.
          </p>

          <h2>3. Description du service</h2>
          <p>
            SerpEditor est une plateforme en ligne proposant des outils SEO accessibles via abonnement et partiellement
            gratuits.
          </p>

          <h2>4. Création de compte</h2>
          <p>
            L’accès au service nécessite la création d’un compte. L’utilisateur est responsable de la confidentialité de
            ses identifiants.
          </p>

          <h2>5. Tarifs</h2>
          <p>
            Les prix sont indiqués en euros. En tant qu’auto-entrepreneur, TVA non applicable, article 293B du CGI (si
            applicable).
          </p>

          <h2>6. Paiement</h2>
          <p>
            Les paiements sont traités de manière sécurisée par Stripe. SerpEditor ne stocke aucune donnée bancaire.
          </p>
          <p>
            Les abonnements sont reconduits automatiquement jusqu’à résiliation par l’utilisateur.
          </p>

          <h2>7. Droit de rétractation</h2>
          <p>
            Conformément à l’article L221-28 du Code de la consommation, l’utilisateur renonce expressément à son droit de
            rétractation dès l’activation immédiate du service numérique.
          </p>

          <h2>8. Résiliation</h2>
          <p>
            L’utilisateur peut résilier son abonnement à tout moment depuis son espace client. La résiliation prend
            effet à la fin de la période en cours.
          </p>
          <p>Aucun remboursement n’est effectué pour une période entamée.</p>

          <h2>9. Utilisation loyale</h2>
          <p>
            Toute utilisation abusive, automatisée, frauduleuse ou détournée du service peut entraîner la suspension ou
            suppression du compte.
          </p>

          <h2>10. Limitation de responsabilité</h2>
          <p>
            SerpEditor est un outil d’aide à l’analyse SEO. Aucune garantie de résultat ou de positionnement n’est fournie.
          </p>

          <h2>11. Disponibilité</h2>
          <p>
            Le service peut être interrompu temporairement pour maintenance sans droit à indemnisation.
          </p>

          <h2>12. Propriété intellectuelle</h2>
          <p>
            L’ensemble du site, du logiciel et des contenus est protégé par le droit d’auteur.
          </p>

          <h2>13. Données personnelles</h2>
          <p>
            Les règles relatives aux données personnelles sont décrites dans la{' '}
            <a href="/privacy-policy">Politique de confidentialité</a>.
          </p>

          <h2>14. Médiation</h2>
          <p>
            En cas de litige, l’utilisateur peut recourir à un médiateur de la consommation conformément aux articles
            L612-1 et suivants du Code de la consommation.
          </p>

          <h2>15. Droit applicable</h2>
          <p>Les présentes CGV sont soumises au droit français.</p>

          <h2>16. Contact</h2>
          <p>
            Email : <strong><a href="mailto:contact@serpeditor.fr">contact@serpeditor.fr</a></strong>
          </p>
        </DocumentCentered>
      </Main>

      <FooterWithNewsletterFormCategoriesAndSocialIcons
        id="footer"
        cta={
          <NewsletterForm
            headline="Restez en avance en SEO"
            subheadline={
              <p>
                Recevez chaque semaine des conseils pratiques, des astuces SEO, et des mises à jour de notre outil pour
                booster votre visibilité en ligne.
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
        fineprint="© 2026 SerpEditor"
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

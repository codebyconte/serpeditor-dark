import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
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
  title: 'Politique de confidentialité | SerpEditor - Protection de vos données',
  description: 'Découvrez comment SerpEditor collecte, utilise et protège vos données personnelles. Conformité RGPD et respect de votre vie privée.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/privacy-policy`,
  },
  openGraph: {
    title: 'Politique de confidentialité | SerpEditor',
    description: 'Découvrez comment SerpEditor protège vos données personnelles. Conformité RGPD.',
    url: `${baseUrl}/privacy-policy`,
    siteName: 'SerpEditor',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary',
    title: 'Politique de confidentialité | SerpEditor',
    description: 'Protection de vos données personnelles - Conformité RGPD.',
  },
}

/**
 * JSON-LD pour la page Privacy Policy
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${baseUrl}/privacy-policy#webpage`,
  "url": `${baseUrl}/privacy-policy`,
  "name": "Politique de confidentialité",
  "description": "Politique de confidentialité et protection des données de SerpEditor - Conformité RGPD",
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
        "name": "Politique de confidentialité",
        "item": `${baseUrl}/privacy-policy`
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
          headline="Politique de confidentialité"
          subheadline={<p>Dernière mise à jour : 17 janvier 2026</p>}
        >
          <p>
            SerpEditor (« nous », « notre », « nos ») respecte votre vie privée et s’engage à protéger vos données
            personnelles. Cette politique explique quelles données sont collectées, comment elles sont utilisées et
            quels sont vos droits.
          </p>

          <h2>1. Données collectées</h2>
          <p>Nous pouvons collecter les types de données suivants :</p>
          <ul>
            <li>Données de compte : email, informations de connexion, paramètres utilisateur</li>
            <li>Données techniques minimales : navigateur, type d’appareil, informations techniques anonymisées</li>
            <li>Données de facturation : type d’abonnement et historique (aucune donnée bancaire stockée)</li>
          </ul>

          <h2>2. Analytics et mesure d’audience</h2>
          <p>
            Nous utilisons uniquement <strong>Vercel Analytics</strong> pour mesurer l’audience de manière{' '}
            <strong>anonymisée</strong>. Aucune donnée personnelle identifiable n’est utilisée à des fins publicitaires.
          </p>

          <h2>3. Utilisation des données</h2>
          <p>Les données sont utilisées uniquement pour :</p>
          <ul>
            <li>Fournir et faire fonctionner SerpEditor</li>
            <li>Gérer votre compte et vos projets</li>
            <li>Améliorer le produit</li>
            <li>Assurer la sécurité et prévenir la fraude</li>
            <li>Respecter nos obligations légales</li>
          </ul>

          <h2>4. Paiements</h2>
          <p>
            Les paiements sont traités par <strong>Stripe</strong>, prestataire conforme PCI-DSS et RGPD. SerpEditor ne
            stocke aucune donnée bancaire.
          </p>

          <h2>5. Hébergement des données</h2>
          <p>Les données sont hébergées sur l’infrastructure sécurisée de Vercel, au sein de l’Union Européenne.</p>

          <h2>6. Cookies</h2>
          <p>
            SerpEditor utilise uniquement des cookies techniques nécessaires au bon fonctionnement de la plateforme. Aucun
            cookie publicitaire n’est utilisé.
          </p>

          <h2>7. Partage des données</h2>
          <p>
            Nous ne vendons jamais vos données. Elles peuvent uniquement être partagées avec nos prestataires techniques
            (hébergement, paiement) si nécessaire au fonctionnement du service, ou si la loi l’exige.
          </p>

          <h2>8. Conservation des données</h2>
          <p>
            Les données sont conservées tant que votre compte est actif. Les comptes inactifs depuis plus de 24 mois
            peuvent être supprimés. En cas de suppression du compte, toutes les données sont définitivement effacées.
          </p>

          <h2>9. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données. Aucun système
            n’est totalement infaillible, mais nous faisons notre maximum pour garantir leur sécurité.
          </p>

          <h2>10. Vos droits (RGPD)</h2>
          <p>Vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d’accès</li>
            <li>Droit de rectification</li>
            <li>Droit d’effacement</li>
            <li>Droit d’opposition</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
          </ul>
          <p>
            Pour exercer vos droits, contactez-nous à : <strong>contact@serpeditor.fr</strong>
          </p>

          <h2>11. Suppression de compte</h2>
          <p>
            Vous pouvez demander la suppression complète de votre compte à tout moment. Toutes les données seront alors
            définitivement supprimées et ne pourront pas être récupérées.
          </p>

          <h2>12. Emails</h2>
          <p>
            Nous pouvons envoyer des emails liés au fonctionnement du service. Les emails marketing sont optionnels et
            disposent toujours d’un lien de désinscription.
          </p>

          <h2>13. Modifications</h2>
          <p>
            Cette politique peut être mise à jour à tout moment. La date de mise à jour sera toujours indiquée en haut de
            cette page.
          </p>

          <h2>14. Contact</h2>
          <p>
            📧 <strong><a href="mailto:contact@serpeditor.fr">contact@serpeditor.fr</a></strong>
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

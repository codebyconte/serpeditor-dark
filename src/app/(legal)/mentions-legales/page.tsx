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
import Image from 'next/image'

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
        <DocumentCentered
          id="document"
          headline="Mentions Légales"
          subheadline={<p>Dernière mise à jour : 19 décembre 2025.</p>}
        >
          <h2>Éditeur du site</h2>
          <p>
            <strong>SerpEditor</strong>
            <br />
            Société : Code By Conte
            <br />
            Statut juridique : Entreprise individuelle
            <br />
            Adresse : 6 rue du languedoc , 29200 Brest
            <br />
            Email : contact@serpeditor.fr
            <br />
            Directeur de la publication : Mouctar Conte
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par :
            <br />
            <strong>Vercel Inc.</strong>
            <br />
            340 S Lemon Ave #4133
            <br />
            Walnut, CA 91789
            <br />
            États-Unis
            <br />
            Site web : vercel.com
          </p>

          <h2>Paiements</h2>
          <p>
            Les paiements sont traités de manière sécurisée par :
            <br />
            <strong>Stripe, Inc.</strong>
            <br />
            354 Oyster Point Boulevard
            <br />
            South San Francisco, CA 94080
            <br />
            États-Unis
            <br />
            Site web : stripe.com
          </p>
          <p>
            SerpEditor ne stocke aucune donnée bancaire. L’ensemble des informations de paiement est géré directement par
            Stripe.
          </p>

          <h2>Accès au service</h2>
          <p>
            Le site SerpEditor propose des outils SEO gratuits ainsi qu’un logiciel SEO accessible via abonnement. Les
            fonctionnalités peuvent évoluer à tout moment afin d’améliorer le service.
          </p>

          <h2>Données & vie privée</h2>
          <p>
            SerpEditor utilise uniquement des statistiques anonymes fournies par la plateforme d’hébergement Vercel afin
            de mesurer l’usage du site. Aucune donnée personnelle de navigation n’est exploitée à des fins publicitaires
            ou de revente.
          </p>
          <p>
            Pour plus d’informations, veuillez consulter notre page{' '}
            <a href="/privacy-policy">Politique de confidentialité</a>.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L’ensemble du site, de sa structure, de ses textes, images, logos, interfaces et contenus est la propriété
            exclusive de SerpEditor, sauf mention contraire. Toute reproduction, représentation ou exploitation sans
            autorisation écrite est interdite.
          </p>

          <h2>Responsabilité</h2>
          <p>
            SerpEditor fournit des outils d’analyse et d’aide à la décision. Les résultats et recommandations fournis par
            le logiciel ne constituent en aucun cas une garantie de performance ou de positionnement sur les moteurs de
            recherche.
          </p>
          <p>
            L’utilisateur est seul responsable de l’utilisation qu’il fait du service et des décisions prises à partir
            des informations fournies.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question légale ou demande d’information :
            <br />
            Email : contact@serpeditor.fr
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

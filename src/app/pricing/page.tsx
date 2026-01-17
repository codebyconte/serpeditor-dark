
import { ButtonLink, PlainButtonLink, SoftButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { ChevronIcon } from '@/components/icons/chevron-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'
import { CallToActionSimpleCentered } from '@/components/sections/call-to-action-simple-centered'
import { FAQsAccordion, Faq } from '@/components/sections/faqs-accordion'
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
import { PlanComparisonTable } from '@/components/sections/plan-comparison-table'
import { Plan, PricingHeroMultiTier } from '@/components/sections/pricing-hero-multi-tier'
import Image from 'next/image'

function plans(option: string) {
  return (
    <>
      <Plan
        name="Free"
        price={option === 'Mensuel' ? '0€' : '0€'}
        period={option === 'Mensuel' ? '/mois' : '/année'}
        subheadline={<p>Pour découvrir l&apos;outil et tester les bases</p>}
        features={[
          '1 projet',
          '10 mots-clés suivis',
          '100 recherches mots-clés/mois',
          '10 analyses backlinks',
          '1 audit (100 pages)',
          'Exports limités',
        ]}
        cta={
          <SoftButtonLink href="/register" size="lg">
            Commencer gratuitement
          </SoftButtonLink>
        }
      />
      <Plan
        name="Pro"
        price={option === 'Mensuel' ? '39€' : '390€'}
        period={option === 'Mensuel' ? '/mois' : '/année'}
        subheadline={<p>Pour freelances et consultants SEO</p>}
        badge="Populaire"
        features={[
          '5 projets',
          '1 000 mots-clés suivis',
          '10k recherches mots-clés/mois',
          '5k analyses backlinks',
          '10k pages audits/mois',
          'Support prioritaire',
        ]}
        cta={
          <ButtonLink href="/register" size="lg">
          Commencer le plan Pro →
          </ButtonLink>
        }
      />
      <Plan
        name="Agency"
        price={option === 'Mensuel' ? '99€' : '990€'}
        period={option === 'Mensuel' ? '/mois' : '/année'}
        subheadline={<p>Pour agences et équipes SEO avancées</p>}
        features={[
          '50 projets maximum',
          '10k mots-clés suivis',
          '100k recherches mots-clés/mois',
          '40k analyses backlinks',
          '100k pages audits/mois',
          'Support prioritaire',
        ]}
        cta={
          <SoftButtonLink href="/register" size="lg">
            Commencer le plan Agency →
          </SoftButtonLink>
        }
      />
    </>
  )
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
        {/* Hero */}
        <PricingHeroMultiTier
          id="pricing"
          headline="Tarifs"
          subheadline={
            <p>
              Choisissez le plan adapté à vos besoins SEO : audits, mots-clés, backlinks et suivi de positions pour dominer Google.
            </p>
          }
          options={['Mensuel']}
          plans={{ Mensuel: plans('Mensuel') }}
         
        />

        {/* Plan Comparison Table */}
        <PlanComparisonTable
          id="pricing"
          plans={['Free', 'Pro', 'Agency']}
          features={[
            {
              title: 'Projets ',
              features: [
                {
                  name: 'Projets',
                  value: { Free: '1', Pro: '5', Agency: '50' },
                },
              ],
            },
            {
              title: 'Suivi & Recherche',
              features: [
                {
                  name: 'Mots-clés suivis (Synthèse des positions, Pages positionnées)',
                  value: { Free: '10 (refresh limité 1/jour)', Pro: '1 000 (refresh quotidien)', Agency: '10 000 (refresh multiple/jour)' },
                },
                {
                  name: 'Recherches mots-clés/mois (Recherche de mots-clés, Vue d’ensemble mots clés, Mot clés organiques)',
                  value: { Free: '100', Pro: '10 000', Agency: '100 000' },
                },
                {
                  name: 'SERP historiques/mois (Comparateur de SERP)',
                  value: { Free: '10', Pro: '1 000', Agency: '10 000' },
                },
              ],
            },
            {
              title: 'Analyses Avancées',
              features: [
                {
                  name: 'Analyses backlinks/mois (Tous les backlinks, Domaines référents, Ancres, Nouveaux / Perdus, Possibilités de backlinks)',
                  value: { Free: '10 (top 10 liens)', Pro: '5 000', Agency: '40 000' },
                },
                {
                  name: 'Pages audits/mois (Audit technique)',
                  value: { Free: '10 (1 audit)', Pro: '10 000 (10 audits)', Agency: '100 000 (illimité avec queue)' },
                },
                {
                  name: 'Visibilité AI/mois (Visibilité IA)',
                  value: { Free: false, Pro: '100 req', Agency: '1 000 req' },
                },
                {
                  name: 'Analyses domaines/mois (Opportunités de domaines, Vue d’ensemble, Recherche organiques, Possibilités de mots clés, Identifiez vos concurrents)',
                  value: { Free: '10 (basique)', Pro: '100', Agency: '1 000' },
                },
              ],
            },
            {
              title: 'Support & Extras',
              features: [
                { name: 'Exports/mois', value: { Free: '5', Pro: '1 000', Agency: 'Illimité' } },
                {
                  name: 'Support',
                  value: { Free: 'Docs + forum', Pro: 'Chat <24h', Agency: 'Support prioritaire' },
                },
                {
                  name: 'White-label',
                  value: { Free: false, Pro: false, Agency: true },
                },
              ],
            },
          ]}
        />

   

        {/* FAQs */}
        <FAQsAccordion id="faqs" headline="Questions & Answers">
     <Faq
  id="faq-1"
  question="Puis-je tester l'outil gratuitement sans carte bancaire ?"
  answer="Oui ! Créez simplement un compte avec votre email et accédez immédiatement à toutes les fonctionnalités de notre forfait Free, limité en volumes mais totalement gratuit, sans carte bancaire."
/>

          <Faq
            id="faq-2"
            question="Puis-je utiliser l'outil pour plusieurs clients ?"
            answer="Oui, avec plusieurs projets ! Le plan Pro permet jusqu'à 5 projets, et Agency jusqu'à 50."
          />
          <Faq
            id="faq-3"
            question="Les données sont-elles précises pour le marché français ?"
            answer="Absolument. SerpEditor s'appuie sur une technologie de scan propriétaire qui agrège des milliards de points de données issus directement des résultats de recherche Google France. Notre base de données de 213M+ de mots-clés est mise à jour quotidiennement pour garantir une précision maximale."
          />
          <Faq
            id="faq-4"
            question="SerpEditor remplace-t-il d'autres outils SEO ?"
            answer="Oui, c'est un tout-en-un : audits, mots-clés, backlinks et suivi, pour simplifier votre workflow SEO."
          />
        </FAQsAccordion>

        {/* Call To Action */}
        <CallToActionSimpleCentered
          id="call-to-action"
          headline="Encore des questions ?"
          subheadline={
            <p>Contactez notre équipe pour des réponses personnalisées sur nos tarifs et fonctionnalités SEO.</p>
          }
          cta={
            <div className="flex items-center gap-4">
              <ButtonLink href="#" size="lg">
                Chat avec nous
              </ButtonLink>

              <PlainButtonLink href="#" size="lg">
                Réserver une démo <ChevronIcon />
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

import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { Screenshot } from '@/components/elements/screenshot'
import {
  Feature,
  FeaturesStackedAlternatingWithDemos,
} from '@/components/sections/features-stacked-alternating-with-demos'
import { HeroSimpleLeftAligned } from '@/components/sections/hero-simple-left-aligned'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Toutes nos Fonctionnalités SEO — Outil Complet de Référencement',
  description:
    'Découvrez toutes nos fonctionnalités SEO : recherche de mots-clés, analyse de backlinks, suivi de positions, analyse concurrentielle et audit technique.',
  keywords: [
    'outil seo',
    'fonctionnalités seo',
    'recherche mots clés',
    'analyse backlinks',
    'suivi position',
    'audit seo',
  ],
}

export default function FeaturesPage() {
  return (
    <>
      <Main>
        <HeroSimpleLeftAligned
          eyebrow={<AnnouncementBadge href="/pricing" text="Nouveau : Pack Complet à 39€/mois" cta="Voir l'offre" />}
          headline="Toutes nos Fonctionnalités SEO — Un Outil Complet pour Dominer Google"
          subheadline={
            <>
              <p>
                SerpEditor centralise tous les outils dont vous avez besoin pour votre référencement : recherche de
                mots-clés, analyse de backlinks, suivi de positions, analyse concurrentielle et audit technique.
              </p>
              <p>
                Découvrez comment chaque module peut transformer votre stratégie SEO et vous faire économiser des
                milliers d&apos;euros par rapport aux outils premium.
              </p>
            </>
          }
        />

        <FeaturesStackedAlternatingWithDemos
          features={
            <>
              <Feature
                headline="Recherche de Mots-Clés SEO"
                subheadline={
                  <>
                    <p>
                      Accédez à la plus grande base de données française avec <strong>213M+ mots-clés</strong>. Détectez
                      les opportunités de longue traîne, analysez le volume de recherche réel et espionnez les mots-clés
                      de vos concurrents en un clic.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ Vue d&apos;ensemble complète des mots-clés</li>
                      <li>✅ Générateur de mots-clés automatique</li>
                      <li>✅ Recherche de mots-clés organiques</li>
                      <li>✅ Analyse de difficulté et d&apos;intention</li>
                    </ul>
                  </>
                }
                cta={
                  <ButtonLink href="/features/recherche-mots-cles" size="lg">
                    Découvrir la recherche de mots-clés →
                  </ButtonLink>
                }
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
              />

              <Feature
                headline="Analyse de Backlinks & Netlinking"
                subheadline={
                  <>
                    <p>
                      Analysez votre profil de backlinks avec notre base de <strong>2,8 trillions de liens</strong>.
                      Identifiez vos liens toxiques, découvrez les stratégies de vos concurrents et boostez votre
                      autorité de domaine.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ Vue d&apos;ensemble du netlinking</li>
                      <li>✅ Analyse détaillée de tous les backlinks</li>
                      <li>✅ Domaines référents et ancres de liens</li>
                      <li>✅ Détection des liens nouveaux et perdus</li>
                    </ul>
                  </>
                }
                cta={
                  <ButtonLink href="/features/analyse-backlinks" size="lg">
                    Analyser mes backlinks →
                  </ButtonLink>
                }
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
              />

              <Feature
                headline="Suivi de Position SEO"
                subheadline={
                  <>
                    <p>
                      Suivez l&apos;évolution de vos classements sur Google avec une mise à jour quotidienne. Analysez
                      vos pages principales, explorez l&apos;historique SERP et comprenez les mouvements de vos
                      concurrents.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ Vue d&apos;ensemble des positions</li>
                      <li>✅ Analyse des pages principales</li>
                      <li>✅ Analyseur SERP historique</li>
                      <li>✅ Métriques organiques en temps réel</li>
                    </ul>
                  </>
                }
                cta={
                  <ButtonLink href="/features/suivi-position-seo" size="lg">
                    Voir mes positions →
                  </ButtonLink>
                }
                demo={
                  <Screenshot wallpaper="green" placement="bottom-right">
                    <Image
                      src="/suivie-position.webp"
                      alt="Outil de suivi de position SEO"
                      className="bg-black/75"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
              />

              <Feature
                headline="Analyse Mots-Clés Concurrents"
                subheadline={
                  <>
                    <p>
                      Espionnez vos concurrents en un clic. Découvrez sur quels mots-clés ils se positionnent,
                      identifiez les opportunités manquées avec le Keyword Gap et analysez leurs sources de backlinks.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ Recherche organique des concurrents</li>
                      <li>✅ Analyseur d&apos;écart de mots-clés (Keyword Gap)</li>
                      <li>✅ Possibilités de backlinks (Backlink Gap)</li>
                      <li>✅ Analyse des concurrents SERP</li>
                    </ul>
                  </>
                }
                cta={
                  <ButtonLink href="/features/analyse-mots-cles-concurrents" size="lg">
                    Espionner un concurrent →
                  </ButtonLink>
                }
                demo={
                  <Screenshot wallpaper="brown" placement="bottom-left">
                    <Image
                      src="/serpeditor.webp"
                      alt="Outil d'analyse de mots-clés concurrents"
                      className="bg-black/75"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
              />

              <Feature
                headline="Audit SEO Technique"
                subheadline={
                  <>
                    <p>
                      Un site lent ou cassé ne ranke pas. Notre outil d&apos;audit SEO détecte les erreurs 404, les
                      problèmes de balisage, de vitesse et de structure pour optimiser votre santé technique.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>✅ Audit technique complet</li>
                      <li>✅ Analyse de performance</li>
                      <li>✅ Détection des erreurs</li>
                      <li>✅ Recommandations d&apos;optimisation</li>
                    </ul>
                  </>
                }
                cta={
                  <ButtonLink href="/features/audit-seo" size="lg">
                    Lancer un audit SEO →
                  </ButtonLink>
                }
                demo={
                  <Screenshot wallpaper="yellow" placement="bottom-right">
                    <Image
                      src="/audit-de-site.webp"
                      alt="Logiciel d'audit SEO technique"
                      className="bg-black/75"
                      width={1800}
                      height={1250}
                    />
                  </Screenshot>
                }
              />
            </>
          }
        />
      </Main>
    </>
  )
}

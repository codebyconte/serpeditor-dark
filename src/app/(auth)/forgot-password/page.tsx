import type { Metadata } from 'next'
import { ForgotForm } from './forget-form'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serpeditor.fr'

export const metadata: Metadata = {
  title:
    'Réinitialisation du mot de passe | Accédez à votre compte en toute sécurité',
  description:
    'Vous avez oublié votre mot de passe ? Pas de panique. Saisissez votre adresse e-mail pour recevoir un lien sécurisé et réinitialiser rapidement l\'accès à votre compte.',
  alternates: {
    canonical: `${baseUrl}/forgot-password`,
  },
  openGraph: {
    title: 'Réinitialisation du mot de passe | Serpeditor',
    description: 'Réinitialisez votre mot de passe Serpeditor en toute sécurité.',
    url: `${baseUrl}/forgot-password`,
    siteName: 'SerpEditor',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary',
    title: 'Réinitialisation du mot de passe',
    description: 'Réinitialisez votre mot de passe Serpeditor.',
  },
  robots: {
    index: false, // Pages auth ne doivent pas être indexées
    follow: false,
  },
}

export default function Page() {
  return (
    <main>
      <ForgotForm />
    </main>
  )
}

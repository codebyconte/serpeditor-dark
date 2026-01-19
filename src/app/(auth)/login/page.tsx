import { auth } from '@/lib/auth'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginForm } from './login-form'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serpeditor.fr'

export const metadata: Metadata = {
  title: 'Connexion à Serpeditor | Accédez à votre espace SEO',
  description:
    'Connectez-vous à votre compte Serpeditor pour suivre vos performances, explorer vos mots-clés et gérer vos projets SEO en toute simplicité.',
  alternates: {
    canonical: `${baseUrl}/login`,
  },
  openGraph: {
    title: 'Connexion à Serpeditor | Accédez à votre espace SEO',
    description: 'Connectez-vous à votre compte Serpeditor pour accéder à vos outils SEO.',
    url: `${baseUrl}/login`,
    siteName: 'SerpEditor',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary',
    title: 'Connexion à Serpeditor',
    description: 'Accédez à votre espace SEO Serpeditor.',
  },
  robots: {
    index: false, // Pages auth ne doivent pas être indexées
    follow: false,
  },
}

export default async function PageLogin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    return redirect('/dashboard')
  }

  return <LoginForm />
}

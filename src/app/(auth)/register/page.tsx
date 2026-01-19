import { auth } from '@/lib/auth'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FormRegister } from './form-register'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serpeditor.fr'

export const metadata: Metadata = {
  title: 'Inscription sur Serpeditor | Outil SEO et analyse de mots-clés',
  description:
    "Créez votre compte Serpeditor pour accéder à nos outils SEO puissants. Analysez vos mots-clés, suivez vos positions et améliorez votre trafic dès aujourd'hui.",
  alternates: {
    canonical: `${baseUrl}/register`,
  },
  openGraph: {
    title: 'Inscription sur Serpeditor | Outil SEO et analyse de mots-clés',
    description: 'Créez votre compte gratuit et accédez à nos outils SEO professionnels.',
    url: `${baseUrl}/register`,
    siteName: 'SerpEditor',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary',
    title: 'Inscription sur Serpeditor',
    description: 'Créez votre compte gratuit et accédez à nos outils SEO.',
  },
  robots: {
    index: false, // Pages auth ne doivent pas être indexées
    follow: false,
  },
}

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    return redirect('/dashboard')
  }

  return <FormRegister />
}

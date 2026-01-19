import { auth } from '@/lib/auth'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Connexion à Serpeditor | Accédez à votre espace SEO',
  description:
    'Connectez-vous à votre compte Serpeditor pour suivre vos performances, explorer vos mots-clés et gérer vos projets SEO en toute simplicité.',
  alternates: {
    canonical: 'https://www.serpeditor.fr/login',
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

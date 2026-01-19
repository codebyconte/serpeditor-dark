import { auth } from '@/lib/auth'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FormRegister } from './form-register'

export const metadata: Metadata = {
  title: 'Inscription sur Serpeditor | Outil SEO et analyse de mots-clés',
  description:
    'Créez votre compte Serpeditor pour accéder à nos outils SEO puissants. Analysez vos mots-clés, suivez vos positions et améliorez votre trafic dès aujourd’hui.',
  alternates: {
    canonical: 'https://www.serpeditor.fr/register',
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

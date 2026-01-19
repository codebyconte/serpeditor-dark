import type { Metadata } from 'next'
import { ForgotForm } from './forget-form'

export const metadata: Metadata = {
  title:
    'Réinitialisation du mot de passe | Accédez à votre compte en toute sécurité',
  description:
    'Vous avez oublié votre mot de passe ? Pas de panique. Saisissez votre adresse e-mail pour recevoir un lien sécurisé et réinitialiser rapidement l’accès à votre compte.',
  alternates: {
    canonical: 'https://www.serpeditor.fr/forgot-password',
  },
}

export default function Page() {
  return (
    <main>
      <ForgotForm />
    </main>
  )
}

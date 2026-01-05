import type { Metadata } from 'next'
import { ResetPasswordForm } from './reset-reset-password'

export const metadata: Metadata = {
  title: 'Réinitialiser votre mot de passe | Sécurisez l’accès à votre compte',
  description:
    'Créez un nouveau mot de passe pour sécuriser votre compte. Choisissez un mot de passe fort et unique afin de garantir la confidentialité de vos informations personnelles.',
}

export default function Page() {
  return <ResetPasswordForm />
}

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ResetPasswordForm } from './reset-reset-password'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serpeditor.fr'

export const metadata: Metadata = {
  title: 'Réinitialiser votre mot de passe | Sécurisez l&apos;accès à votre compte',
  description:
    'Créez un nouveau mot de passe pour sécuriser votre compte. Choisissez un mot de passe fort et unique afin de garantir la confidentialité de vos informations personnelles.',
  alternates: {
    canonical: `${baseUrl}/reset-password`,
  },
  openGraph: {
    title: 'Réinitialiser votre mot de passe | Serpeditor',
    description: 'Créez un nouveau mot de passe sécurisé pour votre compte.',
    url: `${baseUrl}/reset-password`,
    siteName: 'SerpEditor',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary',
    title: 'Réinitialiser votre mot de passe',
    description: 'Sécurisez votre compte Serpeditor.',
  },
  robots: {
    index: false, // Pages auth ne doivent pas être indexées
    follow: false,
  },
}

function ResetPasswordFormFallback() {
  return (
    <main className="overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
          <div className="p-7">
            <div className="h-9 w-9 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mt-8 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<ResetPasswordFormFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}

import { GradientBackground } from '@/components/gradient'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Adresse e-mail vérifiée | Compte activé avec succès',
  description:
    'Votre adresse e-mail a été confirmée avec succès. Votre compte est désormais actif — connectez-vous pour accéder à votre espace personnel et profiter de toutes les fonctionnalités.',
}

export default async function EmailVerifiedPage() {
  return (
    <main>
      <GradientBackground />
      <div className="mx-auto flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-xl bg-white p-12 shadow-md ring-1 ring-black/5">
          <div className="rounded-full bg-green-100 p-4">
            <Check className="flex h-6 w-6 justify-center text-green-500" />
          </div>
          <h1 className="text-xl font-semibold text-green-500">
            Adresse e-mail vérifiée avec succès{' '}
          </h1>
          <p className="text-gray-600">
            Votre compte est maintenant activé. Vous pouvez dès à présent vous
            connecter et commencer à utiliser nos services.
          </p>
          <Button asChild>
            <Link href="/dashboard">Accéder à votre espace</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

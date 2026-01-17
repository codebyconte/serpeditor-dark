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
    <main className="overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-xl bg-white p-12 shadow-md ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            <Check className="flex h-6 w-6 justify-center text-green-500 dark:text-green-400" />
          </div>
          <h1 className="text-xl font-semibold text-green-500 dark:text-green-400">
            Adresse e-mail vérifiée avec succès{' '}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Votre compte est maintenant activé. Vous pouvez dès à présent vous
            connecter et commencer à utiliser nos services.
          </p>
          <Button asChild className="bg-white dark:bg-gray-800 hover:cursor-pointer">
            <Link href="/dashboard">Accéder à votre espace</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

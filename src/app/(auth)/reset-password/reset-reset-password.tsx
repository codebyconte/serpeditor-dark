'use client'

import { GradientBackground } from '@/components/gradient'
import { Mark } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Link } from '@/components/ui/link'
import { authClient } from '@/lib/auth-client'
import NextLink from 'next/link'
import { resetPasswordSchema } from '@/lib/schema'
import { Input } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const token = searchParams.get('token') as string | undefined
  const error = searchParams.get('error') as string | undefined

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    startTransition(async () => {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      })

      if (error) {
        toast.success('Échec de la réinitialisation du mot de passe', {
          description:
            'Une erreur s’est produite lors de la réinitialisation de votre mot de passe.',
        })
      } else {
        toast.success('Votre mot de passe a été réinitialisé avec succès', {
          description:
            'Votre nouveau mot de passe est maintenant actif. Vous pouvez dès à présent vous connecter à votre compte en toute sécurité.',
        })
        router.push('/login')
      }
    })
  }

  if (!token || error === 'Invalid token') {
    return (
      <main className="overflow-hidden bg-gray-50">
        <GradientBackground />
        <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-7 shadow-md ring-1 ring-black/5">
            <h1 className="text-base/6 font-medium">
              Le lien de réinitialisation du mot de passe est invalide ou expiré
            </h1>
            <p className="text-sm/5 text-gray-600">
              Ce lien n’est plus valide. Il se peut qu’il ait déjà été utilisé
              ou qu’il ait expiré pour des raisons de sécurité. Veuillez
              demander un nouveau lien afin de réinitialiser votre mot de passe
              et accéder à votre compte.
            </p>
            <Button asChild className="mx-auto mt-2 w-full">
              <NextLink href="/login">Retour à la page de connexion</NextLink>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="overflow-hidden bg-gray-50">
      <GradientBackground />
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-7">
              <div className="flex items-start">
                <Link href="/" title="Home">
                  <Mark className="h-9 fill-black" />
                </Link>
              </div>
              <h1 className="mt-8 text-base/6 font-medium">
                Réinitialiser votre mot de passe
              </h1>
              <p className="mt-1 text-sm/5 text-gray-600">
                Créez un nouveau mot de passe pour sécuriser votre compte.
                Entrez un mot de passe fort et unique, puis confirmez-le.
              </p>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        type="password"
                        name="password"
                        placeholder="Saisissez un mot de passe sécurisé"
                        className={clsx(
                          'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                          'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                          'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        type="password"
                        name="confirmPassword"
                        placeholder="Retapez le même mot de passe"
                        className={clsx(
                          'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                          'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                          'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-8">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending
                    ? 'Enregistrement en cours…'
                    : 'Enregistrer le nouveau mot de passe'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  )
}

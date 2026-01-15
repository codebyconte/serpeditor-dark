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
import { forgotPasswordSchema } from '@/lib/schema'
import { Input } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export function ForgotForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/forget-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            redirectTo: '/reset-password',
          }),
        })

        if (response.ok) {
          toast.success('Lien envoyé avec succès', {
            description:
              'Si un compte est associé à cette adresse, vous recevrez un e-mail de réinitialisation dans quelques instants. Pensez à vérifier votre dossier de courrier indésirable',
          })
        } else {
          toast.error('Une erreur est survenue. Veuillez réessayer.')
        }
      } catch {
        toast.error('Une erreur est survenue. Veuillez réessayer.')
      }
    })
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
                Saisissez l’adresse e-mail associée à votre compte. Nous vous
                enverrons un lien pour créer un nouveau mot de passe.
              </p>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        type="email"
                        name="email"
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
                  {isPending ? 'Envoi en cours…' : 'Envoyer le lien'}
                </Button>
              </div>
            </form>
          </Form>

          <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link href="/login" className="font-medium hover:text-gray-600">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

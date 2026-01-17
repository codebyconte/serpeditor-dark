'use client'

import Image from 'next/image'
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
import { signIn, signUp } from '@/lib/auth-client'
import { registerSchema } from '@/lib/schema'
import { Input } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'sonner'
import { z } from 'zod'

export function FormRegister() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    startTransition(async () => {
      await signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
          callbackURL: '/email-verified',
        },
        {
          onRequest: () => {},
          onSuccess: async () => {
            toast.success(
              `Un e-mail contenant un lien d'activation a été envoyé à ${values.email}.`,
              {
                description:
                  'Pensez à vérifier vos spams si vous ne le recevez pas rapidement.',
              },
            )
          },
          onError: () => {
            toast.error(
              'Oups, quelque chose s’est mal passé. Il est possible que cet email soit déjà utilisé ou qu’un problème réseau soit survenu.',
            )
          },
        },
      )
    })
  }

  async function loginwithGoogle() {
    startTransition(async () => {
      await signIn.social(
        {
          provider: 'google',
          callbackURL: '/dashboard',
        },
        {
          onRequest: () => {
            toast.loading('Inscription en cours...')
          },
          onSuccess: () => {
            toast.success('Compte créé avec succès.', {
              description:
                'Bienvenue ! Votre compte a été créé. Vous pouvez maintenant accéder à votre tableau de bord.',
            })
            router.push('/dashboard')
            router.refresh()
          },
          onError: () => {
            toast.error(
              'Échec de la connexion Google. Veuillez réessayer ou utiliser votre e-mail.',
            )
          },
        },
      )
    })
  }

  return (
    <main className="overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-7">
              <div className="flex items-start">
                <Link href="/" title="Home">
                  <Image src="/serpeditor.svg" alt="SerpEditor Outil SEO" className="dark:hidden" width={85} height={28} />
                  <Image
                    src="/serpeditor-white.svg"
                    alt="SerpEditor Outil SEO"
                    className="not-dark:hidden"
                    width={85}
                    height={28}
                  />
                </Link>
              </div>
              <h1 className="mt-8 text-base/6 font-medium text-gray-900 dark:text-white">
                Inscrivez-vous sur Serpeditor{' '}
              </h1>
              <p className="mt-1 text-sm/5 text-gray-600 dark:text-gray-400">
                Boostez votre référencement dès aujourd&apos;hui.
              </p>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel className="text-sm/5 font-medium text-gray-900 dark:text-white">Nom</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        type="text"
                        name="name"
                        className={clsx(
                          'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10 dark:ring-white/10',
                          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                          'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                          'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black dark:data-focus:outline-white',
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel className="text-sm/5 font-medium text-gray-900 dark:text-white">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        type="email"
                        name="email"
                        className={clsx(
                          'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10 dark:ring-white/10',
                          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                          'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                          'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black dark:data-focus:outline-white',
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel className="text-sm/5 font-medium text-gray-900 dark:text-white">
                      Mot de passe
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        type="password"
                        name="password"
                        className={clsx(
                          'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10 dark:ring-white/10',
                          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                          'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                          'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black dark:data-focus:outline-white',
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
                    <FormLabel className="text-sm/5 font-medium text-gray-900 dark:text-white">
                      Confirmation du mot de passe
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        type="password"
                        name="confirmPassword"
                        className={clsx(
                          'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10 dark:ring-white/10',
                          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                          'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                          'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black dark:data-focus:outline-white',
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-8">
                <Button type="submit" className="w-full bg-white dark:bg-gray-800 hover:cursor-pointer" disabled={isPending}>
                  {isPending ? 'En cours...' : "S'inscrire"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="px-7 pb-7 sm:pb-11">
            <div className="flex items-center gap-8 px-7 pb-7">
              <hr className="w-full border-black/20 dark:border-white/20" />
              <span className="text-gray-600 dark:text-gray-400">ou</span>
              <hr className="w-full border-black/20 dark:border-white/20" />
            </div>
            <Button
              onClick={loginwithGoogle}
              className="flex w-full items-center gap-2 bg-white dark:bg-gray-800 hover:cursor-pointer"
            >
              <FcGoogle />
              S&apos;inscrire avec Google
            </Button>
          </div>

          <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10 dark:text-gray-300">
            Déjà un compte?{' '}
            <Link href="/login" className="font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

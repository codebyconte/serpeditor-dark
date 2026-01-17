'use client'

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
import { signIn } from '@/lib/auth-client'
import { loginSchema } from '@/lib/schema'
import { Checkbox, Input } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'sonner'
import { z } from 'zod'

export function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      await signIn.email(
        {
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe,
        },
        {
          onRequest: () => {},
          onSuccess: () => {
            toast.success('Connexion reussie', {
              description:
                'Bienvenue ! Vous allez être redirigé·e vers votre tableau de bord.',
            })
            router.push('/dashboard')
            router.refresh()
          },
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              toast.error('Email non vérifié', {
                description:
                  'Veuillez vérifier votre email pour activer votre compte.',
              })
            } else {
              toast.error('Impossible de se connecter', {
                description:
                  "L'email ou le mot de passe est incorrect. Vérifiez vos informations ou utilisez « Mot de passe oublié » pour réinitialiser.",
              })
            }
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
          onRequest: async () => {
            toast.loading('Connexion en cours...')
          },
          onSuccess: async () => {
            toast.success('Connexion reussie', {
              description:
                'Ravi de vous revoir ! Redirection vers votre espace.',
            })
            router.push('/dashboard')
            router.refresh()
          },
          onError: async () => {
            toast.error('Échec de la connexion Google. Veuillez réessayer.')
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
                  <Mark className="h-9 fill-black dark:fill-white" />
                </Link>
              </div>
              <h1 className="mt-8 text-base/6 font-medium text-gray-900 dark:text-white">
                Connexion à Serpeditor
              </h1>
              <p className="mt-1 text-sm/5 text-gray-600 dark:text-gray-400">
                Reprenez le contrôle de vos performances SEO.
              </p>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel className="text-gray-900 dark:text-white">Email</FormLabel>
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
                    <FormLabel className="text-gray-900 dark:text-white">Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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

              <div className="mt-8 flex items-center justify-between text-sm/5">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormLabel className="text-gray-900 dark:text-white">Se souvenir de moi</FormLabel>
                      <FormControl>
                        <Checkbox
                          className={clsx(
                            'group block size-4 rounded-sm border border-transparent shadow-sm ring-1 ring-black/10 dark:ring-white/10',
                            'data-checked:bg-black data-checked:ring-black dark:data-checked:bg-white dark:data-checked:ring-white',
                            'data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-black dark:data-focus:outline-white',
                          )}
                          {...field}
                        >
                          <CheckIcon className="fill-white opacity-0 group-data-checked:opacity-100 dark:fill-black" />
                        </Checkbox>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Link
                  href="/forgot-password"
                  className="font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Mot de passe oublié?
                </Link>
              </div>

              <div className="mt-8">
                <Button type="submit" className="w-full bg-white dark:bg-gray-800 hover:cursor-pointer" disabled={isPending}>
                  {isPending ? 'Connexion en cours...' : 'Se connecter'}
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
              Se connecter avec Google
            </Button>
          </div>

          <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10 dark:text-gray-300">
            Pas de compte?{' '}
            <Link href="/register" className="font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

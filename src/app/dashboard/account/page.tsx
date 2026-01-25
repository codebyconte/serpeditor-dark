'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/elements/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { User, Mail, Phone, Lock, Loader2, Shield, Settings } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'

const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export default function AccountPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isPasswordPending, startPasswordTransition] = useTransition()

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Récupérer les données utilisateur complètes depuis le serveur
  useEffect(() => {
    async function fetchUserData() {
      if (!session?.user?.id) return
      
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          profileForm.reset({
            name: data.user?.name || session.user.name || '',
            email: session.user.email || '',
            phone: data.user?.phone || '',
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Fallback sur les données de session
        if (session.user) {
          profileForm.reset({
            name: session.user.name || '',
            email: session.user.email || '',
            phone: '',
          })
        }
      }
    }
    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch('/api/profile/update', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name,
            phone: values.phone || null,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.error || 'Erreur lors de la mise à jour du profil')
          return
        }

        toast.success('Profil mis à jour avec succès')
        router.refresh()
      } catch (error) {
        console.error('Error updating profile:', error)
        toast.error('Une erreur est survenue lors de la mise à jour du profil')
      }
    })
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    startPasswordTransition(async () => {
      try {
        const response = await fetch('/api/profile/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.error || 'Erreur lors du changement de mot de passe')
          return
        }

        toast.success('Mot de passe modifié avec succès')
        passwordForm.reset()
      } catch (error) {
        console.error('Error changing password:', error)
        toast.error('Une erreur est survenue lors du changement de mot de passe')
      }
    })
  }

  if (sessionLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
            <div className="relative flex h-12 w-12 items-center justify-center">
              <div className="absolute h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-primary" />
              <div className="absolute h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-primary/50 [animation-direction:reverse] [animation-duration:1.5s]" />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="border-white/5 bg-linear-to-b from-mist-800/60 to-mist-900/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
            <CardDescription>Vous devez être connecté pour accéder à cette page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        icon={Settings}
        title="Paramètres du compte"
        description="Gérez vos informations personnelles et la sécurité de votre compte"
      />

      <div className="mt-8 space-y-6">
        {/* Profile information */}
        <Card className="overflow-hidden border-white/5 bg-linear-to-br from-mist-800/60 to-mist-900/60 backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
          <CardHeader className="border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-primary/20 opacity-50 blur-md" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-primary/20 to-primary/5 shadow-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <CardTitle className="text-lg">Informations personnelles</CardTitle>
                <CardDescription>Mettez à jour vos informations de profil</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          Nom complet
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Votre nom"
                            className="border-white/10 bg-white/5 focus:border-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          Téléphone
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+33 6 12 34 56 78"
                            className="border-white/10 bg-white/5 focus:border-primary/50"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        Adresse e-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="votre@email.com"
                          disabled
                          className="border-white/10 bg-white/5 opacity-60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="mt-1 text-xs text-muted-foreground">L&apos;adresse e-mail ne peut pas être modifiée</p>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer les modifications'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Password change */}
        <Card className="overflow-hidden border-white/5 bg-linear-to-br from-mist-800/60 to-mist-900/60 backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/20 to-transparent" />
          <CardHeader className="border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-amber-500/20 opacity-50 blur-md" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-amber-500/20 to-amber-500/5 shadow-lg">
                  <Shield className="h-6 w-6 text-amber-400" />
                </div>
              </div>
              <div>
                <CardTitle className="text-lg">Sécurité</CardTitle>
                <CardDescription>Modifiez votre mot de passe pour sécuriser votre compte</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Mot de passe actuel</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="border-white/10 bg-white/5 focus:border-primary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Nouveau mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="border-white/10 bg-white/5 focus:border-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="mt-1 text-xs text-muted-foreground">Minimum 8 caractères</p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="border-white/10 bg-white/5 focus:border-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isPasswordPending}
                    className="cursor-pointer border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                  >
                    {isPasswordPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Modification...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Changer le mot de passe
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

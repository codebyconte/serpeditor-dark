import { redirect } from 'next/navigation'
import { CheckCircle2, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { stripe } from '../../lib/stripe'
import { ButtonLink } from '@/components/elements/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from '@/components/elements/main'

export default async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)')
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  })

  if (session.status === 'open') {
    return redirect('/dashboard')
  }

  if (session.status === 'complete') {
    const customerEmail = session.customer_details?.email
    const lineItems = session.line_items?.data || []
    const planName = lineItems[0]?.description || 'votre abonnement'

    return (
      <Main>
        <section id="success" className="flex min-h-[80vh] items-center justify-center px-4 py-16">
          <div className="w-full max-w-2xl">
            <Card className="via-background border-2 border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 shadow-xl">
              <CardHeader className="space-y-6 pb-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 shadow-lg">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
                    Paiement réussi !
                  </CardTitle>
                  <CardDescription className="text-base">
                    Merci pour votre confiance. Votre abonnement est maintenant actif.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold">Plan activé : {planName}</p>
                        <p className="text-sm text-muted-foreground">
                          Vous pouvez maintenant accéder à toutes les fonctionnalités de votre plan.
                        </p>
                      </div>
                    </div>
                  </div>

                  {customerEmail && (
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold">Email de confirmation</p>
                          <p className="text-sm text-muted-foreground">
                            Un email de confirmation a été envoyé à{' '}
                            <span className="font-medium text-foreground">{customerEmail}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      Si vous avez des questions ou besoin d&apos;aide, n&apos;hésitez pas à{' '}
                      <a href="mailto:contact@serpeditor.fr" className="font-medium text-foreground underline hover:no-underline">
                        nous contacter
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-6">
                <ButtonLink href="/dashboard" size="lg" className="w-full">
                  Accéder au dashboard
                </ButtonLink>
              
              </CardFooter>
            </Card>
          </div>
        </section>
      </Main>
    )
  }

  return (
    <Main>
      <section id="success" className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Traitement en cours...</CardTitle>
            <CardDescription>Veuillez patienter pendant que nous finalisons votre paiement.</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </Main>
  )
}
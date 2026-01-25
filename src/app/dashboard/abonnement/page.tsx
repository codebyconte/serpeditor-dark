import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Plan, PricingHeroMultiTier } from '@/components/sections/pricing-hero-multi-tier'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SoftButton } from '@/components/elements/button'
import { CheckCircle2, Crown, Sparkles, CreditCard, Zap, Calendar } from 'lucide-react'
import { CancelSubscriptionButton } from '@/components/dashboard/cancel-subscription-button'
import { UsageStats } from '@/components/dashboard/usage-stats'
import { PageHeader } from '@/components/dashboard/page-header'

export const metadata: Metadata = {
  title: 'Abonnement & Facturation',
  robots: {
    index: false,
    follow: false,
  },
}

type PlanType = 'Free' | 'Pro' | 'Agency'

const PLAN_HIERARCHY: Record<PlanType, number> = {
  Free: 0,
  Pro: 1,
  Agency: 2,
}

const PLAN_FEATURES: Record<PlanType, string[]> = {
  Free: [
    '1 projet',
    '10 mots-clés suivis',
    '100 recherches mots-clés/mois',
    '10 analyses backlinks',
    '1 audit (100 pages)',
    'Exports limités',
  ],
  Pro: [
    '5 projets',
    '1 000 mots-clés suivis',
    '10k recherches mots-clés/mois',
    '5k analyses backlinks',
    '10k pages audits/mois',
    'Support prioritaire',
  ],
  Agency: [
    '50 projets maximum',
    '10k mots-clés suivis',
    '100k recherches mots-clés/mois',
    '40k analyses backlinks',
    '100k pages audits/mois',
    'Support prioritaire',
  ],
}

const PLAN_PRICES: Record<PlanType, string> = {
  Free: '0€',
  Pro: '39€',
  Agency: '99€',
}

function plans(currentPlan: PlanType, userId: string) {
  const canUpgrade = (plan: PlanType) => {
    return PLAN_HIERARCHY[plan] > PLAN_HIERARCHY[currentPlan]
  }

  const getCta = (plan: PlanType) => {
    if (plan === currentPlan) {
      return (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm font-medium text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          Plan actuel
        </div>
      )
    }

    if (plan === 'Free') {
      return (
        <SoftButton size="lg" disabled className="w-full cursor-not-allowed opacity-50">
          Plan gratuit
        </SoftButton>
      )
    }

    if (!canUpgrade(plan)) {
      return (
        <SoftButton size="lg" disabled className="w-full cursor-not-allowed opacity-50">
          Plan inférieur
        </SoftButton>
      )
    }

    return (
      <form action="/api/checkout_sessions" method="POST">
        <input type="hidden" name="plan" value={plan} />
        <input type="hidden" name="userId" value={userId} />
        <SoftButton type="submit" size="lg" className="w-full hover:cursor-pointer">
          Passer au plan {plan} →
        </SoftButton>
      </form>
    )
  }

  return (
    <>
      <Plan
        name="Free"
        price={PLAN_PRICES.Free}
        period="/mois"
        subheadline={<p>Pour découvrir l&apos;outil et tester les bases</p>}
        features={PLAN_FEATURES.Free}
        cta={getCta('Free')}
        className={currentPlan === 'Free' ? 'ring-2 ring-green-500/50' : ''}
      />
      <Plan
        name="Pro"
        price={PLAN_PRICES.Pro}
        period="/mois"
        subheadline={<p>Pour freelances et consultants SEO</p>}
        badge={currentPlan === 'Pro' ? 'Votre plan' : canUpgrade('Pro') ? 'Recommandé' : 'Populaire'}
        features={PLAN_FEATURES.Pro}
        cta={getCta('Pro')}
        className={currentPlan === 'Pro' ? 'ring-2 ring-green-500/50' : ''}
      />
      <Plan
        name="Agency"
        price={PLAN_PRICES.Agency}
        period="/mois"
        subheadline={<p>Pour agences et équipes SEO avancées</p>}
        badge={currentPlan === 'Agency' ? 'Votre plan' : undefined}
        features={PLAN_FEATURES.Agency}
        cta={getCta('Agency')}
        className={currentPlan === 'Agency' ? 'ring-2 ring-green-500/50' : ''}
      />
    </>
  )
}

export default async function AbonnementPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return redirect('/login')
  }

  // Récupérer l'abonnement de l'utilisateur ou créer un Free par défaut
  let subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  // Si l'utilisateur n'a pas d'abonnement, créer un Free par défaut
  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        plan: 'Free',
        status: 'active',
      },
    })
  }

  const currentPlan = (subscription.plan || 'Free') as PlanType

  // Formater la date de fin d'abonnement si disponible
  const formatDate = (date: Date | null) => {
    if (!date) return null
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={CreditCard}
        title="Abonnement"
        description="Gérez votre plan et consultez votre utilisation"
      />

      <div className="mt-8 space-y-8">
        {/* Current plan card */}
        <Card className="relative overflow-hidden border-white/5 bg-linear-to-br from-mist-800/60 to-mist-900/60 backdrop-blur-sm">
          {/* Decorative gradient */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

          <CardHeader className="relative border-b border-white/5 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-emerald-500/20 opacity-50 blur-md" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-emerald-500/20 to-emerald-500/5 shadow-lg">
                    <Crown className="h-7 w-7 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl">Plan actuel</CardTitle>
                  <CardDescription>Votre abonnement actif</CardDescription>
                </div>
              </div>
              <Badge color="green" className="w-fit px-4 py-2 text-base font-semibold">
                {currentPlan}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="relative pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Price card */}
              <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-5 transition-all hover:border-white/10">
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-emerald-500/10 blur-xl transition-all group-hover:bg-emerald-500/20" />
                <div className="relative">
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Prix</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{PLAN_PRICES[currentPlan]}<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                </div>
              </div>

              {/* Renewal card */}
              {subscription?.currentPeriodEnd && (
                <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-5 transition-all hover:border-white/10">
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-blue-500/10 blur-xl transition-all group-hover:bg-blue-500/20" />
                  <div className="relative">
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Renouvellement</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{formatDate(subscription.currentPeriodEnd)}</p>
                  </div>
                </div>
              )}

              {/* Status card */}
              {subscription?.status && (
                <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-5 transition-all hover:border-white/10">
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-purple-500/10 blur-xl transition-all group-hover:bg-purple-500/20" />
                  <div className="relative">
                    <div className="mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-400" />
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Statut</span>
                    </div>
                    <Badge color={subscription.status === 'active' ? 'green' : 'amber'} className="mt-1">
                      {subscription.status === 'active' ? 'Actif' : subscription.status}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Features included */}
            <div className="mt-6 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Fonctionnalités incluses</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {PLAN_FEATURES[currentPlan].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage stats */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Votre utilisation</h2>
          <UsageStats />
        </div>

        {/* Available plans */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Plans disponibles</h2>
          <PricingHeroMultiTier
            id="pricing"
            headline="Choisissez votre plan"
            subheadline={
              <p className="text-muted-foreground">
                Passez à un niveau supérieur pour débloquer plus de fonctionnalités
              </p>
            }
            options={['Mensuel']}
            plans={{ Mensuel: plans(currentPlan, session.user.id) }}
          />
        </div>

        {/* Cancellation section */}
        <Card className="relative overflow-hidden border-red-500/10 bg-linear-to-br from-red-500/5 to-transparent">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-500/30 to-transparent" />
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Gérer votre abonnement</CardTitle>
            <CardDescription>
              Vous pouvez annuler votre abonnement à tout moment. Votre accès restera actif jusqu&apos;à la fin de la
              période en cours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CancelSubscriptionButton
              currentPlan={currentPlan}
              cancelAtPeriodEnd={subscription.cancelAtPeriodEnd || false}
              currentPeriodEnd={subscription.currentPeriodEnd}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

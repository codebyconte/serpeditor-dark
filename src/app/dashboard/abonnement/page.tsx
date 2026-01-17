import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Plan, PricingHeroMultiTier } from '@/components/sections/pricing-hero-multi-tier'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SoftButton } from '@/components/elements/button'
import { CheckCircle2, Crown, Sparkles } from 'lucide-react'
import { CancelSubscriptionButton } from '@/components/dashboard/cancel-subscription-button'
import { UsageStats } from '@/components/dashboard/usage-stats'

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
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gérer votre abonnement</h1>
        <p className="mt-2 text-muted-foreground">
          Consultez votre plan actuel et passez à un niveau supérieur pour débloquer plus de fonctionnalités.
        </p>
      </div>

      {/* Carte du plan actuel */}
      <Card className="mb-8 border-2 border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <Crown className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Plan actuel</CardTitle>
                <CardDescription>Votre abonnement actif</CardDescription>
              </div>
            </div>
            <Badge color="green" className="px-4 py-2 text-lg">
              {currentPlan}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Prix</p>
                <p className="text-2xl font-bold">{PLAN_PRICES[currentPlan]}/mois</p>
              </div>
              {subscription?.currentPeriodEnd && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Prochain renouvellement</p>
                  <p className="text-lg font-semibold">{formatDate(subscription.currentPeriodEnd)}</p>
                </div>
              )}
              {subscription?.status && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Statut</p>
                  <Badge color={subscription.status === 'active' ? 'green' : 'amber'} className="mt-1">
                    {subscription.status === 'active' ? 'Actif' : subscription.status}
                  </Badge>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Fonctionnalités incluses</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {PLAN_FEATURES[currentPlan].slice(0, 3).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage actuel */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Votre utilisation</h2>
        <UsageStats />
      </div>

      {/* Plans disponibles */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Plans disponibles</h2>
        <PricingHeroMultiTier
          id="pricing"
          headline="Choisissez votre plan"
          subheadline={
            <p>
              Passez à un niveau supérieur pour débloquer plus de fonctionnalités et augmenter vos limites.
            </p>
          }
          options={['Mensuel']}
          plans={{ Mensuel: plans(currentPlan, session.user.id) }}
        />
      </div>

      {/* Section d'annulation */}
      <Card className="border-2 border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5">
        <CardHeader>
          <CardTitle className="text-xl">Gérer votre abonnement</CardTitle>
          <CardDescription>
            Vous pouvez annuler votre abonnement à tout moment. Votre accès restera actif jusqu&apos;à
            la fin de la période en cours.
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
  )
}

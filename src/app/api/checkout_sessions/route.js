import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'

// Mapping des plans vers les price_ids Stripe
const PRICE_IDS = {
  Pro: 'price_1SqwPlRQkqRAWbxYjcxJylw3',
  Agency: 'price_1SqwQKRQkqRAWbxYwCT9G3Pl',
}

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: headersList,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le plan depuis le body de la requête
    const formData = await request.formData()
    const plan = formData.get('plan')

    // Valider que le plan est valide
    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json(
        { error: 'Plan invalide. Veuillez sélectionner Pro ou Agency.' },
        { status: 400 }
      )
    }

    const priceId = PRICE_IDS[plan]

    // Vérifier si l'utilisateur a déjà un abonnement actif
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    // Si l'utilisateur a déjà un abonnement Stripe actif, modifier l'abonnement existant
    if (
      existingSubscription?.stripeSubscriptionId &&
      existingSubscription?.status === 'active' &&
      existingSubscription?.plan !== plan
    ) {
      try {
        console.log(
          `🔄 Upgrade/Downgrade: User ${session.user.id} changing from ${existingSubscription.plan} to ${plan}`,
        )

        // Récupérer l'abonnement Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(
          existingSubscription.stripeSubscriptionId,
        )

        // Modifier l'abonnement pour changer de plan
        // Stripe annule automatiquement l'ancien plan et applique le nouveau
        const updatedSubscription = await stripe.subscriptions.update(
          existingSubscription.stripeSubscriptionId,
          {
            items: [
              {
                id: stripeSubscription.items.data[0].id, // ID de l'item existant
                price: priceId, // Nouveau prix
              },
            ],
            proration_behavior: 'always_invoice', // Facturer le prorata immédiatement
            metadata: {
              userId: session.user.id,
              plan: plan,
            },
          },
        )

        console.log(
          `✅ Subscription updated successfully: ${updatedSubscription.id} - New plan: ${plan}`,
        )

        // Rediriger vers la page d'abonnement avec un message de succès
        // Le webhook customer.subscription.updated mettra à jour la base de données automatiquement
        return NextResponse.redirect(
          `${origin}/dashboard/abonnement?upgrade=success&plan=${plan}`,
          303,
        )
      } catch (stripeError) {
        console.error(
          '❌ Erreur lors de la modification de l\'abonnement:',
          stripeError,
        )
        return NextResponse.json(
          {
            error:
              'Erreur lors de la modification de l\'abonnement. Veuillez réessayer.',
          },
          { status: 500 },
        )
      }
    }

    // Si l'utilisateur essaie de souscrire au même plan
    if (existingSubscription?.plan === plan && existingSubscription?.status === 'active') {
      return NextResponse.redirect(
        `${origin}/dashboard/abonnement?error=same_plan`,
        303,
      )
    }

    // Si pas d'abonnement actif ou plan Free, créer une nouvelle session Checkout
    console.log(
      `🆕 New subscription: Creating checkout session for user ${session.user.id} - Plan: ${plan}`,
    )

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: true },
      metadata: {
        userId: session.user.id,
        plan: plan,
      },
    })

    return NextResponse.redirect(checkoutSession.url, 303)
  } catch (err) {
    console.error('❌ Error in checkout_sessions route:', err)
    return NextResponse.json(
      { error: err.message || 'Une erreur est survenue' },
      { status: err.statusCode || 500 },
    )
  }
}
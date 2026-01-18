import { NextResponse } from 'next/server'
import { getCurrentUserId, getUserSubscription } from '@/lib/server-utils'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST() {
  try {
    // Early return pattern with cached auth
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Use cached subscription lookup
    const subscription = await getUserSubscription(userId)

    if (!subscription) {
      return NextResponse.json({ error: 'Abonnement non trouvé' }, { status: 404 })
    }

    // Si c'est un plan Free, on peut simplement le marquer comme annulé
    if (subscription.plan === 'Free') {
      await prisma.subscription.update({
        where: { userId: userId },
        data: {
          status: 'canceled',
          plan: 'Free',
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Abonnement annulé avec succès',
      })
    }

    // Pour les plans payants (Pro ou Agency), annuler via Stripe
    if (subscription.stripeSubscriptionId) {
      try {
        // Annuler l'abonnement Stripe à la fin de la période
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        })

        // Mettre à jour dans la base de données
        await prisma.subscription.update({
          where: { userId: userId },
          data: {
            cancelAtPeriodEnd: true,
          },
        })

        return NextResponse.json({
          success: true,
          message: 'Votre abonnement sera annulé à la fin de la période en cours',
          cancelAtPeriodEnd: true,
        })
      } catch (stripeError: any) {
        console.error('Error canceling Stripe subscription:', stripeError)
        
        // Si l'abonnement Stripe n'existe plus, mettre à jour localement
        if (stripeError.code === 'resource_missing') {
          await prisma.subscription.update({
            where: { userId: userId },
            data: {
              status: 'canceled',
              cancelAtPeriodEnd: false,
            },
          })

          return NextResponse.json({
            success: true,
            message: 'Abonnement annulé avec succès',
          })
        }

        return NextResponse.json(
          { error: 'Erreur lors de l\'annulation de l\'abonnement Stripe' },
          { status: 500 }
        )
      }
    }

    // Si pas d'ID Stripe mais plan payant, mettre à jour localement
    await prisma.subscription.update({
      where: { userId: userId },
      data: {
        status: 'canceled',
        cancelAtPeriodEnd: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Abonnement annulé avec succès',
    })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation de l\'abonnement' },
      { status: 500 }
    )
  }
}

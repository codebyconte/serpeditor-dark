import { prisma } from '@/lib/prisma'

/**
 * Crée un abonnement "Free" pour un nouvel utilisateur
 */
export async function createFreeSubscription(userId: string) {
  try {
    // Vérifier si l'utilisateur a déjà un abonnement
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (existingSubscription) {
      return existingSubscription
    }

    // Créer un abonnement Free par défaut
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        plan: 'Free',
        status: 'active',
      },
    })

    return subscription
  } catch (error) {
    console.error('Error creating free subscription:', error)
    throw error
  }
}

/**
 * Met à jour l'abonnement d'un utilisateur depuis Stripe
 */
export async function updateSubscriptionFromStripe(
  userId: string,
  stripeData: {
    customerId?: string
    subscriptionId?: string
    priceId?: string
    plan: string
    status: string
    currentPeriodStart?: Date
    currentPeriodEnd?: Date
    cancelAtPeriodEnd?: boolean
  },
) {
  try {
    const subscription = await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan: stripeData.plan,
        stripeCustomerId: stripeData.customerId,
        stripeSubscriptionId: stripeData.subscriptionId,
        stripePriceId: stripeData.priceId,
        status: stripeData.status,
        currentPeriodStart: stripeData.currentPeriodStart,
        currentPeriodEnd: stripeData.currentPeriodEnd,
        cancelAtPeriodEnd: stripeData.cancelAtPeriodEnd || false,
      },
      update: {
        plan: stripeData.plan,
        stripeCustomerId: stripeData.customerId,
        stripeSubscriptionId: stripeData.subscriptionId,
        stripePriceId: stripeData.priceId,
        status: stripeData.status,
        currentPeriodStart: stripeData.currentPeriodStart,
        currentPeriodEnd: stripeData.currentPeriodEnd,
        cancelAtPeriodEnd: stripeData.cancelAtPeriodEnd || false,
      },
    })

    return subscription
  } catch (error) {
    console.error('Error updating subscription from Stripe:', error)
    throw error
  }
}

/**
 * Récupère l'abonnement d'un utilisateur ou crée un Free par défaut
 */
export async function getOrCreateSubscription(userId: string) {
  try {
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (!subscription) {
      subscription = await createFreeSubscription(userId)
    }

    return subscription
  } catch (error) {
    console.error('Error getting or creating subscription:', error)
    throw error
  }
}

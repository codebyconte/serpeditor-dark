import { prisma } from '@/lib/prisma'
import { updateSubscriptionFromStripe } from '@/lib/subscription-utils'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const PRICE_TO_PLAN: Record<string, string> = {
  price_1SqwPlRQkqRAWbxYjcxJylw3: 'Pro',
  price_1SqwQKRQkqRAWbxYwCT9G3Pl: 'Agency',
}

// Helper type pour accéder aux propriétés qui peuvent ne pas être dans le type TypeScript
// Stripe peut retourner ces propriétés dans l'objet brut même si elles ne sont pas dans le type TypeScript
type SubscriptionWithRawData = Stripe.Subscription & {
  current_period_start?: number
  current_period_end?: number
  billing_cycle_anchor?: number
}

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('❌ Webhook: Missing signature header')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('❌ Webhook: Missing STRIPE_WEBHOOK_SECRET in environment variables')
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('STRIPE')))
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 })
  }

  // Vérifier que le secret commence bien par "whsec_"
  if (!webhookSecret.startsWith('whsec_')) {
    console.error('❌ Webhook: STRIPE_WEBHOOK_SECRET does not start with "whsec_"')
    console.error('Current value starts with:', webhookSecret.substring(0, 10) + '...')
    console.error('⚠️ Make sure you are using the webhook signing secret from Stripe CLI, not the API key!')
    return NextResponse.json({ error: 'Invalid webhook secret format' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log(`✅ Webhook received: ${event.type} [${event.id}]`)
  } catch (err) {
    const error = err as Error
    console.error('❌ Webhook signature verification failed:', error.message)
    console.error('Webhook secret used (first 15 chars):', webhookSecret.substring(0, 15) + '...')
    console.error('Signature header:', signature.substring(0, 50) + '...')
    console.error('⚠️ Make sure STRIPE_WEBHOOK_SECRET matches the secret from: stripe listen --forward-to localhost:3000/api/webhooks/stripe')
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('📝 Processing checkout.session.completed')
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription' && session.subscription) {
          const subscriptionId = session.subscription as string
          // Récupérer la subscription avec expansion pour avoir toutes les données
          const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['items.data.price.product'],
          })
          const userId = session.metadata?.userId

          if (!userId) {
            console.error('❌ Missing userId in session metadata')
            break
          }

          const priceId = subscription.items.data[0]?.price.id
          const plan = priceId ? PRICE_TO_PLAN[priceId] || 'Free' : 'Free'

          console.log(`✅ Updating subscription for user ${userId} to plan ${plan}`)

          // Créer ou mettre à jour l'abonnement
          // Les timestamps Stripe sont en secondes, on les convertit en millisecondes pour Date
          // Accéder aux propriétés de l'objet subscription via le type étendu
          const subscriptionWithRaw = subscription as SubscriptionWithRawData
          const currentPeriodStartRaw = subscriptionWithRaw.current_period_start
          const currentPeriodEndRaw = subscriptionWithRaw.current_period_end
          const cancelAtPeriodEnd = subscription.cancel_at_period_end || false

          // Si les périodes ne sont pas disponibles, utiliser billing_cycle_anchor comme fallback
          // et calculer la période (généralement 1 mois = 30 jours)
          let currentPeriodStart: Date | undefined
          let currentPeriodEnd: Date | undefined

          if (typeof currentPeriodStartRaw === 'number' && typeof currentPeriodEndRaw === 'number') {
            currentPeriodStart = new Date(currentPeriodStartRaw * 1000)
            currentPeriodEnd = new Date(currentPeriodEndRaw * 1000)
          } else {
            // Utiliser billing_cycle_anchor comme point de départ
            const anchor = subscriptionWithRaw.billing_cycle_anchor ?? subscription.billing_cycle_anchor
            if (anchor && typeof anchor === 'number') {
              currentPeriodStart = new Date(anchor * 1000)
              // Ajouter 1 mois (environ 30 jours) pour la fin de période
              currentPeriodEnd = new Date((anchor + 30 * 24 * 60 * 60) * 1000)
            }
          }

          console.log('Processed subscription data:', {
            currentPeriodStart: currentPeriodStart?.toISOString(),
            currentPeriodEnd: currentPeriodEnd?.toISOString(),
            cancelAtPeriodEnd,
            status: subscription.status,
            usedFallback: !currentPeriodStartRaw || !currentPeriodEndRaw,
          })

          await updateSubscriptionFromStripe(userId, {
            customerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id,
            subscriptionId: subscription.id,
            priceId: priceId || undefined,
            plan,
            status: subscription.status,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd,
          })
          console.log(`✅ Subscription updated successfully for user ${userId}`)
        } else {
          console.log('ℹ️ Session is not a subscription, skipping')
        }
        break
      }

      case 'customer.subscription.updated': {
        console.log('📝 Processing customer.subscription.updated')
        const subscription = event.data.object as SubscriptionWithRawData
        const userId = subscription.metadata?.userId

        const priceId = subscription.items.data[0]?.price.id
        const plan = priceId ? PRICE_TO_PLAN[priceId] || 'Free' : 'Free'
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

        // Extraire les timestamps correctement (peuvent être dans l'objet brut)
        const currentPeriodStartRaw = subscription.current_period_start
        const currentPeriodEndRaw = subscription.current_period_end
        const cancelAtPeriodEnd = subscription.cancel_at_period_end || false

        // Convertir en Date
        const currentPeriodStart =
          typeof currentPeriodStartRaw === 'number' ? new Date(currentPeriodStartRaw * 1000) : undefined
        const currentPeriodEnd =
          typeof currentPeriodEndRaw === 'number' ? new Date(currentPeriodEndRaw * 1000) : undefined

        if (!userId) {
          // Essayer de trouver l'utilisateur via le customer ID
          const existingSub = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          })

          if (!existingSub) {
            console.error('❌ Could not find subscription for update')
            break
          }

          console.log(`✅ Updating subscription for user ${existingSub.userId} to plan ${plan}`)
          await updateSubscriptionFromStripe(existingSub.userId, {
            customerId,
            subscriptionId: subscription.id,
            priceId: priceId || undefined,
            plan,
            status: subscription.status,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd,
          })
        } else {
          console.log(`✅ Updating subscription for user ${userId} to plan ${plan}`)
          await updateSubscriptionFromStripe(userId, {
            customerId,
            subscriptionId: subscription.id,
            priceId: priceId || undefined,
            plan,
            status: subscription.status,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd,
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        console.log('📝 Processing customer.subscription.deleted')
        const subscription = event.data.object as Stripe.Subscription

        const existingSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (existingSub) {
          console.log(`✅ Canceling subscription for user ${existingSub.userId}`)
          // Mettre à jour le statut mais garder l'abonnement en base
          await prisma.subscription.update({
            where: { userId: existingSub.userId },
            data: {
              status: 'canceled',
              cancelAtPeriodEnd: false,
            },
          })
        }
        break
      }

      case 'customer.subscription.created': {
        console.log('📝 Processing customer.subscription.created')
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        // Accéder aux périodes depuis l'événement (plus fiable que retrieve)
        const subWithRaw = subscription as unknown as SubscriptionWithRawData
        const currentPeriodStartRaw = subWithRaw.current_period_start
        const currentPeriodEndRaw = subWithRaw.current_period_end
        
        console.log('Subscription created event data:', {
          subscriptionId: subscription.id,
          currentPeriodStartRaw,
          currentPeriodEndRaw,
          status: subscription.status,
          allKeys: Object.keys(subscription).filter(k => k.includes('period') || k.includes('cancel')),
        })

        if (!userId) {
          // Essayer de trouver l'utilisateur via le customer ID
          const existingSub = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          })

          if (!existingSub) {
            console.log('ℹ️ Subscription created but no userId found, will be handled by checkout.session.completed')
            break
          }

          const priceId = subscription.items.data[0]?.price.id
          const plan = priceId ? PRICE_TO_PLAN[priceId] || 'Free' : 'Free'
          const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

          console.log(`✅ Updating subscription for user ${existingSub.userId} to plan ${plan}`)

          await updateSubscriptionFromStripe(existingSub.userId, {
            customerId,
            subscriptionId: subscription.id,
            priceId: priceId || undefined,
            plan,
            status: subscription.status,
            currentPeriodStart:
              typeof currentPeriodStartRaw === 'number' ? new Date(currentPeriodStartRaw * 1000) : undefined,
            currentPeriodEnd:
              typeof currentPeriodEndRaw === 'number' ? new Date(currentPeriodEndRaw * 1000) : undefined,
            cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
          })
        } else {
          const priceId = subscription.items.data[0]?.price.id
          const plan = priceId ? PRICE_TO_PLAN[priceId] || 'Free' : 'Free'
          const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

          console.log(`✅ Updating subscription for user ${userId} to plan ${plan}`)

          await updateSubscriptionFromStripe(userId, {
            customerId,
            subscriptionId: subscription.id,
            priceId: priceId || undefined,
            plan,
            status: subscription.status,
            currentPeriodStart:
              typeof currentPeriodStartRaw === 'number' ? new Date(currentPeriodStartRaw * 1000) : undefined,
            currentPeriodEnd:
              typeof currentPeriodEndRaw === 'number' ? new Date(currentPeriodEndRaw * 1000) : undefined,
            cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
          })
        }
        break
      }

      default:
        // Ignorer les événements non gérés (charge.succeeded, payment_intent.*, etc.)
        console.log(`ℹ️ Unhandled event type: ${event.type} - ignoring`)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

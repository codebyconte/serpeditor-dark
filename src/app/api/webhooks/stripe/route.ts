import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { updateSubscriptionFromStripe } from '@/lib/subscription-utils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const PRICE_TO_PLAN: Record<string, string> = {
  price_1SqYh8IY7EONGwxefLuSKWsy: 'Pro',
  price_1SqYjOIY7EONGwxeSIg8SPzO: 'Agency',
}

// Type pour les propriétés supplémentaires de Stripe Subscription
interface StripeSubscriptionWithPeriods extends Omit<Stripe.Subscription, 'current_period_start' | 'current_period_end'> {
  current_period_start: number
  current_period_end: number
}

// Helper type pour accéder aux propriétés qui peuvent ne pas être dans le type TypeScript
type SubscriptionWithRawData = Stripe.Subscription & {
  current_period_start?: number
  current_period_end?: number
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
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
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
          // Accéder directement aux propriétés de l'objet subscription
          const subWithRaw = subscription as unknown as SubscriptionWithRawData
          const currentPeriodStartRaw = subWithRaw.current_period_start
          const currentPeriodEndRaw = subWithRaw.current_period_end
          const cancelAtPeriodEnd = subscription.cancel_at_period_end || false

          // Log complet pour debug
          console.log('Full subscription object keys:', Object.keys(subscription))
          const subscriptionJson = JSON.stringify(subscription, null, 2)
          console.log('Subscription object (first 1000 chars):', subscriptionJson.substring(0, 1000))
          
          console.log('Raw subscription data:', {
            currentPeriodStartRaw,
            currentPeriodEndRaw,
            cancelAtPeriodEnd,
            status: subscription.status,
            subscriptionKeys: Object.keys(subscription).filter(k => k.includes('period') || k.includes('cancel')),
            // Essayer d'accéder directement
            directAccess: {
              current_period_start: subWithRaw.current_period_start,
              current_period_end: subWithRaw.current_period_end,
            },
          })

          // Convertir les timestamps en Date (Stripe utilise des timestamps Unix en secondes)
          const currentPeriodStart =
            typeof currentPeriodStartRaw === 'number' ? new Date(currentPeriodStartRaw * 1000) : undefined
          const currentPeriodEnd =
            typeof currentPeriodEndRaw === 'number' ? new Date(currentPeriodEndRaw * 1000) : undefined

          console.log('Processed subscription data:', {
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd,
            status: subscription.status,
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
        const subscription = event.data.object as unknown as StripeSubscriptionWithPeriods
        const userId = subscription.metadata?.userId

        const priceId = subscription.items.data[0]?.price.id
        const plan = priceId ? PRICE_TO_PLAN[priceId] || 'Free' : 'Free'
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

        // Extraire les timestamps correctement
        const currentPeriodStart = subscription.current_period_start
        const currentPeriodEnd = subscription.current_period_end
        const cancelAtPeriodEnd = subscription.cancel_at_period_end || false

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
            currentPeriodStart:
              typeof currentPeriodStart === 'number' ? new Date(currentPeriodStart * 1000) : undefined,
            currentPeriodEnd: typeof currentPeriodEnd === 'number' ? new Date(currentPeriodEnd * 1000) : undefined,
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
            currentPeriodStart:
              typeof currentPeriodStart === 'number' ? new Date(currentPeriodStart * 1000) : undefined,
            currentPeriodEnd: typeof currentPeriodEnd === 'number' ? new Date(currentPeriodEnd * 1000) : undefined,
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

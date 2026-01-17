import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

import { stripe } from '../../../lib/stripe'

// Mapping des plans vers les price_ids Stripe
const PRICE_IDS = {
  Pro: 'price_1SqYh8IY7EONGwxefLuSKWsy',
  Agency: 'price_1SqYjOIY7EONGwxeSIg8SPzO',
}

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: headersList,
    })

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

    // Create Checkout Sessions from body params.
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
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}
'use server'

import { auth } from '@/lib/auth'
import { getUserUsageStats } from '@/lib/usage-utils'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * GET /api/usage
 * Retourne les statistiques d'usage de l'utilisateur connecté
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const usageStats = await getUserUsageStats(session.user.id)

    return NextResponse.json({
      success: true,
      data: usageStats,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques d\'usage:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}

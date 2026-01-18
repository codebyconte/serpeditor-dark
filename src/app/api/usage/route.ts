import { getUserUsageStats } from '@/lib/usage-utils'
import { getCurrentUserId } from '@/lib/server-utils'
import { NextResponse } from 'next/server'

/**
 * GET /api/usage
 * Returns user usage statistics using cached auth
 */
export async function GET() {
  try {
    // Early return pattern - check auth before any other operations
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const usageStats = await getUserUsageStats(userId)

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

import { NextResponse } from 'next/server'
import { getCurrentUser, getCurrentUserId } from '@/lib/server-utils'

/**
 * GET /api/profile
 * Uses React.cache() for per-request deduplication
 */
export async function GET() {
  try {
    // Early return if not authenticated (avoids unnecessary DB query)
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Uses cached function - multiple calls in same request won't hit DB again
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    )
  }
}

import { cache } from 'react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Per-request deduplication with React.cache()
 *
 * These functions are cached within a single request, meaning multiple calls
 * to the same function with the same arguments will only execute once.
 *
 * Benefits:
 * - Eliminates duplicate database queries
 * - Reduces server-side waterfalls
 * - Improves response times
 *
 * @see https://react.dev/reference/react/cache
 */

/**
 * Get the current session - cached per request
 * Multiple components calling this will only make one auth check
 */
export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
})

/**
 * Get the current user ID from session - cached per request
 * Returns null if not authenticated
 */
export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const session = await getSession()
  return session?.user?.id ?? null
})

/**
 * Get user by ID with specific fields - cached per request
 * Only fetches the fields needed to minimize serialization
 */
export const getUserById = cache(async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      emailVerified: true,
    },
  })
})

/**
 * Get the current user (authenticated) - cached per request
 * Combines session check and user fetch efficiently
 */
export const getCurrentUser = cache(async () => {
  const userId = await getCurrentUserId()
  if (!userId) return null
  return getUserById(userId)
})

/**
 * Get user subscription - cached per request
 */
export const getUserSubscription = cache(async (userId: string) => {
  return prisma.subscription.findUnique({
    where: { userId },
    select: {
      id: true,
      plan: true,
      status: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      stripeSubscriptionId: true,
      stripeCustomerId: true,
    },
  })
})

/**
 * Get current user's subscription - cached per request
 */
export const getCurrentUserSubscription = cache(async () => {
  const userId = await getCurrentUserId()
  if (!userId) return null
  return getUserSubscription(userId)
})

/**
 * Get user's projects count - cached per request
 */
export const getUserProjectsCount = cache(async (userId: string) => {
  return prisma.project.count({
    where: { userId },
  })
})

/**
 * Get user's usage tracking for the current month - cached per request
 */
export const getUserMonthlyUsage = cache(async (userId: string) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return prisma.usage_tracking.findFirst({
    where: {
      userId,
      periodStart: {
        gte: startOfMonth,
      },
    },
    orderBy: {
      periodStart: 'desc',
    },
  })
})

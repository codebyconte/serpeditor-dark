import { createAuthClient } from 'better-auth/react'
import { auth } from '@/lib/auth'

/**
 * Create auth client for Better Auth
 * 
 * In Next.js monorepo projects, Better Auth automatically infers types
 * from the server-side auth configuration, so no type parameter is needed.
 * 
 * For separate client/server projects, you would use:
 * createAuthClient<typeof auth>({ baseURL: ... })
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || process.env.BETTER_AUTH_URL,
  plugins: [],
})

// Export commonly used methods
export const { signIn, signUp, signOut, useSession, getSession } = authClient

// Type exports for use in components - inferred from server-side auth config
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user

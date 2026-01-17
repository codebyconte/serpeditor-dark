'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkUsageLimit } from '@/lib/usage-utils'
import { headers } from 'next/headers'
import { z } from 'zod'

export async function addSiteToProject({ siteUrl }: { siteUrl: string }) {
  try {
    const siteUrlSchema = z.url()
    const url = siteUrlSchema.safeParse(siteUrl)

    if (!url.success) {
      return {
        success: false,
        message: "L'URL fournie n'est pas valide",
      }
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Vous devez être connecté',
      }
    }

    // Vérification de la limite de projets
    const usageCheck = await checkUsageLimit(session.user.id, 'projects')
    if (!usageCheck.allowed) {
      return {
        success: false,
        message: usageCheck.message,
        limitReached: true,
        currentUsage: usageCheck.currentUsage,
        limit: usageCheck.limit,
      }
    }

    const validatedUrl = url.data

    const projectExists = await prisma.project.findUnique({
      where: {
        url: validatedUrl,
      },
    })

    if (projectExists) {
      return {
        success: false,
        message: 'Ce site est déjà importé',
      }
    }

    await prisma.project.create({
      data: {
        id: crypto.randomUUID(),
        url: validatedUrl,
        userId: session?.user?.id,
      },
    })

    return {
      success: true,
      message: 'Site ajouté avec succès',
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du site:", error)
    return {
      success: false,
      error: 'Une erreur est survenue',
    }
  }
}

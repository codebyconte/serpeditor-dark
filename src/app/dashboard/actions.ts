'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface DeleteProjectState {
  success: boolean
  error?: string
}

export async function deleteProject(
  projectId: string,
): Promise<DeleteProjectState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Non authentifié',
      }
    }

    // Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      return {
        success: false,
        error: 'Projet non trouvé ou vous n\'avez pas les permissions',
      }
    }

    // Supprimer le projet (les relations seront supprimées en cascade grâce à onDelete: Cascade)
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    })

    // Revalider la page pour mettre à jour l'affichage
    revalidatePath('/dashboard')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting project:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la suppression du projet',
    }
  }
}


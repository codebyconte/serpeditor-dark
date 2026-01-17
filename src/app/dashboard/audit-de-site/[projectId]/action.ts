'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkAndIncrementUsage } from '@/lib/usage-utils'
import { addDays } from 'date-fns'
import { headers } from 'next/headers'
import { z } from 'zod'

// Types de retour
type OnPageTaskResult =
  | {
      success: true
      message: string
      taskId: string
      expiresAt: Date
      status: 'existing' | 'new'
      projectId: string
      crawl_status: 'PENDING'
    }
  | {
      success: false
      error: string
      limitReached?: boolean
    }

// Schéma de validation
const urlSchema = z.string().url('URL invalide')

export const onPageTask = async (url: string): Promise<OnPageTaskResult> => {
  try {
    // Validation de l'URL
    const validatedUrl = urlSchema.safeParse(url)
    if (!validatedUrl.success) {
      return {
        success: false,
        error: "L'URL fournie n'est pas valide",
      }
    }

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Vous devez être connecté pour effectuer cette action',
      }
    }

    // Vérification des limites d'usage pour les pages d'audit (10 pages par audit)
    const maxCrawlPages = 10
    const usageCheck = await checkAndIncrementUsage(session.user.id, 'auditPages', maxCrawlPages)
    if (!usageCheck.allowed) {
      return {
        success: false,
        error: usageCheck.message || 'Limite de pages d\'audit atteinte',
        limitReached: true,
      }
    }

    // Vérification du projet existant
    const existingProject = await prisma.project.findUnique({
      where: {
        url: validatedUrl.data,
      },
      select: {
        userId: true,
        url: true,
        task_id: true,
        task_expires_at: true,
        id: true,
      },
    })

    // Vérification des permissions
    if (existingProject && existingProject.userId !== session.user.id) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à accéder à ce projet",
      }
    }

    // Vérification si une tâche valide existe déjà
    if (existingProject?.task_id && existingProject?.task_expires_at) {
      const now = new Date()
      const isExpired = now > existingProject.task_expires_at

      if (!isExpired) {
        return {
          success: true,
          message: 'Une analyse est déjà en cours pour ce site',
          taskId: existingProject.task_id,
          expiresAt: existingProject.task_expires_at,
          status: 'existing',
          projectId: existingProject.id,
          crawl_status: 'PENDING',
        }
      }
    }

    // Vérification des variables d'environnement
    if (!process.env.DATAFORSEO_URL || !process.env.DATAFORSEO_PASSWORD) {
      console.error("Variables d'environnement DataForSEO manquantes")
      return {
        success: false,
        error: 'Configuration serveur incomplète. Veuillez contacter le support.',
      }
    }

    // Appel à l'API DataForSEO protégé (l'incrémentation est déjà faite plus haut)
    // On utilise protectedDataForSEOPost avec increment=0 pour vérifier sans double comptage
    const { protectedDataForSEOPost } = await import('@/lib/dataforseo-protection')
    const data = await protectedDataForSEOPost<{
      status_code: number
      status_message?: string
      tasks?: Array<{
        id: string
        status_code: number
        status_message?: string
      }>
    }>(
      session.user.id,
      '/on_page/task_post',
      {
        target: validatedUrl.data,
        max_crawl_pages: 10,
      },
      0, // Ne pas incrémenter car déjà fait plus haut avec checkAndIncrementUsage
    )

    if (data.status_code !== 20000) {
      console.error('Erreur DataForSEO:', data.status_message)
      return {
        success: false,
        error: `Erreur du service d'analyse: ${data.status_message || 'Erreur inconnue'}`,
      }
    }

    if (!data.tasks?.[0]?.id) {
      return {
        success: false,
        error: "Réponse invalide du service d'analyse",
      }
    }

    const taskId = data.tasks[0].id
    const now = new Date()
    const expiresAt = addDays(now, 30)

    // Mise à jour ou création du projet
    const project = await prisma.project.upsert({
      where: {
        url: validatedUrl.data,
      },
      create: {
        id: crypto.randomUUID(),
        url: validatedUrl.data,
        userId: session.user.id,
        task_id: taskId,
        task_created_at: now,
        task_expires_at: expiresAt,
        crawl_status: 'PENDING',
      },
      update: {
        task_id: taskId,
        task_created_at: now,
        task_expires_at: expiresAt,
        crawl_status: 'PENDING',
      },
    })

    return {
      success: true,
      message: 'Analyse lancée avec succès',
      taskId: taskId,
      expiresAt: expiresAt,
      status: 'new',
      projectId: project.id,
      crawl_status: 'PENDING',
    }
  } catch (error) {
    console.error('Erreur inattendue dans onPageTask:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
    }
  }
}

// Types pour le statut de la tâche
interface TaskResult {
  id: string
  target: string
  date_posted: string
  tag: string
}

type CheckTaskReadyResult =
  | {
      success: true
      isReady: boolean
      crawl_status: 'READY' | 'PENDING'
      task?: TaskResult
    }
  | {
      success: false
      error: string
    }

export async function checkIfTaskReady(taskId: string): Promise<CheckTaskReadyResult> {
  try {
    // Validation de l'ID de tâche
    if (!taskId || typeof taskId !== 'string') {
      return {
        success: false,
        error: 'ID de tâche invalide',
      }
    }

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Vous devez être connecté pour effectuer cette action',
      }
    }

    // Vérification du projet et des permissions
    const project = await prisma.project.findUnique({
      where: {
        task_id: taskId,
      },
      select: {
        userId: true,
        id: true,
      },
    })

    if (!project) {
      return {
        success: false,
        error: 'Projet introuvable',
      }
    }

    if (project.userId !== session.user.id) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à accéder à ce projet",
      }
    }

    // Vérification des variables d'environnement
    if (!process.env.DATAFORSEO_URL || !process.env.DATAFORSEO_PASSWORD) {
      console.error("Variables d'environnement DataForSEO manquantes")
      return {
        success: false,
        error: 'Configuration serveur incomplète',
      }
    }

    // Appel à l'API DataForSEO protégé (GET request pour vérifier le statut, ne compte pas dans les limites)
    const { protectedDataForSEOFetch } = await import('@/lib/dataforseo-protection')
    const data = await protectedDataForSEOFetch<{
      status_code: number
      status_message?: string
      tasks?: Array<{
        status_code: number
        status_message?: string
        result?: TaskResult[]
      }>
    }>(
      session.user.id,
      '/on_page/tasks_ready',
      {
        method: 'GET',
      },
      0, // Ne pas compter car c'est juste une vérification de statut
    )

    const readyTasks = (data.tasks?.[0]?.result || []) as TaskResult[]
    const myTask = readyTasks.find((task) => task.id === taskId)

    // Mise à jour du statut dans la base de données
    if (myTask) {
      await prisma.project.update({
        where: {
          task_id: taskId,
        },
        data: {
          crawl_status: 'READY',
        },
      })

      return {
        success: true,
        isReady: true,
        crawl_status: 'READY',
        task: myTask,
      }
    } else {
      await prisma.project.update({
        where: {
          task_id: taskId,
        },
        data: {
          crawl_status: 'PENDING',
        },
      })

      return {
        success: true,
        isReady: false,
        crawl_status: 'PENDING',
      }
    }
  } catch (error) {
    console.error('Erreur inattendue dans checkIfTaskReady:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue lors de la vérification',
    }
  }
}

// Type pour le résumé de la page
type OnPageSummaryResult =
  | {
      success: true
      data: unknown
    }
  | {
      success: false
      error: string
    }

// OnPage API Summary
export const onPageSummary = async (taskId: string): Promise<OnPageSummaryResult> => {
  try {
    // Validation de l'ID de tâche
    if (!taskId || typeof taskId !== 'string') {
      return {
        success: false,
        error: 'ID de tâche invalide',
      }
    }

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Vous devez être connecté pour effectuer cette action',
      }
    }

    // Vérification du projet et des permissions
    const project = await prisma.project.findUnique({
      where: {
        task_id: taskId,
      },
      select: {
        userId: true,
        crawl_status: true,
      },
    })

    if (!project) {
      return {
        success: false,
        error: 'Projet introuvable',
      }
    }

    if (project.userId !== session.user.id) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à accéder à ce projet",
      }
    }

    // Vérification que l'analyse est prête
    if (project.crawl_status !== 'READY') {
      return {
        success: false,
        error: "L'analyse n'est pas encore prête",
      }
    }

    // Vérification des variables d'environnement
    if (!process.env.DATAFORSEO_URL || !process.env.DATAFORSEO_PASSWORD) {
      console.error("Variables d'environnement DataForSEO manquantes")
      return {
        success: false,
        error: 'Configuration serveur incomplète',
      }
    }

    // Appel à l'API DataForSEO protégé (GET request pour récupérer les résultats, ne compte pas dans les limites)
    const { protectedDataForSEOFetch } = await import('@/lib/dataforseo-protection')
    const data = await protectedDataForSEOFetch<{
      status_code: number
      status_message?: string
      tasks?: Array<{
        status_code: number
        status_message?: string
        result?: unknown[]
      }>
    }>(
      session.user.id,
      `/on_page/summary/${taskId}`,
      {
        method: 'GET',
      },
      0, // Ne pas compter car c'est juste une récupération de résultats déjà générés
    )

    // Vérification du code de statut de l'API
    if (data.status_code !== 20000) {
      console.error('Erreur DataForSEO:', data.status_message)
      return {
        success: false,
        error: `Erreur du service d'analyse: ${data.status_message || 'Erreur inconnue'}`,
      }
    }

    const result = data.tasks?.[0]?.result?.[0]

    if (!result) {
      return {
        success: false,
        error: 'Aucune donnée disponible pour cette analyse',
      }
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Erreur inattendue dans onPageSummary:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Une erreur inattendue est survenue lors de la récupération des données',
    }
  }
}

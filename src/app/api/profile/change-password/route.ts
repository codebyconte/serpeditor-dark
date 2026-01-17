import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    // Vérifier le mot de passe actuel en tentant une connexion
    const verifyResult = await auth.api.signInEmail({
      body: {
        email: session.user.email,
        password: validatedData.currentPassword,
      },
      headers: await headers(),
    })

    if (!verifyResult || verifyResult.error) {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect' },
        { status: 400 }
      )
    }

    // Changer le mot de passe via better-auth
    // Better-auth utilise l'API updateUser pour mettre à jour le mot de passe
    try {
      const updateResult = await auth.api.updateUser({
        body: {
          password: validatedData.newPassword,
        },
        headers: await headers(),
      })

      if (updateResult?.error) {
        return NextResponse.json(
          { error: updateResult.error.message || 'Erreur lors du changement de mot de passe' },
          { status: 400 }
        )
      }
    } catch (updateError) {
      // Si updateUser n'est pas disponible, utiliser une approche alternative
      console.error('Error updating password via better-auth:', updateError)
      return NextResponse.json(
        { error: 'Fonctionnalité de changement de mot de passe non disponible. Veuillez utiliser "Mot de passe oublié".' },
        { status: 501 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Mot de passe modifié avec succès',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

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
    try {
      const verifyResult = await auth.api.signInEmail({
        body: {
          email: session.user.email,
          password: validatedData.currentPassword,
        },
        headers: await headers(),
      })

      // Si la connexion échoue, le mot de passe est incorrect
      if (!verifyResult || !verifyResult.user) {
        return NextResponse.json(
          { error: 'Mot de passe actuel incorrect' },
          { status: 400 }
        )
      }
    } catch {
      // Si signInEmail lève une erreur, le mot de passe est incorrect
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect' },
        { status: 400 }
      )
    }

    // Changer le mot de passe en mettant à jour directement dans la base de données
    // Better-auth stocke les mots de passe dans la table account
    try {
      // Trouver le compte email/password de l'utilisateur
      const account = await prisma.account.findFirst({
        where: {
          userId: session.user.id,
          providerId: 'credential', // Better-auth utilise 'credential' pour email/password
        },
      })

      if (!account) {
        return NextResponse.json(
          { error: 'Compte email/password non trouvé' },
          { status: 404 }
        )
      }

      // Hasher le nouveau mot de passe (better-auth utilise bcrypt avec 10 rounds par défaut)
      const hashedPassword = await hash(validatedData.newPassword, 10)

      // Mettre à jour le mot de passe dans la base de données
      await prisma.account.update({
        where: { id: account.id },
        data: {
          password: hashedPassword,
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Mot de passe modifié avec succès',
      })
    } catch (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du mot de passe' },
        { status: 500 }
      )
    }
  

    return NextResponse.json({
      success: true,
      message: 'Mot de passe modifié avec succès',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
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

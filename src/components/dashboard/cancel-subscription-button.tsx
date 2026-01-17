'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface CancelSubscriptionButtonProps {
  currentPlan: string
  cancelAtPeriodEnd?: boolean
  currentPeriodEnd?: Date | null
}

export function CancelSubscriptionButton({
  currentPlan,
  cancelAtPeriodEnd,
  currentPeriodEnd,
}: CancelSubscriptionButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const formatDate = (date: Date | null) => {
    if (!date) return null
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  async function handleCancel() {
    startTransition(async () => {
      try {
        const response = await fetch('/api/subscription/cancel', {
          method: 'POST',
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.error || 'Erreur lors de l\'annulation de l\'abonnement')
          return
        }

        toast.success(data.message || 'Abonnement annulé avec succès')
        setOpen(false)
        router.refresh()
      } catch (error) {
        console.error('Error canceling subscription:', error)
        toast.error('Une erreur est survenue lors de l\'annulation')
      }
    })
  }

  // Ne pas afficher le bouton pour le plan Free
  if (currentPlan === 'Free') {
    return null
  }

  // Si l'annulation est déjà programmée
  if (cancelAtPeriodEnd) {
    return (
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <XCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              Annulation programmée
            </p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
              Votre abonnement sera annulé le {currentPeriodEnd ? formatDate(currentPeriodEnd) : 'à la fin de la période en cours'}.
              Vous continuerez à avoir accès à toutes les fonctionnalités jusqu&apos;à cette date.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen} >
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-red-500/20 text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300 hover:cursor-pointer"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Annuler l&apos;abonnement
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-mist-600">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer l&apos;annulation</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Êtes-vous sûr de vouloir annuler votre abonnement <strong>{currentPlan}</strong> ?
            </p>
            {currentPeriodEnd && (
              <p className="text-sm">
                Votre abonnement restera actif jusqu&apos;au{' '}
                <strong>{formatDate(currentPeriodEnd)}</strong>. Vous continuerez à avoir accès à
                toutes les fonctionnalités jusqu&apos;à cette date.
              </p>
            )}
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Après l&apos;annulation, vous passerez automatiquement au plan gratuit.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className="hover:cursor-pointer">Conserver l&apos;abonnement</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isPending}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 hover:cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Annulation...
              </>
            ) : (
              'Confirmer l\'annulation'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

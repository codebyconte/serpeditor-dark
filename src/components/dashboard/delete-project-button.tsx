'use client'

import { deleteProject } from '@/app/dashboard/actions'
import { Button } from '@/components/dashboard/button'
import { DropdownItem } from '@/components/dashboard/dropdown'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

interface DeleteProjectButtonProps {
  projectId: string
  projectUrl: string
}

export function DeleteProjectButton({ projectId, projectUrl }: DeleteProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const shouldOpenRef = useRef(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteProject(projectId)
      if (result.success) {
        toast.success('Projet supprimé avec succès')
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    shouldOpenRef.current = true
    // Ouvrir le dialogue après un court délai pour laisser le dropdown se fermer
    setTimeout(() => {
      if (shouldOpenRef.current) {
        setIsOpen(true)
        shouldOpenRef.current = false
      }
    }, 100)
  }

  // Empêcher la fermeture automatique du dialogue
  const handleOpenChange = (open: boolean) => {
    if (!open && isDeleting) {
      // Ne pas fermer si on est en train de supprimer
      return
    }
    setIsOpen(open)
  }

  return (
    <>
      <DropdownItem onClick={handleClick}>
        <Trash2 data-slot="icon" />
        Supprimer
      </DropdownItem>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="border-border bg-[var(--card)]">
          <DialogHeader>
            <DialogTitle>Supprimer le projet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le projet{' '}
              <strong>&quot;{projectUrl.replace(/^https?:\/\//, '')}&quot;</strong> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <p className="dashboard-body-sm text-muted-foreground">
            Toutes les données associées à ce projet (mots-clés, groupes, tags, historique) seront également supprimées.
          </p>
          <DialogFooter>
            <Button plain onClick={() => setIsOpen(false)} disabled={isDeleting}>
              Annuler
            </Button>
            <Button color="red" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

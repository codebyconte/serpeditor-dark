'use client'

import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/dashboard/dialog'
import { Button, PlainButton } from '@/components/elements/button'
import { authClient } from '@/lib/auth-client'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export function OpenModal() {
  let [isOpen, setIsOpen] = useState(false)

  const requestGoogleAccess = async () => {
    await authClient.linkSocial({
      provider: 'google',
      callbackURL: '/dashboard/new-project',
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    })
  }

  return (
    <>
      <section>
        <Button onClick={() => setIsOpen(true)} type="button" className="flex items-center" color="dark/light">
          <Plus />
          Créer un projet
        </Button>
        <Dialog open={isOpen} onClose={setIsOpen}>
          <DialogTitle>Connecter Google Search Console</DialogTitle>
          <DialogDescription>
            Pour ajouter un projet, vous devez d&apos;abord autoriser l&apos;accès à votre compte Google. Cela nous
            permet de récupérer vos sites et leurs données en toute sécurité.
          </DialogDescription>

          <DialogActions>
            <PlainButton onClick={() => setIsOpen(false)}>Annuler</PlainButton>
            <Button color="dark/light" onClick={() => requestGoogleAccess()}>
              Connecter avec Google
            </Button>
          </DialogActions>
        </Dialog>
      </section>
    </>
  )
}

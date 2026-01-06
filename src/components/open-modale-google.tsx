'use client'

import { Button } from '@/components/dashboard/button'
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/dashboard/dialog'
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
        <Button onClick={() => setIsOpen(true)} type="button" color="teal" className="flex items-center">
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
            <Button plain onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button color="indigo" onClick={() => requestGoogleAccess()}>
              Connecter avec Google
            </Button>
          </DialogActions>
        </Dialog>
      </section>
    </>
  )
}

'use client'

import { useClipboard } from '@/hooks'
import { CheckIcon, CopyIcon } from 'lucide-react'

interface CopyCodeButtonProps {
  code: string
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const { copy, copied } = useClipboard({
    successMessage: 'Code copié !',
  })

  return (
    <button
      onClick={() => copy(code)}
      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-md bg-mist-700 text-mist-200 transition-colors hover:bg-mist-600 hover:text-white"
      aria-label={copied ? 'Code copié' : 'Copier le code'}
      title={copied ? 'Copié !' : 'Copier'}
    >
      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
    </button>
  )
}

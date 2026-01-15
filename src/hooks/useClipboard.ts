'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface UseClipboardOptions {
  successMessage?: string
  errorMessage?: string
  timeout?: number
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const {
    successMessage = 'Copié dans le presse-papiers',
    errorMessage = 'Échec de la copie',
    timeout = 2000,
  } = options

  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success(successMessage)

        setTimeout(() => {
          setCopied(false)
        }, timeout)

        return true
      } catch {
        toast.error(errorMessage)
        return false
      }
    },
    [successMessage, errorMessage, timeout]
  )

  return { copy, copied }
}

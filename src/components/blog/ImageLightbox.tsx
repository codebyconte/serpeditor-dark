'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ImageLightboxProps {
  src: string
  alt: string
  caption?: string
  children: React.ReactNode
}

export function ImageLightbox({ src, alt, caption, children }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-zoom-in" role="button" tabIndex={0}>
        {children}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Fermer"
          >
            <XIcon className="h-5 w-5" />
          </button>

          <div className="relative flex items-center justify-center min-h-[50vh] max-h-[90vh] p-4">
            <Image
              src={src}
              alt={alt}
              width={1920}
              height={1080}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
              priority
            />
          </div>

          {caption && (
            <div className="px-6 pb-4 text-center text-sm text-white/80 italic">{caption}</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

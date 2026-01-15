import { Main } from '@/components/elements/main'
import { Toaster } from '@/components/ui/sonner'
import 'easymde/dist/easymde.min.css'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SerpEditor',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <>
          <Main>{children}</Main>
        </>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  )
}

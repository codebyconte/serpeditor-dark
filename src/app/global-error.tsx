'use client'

/**
 * Root global error boundary (Next.js best practice).
 * Catches errors in the root layout; must define its own <html>/<body>.
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  void error // utilisé par Next.js, non affiché dans cette UI minimale
  return (
    <html lang="fr">
      <body>
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Une erreur s&apos;est produite</h1>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Désolé, un problème est survenu. Veuillez réessayer.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}

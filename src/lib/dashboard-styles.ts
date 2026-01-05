/**
 * Système de design cohérent pour le dashboard
 * Toutes les classes CSS standardisées selon les meilleures pratiques UI/UX
 */

export const dashboardStyles = {
  // Typography
  typography: {
    pageTitle: 'text-3xl font-bold tracking-tight',
    sectionTitle: 'text-2xl font-semibold tracking-tight',
    cardTitle: 'text-xl font-semibold',
    subtitle: 'text-lg font-medium',
    body: 'text-base',
    description: 'text-sm text-muted-foreground',
    caption: 'text-xs text-muted-foreground',
    label: 'text-sm font-medium',
  },

  // Containers
  containers: {
    page: 'min-h-screen',
    section: 'space-y-6',
    card: 'rounded-xl border bg-card p-6 shadow-sm',
    cardLg: 'rounded-2xl border bg-card p-8 shadow-lg',
    form: 'rounded-2xl border bg-card p-8 shadow-lg',
  },

  // Form Elements
  form: {
    input: 'w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base focus:border-ring focus:ring-4 focus:ring-ring/20 transition-colors',
    select: 'w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base focus:border-ring focus:ring-4 focus:ring-ring/20 transition-colors',
    textarea: 'w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base focus:border-ring focus:ring-4 focus:ring-ring/20 transition-colors',
    label: 'mb-2 block text-sm font-semibold',
    checkbox: 'h-5 w-5 rounded border-input text-primary focus:ring-2 focus:ring-primary',
  },

  // Buttons
  buttons: {
    primary: 'flex items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 transition-all',
    secondary: 'flex items-center justify-center gap-3 rounded-xl border bg-secondary px-6 py-3 text-base font-semibold text-secondary-foreground hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
    ghost: 'flex items-center justify-center gap-3 rounded-xl px-6 py-3 text-base font-semibold hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all',
  },

  // States
  states: {
    loading: 'flex flex-col items-center justify-center rounded-2xl border bg-card p-16',
    empty: 'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card/50 p-16 text-center',
    error: 'mt-6 flex items-start gap-3 rounded-xl border-2 border-destructive/50 bg-destructive/10 p-4',
    success: 'mt-6 flex items-start gap-3 rounded-xl border-2 border-green-500/50 bg-green-500/10 p-4',
    info: 'rounded-xl border-2 border-primary/30 bg-primary/5 p-4',
  },

  // Results
  results: {
    container: 'space-y-6',
    header: 'mb-6 flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm',
    grid: 'grid gap-6',
    gridCols2: 'grid gap-6 md:grid-cols-2',
    gridCols3: 'grid gap-6 md:grid-cols-3',
    gridCols4: 'grid gap-6 md:grid-cols-2 lg:grid-cols-4',
  },

  // Icons
  icons: {
    sm: 'h-4 w-4',
    base: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  },

  // Spacing
  spacing: {
    section: 'space-y-6',
    tight: 'space-y-3',
    loose: 'space-y-8',
  },
} as const

// Helper pour combiner les classes
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

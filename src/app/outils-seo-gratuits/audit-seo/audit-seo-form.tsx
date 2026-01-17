'use client'

import { Button } from '@/components/elements/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Gauge,
  Globe,
  HelpCircle,
  ImageIcon,
  Link2,
  Loader2,
  Search,
  Server,
  Share2,
  Shield,
  XCircle,
  Zap,
} from 'lucide-react'
import { useActionState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { auditSeoInstant, type AuditSeoState, type InstantPagesResult } from './action'

const auditSeoSchema = z.object({
  url: z
    .string()
    .min(1, "L'URL est requise")
    .url('Veuillez entrer une URL valide')
    .refine(
      (url) => {
        try {
          const parsed = new URL(url)
          return parsed.protocol === 'http:' || parsed.protocol === 'https:'
        } catch {
          return false
        }
      },
      {
        message: "L'URL doit commencer par http:// ou https://",
      },
    ),
})

type AuditSeoFormValues = z.infer<typeof auditSeoSchema>

export function AuditSeoForm() {
  const initialState: AuditSeoState = {
    success: false,
  }

  const [state, formAction, isPending] = useActionState(auditSeoInstant, initialState)
  const [isTransitioning, startTransition] = useTransition()

  const form = useForm<AuditSeoFormValues>({
    resolver: zodResolver(auditSeoSchema),
    defaultValues: {
      url: '',
    },
  })

  const onSubmit = (values: AuditSeoFormValues) => {
    startTransition(() => {
      const formData = new FormData()
      formData.set('url', values.url.trim())
      formAction(formData)
    })
  }

  return (
    <div className="space-y-6">
      {/* Formulaire */}
      <Card className="overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg dark:border-gray-800/50 dark:bg-gray-900/50">
        <CardHeader>
          <CardTitle>Entrez l&apos;URL à analyser</CardTitle>
          <CardDescription>
            Analysez n&apos;importe quelle page web pour obtenir un rapport SEO détaillé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la page</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        className="w-full"
                        disabled={isPending || isTransitioning}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full gap-3 hover:cursor-pointer"
                disabled={isPending || isTransitioning}
                size="lg"
              >
                {isPending || isTransitioning ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Lancer l&apos;audit SEO
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Erreur */}
      {state.error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-destructive mb-1 font-semibold">Erreur</h3>
                <p className="text-destructive/90 text-sm">
                  {typeof state.error === 'string' ? state.error : 'Une erreur est survenue'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {state.success && state.result && <AuditResults result={state.result} url={state.url || ''} />}
    </div>
  )
}

// Composant Score Circulaire
function CircularScore({ score, size = 180 }: { score: number; size?: number }) {
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getScoreColor = (score: number) => {
    if (score >= 90) return { stroke: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', text: 'text-green-500' }
    if (score >= 50) return { stroke: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: 'text-amber-500' }
    return { stroke: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'text-red-500' }
  }

  const colors = getScoreColor(score)
  const label = score >= 90 ? 'Excellent' : score >= 50 ? 'À améliorer' : 'Critique'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${colors.text}`}>{score.toFixed(0)}</span>
        <span className="text-muted-foreground text-sm">/ 100</span>
        <span className={`mt-1 text-xs font-medium ${colors.text}`}>{label}</span>
      </div>
    </div>
  )
}

// Composant Métrique avec Tooltip
function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  tooltip,
  status,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  unit?: string
  tooltip: string
  status?: 'good' | 'warning' | 'bad'
}) {
  const statusColors = {
    good: 'border-green-500/30 bg-green-500/5',
    warning: 'border-amber-500/30 bg-amber-500/5',
    bad: 'border-red-500/30 bg-red-500/5',
  }

  const statusIconColors = {
    good: 'text-green-500',
    warning: 'text-amber-500',
    bad: 'text-red-500',
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`rounded-lg border p-4 transition-all hover:shadow-md ${status ? statusColors[status] : 'border-gray-200 dark:border-gray-700'}`}
        >
          <div className="flex items-start justify-between">
            <div
              className={`rounded-lg p-2 ${status ? statusIconColors[status] : 'text-muted-foreground'} bg-gray-100 dark:bg-gray-800`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <HelpCircle className="text-muted-foreground h-3.5 w-3.5" />
          </div>
          <div className="mt-3">
            <p className="text-muted-foreground text-xs font-medium">{label}</p>
            <p className="mt-1 text-xl font-bold">
              {value}
              {unit && <span className="text-muted-foreground ml-1 text-sm font-normal">{unit}</span>}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-mist-600">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}

// Composant Check SEO avec catégorie
function SeoCheck({
  label,
  passed,
  category,
  description,
}: {
  label: string
  passed: boolean
  category: string
  description: string
}) {
  const categoryColors: Record<string, 'green' | 'blue' | 'purple' | 'amber' | 'cyan' | 'red'> = {
    content: 'blue',
    technique: 'purple',
    sécurité: 'green',
    performance: 'amber',
    indexation: 'cyan',
    social: 'red',
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
            passed
              ? 'border-green-500/20 bg-green-500/5 hover:bg-green-500/10'
              : 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10'
          }`}
        >
          {passed ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-red-500" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{label}</p>
          </div>
          <Badge color={categoryColors[category] || 'zinc'} className="shrink-0">
            {category}
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-mist-600">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}

// Composant Core Web Vital
function CoreWebVital({
  label,
  value,
  unit,
  goodThreshold,
  badThreshold,
  description,
}: {
  label: string
  value: number
  unit: string
  goodThreshold: number
  badThreshold: number
  description: string
}) {
  const status = value <= goodThreshold ? 'good' : value <= badThreshold ? 'warning' : 'bad'
  const statusLabels = { good: 'Bon', warning: 'À améliorer', bad: 'Mauvais' }
  const statusColors = {
    good: 'bg-green-500',
    warning: 'bg-amber-500',
    bad: 'bg-red-500',
  }
  const progressValue = Math.min((value / badThreshold) * 100, 100)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            <Badge color={status === 'good' ? 'green' : status === 'warning' ? 'amber' : 'red'}>
              {statusLabels[status]}
            </Badge>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold">{value.toFixed(0)}</span>
            <span className="text-muted-foreground mb-1 text-sm">{unit}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full transition-all duration-500 ${statusColors[status]}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>0</span>
            <span className="text-green-500">
              {goodThreshold}
              {unit}
            </span>
            <span className="text-amber-500">
              {badThreshold}
              {unit}
            </span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-mist-600">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}

// Descriptions des checks SEO
const checkDescriptions: Record<string, { label: string; category: string; description: string }> = {
  // Contenu
  title: {
    label: 'Balise Title présente',
    category: 'content',
    description: 'La page possède une balise title pour le référencement.',
  },
  description: {
    label: 'Meta description présente',
    category: 'content',
    description: 'La page possède une meta description pour les résultats de recherche.',
  },
  no_title: { label: 'Titre manquant', category: 'content', description: 'La page ne possède pas de balise title.' },
  title_too_long: {
    label: 'Titre trop long',
    category: 'content',
    description: 'Le titre dépasse 60 caractères, il sera tronqué dans les résultats de recherche.',
  },
  title_too_short: {
    label: 'Titre trop court',
    category: 'content',
    description: 'Le titre est trop court (moins de 30 caractères) pour être efficace.',
  },
  no_description: {
    label: 'Description manquante',
    category: 'content',
    description: 'La page ne possède pas de meta description.',
  },
  description_too_long: {
    label: 'Description trop longue',
    category: 'content',
    description: 'La description dépasse 160 caractères.',
  },
  description_too_short: {
    label: 'Description trop courte',
    category: 'content',
    description: 'La description est trop courte pour être efficace.',
  },
  no_h1_tag: {
    label: 'Balise H1 manquante',
    category: 'content',
    description: 'La page ne possède pas de balise H1, importante pour la hiérarchie du contenu.',
  },
  has_h1_tag: { label: 'Balise H1 présente', category: 'content', description: 'La page possède une balise H1.' },
  duplicate_title: {
    label: 'Titre en double',
    category: 'content',
    description: 'Le titre de cette page est identique à une autre page du site.',
  },
  duplicate_description: {
    label: 'Description en double',
    category: 'content',
    description: 'La meta description est identique à une autre page.',
  },
  duplicate_content: {
    label: 'Contenu dupliqué',
    category: 'content',
    description: 'Le contenu de cette page est similaire à une autre page.',
  },
  low_content_rate: {
    label: 'Faible ratio de contenu',
    category: 'content',
    description: 'Le ratio texte/HTML est faible, ajoutez plus de contenu textuel.',
  },
  high_content_rate: {
    label: 'Bon ratio de contenu',
    category: 'content',
    description: 'Le ratio texte/HTML est optimal.',
  },
  low_character_count: {
    label: 'Peu de caractères',
    category: 'content',
    description: 'La page contient peu de texte, ce qui peut affecter le référencement.',
  },
  small_page_size: { label: 'Page légère', category: 'content', description: 'La page a une taille raisonnable.' },
  large_page_size: {
    label: 'Page lourde',
    category: 'content',
    description: 'La page est lourde et peut être longue à charger.',
  },
  low_readability_rate: {
    label: 'Lisibilité faible',
    category: 'content',
    description: 'Le texte est difficile à lire pour les utilisateurs.',
  },

  // Technique
  is_https: {
    label: 'HTTPS activé',
    category: 'sécurité',
    description: 'La page utilise une connexion sécurisée HTTPS.',
  },
  is_http: {
    label: 'HTTP non sécurisé',
    category: 'sécurité',
    description: 'La page utilise HTTP, passez à HTTPS pour la sécurité.',
  },
  has_meta_refresh_redirect: {
    label: 'Redirection meta refresh',
    category: 'technique',
    description: 'Utilise une redirection meta refresh, préférez les redirections serveur.',
  },
  no_redirect: {
    label: 'Pas de redirection',
    category: 'technique',
    description: 'La page ne fait pas de redirection.',
  },
  is_redirect: {
    label: 'Page de redirection',
    category: 'technique',
    description: 'Cette page redirige vers une autre URL.',
  },
  is_4xx_code: {
    label: 'Erreur 4xx',
    category: 'technique',
    description: 'La page retourne une erreur 4xx (non trouvée, accès refusé, etc.).',
  },
  is_5xx_code: {
    label: 'Erreur serveur 5xx',
    category: 'technique',
    description: 'La page retourne une erreur serveur.',
  },
  is_broken: { label: 'Page cassée', category: 'technique', description: 'La page ne fonctionne pas correctement.' },
  is_www: { label: 'Utilise www', category: 'technique', description: 'La page utilise le préfixe www.' },
  no_encoding_meta_tag: {
    label: 'Encodage non spécifié',
    category: 'technique',
    description: 'La page ne spécifie pas son encodage de caractères.',
  },
  has_encoding_meta_tag: {
    label: 'Encodage spécifié',
    category: 'technique',
    description: "L'encodage des caractères est correctement spécifié.",
  },
  canonical: {
    label: 'URL canonique définie',
    category: 'indexation',
    description: 'Une URL canonique est définie pour éviter le contenu dupliqué.',
  },
  no_canonical: {
    label: 'URL canonique manquante',
    category: 'indexation',
    description: 'Aucune URL canonique définie, risque de contenu dupliqué.',
  },

  // Indexation
  is_noindex: {
    label: 'Noindex activé',
    category: 'indexation',
    description: 'La page demande à ne pas être indexée par les moteurs de recherche.',
  },
  no_noindex: {
    label: 'Indexation autorisée',
    category: 'indexation',
    description: 'La page peut être indexée par les moteurs de recherche.',
  },
  recursive_canonical: {
    label: 'Canonical récursif',
    category: 'indexation',
    description: "L'URL canonique pointe vers elle-même, c'est correct.",
  },
  canonical_to_redirect: {
    label: 'Canonical vers redirection',
    category: 'indexation',
    description: "L'URL canonique pointe vers une page qui redirige.",
  },
  canonical_to_broken: {
    label: 'Canonical vers page cassée',
    category: 'indexation',
    description: "L'URL canonique pointe vers une page qui ne fonctionne pas.",
  },
  seo_friendly_url: {
    label: 'URL SEO-friendly',
    category: 'indexation',
    description: "L'URL est optimisée pour le référencement.",
  },
  seo_friendly_url_characters_check: {
    label: 'Caractères URL valides',
    category: 'indexation',
    description: "L'URL ne contient que des caractères appropriés.",
  },
  seo_friendly_url_keywords_check: {
    label: "Mots-clés dans l'URL",
    category: 'indexation',
    description: "L'URL contient des mots-clés pertinents.",
  },
  seo_friendly_url_relative_length_check: {
    label: 'Longueur URL correcte',
    category: 'indexation',
    description: "L'URL a une longueur appropriée.",
  },
  seo_friendly_url_dynamic_check: {
    label: 'URL dynamique',
    category: 'indexation',
    description: "L'URL contient des paramètres dynamiques.",
  },
  has_sitemap_record: {
    label: 'Dans le sitemap',
    category: 'indexation',
    description: 'Cette page est référencée dans le sitemap.xml.',
  },
  no_sitemap_record: {
    label: 'Absente du sitemap',
    category: 'indexation',
    description: "Cette page n'est pas dans le sitemap.xml.",
  },

  // Images et médias
  no_image_alt: {
    label: 'Images sans alt',
    category: 'content',
    description: "Certaines images n'ont pas de texte alternatif.",
  },
  no_image_title: {
    label: 'Images sans title',
    category: 'content',
    description: "Certaines images n'ont pas d'attribut title.",
  },
  has_favicon: { label: 'Favicon présent', category: 'technique', description: 'La page possède une favicon.' },
  no_favicon: { label: 'Favicon manquant', category: 'technique', description: 'La page ne possède pas de favicon.' },

  // Social
  has_micromarkup: {
    label: 'Données structurées',
    category: 'social',
    description: 'La page contient des données structurées (Schema.org).',
  },
  no_micromarkup: {
    label: 'Données structurées manquantes',
    category: 'social',
    description: 'Aucune donnée structurée trouvée.',
  },
  has_misspelling: {
    label: "Fautes d'orthographe",
    category: 'content',
    description: "Des fautes d'orthographe ont été détectées.",
  },
  has_broken_resources: {
    label: 'Ressources cassées',
    category: 'technique',
    description: 'Certaines ressources (images, scripts, CSS) ne se chargent pas.',
  },
  has_broken_links: {
    label: 'Liens cassés',
    category: 'technique',
    description: 'Certains liens pointent vers des pages inexistantes.',
  },

  // Performance
  high_loading_time: {
    label: 'Temps de chargement élevé',
    category: 'performance',
    description: 'La page met trop de temps à se charger.',
  },
  high_waiting_time: {
    label: 'TTFB élevé',
    category: 'performance',
    description: 'Le temps de réponse du serveur est trop long.',
  },
  flash: { label: 'Contenu Flash', category: 'technique', description: 'La page contient du contenu Flash, obsolète.' },
  frame: {
    label: 'Frames utilisés',
    category: 'technique',
    description: 'La page utilise des frames, déconseillé pour le SEO.',
  },
  lorem_ipsum: {
    label: 'Contenu Lorem Ipsum',
    category: 'content',
    description: 'La page contient du texte placeholder.',
  },
  has_deprecated_html_tags: {
    label: 'Balises HTML dépréciées',
    category: 'technique',
    description: 'La page utilise des balises HTML obsolètes.',
  },
  has_render_blocking_resources: {
    label: 'Ressources bloquantes',
    category: 'performance',
    description: 'Certaines ressources bloquent le rendu de la page.',
  },
  redirect_chain: {
    label: 'Chaîne de redirections',
    category: 'technique',
    description: "La page fait partie d'une chaîne de redirections.",
  },
  canonical_chain: {
    label: 'Chaîne de canonicals',
    category: 'indexation',
    description: 'Les URLs canoniques forment une chaîne.',
  },
  has_links_to_redirects: {
    label: 'Liens vers redirections',
    category: 'technique',
    description: 'La page contient des liens vers des pages qui redirigent.',
  },
  is_orphan_page: {
    label: 'Page orpheline',
    category: 'indexation',
    description: "Cette page n'est pas liée depuis d'autres pages du site.",
  },
}

function AuditResults({ result, url }: { result: InstantPagesResult; url: string }) {
  const checks = result.checks || {}
  const meta = result.meta || {}
  const pageTiming = result.page_timing || {}

  // Calcul des statistiques
  const passedChecks = Object.entries(checks).filter(([, passed]) => passed === true).length
  const failedChecks = Object.entries(checks).filter(([, passed]) => passed === false).length
  const totalChecks = Object.keys(checks).length
  const score = result.onpage_score || (totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0)

  // Catégoriser les checks
  const categorizedChecks = Object.entries(checks).reduce(
    (acc, [key, passed]) => {
      const info = checkDescriptions[key] || {
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        category: 'technique',
        description: `Vérification: ${key.replace(/_/g, ' ')}`,
      }
      if (!acc[info.category]) acc[info.category] = []
      acc[info.category].push({ key, passed: passed as boolean, ...info })
      return acc
    },
    {} as Record<string, Array<{ key: string; passed: boolean; label: string; category: string; description: string }>>,
  )

  return (
    <div className="space-y-6">
      {/* En-tête avec score et résumé */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            {/* Score circulaire */}
            <div className="flex flex-col items-center">
              <CircularScore score={score} />
              <p className="text-muted-foreground mt-4 text-center text-sm">Score SEO On-Page</p>
            </div>

            {/* Statistiques rapides */}
            <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-white p-4 text-center shadow-sm dark:bg-gray-800">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">{passedChecks}</span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">Validés</p>
              </div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm dark:bg-gray-800">
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-500">{failedChecks}</span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">À corriger</p>
              </div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm dark:bg-gray-800">
                <div className="flex items-center justify-center gap-2">
                  <Link2 className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold">
                    {(meta.internal_links_count || 0) + (meta.external_links_count || 0)}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">Liens</p>
              </div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm dark:bg-gray-800">
                <div className="flex items-center justify-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-500" />
                  <span className="text-2xl font-bold">{meta.images_count || 0}</span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">Images</p>
              </div>
            </div>
          </div>

          {/* URL analysée */}
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-white/50 p-3 dark:bg-gray-800/50">
            <Globe className="text-muted-foreground h-4 w-4" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary flex items-center gap-1 text-sm hover:underline"
            >
              {url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Tabs pour les différentes sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Aperçu</span>
          </TabsTrigger>
          <TabsTrigger value="checks" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Vérifications</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Contenu</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Aperçu */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Métadonnées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Métadonnées SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Titre (Title Tag)</label>
                  {meta.title_length && (
                    <Badge color={meta.title_length <= 60 ? 'green' : 'amber'}>
                      {meta.title_length} / 60 caractères
                    </Badge>
                  )}
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="text-sm">
                    {meta.title || <span className="text-muted-foreground italic">Non défini</span>}
                  </p>
                </div>
                {meta.title_length && (
                  <Progress value={Math.min((meta.title_length / 60) * 100, 100)} className="h-1.5" />
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Meta Description</label>
                  {meta.description_length && (
                    <Badge color={meta.description_length <= 160 ? 'green' : 'amber'}>
                      {meta.description_length} / 160 caractères
                    </Badge>
                  )}
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="text-sm">
                    {meta.description || <span className="text-muted-foreground italic">Non définie</span>}
                  </p>
                </div>
                {meta.description_length && (
                  <Progress value={Math.min((meta.description_length / 160) * 100, 100)} className="h-1.5" />
                )}
              </div>

              {/* URL Canonique */}
              {meta.canonical && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL Canonique</label>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-sm break-all">{meta.canonical}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Structure des titres */}
          {meta.htags && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Structure des titres (Headings)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(['h1', 'h2', 'h3', 'h4'] as const).map((tag) => {
                    const tags = meta.htags?.[tag]
                    if (!tags || tags.length === 0) return null
                    return (
                      <div key={tag} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            color={tag === 'h1' ? 'blue' : tag === 'h2' ? 'purple' : tag === 'h3' ? 'cyan' : 'zinc'}
                          >
                            {tag.toUpperCase()}
                          </Badge>
                          <span className="text-muted-foreground text-sm">({tags.length})</span>
                        </div>
                        <div className="space-y-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                          {tags.slice(0, 5).map((heading, index) => (
                            <p key={index} className="text-sm">
                              {heading}
                            </p>
                          ))}
                          {tags.length > 5 && (
                            <p className="text-muted-foreground text-xs">+ {tags.length - 5} autres...</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Métriques clés */}
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              icon={Link2}
              label="Liens internes"
              value={meta.internal_links_count || 0}
              tooltip="Nombre de liens pointant vers d'autres pages de votre site"
              status={(meta.internal_links_count || 0) >= 3 ? 'good' : 'warning'}
            />
            <MetricCard
              icon={ExternalLink}
              label="Liens externes"
              value={meta.external_links_count || 0}
              tooltip="Nombre de liens pointant vers d'autres sites web"
            />
            <MetricCard
              icon={ImageIcon}
              label="Images"
              value={meta.images_count || 0}
              tooltip="Nombre total d'images sur la page"
            />
            <MetricCard
              icon={Server}
              label="Taille de la page"
              value={result.size ? (result.size / 1024).toFixed(1) : '0'}
              unit="KB"
              tooltip="Taille totale de la page (HTML uniquement)"
              status={
                result.size && result.size < 100000 ? 'good' : result.size && result.size < 500000 ? 'warning' : 'bad'
              }
            />
          </div>
        </TabsContent>

        {/* Tab Vérifications */}
        <TabsContent value="checks" className="mt-6 space-y-6">
          {/* Résumé par catégorie */}
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(categorizedChecks).map(([category, items]) => {
              const passed = items.filter((i) => i.passed).length
              const total = items.length
              const percentage = total > 0 ? Math.round((passed / total) * 100) : 0
              return (
                <Card key={category}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{category}</span>
                      <Badge color={percentage >= 80 ? 'green' : percentage >= 50 ? 'amber' : 'red'}>
                        {passed}/{total}
                      </Badge>
                    </div>
                    <Progress value={percentage} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Liste des vérifications par catégorie */}
          {Object.entries(categorizedChecks).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  {category === 'content' && <FileText className="h-5 w-5" />}
                  {category === 'technique' && <Server className="h-5 w-5" />}
                  {category === 'sécurité' && <Shield className="h-5 w-5" />}
                  {category === 'performance' && <Zap className="h-5 w-5" />}
                  {category === 'indexation' && <Globe className="h-5 w-5" />}
                  {category === 'social' && <Share2 className="h-5 w-5" />}
                  {category}
                </CardTitle>
                <CardDescription>
                  {items.filter((i) => i.passed).length} sur {items.length} vérifications réussies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {items
                    .sort((a, b) => (a.passed === b.passed ? 0 : a.passed ? 1 : -1))
                    .map((item) => (
                      <SeoCheck
                        key={item.key}
                        label={item.label}
                        passed={item.passed}
                        category={item.category}
                        description={item.description}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab Performance */}
        <TabsContent value="performance" className="mt-6 space-y-6">
          {/* Core Web Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Core Web Vitals
              </CardTitle>
              <CardDescription>
                Métriques de performance utilisées par Google pour évaluer l&apos;expérience utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {pageTiming.largest_contentful_paint !== undefined && (
                  <CoreWebVital
                    label="LCP (Largest Contentful Paint)"
                    value={pageTiming.largest_contentful_paint}
                    unit="ms"
                    goodThreshold={2500}
                    badThreshold={4000}
                    description="Temps de chargement du plus grand élément visible. Un LCP rapide assure que le contenu principal s'affiche rapidement."
                  />
                )}
                {pageTiming.first_input_delay !== undefined && (
                  <CoreWebVital
                    label="FID (First Input Delay)"
                    value={pageTiming.first_input_delay}
                    unit="ms"
                    goodThreshold={100}
                    badThreshold={300}
                    description="Délai avant la première interaction possible. Un FID bas signifie que la page est rapidement interactive."
                  />
                )}
                {pageTiming.time_to_interactive !== undefined && (
                  <CoreWebVital
                    label="TTI (Time to Interactive)"
                    value={pageTiming.time_to_interactive}
                    unit="ms"
                    goodThreshold={3800}
                    badThreshold={7300}
                    description="Temps nécessaire pour que la page devienne entièrement interactive."
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Autres métriques de timing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Détails des temps de chargement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {pageTiming.connection_time !== undefined && (
                  <MetricCard
                    icon={Globe}
                    label="Temps de connexion"
                    value={pageTiming.connection_time}
                    unit="ms"
                    tooltip="Temps pour établir la connexion avec le serveur"
                    status={
                      pageTiming.connection_time < 100 ? 'good' : pageTiming.connection_time < 300 ? 'warning' : 'bad'
                    }
                  />
                )}
                {pageTiming.download_time !== undefined && (
                  <MetricCard
                    icon={Server}
                    label="Temps de téléchargement"
                    value={pageTiming.download_time}
                    unit="ms"
                    tooltip="Temps pour télécharger le contenu de la page"
                    status={
                      pageTiming.download_time < 500 ? 'good' : pageTiming.download_time < 1500 ? 'warning' : 'bad'
                    }
                  />
                )}
                {pageTiming.duration_time !== undefined && (
                  <MetricCard
                    icon={Clock}
                    label="Durée totale"
                    value={pageTiming.duration_time}
                    unit="ms"
                    tooltip="Temps total de chargement de la page"
                    status={
                      pageTiming.duration_time < 1000 ? 'good' : pageTiming.duration_time < 3000 ? 'warning' : 'bad'
                    }
                  />
                )}
                {pageTiming.dom_complete !== undefined && (
                  <MetricCard
                    icon={FileText}
                    label="DOM Complete"
                    value={pageTiming.dom_complete}
                    unit="ms"
                    tooltip="Temps pour que le DOM soit entièrement chargé"
                    status={
                      pageTiming.dom_complete < 2000 ? 'good' : pageTiming.dom_complete < 5000 ? 'warning' : 'bad'
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informations serveur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Informations techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <MetricCard
                  icon={Globe}
                  label="Code HTTP"
                  value={result.status_code || 'N/A'}
                  tooltip="Code de statut HTTP retourné par le serveur"
                  status={
                    result.status_code === 200
                      ? 'good'
                      : result.status_code && result.status_code < 400
                        ? 'warning'
                        : 'bad'
                  }
                />
                {result.server && (
                  <MetricCard
                    icon={Server}
                    label="Serveur"
                    value={result.server}
                    tooltip="Type de serveur web utilisé"
                  />
                )}
                {result.media_type && (
                  <MetricCard
                    icon={FileText}
                    label="Type de contenu"
                    value={result.media_type.split(';')[0]}
                    tooltip="Type MIME du document"
                  />
                )}
                {result.size !== undefined && (
                  <MetricCard
                    icon={Server}
                    label="Taille HTML"
                    value={(result.size / 1024).toFixed(1)}
                    unit="KB"
                    tooltip="Taille du document HTML"
                    status={result.size < 100000 ? 'good' : result.size < 500000 ? 'warning' : 'bad'}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Contenu */}
        <TabsContent value="content" className="mt-6 space-y-6">
          {result.content && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Analyse du contenu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {result.content.plain_text_word_count !== undefined && (
                    <MetricCard
                      icon={FileText}
                      label="Nombre de mots"
                      value={result.content.plain_text_word_count.toLocaleString()}
                      tooltip="Nombre total de mots dans le contenu de la page"
                      status={
                        result.content.plain_text_word_count >= 300
                          ? 'good'
                          : result.content.plain_text_word_count >= 100
                            ? 'warning'
                            : 'bad'
                      }
                    />
                  )}
                  {result.content.plain_text_size !== undefined && (
                    <MetricCard
                      icon={Server}
                      label="Taille du texte"
                      value={(result.content.plain_text_size / 1024).toFixed(2)}
                      unit="KB"
                      tooltip="Taille du contenu textuel de la page"
                    />
                  )}
                  {result.content.flesch_kincaid_readability_index !== undefined && (
                    <MetricCard
                      icon={BookOpen}
                      label="Lisibilité (Flesch-Kincaid)"
                      value={result.content.flesch_kincaid_readability_index.toFixed(1)}
                      tooltip="Score de lisibilité: plus élevé = plus facile à lire. 60-70 est idéal pour le web."
                      status={
                        result.content.flesch_kincaid_readability_index >= 60
                          ? 'good'
                          : result.content.flesch_kincaid_readability_index >= 30
                            ? 'warning'
                            : 'bad'
                      }
                    />
                  )}
                  {result.content.automated_readability_index !== undefined && (
                    <MetricCard
                      icon={BookOpen}
                      label="Niveau de lecture"
                      value={result.content.automated_readability_index.toFixed(1)}
                      tooltip="Indice de lisibilité automatisé: représente le niveau scolaire requis pour comprendre le texte"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommandations de contenu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(!meta.title || (meta.title_length && meta.title_length < 30)) && (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <div>
                      <p className="font-medium">Optimisez votre titre</p>
                      <p className="text-muted-foreground text-sm">
                        Votre titre est trop court ou manquant. Visez 50-60 caractères avec vos mots-clés principaux.
                      </p>
                    </div>
                  </div>
                )}
                {(!meta.description || (meta.description_length && meta.description_length < 70)) && (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <div>
                      <p className="font-medium">Améliorez votre meta description</p>
                      <p className="text-muted-foreground text-sm">
                        Votre description est trop courte ou manquante. Visez 150-160 caractères avec un appel à
                        l&apos;action.
                      </p>
                    </div>
                  </div>
                )}
                {result.content?.plain_text_word_count !== undefined && result.content.plain_text_word_count < 300 && (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <div>
                      <p className="font-medium">Ajoutez plus de contenu</p>
                      <p className="text-muted-foreground text-sm">
                        Votre page contient moins de 300 mots. Les pages avec plus de contenu ont tendance à mieux se
                        positionner.
                      </p>
                    </div>
                  </div>
                )}
                {score >= 80 && (
                  <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <div>
                      <p className="font-medium">Excellent travail !</p>
                      <p className="text-muted-foreground text-sm">
                        Votre page a un bon score SEO. Continuez à optimiser le contenu et les performances.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Social */}
        <TabsContent value="social" className="mt-6 space-y-6">
          {meta.social_media_tags && Object.keys(meta.social_media_tags).length > 0 ? (
            <>
              {/* Open Graph */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Tags Open Graph (Facebook, LinkedIn)
                  </CardTitle>
                  <CardDescription>
                    Ces métadonnées contrôlent l&apos;aperçu de votre page sur les réseaux sociaux
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(meta.social_media_tags)
                      .filter(([key]) => key.startsWith('og:'))
                      .map(([key, value]) => (
                        <div key={key} className="rounded-lg border p-3">
                          <div className="flex items-center gap-2">
                            <Badge color="blue">{key}</Badge>
                          </div>
                          <p className="text-muted-foreground mt-2 text-sm break-all">{value}</p>
                        </div>
                      ))}
                    {!Object.keys(meta.social_media_tags).some((k) => k.startsWith('og:')) && (
                      <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <p className="text-sm">
                          Aucun tag Open Graph détecté. Ajoutez-les pour améliorer le partage sur Facebook et LinkedIn.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Twitter Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Twitter Cards
                  </CardTitle>
                  <CardDescription>
                    Ces métadonnées contrôlent l&apos;aperçu de votre page sur Twitter/X
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(meta.social_media_tags)
                      .filter(([key]) => key.startsWith('twitter:'))
                      .map(([key, value]) => (
                        <div key={key} className="rounded-lg border p-3">
                          <div className="flex items-center gap-2">
                            <Badge color="cyan">{key}</Badge>
                          </div>
                          <p className="text-muted-foreground mt-2 text-sm break-all">{value}</p>
                        </div>
                      ))}
                    {!Object.keys(meta.social_media_tags).some((k) => k.startsWith('twitter:')) && (
                      <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <p className="text-sm">
                          Aucun tag Twitter Card détecté. Ajoutez-les pour améliorer le partage sur Twitter/X.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-amber-500/10 p-4">
                    <Share2 className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Aucun tag social détecté</h3>
                  <p className="text-muted-foreground mt-2 max-w-md text-sm">
                    Cette page ne contient pas de tags Open Graph ou Twitter Cards. Ajoutez ces métadonnées pour
                    améliorer l&apos;apparence de vos liens partagés sur les réseaux sociaux.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

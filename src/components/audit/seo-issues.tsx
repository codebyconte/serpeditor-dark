// 📁 components/audit/seo-issues.tsx
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle, Info, XCircle } from 'lucide-react'

export function SEOIssues({ data }: { any }) {
  const checks = data?.page_metrics?.checks || {}

  const issues = [
    {
      name: 'Pages sans titre',
      count: checks.no_title,
      severity: 'critical',
      description: 'Pages sans balise <title>',
    },
    {
      name: 'Pages sans description',
      count: checks.no_description,
      severity: 'critical',
      description: 'Pages sans meta description',
    },
    {
      name: 'Pages sans H1',
      count: checks.no_h1_tag,
      severity: 'warning',
      description: 'Pages sans balise H1',
    },
    {
      name: 'Titres trop longs',
      count: checks.title_too_long,
      severity: 'warning',
      description: 'Titres dépassant 65 caractères',
    },
    {
      name: 'Titres trop courts',
      count: checks.title_too_short,
      severity: 'warning',
      description: 'Titres de moins de 30 caractères',
    },
    {
      name: 'Titres non pertinents',
      count: checks.irrelevant_title,
      severity: 'warning',
      description: 'Titres non cohérents avec le contenu',
    },
    {
      name: 'Descriptions non pertinentes',
      count: checks.irrelevant_description,
      severity: 'warning',
      description: 'Descriptions non cohérentes avec le contenu',
    },
    {
      name: 'Images sans ALT',
      count: checks.no_image_alt,
      severity: 'warning',
      description: 'Images sans attribut alt',
    },
    {
      name: 'Contenu faible',
      count: checks.low_content_rate,
      severity: 'info',
      description: 'Pages avec peu de contenu textuel',
    },
    {
      name: "Fautes d'orthographe",
      count: checks.has_misspelling,
      severity: 'info',
      description: "Pages avec des erreurs d'orthographe",
    },
  ].filter((issue) => issue.count > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Problèmes SEO détectés</CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problème</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Pages affectées</TableHead>
                <TableHead className="text-center">Sévérité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.name}>
                  <TableCell className="font-medium">{issue.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {issue.description}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {issue.count}
                  </TableCell>
                  <TableCell className="text-center">
                    {issue.severity === 'critical' ? (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Critique
                      </Badge>
                    ) : issue.severity === 'warning' ? (
                      <Badge variant="secondary" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Avertissement
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Info className="h-3 w-3" />
                        Info
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            Aucun problème SEO détecté 🎉
          </p>
        )}
      </CardContent>
    </Card>
  )
}

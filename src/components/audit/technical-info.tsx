// 📁 components/audit/technical-info.tsx
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { AuditData } from './types'

export function TechnicalInfo({ data }: { data: AuditData | null }) {
  const domainInfo = data?.domain_info

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Informations serveur */}
      <Card>
        <CardHeader>
          <CardTitle>Serveur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">CMS</span>
            <Badge color="zinc">{domainInfo?.cms || 'Non détecté'}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Serveur</span>
            <Badge color="zinc">
              {domainInfo?.server || 'Non détecté'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Adresse IP</span>
            <span className="font-mono text-sm">{domainInfo?.ip}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">HTTP/2</span>
            {domainInfo?.checks?.http2 ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informations SSL */}
      <Card>
        <CardHeader>
          <CardTitle>Certificat SSL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Statut</span>
            {domainInfo?.ssl_info?.valid_certificate ? (
              <Badge className="bg-green-600">Valide</Badge>
            ) : (
              <Badge color="red">Invalide</Badge>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Émetteur</span>
            <span className="text-sm">
              {domainInfo?.ssl_info?.certificate_issuer || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Expiration</span>
            <span className="text-sm">
              {domainInfo?.ssl_info?.certificate_expiration_date
                ? format(
                    new Date(domainInfo.ssl_info.certificate_expiration_date),
                    'dd MMMM yyyy',
                    { locale: fr },
                  )
                : 'N/A'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Fichiers importants */}
      <Card>
        <CardHeader>
          <CardTitle>Fichiers importants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">robots.txt</span>
            {domainInfo?.checks?.robots_txt ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sitemap</span>
            {domainInfo?.checks?.sitemap ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Redirections */}
      <Card>
        <CardHeader>
          <CardTitle>Redirections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">WWW redirect</span>
            {domainInfo?.checks?.test_www_redirect ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              HTTPS redirect
            </span>
            {domainInfo?.checks?.test_https_redirect ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Page 404</span>
            {domainInfo?.checks?.test_page_not_found ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

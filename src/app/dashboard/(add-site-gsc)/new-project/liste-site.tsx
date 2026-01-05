'use client'

import { Button } from '@/components/dashboard/button'
import {
 Card,
 CardContent,
 CardDescription,
 CardFooter,
 CardHeader,
 CardTitle,
} from '@/components/ui/card'
import {
 Empty,
 EmptyContent,
 EmptyDescription,
 EmptyHeader,
 EmptyMedia,
 EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { ExternalLink, Globe, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { addSiteToProject } from './action'

type Site = {
 siteUrl: string
 permissionLevel: string
}

export function ListSite() {
 const router = useRouter()
 const { data: session } = authClient.useSession()
 const [sites, setSites] = useState<Site[]>([])
 const [isPending, startTransition] = useTransition()

 useEffect(() => {
 startTransition(() => {
 const fetchSites = async () => {
 try {
 const accessToken = await authClient.getAccessToken({
 providerId: 'google',
 userId: session?.user?.id,
 })

 const response = await fetch(
 'https://www.googleapis.com/webmasters/v3/sites',
 {
 headers: {
 Authorization: `Bearer ${accessToken.data?.accessToken}`,
 Accept: 'application/json',
 },
 },
 )

 if (!response.ok) {
 throw new Error(`Erreur HTTP: ${response.status}`)
 }

 const data = await response.json()
 setSites(data.siteEntry || [])
 } catch (error) {
 console.error('Erreur lors de la récupération des sites:', error)
 }
 }

 fetchSites()
 })
 }, [session?.user?.id])

 const handleAddSite = async (siteUrl: string) => {
 const { success, message } = await addSiteToProject({ siteUrl })
 if (success) {
 toast.success(message)
 router.push('/dashboard')
 } else {
 toast.error(message)
 }
 }

 if (isPending) {
 return (
 <div className="flex min-h-[400px] items-center justify-center">
 <div className="text-center">
 <Spinner className="mx-auto h-8 w-8 text-primary" />
 <p className="mt-4 text-sm font-medium text-muted-foreground">
 Récupération de vos sites Google Search Console...
 </p>
 <p className="mt-2 text-xs text-muted-foreground">
 Cela peut prendre quelques secondes
 </p>
 </div>
 </div>
 )
 }

 return (
 <Suspense
 fallback={
 <div className="flex min-h-[400px] items-center justify-center">
 <div className="text-center">
 <Spinner className="mx-auto h-8 w-8 text-primary" />
 <p className="mt-4 text-sm font-medium text-muted-foreground">
 Chargement...
 </p>
 </div>
 </div>
 }
 >
 {sites.length > 0 ? (
 <section className="space-y-6 pb-8">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-lg font-semibold">
 Sites disponibles ({sites.length})
 </h2>
 <p className="mt-1 text-sm text-muted-foreground">
 Sélectionnez un site pour l&apos;ajouter à vos projets
 </p>
 </div>
 </div>

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {sites.map((site) => (
 <Card
 key={site.siteUrl}
 className="group transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
 >
 <CardHeader>
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
 <Globe className="h-5 w-5 text-primary" />
 </div>
 <div className="flex-1 min-w-0">
 <CardTitle className="line-clamp-2 text-base">
 {site.siteUrl.replace(/^https?:\/\//, '')}
 </CardTitle>
 <CardDescription className="mt-1 line-clamp-1 text-xs">
 {site.siteUrl}
 </CardDescription>
 </div>
 </div>
 </div>
 </CardHeader>

 <CardContent className="space-y-3">
 {site.permissionLevel && (
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-muted-foreground">
 Niveau d&apos;accès:
 </span>
 <span className="text-xs capitalize text-muted-foreground">
 {site.permissionLevel}
 </span>
 </div>
 )}
 </CardContent>

 <CardFooter className="border-t bg-muted/30">
 <Button
 color="indigo"
 onClick={() => handleAddSite(site.siteUrl)}
 className="w-full"
 >
 <Plus className="mr-2 h-4 w-4" />
 Ajouter le site
 </Button>
 </CardFooter>
 </Card>
 ))}
 </div>
 </section>
 ) : (
 <section className="py-12">
 <Empty>
 <EmptyHeader>
 <EmptyMedia variant="icon">
 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
 <Globe className="h-8 w-8 text-primary" />
 </div>
 </EmptyMedia>
 <EmptyTitle className="text-xl">Aucun site trouvé</EmptyTitle>
 <EmptyDescription className="max-w-md">
 Aucun site n&apos;a été trouvé dans votre compte Google Search
 Console. Ajoutez d&apos;abord vos sites dans Google Search
 Console pour pouvoir les importer ici.
 </EmptyDescription>
 </EmptyHeader>
 <EmptyContent>
 <Button
 color="indigo"
 href="https://search.google.com/search-console"
 target="_blank"
 rel="noopener noreferrer nofollow"
 >
 <ExternalLink className="mr-2 h-4 w-4" />
 Ouvrir Google Search Console
 </Button>
 </EmptyContent>
 </Empty>
 </section>
 )}
 </Suspense>
 )
}

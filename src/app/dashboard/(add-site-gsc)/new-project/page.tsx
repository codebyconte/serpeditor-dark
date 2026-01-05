import { Divider } from '@/components/dashboard/divider'
import { Heading } from '@/components/dashboard/heading'
import { Globe, Search } from 'lucide-react'
import { ListSite } from './liste-site'

export default async function Page() {
 return (
 <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
 <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
 {/* Header */}
 <div className="mb-6">
 <div className="mb-2 flex items-center gap-3">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-lg">
 <Search className="h-6 w-6 text-primary" />
 </div>
 <div>
 <Heading className="text-2xl sm:text-3xl">
 Import depuis Google Search Console
 </Heading>
 <p className="mt-1 text-sm text-muted-foreground">
 Choisissez le site que vous souhaitez connecter depuis votre
 compte Google Search Console
 </p>
 </div>
 </div>
 </div>

 {/* Bannière informative */}
 <div className="mb-6 rounded-lg border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-5">
 <div className="flex items-start gap-4">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
 <Globe className="h-5 w-5 text-primary" />
 </div>
 <div className="flex-1">
 <h3 className="mb-1 font-semibold">
 Sites disponibles dans votre compte
 </h3>
 <p className="text-sm text-muted-foreground">
 Sélectionnez un site pour l&apos;ajouter à vos projets et
 commencer à analyser ses performances SEO.
 </p>
 </div>
 </div>
 </div>

 <Divider className="my-6" />

 {/* Liste des sites */}
 <div>
 <ListSite />
 </div>
 </div>
 </main>
 )
}

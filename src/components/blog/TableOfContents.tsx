'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useActiveSection, type Heading } from '@/hooks'
import { cn } from '@/lib/utils'
import { ListIcon } from 'lucide-react'

interface TableOfContentsProps {
  headings: Heading[]
  variant?: 'desktop' | 'mobile'
}

function TOCList({ headings, activeId }: { headings: Heading[]; activeId: string }) {
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav aria-label="Table des matières">
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={cn(
                'text-left w-full text-sm transition-colors hover:text-primary',
                heading.level === 3 && 'pl-4',
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function TableOfContents({ headings, variant = 'desktop' }: TableOfContentsProps) {
  const activeId = useActiveSection(headings)

  if (headings.length === 0) return null

  if (variant === 'mobile') {
    return (
      <div className="lg:hidden mb-8">
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ListIcon className="h-4 w-4" />
              Table des matières
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Table des matières</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <TOCList headings={headings} activeId={activeId} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <div className="hidden lg:block">
      <div className="sticky top-24">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Table des matières</h3>
        <TOCList headings={headings} activeId={activeId} />
      </div>
    </div>
  )
}

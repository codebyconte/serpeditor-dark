import { GitHubIcon } from '@/components/icons/social/github-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { Card, CardContent } from '@/components/ui/card'
import { LinkedinIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface AuthorCardProps {
  author: {
    name: string
    role?: string
    bio?: string
    image?: string | null
    slug?: string
    social?: {
      linkedin?: string
      twitter?: string
      github?: string
    }
  }
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Card className="overflow-hidden border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-6 p-6">
          {/* Author Image */}
          {author.image && (
            <div className="shrink-0">
              <Image
                src={author.image}
                alt={author.name}
                width={120}
                height={120}
                className="rounded-2xl object-cover shadow-lg mx-auto sm:mx-0"
              />
            </div>
          )}

          {/* Author Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
              À propos de l'auteur
            </div>

            {author.slug ? (
              <Link
                href={`/author/${author.slug}`}
                className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
              >
                {author.name}
              </Link>
            ) : (
              <h3 className="text-xl font-semibold text-foreground">{author.name}</h3>
            )}

            {author.role && (
              <p className="mt-1 text-sm text-muted-foreground">{author.role}</p>
            )}

            {author.bio && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{author.bio}</p>
            )}

            {/* Social Links */}
            {author.social && (
              <div className="mt-4 flex gap-3 justify-center sm:justify-start">
                {author.social.linkedin && (
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-mist-100 text-mist-600 transition-colors hover:bg-[#0A66C2] hover:text-white dark:bg-mist-800 dark:text-mist-300"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                )}
                {author.social.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-mist-100 text-mist-600 transition-colors hover:bg-black hover:text-white dark:bg-mist-800 dark:text-mist-300"
                    aria-label="Twitter / X"
                  >
                    <XIcon className="h-4 w-4" />
                  </a>
                )}
                {author.social.github && (
                  <a
                    href={author.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-mist-100 text-mist-600 transition-colors hover:bg-gray-900 hover:text-white dark:bg-mist-800 dark:text-mist-300"
                    aria-label="GitHub"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}

            {/* View all articles link */}
            {author.slug && (
              <Link
                href={`/author/${author.slug}`}
                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Voir tous les articles
                <span className="ml-1">→</span>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

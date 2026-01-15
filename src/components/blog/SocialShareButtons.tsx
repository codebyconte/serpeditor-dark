'use client'

import { useClipboard } from '@/hooks'
import { cn } from '@/lib/utils'
import { CheckIcon, FacebookIcon, LinkedinIcon, LinkIcon } from 'lucide-react'
import { XIcon } from '@/components/icons/social/x-icon'

interface SocialShareButtonsProps {
  url: string
  title: string
  variant?: 'horizontal' | 'vertical'
  className?: string
}

export function SocialShareButtons({
  url,
  title,
  variant = 'horizontal',
  className,
}: SocialShareButtonsProps) {
  const { copy, copied } = useClipboard({
    successMessage: 'Lien copié !',
  })

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: XIcon,
      color: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedinIcon,
      color: 'hover:bg-[#0A66C2] hover:text-white',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookIcon,
      color: 'hover:bg-[#1877F2] hover:text-white',
    },
  ]

  const buttonClass = cn(
    'flex items-center justify-center rounded-lg border border-border bg-background transition-colors',
    variant === 'horizontal' ? 'h-10 w-10' : 'h-10 w-10'
  )

  const iconClass = 'h-4 w-4'

  return (
    <div
      className={cn(
        'flex gap-2',
        variant === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
    >
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonClass, link.color)}
          aria-label={`Partager sur ${link.name}`}
          title={`Partager sur ${link.name}`}
        >
          <link.icon className={iconClass} />
        </a>
      ))}

      <button
        onClick={() => copy(url)}
        className={cn(
          buttonClass,
          copied
            ? 'bg-green-500 text-white border-green-500'
            : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
        )}
        aria-label={copied ? 'Lien copié' : 'Copier le lien'}
        title={copied ? 'Copié !' : 'Copier le lien'}
      >
        {copied ? <CheckIcon className={iconClass} /> : <LinkIcon className={iconClass} />}
      </button>
    </div>
  )
}

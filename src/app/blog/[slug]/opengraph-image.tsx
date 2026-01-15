import { ImageResponse } from 'next/og'
import { client } from '@/sanity/lib/client'
import { POST_WITH_SEO_QUERY } from '@/sanity/lib/seo-queries'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const runtime = 'edge'
export const alt = 'Article de blog SerpEditor'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

const { projectId, dataset } = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const post = await client.fetch(POST_WITH_SEO_QUERY, { slug })

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'system-ui',
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 20 }}>SerpEditor</div>
          <div>Article non trouvé</div>
        </div>
      ),
      {
        ...size,
      }
    )
  }

  const seoTitle = post.seo?.title || post.title
  const seoDescription = post.seo?.description || post.excerpt || ''
  const imageUrl = post.seo?.image || post.image
  const ogImageUrl = imageUrl ? urlFor(imageUrl)?.width(1200).height(630).url() : null

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: ogImageUrl
            ? `url(${ogImageUrl})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Overlay pour améliorer la lisibilité */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '80px',
            position: 'relative',
            zIndex: 1,
            height: '100%',
            justifyContent: 'flex-end',
          }}
        >
          {/* Catégorie */}
          {post.categories && post.categories.length > 0 && (
            <div
              style={{
                fontSize: 24,
                color: '#a78bfa',
                marginBottom: 20,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              {post.categories[0].title}
            </div>
          )}

          {/* Titre */}
          <div
            style={{
              fontSize: seoTitle.length > 60 ? 56 : 72,
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              marginBottom: 30,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {seoTitle}
          </div>

          {/* Description */}
          {seoDescription && (
            <div
              style={{
                fontSize: 28,
                color: '#e5e7eb',
                lineHeight: 1.4,
                marginBottom: 40,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {seoDescription.length > 120 ? `${seoDescription.substring(0, 120)}...` : seoDescription}
            </div>
          )}

          {/* Footer avec auteur et date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              fontSize: 20,
              color: '#d1d5db',
            }}
          >
            {post.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {post.author.image && (
                  <img
                    src={urlFor(post.author.image)?.width(60).height(60).url() || ''}
                    alt=""
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      border: '2px solid white',
                    }}
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            {post.publishedAt && (
              <div>
                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}
          </div>

          {/* Logo SerpEditor */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              right: 40,
              fontSize: 32,
              fontWeight: 'bold',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            SerpEditor
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

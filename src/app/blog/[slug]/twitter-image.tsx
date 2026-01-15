import { ImageResponse } from 'next/og'
import { client } from '@/sanity/lib/client'
import { POST_WITH_SEO_QUERY } from '@/sanity/lib/seo-queries'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const runtime = 'edge'
export const alt = 'Article de blog SerpEditor'
export const size = {
  width: 1200,
  height: 675, // Format Twitter Card
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
            background: 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)',
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
  const ogImageUrl = imageUrl ? urlFor(imageUrl)?.width(1200).height(675).url() : null

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: ogImageUrl
            ? `url(${ogImageUrl})`
            : 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)',
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
            padding: '60px',
            position: 'relative',
            zIndex: 1,
            height: '100%',
            justifyContent: 'flex-end',
          }}
        >
          {/* Titre */}
          <div
            style={{
              fontSize: seoTitle.length > 60 ? 52 : 64,
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              marginBottom: 24,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {seoTitle}
          </div>

          {/* Description */}
          {seoDescription && (
            <div
              style={{
                fontSize: 24,
                color: '#e5e7eb',
                lineHeight: 1.4,
                marginBottom: 30,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {seoDescription.length > 140 ? `${seoDescription.substring(0, 140)}...` : seoDescription}
            </div>
          )}

          {/* Footer avec auteur */}
          {post.author && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 18,
                color: '#d1d5db',
              }}
            >
              {post.author.image && (
                <img
                  src={urlFor(post.author.image)?.width(50).height(50).url() || ''}
                  alt=""
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    border: '2px solid white',
                  }}
                />
              )}
              <span>{post.author.name}</span>
              {post.author.role && <span>• {post.author.role}</span>}
            </div>
          )}

          {/* Logo SerpEditor */}
          <div
            style={{
              position: 'absolute',
              top: 30,
              right: 30,
              fontSize: 28,
              fontWeight: 'bold',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            @SerpEditor
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

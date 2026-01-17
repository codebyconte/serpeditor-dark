import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import ReactPlayer from 'react-player'

interface YouTubeValue {
  url: string
}

const components = {
  types: {
    youTube: ({ value }: { value: YouTubeValue }) => {
      const { url } = value
      return <ReactPlayer src={url} />
    },
  },
}

interface BodyProps {
  blocks: PortableTextBlock[] | null | undefined
}

export default function Body({ blocks }: BodyProps) {
  if (!blocks) return null
  return <PortableText value={blocks} components={components} />
}

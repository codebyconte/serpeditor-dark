import { PortableText } from '@portabletext/react'
import ReactPlayer from 'react-player'

const components = {
  types: {
    youTube: ({ value }) => {
      const { url } = value
      return <ReactPlayer src={url} />
    },
  },
}

export default function Body({ blocks }) {
  return <PortableText value={blocks} components={components} />
}

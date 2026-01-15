import { type SchemaTypeDefinition } from 'sanity'

// Document Types
import { postType } from './postType'
import { categoryType } from './categoryType'
import { authorType } from './authorType'

// Object Types
import { seoType } from './seoType'

// Block Types (Portable Text)
import { youTubeType } from './youTubeType'
import { customImageBlock } from './blocks/customImageBlock'
import { ctaBlock } from './blocks/ctaBlock'
import { infoBoxBlock } from './blocks/infoBoxBlock'
import { faqBlock } from './blocks/faqBlock'
import { relatedArticlesBlock } from './blocks/relatedArticlesBlock'
import { tableBlock } from './blocks/tableBlock'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    postType,
    categoryType,
    authorType,

    // Objects
    seoType,

    // Blocks
    youTubeType,
    customImageBlock,
    ctaBlock,
    infoBoxBlock,
    faqBlock,
    relatedArticlesBlock,
    tableBlock,
  ],
}

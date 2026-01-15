import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentsIcon } from '@sanity/icons'

/**
 * Block pour afficher des articles liés (Internal Linking SEO)
 */
export const relatedArticlesBlock = defineType({
  name: 'relatedArticles',
  title: 'Articles Liés',
  type: 'object',
  icon: DocumentsIcon,
  description: 'Maillage interne SEO: afficher des articles connexes dans le contenu pour améliorer la navigation et le référencement',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la Section',
      type: 'string',
      description: 'Ex: "Articles Connexes", "Pour Aller Plus Loin", "Vous Aimerez Aussi"',
      initialValue: 'Articles Connexes',
    }),

    defineField({
      name: 'articles',
      title: 'Articles à Afficher',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'post' }],
        }),
      ],
      description: 'Sélectionner 2 à 6 articles liés pour créer un maillage interne efficace',
      validation: (rule) => rule.min(2).max(6),
    }),

    defineField({
      name: 'displayStyle',
      title: 'Style d\'Affichage',
      type: 'string',
      options: {
        list: [
          { title: 'Cartes (Grid)', value: 'grid' },
          { title: 'Liste Simple', value: 'list' },
          { title: 'Carrousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      articles: 'articles',
    },
    prepare({ title, articles }) {
      const count = articles?.length || 0
      return {
        title: title || 'Articles Liés',
        subtitle: `${count} article${count !== 1 ? 's' : ''} lié${count !== 1 ? 's' : ''}`,
        media: DocumentsIcon,
      }
    },
  },
})

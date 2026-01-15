import { defineArrayMember, defineField, defineType } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'

/**
 * Block FAQ pour les rich snippets Google
 * Peut être utilisé dans le body des articles pour générer du Schema.org FAQPage
 */
export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ (Questions-Réponses)',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la Section FAQ',
      type: 'string',
      description: 'Ex: "Questions Fréquentes", "FAQ", "En Savoir Plus"',
      initialValue: 'Questions Fréquentes',
    }),

    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      description:
        '❓ Ajouter des questions-réponses. Google peut afficher ces données en rich snippet.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'Question',
          icon: HelpCircleIcon,
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              description: 'Question claire et concise',
              validation: (rule) => rule.required().min(10).max(200),
            }),

            defineField({
              name: 'answer',
              title: 'Réponse',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Réponse détaillée (peut inclure des listes, liens, etc.)',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'question',
            },
            prepare({ title }) {
              return {
                title: title || 'Question sans titre',
                subtitle: 'Question FAQ',
                media: HelpCircleIcon,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.min(2).max(20).warning('Minimum 2 questions recommandé'),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      questions: 'questions',
    },
    prepare({ title, questions }) {
      const count = questions?.length || 0
      return {
        title: title || 'Section FAQ',
        subtitle: `${count} question${count !== 1 ? 's' : ''}`,
        media: HelpCircleIcon,
      }
    },
  },
})

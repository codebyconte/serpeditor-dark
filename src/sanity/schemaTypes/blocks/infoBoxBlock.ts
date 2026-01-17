import { defineField, defineType } from 'sanity'
import { InfoOutlineIcon } from '@sanity/icons'

/**
 * Block Info Box pour mettre en avant des informations importantes
 */
export const infoBoxBlock = defineType({
  name: 'infoBox',
  title: 'Encadré Informatif',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Type d\'Encadré',
      type: 'string',
      description: 'Choisir le type d\'information',
      options: {
        list: [
          { title: 'Astuce / Conseil', value: 'tip' },
          { title: 'Information', value: 'info' },
          { title: 'Attention / Avertissement', value: 'warning' },
          { title: 'Danger / Erreur à Éviter', value: 'danger' },
          { title: 'Note / Remarque', value: 'note' },
        ],
        layout: 'radio',
      },
      initialValue: 'tip',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'title',
      title: 'Titre de l\'Encadré',
      type: 'string',
      description: 'Ex: "Conseil Pro", "À Savoir", "Attention"',
      validation: (rule) => rule.max(80),
    }),

    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Texte de l\'encadré (peut inclure du formatage)',
      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      type: 'type',
    },
    prepare({ title, type }: { title?: string; type?: string }) {
      const typeLabels: Record<string, string> = {
        tip: 'Astuce',
        info: 'Information',
        warning: 'Attention',
        danger: 'Danger',
        note: 'Note',
      }
      const typeLabel = (type && typeLabels[type]) || 'Information'

      return {
        title: title || `Encadré ${typeLabel}`,
        subtitle: typeLabel,
        media: InfoOutlineIcon,
      }
    },
  },
})

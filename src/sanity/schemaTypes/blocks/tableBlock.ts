import { defineField, defineType } from 'sanity'
import { BlockContentIcon } from '@sanity/icons'

/**
 * Block Tableau pour les comparaisons, données structurées
 * Alternative simple au plugin @sanity/table
 */
export const tableBlock = defineType({
  name: 'tableBlock',
  title: 'Tableau',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'caption',
      title: 'Titre / Légende du Tableau',
      type: 'string',
      description: 'Ex: "Comparaison des Outils SEO", "Tarifs 2024"',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'headers',
      title: 'En-têtes des Colonnes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Titres des colonnes (ex: "Fonctionnalité", "Prix", "Note")',
      validation: (rule) => rule.required().min(2).max(10),
    }),

    defineField({
      name: 'rows',
      title: 'Lignes du Tableau',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          title: 'Ligne',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cellules',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Contenu de chaque cellule',
            }),
          ],
          preview: {
            select: {
              cells: 'cells',
            },
            prepare({ cells }) {
              return {
                title: cells?.[0] || 'Ligne vide',
                subtitle: cells?.slice(1).join(' | ') || '',
              }
            },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),

    defineField({
      name: 'showStripes',
      title: 'Lignes Alternées',
      type: 'boolean',
      description: 'Alterner les couleurs de fond pour faciliter la lecture',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'caption',
      rows: 'rows',
    },
    prepare({ title, rows }) {
      const rowCount = rows?.length || 0
      return {
        title: title || 'Tableau',
        subtitle: `${rowCount} ligne${rowCount !== 1 ? 's' : ''}`,
        media: BlockContentIcon,
      }
    },
  },
})

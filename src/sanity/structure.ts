import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) => {
  const defaultItems = S.documentTypeListItems()

  // Structure optimisée pour les performances
  // Utilise defaultOrdering pour éviter de charger tous les documents à la fois
  const itemsWithCustomStructure = defaultItems
    .map((item) => {
      const documentType = item.getId()
      if (!documentType) return null

      return S.listItem()
        .title(item.getTitle() || documentType)
        .id(documentType)
        .child(
          S.documentTypeList(documentType)
            .title(`Tous les ${item.getTitle() || documentType}s`)
            // Tri par défaut pour améliorer les performances de chargement
            .defaultOrdering([
              documentType === 'post'
                ? { field: 'publishedAt', direction: 'desc' }
                : { field: '_updatedAt', direction: 'desc' },
            ])
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType(documentType)
                .views([S.view.form()]),
            ),
        )
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  return S.list().title('Content').items(itemsWithCustomStructure)
}

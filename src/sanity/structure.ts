import type { StructureResolver } from 'sanity/structure'

// Structure simplifiée : une seule page, pas d'onglets
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      // Articles de blog
      S.listItem()
        .title('Articles de Blog')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('Articles')
            .filter('_type == "post"')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),

      // Catégories
      S.listItem()
        .title('Catégories')
        .schemaType('category')
        .child(
          S.documentTypeList('category')
            .title('Catégories')
            .filter('_type == "category"')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      // Auteurs
      S.listItem()
        .title('Auteurs')
        .schemaType('author')
        .child(
          S.documentTypeList('author')
            .title('Auteurs')
            .filter('_type == "author"')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
    ])

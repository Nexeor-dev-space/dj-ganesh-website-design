import type { CollectionConfig, GlobalConfig } from 'payload'

/**
 * Adds the Admin Guide's Help button to a CMS screen, linked to the guide
 * section with the same id as the screen's slug (see content.ts).
 *
 * Collections: above the list, and beside the save buttons when editing.
 * Globals (pages and settings): beside the Save button.
 */
const help = (section: string) => ({ path: '/src/admin/guide/HelpLink#default', clientProps: { section } })

export function withGuideLink(collection: CollectionConfig): CollectionConfig {
  const components = collection.admin?.components ?? {}
  return {
    ...collection,
    admin: {
      ...collection.admin,
      components: {
        ...components,
        beforeListTable: [...(components.beforeListTable ?? []), help(collection.slug)],
        edit: {
          ...components.edit,
          beforeDocumentControls: [...(components.edit?.beforeDocumentControls ?? []), help(collection.slug)],
        },
      },
    },
  }
}

export function withGlobalGuideLink(global: GlobalConfig): GlobalConfig {
  const components = global.admin?.components ?? {}
  return {
    ...global,
    admin: {
      ...global.admin,
      components: {
        ...components,
        elements: {
          ...components.elements,
          beforeDocumentControls: [...(components.elements?.beforeDocumentControls ?? []), help(global.slug)],
        },
      },
    },
  }
}

import type { Field } from 'payload'

/**
 * A page's search-and-sharing settings: the title and description Google
 * and link previews show, and the preview image. Every field is optional;
 * empty keeps the page's built-in values.
 */
export function seoGroup(page: string): Field {
  return {
    type: 'group',
    name: 'seo',
    label: 'SEO & Link Previews',
    admin: {
      description: `How ${page} appears in Google and when shared on WhatsApp, Facebook, LinkedIn or X. Empty fields keep the built-in values.`,
    },
    fields: [
      {
        name: 'title',
        label: 'Page Title',
        type: 'text',
        maxLength: 70,
        admin: { description: 'Shown as the Google result title and the browser tab. Up to about 60 characters.' },
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        maxLength: 200,
        admin: { description: 'The line under the title in Google and in link previews. About 150 characters.' },
      },
      {
        name: 'image',
        label: 'Share Image',
        type: 'upload',
        relationTo: 'media',
        admin: { description: 'The picture in link previews. Best at 1200 × 630.' },
      },
    ],
  }
}

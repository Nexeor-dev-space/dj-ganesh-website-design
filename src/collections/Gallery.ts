import type { CollectionConfig } from 'payload'
import { imageOnly } from './Media.ts'

const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Gallery Album', plural: 'Gallery' },
  admin: {
    // The album whose Album / Category is "Journey" is the About page's photo
    // section. Others are not shown on the website (the homepage gallery is
    // edited in Home Page → Gallery Strip).
    group: 'Collections',
    useAsTitle: 'title',
    defaultColumns: ['title', 'album', 'publishedStatus', 'order'],
    description:
      'The album with Album / Category "Journey" is the photo section under the bio on the About page (published albums only). Empty: the built-in photos.',
  },
  access: { read: () => true },
  versions: { drafts: { autosave: false } },
  fields: [
    {
      name: 'title',
      label: 'Gallery Title',
      type: 'text',
      required: true,
      admin: { description: 'For the "Journey" album, the heading of the About page photo section.' },
    },
    {
      name: 'album',
      label: 'Album / Category',
      type: 'text',
      required: true,
      admin: { description: 'Type "Journey" for the About page photo section. Any other value is not shown on the website.' },
    },
    {
      name: 'images',
      label: 'Images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', label: 'Image', type: 'upload', relationTo: 'media', filterOptions: imageOnly, required: true },
        {
          name: 'caption',
          label: 'Caption',
          type: 'text',
          admin: { description: 'The line under the photo, e.g. "Club 77 · London". The alt text comes from the photo in Media.' },
        },
      ],
    },
    { name: 'order', label: 'Display Order', type: 'number' },
    { name: 'publishedStatus', label: 'Published', type: 'checkbox', defaultValue: false },
  ],
}

export default Gallery

import type { CollectionConfig } from 'payload'

const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Gallery Album', plural: 'Gallery' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'album', 'publishedStatus', 'order'],
    description: 'Gallery albums with multiple images per album.',
  },
  access: { read: () => true },
  versions: { drafts: { autosave: false } },
  fields: [
    { name: 'title', label: 'Gallery Title', type: 'text', required: true },
    { name: 'album', label: 'Album / Category', type: 'text', required: true },
    {
      name: 'images',
      label: 'Images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' as any, required: true },
        { name: 'caption', label: 'Caption', type: 'text' },
      ],
    },
    { name: 'order', label: 'Display Order', type: 'number' },
    { name: 'publishedStatus', label: 'Published', type: 'checkbox', defaultValue: false },
  ],
}

export default Gallery

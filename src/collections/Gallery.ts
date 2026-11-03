import type { CollectionConfig } from 'payload'

const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Gallery Album', plural: 'Gallery' },
  admin: {
    // Not shown on the website (the homepage gallery is edited in Home Page →
    // Gallery Strip); hidden from the menu, saved entries kept.
    hidden: true,
    group: 'Collections',
    useAsTitle: 'title',
    defaultColumns: ['title', 'album', 'publishedStatus', 'order'],
    description: 'Gallery albums with multiple images per album.',
  },
  access: { read: () => true },
  versions: { drafts: { autosave: false } },
  fields: [
    { name: 'title', label: 'Gallery Title', type: 'text', required: true },
    {
      name: 'album',
      label: 'Album / Category',
      type: 'text',
      required: true,
      admin: { description: 'Organises photos here in the admin only; not shown on the website.' },
    },
    {
      name: 'images',
      label: 'Images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', label: 'Image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', label: 'Caption', type: 'text', admin: { hidden: true } },
      ],
    },
    { name: 'order', label: 'Display Order', type: 'number' },
    { name: 'publishedStatus', label: 'Published', type: 'checkbox', defaultValue: false },
  ],
}

export default Gallery

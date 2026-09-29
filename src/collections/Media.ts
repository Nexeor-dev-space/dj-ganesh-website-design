import type { CollectionConfig } from 'payload'

const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'caption', 'updatedAt'],
    description: 'Media library for all website assets.',
  },
  access: { read: () => true },
  upload: {
    staticDir: 'public/media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  fields: [
    { name: 'alt', label: 'Alt Text', type: 'text', required: true },
    { name: 'caption', label: 'Caption', type: 'text' },
  ],
}

export default Media

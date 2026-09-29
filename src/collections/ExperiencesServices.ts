import type { CollectionConfig } from 'payload'

const ExperiencesServices: CollectionConfig = {
  slug: 'experiences-services',
  labels: { singular: 'Experience / Service', plural: 'Experiences / Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedStatus', 'order'],
    description: 'DJ Ganesh experience and service offerings (e.g. Royal Weddings, Club Residencies).',
  },
  access: { read: () => true },
  versions: { drafts: { autosave: false } },
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'shortDescription', label: 'Short Description', type: 'text', required: true },
    { name: 'detailedDescription', label: 'Detailed Description', type: 'textarea' },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' as any },
    {
      name: 'features',
      label: 'Features / Highlights',
      type: 'array',
      fields: [
        { name: 'feature', label: 'Feature', type: 'text', required: true },
      ],
    },
    { name: 'ctaText', label: 'CTA Button Text', type: 'text', admin: { placeholder: 'e.g. Book Now' } },
    {
      name: 'ctaUrl',
      label: 'CTA URL',
      type: 'text',
      admin: { placeholder: 'https://...' },
      validate: (value: string | null | undefined) => {
        if (value && !/^https?:\/\/.+/.test(value)) return 'Must be a valid URL'
        return true
      },
    },
    { name: 'order', label: 'Display Order', type: 'number' },
    { name: 'publishedStatus', label: 'Published', type: 'checkbox', defaultValue: false },
  ],
}

export default ExperiencesServices

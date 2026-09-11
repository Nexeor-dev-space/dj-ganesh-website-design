import type { CollectionConfig } from 'payload'

const LegacyMilestones: CollectionConfig = {
  slug: 'legacy-milestones',
  labels: { singular: 'Milestone', plural: 'Legacy / Milestones' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['year', 'title', 'publishedStatus', 'order'],
    description: 'Key milestones in DJ Ganesh career legacy.',
  },
  access: { read: () => true },
  versions: { drafts: { autosave: false } },
  fields: [
    {
      name: 'year',
      label: 'Year',
      type: 'number',
      required: true,
      admin: { placeholder: 'e.g. 2018' },
    },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' as any },
    { name: 'order', label: 'Display Order', type: 'number' },
    { name: 'publishedStatus', label: 'Published', type: 'checkbox', defaultValue: false },
  ],
}

export default LegacyMilestones

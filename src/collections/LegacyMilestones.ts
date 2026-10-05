import type { CollectionConfig } from 'payload'

const LegacyMilestones: CollectionConfig = {
  slug: 'legacy-milestones',
  labels: { singular: 'Milestone', plural: 'Legacy / Milestones' },
  admin: {
    group: 'Collections',
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
    {
      name: 'slug',
      label: 'Slug / Key',
      type: 'text',
      unique: true,
      admin: {
        description: 'Stable ID used to feature this milestone on the Home and About pages (e.g. origin, taj, world-tour). Do not change it once set.',
      },
    },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'more', label: 'More / Detail Text', type: 'textarea', admin: { description: 'Expanded detail shown when the milestone is opened.' } },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' as any },
    { name: 'order', label: 'Display Order', type: 'number', admin: { description: 'Lower numbers appear first.' } },
    { name: 'publishedStatus', label: 'Published', type: 'checkbox', defaultValue: false, admin: { description: 'Untick to hide from the live site without deleting.' } },
  ],
}

export default LegacyMilestones

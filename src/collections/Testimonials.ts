import type { CollectionConfig } from 'payload'

const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: {
    group: 'Collections',
    useAsTitle: 'name',
    defaultColumns: ['name', 'eventType', 'location', 'publishedStatus', 'order'],
    description: 'Client and attendee testimonials for DJ Ganesh.',
  },
  access: { read: () => true },
  versions: { drafts: { autosave: false } },
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'testimonial', label: 'Testimonial', type: 'textarea', required: true },
    { name: 'eventType', label: 'Event / Type', type: 'text', admin: { placeholder: 'e.g. Royal Wedding, Club Night' } },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' as any },
    { name: 'order', label: 'Display Order', type: 'number' },
    { name: 'publishedStatus', label: 'Published', type: 'checkbox', defaultValue: false },
  ],
}

export default Testimonials

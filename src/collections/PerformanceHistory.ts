import type { CollectionConfig } from 'payload'

const PerformanceHistory: CollectionConfig = {
  slug: 'performance-history',
  labels: { singular: 'Performance', plural: 'Performance History' },
  admin: {
    useAsTitle: 'venue',
    defaultColumns: ['venue', 'city', 'country', 'year', 'category', 'order'],
    description: 'Track past DJ Ganesh performances worldwide.',
  },
  access: { read: () => true },
  fields: [
    { name: 'venue', label: 'Venue Name', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'city', label: 'City', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'country', label: 'Country', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'year', label: 'Year', type: 'number', required: true, admin: { width: '33%', placeholder: 'e.g. 2024' } },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' as any },
    {
      name: 'category',
      label: 'Category / Geography',
      type: 'select',
      options: [
        { label: 'India', value: 'india' },
        { label: 'Middle East', value: 'middle-east' },
        { label: 'Europe', value: 'europe' },
        { label: 'North America', value: 'north-america' },
        { label: 'Southeast Asia', value: 'southeast-asia' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'order', label: 'Display Order', type: 'number' },
  ],
}

export default PerformanceHistory

import type { CollectionConfig } from 'payload'

const UpcomingShows: CollectionConfig = {
  slug: 'upcoming-shows',
  labels: { singular: 'Upcoming Show', plural: 'Upcoming Shows' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'city', 'country', 'showStatus', 'order'],
    description: 'Manage upcoming DJ Ganesh show listings.',
  },
  access: { read: () => true },
  versions: { drafts: { autosave: false } },
  fields: [
    { name: 'title', label: 'Show Title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'date', label: 'Date', type: 'date', required: true, admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
        { name: 'time', label: 'Time', type: 'text', admin: { width: '50%', placeholder: 'e.g. 9:00 PM IST' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'city', label: 'City', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'country', label: 'Country', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'venue', label: 'Venue', type: 'text' },
    {
      name: 'poster',
      label: 'Event Poster / Image',
      type: 'upload',
      relationTo: 'media' as any,
    },
    {
      name: 'ticketUrl',
      label: 'Ticket URL',
      type: 'text',
      admin: { placeholder: 'https://...' },
      validate: (value: string | null | undefined) => {
        if (value && !/^https?:\/\/.+/.test(value)) return 'Must be a valid URL starting with http:// or https://'
        return true
      },
    },
    {
      name: 'showStatus',
      label: 'Show Status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Past', value: 'past' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'order',
      label: 'Display Order',
      type: 'number',
      admin: { description: 'Lower numbers appear first.' },
    },
  ],
}

export default UpcomingShows

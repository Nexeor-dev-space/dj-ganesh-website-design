import type { CollectionConfig } from 'payload'

/**
 * Contact / booking enquiries submitted from the public contact page.
 *
 * Admin-read-only: the public site may CREATE a submission (the enquiry form
 * POSTs here) but only authenticated admins can read, update or delete them.
 */
const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Contact Submission', plural: 'Contact Submissions' },
  admin: {
    group: 'Submissions',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'eventType', 'status', 'createdAt'],
    description: 'Booking / contact enquiries submitted from the public site.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text' },
    {
      name: 'eventType',
      label: 'Event Type / Subject',
      type: 'text',
      admin: { description: 'e.g. Wedding, Festival, Corporate Event.' },
    },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Responded', value: 'responded' },
      ],
    },
  ],
}

export default ContactSubmissions

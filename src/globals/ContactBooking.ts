import type { GlobalConfig } from 'payload'

const ContactBooking: GlobalConfig = {
  slug: 'contact-booking',
  label: 'Contact / Booking Settings',
  admin: {
    description: 'Manage contact and booking information for DJ Ganesh.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'bookingEmail',
      label: 'Booking Email',
      type: 'email',
      required: true,
    },
    { name: 'enquiryEmail', label: 'General Enquiry Email', type: 'email' },
    { name: 'phone', label: 'Phone Number', type: 'text' },
    {
      type: 'group',
      name: 'agency',
      label: 'Agency Details',
      fields: [
        { name: 'agencyName', label: 'Agency Name', type: 'text' },
        { name: 'agencyEmail', label: 'Agency Email', type: 'email' },
        { name: 'agencyPhone', label: 'Agency Phone', type: 'text' },
        { name: 'agencyWebsite', label: 'Agency Website', type: 'text' },
      ],
    },
    {
      name: 'socialLinks',
      label: 'Social Links',
      type: 'array',
      fields: [
        {
          name: 'platform',
          label: 'Platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'url', label: 'URL', type: 'text', required: true },
      ],
    },
    { name: 'bookingCtaText', label: 'Booking CTA Text', type: 'text', admin: { placeholder: 'e.g. Book DJ Ganesh' } },
    { name: 'bookingCtaUrl', label: 'Booking CTA URL', type: 'text' },
  ],
}

export default ContactBooking

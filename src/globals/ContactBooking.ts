import type { GlobalConfig } from 'payload'

const ContactBooking: GlobalConfig = {
  slug: 'contact-booking',
  label: 'Contact / Booking Settings',
  admin: {
    group: 'Settings',
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
    {
      type: 'group',
      name: 'whatsapp',
      label: 'WhatsApp Button',
      fields: [
        { name: 'whatsappNumber', label: 'WhatsApp Number', type: 'text', admin: { description: 'Digits only, country code first, no + or spaces.' } },
        { name: 'whatsappLabel', label: 'Button Label', type: 'text', admin: { placeholder: 'e.g. Quick Booking' } },
        { name: 'whatsappMessage', label: 'Pre-filled Message', type: 'textarea' },
      ],
    },
    {
      type: 'group',
      name: 'contactMeta',
      label: 'Contact Page Header',
      fields: [
        { name: 'eyebrow', label: 'Eyebrow', type: 'text', admin: { placeholder: 'e.g. Contact / Booking' } },
        {
          name: 'heading',
          label: 'Heading Lines',
          type: 'array',
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
        { name: 'lede', label: 'Lede', type: 'textarea' },
      ],
    },
    {
      type: 'group',
      name: 'enquiry',
      label: 'Enquiry Form Copy',
      fields: [
        { name: 'heading', label: 'Heading', type: 'text' },
        { name: 'lede', label: 'Lede', type: 'textarea' },
        { name: 'submitLabel', label: 'Submit Button Label', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'bookingInfoBlock',
      label: 'Booking Info Block',
      fields: [
        { name: 'heading', label: 'Heading', type: 'text', admin: { placeholder: 'e.g. Planning an event?' } },
        { name: 'copy', label: 'Copy', type: 'textarea' },
      ],
    },
    {
      type: 'group',
      name: 'finalCta',
      label: 'Contact Final CTA',
      // The contact page no longer renders this block; hidden so nobody edits
      // copy that never shows. Stored values are kept.
      admin: { hidden: true },
      fields: [
        {
          name: 'heading',
          label: 'Heading Lines',
          type: 'array',
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
        { name: 'lede', label: 'Lede', type: 'textarea' },
        { name: 'label', label: 'CTA Label', type: 'text' },
        { name: 'href', label: 'CTA Link', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'callBand',
      label: 'Closing Call Band',
      admin: { description: 'The band before the footer (data/call.ts). Agencies here supplement the single Agency Details above.' },
      fields: [
        {
          name: 'heading',
          label: 'Heading Lines',
          type: 'array',
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
        { name: 'lede', label: 'Lede', type: 'textarea' },
        { name: 'ctaLabel', label: 'CTA Label', type: 'text' },
        {
          name: 'agencies',
          label: 'Agencies',
          type: 'array',
          fields: [{ name: 'name', label: 'Name', type: 'text', required: true }],
        },
      ],
    },
  ],
}

export default ContactBooking

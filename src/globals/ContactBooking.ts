import type { GlobalConfig } from 'payload'
import { seoGroup } from '../fields/seo.ts'

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
    // Not shown on the website (no phone number is published); hidden.
    { name: 'phone', label: 'Phone Number', type: 'text', admin: { hidden: true } },
    {
      type: 'group',
      name: 'agency',
      label: 'Agency Details',
      // Not shown on the website; hidden so nobody edits copy that never
      // appears. Stored values are kept.
      admin: { hidden: true },
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
    {
      name: 'bookingCtaText',
      label: 'Header Book Button Text',
      type: 'text',
      admin: { placeholder: 'e.g. Book', description: 'The green button in the header. Keep it to one short word, or it crowds the header on phones.' },
    },
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
        {
          name: 'eventTypes',
          label: 'Event Types',
          type: 'array',
          admin: { description: 'The choices in the form\'s "Event type" list, in this order. Empty keeps the built-in list.' },
          fields: [{ name: 'type', label: 'Event Type', type: 'text', required: true }],
        },
        { name: 'successTitle', label: 'Thank-you Title', type: 'text', admin: { placeholder: 'e.g. Thank you.' } },
        { name: 'successText', label: 'Thank-you Message', type: 'textarea', admin: { placeholder: "e.g. Your enquiry has been received — we'll get back to you as soon as possible." } },
        { name: 'againLabel', label: '"Send Another" Button', type: 'text', admin: { placeholder: 'e.g. Send another enquiry' } },
        { name: 'errorText', label: 'Error Message', type: 'textarea', admin: { description: 'Shown if sending fails.' } },
      ],
    },
    {
      type: 'group',
      name: 'direct',
      label: 'Direct Contact',
      admin: { description: 'The block under the form on /contact. The email addresses are the Booking and General Enquiry emails above.' },
      fields: [
        { name: 'heading', label: 'Heading', type: 'text', admin: { placeholder: 'e.g. Or get in touch directly' } },
        { name: 'bookingLabel', label: 'Booking Email Label', type: 'text', admin: { placeholder: 'e.g. Bookings' } },
        { name: 'bookingNote', label: 'Booking Email Note', type: 'text', admin: { placeholder: 'e.g. Events, festivals, venues and private functions' } },
        { name: 'enquiryLabel', label: 'General Email Label', type: 'text', admin: { placeholder: 'e.g. General enquiries' } },
        { name: 'enquiryNote', label: 'General Email Note', type: 'text', admin: { placeholder: 'e.g. Press, collaborations and everything else' } },
        { name: 'socialHeading', label: 'Social Links Heading', type: 'text', admin: { placeholder: 'e.g. Stay connected' } },
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
      // Not shown on the website; hidden so nobody edits copy that never
      // appears. Stored values are kept.
      admin: {
        hidden: true,
        description: 'The band before the footer (data/call.ts). Agencies here supplement the single Agency Details above.',
      },
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
    seoGroup('the Contact page'),
  ],
}

export default ContactBooking

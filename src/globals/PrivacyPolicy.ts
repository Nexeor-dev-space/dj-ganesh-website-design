import type { GlobalConfig } from 'payload'

/**
 * The /privacy page. Short sections of plain text; every field falls back to
 * the copy in data/privacy.ts when left empty.
 */
const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  label: 'Privacy Policy',
  admin: { group: 'Site Content', description: 'The /privacy page, linked from the footer and the booking form.' },
  access: { read: () => true },
  fields: [
    { name: 'title', label: 'Title', type: 'text', admin: { placeholder: 'e.g. Privacy Policy' } },
    { name: 'updated', label: 'Last Updated', type: 'text', admin: { placeholder: 'e.g. 30 October 2026' } },
    { name: 'intro', label: 'Intro', type: 'textarea' },
    {
      name: 'sections',
      label: 'Sections',
      type: 'array',
      fields: [
        { name: 'heading', label: 'Heading', type: 'text', required: true },
        { name: 'body', label: 'Text', type: 'textarea', required: true },
      ],
    },
  ],
}

export default PrivacyPolicy

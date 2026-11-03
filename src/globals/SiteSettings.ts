import type { GlobalConfig } from 'payload'

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Global site configuration, branding, SEO defaults, and contact information.',
  },
  access: { read: () => true },
  fields: [
    { name: 'siteName', label: 'Brand Name', type: 'text', required: true, admin: { description: 'The big name at the foot of every page.' } },
    { name: 'logo', label: 'Header Logo', type: 'upload', relationTo: 'media', admin: { description: 'The logo in the header on every page. A wide, transparent PNG works best. Empty: the built-in logo.' } },
    { name: 'favicon', label: 'Favicon', type: 'upload', relationTo: 'media', admin: { hidden: true } },
    {
      type: 'group',
      name: 'seo',
      label: 'Default SEO',
      // Not shown on the website; hidden so nobody edits copy that never
      // appears. Stored values are kept.
      admin: { hidden: true },
      fields: [
        { name: 'defaultSeoTitle', label: 'Default SEO Title', type: 'text' },
        { name: 'defaultSeoDescription', label: 'Default SEO Description', type: 'textarea' },
      ],
    },
    {
      name: 'socialLinks',
      label: 'Social Media Links',
      type: 'array',
      fields: [
        {
          name: 'platform',
          label: 'Platform',
          type: 'select',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'SoundCloud', value: 'soundcloud' },
            { label: 'Spotify', value: 'spotify' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
          validate: (value: string | null | undefined) => {
            if (!value || !/^https?:\/\/.+/.test(value)) return 'Must be a valid URL'
            return true
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'contact',
      label: 'Contact Information',
      fields: [
        {
          name: 'contactEmail',
          label: 'Contact Email',
          type: 'email',
        },
        { name: 'phone', label: 'Phone Number', type: 'text' },
      ],
    },
    { name: 'bookingInfo', label: 'Booking Information', type: 'textarea', admin: { hidden: true } },
    { name: 'footerContent', label: 'Footer Content', type: 'textarea', admin: { hidden: true } },
    {
      type: 'group',
      name: 'footer',
      label: 'Footer',
      fields: [
        {
          name: 'columns',
          label: 'Footer Columns',
          type: 'array',
          fields: [
            { name: 'title', label: 'Column Title', type: 'text', required: true },
            {
              name: 'links',
              label: 'Links',
              type: 'array',
              fields: [
                { name: 'label', label: 'Label', type: 'text', required: true },
                { name: 'href', label: 'Link', type: 'text', required: true },
                { name: 'external', label: 'External', type: 'checkbox', defaultValue: false },
              ],
            },
          ],
        },
        // Not shown on the website; hidden, stored value kept.
        { name: 'statement', label: 'Footer Statement', type: 'text', admin: { hidden: true, placeholder: 'e.g. Follow the sound' } },
        { name: 'copyright', label: 'Copyright', type: 'text' },
        { name: 'contactEmail', label: 'Footer Contact Email', type: 'email', admin: { hidden: true } },
      ],
    },
  ],
}

export default SiteSettings

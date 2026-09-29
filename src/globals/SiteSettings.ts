import type { GlobalConfig } from 'payload'

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description: 'Global site configuration, branding, SEO defaults, and contact information.',
  },
  access: { read: () => true },
  fields: [
    { name: 'siteName', label: 'Site / Brand Name', type: 'text', required: true },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' as any },
    { name: 'favicon', label: 'Favicon', type: 'upload', relationTo: 'media' as any },
    {
      type: 'group',
      name: 'seo',
      label: 'Default SEO',
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
    { name: 'bookingInfo', label: 'Booking Information', type: 'textarea' },
    { name: 'footerContent', label: 'Footer Content', type: 'textarea' },
  ],
}

export default SiteSettings

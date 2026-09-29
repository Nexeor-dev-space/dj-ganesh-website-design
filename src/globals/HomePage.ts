import type { GlobalConfig } from 'payload'

const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: {
    description: 'Manage content for the website homepage.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'group',
      name: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'heroHeading', label: 'Heading', type: 'text' },
        { name: 'heroSubheading', label: 'Sub-Heading', type: 'text' },
        { name: 'heroImage', label: 'Background Image', type: 'upload', relationTo: 'media' as any },
        { name: 'heroCtaText', label: 'CTA Button Text', type: 'text' },
        { name: 'heroCtaUrl', label: 'CTA Button URL', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'artistIntro',
      label: 'Artist Introduction',
      fields: [
        { name: 'introTitle', label: 'Title', type: 'text' },
        { name: 'introBio', label: 'Bio / Description', type: 'textarea' },
        { name: 'introImage', label: 'Artist Image', type: 'upload', relationTo: 'media' as any },
      ],
    },
    {
      type: 'group',
      name: 'statistics',
      label: 'Statistics',
      fields: [
        {
          name: 'stats',
          label: 'Stat Items',
          type: 'array',
          fields: [
            { name: 'value', label: 'Value (e.g. 500+)', type: 'text', required: true },
            { name: 'label', label: 'Label (e.g. Shows Worldwide)', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'globalReach',
      label: 'Global Reach',
      fields: [
        { name: 'heading', label: 'Section Heading', type: 'text' },
        {
          name: 'locations',
          label: 'Tour Locations',
          type: 'array',
          admin: { description: 'Manage city/location data from CMS instead of hardcoding in JS.' },
          fields: [
            { name: 'city', label: 'City', type: 'text', required: true },
            { name: 'country', label: 'Country', type: 'text', required: true },
            { name: 'lat', label: 'Latitude', type: 'number' },
            { name: 'lng', label: 'Longitude', type: 'number' },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'featuredShows',
      label: 'Featured Shows',
      fields: [
        { name: 'heading', label: 'Section Heading', type: 'text' },
        {
          name: 'shows',
          label: 'Featured Shows',
          type: 'relationship',
          relationTo: 'upcoming-shows' as any,
          hasMany: true,
        },
      ],
    },
    {
      type: 'group',
      name: 'featuredMusic',
      label: 'Featured Music',
      fields: [
        { name: 'heading', label: 'Section Heading', type: 'text' },
        {
          name: 'tracks',
          label: 'Featured Tracks',
          type: 'relationship',
          relationTo: 'music-releases' as any,
          hasMany: true,
        },
      ],
    },
    {
      type: 'group',
      name: 'bookingCta',
      label: 'Booking CTA',
      fields: [
        { name: 'heading', label: 'Heading', type: 'text' },
        { name: 'subheading', label: 'Sub-Heading', type: 'text' },
        { name: 'ctaText', label: 'CTA Button Text', type: 'text' },
        { name: 'ctaUrl', label: 'CTA Button URL', type: 'text' },
      ],
    },
  ],
}

export default HomePage

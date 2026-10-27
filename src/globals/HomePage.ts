import type { GlobalConfig } from 'payload'

const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: {
    group: 'Site Content',
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
        { name: 'heroImage', label: 'Background Image', type: 'upload', relationTo: 'media' },
        { name: 'heroCtaText', label: 'CTA Button Text', type: 'text' },
        { name: 'heroCtaUrl', label: 'CTA Button URL', type: 'text' },
        {
          name: 'heroVideo',
          label: 'Background Video',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Full-bleed hero background video (video/* accepted). Falls back to /videos/dj-ganesh.mp4.' },
        },
        {
          name: 'heroVideoPoster',
          label: 'Video Poster',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional still shown before the video loads.' },
        },
      ],
    },
    {
      type: 'group',
      name: 'artistIntro',
      label: 'Artist Introduction',
      fields: [
        { name: 'introTitle', label: 'Title', type: 'text' },
        { name: 'introBio', label: 'Bio / Description', type: 'textarea' },
        { name: 'introImage', label: 'Artist Image', type: 'upload', relationTo: 'media' },
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
            { name: 'suffix', label: 'Suffix (e.g. +, K)', type: 'text' },
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
          admin: { description: 'Cities shown as pins on the Global Reach globe. Add one row per city.' },
          fields: [
            { name: 'city', label: 'City', type: 'text', required: true },
            { name: 'country', label: 'Country', type: 'text', required: true },
            { name: 'lat', label: 'Latitude', type: 'number', admin: { description: 'North/south position, -90 to 90 (e.g. Mumbai 19.07). On Google Maps, right-click a city and copy the first number.' } },
            { name: 'lng', label: 'Longitude', type: 'number', admin: { description: 'East/west position, -180 to 180 (e.g. Mumbai 72.87). The second number from Google Maps.' } },
            { name: 'labelDx', label: 'Label Offset X', type: 'number', admin: { description: 'Optional: nudge the city name sideways on the globe so labels do not overlap. Leave blank if unsure.' } },
            { name: 'labelDy', label: 'Label Offset Y', type: 'number', admin: { description: 'Optional: nudge the city name up/down on the globe. Leave blank if unsure.' } },
            { name: 'hub', label: 'Hub City', type: 'checkbox', defaultValue: false, admin: { description: 'Tick for a main base city; it is highlighted on the globe.' } },
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
          relationTo: 'upcoming-shows',
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
          relationTo: 'music-releases',
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
    {
      type: 'group',
      name: 'statementPlate',
      label: 'Statement Plate',
      fields: [
        { name: 'label', label: 'Label', type: 'text', admin: { placeholder: 'e.g. The Statement' } },
        {
          name: 'lines',
          label: 'Lines',
          type: 'array',
          admin: { description: 'Each line is a design break point.' },
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
        { name: 'spoken', label: 'Spoken (show as quote)', type: 'checkbox', defaultValue: false },
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'note', label: 'Note', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'stages',
      label: 'Stages Marquee',
      fields: [
        { name: 'label', label: 'Label', type: 'text', admin: { placeholder: 'e.g. Stages' } },
        {
          name: 'heading',
          label: 'Heading Lines',
          type: 'array',
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
        { name: 'lede', label: 'Lede', type: 'textarea' },
        { name: 'ctaLabel', label: 'CTA Label', type: 'text' },
        { name: 'ctaHref', label: 'CTA Link', type: 'text' },
        {
          name: 'stages',
          label: 'Stages',
          type: 'array',
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'featured', label: 'Featured', type: 'checkbox', defaultValue: false, admin: { description: 'Tick to highlight this stage in the scrolling marquee.' } },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'trustedBy',
      label: 'Trusted By',
      fields: [
        { name: 'label', label: 'Label', type: 'text', admin: { placeholder: 'e.g. Trusted By' } },
        {
          name: 'names',
          label: 'Names',
          type: 'array',
          fields: [{ name: 'name', label: 'Name', type: 'text', required: true }],
        },
      ],
    },
    {
      type: 'group',
      name: 'galleryStrip',
      label: 'Gallery Strip',
      fields: [
        { name: 'label', label: 'Label', type: 'text', admin: { placeholder: 'e.g. Gallery' } },
        {
          name: 'items',
          label: 'Items',
          type: 'array',
          fields: [
            { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
            { name: 'alt', label: 'Alt Text', type: 'text' },
            { name: 'href', label: 'Link', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'follow',
      label: 'Follow Section',
      fields: [
        { name: 'heading', label: 'Heading', type: 'text', admin: { placeholder: 'e.g. Follow' } },
        {
          name: 'links',
          label: 'Links',
          type: 'array',
          fields: [
            { name: 'label', label: 'Label', type: 'text', required: true },
            { name: 'caption', label: 'Caption', type: 'text' },
            { name: 'href', label: 'Link', type: 'text', required: true },
            { name: 'icon', label: 'Icon', type: 'text', admin: { placeholder: 'e.g. instagram, youtube, email' } },
            { name: 'external', label: 'External', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'bookingSection',
      label: 'Booking Section',
      admin: { description: 'The homepage booking band (data/booking.ts). The primary CTA remains in Booking CTA above.' },
      fields: [
        { name: 'label', label: 'Label', type: 'text', admin: { placeholder: 'e.g. Booking' } },
        {
          name: 'heading',
          label: 'Heading Lines',
          type: 'array',
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
        { name: 'lede', label: 'Lede', type: 'textarea' },
        {
          name: 'scope',
          label: 'Scope (occasions)',
          type: 'array',
          fields: [{ name: 'item', label: 'Item', type: 'text', required: true }],
        },
        {
          name: 'links',
          label: 'Links',
          type: 'array',
          fields: [
            { name: 'label', label: 'Label', type: 'text', required: true },
            { name: 'value', label: 'Value', type: 'text' },
            { name: 'href', label: 'Link', type: 'text', required: true },
            { name: 'external', label: 'External', type: 'checkbox', defaultValue: false },
            { name: 'icon', label: 'Icon', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'legacySection',
      label: 'Legacy Section Chrome',
      fields: [
        { name: 'label', label: 'Label', type: 'text', admin: { placeholder: 'e.g. Legacy' } },
        {
          name: 'heading',
          label: 'Heading Lines',
          type: 'array',
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
      ],
    },
    {
      type: 'group',
      name: 'testimonialsSection',
      label: 'Testimonials Section Chrome',
      fields: [
        { name: 'label', label: 'Label', type: 'text', admin: { placeholder: 'e.g. Testimonials' } },
        {
          name: 'heading',
          label: 'Heading Lines',
          type: 'array',
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
      ],
    },
    {
      type: 'group',
      name: 'experienceSection',
      label: 'Experience Section Labels',
      admin: { description: 'The offerings themselves are managed in the Experiences / Services collection.' },
      fields: [
        { name: 'label', label: 'Label', type: 'text', admin: { placeholder: 'e.g. What I Do' } },
        {
          name: 'heading',
          label: 'Heading Lines',
          type: 'array',
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
        { name: 'ctaHref', label: 'CTA Link', type: 'text' },
      ],
    },
  ],
}

export default HomePage

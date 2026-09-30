import type { CollectionConfig } from 'payload'

const MusicReleases: CollectionConfig = {
  slug: 'music-releases',
  labels: { singular: 'Music / Release', plural: 'Music / Releases' },
  admin: {
    group: 'Collections',
    useAsTitle: 'title',
    defaultColumns: ['title', 'genre', 'releaseDate', 'featured', 'publishedStatus', 'order'],
    description: 'Manage DJ Ganesh music tracks and releases.',
  },
  access: { read: () => true },
  versions: { drafts: { autosave: false } },
  fields: [
    { name: 'title', label: 'Track / Release Title', type: 'text', required: true },
    {
      name: 'genre',
      label: 'Category / Genre',
      type: 'select',
      options: [
        { label: 'Indo Tech', value: 'indo-tech' },
        { label: 'Afro House', value: 'afro-house' },
        { label: 'Afro Mashup', value: 'afro-mashup' },
        { label: 'BollyAfro', value: 'bollyafro' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    { name: 'artist', label: 'Artist / Credits', type: 'text' },
    { name: 'artwork', label: 'Artwork', type: 'upload', relationTo: 'media' as any },
    {
      name: 'youtubeUrl',
      label: 'YouTube URL',
      type: 'text',
      admin: { placeholder: 'https://youtube.com/watch?v=...' },
      validate: (value: string | null | undefined) => {
        if (value && !/^https?:\/\/.+/.test(value)) return 'Must be a valid URL'
        return true
      },
    },
    {
      name: 'audioUrl',
      label: 'Audio URL',
      type: 'text',
      admin: { description: 'Optional: direct link to audio file.' },
    },
    {
      name: 'releaseDate',
      label: 'Release Date',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    {
      name: 'featured',
      label: 'Featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show this release in featured sections.' },
    },
    {
      name: 'publishedStatus',
      label: 'Published',
      type: 'checkbox',
      defaultValue: false,
    },
    { name: 'order', label: 'Display Order', type: 'number', admin: { description: 'Lower numbers appear first.' } },
  ],
}

export default MusicReleases

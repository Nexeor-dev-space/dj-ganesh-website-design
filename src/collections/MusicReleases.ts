import type { CollectionConfig } from 'payload'
import { audioOnly, imageOnly } from './Media.ts'

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
    { name: 'artwork', label: 'Artwork', type: 'upload', relationTo: 'media', filterOptions: imageOnly },
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
      name: 'audioFile',
      label: 'Audio File',
      type: 'upload',
      relationTo: 'media',
      filterOptions: audioOnly,
      admin: { description: 'MP3, WAV or M4A from the Media library. Used instead of the Audio URL below.' },
    },
    {
      // Kept for releases set up before audio uploads (#44): typed paths like
      // /audio/x.mp3 (served from the media host) or full links.
      name: 'audioUrl',
      label: 'Audio URL (legacy)',
      type: 'text',
      admin: { description: 'Optional: path or direct link to an audio file. Used only when no Audio File is picked.' },
    },
    {
      name: 'releaseDate',
      label: 'Release Date',
      type: 'date',
      // Not shown on the website; hidden, stored values kept.
      admin: { hidden: true, date: { pickerAppearance: 'dayOnly' } },
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

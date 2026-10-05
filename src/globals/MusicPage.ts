import type { GlobalConfig } from 'payload'

/**
 * The /music page — copy only.
 *
 * The track archive itself lives in the MusicReleases collection; this global
 * holds the page's labels, title and statement. Mirrors data/music-page.ts and
 * data/tracks.ts section copy. All values have code fallbacks.
 */
const MusicPage: GlobalConfig = {
  slug: 'music-page',
  label: 'Music Page',
  admin: { group: 'Site Content', description: 'Copy for the /music page. Live page: http://localhost:3000/music' },
  access: { read: () => true },
  fields: [
    { name: 'pageTitle', label: 'Page Title', type: 'text' },
    { name: 'statement', label: 'Statement', type: 'textarea' },
    {
      type: 'group',
      name: 'labels',
      label: 'Section Labels',
      fields: [
        { name: 'intro', label: 'Intro Label', type: 'text', admin: { placeholder: 'e.g. The Archive' } },
        { name: 'archive', label: 'Archive Label', type: 'text', admin: { placeholder: 'e.g. All Music' } },
        { name: 'continue', label: 'Continue Label', type: 'text', admin: { placeholder: 'e.g. Continue Listening' } },
      ],
    },
    {
      type: 'group',
      name: 'homeSection',
      label: 'Homepage Music Section Copy',
      fields: [
        { name: 'sectionLabel', label: 'Section Label', type: 'text', admin: { placeholder: 'e.g. Latest Drops' } },
        { name: 'heading', label: 'Heading', type: 'text', admin: { placeholder: 'e.g. The Music' } },
        { name: 'allReleasesUrl', label: 'All Releases URL', type: 'text' },
      ],
    },
  ],
}

export default MusicPage

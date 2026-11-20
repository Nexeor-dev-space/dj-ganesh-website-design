import type { GlobalConfig } from 'payload'
import { seoGroup } from '../fields/seo.ts'

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
    // No longer shown: the Music page opens on its title and the player.
    { name: 'statement', label: 'Statement', type: 'textarea', admin: { hidden: true } },
    {
      type: 'group',
      name: 'labels',
      label: 'Section Labels',
      fields: [
        { name: 'intro', label: 'Intro Label', type: 'text', admin: { placeholder: 'e.g. The Archive' } },
        { name: 'archive', label: 'Archive Label', type: 'text', admin: { hidden: true, placeholder: 'e.g. All Music' } },
        { name: 'continue', label: 'Continue Label', type: 'text', admin: { placeholder: 'e.g. Continue Listening' } },
        {
          name: 'continueHeading',
          label: 'Closing Heading Lines',
          type: 'array',
          admin: { description: 'The heading at the foot of the Music page, e.g. "The rest of the" / "sound is on the channel."' },
          fields: [{ name: 'line', label: 'Line', type: 'text', required: true }],
        },
        { name: 'youtubeButton', label: 'Closing YouTube Button', type: 'text', admin: { placeholder: 'e.g. All releases on YouTube' } },
        { name: 'spotifyButton', label: 'Closing Spotify Button', type: 'text', admin: { placeholder: 'e.g. Listen on Spotify' } },
      ],
    },
    {
      type: 'group',
      name: 'player',
      label: 'Music Player Buttons',
      admin: { description: 'Words on the record player, on the homepage and the Music page. Empty keeps the built-in words.' },
      fields: [
        { name: 'youtubeLabel', label: 'YouTube Button', type: 'text', admin: { placeholder: 'e.g. Watch on YouTube' } },
        { name: 'spotifyLabel', label: 'Spotify Button', type: 'text', admin: { placeholder: 'e.g. Listen on Spotify' } },
        { name: 'playlistHeading', label: 'Playlist Heading (Music page)', type: 'text', admin: { placeholder: 'e.g. Playlist' } },
        { name: 'archiveLinkLabel', label: 'Full Archive Link (homepage)', type: 'text', admin: { placeholder: 'e.g. View the full archive' } },
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
        {
          name: 'spotifyUrl',
          label: 'Spotify URL',
          type: 'text',
          admin: { description: 'The "Listen on Spotify" link under the home page music player and at the foot of the Music page.' },
        },
      ],
    },
    seoGroup('the Music page'),
  ],
}

export default MusicPage

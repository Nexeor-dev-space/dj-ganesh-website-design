import type { CollectionConfig } from 'payload'

/**
 * Audio formats editors may upload (#44): MP3, WAV, M4A. Payload checks the
 * file's bytes, which report `audio/wav` and `audio/x-m4a` or `audio/mp4`;
 * the `x-` aliases cover browsers that send them.
 */
export const AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a']

const isAudio = (mimeType: unknown) => typeof mimeType === 'string' && AUDIO_MIME_TYPES.includes(mimeType)

/** `my-track_01.mp3` -> `my track 01`, the alt text for an audio file left blank. */
const nameFromFilename = (filename: unknown) =>
  typeof filename === 'string' ? filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() : ''

const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: {
    group: 'Media',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'caption', 'updatedAt'],
    description: 'Media library for all website assets.',
  },
  access: { read: () => true },
  upload: {
    staticDir: 'public/media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*', ...AUDIO_MIME_TYPES],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true,
      admin: { description: 'Optional for audio files: left blank, it is filled from the file name.' },
      hooks: {
        // The server knows the file type before validation runs, so a blank
        // alt on an audio file is filled here and the required check passes.
        beforeValidate: [
          ({ value, data }) => (!value && isAudio(data?.mimeType) ? nameFromFilename(data?.filename) || value : value),
        ],
      },
      // The admin form validates before the file type is known (new upload),
      // so it lets a blank alt through; the server enforces it for non-audio.
      validate: (value: string | null | undefined, { data }: { data: Partial<{ mimeType: string | null }> }) => {
        if (value || !data?.mimeType || isAudio(data.mimeType)) return true
        return 'This field is required.'
      },
    },
    { name: 'caption', label: 'Caption', type: 'text' },
  ],
}

export default Media

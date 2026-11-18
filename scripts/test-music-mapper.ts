/* eslint-disable @typescript-eslint/no-explicit-any */
// Tests for #44: a release's audio comes from an uploaded Audio File, else the
// legacy Audio URL. Run: node --experimental-strip-types --no-warnings --test scripts/test-music-mapper.ts
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

const rootUrl = pathToFileURL(process.cwd() + '/').href
register(
  'data:text/javascript,' +
    encodeURIComponent(`
      const rootUrl = "${rootUrl}";
      export async function resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('@/')) {
          return nextResolve(rootUrl + specifier.slice(2) + '.ts', context);
        }
        return nextResolve(specifier, context);
      }
    `),
)

import assert from 'node:assert'
import { describe, it } from 'node:test'

// lib/asset-url.ts reads the media host when it loads.
const BASE = 'https://media.example.test/assets'
process.env.NEXT_PUBLIC_MEDIA_BASE_URL = BASE

const ld = (f: string) => import(f)
const { toTrack } = await ld('../lib/cms/mappers.ts')
const { default: Media, AUDIO_MIME_TYPES } = await ld('../src/collections/Media.ts')
const { default: MusicReleases } = await ld('../src/collections/MusicReleases.ts')

const release = (over: Record<string, unknown>) => ({ id: 1, title: 'T', genre: 'other', ...over }) as any
const uploaded = `${BASE}/media/test-44.mp3`

describe('toTrack audio (#44)', () => {
  it('uses the uploaded Audio File when it is populated', () => {
    const t = toTrack(release({ audioFile: { id: 9, url: uploaded, alt: 'x' }, audioUrl: '/audio/old.mp3' }))
    assert.strictEqual(t.audio, uploaded)
  })

  it('falls back to a legacy typed path, served from the media host', () => {
    assert.strictEqual(toTrack(release({ audioUrl: '/audio/openformat.mp3' })).audio, `${BASE}/audio/openformat.mp3`)
  })

  it('passes a legacy full URL through unchanged', () => {
    const url = 'https://cdn.example.com/a.mp3'
    assert.strictEqual(toTrack(release({ audioUrl: url })).audio, url)
  })

  it('falls back to the legacy value when the Audio File is only an id (not populated)', () => {
    assert.strictEqual(toTrack(release({ audioFile: 9, audioUrl: '/audio/x.mp3' })).audio, `${BASE}/audio/x.mp3`)
  })

  it('falls back when the picked file was deleted (null) or has no url', () => {
    assert.strictEqual(toTrack(release({ audioFile: null, audioUrl: '/audio/x.mp3' })).audio, `${BASE}/audio/x.mp3`)
    assert.strictEqual(toTrack(release({ audioFile: { id: 9, url: null }, audioUrl: '/audio/x.mp3' })).audio, `${BASE}/audio/x.mp3`)
  })

  it('is empty when neither is set', () => {
    assert.strictEqual(toTrack(release({})).audio, '')
  })
})

describe('Media audio uploads (#44)', () => {
  const alt = Media.fields.find((f: any) => f.name === 'alt')

  it('accepts MP3, WAV and M4A next to images and video', () => {
    for (const m of ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a']) {
      assert.ok(Media.upload.mimeTypes.includes(m), m)
    }
    assert.ok(Media.upload.mimeTypes.includes('image/*'))
    assert.ok(Media.upload.mimeTypes.includes('video/*'))
    assert.ok(!Media.upload.mimeTypes.includes('audio/*'), 'no blanket audio/*')
  })

  it('fills a blank alt on an audio file from its file name', () => {
    const hook = alt.hooks.beforeValidate[0]
    assert.strictEqual(hook({ value: '', data: { mimeType: 'audio/wav', filename: 'test-44_large.wav' } }), 'test 44 large')
    assert.strictEqual(hook({ value: 'Mine', data: { mimeType: 'audio/wav', filename: 'a.wav' } }), 'Mine')
    assert.strictEqual(hook({ value: '', data: { mimeType: 'image/jpeg', filename: 'a.jpg' } }), '')
  })

  it('still requires alt for images and video', () => {
    assert.notStrictEqual(alt.validate('', { data: { mimeType: 'image/jpeg' } }), true)
    assert.notStrictEqual(alt.validate('', { data: { mimeType: 'video/mp4' } }), true)
    assert.strictEqual(alt.validate('A photo', { data: { mimeType: 'image/jpeg' } }), true)
    assert.strictEqual(alt.validate('', { data: { mimeType: 'audio/mpeg' } }), true)
  })

  it('the release picker only lists audio', () => {
    const f = MusicReleases.fields.find((x: any) => x.name === 'audioFile')
    assert.strictEqual(f.relationTo, 'media')
    assert.deepStrictEqual(f.filterOptions, { mimeType: { in: AUDIO_MIME_TYPES } })
    assert.ok(MusicReleases.fields.some((x: any) => x.name === 'audioUrl'), 'legacy field kept')
  })
})

/* eslint-disable @typescript-eslint/no-explicit-any */
// Tests for the PR #45 review: every Media picker is filtered by file type, and
// upload temp files are cleaned up.
// Run: node --experimental-strip-types --no-warnings --test scripts/test-media-uploads.ts
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
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'

const ld = (f: string) => import(f)
const { imageOnly, videoOnly, audioOnly, AUDIO_MIME_TYPES } = await ld('../src/collections/Media.ts')
const { removeUploadTempFiles, removeUploadTempFilesAfterSave, sweepUploadTempDir } = await ld('../src/hooks/uploadTempFiles.ts')
const { handlePoolErrors } = await ld('../src/hooks/poolErrors.ts')
const { EventEmitter } = await ld('node:events')
const config = await (await ld('../payload.config.ts')).default

/** Every upload/relationship field that targets media, with its path. */
function mediaFields() {
  const out: { owner: string; path: string; field: any }[] = []
  const walk = (fields: any[], prefix: string, owner: string) => {
    for (const f of fields ?? []) {
      const p = f.name ? (prefix ? `${prefix}.${f.name}` : f.name) : prefix
      if ((f.type === 'upload' || f.type === 'relationship') && [].concat(f.relationTo).includes('media')) {
        out.push({ owner, path: p, field: f })
      }
      if (f.fields) walk(f.fields, p, owner)
      if (f.tabs) for (const t of f.tabs) walk(t.fields, t.name ? (prefix ? `${prefix}.${t.name}` : t.name) : prefix, owner)
      if (f.blocks) for (const b of f.blocks) walk(b.fields, `${p}[${b.slug}]`, owner)
    }
  }
  for (const c of config.collections) walk(c.fields, '', c.slug)
  for (const g of config.globals) walk(g.fields, '', g.slug)
  // Payload's own record of open documents links to any collection.
  return out.filter((x) => x.owner !== 'payload-locked-documents')
}

describe('Media picker filters', () => {
  it('match images, video and the audio list', () => {
    assert.deepStrictEqual(imageOnly, { mimeType: { contains: 'image/' } })
    assert.deepStrictEqual(videoOnly, { mimeType: { contains: 'video/' } })
    assert.deepStrictEqual(audioOnly, { mimeType: { in: AUDIO_MIME_TYPES } })
  })

  it('every Media field has one of the three filters', () => {
    const fields = mediaFields()
    assert.ok(fields.length >= 31, `found ${fields.length} fields`)
    const missing = fields.filter((x) => ![imageOnly, videoOnly, audioOnly].includes(x.field.filterOptions))
    assert.deepStrictEqual(missing.map((x) => `${x.owner}.${x.path}`), [])
  })

  it('only the two hero/reel videos take video, only Audio File takes audio', () => {
    const by = (h: unknown) => mediaFields().filter((x) => x.field.filterOptions === h).map((x) => `${x.owner}.${x.path}`).sort()
    assert.deepStrictEqual(by(videoOnly), ['home-page.galleryStrip.reelVideo', 'home-page.hero.heroVideo'])
    assert.deepStrictEqual(by(audioOnly), ['music-releases.audioFile'])
  })

  it('the SEO Share Image takes images only on every page', () => {
    const seo = mediaFields().filter((x) => x.path === 'seo.image')
    assert.strictEqual(seo.length, 5)
    for (const x of seo) assert.strictEqual(x.field.filterOptions, imageOnly, x.owner)
  })
})

describe('Upload temp files', () => {
  it('uses temp files with a 120 MB cap that aborts', () => {
    assert.strictEqual(config.upload.useTempFiles, true)
    assert.ok(config.upload.tempFileDir)
    assert.strictEqual(config.upload.limits.fileSize, 120 * 1024 * 1024)
    assert.strictEqual(config.upload.abortOnLimit, true)
    assert.ok(config.hooks.afterError.includes(removeUploadTempFiles))
  })

  it('the error hook deletes the request temp files', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'upl-test-'))
    const a = path.join(dir, 'a'), b = path.join(dir, 'b')
    await fs.writeFile(a, 'x')
    await fs.writeFile(b, 'y')
    await removeUploadTempFiles({ req: { file: { tempFilePath: a }, files: { file: { tempFilePath: a }, other: [{ tempFilePath: b }] } } } as any)
    assert.deepStrictEqual(await fs.readdir(dir), [])
    // No file on the request, or a file already gone: no throw.
    await removeUploadTempFiles({ req: {} } as any)
    await removeUploadTempFiles({ req: { file: { tempFilePath: a } } } as any)
    await fs.rm(dir, { recursive: true, force: true })
  })

  it('after a save, deletes the temp file the storage plugin kept in req.context', async () => {
    const media = config.collections.find((c: any) => c.slug === 'media')
    assert.ok(media.hooks.afterOperation.includes(removeUploadTempFilesAfterSave))
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'upl-test-'))
    const a = path.join(dir, 'a')
    await fs.writeFile(a, 'x')
    // The plugin has cleared req.file; only its context copy points at the file.
    const req = { file: undefined, context: { _payloadCloudStorage: { file: { tempFilePath: a } } } }
    const result = { id: 1 }
    assert.strictEqual(await removeUploadTempFilesAfterSave({ operation: 'read', req, result } as any), result)
    assert.deepStrictEqual(await fs.readdir(dir), ['a'], 'reads leave files alone')
    assert.strictEqual(await removeUploadTempFilesAfterSave({ operation: 'create', req, result } as any), result)
    assert.deepStrictEqual(await fs.readdir(dir), [])
    await fs.rm(dir, { recursive: true, force: true })
  })

  it('the sweep removes only files older than an hour', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'upl-test-'))
    const old = path.join(dir, 'old'), fresh = path.join(dir, 'fresh')
    await fs.writeFile(old, 'x')
    await fs.writeFile(fresh, 'y')
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    await fs.utimes(old, twoHoursAgo, twoHoursAgo)
    assert.strictEqual(await sweepUploadTempDir(dir), 1)
    assert.deepStrictEqual(await fs.readdir(dir), ['fresh'])
    assert.strictEqual(await sweepUploadTempDir(path.join(dir, 'missing')), 0)
    await fs.rm(dir, { recursive: true, force: true })
  })
})

describe('Postgres pool', () => {
  it('sets a 10 minute idle-in-transaction timeout on the app connection', () => {
    // init() only builds the adapter; it does not connect.
    const adapter = config.db.init({ payload: { config, logger: console } } as any)
    assert.strictEqual(adapter.poolOptions.idle_in_transaction_session_timeout, 10 * 60_000)
    // Below the server's 5-minute idle_session_timeout.
    assert.strictEqual(adapter.poolOptions.idleTimeoutMillis, 4 * 60_000)
  })

  it('a pool error is logged instead of crashing the process', () => {
    const pool = new EventEmitter()
    const warnings: unknown[] = []
    handlePoolErrors({ db: { pool }, logger: { warn: (x: unknown) => warnings.push(x) } } as any)
    // With no 'error' listener, emit('error') throws; with the handler it is logged.
    assert.doesNotThrow(() => pool.emit('error', new Error('terminating connection due to idle-session timeout')))
    assert.strictEqual(warnings.length, 1)
    // A second call does not add a second listener.
    handlePoolErrors({ db: { pool }, logger: { warn: () => {} } } as any)
    assert.strictEqual(pool.listenerCount('error'), 1)
  })
})

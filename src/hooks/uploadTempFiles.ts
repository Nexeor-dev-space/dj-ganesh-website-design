import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import type { AfterErrorHook, CollectionAfterOperationHook, PayloadRequest } from 'payload'

/**
 * Uploads are written to this folder while they arrive instead of being held
 * in memory (`upload.useTempFiles` in payload.config.ts). UPLOAD_TEMP_DIR
 * overrides it; the default is a folder of its own in the OS temp dir.
 */
export const UPLOAD_TEMP_DIR = process.env.UPLOAD_TEMP_DIR?.trim() || path.join(os.tmpdir(), 'dj-ganesh-uploads')

/** Older than this, a temp file belongs to no running upload. */
const STALE_MS = 60 * 60 * 1000

/**
 * Temp files of every file in the request, deduplicated: `req.file`,
 * `req.files`, and the copy the storage plugin keeps in `req.context` after it
 * clears `req.file`.
 */
function tempFilePaths(req: PayloadRequest): string[] {
  const found = new Set<string>()
  const add = (file: unknown) => {
    const p = (file as { tempFilePath?: unknown } | undefined)?.tempFilePath
    if (typeof p === 'string' && p) found.add(p)
  }
  add(req.file)
  for (const value of Object.values((req as { files?: Record<string, unknown> }).files ?? {})) {
    for (const file of Array.isArray(value) ? value : [value]) add(file)
  }
  add((req.context as { _payloadCloudStorage?: { file?: unknown } } | undefined)?._payloadCloudStorage?.file)
  return [...found]
}

const removeTempFiles = (req: PayloadRequest) =>
  Promise.all(tempFilePaths(req).map((p) => fs.rm(p, { force: true }).catch(() => {})))

/**
 * Failed upload: Payload leaves the temp file on disk on any error
 * (validation, MinIO, a dropped DB connection).
 */
export const removeUploadTempFiles: AfterErrorHook = async ({ req }) => {
  await removeTempFiles(req)
}

/**
 * Successful upload: Payload deletes `req.file.tempFilePath`, but the storage
 * plugin clears `req.file` once the file is in MinIO, so Payload finds nothing
 * and the temp file stays. Runs on the Media collection after each write.
 */
export const removeUploadTempFilesAfterSave: CollectionAfterOperationHook = async ({ operation, req, result }) => {
  if (operation === 'create' || operation === 'update' || operation === 'updateByID') await removeTempFiles(req)
  return result
}

/**
 * Safety net for files no hook saw: a process killed mid-upload, or a
 * multipart request to a collection without uploads. Deletes temp files older
 * than an hour; runs at start-up and hourly.
 */
export async function sweepUploadTempDir(dir = UPLOAD_TEMP_DIR, now = Date.now()): Promise<number> {
  let removed = 0
  const names = await fs.readdir(dir).catch(() => [] as string[])
  for (const name of names) {
    const file = path.join(dir, name)
    const stat = await fs.stat(file).catch(() => null)
    if (stat?.isFile() && now - stat.mtimeMs > STALE_MS) {
      await fs.rm(file, { force: true }).catch(() => {})
      removed++
    }
  }
  return removed
}

export function startUploadTempSweep(): void {
  // Payload can initialise more than once in one process (dev reloads).
  const g = globalThis as { __uploadTempSweep?: boolean }
  if (g.__uploadTempSweep) return
  g.__uploadTempSweep = true
  void sweepUploadTempDir()
  setInterval(() => void sweepUploadTempDir(), STALE_MS).unref()
}

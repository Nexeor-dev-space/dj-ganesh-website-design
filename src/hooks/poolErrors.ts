import type { Payload } from 'payload'

type EmitterLike = { on: (event: 'error', listener: (err: Error) => void) => unknown; listenerCount: (event: 'error') => number }

/**
 * The Postgres adapter creates its `pg` Pool without an 'error' listener. When
 * the server or network drops an idle pooled connection (this server ends
 * idle sessions after 5 minutes), the Pool emits 'error', and with no listener
 * Node exits the process. Log it instead: the pool discards that connection
 * and opens a new one on the next query.
 */
export function handlePoolErrors(payload: Payload): void {
  const pool = (payload.db as unknown as { pool?: EmitterLike }).pool
  if (!pool || pool.listenerCount('error') > 0) return
  pool.on('error', (err) => {
    payload.logger.warn({ err, msg: 'Postgres pool: idle connection dropped' })
  })
}

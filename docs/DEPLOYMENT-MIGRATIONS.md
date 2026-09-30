# Database migrations & deployment

## Why the preview deploy failed

The build shipped new schema (the `ContactSubmissions` collection, the `About`
and `MusicPage` globals, and many added fields). Locally, `push: true` syncs the
schema automatically. **In production Payload ignores `push` and expects
migrations** — and this project had none. So the staging database never got the
new tables/columns, and the app crashed with:

```
column payload_locked_documents__rels.contact_submissions_id does not exist
```

## What was added

Committed migrations in `src/migrations/`:

- `20260930_105147_baseline_pre_cms` — **baseline**: the full schema as it was
  *before* this change (the state the staging DB is currently in). Used to create
  the schema on a fresh database.
- `20260930_105220_add_cms_editability` — **delta**: the additive changes this
  work introduces. Audited: **26 new tables, 46 added columns, zero drops** of
  existing tables/columns. Its `down()` rolls back only the new additions.

`payload.config.ts` now sets `migrationDir` to `src/migrations`. `push: true` is
kept for local dev only.

CLI note for this repo: the Payload CLI needs TS-stripping to load the `.ts`
config. Prefix commands with:

```
NODE_OPTIONS="--experimental-strip-types --no-warnings"
```

and set `DATABASE_URL` / `PAYLOAD_SECRET` for the target environment.

## One-time adoption of the EXISTING staging database

The staging DB already has the pre-change schema (created earlier by `push`), but
no migration history. Running `payload migrate` blindly would try to run the
baseline and collide with the existing tables. Adopt it once:

1. **Back it up first.**
   ```
   pg_dump "$STAGING_DATABASE_URL" > staging-backup-$(date +%F).sql
   ```
2. **Remove any dev-push marker** (prevents an interactive data-loss prompt in
   `payload migrate`). Safe to run; affects only the migrations bookkeeping row:
   ```sql
   DELETE FROM payload_migrations WHERE batch = -1;
   ```
3. **Mark the baseline as already applied** (the staging schema already matches
   it), so only the delta runs:
   ```sql
   INSERT INTO payload_migrations (name, batch, updated_at, created_at)
   VALUES ('20260930_105147_baseline_pre_cms', 1, now(), now());
   ```
4. **Run the migration** (applies the delta only):
   ```
   NODE_OPTIONS="--experimental-strip-types --no-warnings" \
   DATABASE_URL="$STAGING_DATABASE_URL" PAYLOAD_SECRET="$STAGING_SECRET" \
   npm run migrate
   ```
5. **Verify:**
   ```sql
   SELECT 1 FROM information_schema.columns
   WHERE table_name='payload_locked_documents_rels'
     AND column_name='contact_submissions_id';   -- expect 1 row
   ```

Redeploy — the admin and pages will load.

## Fresh databases (new environments)

No adoption needed. `npm run migrate` runs the baseline **and** the delta:

```
NODE_OPTIONS="--experimental-strip-types --no-warnings" \
DATABASE_URL="$DATABASE_URL" PAYLOAD_SECRET="$SECRET" npm run migrate
```

## Making deploys self-apply migrations (after staging is adopted)

Once staging has been adopted (above), you can have every deploy apply pending
migrations automatically. In the hosting platform's **start/release** command
(not the build step, and only after adoption to avoid a collision taking the
site down):

```
NODE_OPTIONS="--experimental-strip-types --no-warnings" npm run migrate && npm run start
```

Keep `NODE_OPTIONS` including your existing `--max-old-space-size=2048` if set.

## Future schema changes

1. Change collections/globals.
2. Generate a migration: `npm run migrate:create <name>` (with the env prefix).
3. Commit the new files in `src/migrations/`.
4. Deploy — the release step's `npm run migrate` applies it.

> ⚠️ All PR previews currently share one database (`DATABASE_URL` is a single
> host). Additive migrations are safe to share, but a destructive change from an
> unmerged branch would affect every preview. Consider a per-preview database.

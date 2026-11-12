import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" ADD COLUMN "private_clientele_private_short_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "private_clientele_weddings_short_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "gallery_strip_reel_eyebrow" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" DROP COLUMN "private_clientele_private_short_label";
  ALTER TABLE "home_page" DROP COLUMN "private_clientele_weddings_short_label";
  ALTER TABLE "home_page" DROP COLUMN "gallery_strip_reel_eyebrow";`)
}

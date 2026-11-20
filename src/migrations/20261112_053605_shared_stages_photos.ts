import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_shared_stages_international_artists" ADD COLUMN "photo_id" integer;
  ALTER TABLE "home_page_shared_stages_international_artists" ADD COLUMN "focus" varchar;
  ALTER TABLE "home_page_shared_stages_indian_artists" ADD COLUMN "photo_id" integer;
  ALTER TABLE "home_page_shared_stages_indian_artists" ADD COLUMN "focus" varchar;
  ALTER TABLE "home_page_shared_stages_international_artists" ADD CONSTRAINT "home_page_shared_stages_international_artists_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_shared_stages_indian_artists" ADD CONSTRAINT "home_page_shared_stages_indian_artists_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_shared_stages_international_artists_photo_idx" ON "home_page_shared_stages_international_artists" USING btree ("photo_id");
  CREATE INDEX "home_page_shared_stages_indian_artists_photo_idx" ON "home_page_shared_stages_indian_artists" USING btree ("photo_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_shared_stages_international_artists" DROP CONSTRAINT "home_page_shared_stages_international_artists_photo_id_media_id_fk";
  
  ALTER TABLE "home_page_shared_stages_indian_artists" DROP CONSTRAINT "home_page_shared_stages_indian_artists_photo_id_media_id_fk";
  
  DROP INDEX "home_page_shared_stages_international_artists_photo_idx";
  DROP INDEX "home_page_shared_stages_indian_artists_photo_idx";
  ALTER TABLE "home_page_shared_stages_international_artists" DROP COLUMN "photo_id";
  ALTER TABLE "home_page_shared_stages_international_artists" DROP COLUMN "focus";
  ALTER TABLE "home_page_shared_stages_indian_artists" DROP COLUMN "photo_id";
  ALTER TABLE "home_page_shared_stages_indian_artists" DROP COLUMN "focus";`)
}

import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "music_releases" ADD COLUMN "audio_file_id" integer;
  ALTER TABLE "_music_releases_v" ADD COLUMN "version_audio_file_id" integer;
  ALTER TABLE "music_releases" ADD CONSTRAINT "music_releases_audio_file_id_media_id_fk" FOREIGN KEY ("audio_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_music_releases_v" ADD CONSTRAINT "_music_releases_v_version_audio_file_id_media_id_fk" FOREIGN KEY ("version_audio_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "music_releases_audio_file_idx" ON "music_releases" USING btree ("audio_file_id");
  CREATE INDEX "_music_releases_v_version_version_audio_file_idx" ON "_music_releases_v" USING btree ("version_audio_file_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "music_releases" DROP CONSTRAINT "music_releases_audio_file_id_media_id_fk";
  
  ALTER TABLE "_music_releases_v" DROP CONSTRAINT "_music_releases_v_version_audio_file_id_media_id_fk";
  
  DROP INDEX "music_releases_audio_file_idx";
  DROP INDEX "_music_releases_v_version_version_audio_file_idx";
  ALTER TABLE "music_releases" DROP COLUMN "audio_file_id";
  ALTER TABLE "_music_releases_v" DROP COLUMN "version_audio_file_id";`)
}

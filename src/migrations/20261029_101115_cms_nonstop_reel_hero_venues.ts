import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "experiences_services_venue_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "_experiences_services_v_version_venue_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "home_page_nonstop_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_nonstop_sets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"tag" varchar,
  	"length" varchar,
  	"image_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "home_page_gallery_strip_big_shows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show" varchar NOT NULL
  );
  
  ALTER TABLE "home_page" ADD COLUMN "hero_hero_secondary_cta_text" varchar;
  ALTER TABLE "home_page" ADD COLUMN "hero_hero_secondary_cta_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "nonstop_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "nonstop_lede" varchar;
  ALTER TABLE "home_page" ADD COLUMN "nonstop_spotify_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "nonstop_podcast_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "gallery_strip_reel_video_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "gallery_strip_reel_poster_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "gallery_strip_reel_label" varchar;
  ALTER TABLE "experiences_services_venue_photos" ADD CONSTRAINT "experiences_services_venue_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences_services_venue_photos" ADD CONSTRAINT "experiences_services_venue_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experiences_services_v_version_venue_photos" ADD CONSTRAINT "_experiences_services_v_version_venue_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experiences_services_v_version_venue_photos" ADD CONSTRAINT "_experiences_services_v_version_venue_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_experiences_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_nonstop_heading" ADD CONSTRAINT "home_page_nonstop_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_nonstop_sets" ADD CONSTRAINT "home_page_nonstop_sets_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_nonstop_sets" ADD CONSTRAINT "home_page_nonstop_sets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_gallery_strip_big_shows" ADD CONSTRAINT "home_page_gallery_strip_big_shows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "experiences_services_venue_photos_order_idx" ON "experiences_services_venue_photos" USING btree ("_order");
  CREATE INDEX "experiences_services_venue_photos_parent_id_idx" ON "experiences_services_venue_photos" USING btree ("_parent_id");
  CREATE INDEX "experiences_services_venue_photos_image_idx" ON "experiences_services_venue_photos" USING btree ("image_id");
  CREATE INDEX "_experiences_services_v_version_venue_photos_order_idx" ON "_experiences_services_v_version_venue_photos" USING btree ("_order");
  CREATE INDEX "_experiences_services_v_version_venue_photos_parent_id_idx" ON "_experiences_services_v_version_venue_photos" USING btree ("_parent_id");
  CREATE INDEX "_experiences_services_v_version_venue_photos_image_idx" ON "_experiences_services_v_version_venue_photos" USING btree ("image_id");
  CREATE INDEX "home_page_nonstop_heading_order_idx" ON "home_page_nonstop_heading" USING btree ("_order");
  CREATE INDEX "home_page_nonstop_heading_parent_id_idx" ON "home_page_nonstop_heading" USING btree ("_parent_id");
  CREATE INDEX "home_page_nonstop_sets_order_idx" ON "home_page_nonstop_sets" USING btree ("_order");
  CREATE INDEX "home_page_nonstop_sets_parent_id_idx" ON "home_page_nonstop_sets" USING btree ("_parent_id");
  CREATE INDEX "home_page_nonstop_sets_image_idx" ON "home_page_nonstop_sets" USING btree ("image_id");
  CREATE INDEX "home_page_gallery_strip_big_shows_order_idx" ON "home_page_gallery_strip_big_shows" USING btree ("_order");
  CREATE INDEX "home_page_gallery_strip_big_shows_parent_id_idx" ON "home_page_gallery_strip_big_shows" USING btree ("_parent_id");
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_gallery_strip_reel_video_id_media_id_fk" FOREIGN KEY ("gallery_strip_reel_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_gallery_strip_reel_poster_id_media_id_fk" FOREIGN KEY ("gallery_strip_reel_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_gallery_strip_gallery_strip_reel_video_idx" ON "home_page" USING btree ("gallery_strip_reel_video_id");
  CREATE INDEX "home_page_gallery_strip_gallery_strip_reel_poster_idx" ON "home_page" USING btree ("gallery_strip_reel_poster_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "experiences_services_venue_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_experiences_services_v_version_venue_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_nonstop_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_nonstop_sets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_gallery_strip_big_shows" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "experiences_services_venue_photos" CASCADE;
  DROP TABLE "_experiences_services_v_version_venue_photos" CASCADE;
  DROP TABLE "home_page_nonstop_heading" CASCADE;
  DROP TABLE "home_page_nonstop_sets" CASCADE;
  DROP TABLE "home_page_gallery_strip_big_shows" CASCADE;
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_gallery_strip_reel_video_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_gallery_strip_reel_poster_id_media_id_fk";
  
  DROP INDEX "home_page_gallery_strip_gallery_strip_reel_video_idx";
  DROP INDEX "home_page_gallery_strip_gallery_strip_reel_poster_idx";
  ALTER TABLE "home_page" DROP COLUMN "hero_hero_secondary_cta_text";
  ALTER TABLE "home_page" DROP COLUMN "hero_hero_secondary_cta_url";
  ALTER TABLE "home_page" DROP COLUMN "nonstop_label";
  ALTER TABLE "home_page" DROP COLUMN "nonstop_lede";
  ALTER TABLE "home_page" DROP COLUMN "nonstop_spotify_url";
  ALTER TABLE "home_page" DROP COLUMN "nonstop_podcast_url";
  ALTER TABLE "home_page" DROP COLUMN "gallery_strip_reel_video_id";
  ALTER TABLE "home_page" DROP COLUMN "gallery_strip_reel_poster_id";
  ALTER TABLE "home_page" DROP COLUMN "gallery_strip_reel_label";`)
}

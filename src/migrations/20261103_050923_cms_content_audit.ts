import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_testimonials_section_wall_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_booking_enquiry_event_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" varchar NOT NULL
  );
  
  CREATE TABLE "music_page_labels_continue_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  ALTER TABLE "navigation" ADD COLUMN "menu_marquee_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_hint" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_cities_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_hub_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_countries_line" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_enquiry_line" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_show_card_next_show_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_show_card_tickets_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_show_card_open_date_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_show_card_no_show_text" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_show_card_no_show_lede" varchar;
  ALTER TABLE "home_page" ADD COLUMN "global_reach_show_card_enquire_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "nonstop_spotify_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "nonstop_podcast_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "booking_section_cta_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "booking_section_cta_href" varchar;
  ALTER TABLE "home_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "home_page" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "contact_booking" ADD COLUMN "enquiry_success_title" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "enquiry_success_text" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "enquiry_again_label" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "enquiry_error_text" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "direct_heading" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "direct_booking_label" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "direct_booking_note" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "direct_enquiry_label" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "direct_enquiry_note" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "direct_social_heading" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "about" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "about" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "about" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "music_page" ADD COLUMN "labels_youtube_button" varchar;
  ALTER TABLE "music_page" ADD COLUMN "labels_spotify_button" varchar;
  ALTER TABLE "music_page" ADD COLUMN "player_youtube_label" varchar;
  ALTER TABLE "music_page" ADD COLUMN "player_spotify_label" varchar;
  ALTER TABLE "music_page" ADD COLUMN "player_playlist_heading" varchar;
  ALTER TABLE "music_page" ADD COLUMN "player_archive_link_label" varchar;
  ALTER TABLE "music_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "music_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "music_page" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "privacy_policy" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "privacy_policy" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "privacy_policy" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "home_page_testimonials_section_wall_photos" ADD CONSTRAINT "home_page_testimonials_section_wall_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_testimonials_section_wall_photos" ADD CONSTRAINT "home_page_testimonials_section_wall_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_booking_enquiry_event_types" ADD CONSTRAINT "contact_booking_enquiry_event_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_booking"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "music_page_labels_continue_heading" ADD CONSTRAINT "music_page_labels_continue_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."music_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_testimonials_section_wall_photos_order_idx" ON "home_page_testimonials_section_wall_photos" USING btree ("_order");
  CREATE INDEX "home_page_testimonials_section_wall_photos_parent_id_idx" ON "home_page_testimonials_section_wall_photos" USING btree ("_parent_id");
  CREATE INDEX "home_page_testimonials_section_wall_photos_image_idx" ON "home_page_testimonials_section_wall_photos" USING btree ("image_id");
  CREATE INDEX "contact_booking_enquiry_event_types_order_idx" ON "contact_booking_enquiry_event_types" USING btree ("_order");
  CREATE INDEX "contact_booking_enquiry_event_types_parent_id_idx" ON "contact_booking_enquiry_event_types" USING btree ("_parent_id");
  CREATE INDEX "music_page_labels_continue_heading_order_idx" ON "music_page_labels_continue_heading" USING btree ("_order");
  CREATE INDEX "music_page_labels_continue_heading_parent_id_idx" ON "music_page_labels_continue_heading" USING btree ("_parent_id");
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_booking" ADD CONSTRAINT "contact_booking_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "music_page" ADD CONSTRAINT "music_page_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "privacy_policy" ADD CONSTRAINT "privacy_policy_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_seo_seo_image_idx" ON "home_page" USING btree ("seo_image_id");
  CREATE INDEX "contact_booking_seo_seo_image_idx" ON "contact_booking" USING btree ("seo_image_id");
  CREATE INDEX "about_seo_seo_image_idx" ON "about" USING btree ("seo_image_id");
  CREATE INDEX "music_page_seo_seo_image_idx" ON "music_page" USING btree ("seo_image_id");
  CREATE INDEX "privacy_policy_seo_seo_image_idx" ON "privacy_policy" USING btree ("seo_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_testimonials_section_wall_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_booking_enquiry_event_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "music_page_labels_continue_heading" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_testimonials_section_wall_photos" CASCADE;
  DROP TABLE "contact_booking_enquiry_event_types" CASCADE;
  DROP TABLE "music_page_labels_continue_heading" CASCADE;
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_seo_image_id_media_id_fk";
  
  ALTER TABLE "contact_booking" DROP CONSTRAINT "contact_booking_seo_image_id_media_id_fk";
  
  ALTER TABLE "about" DROP CONSTRAINT "about_seo_image_id_media_id_fk";
  
  ALTER TABLE "music_page" DROP CONSTRAINT "music_page_seo_image_id_media_id_fk";
  
  ALTER TABLE "privacy_policy" DROP CONSTRAINT "privacy_policy_seo_image_id_media_id_fk";
  
  DROP INDEX "home_page_seo_seo_image_idx";
  DROP INDEX "contact_booking_seo_seo_image_idx";
  DROP INDEX "about_seo_seo_image_idx";
  DROP INDEX "music_page_seo_seo_image_idx";
  DROP INDEX "privacy_policy_seo_seo_image_idx";
  ALTER TABLE "navigation" DROP COLUMN "menu_marquee_label";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_label";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_hint";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_cities_label";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_hub_label";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_countries_line";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_enquiry_line";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_show_card_next_show_label";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_show_card_tickets_label";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_show_card_open_date_label";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_show_card_no_show_text";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_show_card_no_show_lede";
  ALTER TABLE "home_page" DROP COLUMN "global_reach_show_card_enquire_label";
  ALTER TABLE "home_page" DROP COLUMN "nonstop_spotify_label";
  ALTER TABLE "home_page" DROP COLUMN "nonstop_podcast_label";
  ALTER TABLE "home_page" DROP COLUMN "booking_section_cta_label";
  ALTER TABLE "home_page" DROP COLUMN "booking_section_cta_href";
  ALTER TABLE "home_page" DROP COLUMN "seo_title";
  ALTER TABLE "home_page" DROP COLUMN "seo_description";
  ALTER TABLE "home_page" DROP COLUMN "seo_image_id";
  ALTER TABLE "contact_booking" DROP COLUMN "enquiry_success_title";
  ALTER TABLE "contact_booking" DROP COLUMN "enquiry_success_text";
  ALTER TABLE "contact_booking" DROP COLUMN "enquiry_again_label";
  ALTER TABLE "contact_booking" DROP COLUMN "enquiry_error_text";
  ALTER TABLE "contact_booking" DROP COLUMN "direct_heading";
  ALTER TABLE "contact_booking" DROP COLUMN "direct_booking_label";
  ALTER TABLE "contact_booking" DROP COLUMN "direct_booking_note";
  ALTER TABLE "contact_booking" DROP COLUMN "direct_enquiry_label";
  ALTER TABLE "contact_booking" DROP COLUMN "direct_enquiry_note";
  ALTER TABLE "contact_booking" DROP COLUMN "direct_social_heading";
  ALTER TABLE "contact_booking" DROP COLUMN "seo_title";
  ALTER TABLE "contact_booking" DROP COLUMN "seo_description";
  ALTER TABLE "contact_booking" DROP COLUMN "seo_image_id";
  ALTER TABLE "about" DROP COLUMN "seo_title";
  ALTER TABLE "about" DROP COLUMN "seo_description";
  ALTER TABLE "about" DROP COLUMN "seo_image_id";
  ALTER TABLE "music_page" DROP COLUMN "labels_youtube_button";
  ALTER TABLE "music_page" DROP COLUMN "labels_spotify_button";
  ALTER TABLE "music_page" DROP COLUMN "player_youtube_label";
  ALTER TABLE "music_page" DROP COLUMN "player_spotify_label";
  ALTER TABLE "music_page" DROP COLUMN "player_playlist_heading";
  ALTER TABLE "music_page" DROP COLUMN "player_archive_link_label";
  ALTER TABLE "music_page" DROP COLUMN "seo_title";
  ALTER TABLE "music_page" DROP COLUMN "seo_description";
  ALTER TABLE "music_page" DROP COLUMN "seo_image_id";
  ALTER TABLE "privacy_policy" DROP COLUMN "seo_title";
  ALTER TABLE "privacy_policy" DROP COLUMN "seo_description";
  ALTER TABLE "privacy_policy" DROP COLUMN "seo_image_id";`)
}

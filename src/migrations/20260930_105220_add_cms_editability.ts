import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM('new', 'read', 'responded');
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"event_type" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_submissions_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"external" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_statement_plate_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_stages_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_stages_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "home_page_trusted_by_names" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_gallery_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "home_page_follow_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"caption" varchar,
  	"href" varchar NOT NULL,
  	"icon" varchar,
  	"external" boolean DEFAULT false
  );
  
  CREATE TABLE "home_page_booking_section_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_booking_section_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_booking_section_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar,
  	"href" varchar NOT NULL,
  	"external" boolean DEFAULT false,
  	"icon" varchar
  );
  
  CREATE TABLE "home_page_legacy_section_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_testimonials_section_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_experience_section_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "contact_booking_contact_meta_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "contact_booking_final_cta_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "contact_booking_call_band_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "contact_booking_call_band_agencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "about_story_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "about_story_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paragraph" varchar NOT NULL
  );
  
  CREATE TABLE "about_sound_strands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"strand" varchar NOT NULL
  );
  
  CREATE TABLE "about_career_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"labels_intro" varchar,
  	"labels_story" varchar,
  	"labels_identity" varchar,
  	"labels_experience" varchar,
  	"labels_section_label" varchar,
  	"story_statement" varchar,
  	"story_career_start" varchar,
  	"frames_stage_id" integer,
  	"frames_portrait_id" integer,
  	"frames_decks_id" integer,
  	"portrait_id" integer,
  	"experience_preview_experience_href" varchar,
  	"experience_preview_booking_href" varchar,
  	"outro_question" varchar,
  	"outro_cta" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"legacy_milestones_id" integer
  );
  
  CREATE TABLE "music_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_title" varchar,
  	"statement" varchar,
  	"labels_intro" varchar,
  	"labels_archive" varchar,
  	"labels_continue" varchar,
  	"home_section_section_label" varchar,
  	"home_section_heading" varchar,
  	"home_section_all_releases_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "legacy_milestones" ADD COLUMN "slug" varchar;
  ALTER TABLE "legacy_milestones" ADD COLUMN "more" varchar;
  ALTER TABLE "_legacy_milestones_v" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "_legacy_milestones_v" ADD COLUMN "version_more" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_submissions_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "footer_statement" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "footer_copyright" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "footer_contact_email" varchar;
  ALTER TABLE "home_page_statistics_stats" ADD COLUMN "suffix" varchar;
  ALTER TABLE "home_page_global_reach_locations" ADD COLUMN "label_dx" numeric;
  ALTER TABLE "home_page_global_reach_locations" ADD COLUMN "label_dy" numeric;
  ALTER TABLE "home_page_global_reach_locations" ADD COLUMN "hub" boolean DEFAULT false;
  ALTER TABLE "home_page" ADD COLUMN "hero_hero_video_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "hero_hero_video_poster_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "statement_plate_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "statement_plate_spoken" boolean DEFAULT false;
  ALTER TABLE "home_page" ADD COLUMN "statement_plate_name" varchar;
  ALTER TABLE "home_page" ADD COLUMN "statement_plate_note" varchar;
  ALTER TABLE "home_page" ADD COLUMN "stages_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "stages_lede" varchar;
  ALTER TABLE "home_page" ADD COLUMN "stages_cta_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "stages_cta_href" varchar;
  ALTER TABLE "home_page" ADD COLUMN "trusted_by_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "gallery_strip_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "follow_heading" varchar;
  ALTER TABLE "home_page" ADD COLUMN "booking_section_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "booking_section_lede" varchar;
  ALTER TABLE "home_page" ADD COLUMN "legacy_section_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "testimonials_section_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "experience_section_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "experience_section_cta_href" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "whatsapp_whatsapp_number" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "whatsapp_whatsapp_label" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "whatsapp_whatsapp_message" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "contact_meta_eyebrow" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "contact_meta_lede" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "enquiry_heading" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "enquiry_lede" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "enquiry_submit_label" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "booking_info_block_heading" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "booking_info_block_copy" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "final_cta_lede" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "final_cta_label" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "final_cta_href" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "call_band_lede" varchar;
  ALTER TABLE "contact_booking" ADD COLUMN "call_band_cta_label" varchar;
  ALTER TABLE "site_settings_footer_columns_links" ADD CONSTRAINT "site_settings_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_columns" ADD CONSTRAINT "site_settings_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_statement_plate_lines" ADD CONSTRAINT "home_page_statement_plate_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_stages_heading" ADD CONSTRAINT "home_page_stages_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_stages_stages" ADD CONSTRAINT "home_page_stages_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_trusted_by_names" ADD CONSTRAINT "home_page_trusted_by_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_gallery_strip_items" ADD CONSTRAINT "home_page_gallery_strip_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_gallery_strip_items" ADD CONSTRAINT "home_page_gallery_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_follow_links" ADD CONSTRAINT "home_page_follow_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_booking_section_heading" ADD CONSTRAINT "home_page_booking_section_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_booking_section_scope" ADD CONSTRAINT "home_page_booking_section_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_booking_section_links" ADD CONSTRAINT "home_page_booking_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_legacy_section_heading" ADD CONSTRAINT "home_page_legacy_section_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_testimonials_section_heading" ADD CONSTRAINT "home_page_testimonials_section_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_experience_section_heading" ADD CONSTRAINT "home_page_experience_section_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_booking_contact_meta_heading" ADD CONSTRAINT "contact_booking_contact_meta_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_booking"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_booking_final_cta_heading" ADD CONSTRAINT "contact_booking_final_cta_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_booking"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_booking_call_band_heading" ADD CONSTRAINT "contact_booking_call_band_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_booking"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_booking_call_band_agencies" ADD CONSTRAINT "contact_booking_call_band_agencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_booking"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_story_heading" ADD CONSTRAINT "about_story_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_story_paragraphs" ADD CONSTRAINT "about_story_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_sound_strands" ADD CONSTRAINT "about_sound_strands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_career_stats_stats" ADD CONSTRAINT "about_career_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_frames_stage_id_media_id_fk" FOREIGN KEY ("frames_stage_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_frames_portrait_id_media_id_fk" FOREIGN KEY ("frames_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_frames_decks_id_media_id_fk" FOREIGN KEY ("frames_decks_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_rels" ADD CONSTRAINT "about_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_rels" ADD CONSTRAINT "about_rels_legacy_milestones_fk" FOREIGN KEY ("legacy_milestones_id") REFERENCES "public"."legacy_milestones"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX "site_settings_footer_columns_links_order_idx" ON "site_settings_footer_columns_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_columns_links_parent_id_idx" ON "site_settings_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_columns_order_idx" ON "site_settings_footer_columns" USING btree ("_order");
  CREATE INDEX "site_settings_footer_columns_parent_id_idx" ON "site_settings_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "home_page_statement_plate_lines_order_idx" ON "home_page_statement_plate_lines" USING btree ("_order");
  CREATE INDEX "home_page_statement_plate_lines_parent_id_idx" ON "home_page_statement_plate_lines" USING btree ("_parent_id");
  CREATE INDEX "home_page_stages_heading_order_idx" ON "home_page_stages_heading" USING btree ("_order");
  CREATE INDEX "home_page_stages_heading_parent_id_idx" ON "home_page_stages_heading" USING btree ("_parent_id");
  CREATE INDEX "home_page_stages_stages_order_idx" ON "home_page_stages_stages" USING btree ("_order");
  CREATE INDEX "home_page_stages_stages_parent_id_idx" ON "home_page_stages_stages" USING btree ("_parent_id");
  CREATE INDEX "home_page_trusted_by_names_order_idx" ON "home_page_trusted_by_names" USING btree ("_order");
  CREATE INDEX "home_page_trusted_by_names_parent_id_idx" ON "home_page_trusted_by_names" USING btree ("_parent_id");
  CREATE INDEX "home_page_gallery_strip_items_order_idx" ON "home_page_gallery_strip_items" USING btree ("_order");
  CREATE INDEX "home_page_gallery_strip_items_parent_id_idx" ON "home_page_gallery_strip_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_gallery_strip_items_image_idx" ON "home_page_gallery_strip_items" USING btree ("image_id");
  CREATE INDEX "home_page_follow_links_order_idx" ON "home_page_follow_links" USING btree ("_order");
  CREATE INDEX "home_page_follow_links_parent_id_idx" ON "home_page_follow_links" USING btree ("_parent_id");
  CREATE INDEX "home_page_booking_section_heading_order_idx" ON "home_page_booking_section_heading" USING btree ("_order");
  CREATE INDEX "home_page_booking_section_heading_parent_id_idx" ON "home_page_booking_section_heading" USING btree ("_parent_id");
  CREATE INDEX "home_page_booking_section_scope_order_idx" ON "home_page_booking_section_scope" USING btree ("_order");
  CREATE INDEX "home_page_booking_section_scope_parent_id_idx" ON "home_page_booking_section_scope" USING btree ("_parent_id");
  CREATE INDEX "home_page_booking_section_links_order_idx" ON "home_page_booking_section_links" USING btree ("_order");
  CREATE INDEX "home_page_booking_section_links_parent_id_idx" ON "home_page_booking_section_links" USING btree ("_parent_id");
  CREATE INDEX "home_page_legacy_section_heading_order_idx" ON "home_page_legacy_section_heading" USING btree ("_order");
  CREATE INDEX "home_page_legacy_section_heading_parent_id_idx" ON "home_page_legacy_section_heading" USING btree ("_parent_id");
  CREATE INDEX "home_page_testimonials_section_heading_order_idx" ON "home_page_testimonials_section_heading" USING btree ("_order");
  CREATE INDEX "home_page_testimonials_section_heading_parent_id_idx" ON "home_page_testimonials_section_heading" USING btree ("_parent_id");
  CREATE INDEX "home_page_experience_section_heading_order_idx" ON "home_page_experience_section_heading" USING btree ("_order");
  CREATE INDEX "home_page_experience_section_heading_parent_id_idx" ON "home_page_experience_section_heading" USING btree ("_parent_id");
  CREATE INDEX "contact_booking_contact_meta_heading_order_idx" ON "contact_booking_contact_meta_heading" USING btree ("_order");
  CREATE INDEX "contact_booking_contact_meta_heading_parent_id_idx" ON "contact_booking_contact_meta_heading" USING btree ("_parent_id");
  CREATE INDEX "contact_booking_final_cta_heading_order_idx" ON "contact_booking_final_cta_heading" USING btree ("_order");
  CREATE INDEX "contact_booking_final_cta_heading_parent_id_idx" ON "contact_booking_final_cta_heading" USING btree ("_parent_id");
  CREATE INDEX "contact_booking_call_band_heading_order_idx" ON "contact_booking_call_band_heading" USING btree ("_order");
  CREATE INDEX "contact_booking_call_band_heading_parent_id_idx" ON "contact_booking_call_band_heading" USING btree ("_parent_id");
  CREATE INDEX "contact_booking_call_band_agencies_order_idx" ON "contact_booking_call_band_agencies" USING btree ("_order");
  CREATE INDEX "contact_booking_call_band_agencies_parent_id_idx" ON "contact_booking_call_band_agencies" USING btree ("_parent_id");
  CREATE INDEX "about_story_heading_order_idx" ON "about_story_heading" USING btree ("_order");
  CREATE INDEX "about_story_heading_parent_id_idx" ON "about_story_heading" USING btree ("_parent_id");
  CREATE INDEX "about_story_paragraphs_order_idx" ON "about_story_paragraphs" USING btree ("_order");
  CREATE INDEX "about_story_paragraphs_parent_id_idx" ON "about_story_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_sound_strands_order_idx" ON "about_sound_strands" USING btree ("_order");
  CREATE INDEX "about_sound_strands_parent_id_idx" ON "about_sound_strands" USING btree ("_parent_id");
  CREATE INDEX "about_career_stats_stats_order_idx" ON "about_career_stats_stats" USING btree ("_order");
  CREATE INDEX "about_career_stats_stats_parent_id_idx" ON "about_career_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "about_frames_frames_stage_idx" ON "about" USING btree ("frames_stage_id");
  CREATE INDEX "about_frames_frames_portrait_idx" ON "about" USING btree ("frames_portrait_id");
  CREATE INDEX "about_frames_frames_decks_idx" ON "about" USING btree ("frames_decks_id");
  CREATE INDEX "about_portrait_idx" ON "about" USING btree ("portrait_id");
  CREATE INDEX "about_rels_order_idx" ON "about_rels" USING btree ("order");
  CREATE INDEX "about_rels_parent_idx" ON "about_rels" USING btree ("parent_id");
  CREATE INDEX "about_rels_path_idx" ON "about_rels" USING btree ("path");
  CREATE INDEX "about_rels_legacy_milestones_id_idx" ON "about_rels" USING btree ("legacy_milestones_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_hero_video_id_media_id_fk" FOREIGN KEY ("hero_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_hero_video_poster_id_media_id_fk" FOREIGN KEY ("hero_hero_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "legacy_milestones_slug_idx" ON "legacy_milestones" USING btree ("slug");
  CREATE INDEX "_legacy_milestones_v_version_version_slug_idx" ON "_legacy_milestones_v" USING btree ("version_slug");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "home_page_hero_hero_hero_video_idx" ON "home_page" USING btree ("hero_hero_video_id");
  CREATE INDEX "home_page_hero_hero_hero_video_poster_idx" ON "home_page" USING btree ("hero_hero_video_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_footer_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_statement_plate_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_stages_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_stages_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_trusted_by_names" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_gallery_strip_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_follow_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_booking_section_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_booking_section_scope" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_booking_section_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_legacy_section_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_testimonials_section_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_experience_section_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_booking_contact_meta_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_booking_final_cta_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_booking_call_band_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_booking_call_band_agencies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_story_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_story_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_sound_strands" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_career_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "music_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "site_settings_footer_columns_links" CASCADE;
  DROP TABLE "site_settings_footer_columns" CASCADE;
  DROP TABLE "home_page_statement_plate_lines" CASCADE;
  DROP TABLE "home_page_stages_heading" CASCADE;
  DROP TABLE "home_page_stages_stages" CASCADE;
  DROP TABLE "home_page_trusted_by_names" CASCADE;
  DROP TABLE "home_page_gallery_strip_items" CASCADE;
  DROP TABLE "home_page_follow_links" CASCADE;
  DROP TABLE "home_page_booking_section_heading" CASCADE;
  DROP TABLE "home_page_booking_section_scope" CASCADE;
  DROP TABLE "home_page_booking_section_links" CASCADE;
  DROP TABLE "home_page_legacy_section_heading" CASCADE;
  DROP TABLE "home_page_testimonials_section_heading" CASCADE;
  DROP TABLE "home_page_experience_section_heading" CASCADE;
  DROP TABLE "contact_booking_contact_meta_heading" CASCADE;
  DROP TABLE "contact_booking_final_cta_heading" CASCADE;
  DROP TABLE "contact_booking_call_band_heading" CASCADE;
  DROP TABLE "contact_booking_call_band_agencies" CASCADE;
  DROP TABLE "about_story_heading" CASCADE;
  DROP TABLE "about_story_paragraphs" CASCADE;
  DROP TABLE "about_sound_strands" CASCADE;
  DROP TABLE "about_career_stats_stats" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "about_rels" CASCADE;
  DROP TABLE "music_page" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_hero_hero_video_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_hero_hero_video_poster_id_media_id_fk";
  
  DROP INDEX "legacy_milestones_slug_idx";
  DROP INDEX "_legacy_milestones_v_version_version_slug_idx";
  DROP INDEX "payload_locked_documents_rels_contact_submissions_id_idx";
  DROP INDEX "home_page_hero_hero_hero_video_idx";
  DROP INDEX "home_page_hero_hero_hero_video_poster_idx";
  ALTER TABLE "legacy_milestones" DROP COLUMN "slug";
  ALTER TABLE "legacy_milestones" DROP COLUMN "more";
  ALTER TABLE "_legacy_milestones_v" DROP COLUMN "version_slug";
  ALTER TABLE "_legacy_milestones_v" DROP COLUMN "version_more";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_submissions_id";
  ALTER TABLE "site_settings" DROP COLUMN "footer_statement";
  ALTER TABLE "site_settings" DROP COLUMN "footer_copyright";
  ALTER TABLE "site_settings" DROP COLUMN "footer_contact_email";
  ALTER TABLE "home_page_statistics_stats" DROP COLUMN "suffix";
  ALTER TABLE "home_page_global_reach_locations" DROP COLUMN "label_dx";
  ALTER TABLE "home_page_global_reach_locations" DROP COLUMN "label_dy";
  ALTER TABLE "home_page_global_reach_locations" DROP COLUMN "hub";
  ALTER TABLE "home_page" DROP COLUMN "hero_hero_video_id";
  ALTER TABLE "home_page" DROP COLUMN "hero_hero_video_poster_id";
  ALTER TABLE "home_page" DROP COLUMN "statement_plate_label";
  ALTER TABLE "home_page" DROP COLUMN "statement_plate_spoken";
  ALTER TABLE "home_page" DROP COLUMN "statement_plate_name";
  ALTER TABLE "home_page" DROP COLUMN "statement_plate_note";
  ALTER TABLE "home_page" DROP COLUMN "stages_label";
  ALTER TABLE "home_page" DROP COLUMN "stages_lede";
  ALTER TABLE "home_page" DROP COLUMN "stages_cta_label";
  ALTER TABLE "home_page" DROP COLUMN "stages_cta_href";
  ALTER TABLE "home_page" DROP COLUMN "trusted_by_label";
  ALTER TABLE "home_page" DROP COLUMN "gallery_strip_label";
  ALTER TABLE "home_page" DROP COLUMN "follow_heading";
  ALTER TABLE "home_page" DROP COLUMN "booking_section_label";
  ALTER TABLE "home_page" DROP COLUMN "booking_section_lede";
  ALTER TABLE "home_page" DROP COLUMN "legacy_section_label";
  ALTER TABLE "home_page" DROP COLUMN "testimonials_section_label";
  ALTER TABLE "home_page" DROP COLUMN "experience_section_label";
  ALTER TABLE "home_page" DROP COLUMN "experience_section_cta_href";
  ALTER TABLE "contact_booking" DROP COLUMN "whatsapp_whatsapp_number";
  ALTER TABLE "contact_booking" DROP COLUMN "whatsapp_whatsapp_label";
  ALTER TABLE "contact_booking" DROP COLUMN "whatsapp_whatsapp_message";
  ALTER TABLE "contact_booking" DROP COLUMN "contact_meta_eyebrow";
  ALTER TABLE "contact_booking" DROP COLUMN "contact_meta_lede";
  ALTER TABLE "contact_booking" DROP COLUMN "enquiry_heading";
  ALTER TABLE "contact_booking" DROP COLUMN "enquiry_lede";
  ALTER TABLE "contact_booking" DROP COLUMN "enquiry_submit_label";
  ALTER TABLE "contact_booking" DROP COLUMN "booking_info_block_heading";
  ALTER TABLE "contact_booking" DROP COLUMN "booking_info_block_copy";
  ALTER TABLE "contact_booking" DROP COLUMN "final_cta_lede";
  ALTER TABLE "contact_booking" DROP COLUMN "final_cta_label";
  ALTER TABLE "contact_booking" DROP COLUMN "final_cta_href";
  ALTER TABLE "contact_booking" DROP COLUMN "call_band_lede";
  ALTER TABLE "contact_booking" DROP COLUMN "call_band_cta_label";
  DROP TYPE "public"."enum_contact_submissions_status";`)
}

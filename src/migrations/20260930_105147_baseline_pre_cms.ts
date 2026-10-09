import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_upcoming_shows_show_status" AS ENUM('upcoming', 'past', 'cancelled');
  CREATE TYPE "public"."enum_upcoming_shows_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__upcoming_shows_v_version_show_status" AS ENUM('upcoming', 'past', 'cancelled');
  CREATE TYPE "public"."enum__upcoming_shows_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_music_releases_genre" AS ENUM('indo-tech', 'afro-house', 'afro-mashup', 'bollyafro', 'other');
  CREATE TYPE "public"."enum_music_releases_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__music_releases_v_version_genre" AS ENUM('indo-tech', 'afro-house', 'afro-mashup', 'bollyafro', 'other');
  CREATE TYPE "public"."enum__music_releases_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_performance_history_category" AS ENUM('india', 'middle-east', 'europe', 'north-america', 'southeast-asia', 'other');
  CREATE TYPE "public"."enum_gallery_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__gallery_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_legacy_milestones_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legacy_milestones_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_experiences_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__experiences_services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('instagram', 'facebook', 'youtube', 'twitter', 'soundcloud', 'spotify', 'tiktok', 'other');
  CREATE TYPE "public"."enum_contact_booking_social_links_platform" AS ENUM('instagram', 'facebook', 'youtube', 'twitter', 'whatsapp', 'other');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "upcoming_shows" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"date" timestamp(3) with time zone,
  	"time" varchar,
  	"city" varchar,
  	"country" varchar,
  	"venue" varchar,
  	"poster_id" integer,
  	"ticket_url" varchar,
  	"show_status" "enum_upcoming_shows_show_status" DEFAULT 'upcoming',
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_upcoming_shows_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_upcoming_shows_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_time" varchar,
  	"version_city" varchar,
  	"version_country" varchar,
  	"version_venue" varchar,
  	"version_poster_id" integer,
  	"version_ticket_url" varchar,
  	"version_show_status" "enum__upcoming_shows_v_version_show_status" DEFAULT 'upcoming',
  	"version_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__upcoming_shows_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "music_releases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"genre" "enum_music_releases_genre",
  	"artist" varchar,
  	"artwork_id" integer,
  	"youtube_url" varchar,
  	"audio_url" varchar,
  	"release_date" timestamp(3) with time zone,
  	"description" varchar,
  	"featured" boolean DEFAULT false,
  	"published_status" boolean DEFAULT false,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_music_releases_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_music_releases_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_genre" "enum__music_releases_v_version_genre",
  	"version_artist" varchar,
  	"version_artwork_id" integer,
  	"version_youtube_url" varchar,
  	"version_audio_url" varchar,
  	"version_release_date" timestamp(3) with time zone,
  	"version_description" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_published_status" boolean DEFAULT false,
  	"version_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__music_releases_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "performance_history" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"venue" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"category" "enum_performance_history_category",
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"album" varchar,
  	"order" numeric,
  	"published_status" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_gallery_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_gallery_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_gallery_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_album" varchar,
  	"version_order" numeric,
  	"version_published_status" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__gallery_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "legacy_milestones" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"order" numeric,
  	"published_status" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_legacy_milestones_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_legacy_milestones_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_year" numeric,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_order" numeric,
  	"version_published_status" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__legacy_milestones_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"testimonial" varchar,
  	"event_type" varchar,
  	"location" varchar,
  	"image_id" integer,
  	"order" numeric,
  	"published_status" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_testimonial" varchar,
  	"version_event_type" varchar,
  	"version_location" varchar,
  	"version_image_id" integer,
  	"version_order" numeric,
  	"version_published_status" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "experiences_services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "experiences_services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"short_description" varchar,
  	"detailed_description" varchar,
  	"image_id" integer,
  	"cta_text" varchar,
  	"cta_url" varchar,
  	"order" numeric,
  	"published_status" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_experiences_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_experiences_services_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_experiences_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_short_description" varchar,
  	"version_detailed_description" varchar,
  	"version_image_id" integer,
  	"version_cta_text" varchar,
  	"version_cta_url" varchar,
  	"version_order" numeric,
  	"version_published_status" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__experiences_services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"upcoming_shows_id" integer,
  	"music_releases_id" integer,
  	"performance_history_id" integer,
  	"gallery_id" integer,
  	"legacy_milestones_id" integer,
  	"testimonials_id" integer,
  	"experiences_services_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"seo_default_seo_title" varchar,
  	"seo_default_seo_description" varchar,
  	"contact_contact_email" varchar,
  	"contact_phone" varchar,
  	"booking_info" varchar,
  	"footer_content" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"is_external" boolean DEFAULT false,
  	"order" numeric,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_statistics_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_global_reach_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"lat" numeric,
  	"lng" numeric
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_hero_heading" varchar,
  	"hero_hero_subheading" varchar,
  	"hero_hero_image_id" integer,
  	"hero_hero_cta_text" varchar,
  	"hero_hero_cta_url" varchar,
  	"artist_intro_intro_title" varchar,
  	"artist_intro_intro_bio" varchar,
  	"artist_intro_intro_image_id" integer,
  	"global_reach_heading" varchar,
  	"featured_shows_heading" varchar,
  	"featured_music_heading" varchar,
  	"booking_cta_heading" varchar,
  	"booking_cta_subheading" varchar,
  	"booking_cta_cta_text" varchar,
  	"booking_cta_cta_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"upcoming_shows_id" integer,
  	"music_releases_id" integer
  );
  
  CREATE TABLE "contact_booking_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_contact_booking_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "contact_booking" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"booking_email" varchar NOT NULL,
  	"enquiry_email" varchar,
  	"phone" varchar,
  	"agency_agency_name" varchar,
  	"agency_agency_email" varchar,
  	"agency_agency_phone" varchar,
  	"agency_agency_website" varchar,
  	"booking_cta_text" varchar,
  	"booking_cta_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "upcoming_shows" ADD CONSTRAINT "upcoming_shows_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_upcoming_shows_v" ADD CONSTRAINT "_upcoming_shows_v_parent_id_upcoming_shows_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."upcoming_shows"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_upcoming_shows_v" ADD CONSTRAINT "_upcoming_shows_v_version_poster_id_media_id_fk" FOREIGN KEY ("version_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "music_releases" ADD CONSTRAINT "music_releases_artwork_id_media_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_music_releases_v" ADD CONSTRAINT "_music_releases_v_parent_id_music_releases_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."music_releases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_music_releases_v" ADD CONSTRAINT "_music_releases_v_version_artwork_id_media_id_fk" FOREIGN KEY ("version_artwork_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "performance_history" ADD CONSTRAINT "performance_history_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_gallery_v_version_images" ADD CONSTRAINT "_gallery_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_v_version_images" ADD CONSTRAINT "_gallery_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_gallery_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_gallery_v" ADD CONSTRAINT "_gallery_v_parent_id_gallery_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gallery"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legacy_milestones" ADD CONSTRAINT "legacy_milestones_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legacy_milestones_v" ADD CONSTRAINT "_legacy_milestones_v_parent_id_legacy_milestones_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legacy_milestones"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legacy_milestones_v" ADD CONSTRAINT "_legacy_milestones_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences_services_features" ADD CONSTRAINT "experiences_services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_services" ADD CONSTRAINT "experiences_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experiences_services_v_version_features" ADD CONSTRAINT "_experiences_services_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_experiences_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experiences_services_v" ADD CONSTRAINT "_experiences_services_v_parent_id_experiences_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experiences_services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experiences_services_v" ADD CONSTRAINT "_experiences_services_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_upcoming_shows_fk" FOREIGN KEY ("upcoming_shows_id") REFERENCES "public"."upcoming_shows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_music_releases_fk" FOREIGN KEY ("music_releases_id") REFERENCES "public"."music_releases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_performance_history_fk" FOREIGN KEY ("performance_history_id") REFERENCES "public"."performance_history"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legacy_milestones_fk" FOREIGN KEY ("legacy_milestones_id") REFERENCES "public"."legacy_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experiences_services_fk" FOREIGN KEY ("experiences_services_id") REFERENCES "public"."experiences_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_statistics_stats" ADD CONSTRAINT "home_page_statistics_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_global_reach_locations" ADD CONSTRAINT "home_page_global_reach_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_artist_intro_intro_image_id_media_id_fk" FOREIGN KEY ("artist_intro_intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_upcoming_shows_fk" FOREIGN KEY ("upcoming_shows_id") REFERENCES "public"."upcoming_shows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_music_releases_fk" FOREIGN KEY ("music_releases_id") REFERENCES "public"."music_releases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_booking_social_links" ADD CONSTRAINT "contact_booking_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_booking"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "upcoming_shows_poster_idx" ON "upcoming_shows" USING btree ("poster_id");
  CREATE INDEX "upcoming_shows_updated_at_idx" ON "upcoming_shows" USING btree ("updated_at");
  CREATE INDEX "upcoming_shows_created_at_idx" ON "upcoming_shows" USING btree ("created_at");
  CREATE INDEX "upcoming_shows__status_idx" ON "upcoming_shows" USING btree ("_status");
  CREATE INDEX "_upcoming_shows_v_parent_idx" ON "_upcoming_shows_v" USING btree ("parent_id");
  CREATE INDEX "_upcoming_shows_v_version_version_poster_idx" ON "_upcoming_shows_v" USING btree ("version_poster_id");
  CREATE INDEX "_upcoming_shows_v_version_version_updated_at_idx" ON "_upcoming_shows_v" USING btree ("version_updated_at");
  CREATE INDEX "_upcoming_shows_v_version_version_created_at_idx" ON "_upcoming_shows_v" USING btree ("version_created_at");
  CREATE INDEX "_upcoming_shows_v_version_version__status_idx" ON "_upcoming_shows_v" USING btree ("version__status");
  CREATE INDEX "_upcoming_shows_v_created_at_idx" ON "_upcoming_shows_v" USING btree ("created_at");
  CREATE INDEX "_upcoming_shows_v_updated_at_idx" ON "_upcoming_shows_v" USING btree ("updated_at");
  CREATE INDEX "_upcoming_shows_v_latest_idx" ON "_upcoming_shows_v" USING btree ("latest");
  CREATE INDEX "music_releases_artwork_idx" ON "music_releases" USING btree ("artwork_id");
  CREATE INDEX "music_releases_updated_at_idx" ON "music_releases" USING btree ("updated_at");
  CREATE INDEX "music_releases_created_at_idx" ON "music_releases" USING btree ("created_at");
  CREATE INDEX "music_releases__status_idx" ON "music_releases" USING btree ("_status");
  CREATE INDEX "_music_releases_v_parent_idx" ON "_music_releases_v" USING btree ("parent_id");
  CREATE INDEX "_music_releases_v_version_version_artwork_idx" ON "_music_releases_v" USING btree ("version_artwork_id");
  CREATE INDEX "_music_releases_v_version_version_updated_at_idx" ON "_music_releases_v" USING btree ("version_updated_at");
  CREATE INDEX "_music_releases_v_version_version_created_at_idx" ON "_music_releases_v" USING btree ("version_created_at");
  CREATE INDEX "_music_releases_v_version_version__status_idx" ON "_music_releases_v" USING btree ("version__status");
  CREATE INDEX "_music_releases_v_created_at_idx" ON "_music_releases_v" USING btree ("created_at");
  CREATE INDEX "_music_releases_v_updated_at_idx" ON "_music_releases_v" USING btree ("updated_at");
  CREATE INDEX "_music_releases_v_latest_idx" ON "_music_releases_v" USING btree ("latest");
  CREATE INDEX "performance_history_image_idx" ON "performance_history" USING btree ("image_id");
  CREATE INDEX "performance_history_updated_at_idx" ON "performance_history" USING btree ("updated_at");
  CREATE INDEX "performance_history_created_at_idx" ON "performance_history" USING btree ("created_at");
  CREATE INDEX "gallery_images_order_idx" ON "gallery_images" USING btree ("_order");
  CREATE INDEX "gallery_images_parent_id_idx" ON "gallery_images" USING btree ("_parent_id");
  CREATE INDEX "gallery_images_image_idx" ON "gallery_images" USING btree ("image_id");
  CREATE INDEX "gallery_updated_at_idx" ON "gallery" USING btree ("updated_at");
  CREATE INDEX "gallery_created_at_idx" ON "gallery" USING btree ("created_at");
  CREATE INDEX "gallery__status_idx" ON "gallery" USING btree ("_status");
  CREATE INDEX "_gallery_v_version_images_order_idx" ON "_gallery_v_version_images" USING btree ("_order");
  CREATE INDEX "_gallery_v_version_images_parent_id_idx" ON "_gallery_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_gallery_v_version_images_image_idx" ON "_gallery_v_version_images" USING btree ("image_id");
  CREATE INDEX "_gallery_v_parent_idx" ON "_gallery_v" USING btree ("parent_id");
  CREATE INDEX "_gallery_v_version_version_updated_at_idx" ON "_gallery_v" USING btree ("version_updated_at");
  CREATE INDEX "_gallery_v_version_version_created_at_idx" ON "_gallery_v" USING btree ("version_created_at");
  CREATE INDEX "_gallery_v_version_version__status_idx" ON "_gallery_v" USING btree ("version__status");
  CREATE INDEX "_gallery_v_created_at_idx" ON "_gallery_v" USING btree ("created_at");
  CREATE INDEX "_gallery_v_updated_at_idx" ON "_gallery_v" USING btree ("updated_at");
  CREATE INDEX "_gallery_v_latest_idx" ON "_gallery_v" USING btree ("latest");
  CREATE INDEX "legacy_milestones_image_idx" ON "legacy_milestones" USING btree ("image_id");
  CREATE INDEX "legacy_milestones_updated_at_idx" ON "legacy_milestones" USING btree ("updated_at");
  CREATE INDEX "legacy_milestones_created_at_idx" ON "legacy_milestones" USING btree ("created_at");
  CREATE INDEX "legacy_milestones__status_idx" ON "legacy_milestones" USING btree ("_status");
  CREATE INDEX "_legacy_milestones_v_parent_idx" ON "_legacy_milestones_v" USING btree ("parent_id");
  CREATE INDEX "_legacy_milestones_v_version_version_image_idx" ON "_legacy_milestones_v" USING btree ("version_image_id");
  CREATE INDEX "_legacy_milestones_v_version_version_updated_at_idx" ON "_legacy_milestones_v" USING btree ("version_updated_at");
  CREATE INDEX "_legacy_milestones_v_version_version_created_at_idx" ON "_legacy_milestones_v" USING btree ("version_created_at");
  CREATE INDEX "_legacy_milestones_v_version_version__status_idx" ON "_legacy_milestones_v" USING btree ("version__status");
  CREATE INDEX "_legacy_milestones_v_created_at_idx" ON "_legacy_milestones_v" USING btree ("created_at");
  CREATE INDEX "_legacy_milestones_v_updated_at_idx" ON "_legacy_milestones_v" USING btree ("updated_at");
  CREATE INDEX "_legacy_milestones_v_latest_idx" ON "_legacy_milestones_v" USING btree ("latest");
  CREATE INDEX "testimonials_image_idx" ON "testimonials" USING btree ("image_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_image_idx" ON "_testimonials_v" USING btree ("version_image_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "experiences_services_features_order_idx" ON "experiences_services_features" USING btree ("_order");
  CREATE INDEX "experiences_services_features_parent_id_idx" ON "experiences_services_features" USING btree ("_parent_id");
  CREATE INDEX "experiences_services_image_idx" ON "experiences_services" USING btree ("image_id");
  CREATE INDEX "experiences_services_updated_at_idx" ON "experiences_services" USING btree ("updated_at");
  CREATE INDEX "experiences_services_created_at_idx" ON "experiences_services" USING btree ("created_at");
  CREATE INDEX "experiences_services__status_idx" ON "experiences_services" USING btree ("_status");
  CREATE INDEX "_experiences_services_v_version_features_order_idx" ON "_experiences_services_v_version_features" USING btree ("_order");
  CREATE INDEX "_experiences_services_v_version_features_parent_id_idx" ON "_experiences_services_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_experiences_services_v_parent_idx" ON "_experiences_services_v" USING btree ("parent_id");
  CREATE INDEX "_experiences_services_v_version_version_image_idx" ON "_experiences_services_v" USING btree ("version_image_id");
  CREATE INDEX "_experiences_services_v_version_version_updated_at_idx" ON "_experiences_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_experiences_services_v_version_version_created_at_idx" ON "_experiences_services_v" USING btree ("version_created_at");
  CREATE INDEX "_experiences_services_v_version_version__status_idx" ON "_experiences_services_v" USING btree ("version__status");
  CREATE INDEX "_experiences_services_v_created_at_idx" ON "_experiences_services_v" USING btree ("created_at");
  CREATE INDEX "_experiences_services_v_updated_at_idx" ON "_experiences_services_v" USING btree ("updated_at");
  CREATE INDEX "_experiences_services_v_latest_idx" ON "_experiences_services_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_upcoming_shows_id_idx" ON "payload_locked_documents_rels" USING btree ("upcoming_shows_id");
  CREATE INDEX "payload_locked_documents_rels_music_releases_id_idx" ON "payload_locked_documents_rels" USING btree ("music_releases_id");
  CREATE INDEX "payload_locked_documents_rels_performance_history_id_idx" ON "payload_locked_documents_rels" USING btree ("performance_history_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_id");
  CREATE INDEX "payload_locked_documents_rels_legacy_milestones_id_idx" ON "payload_locked_documents_rels" USING btree ("legacy_milestones_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_experiences_services_id_idx" ON "payload_locked_documents_rels" USING btree ("experiences_services_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_statistics_stats_order_idx" ON "home_page_statistics_stats" USING btree ("_order");
  CREATE INDEX "home_page_statistics_stats_parent_id_idx" ON "home_page_statistics_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_global_reach_locations_order_idx" ON "home_page_global_reach_locations" USING btree ("_order");
  CREATE INDEX "home_page_global_reach_locations_parent_id_idx" ON "home_page_global_reach_locations" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_hero_hero_image_idx" ON "home_page" USING btree ("hero_hero_image_id");
  CREATE INDEX "home_page_artist_intro_artist_intro_intro_image_idx" ON "home_page" USING btree ("artist_intro_intro_image_id");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_upcoming_shows_id_idx" ON "home_page_rels" USING btree ("upcoming_shows_id");
  CREATE INDEX "home_page_rels_music_releases_id_idx" ON "home_page_rels" USING btree ("music_releases_id");
  CREATE INDEX "contact_booking_social_links_order_idx" ON "contact_booking_social_links" USING btree ("_order");
  CREATE INDEX "contact_booking_social_links_parent_id_idx" ON "contact_booking_social_links" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "upcoming_shows" CASCADE;
  DROP TABLE "_upcoming_shows_v" CASCADE;
  DROP TABLE "music_releases" CASCADE;
  DROP TABLE "_music_releases_v" CASCADE;
  DROP TABLE "performance_history" CASCADE;
  DROP TABLE "gallery_images" CASCADE;
  DROP TABLE "gallery" CASCADE;
  DROP TABLE "_gallery_v_version_images" CASCADE;
  DROP TABLE "_gallery_v" CASCADE;
  DROP TABLE "legacy_milestones" CASCADE;
  DROP TABLE "_legacy_milestones_v" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "experiences_services_features" CASCADE;
  DROP TABLE "experiences_services" CASCADE;
  DROP TABLE "_experiences_services_v_version_features" CASCADE;
  DROP TABLE "_experiences_services_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "home_page_statistics_stats" CASCADE;
  DROP TABLE "home_page_global_reach_locations" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "contact_booking_social_links" CASCADE;
  DROP TABLE "contact_booking" CASCADE;
  DROP TYPE "public"."enum_upcoming_shows_show_status";
  DROP TYPE "public"."enum_upcoming_shows_status";
  DROP TYPE "public"."enum__upcoming_shows_v_version_show_status";
  DROP TYPE "public"."enum__upcoming_shows_v_version_status";
  DROP TYPE "public"."enum_music_releases_genre";
  DROP TYPE "public"."enum_music_releases_status";
  DROP TYPE "public"."enum__music_releases_v_version_genre";
  DROP TYPE "public"."enum__music_releases_v_version_status";
  DROP TYPE "public"."enum_performance_history_category";
  DROP TYPE "public"."enum_gallery_status";
  DROP TYPE "public"."enum__gallery_v_version_status";
  DROP TYPE "public"."enum_legacy_milestones_status";
  DROP TYPE "public"."enum__legacy_milestones_v_version_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum_experiences_services_status";
  DROP TYPE "public"."enum__experiences_services_v_version_status";
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  DROP TYPE "public"."enum_contact_booking_social_links_platform";`)
}

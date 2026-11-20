import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_gallery_strip_live_shows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headliner" varchar NOT NULL,
  	"detail" varchar,
  	"place" varchar,
  	"date" varchar,
  	"kind" varchar
  );
  
  ALTER TABLE "home_page_gallery_strip_live_shows" ADD CONSTRAINT "home_page_gallery_strip_live_shows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_gallery_strip_live_shows_order_idx" ON "home_page_gallery_strip_live_shows" USING btree ("_order");
  CREATE INDEX "home_page_gallery_strip_live_shows_parent_id_idx" ON "home_page_gallery_strip_live_shows" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_gallery_strip_live_shows" CASCADE;`)
}

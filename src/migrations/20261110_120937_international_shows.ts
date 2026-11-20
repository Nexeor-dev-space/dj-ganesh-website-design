import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_international_shows_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar NOT NULL,
  	"country" varchar
  );
  
  ALTER TABLE "home_page" ADD COLUMN "international_shows_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "international_shows_heading" varchar;
  ALTER TABLE "home_page" ADD COLUMN "international_shows_lede" varchar;
  ALTER TABLE "home_page" ADD COLUMN "international_shows_closing" varchar;
  ALTER TABLE "home_page_international_shows_cities" ADD CONSTRAINT "home_page_international_shows_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_international_shows_cities_order_idx" ON "home_page_international_shows_cities" USING btree ("_order");
  CREATE INDEX "home_page_international_shows_cities_parent_id_idx" ON "home_page_international_shows_cities" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_international_shows_cities" CASCADE;
  ALTER TABLE "home_page" DROP COLUMN "international_shows_label";
  ALTER TABLE "home_page" DROP COLUMN "international_shows_heading";
  ALTER TABLE "home_page" DROP COLUMN "international_shows_lede";
  ALTER TABLE "home_page" DROP COLUMN "international_shows_closing";`)
}

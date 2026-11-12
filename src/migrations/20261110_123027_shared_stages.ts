import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_shared_stages_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_shared_stages_international_artists" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_shared_stages_indian_artists" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  ALTER TABLE "home_page" ADD COLUMN "shared_stages_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "shared_stages_lede" varchar;
  ALTER TABLE "home_page" ADD COLUMN "shared_stages_international_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "shared_stages_indian_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "shared_stages_closing" varchar;
  ALTER TABLE "home_page_shared_stages_heading" ADD CONSTRAINT "home_page_shared_stages_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_shared_stages_international_artists" ADD CONSTRAINT "home_page_shared_stages_international_artists_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_shared_stages_indian_artists" ADD CONSTRAINT "home_page_shared_stages_indian_artists_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_shared_stages_heading_order_idx" ON "home_page_shared_stages_heading" USING btree ("_order");
  CREATE INDEX "home_page_shared_stages_heading_parent_id_idx" ON "home_page_shared_stages_heading" USING btree ("_parent_id");
  CREATE INDEX "home_page_shared_stages_international_artists_order_idx" ON "home_page_shared_stages_international_artists" USING btree ("_order");
  CREATE INDEX "home_page_shared_stages_international_artists_parent_id_idx" ON "home_page_shared_stages_international_artists" USING btree ("_parent_id");
  CREATE INDEX "home_page_shared_stages_indian_artists_order_idx" ON "home_page_shared_stages_indian_artists" USING btree ("_order");
  CREATE INDEX "home_page_shared_stages_indian_artists_parent_id_idx" ON "home_page_shared_stages_indian_artists" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_shared_stages_heading" CASCADE;
  DROP TABLE "home_page_shared_stages_international_artists" CASCADE;
  DROP TABLE "home_page_shared_stages_indian_artists" CASCADE;
  ALTER TABLE "home_page" DROP COLUMN "shared_stages_label";
  ALTER TABLE "home_page" DROP COLUMN "shared_stages_lede";
  ALTER TABLE "home_page" DROP COLUMN "shared_stages_international_label";
  ALTER TABLE "home_page" DROP COLUMN "shared_stages_indian_label";
  ALTER TABLE "home_page" DROP COLUMN "shared_stages_closing";`)
}

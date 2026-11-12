import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Only the Private Clientele group. The six contact_submissions columns the
// generator also emitted already come from 20261102_add_structured_enquiry_fields
// (the 20261103 snapshot predates them), so they are deliberately left out.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_private_clientele_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_private_clientele_private_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"primary" varchar NOT NULL,
  	"secondary" varchar
  );
  
  CREATE TABLE "home_page_private_clientele_wedding_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"primary" varchar NOT NULL,
  	"secondary" varchar
  );
  
  CREATE TABLE "home_page_private_clientele_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  ALTER TABLE "home_page" ADD COLUMN "private_clientele_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "private_clientele_lede" varchar;
  ALTER TABLE "home_page" ADD COLUMN "private_clientele_private_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "private_clientele_private_closing" varchar;
  ALTER TABLE "home_page" ADD COLUMN "private_clientele_weddings_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "private_clientele_cta_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "private_clientele_cta_href" varchar;
  ALTER TABLE "home_page_private_clientele_heading" ADD CONSTRAINT "home_page_private_clientele_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_private_clientele_private_entries" ADD CONSTRAINT "home_page_private_clientele_private_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_private_clientele_wedding_entries" ADD CONSTRAINT "home_page_private_clientele_wedding_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_private_clientele_stats" ADD CONSTRAINT "home_page_private_clientele_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_private_clientele_heading_order_idx" ON "home_page_private_clientele_heading" USING btree ("_order");
  CREATE INDEX "home_page_private_clientele_heading_parent_id_idx" ON "home_page_private_clientele_heading" USING btree ("_parent_id");
  CREATE INDEX "home_page_private_clientele_private_entries_order_idx" ON "home_page_private_clientele_private_entries" USING btree ("_order");
  CREATE INDEX "home_page_private_clientele_private_entries_parent_id_idx" ON "home_page_private_clientele_private_entries" USING btree ("_parent_id");
  CREATE INDEX "home_page_private_clientele_wedding_entries_order_idx" ON "home_page_private_clientele_wedding_entries" USING btree ("_order");
  CREATE INDEX "home_page_private_clientele_wedding_entries_parent_id_idx" ON "home_page_private_clientele_wedding_entries" USING btree ("_parent_id");
  CREATE INDEX "home_page_private_clientele_stats_order_idx" ON "home_page_private_clientele_stats" USING btree ("_order");
  CREATE INDEX "home_page_private_clientele_stats_parent_id_idx" ON "home_page_private_clientele_stats" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_private_clientele_heading" CASCADE;
  DROP TABLE "home_page_private_clientele_private_entries" CASCADE;
  DROP TABLE "home_page_private_clientele_wedding_entries" CASCADE;
  DROP TABLE "home_page_private_clientele_stats" CASCADE;
  ALTER TABLE "home_page" DROP COLUMN "private_clientele_label";
  ALTER TABLE "home_page" DROP COLUMN "private_clientele_lede";
  ALTER TABLE "home_page" DROP COLUMN "private_clientele_private_label";
  ALTER TABLE "home_page" DROP COLUMN "private_clientele_private_closing";
  ALTER TABLE "home_page" DROP COLUMN "private_clientele_weddings_label";
  ALTER TABLE "home_page" DROP COLUMN "private_clientele_cta_label";
  ALTER TABLE "home_page" DROP COLUMN "private_clientele_cta_href";`)
}

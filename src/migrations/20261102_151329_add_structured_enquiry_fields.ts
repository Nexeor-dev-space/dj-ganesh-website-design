import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" ADD COLUMN "organisation" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "event_date" timestamp(3) with time zone;
  ALTER TABLE "contact_submissions" ADD COLUMN "location" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "audience" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "budget" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "honeypot" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" DROP COLUMN "organisation";
  ALTER TABLE "contact_submissions" DROP COLUMN "event_date";
  ALTER TABLE "contact_submissions" DROP COLUMN "location";
  ALTER TABLE "contact_submissions" DROP COLUMN "audience";
  ALTER TABLE "contact_submissions" DROP COLUMN "budget";
  ALTER TABLE "contact_submissions" DROP COLUMN "honeypot";`)
}

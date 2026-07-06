import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ALTER COLUMN "type" DROP DEFAULT;
  ALTER TABLE "footer_simple" ALTER COLUMN "type" DROP DEFAULT;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ALTER COLUMN "type" SET DEFAULT '0';
  ALTER TABLE "footer_simple" ALTER COLUMN "type" SET DEFAULT '0';`)
}

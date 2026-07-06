import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_navbar" ADD COLUMN "name" varchar;
  ALTER TABLE "header_navbar" DROP COLUMN "inicio";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_navbar" ADD COLUMN "inicio" varchar;
  ALTER TABLE "header_navbar" DROP COLUMN "name";`)
}

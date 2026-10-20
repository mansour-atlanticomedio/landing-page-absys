import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "footer" ALTER COLUMN "type" SET DEFAULT '0'::text;
  UPDATE "footer" SET "type" = '0' WHERE "type" = '2';
  DROP TYPE "public"."enum_footer_type";
  CREATE TYPE "public"."enum_footer_type" AS ENUM('0', '1');
  ALTER TABLE "footer" ALTER COLUMN "type" SET DEFAULT '0'::"public"."enum_footer_type";
  ALTER TABLE "footer" ALTER COLUMN "type" SET DATA TYPE "public"."enum_footer_type" USING "type"::"public"."enum_footer_type";
  ALTER TABLE "header" DROP COLUMN "type";
  DROP TYPE "public"."enum_header_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_type" AS ENUM('0', '1', '2');
  ALTER TYPE "public"."enum_footer_type" ADD VALUE '2';
  ALTER TABLE "header" ADD COLUMN "type" "enum_header_type" DEFAULT '0';`)
}

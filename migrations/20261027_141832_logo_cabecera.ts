import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_logo_link_tipo" AS ENUM('interno', 'ancla', 'registro', 'externo');
  CREATE TYPE "public"."enum_header_logo_link_ancla" AS ENUM('home-noticias', 'investigacion-apoyo');
  CREATE TYPE "public"."enum_header_logo_link_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  ALTER TABLE "header" ADD COLUMN "logo_link_tipo" "enum_header_logo_link_tipo" DEFAULT 'interno';
  ALTER TABLE "header" ADD COLUMN "logo_link_to" varchar;
  ALTER TABLE "header" ADD COLUMN "logo_link_ancla" "enum_header_logo_link_ancla";
  ALTER TABLE "header" ADD COLUMN "logo_link_enlace_key" "enum_header_logo_link_enlace_key";
  ALTER TABLE "header" ADD COLUMN "logo_link_url" varchar;
  ALTER TABLE "header" ADD COLUMN "logo_link_nueva_pestana" boolean;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header" DROP COLUMN "logo_link_tipo";
  ALTER TABLE "header" DROP COLUMN "logo_link_to";
  ALTER TABLE "header" DROP COLUMN "logo_link_ancla";
  ALTER TABLE "header" DROP COLUMN "logo_link_enlace_key";
  ALTER TABLE "header" DROP COLUMN "logo_link_url";
  ALTER TABLE "header" DROP COLUMN "logo_link_nueva_pestana";
  DROP TYPE "public"."enum_header_logo_link_tipo";
  DROP TYPE "public"."enum_header_logo_link_ancla";
  DROP TYPE "public"."enum_header_logo_link_enlace_key";`)
}

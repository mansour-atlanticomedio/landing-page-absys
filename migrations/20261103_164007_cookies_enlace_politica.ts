import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cookies_policy_link_tipo" AS ENUM('interno', 'ancla', 'registro', 'externo');
  CREATE TYPE "public"."enum_cookies_policy_link_ancla" AS ENUM('home-noticias', 'investigacion-apoyo');
  CREATE TYPE "public"."enum_cookies_policy_link_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'soporte_recursos');
  ALTER TABLE "cookies" ADD COLUMN "policy_link_tipo" "enum_cookies_policy_link_tipo" DEFAULT 'interno';
  ALTER TABLE "cookies" ADD COLUMN "policy_link_to" varchar;
  ALTER TABLE "cookies" ADD COLUMN "policy_link_ancla" "enum_cookies_policy_link_ancla";
  ALTER TABLE "cookies" ADD COLUMN "policy_link_enlace_key" "enum_cookies_policy_link_enlace_key";
  ALTER TABLE "cookies" ADD COLUMN "policy_link_url" varchar;
  ALTER TABLE "cookies" ADD COLUMN "policy_link_nueva_pestana" boolean;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cookies" DROP COLUMN "policy_link_tipo";
  ALTER TABLE "cookies" DROP COLUMN "policy_link_to";
  ALTER TABLE "cookies" DROP COLUMN "policy_link_ancla";
  ALTER TABLE "cookies" DROP COLUMN "policy_link_enlace_key";
  ALTER TABLE "cookies" DROP COLUMN "policy_link_url";
  ALTER TABLE "cookies" DROP COLUMN "policy_link_nueva_pestana";
  DROP TYPE "public"."enum_cookies_policy_link_tipo";
  DROP TYPE "public"."enum_cookies_policy_link_ancla";
  DROP TYPE "public"."enum_cookies_policy_link_enlace_key";`)
}

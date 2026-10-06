import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_navbar_items_tipo" AS ENUM('interno', 'ancla', 'registro', 'externo');
  CREATE TYPE "public"."enum_header_navbar_items_ancla" AS ENUM('home-noticias', 'investigacion-apoyo');
  CREATE TYPE "public"."enum_header_navbar_items_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  CREATE TYPE "public"."enum_header_navbar_tipo" AS ENUM('interno', 'ancla', 'registro', 'externo');
  CREATE TYPE "public"."enum_header_navbar_ancla" AS ENUM('home-noticias', 'investigacion-apoyo');
  CREATE TYPE "public"."enum_header_navbar_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  CREATE TYPE "public"."enum_footer_social_medias_tipo" AS ENUM('interno', 'ancla', 'registro', 'externo');
  CREATE TYPE "public"."enum_footer_social_medias_ancla" AS ENUM('home-noticias', 'investigacion-apoyo');
  CREATE TYPE "public"."enum_footer_social_medias_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  CREATE TYPE "public"."enum_footer_seccion_info_information_tipo" AS ENUM('interno', 'ancla', 'registro', 'externo');
  CREATE TYPE "public"."enum_footer_seccion_info_information_ancla" AS ENUM('home-noticias', 'investigacion-apoyo');
  CREATE TYPE "public"."enum_footer_seccion_info_information_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  ALTER TABLE "header_navbar_items" ADD COLUMN "tipo" "enum_header_navbar_items_tipo" DEFAULT 'interno';
  ALTER TABLE "header_navbar_items" ADD COLUMN "ancla" "enum_header_navbar_items_ancla";
  ALTER TABLE "header_navbar_items" ADD COLUMN "enlace_key" "enum_header_navbar_items_enlace_key";
  ALTER TABLE "header_navbar_items" ADD COLUMN "url" varchar;
  ALTER TABLE "header_navbar_items" ADD COLUMN "nueva_pestana" boolean;
  ALTER TABLE "header_navbar" ADD COLUMN "tipo" "enum_header_navbar_tipo" DEFAULT 'interno';
  ALTER TABLE "header_navbar" ADD COLUMN "ancla" "enum_header_navbar_ancla";
  ALTER TABLE "header_navbar" ADD COLUMN "enlace_key" "enum_header_navbar_enlace_key";
  ALTER TABLE "header_navbar" ADD COLUMN "url" varchar;
  ALTER TABLE "header_navbar" ADD COLUMN "nueva_pestana" boolean;
  ALTER TABLE "footer_social_medias" ADD COLUMN "tipo" "enum_footer_social_medias_tipo" DEFAULT 'externo';
  ALTER TABLE "footer_social_medias" ADD COLUMN "to" varchar;
  ALTER TABLE "footer_social_medias" ADD COLUMN "ancla" "enum_footer_social_medias_ancla";
  ALTER TABLE "footer_social_medias" ADD COLUMN "enlace_key" "enum_footer_social_medias_enlace_key";
  ALTER TABLE "footer_social_medias" ADD COLUMN "nueva_pestana" boolean;
  ALTER TABLE "footer_seccion_info_information" ADD COLUMN "tipo" "enum_footer_seccion_info_information_tipo" DEFAULT 'externo';
  ALTER TABLE "footer_seccion_info_information" ADD COLUMN "to" varchar;
  ALTER TABLE "footer_seccion_info_information" ADD COLUMN "ancla" "enum_footer_seccion_info_information_ancla";
  ALTER TABLE "footer_seccion_info_information" ADD COLUMN "enlace_key" "enum_footer_seccion_info_information_enlace_key";
  ALTER TABLE "footer_seccion_info_information" ADD COLUMN "nueva_pestana" boolean;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_navbar_items" DROP COLUMN "tipo";
  ALTER TABLE "header_navbar_items" DROP COLUMN "ancla";
  ALTER TABLE "header_navbar_items" DROP COLUMN "enlace_key";
  ALTER TABLE "header_navbar_items" DROP COLUMN "url";
  ALTER TABLE "header_navbar_items" DROP COLUMN "nueva_pestana";
  ALTER TABLE "header_navbar" DROP COLUMN "tipo";
  ALTER TABLE "header_navbar" DROP COLUMN "ancla";
  ALTER TABLE "header_navbar" DROP COLUMN "enlace_key";
  ALTER TABLE "header_navbar" DROP COLUMN "url";
  ALTER TABLE "header_navbar" DROP COLUMN "nueva_pestana";
  ALTER TABLE "footer_social_medias" DROP COLUMN "tipo";
  ALTER TABLE "footer_social_medias" DROP COLUMN "to";
  ALTER TABLE "footer_social_medias" DROP COLUMN "ancla";
  ALTER TABLE "footer_social_medias" DROP COLUMN "enlace_key";
  ALTER TABLE "footer_social_medias" DROP COLUMN "nueva_pestana";
  ALTER TABLE "footer_seccion_info_information" DROP COLUMN "tipo";
  ALTER TABLE "footer_seccion_info_information" DROP COLUMN "to";
  ALTER TABLE "footer_seccion_info_information" DROP COLUMN "ancla";
  ALTER TABLE "footer_seccion_info_information" DROP COLUMN "enlace_key";
  ALTER TABLE "footer_seccion_info_information" DROP COLUMN "nueva_pestana";
  DROP TYPE "public"."enum_header_navbar_items_tipo";
  DROP TYPE "public"."enum_header_navbar_items_ancla";
  DROP TYPE "public"."enum_header_navbar_items_enlace_key";
  DROP TYPE "public"."enum_header_navbar_tipo";
  DROP TYPE "public"."enum_header_navbar_ancla";
  DROP TYPE "public"."enum_header_navbar_enlace_key";
  DROP TYPE "public"."enum_footer_social_medias_tipo";
  DROP TYPE "public"."enum_footer_social_medias_ancla";
  DROP TYPE "public"."enum_footer_social_medias_enlace_key";
  DROP TYPE "public"."enum_footer_seccion_info_information_tipo";
  DROP TYPE "public"."enum_footer_seccion_info_information_ancla";
  DROP TYPE "public"."enum_footer_seccion_info_information_enlace_key";`)
}

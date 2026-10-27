import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_electronic_resources_categorias_recursos_acceso" AS ENUM('subscription', 'open');
  CREATE TYPE "public"."enum_electronic_resources_problema_acceso_tipo" AS ENUM('interno', 'ancla', 'registro', 'externo');
  CREATE TYPE "public"."enum_electronic_resources_problema_acceso_ancla" AS ENUM('home-noticias', 'investigacion-apoyo');
  CREATE TYPE "public"."enum_electronic_resources_problema_acceso_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'soporte_recursos');
  ALTER TYPE "public"."enum_header_navbar_items_enlace_key" ADD VALUE IF NOT EXISTS 'soporte_recursos';
  ALTER TYPE "public"."enum_header_navbar_enlace_key" ADD VALUE IF NOT EXISTS 'soporte_recursos';
  ALTER TYPE "public"."enum_header_logo_link_enlace_key" ADD VALUE IF NOT EXISTS 'soporte_recursos';
  ALTER TYPE "public"."enum_footer_social_medias_enlace_key" ADD VALUE IF NOT EXISTS 'soporte_recursos';
  ALTER TYPE "public"."enum_footer_seccion_info_information_enlace_key" ADD VALUE IF NOT EXISTS 'soporte_recursos';
  ALTER TYPE "public"."enum_layout_enlaces_externos_key" ADD VALUE IF NOT EXISTS 'soporte_recursos';
  CREATE TABLE "electronic_resources_acceso_remoto_puntos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "electronic_resources_categorias_recursos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"descripcion" varchar,
  	"acceso" "enum_electronic_resources_categorias_recursos_acceso" DEFAULT 'subscription',
  	"enlace" varchar
  );
  
  CREATE TABLE "electronic_resources_categorias" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL
  );
  
  ALTER TABLE "electronic_resources" ADD COLUMN "accesos_titulo" varchar;
  ALTER TABLE "electronic_resources" ADD COLUMN "acceso_remoto_titulo" varchar;
  ALTER TABLE "electronic_resources" ADD COLUMN "acceso_remoto_descripcion" varchar;
  ALTER TABLE "electronic_resources" ADD COLUMN "acceso_remoto_portal_titulo" varchar;
  ALTER TABLE "electronic_resources" ADD COLUMN "acceso_remoto_portal_descripcion" varchar;
  ALTER TABLE "electronic_resources" ADD COLUMN "acceso_remoto_portal_boton_texto" varchar;
  ALTER TABLE "electronic_resources" ADD COLUMN "acceso_remoto_portal_boton_enlace" varchar DEFAULT '/login';
  ALTER TABLE "electronic_resources" ADD COLUMN "problema_acceso_texto" varchar;
  ALTER TABLE "electronic_resources" ADD COLUMN "problema_acceso_tipo" "enum_electronic_resources_problema_acceso_tipo" DEFAULT 'registro';
  ALTER TABLE "electronic_resources" ADD COLUMN "problema_acceso_to" varchar;
  ALTER TABLE "electronic_resources" ADD COLUMN "problema_acceso_ancla" "enum_electronic_resources_problema_acceso_ancla";
  ALTER TABLE "electronic_resources" ADD COLUMN "problema_acceso_enlace_key" "enum_electronic_resources_problema_acceso_enlace_key";
  ALTER TABLE "electronic_resources" ADD COLUMN "problema_acceso_url" varchar;
  ALTER TABLE "electronic_resources" ADD COLUMN "problema_acceso_nueva_pestana" boolean;
  ALTER TABLE "electronic_resources" ADD COLUMN "categorias_titulo" varchar;
  ALTER TABLE "electronic_resources_acceso_remoto_puntos" ADD CONSTRAINT "electronic_resources_acceso_remoto_puntos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."electronic_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "electronic_resources_categorias_recursos" ADD CONSTRAINT "electronic_resources_categorias_recursos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."electronic_resources_categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "electronic_resources_categorias" ADD CONSTRAINT "electronic_resources_categorias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."electronic_resources"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "electronic_resources_acceso_remoto_puntos_order_idx" ON "electronic_resources_acceso_remoto_puntos" USING btree ("_order");
  CREATE INDEX "electronic_resources_acceso_remoto_puntos_parent_id_idx" ON "electronic_resources_acceso_remoto_puntos" USING btree ("_parent_id");
  CREATE INDEX "electronic_resources_categorias_recursos_order_idx" ON "electronic_resources_categorias_recursos" USING btree ("_order");
  CREATE INDEX "electronic_resources_categorias_recursos_parent_id_idx" ON "electronic_resources_categorias_recursos" USING btree ("_parent_id");
  CREATE INDEX "electronic_resources_categorias_order_idx" ON "electronic_resources_categorias" USING btree ("_order");
  CREATE INDEX "electronic_resources_categorias_parent_id_idx" ON "electronic_resources_categorias" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "electronic_resources_acceso_remoto_puntos" CASCADE;
  DROP TABLE "electronic_resources_categorias_recursos" CASCADE;
  DROP TABLE "electronic_resources_categorias" CASCADE;
  ALTER TABLE "header_navbar_items" ALTER COLUMN "enlace_key" SET DATA TYPE text;
  DROP TYPE "public"."enum_header_navbar_items_enlace_key";
  CREATE TYPE "public"."enum_header_navbar_items_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  ALTER TABLE "header_navbar_items" ALTER COLUMN "enlace_key" SET DATA TYPE "public"."enum_header_navbar_items_enlace_key" USING "enlace_key"::"public"."enum_header_navbar_items_enlace_key";
  ALTER TABLE "header_navbar" ALTER COLUMN "enlace_key" SET DATA TYPE text;
  DROP TYPE "public"."enum_header_navbar_enlace_key";
  CREATE TYPE "public"."enum_header_navbar_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  ALTER TABLE "header_navbar" ALTER COLUMN "enlace_key" SET DATA TYPE "public"."enum_header_navbar_enlace_key" USING "enlace_key"::"public"."enum_header_navbar_enlace_key";
  ALTER TABLE "header" ALTER COLUMN "logo_link_enlace_key" SET DATA TYPE text;
  DROP TYPE "public"."enum_header_logo_link_enlace_key";
  CREATE TYPE "public"."enum_header_logo_link_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  ALTER TABLE "header" ALTER COLUMN "logo_link_enlace_key" SET DATA TYPE "public"."enum_header_logo_link_enlace_key" USING "logo_link_enlace_key"::"public"."enum_header_logo_link_enlace_key";
  ALTER TABLE "footer_social_medias" ALTER COLUMN "enlace_key" SET DATA TYPE text;
  DROP TYPE "public"."enum_footer_social_medias_enlace_key";
  CREATE TYPE "public"."enum_footer_social_medias_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  ALTER TABLE "footer_social_medias" ALTER COLUMN "enlace_key" SET DATA TYPE "public"."enum_footer_social_medias_enlace_key" USING "enlace_key"::"public"."enum_footer_social_medias_enlace_key";
  ALTER TABLE "footer_seccion_info_information" ALTER COLUMN "enlace_key" SET DATA TYPE text;
  DROP TYPE "public"."enum_footer_seccion_info_information_enlace_key";
  CREATE TYPE "public"."enum_footer_seccion_info_information_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  ALTER TABLE "footer_seccion_info_information" ALTER COLUMN "enlace_key" SET DATA TYPE "public"."enum_footer_seccion_info_information_enlace_key" USING "enlace_key"::"public"."enum_footer_seccion_info_information_enlace_key";
  ALTER TABLE "layout_enlaces_externos" ALTER COLUMN "key" SET DATA TYPE text;
  DROP TYPE "public"."enum_layout_enlaces_externos_key";
  CREATE TYPE "public"."enum_layout_enlaces_externos_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok');
  ALTER TABLE "layout_enlaces_externos" ALTER COLUMN "key" SET DATA TYPE "public"."enum_layout_enlaces_externos_key" USING "key"::"public"."enum_layout_enlaces_externos_key";
  ALTER TABLE "electronic_resources" DROP COLUMN "accesos_titulo";
  ALTER TABLE "electronic_resources" DROP COLUMN "acceso_remoto_titulo";
  ALTER TABLE "electronic_resources" DROP COLUMN "acceso_remoto_descripcion";
  ALTER TABLE "electronic_resources" DROP COLUMN "acceso_remoto_portal_titulo";
  ALTER TABLE "electronic_resources" DROP COLUMN "acceso_remoto_portal_descripcion";
  ALTER TABLE "electronic_resources" DROP COLUMN "acceso_remoto_portal_boton_texto";
  ALTER TABLE "electronic_resources" DROP COLUMN "acceso_remoto_portal_boton_enlace";
  ALTER TABLE "electronic_resources" DROP COLUMN "problema_acceso_texto";
  ALTER TABLE "electronic_resources" DROP COLUMN "problema_acceso_tipo";
  ALTER TABLE "electronic_resources" DROP COLUMN "problema_acceso_to";
  ALTER TABLE "electronic_resources" DROP COLUMN "problema_acceso_ancla";
  ALTER TABLE "electronic_resources" DROP COLUMN "problema_acceso_enlace_key";
  ALTER TABLE "electronic_resources" DROP COLUMN "problema_acceso_url";
  ALTER TABLE "electronic_resources" DROP COLUMN "problema_acceso_nueva_pestana";
  ALTER TABLE "electronic_resources" DROP COLUMN "categorias_titulo";
  DROP TYPE "public"."enum_electronic_resources_categorias_recursos_acceso";
  DROP TYPE "public"."enum_electronic_resources_problema_acceso_tipo";
  DROP TYPE "public"."enum_electronic_resources_problema_acceso_ancla";
  DROP TYPE "public"."enum_electronic_resources_problema_acceso_enlace_key";`)
}

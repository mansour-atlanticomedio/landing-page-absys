import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_footer_social_medias_icon" AS ENUM('FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube', 'Globe');
  CREATE TYPE "public"."enum_footer_seccion_info_information_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar');
  
  CREATE TABLE "footer_social_medias" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "icon" "enum_footer_social_medias_icon",
    "link" varchar
  );
  
  CREATE TABLE "footer_seccion_info_information" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "icon" "enum_footer_seccion_info_information_icon",
    "label" varchar,
    "url" varchar
  );
  
  CREATE TABLE "footer_seccion_info" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar
  );
  
  -- Desactivamos RLS de forma segura por si las tablas existen
  ALTER TABLE IF EXISTS "footer_social_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "footer_simple_social_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "footer_simple" DISABLE ROW LEVEL SECURITY;
  
  -- Borramos las tablas viejas solo si existen
  DROP TABLE IF EXISTS "footer_social_media" CASCADE;
  DROP TABLE IF EXISTS "footer_simple_social_media" CASCADE;
  DROP TABLE IF EXISTS "footer_simple" CASCADE;
  
  -- EL CAMBIO CLAVE: DROP CONSTRAINT IF EXISTS
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_footer_simple_fk";
  
  -- Borramos el índice solo si existe
  DROP INDEX IF EXISTS "payload_locked_documents_rels_footer_simple_id_idx";
  
  ALTER TABLE "footer" ADD COLUMN "legal_advice" varchar;
  ALTER TABLE "footer" ADD COLUMN "privacy_policie" varchar;
  ALTER TABLE "footer" ADD COLUMN "privacy_cookies" varchar;
  
  ALTER TABLE "footer_social_medias" ADD CONSTRAINT "footer_social_medias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_seccion_info_information" ADD CONSTRAINT "footer_seccion_info_information_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_seccion_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_seccion_info" ADD CONSTRAINT "footer_seccion_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  
  CREATE INDEX "footer_social_medias_order_idx" ON "footer_social_medias" USING btree ("_order");
  CREATE INDEX "footer_social_medias_parent_id_idx" ON "footer_social_medias" USING btree ("_parent_id");
  CREATE INDEX "footer_seccion_info_information_order_idx" ON "footer_seccion_info_information" USING btree ("_order");
  CREATE INDEX "footer_seccion_info_information_parent_id_idx" ON "footer_seccion_info_information" USING btree ("_parent_id");
  CREATE INDEX "footer_seccion_info_order_idx" ON "footer_seccion_info" USING btree ("_order");
  CREATE INDEX "footer_seccion_info_parent_id_idx" ON "footer_seccion_info" USING btree ("_parent_id");
  
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "sublogo";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "footer_simple_id";
  
  DROP TYPE IF EXISTS "public"."enum_footer_simple_social_media_icon";
  DROP TYPE IF EXISTS "public"."enum_footer_simple_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_simple_social_media_icon" AS ENUM('FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube', 'Globe');
  CREATE TYPE "public"."enum_footer_simple_type" AS ENUM('0', '1', '2');
  CREATE TABLE "footer_social_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "footer_simple_social_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_footer_simple_social_media_icon",
  	"link" varchar
  );
  
  CREATE TABLE "footer_simple" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_footer_simple_type" DEFAULT '0',
  	"title" varchar,
  	"schedule" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "footer_social_medias" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_seccion_info_information" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_seccion_info" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "footer_social_medias" CASCADE;
  DROP TABLE "footer_seccion_info_information" CASCADE;
  DROP TABLE "footer_seccion_info" CASCADE;
  ALTER TABLE "footer" ADD COLUMN "sublogo" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "footer_simple_id" integer;
  ALTER TABLE "footer_social_media" ADD CONSTRAINT "footer_social_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_simple_social_media" ADD CONSTRAINT "footer_simple_social_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_simple"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_social_media_order_idx" ON "footer_social_media" USING btree ("_order");
  CREATE INDEX "footer_social_media_parent_id_idx" ON "footer_social_media" USING btree ("_parent_id");
  CREATE INDEX "footer_simple_social_media_order_idx" ON "footer_simple_social_media" USING btree ("_order");
  CREATE INDEX "footer_simple_social_media_parent_id_idx" ON "footer_simple_social_media" USING btree ("_parent_id");
  CREATE INDEX "footer_simple_updated_at_idx" ON "footer_simple" USING btree ("updated_at");
  CREATE INDEX "footer_simple_created_at_idx" ON "footer_simple" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_simple_fk" FOREIGN KEY ("footer_simple_id") REFERENCES "public"."footer_simple"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_footer_simple_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_simple_id");
  ALTER TABLE "footer" DROP COLUMN "legal_advice";
  ALTER TABLE "footer" DROP COLUMN "privacy_policie";
  ALTER TABLE "footer" DROP COLUMN "privacy_cookies";
  DROP TYPE "public"."enum_footer_social_medias_icon";
  DROP TYPE "public"."enum_footer_seccion_info_information_icon";`)
}

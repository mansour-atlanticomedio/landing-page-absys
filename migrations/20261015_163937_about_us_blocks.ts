import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_us_blocks_cards_features_block_style" AS ENUM('default', 'muted');
  CREATE TYPE "public"."enum_about_us_blocks_image_text_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_about_us_blocks_rules_cards_block_cards_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TABLE "about_us_blocks_cards_features_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"features_id" integer,
  	"style" "enum_about_us_blocks_cards_features_block_style" DEFAULT 'default',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_us_blocks_image_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"text" jsonb,
  	"image_position" "enum_about_us_blocks_image_text_block_image_position" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "about_us_blocks_schedule_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"schedule_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_us_blocks_contact_info_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"building_name" varchar,
  	"building_subtitle" varchar,
  	"location_title" varchar,
  	"address_line1" varchar,
  	"address_line2" varchar,
  	"directions_button_label" varchar,
  	"contact_title" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"contact_button_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_us_blocks_map_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"map_url" varchar,
  	"map_embed_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_us_blocks_help_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_us_blocks_rules_cards_block_cards_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_us_blocks_rules_cards_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_us_blocks_rules_cards_block_cards_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"badge" varchar,
  	"description" varchar,
  	"note_title" varchar,
  	"note_text" varchar
  );
  
  CREATE TABLE "about_us_blocks_rules_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_us_blocks_notice_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_us_blocks_download_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_label" varchar,
  	"file_id" integer,
  	"block_name" varchar
  );
  ALTER TABLE "about_us_blocks_cards_features_block" ADD CONSTRAINT "about_us_blocks_cards_features_block_features_id_features_id_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_blocks_cards_features_block" ADD CONSTRAINT "about_us_blocks_cards_features_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_blocks_cards_features_block" ADD CONSTRAINT "about_us_blocks_cards_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_blocks_image_text_block" ADD CONSTRAINT "about_us_blocks_image_text_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_blocks_image_text_block" ADD CONSTRAINT "about_us_blocks_image_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_blocks_schedule_block" ADD CONSTRAINT "about_us_blocks_schedule_block_schedule_id_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_blocks_schedule_block" ADD CONSTRAINT "about_us_blocks_schedule_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_blocks_contact_info_block" ADD CONSTRAINT "about_us_blocks_contact_info_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_blocks_map_block" ADD CONSTRAINT "about_us_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_blocks_help_cta_block" ADD CONSTRAINT "about_us_blocks_help_cta_block_cta_id_cta_id_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_blocks_help_cta_block" ADD CONSTRAINT "about_us_blocks_help_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_blocks_rules_cards_block_cards_points" ADD CONSTRAINT "about_us_blocks_rules_cards_block_cards_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us_blocks_rules_cards_block_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_blocks_rules_cards_block_cards" ADD CONSTRAINT "about_us_blocks_rules_cards_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us_blocks_rules_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_blocks_rules_cards_block" ADD CONSTRAINT "about_us_blocks_rules_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_blocks_notice_block" ADD CONSTRAINT "about_us_blocks_notice_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_blocks_download_block" ADD CONSTRAINT "about_us_blocks_download_block_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_blocks_download_block" ADD CONSTRAINT "about_us_blocks_download_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_us_blocks_cards_features_block_order_idx" ON "about_us_blocks_cards_features_block" USING btree ("_order");
  CREATE INDEX "about_us_blocks_cards_features_block_parent_id_idx" ON "about_us_blocks_cards_features_block" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_cards_features_block_path_idx" ON "about_us_blocks_cards_features_block" USING btree ("_path");
  CREATE INDEX "about_us_blocks_cards_features_block_features_idx" ON "about_us_blocks_cards_features_block" USING btree ("features_id");
  CREATE INDEX "about_us_blocks_cards_features_block_image_idx" ON "about_us_blocks_cards_features_block" USING btree ("image_id");
  CREATE INDEX "about_us_blocks_image_text_block_order_idx" ON "about_us_blocks_image_text_block" USING btree ("_order");
  CREATE INDEX "about_us_blocks_image_text_block_parent_id_idx" ON "about_us_blocks_image_text_block" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_image_text_block_path_idx" ON "about_us_blocks_image_text_block" USING btree ("_path");
  CREATE INDEX "about_us_blocks_image_text_block_image_idx" ON "about_us_blocks_image_text_block" USING btree ("image_id");
  CREATE INDEX "about_us_blocks_schedule_block_order_idx" ON "about_us_blocks_schedule_block" USING btree ("_order");
  CREATE INDEX "about_us_blocks_schedule_block_parent_id_idx" ON "about_us_blocks_schedule_block" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_schedule_block_path_idx" ON "about_us_blocks_schedule_block" USING btree ("_path");
  CREATE INDEX "about_us_blocks_schedule_block_schedule_idx" ON "about_us_blocks_schedule_block" USING btree ("schedule_id");
  CREATE INDEX "about_us_blocks_contact_info_block_order_idx" ON "about_us_blocks_contact_info_block" USING btree ("_order");
  CREATE INDEX "about_us_blocks_contact_info_block_parent_id_idx" ON "about_us_blocks_contact_info_block" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_contact_info_block_path_idx" ON "about_us_blocks_contact_info_block" USING btree ("_path");
  CREATE INDEX "about_us_blocks_map_block_order_idx" ON "about_us_blocks_map_block" USING btree ("_order");
  CREATE INDEX "about_us_blocks_map_block_parent_id_idx" ON "about_us_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_map_block_path_idx" ON "about_us_blocks_map_block" USING btree ("_path");
  CREATE INDEX "about_us_blocks_help_cta_block_order_idx" ON "about_us_blocks_help_cta_block" USING btree ("_order");
  CREATE INDEX "about_us_blocks_help_cta_block_parent_id_idx" ON "about_us_blocks_help_cta_block" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_help_cta_block_path_idx" ON "about_us_blocks_help_cta_block" USING btree ("_path");
  CREATE INDEX "about_us_blocks_help_cta_block_cta_idx" ON "about_us_blocks_help_cta_block" USING btree ("cta_id");
  CREATE INDEX "about_us_blocks_rules_cards_block_cards_points_order_idx" ON "about_us_blocks_rules_cards_block_cards_points" USING btree ("_order");
  CREATE INDEX "about_us_blocks_rules_cards_block_cards_points_parent_id_idx" ON "about_us_blocks_rules_cards_block_cards_points" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_rules_cards_block_cards_order_idx" ON "about_us_blocks_rules_cards_block_cards" USING btree ("_order");
  CREATE INDEX "about_us_blocks_rules_cards_block_cards_parent_id_idx" ON "about_us_blocks_rules_cards_block_cards" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_rules_cards_block_order_idx" ON "about_us_blocks_rules_cards_block" USING btree ("_order");
  CREATE INDEX "about_us_blocks_rules_cards_block_parent_id_idx" ON "about_us_blocks_rules_cards_block" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_rules_cards_block_path_idx" ON "about_us_blocks_rules_cards_block" USING btree ("_path");
  CREATE INDEX "about_us_blocks_notice_block_order_idx" ON "about_us_blocks_notice_block" USING btree ("_order");
  CREATE INDEX "about_us_blocks_notice_block_parent_id_idx" ON "about_us_blocks_notice_block" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_notice_block_path_idx" ON "about_us_blocks_notice_block" USING btree ("_path");
  CREATE INDEX "about_us_blocks_download_block_order_idx" ON "about_us_blocks_download_block" USING btree ("_order");
  CREATE INDEX "about_us_blocks_download_block_parent_id_idx" ON "about_us_blocks_download_block" USING btree ("_parent_id");
  CREATE INDEX "about_us_blocks_download_block_path_idx" ON "about_us_blocks_download_block" USING btree ("_path");
  CREATE INDEX "about_us_blocks_download_block_file_idx" ON "about_us_blocks_download_block" USING btree ("file_id");`)

  await db.execute(sql`
  INSERT INTO "about_us_blocks_cards_features_block" ("_order", "_parent_id", "_path", "id", "title", "features_id", "style")
  SELECT 1, a."id", 'quienes_somos.layout', 'quienes-somos-ayudas',
    COALESCE((SELECT f."title" FROM "features" f WHERE f."id" = a."quienes_somos_ayudas_id"), '¿Cómo podemos ayudarte?'),
    a."quienes_somos_ayudas_id", 'default'
  FROM "about_us" a WHERE a."quienes_somos_ayudas_id" IS NOT NULL;

  INSERT INTO "about_us_blocks_cards_features_block" ("_order", "_parent_id", "_path", "id", "title", "features_id", "style", "image_id")
  SELECT 2, a."id", 'quienes_somos.layout', 'quienes-somos-dirigidos',
    COALESCE((SELECT f."title" FROM "features" f WHERE f."id" = a."quienes_somos_dirigidos_id"), 'A quién se dirigen nuestros servicios'),
    a."quienes_somos_dirigidos_id", 'muted', a."quienes_somos_imagen_dirigidos_id"
  FROM "about_us" a WHERE a."quienes_somos_dirigidos_id" IS NOT NULL OR a."quienes_somos_imagen_dirigidos_id" IS NOT NULL;

  INSERT INTO "about_us_blocks_contact_info_block" ("_order", "_parent_id", "_path", "id", "title", "building_name", "building_subtitle", "location_title", "address_line1", "address_line2", "directions_button_label", "contact_title", "phone", "email", "contact_button_label")
  SELECT 1, a."id", 'horarios.layout', 'horarios-contacto',
    a."horarios_info_titulo", a."horarios_edificio_nombre", a."horarios_edificio_subtitulo", a."horarios_ubicacion_titulo",
    a."horarios_direccion_linea1", a."horarios_direccion_linea2", a."horarios_boton_como_llegar", a."horarios_contacto_titulo",
    a."horarios_telefono", a."horarios_email", a."horarios_boton_contactar"
  FROM "about_us" a
  WHERE a."horarios_edificio_nombre" IS NOT NULL OR a."horarios_direccion_linea1" IS NOT NULL
    OR a."horarios_telefono" IS NOT NULL OR a."horarios_email" IS NOT NULL OR a."horarios_info_titulo" IS NOT NULL;

  INSERT INTO "about_us_blocks_schedule_block" ("_order", "_parent_id", "_path", "id", "title", "schedule_id")
  SELECT 2, a."id", 'horarios.layout', 'horarios-horario', a."horarios_horario_titulo", a."horarios_horario_id"
  FROM "about_us" a WHERE a."horarios_horario_id" IS NOT NULL;

  INSERT INTO "about_us_blocks_map_block" ("_order", "_parent_id", "_path", "id", "title", "map_url", "map_embed_url")
  SELECT 3, a."id", 'horarios.layout', 'horarios-mapa', a."horarios_ubicacion_titulo", a."horarios_mapa_url", a."horarios_mapa_embed_url"
  FROM "about_us" a WHERE a."horarios_mapa_url" IS NOT NULL OR a."horarios_mapa_embed_url" IS NOT NULL;

  INSERT INTO "about_us_blocks_help_cta_block" ("_order", "_parent_id", "_path", "id", "cta_id")
  SELECT 4, a."id", 'horarios.layout', 'horarios-ayuda', a."horarios_ayuda_cta_id"
  FROM "about_us" a WHERE a."horarios_ayuda_cta_id" IS NOT NULL;

  INSERT INTO "about_us_blocks_rules_cards_block" ("_order", "_parent_id", "_path", "id")
  SELECT 1, a."id", 'normativa.layout', 'normativa-tarjetas'
  FROM "about_us" a WHERE EXISTS (SELECT 1 FROM "about_us_normativa_tarjetas" t WHERE t."_parent_id" = a."id");

  INSERT INTO "about_us_blocks_rules_cards_block_cards" ("_order", "_parent_id", "id", "icon", "title", "badge", "description", "note_title", "note_text")
  SELECT t."_order", 'normativa-tarjetas', t."id", t."icon"::text::"public"."enum_about_us_blocks_rules_cards_block_cards_icon", t."title", t."badge", t."description", t."nota_titulo", t."nota_texto"
  FROM "about_us_normativa_tarjetas" t
  WHERE EXISTS (SELECT 1 FROM "about_us_blocks_rules_cards_block" WHERE "id" = 'normativa-tarjetas');

  INSERT INTO "about_us_blocks_rules_cards_block_cards_points" ("_order", "_parent_id", "id", "text")
  SELECT p."_order", p."_parent_id", p."id", p."texto"
  FROM "about_us_normativa_tarjetas_puntos" p
  WHERE EXISTS (SELECT 1 FROM "about_us_blocks_rules_cards_block_cards" c WHERE c."id" = p."_parent_id");

  INSERT INTO "about_us_blocks_notice_block" ("_order", "_parent_id", "_path", "id", "title", "text")
  SELECT 2, a."id", 'normativa.layout', 'normativa-responsabilidad', a."normativa_responsabilidad_titulo", a."normativa_responsabilidad_texto"
  FROM "about_us" a WHERE a."normativa_responsabilidad_titulo" IS NOT NULL OR a."normativa_responsabilidad_texto" IS NOT NULL;

  INSERT INTO "about_us_blocks_download_block" ("_order", "_parent_id", "_path", "id", "button_label", "file_id")
  SELECT 3, a."id", 'normativa.layout', 'normativa-descarga', a."normativa_pdf_texto_boton", a."normativa_pdf_id"
  FROM "about_us" a WHERE a."normativa_pdf_texto_boton" IS NOT NULL OR a."normativa_pdf_id" IS NOT NULL;
`)

  await db.execute(sql`
  ALTER TABLE "about_us_normativa_tarjetas_puntos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_normativa_tarjetas" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_us_normativa_tarjetas_puntos" CASCADE;
  DROP TABLE "about_us_normativa_tarjetas" CASCADE;
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_quienes_somos_imagen_dirigidos_id_media_id_fk";
  
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_quienes_somos_ayudas_id_features_id_fk";
  
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_quienes_somos_dirigidos_id_features_id_fk";
  
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_horarios_horario_id_schedule_id_fk";
  
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_horarios_ayuda_cta_id_cta_id_fk";
  
  ALTER TABLE "about_us" DROP CONSTRAINT "about_us_normativa_pdf_id_media_id_fk";
  
  DROP INDEX "about_us_quienes_somos_quienes_somos_imagen_dirigidos_idx";
  DROP INDEX "about_us_quienes_somos_quienes_somos_ayudas_idx";
  DROP INDEX "about_us_quienes_somos_quienes_somos_dirigidos_idx";
  DROP INDEX "about_us_horarios_horarios_horario_idx";
  DROP INDEX "about_us_horarios_horarios_ayuda_cta_idx";
  DROP INDEX "about_us_normativa_normativa_pdf_idx";
  ALTER TABLE "about_us" DROP COLUMN "quienes_somos_imagen_dirigidos_id";
  ALTER TABLE "about_us" DROP COLUMN "quienes_somos_ayudas_id";
  ALTER TABLE "about_us" DROP COLUMN "quienes_somos_dirigidos_id";
  ALTER TABLE "about_us" DROP COLUMN "horarios_info_titulo";
  ALTER TABLE "about_us" DROP COLUMN "horarios_edificio_nombre";
  ALTER TABLE "about_us" DROP COLUMN "horarios_edificio_subtitulo";
  ALTER TABLE "about_us" DROP COLUMN "horarios_horario_titulo";
  ALTER TABLE "about_us" DROP COLUMN "horarios_horario_id";
  ALTER TABLE "about_us" DROP COLUMN "horarios_ubicacion_titulo";
  ALTER TABLE "about_us" DROP COLUMN "horarios_direccion_linea1";
  ALTER TABLE "about_us" DROP COLUMN "horarios_direccion_linea2";
  ALTER TABLE "about_us" DROP COLUMN "horarios_contacto_titulo";
  ALTER TABLE "about_us" DROP COLUMN "horarios_telefono";
  ALTER TABLE "about_us" DROP COLUMN "horarios_email";
  ALTER TABLE "about_us" DROP COLUMN "horarios_boton_contactar";
  ALTER TABLE "about_us" DROP COLUMN "horarios_boton_como_llegar";
  ALTER TABLE "about_us" DROP COLUMN "horarios_mapa_url";
  ALTER TABLE "about_us" DROP COLUMN "horarios_mapa_embed_url";
  ALTER TABLE "about_us" DROP COLUMN "horarios_ayuda_cta_id";
  ALTER TABLE "about_us" DROP COLUMN "normativa_responsabilidad_titulo";
  ALTER TABLE "about_us" DROP COLUMN "normativa_responsabilidad_texto";
  ALTER TABLE "about_us" DROP COLUMN "normativa_pdf_texto_boton";
  ALTER TABLE "about_us" DROP COLUMN "normativa_pdf_id";
  DROP TYPE "public"."enum_about_us_normativa_tarjetas_icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_us_normativa_tarjetas_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TABLE "about_us_normativa_tarjetas_puntos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "about_us_normativa_tarjetas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_us_normativa_tarjetas_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"badge" varchar,
  	"description" varchar,
  	"nota_titulo" varchar,
  	"nota_texto" varchar
  );
  
  ALTER TABLE "about_us_blocks_cards_features_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_blocks_image_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_blocks_schedule_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_blocks_contact_info_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_blocks_help_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_blocks_rules_cards_block_cards_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_blocks_rules_cards_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_blocks_rules_cards_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_blocks_notice_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_blocks_download_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_us_blocks_cards_features_block" CASCADE;
  DROP TABLE "about_us_blocks_image_text_block" CASCADE;
  DROP TABLE "about_us_blocks_schedule_block" CASCADE;
  DROP TABLE "about_us_blocks_contact_info_block" CASCADE;
  DROP TABLE "about_us_blocks_map_block" CASCADE;
  DROP TABLE "about_us_blocks_help_cta_block" CASCADE;
  DROP TABLE "about_us_blocks_rules_cards_block_cards_points" CASCADE;
  DROP TABLE "about_us_blocks_rules_cards_block_cards" CASCADE;
  DROP TABLE "about_us_blocks_rules_cards_block" CASCADE;
  DROP TABLE "about_us_blocks_notice_block" CASCADE;
  DROP TABLE "about_us_blocks_download_block" CASCADE;
  ALTER TABLE "about_us" ADD COLUMN "quienes_somos_imagen_dirigidos_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "quienes_somos_ayudas_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "quienes_somos_dirigidos_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "horarios_info_titulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_edificio_nombre" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_edificio_subtitulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_horario_titulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_horario_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "horarios_ubicacion_titulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_direccion_linea1" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_direccion_linea2" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_contacto_titulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_telefono" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_email" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_boton_contactar" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_boton_como_llegar" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_mapa_url" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_mapa_embed_url" varchar;
  ALTER TABLE "about_us" ADD COLUMN "horarios_ayuda_cta_id" integer;
  ALTER TABLE "about_us" ADD COLUMN "normativa_responsabilidad_titulo" varchar;
  ALTER TABLE "about_us" ADD COLUMN "normativa_responsabilidad_texto" varchar;
  ALTER TABLE "about_us" ADD COLUMN "normativa_pdf_texto_boton" varchar;
  ALTER TABLE "about_us" ADD COLUMN "normativa_pdf_id" integer;
  ALTER TABLE "about_us_normativa_tarjetas_puntos" ADD CONSTRAINT "about_us_normativa_tarjetas_puntos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us_normativa_tarjetas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_normativa_tarjetas" ADD CONSTRAINT "about_us_normativa_tarjetas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_us_normativa_tarjetas_puntos_order_idx" ON "about_us_normativa_tarjetas_puntos" USING btree ("_order");
  CREATE INDEX "about_us_normativa_tarjetas_puntos_parent_id_idx" ON "about_us_normativa_tarjetas_puntos" USING btree ("_parent_id");
  CREATE INDEX "about_us_normativa_tarjetas_order_idx" ON "about_us_normativa_tarjetas" USING btree ("_order");
  CREATE INDEX "about_us_normativa_tarjetas_parent_id_idx" ON "about_us_normativa_tarjetas" USING btree ("_parent_id");
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_quienes_somos_imagen_dirigidos_id_media_id_fk" FOREIGN KEY ("quienes_somos_imagen_dirigidos_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_quienes_somos_ayudas_id_features_id_fk" FOREIGN KEY ("quienes_somos_ayudas_id") REFERENCES "public"."features"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_quienes_somos_dirigidos_id_features_id_fk" FOREIGN KEY ("quienes_somos_dirigidos_id") REFERENCES "public"."features"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_horarios_horario_id_schedule_id_fk" FOREIGN KEY ("horarios_horario_id") REFERENCES "public"."schedule"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_horarios_ayuda_cta_id_cta_id_fk" FOREIGN KEY ("horarios_ayuda_cta_id") REFERENCES "public"."cta"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_normativa_pdf_id_media_id_fk" FOREIGN KEY ("normativa_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_us_quienes_somos_quienes_somos_imagen_dirigidos_idx" ON "about_us" USING btree ("quienes_somos_imagen_dirigidos_id");
  CREATE INDEX "about_us_quienes_somos_quienes_somos_ayudas_idx" ON "about_us" USING btree ("quienes_somos_ayudas_id");
  CREATE INDEX "about_us_quienes_somos_quienes_somos_dirigidos_idx" ON "about_us" USING btree ("quienes_somos_dirigidos_id");
  CREATE INDEX "about_us_horarios_horarios_horario_idx" ON "about_us" USING btree ("horarios_horario_id");
  CREATE INDEX "about_us_horarios_horarios_ayuda_cta_idx" ON "about_us" USING btree ("horarios_ayuda_cta_id");
  CREATE INDEX "about_us_normativa_normativa_pdf_idx" ON "about_us" USING btree ("normativa_pdf_id");
  DROP TYPE "public"."enum_about_us_blocks_cards_features_block_style";
  DROP TYPE "public"."enum_about_us_blocks_image_text_block_image_position";
  DROP TYPE "public"."enum_about_us_blocks_rules_cards_block_cards_icon";`)
}

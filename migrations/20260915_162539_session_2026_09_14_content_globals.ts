import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_electronic_resources_access_accesos_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark');
  CREATE TYPE "public"."enum_schedule_schedule_type" AS ENUM('regular', 'closed', 'extended', 'holiday');
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE 'Search';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE 'Megaphone';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE 'Lock';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE 'Fingerprint';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE 'BarChart3';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE 'HeartHandshake';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE 'BookOpenCheck';
  ALTER TYPE "public"."enum_statistics_stats_icon" ADD VALUE 'Landmark';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE 'Search';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE 'Megaphone';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE 'Lock';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE 'Fingerprint';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE 'BarChart3';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE 'HeartHandshake';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE 'BookOpenCheck';
  ALTER TYPE "public"."enum_features_feature_icon" ADD VALUE 'Landmark';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE 'Search';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE 'Megaphone';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE 'Lock';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE 'Fingerprint';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE 'BarChart3';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE 'HeartHandshake';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE 'BookOpenCheck';
  ALTER TYPE "public"."enum_footer_seccion_info_information_icon" ADD VALUE 'Landmark';
  CREATE TABLE "electronic_resources_access_accesos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_electronic_resources_access_accesos_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"cta" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "electronic_resources_access" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "schedule_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"hours" varchar NOT NULL,
  	"type" "enum_schedule_schedule_type" DEFAULT 'regular'
  );
  
  CREATE TABLE "schedule" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "formation_enlaces_rapidos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link" varchar NOT NULL
  );
  
  CREATE TABLE "electronic_resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"accesos_destacados_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "quienes_somos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"imagen_dirigidos_id" integer,
  	"ayudas_id" integer,
  	"dirigidos_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "horarios_contacto" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"edificio_nombre" varchar,
  	"edificio_subtitulo" varchar,
  	"horario_id" integer,
  	"direccion_linea1" varchar,
  	"direccion_linea2" varchar,
  	"telefono" varchar,
  	"email" varchar,
  	"mapa_url" varchar,
  	"mapa_embed_url" varchar,
  	"ayuda_cta_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "electronic_resources_access_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "schedule_id" integer;
  ALTER TABLE "investigation" ADD COLUMN "accesos_rapidos_id" integer;
  ALTER TABLE "investigation" ADD COLUMN "tarjetas_id" integer;
  ALTER TABLE "investigation" ADD COLUMN "cta_id" integer;
  ALTER TABLE "formation" ADD COLUMN "buscar_parrafo_1" varchar;
  ALTER TABLE "formation" ADD COLUMN "buscar_parrafo_2" varchar;
  ALTER TABLE "formation" ADD COLUMN "citar_cta_id" integer;
  ALTER TABLE "formation" ADD COLUMN "guias_tutoriales_id" integer;
  ALTER TABLE "formation" ADD COLUMN "actividades_texto" varchar;
  ALTER TABLE "formation" ADD COLUMN "actividades_estado" varchar;
  ALTER TABLE "electronic_resources_access_accesos" ADD CONSTRAINT "electronic_resources_access_accesos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."electronic_resources_access"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "schedule_schedule" ADD CONSTRAINT "schedule_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_enlaces_rapidos" ADD CONSTRAINT "formation_enlaces_rapidos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "electronic_resources" ADD CONSTRAINT "electronic_resources_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "electronic_resources" ADD CONSTRAINT "electronic_resources_accesos_destacados_id_electronic_resources_access_id_fk" FOREIGN KEY ("accesos_destacados_id") REFERENCES "public"."electronic_resources_access"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quienes_somos" ADD CONSTRAINT "quienes_somos_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quienes_somos" ADD CONSTRAINT "quienes_somos_imagen_dirigidos_id_media_id_fk" FOREIGN KEY ("imagen_dirigidos_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quienes_somos" ADD CONSTRAINT "quienes_somos_ayudas_id_features_id_fk" FOREIGN KEY ("ayudas_id") REFERENCES "public"."features"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quienes_somos" ADD CONSTRAINT "quienes_somos_dirigidos_id_features_id_fk" FOREIGN KEY ("dirigidos_id") REFERENCES "public"."features"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horarios_contacto" ADD CONSTRAINT "horarios_contacto_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horarios_contacto" ADD CONSTRAINT "horarios_contacto_horario_id_schedule_id_fk" FOREIGN KEY ("horario_id") REFERENCES "public"."schedule"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horarios_contacto" ADD CONSTRAINT "horarios_contacto_ayuda_cta_id_cta_id_fk" FOREIGN KEY ("ayuda_cta_id") REFERENCES "public"."cta"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "electronic_resources_access_accesos_order_idx" ON "electronic_resources_access_accesos" USING btree ("_order");
  CREATE INDEX "electronic_resources_access_accesos_parent_id_idx" ON "electronic_resources_access_accesos" USING btree ("_parent_id");
  CREATE INDEX "electronic_resources_access_updated_at_idx" ON "electronic_resources_access" USING btree ("updated_at");
  CREATE INDEX "electronic_resources_access_created_at_idx" ON "electronic_resources_access" USING btree ("created_at");
  CREATE INDEX "schedule_schedule_order_idx" ON "schedule_schedule" USING btree ("_order");
  CREATE INDEX "schedule_schedule_parent_id_idx" ON "schedule_schedule" USING btree ("_parent_id");
  CREATE INDEX "schedule_updated_at_idx" ON "schedule" USING btree ("updated_at");
  CREATE INDEX "schedule_created_at_idx" ON "schedule" USING btree ("created_at");
  CREATE INDEX "formation_enlaces_rapidos_order_idx" ON "formation_enlaces_rapidos" USING btree ("_order");
  CREATE INDEX "formation_enlaces_rapidos_parent_id_idx" ON "formation_enlaces_rapidos" USING btree ("_parent_id");
  CREATE INDEX "electronic_resources_hero_idx" ON "electronic_resources" USING btree ("hero_id");
  CREATE INDEX "electronic_resources_accesos_destacados_idx" ON "electronic_resources" USING btree ("accesos_destacados_id");
  CREATE INDEX "quienes_somos_hero_idx" ON "quienes_somos" USING btree ("hero_id");
  CREATE INDEX "quienes_somos_imagen_dirigidos_idx" ON "quienes_somos" USING btree ("imagen_dirigidos_id");
  CREATE INDEX "quienes_somos_ayudas_idx" ON "quienes_somos" USING btree ("ayudas_id");
  CREATE INDEX "quienes_somos_dirigidos_idx" ON "quienes_somos" USING btree ("dirigidos_id");
  CREATE INDEX "horarios_contacto_hero_idx" ON "horarios_contacto" USING btree ("hero_id");
  CREATE INDEX "horarios_contacto_horario_idx" ON "horarios_contacto" USING btree ("horario_id");
  CREATE INDEX "horarios_contacto_ayuda_cta_idx" ON "horarios_contacto" USING btree ("ayuda_cta_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_electronic_resources_access_fk" FOREIGN KEY ("electronic_resources_access_id") REFERENCES "public"."electronic_resources_access"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_schedule_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation" ADD CONSTRAINT "investigation_accesos_rapidos_id_features_id_fk" FOREIGN KEY ("accesos_rapidos_id") REFERENCES "public"."features"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investigation" ADD CONSTRAINT "investigation_tarjetas_id_electronic_resources_access_id_fk" FOREIGN KEY ("tarjetas_id") REFERENCES "public"."electronic_resources_access"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investigation" ADD CONSTRAINT "investigation_cta_id_cta_id_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "formation" ADD CONSTRAINT "formation_citar_cta_id_cta_id_fk" FOREIGN KEY ("citar_cta_id") REFERENCES "public"."cta"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "formation" ADD CONSTRAINT "formation_guias_tutoriales_id_electronic_resources_access_id_fk" FOREIGN KEY ("guias_tutoriales_id") REFERENCES "public"."electronic_resources_access"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_electronic_resources_acces_idx" ON "payload_locked_documents_rels" USING btree ("electronic_resources_access_id");
  CREATE INDEX "payload_locked_documents_rels_schedule_id_idx" ON "payload_locked_documents_rels" USING btree ("schedule_id");
  CREATE INDEX "investigation_accesos_rapidos_idx" ON "investigation" USING btree ("accesos_rapidos_id");
  CREATE INDEX "investigation_tarjetas_idx" ON "investigation" USING btree ("tarjetas_id");
  CREATE INDEX "investigation_cta_idx" ON "investigation" USING btree ("cta_id");
  CREATE INDEX "formation_citar_cta_idx" ON "formation" USING btree ("citar_cta_id");
  CREATE INDEX "formation_guias_tutoriales_idx" ON "formation" USING btree ("guias_tutoriales_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "electronic_resources_access_accesos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "electronic_resources_access" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "schedule_schedule" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "schedule" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "formation_enlaces_rapidos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "electronic_resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quienes_somos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "horarios_contacto" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "electronic_resources_access_accesos" CASCADE;
  DROP TABLE "electronic_resources_access" CASCADE;
  DROP TABLE "schedule_schedule" CASCADE;
  DROP TABLE "schedule" CASCADE;
  DROP TABLE "formation_enlaces_rapidos" CASCADE;
  DROP TABLE "electronic_resources" CASCADE;
  DROP TABLE "quienes_somos" CASCADE;
  DROP TABLE "horarios_contacto" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_electronic_resources_access_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_schedule_fk";
  
  ALTER TABLE "investigation" DROP CONSTRAINT "investigation_accesos_rapidos_id_features_id_fk";
  
  ALTER TABLE "investigation" DROP CONSTRAINT "investigation_tarjetas_id_electronic_resources_access_id_fk";
  
  ALTER TABLE "investigation" DROP CONSTRAINT "investigation_cta_id_cta_id_fk";
  
  ALTER TABLE "formation" DROP CONSTRAINT "formation_citar_cta_id_cta_id_fk";
  
  ALTER TABLE "formation" DROP CONSTRAINT "formation_guias_tutoriales_id_electronic_resources_access_id_fk";
  
  ALTER TABLE "statistics_stats" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_statistics_stats_icon";
  CREATE TYPE "public"."enum_statistics_stats_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar');
  ALTER TABLE "statistics_stats" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_statistics_stats_icon" USING "icon"::"public"."enum_statistics_stats_icon";
  ALTER TABLE "features_feature" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_features_feature_icon";
  CREATE TYPE "public"."enum_features_feature_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar');
  ALTER TABLE "features_feature" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_features_feature_icon" USING "icon"::"public"."enum_features_feature_icon";
  ALTER TABLE "footer_seccion_info_information" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_footer_seccion_info_information_icon";
  CREATE TYPE "public"."enum_footer_seccion_info_information_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar');
  ALTER TABLE "footer_seccion_info_information" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_footer_seccion_info_information_icon" USING "icon"::"public"."enum_footer_seccion_info_information_icon";
  DROP INDEX "payload_locked_documents_rels_electronic_resources_acces_idx";
  DROP INDEX "payload_locked_documents_rels_schedule_id_idx";
  DROP INDEX "investigation_accesos_rapidos_idx";
  DROP INDEX "investigation_tarjetas_idx";
  DROP INDEX "investigation_cta_idx";
  DROP INDEX "formation_citar_cta_idx";
  DROP INDEX "formation_guias_tutoriales_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "electronic_resources_access_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "schedule_id";
  ALTER TABLE "investigation" DROP COLUMN "accesos_rapidos_id";
  ALTER TABLE "investigation" DROP COLUMN "tarjetas_id";
  ALTER TABLE "investigation" DROP COLUMN "cta_id";
  ALTER TABLE "formation" DROP COLUMN "buscar_parrafo_1";
  ALTER TABLE "formation" DROP COLUMN "buscar_parrafo_2";
  ALTER TABLE "formation" DROP COLUMN "citar_cta_id";
  ALTER TABLE "formation" DROP COLUMN "guias_tutoriales_id";
  ALTER TABLE "formation" DROP COLUMN "actividades_texto";
  ALTER TABLE "formation" DROP COLUMN "actividades_estado";
  DROP TYPE "public"."enum_electronic_resources_access_accesos_icon";
  DROP TYPE "public"."enum_schedule_schedule_type";`)
}

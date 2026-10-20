import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const CONOCENOS_PAGES = [
  { tab: 'quienes_somos', slug: 'conocenos/quienes-somos', title: 'Quiénes somos', hero_variant: 'split' },
  { tab: 'horarios', slug: 'conocenos/horarios-ubicacion-y-contacto', title: 'Horarios, ubicación y contacto', hero_variant: 'simple' },
  { tab: 'normativa', slug: 'conocenos/normativa-y-condiciones-de-uso', title: 'Normativa y condiciones de uso', hero_variant: 'simple' },
] as const

const stripIds = (value: any, key?: string): any => {
  if (key === 'text') return value
  if (Array.isArray(value)) return value.map((item) => stripIds(item))
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === 'id') continue
      out[k] = stripIds(v, k)
    }
    return out
  }
  return value
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cards_features_block_style" AS ENUM('default', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_image_text_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_rules_cards_block_cards_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum_pages_hero_variant" AS ENUM('simple', 'split');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_features_block_style" AS ENUM('default', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_rules_cards_block_cards_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum__pages_v_version_hero_variant" AS ENUM('simple', 'split');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "pages_blocks_cards_features_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"features_id" integer,
  	"style" "enum_pages_blocks_cards_features_block_style" DEFAULT 'default',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"text" jsonb,
  	"image_position" "enum_pages_blocks_image_text_block_image_position" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_schedule_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"schedule_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_info_block" (
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
  
  CREATE TABLE "pages_blocks_map_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"map_url" varchar,
  	"map_embed_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_help_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rules_cards_block_cards_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_rules_cards_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_rules_cards_block_cards_icon",
  	"title" varchar,
  	"badge" varchar,
  	"description" varchar,
  	"note_title" varchar,
  	"note_text" varchar
  );
  
  CREATE TABLE "pages_blocks_rules_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_notice_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_download_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_label" varchar,
  	"file_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"meta_description" varchar,
  	"hero_id" integer,
  	"hero_variant" "enum_pages_hero_variant" DEFAULT 'simple',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_blocks_cards_features_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"features_id" integer,
  	"style" "enum__pages_v_blocks_cards_features_block_style" DEFAULT 'default',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"text" jsonb,
  	"image_position" "enum__pages_v_blocks_image_text_block_image_position" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_schedule_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"schedule_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_info_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
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
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_map_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"map_url" varchar,
  	"map_embed_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_help_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rules_cards_block_cards_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rules_cards_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_rules_cards_block_cards_icon",
  	"title" varchar,
  	"badge" varchar,
  	"description" varchar,
  	"note_title" varchar,
  	"note_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rules_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_notice_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_download_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"button_label" varchar,
  	"file_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_meta_description" varchar,
  	"version_hero_id" integer,
  	"version_hero_variant" "enum__pages_v_version_hero_variant" DEFAULT 'simple',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "pages_blocks_cards_features_block" ADD CONSTRAINT "pages_blocks_cards_features_block_features_id_features_id_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_features_block" ADD CONSTRAINT "pages_blocks_cards_features_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_features_block" ADD CONSTRAINT "pages_blocks_cards_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text_block" ADD CONSTRAINT "pages_blocks_image_text_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text_block" ADD CONSTRAINT "pages_blocks_image_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_schedule_block" ADD CONSTRAINT "pages_blocks_schedule_block_schedule_id_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_schedule_block" ADD CONSTRAINT "pages_blocks_schedule_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_info_block" ADD CONSTRAINT "pages_blocks_contact_info_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_map_block" ADD CONSTRAINT "pages_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_help_cta_block" ADD CONSTRAINT "pages_blocks_help_cta_block_cta_id_cta_id_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_help_cta_block" ADD CONSTRAINT "pages_blocks_help_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rules_cards_block_cards_points" ADD CONSTRAINT "pages_blocks_rules_cards_block_cards_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rules_cards_block_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rules_cards_block_cards" ADD CONSTRAINT "pages_blocks_rules_cards_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rules_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rules_cards_block" ADD CONSTRAINT "pages_blocks_rules_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_notice_block" ADD CONSTRAINT "pages_blocks_notice_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_download_block" ADD CONSTRAINT "pages_blocks_download_block_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_download_block" ADD CONSTRAINT "pages_blocks_download_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_features_block" ADD CONSTRAINT "_pages_v_blocks_cards_features_block_features_id_features_id_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_features_block" ADD CONSTRAINT "_pages_v_blocks_cards_features_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_features_block" ADD CONSTRAINT "_pages_v_blocks_cards_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text_block" ADD CONSTRAINT "_pages_v_blocks_image_text_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text_block" ADD CONSTRAINT "_pages_v_blocks_image_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_schedule_block" ADD CONSTRAINT "_pages_v_blocks_schedule_block_schedule_id_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_schedule_block" ADD CONSTRAINT "_pages_v_blocks_schedule_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_info_block" ADD CONSTRAINT "_pages_v_blocks_contact_info_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_map_block" ADD CONSTRAINT "_pages_v_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_help_cta_block" ADD CONSTRAINT "_pages_v_blocks_help_cta_block_cta_id_cta_id_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_help_cta_block" ADD CONSTRAINT "_pages_v_blocks_help_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rules_cards_block_cards_points" ADD CONSTRAINT "_pages_v_blocks_rules_cards_block_cards_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rules_cards_block_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rules_cards_block_cards" ADD CONSTRAINT "_pages_v_blocks_rules_cards_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rules_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rules_cards_block" ADD CONSTRAINT "_pages_v_blocks_rules_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_notice_block" ADD CONSTRAINT "_pages_v_blocks_notice_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_download_block" ADD CONSTRAINT "_pages_v_blocks_download_block_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_download_block" ADD CONSTRAINT "_pages_v_blocks_download_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_id_hero_id_fk" FOREIGN KEY ("version_hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_cards_features_block_order_idx" ON "pages_blocks_cards_features_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_features_block_parent_id_idx" ON "pages_blocks_cards_features_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_features_block_path_idx" ON "pages_blocks_cards_features_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_cards_features_block_features_idx" ON "pages_blocks_cards_features_block" USING btree ("features_id");
  CREATE INDEX "pages_blocks_cards_features_block_image_idx" ON "pages_blocks_cards_features_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_text_block_order_idx" ON "pages_blocks_image_text_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_block_parent_id_idx" ON "pages_blocks_image_text_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_block_path_idx" ON "pages_blocks_image_text_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_block_image_idx" ON "pages_blocks_image_text_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_schedule_block_order_idx" ON "pages_blocks_schedule_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_schedule_block_parent_id_idx" ON "pages_blocks_schedule_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_schedule_block_path_idx" ON "pages_blocks_schedule_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_schedule_block_schedule_idx" ON "pages_blocks_schedule_block" USING btree ("schedule_id");
  CREATE INDEX "pages_blocks_contact_info_block_order_idx" ON "pages_blocks_contact_info_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_info_block_parent_id_idx" ON "pages_blocks_contact_info_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_info_block_path_idx" ON "pages_blocks_contact_info_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_map_block_order_idx" ON "pages_blocks_map_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_map_block_parent_id_idx" ON "pages_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_map_block_path_idx" ON "pages_blocks_map_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_help_cta_block_order_idx" ON "pages_blocks_help_cta_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_help_cta_block_parent_id_idx" ON "pages_blocks_help_cta_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_help_cta_block_path_idx" ON "pages_blocks_help_cta_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_help_cta_block_cta_idx" ON "pages_blocks_help_cta_block" USING btree ("cta_id");
  CREATE INDEX "pages_blocks_rules_cards_block_cards_points_order_idx" ON "pages_blocks_rules_cards_block_cards_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_rules_cards_block_cards_points_parent_id_idx" ON "pages_blocks_rules_cards_block_cards_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rules_cards_block_cards_order_idx" ON "pages_blocks_rules_cards_block_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_rules_cards_block_cards_parent_id_idx" ON "pages_blocks_rules_cards_block_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rules_cards_block_order_idx" ON "pages_blocks_rules_cards_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_rules_cards_block_parent_id_idx" ON "pages_blocks_rules_cards_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rules_cards_block_path_idx" ON "pages_blocks_rules_cards_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_notice_block_order_idx" ON "pages_blocks_notice_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_notice_block_parent_id_idx" ON "pages_blocks_notice_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_notice_block_path_idx" ON "pages_blocks_notice_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_download_block_order_idx" ON "pages_blocks_download_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_download_block_parent_id_idx" ON "pages_blocks_download_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_download_block_path_idx" ON "pages_blocks_download_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_download_block_file_idx" ON "pages_blocks_download_block" USING btree ("file_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_idx" ON "pages" USING btree ("hero_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_cards_features_block_order_idx" ON "_pages_v_blocks_cards_features_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_features_block_parent_id_idx" ON "_pages_v_blocks_cards_features_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_features_block_path_idx" ON "_pages_v_blocks_cards_features_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cards_features_block_features_idx" ON "_pages_v_blocks_cards_features_block" USING btree ("features_id");
  CREATE INDEX "_pages_v_blocks_cards_features_block_image_idx" ON "_pages_v_blocks_cards_features_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_text_block_order_idx" ON "_pages_v_blocks_image_text_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_block_parent_id_idx" ON "_pages_v_blocks_image_text_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_block_path_idx" ON "_pages_v_blocks_image_text_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_block_image_idx" ON "_pages_v_blocks_image_text_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_schedule_block_order_idx" ON "_pages_v_blocks_schedule_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_schedule_block_parent_id_idx" ON "_pages_v_blocks_schedule_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_schedule_block_path_idx" ON "_pages_v_blocks_schedule_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_schedule_block_schedule_idx" ON "_pages_v_blocks_schedule_block" USING btree ("schedule_id");
  CREATE INDEX "_pages_v_blocks_contact_info_block_order_idx" ON "_pages_v_blocks_contact_info_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_info_block_parent_id_idx" ON "_pages_v_blocks_contact_info_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_info_block_path_idx" ON "_pages_v_blocks_contact_info_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_map_block_order_idx" ON "_pages_v_blocks_map_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_map_block_parent_id_idx" ON "_pages_v_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_map_block_path_idx" ON "_pages_v_blocks_map_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_help_cta_block_order_idx" ON "_pages_v_blocks_help_cta_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_help_cta_block_parent_id_idx" ON "_pages_v_blocks_help_cta_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_help_cta_block_path_idx" ON "_pages_v_blocks_help_cta_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_help_cta_block_cta_idx" ON "_pages_v_blocks_help_cta_block" USING btree ("cta_id");
  CREATE INDEX "_pages_v_blocks_rules_cards_block_cards_points_order_idx" ON "_pages_v_blocks_rules_cards_block_cards_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rules_cards_block_cards_points_parent_id_idx" ON "_pages_v_blocks_rules_cards_block_cards_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rules_cards_block_cards_order_idx" ON "_pages_v_blocks_rules_cards_block_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rules_cards_block_cards_parent_id_idx" ON "_pages_v_blocks_rules_cards_block_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rules_cards_block_order_idx" ON "_pages_v_blocks_rules_cards_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rules_cards_block_parent_id_idx" ON "_pages_v_blocks_rules_cards_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rules_cards_block_path_idx" ON "_pages_v_blocks_rules_cards_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_notice_block_order_idx" ON "_pages_v_blocks_notice_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_notice_block_parent_id_idx" ON "_pages_v_blocks_notice_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_notice_block_path_idx" ON "_pages_v_blocks_notice_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_download_block_order_idx" ON "_pages_v_blocks_download_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_download_block_parent_id_idx" ON "_pages_v_blocks_download_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_download_block_path_idx" ON "_pages_v_blocks_download_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_download_block_file_idx" ON "_pages_v_blocks_download_block" USING btree ("file_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_hero_idx" ON "_pages_v" USING btree ("version_hero_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");`)

  const hasAboutUs = payload.config.globals.some((g) => g.slug === 'about_us')
  const hasPages = payload.config.collections.some((c) => c.slug === 'pages')
  if (!hasAboutUs || !hasPages) {
    payload.logger.warn('pages_collection: about_us o pages no están en la config, se omite la migración de datos')
    return
  }

  const aboutUs: any = await payload.findGlobal({ slug: 'about_us' as any, depth: 0, req })

  for (const page of CONOCENOS_PAGES) {
    const existing = await payload.find({
      collection: 'pages' as any,
      where: { slug: { equals: page.slug } },
      limit: 1,
      depth: 0,
      req,
    })
    if (existing.docs.length > 0) {
      payload.logger.info(`pages_collection: ${page.slug} ya existe, se omite`)
      continue
    }

    const source = aboutUs?.[page.tab] ?? {}
    const hero = source.hero && typeof source.hero === 'object' ? source.hero.id : source.hero

    await payload.create({
      collection: 'pages' as any,
      data: {
        title: page.title,
        slug: page.slug,
        hero: hero ?? null,
        hero_variant: page.hero_variant,
        layout: stripIds(source.layout ?? []),
        _status: 'published',
      } as any,
      draft: false,
      req,
    })
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  if (payload.config.collections.some((c) => c.slug === 'pages')) {
    await payload.delete({
      collection: 'pages' as any,
      where: { slug: { in: CONOCENOS_PAGES.map((page) => page.slug) } },
      req,
    })
  }

  await db.execute(sql`
   ALTER TABLE "pages_blocks_cards_features_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_schedule_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_info_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_help_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rules_cards_block_cards_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rules_cards_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rules_cards_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_notice_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_download_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cards_features_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_schedule_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contact_info_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_help_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rules_cards_block_cards_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rules_cards_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rules_cards_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_notice_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_download_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_cards_features_block" CASCADE;
  DROP TABLE "pages_blocks_image_text_block" CASCADE;
  DROP TABLE "pages_blocks_schedule_block" CASCADE;
  DROP TABLE "pages_blocks_contact_info_block" CASCADE;
  DROP TABLE "pages_blocks_map_block" CASCADE;
  DROP TABLE "pages_blocks_help_cta_block" CASCADE;
  DROP TABLE "pages_blocks_rules_cards_block_cards_points" CASCADE;
  DROP TABLE "pages_blocks_rules_cards_block_cards" CASCADE;
  DROP TABLE "pages_blocks_rules_cards_block" CASCADE;
  DROP TABLE "pages_blocks_notice_block" CASCADE;
  DROP TABLE "pages_blocks_download_block" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_features_block" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text_block" CASCADE;
  DROP TABLE "_pages_v_blocks_schedule_block" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_info_block" CASCADE;
  DROP TABLE "_pages_v_blocks_map_block" CASCADE;
  DROP TABLE "_pages_v_blocks_help_cta_block" CASCADE;
  DROP TABLE "_pages_v_blocks_rules_cards_block_cards_points" CASCADE;
  DROP TABLE "_pages_v_blocks_rules_cards_block_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_rules_cards_block" CASCADE;
  DROP TABLE "_pages_v_blocks_notice_block" CASCADE;
  DROP TABLE "_pages_v_blocks_download_block" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_pages_fk";
  
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  DROP TYPE "public"."enum_pages_blocks_cards_features_block_style";
  DROP TYPE "public"."enum_pages_blocks_image_text_block_image_position";
  DROP TYPE "public"."enum_pages_blocks_rules_cards_block_cards_icon";
  DROP TYPE "public"."enum_pages_hero_variant";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_cards_features_block_style";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_block_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_rules_cards_block_cards_icon";
  DROP TYPE "public"."enum__pages_v_version_hero_variant";
  DROP TYPE "public"."enum__pages_v_version_status";`)
}

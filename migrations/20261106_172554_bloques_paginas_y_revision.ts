import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_service_cards_block_cards_icon" AS ENUM('Search', 'BookOpen', 'RefreshCw', 'Bookmark', 'Headphones', 'BookPlus', 'User', 'Library', 'GraduationCap', 'FlaskConical', 'Laptop', 'Printer', 'Info');
  CREATE TYPE "public"."enum_pages_blocks_investigation_content_block_quick_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum_pages_blocks_investigation_content_block_cards_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum_pages_blocks_eres_content_block_featured_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum_pages_blocks_eres_content_block_cats_items_access" AS ENUM('subscription', 'open');
  CREATE TYPE "public"."enum_pages_blocks_eres_content_block_problem_tipo" AS ENUM('interno', 'ancla', 'registro', 'externo');
  CREATE TYPE "public"."enum_pages_blocks_eres_content_block_problem_ancla" AS ENUM('home-noticias', 'investigacion-apoyo');
  CREATE TYPE "public"."enum_pages_blocks_eres_content_block_problem_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'soporte_recursos');
  CREATE TYPE "public"."enum__pages_v_blocks_service_cards_block_cards_icon" AS ENUM('Search', 'BookOpen', 'RefreshCw', 'Bookmark', 'Headphones', 'BookPlus', 'User', 'Library', 'GraduationCap', 'FlaskConical', 'Laptop', 'Printer', 'Info');
  CREATE TYPE "public"."enum__pages_v_blocks_investigation_content_block_quick_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum__pages_v_blocks_investigation_content_block_cards_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum__pages_v_blocks_eres_content_block_featured_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum__pages_v_blocks_eres_content_block_cats_items_access" AS ENUM('subscription', 'open');
  CREATE TYPE "public"."enum__pages_v_blocks_eres_content_block_problem_tipo" AS ENUM('interno', 'ancla', 'registro', 'externo');
  CREATE TYPE "public"."enum__pages_v_blocks_eres_content_block_problem_ancla" AS ENUM('home-noticias', 'investigacion-apoyo');
  CREATE TYPE "public"."enum__pages_v_blocks_eres_content_block_problem_enlace_key" AS ENUM('opac', 'dspace', 'campus', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'soporte_recursos');
  CREATE TABLE "pages_blocks_service_cards_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_service_cards_block_cards_icon" DEFAULT 'Search',
  	"title" varchar,
  	"text" varchar,
  	"badge" varchar,
  	"action_label" varchar,
  	"action_href" varchar,
  	"wide" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_service_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"account_title" varchar,
  	"account_text_in" varchar,
  	"account_text_out" varchar,
  	"account_button_in" varchar,
  	"account_button_out" varchar,
  	"show_suggestion" boolean DEFAULT true,
  	"suggestion_title" varchar,
  	"suggestion_text" varchar,
  	"suggestion_button" varchar,
  	"suggestion_hint" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_formation_content_block_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_formation_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_note" varchar,
  	"search_title" varchar,
  	"search_paragraph_1" varchar,
  	"search_paragraph_2" varchar,
  	"cite_title" varchar,
  	"cite_text" varchar,
  	"cite_button_label" varchar,
  	"cite_button_link" varchar,
  	"guides_heading" varchar,
  	"guides_text" varchar,
  	"guide_title" varchar,
  	"guide_description" varchar,
  	"guide_link" varchar,
  	"activities_title" varchar,
  	"activities_text" varchar,
  	"activities_status_label" varchar,
  	"activities_status" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_investigation_content_block_quick" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_investigation_content_block_quick_icon",
  	"title" varchar
  );
  
  CREATE TABLE "pages_blocks_investigation_content_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_investigation_content_block_cards_icon",
  	"title" varchar,
  	"description" varchar,
  	"cta" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_investigation_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quick_title" varchar,
  	"support_title" varchar,
  	"support_text" varchar,
  	"support_button_label" varchar,
  	"support_button_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_eres_content_block_featured" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_eres_content_block_featured_icon",
  	"title" varchar,
  	"description" varchar,
  	"cta" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_eres_content_block_remote_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_eres_content_block_cats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"access" "enum_pages_blocks_eres_content_block_cats_items_access" DEFAULT 'subscription',
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_eres_content_block_cats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "pages_blocks_eres_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"featured_title" varchar,
  	"remote_title" varchar,
  	"remote_description" varchar,
  	"remote_portal_title" varchar,
  	"remote_portal_description" varchar,
  	"remote_portal_button_label" varchar,
  	"remote_portal_button_link" varchar,
  	"problem_text" varchar,
  	"problem_tipo" "enum_pages_blocks_eres_content_block_problem_tipo" DEFAULT 'registro',
  	"problem_to" varchar,
  	"problem_ancla" "enum_pages_blocks_eres_content_block_problem_ancla",
  	"problem_enlace_key" "enum_pages_blocks_eres_content_block_problem_enlace_key",
  	"problem_url" varchar,
  	"problem_nueva_pestana" boolean,
  	"categories_title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_table_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_table_block_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_table_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_cards_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_service_cards_block_cards_icon" DEFAULT 'Search',
  	"title" varchar,
  	"text" varchar,
  	"badge" varchar,
  	"action_label" varchar,
  	"action_href" varchar,
  	"wide" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"account_title" varchar,
  	"account_text_in" varchar,
  	"account_text_out" varchar,
  	"account_button_in" varchar,
  	"account_button_out" varchar,
  	"show_suggestion" boolean DEFAULT true,
  	"suggestion_title" varchar,
  	"suggestion_text" varchar,
  	"suggestion_button" varchar,
  	"suggestion_hint" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_formation_content_block_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_formation_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_note" varchar,
  	"search_title" varchar,
  	"search_paragraph_1" varchar,
  	"search_paragraph_2" varchar,
  	"cite_title" varchar,
  	"cite_text" varchar,
  	"cite_button_label" varchar,
  	"cite_button_link" varchar,
  	"guides_heading" varchar,
  	"guides_text" varchar,
  	"guide_title" varchar,
  	"guide_description" varchar,
  	"guide_link" varchar,
  	"activities_title" varchar,
  	"activities_text" varchar,
  	"activities_status_label" varchar,
  	"activities_status" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_investigation_content_block_quick" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_investigation_content_block_quick_icon",
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_investigation_content_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_investigation_content_block_cards_icon",
  	"title" varchar,
  	"description" varchar,
  	"cta" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_investigation_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quick_title" varchar,
  	"support_title" varchar,
  	"support_text" varchar,
  	"support_button_label" varchar,
  	"support_button_link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_eres_content_block_featured" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_eres_content_block_featured_icon",
  	"title" varchar,
  	"description" varchar,
  	"cta" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_eres_content_block_remote_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_eres_content_block_cats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"access" "enum__pages_v_blocks_eres_content_block_cats_items_access" DEFAULT 'subscription',
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_eres_content_block_cats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_eres_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_title" varchar,
  	"remote_title" varchar,
  	"remote_description" varchar,
  	"remote_portal_title" varchar,
  	"remote_portal_description" varchar,
  	"remote_portal_button_label" varchar,
  	"remote_portal_button_link" varchar,
  	"problem_text" varchar,
  	"problem_tipo" "enum__pages_v_blocks_eres_content_block_problem_tipo" DEFAULT 'registro',
  	"problem_to" varchar,
  	"problem_ancla" "enum__pages_v_blocks_eres_content_block_problem_ancla",
  	"problem_enlace_key" "enum__pages_v_blocks_eres_content_block_problem_enlace_key",
  	"problem_url" varchar,
  	"problem_nueva_pestana" boolean,
  	"categories_title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_block_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_service_cards_block_cards" ADD CONSTRAINT "pages_blocks_service_cards_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_cards_block" ADD CONSTRAINT "pages_blocks_service_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_formation_content_block_quick_links" ADD CONSTRAINT "pages_blocks_formation_content_block_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_formation_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_formation_content_block" ADD CONSTRAINT "pages_blocks_formation_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_investigation_content_block_quick" ADD CONSTRAINT "pages_blocks_investigation_content_block_quick_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_investigation_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_investigation_content_block_cards" ADD CONSTRAINT "pages_blocks_investigation_content_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_investigation_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_investigation_content_block" ADD CONSTRAINT "pages_blocks_investigation_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_eres_content_block_featured" ADD CONSTRAINT "pages_blocks_eres_content_block_featured_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_eres_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_eres_content_block_remote_points" ADD CONSTRAINT "pages_blocks_eres_content_block_remote_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_eres_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_eres_content_block_cats_items" ADD CONSTRAINT "pages_blocks_eres_content_block_cats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_eres_content_block_cats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_eres_content_block_cats" ADD CONSTRAINT "pages_blocks_eres_content_block_cats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_eres_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_eres_content_block" ADD CONSTRAINT "pages_blocks_eres_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_block" ADD CONSTRAINT "pages_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_block_columns" ADD CONSTRAINT "pages_blocks_table_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_block_rows_cells" ADD CONSTRAINT "pages_blocks_table_block_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table_block_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_block_rows" ADD CONSTRAINT "pages_blocks_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_block" ADD CONSTRAINT "pages_blocks_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_cards_block_cards" ADD CONSTRAINT "_pages_v_blocks_service_cards_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_cards_block" ADD CONSTRAINT "_pages_v_blocks_service_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_formation_content_block_quick_links" ADD CONSTRAINT "_pages_v_blocks_formation_content_block_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_formation_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_formation_content_block" ADD CONSTRAINT "_pages_v_blocks_formation_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_investigation_content_block_quick" ADD CONSTRAINT "_pages_v_blocks_investigation_content_block_quick_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_investigation_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_investigation_content_block_cards" ADD CONSTRAINT "_pages_v_blocks_investigation_content_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_investigation_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_investigation_content_block" ADD CONSTRAINT "_pages_v_blocks_investigation_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_eres_content_block_featured" ADD CONSTRAINT "_pages_v_blocks_eres_content_block_featured_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_eres_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_eres_content_block_remote_points" ADD CONSTRAINT "_pages_v_blocks_eres_content_block_remote_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_eres_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_eres_content_block_cats_items" ADD CONSTRAINT "_pages_v_blocks_eres_content_block_cats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_eres_content_block_cats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_eres_content_block_cats" ADD CONSTRAINT "_pages_v_blocks_eres_content_block_cats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_eres_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_eres_content_block" ADD CONSTRAINT "_pages_v_blocks_eres_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD CONSTRAINT "_pages_v_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_block_columns" ADD CONSTRAINT "_pages_v_blocks_table_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_block_rows_cells" ADD CONSTRAINT "_pages_v_blocks_table_block_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table_block_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_block_rows" ADD CONSTRAINT "_pages_v_blocks_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_block" ADD CONSTRAINT "_pages_v_blocks_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_service_cards_block_cards_order_idx" ON "pages_blocks_service_cards_block_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_cards_block_cards_parent_id_idx" ON "pages_blocks_service_cards_block_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_cards_block_order_idx" ON "pages_blocks_service_cards_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_cards_block_parent_id_idx" ON "pages_blocks_service_cards_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_cards_block_path_idx" ON "pages_blocks_service_cards_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_formation_content_block_quick_links_order_idx" ON "pages_blocks_formation_content_block_quick_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_formation_content_block_quick_links_parent_id_idx" ON "pages_blocks_formation_content_block_quick_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_formation_content_block_order_idx" ON "pages_blocks_formation_content_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_formation_content_block_parent_id_idx" ON "pages_blocks_formation_content_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_formation_content_block_path_idx" ON "pages_blocks_formation_content_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_investigation_content_block_quick_order_idx" ON "pages_blocks_investigation_content_block_quick" USING btree ("_order");
  CREATE INDEX "pages_blocks_investigation_content_block_quick_parent_id_idx" ON "pages_blocks_investigation_content_block_quick" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_investigation_content_block_cards_order_idx" ON "pages_blocks_investigation_content_block_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_investigation_content_block_cards_parent_id_idx" ON "pages_blocks_investigation_content_block_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_investigation_content_block_order_idx" ON "pages_blocks_investigation_content_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_investigation_content_block_parent_id_idx" ON "pages_blocks_investigation_content_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_investigation_content_block_path_idx" ON "pages_blocks_investigation_content_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_eres_content_block_featured_order_idx" ON "pages_blocks_eres_content_block_featured" USING btree ("_order");
  CREATE INDEX "pages_blocks_eres_content_block_featured_parent_id_idx" ON "pages_blocks_eres_content_block_featured" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_eres_content_block_remote_points_order_idx" ON "pages_blocks_eres_content_block_remote_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_eres_content_block_remote_points_parent_id_idx" ON "pages_blocks_eres_content_block_remote_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_eres_content_block_cats_items_order_idx" ON "pages_blocks_eres_content_block_cats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_eres_content_block_cats_items_parent_id_idx" ON "pages_blocks_eres_content_block_cats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_eres_content_block_cats_order_idx" ON "pages_blocks_eres_content_block_cats" USING btree ("_order");
  CREATE INDEX "pages_blocks_eres_content_block_cats_parent_id_idx" ON "pages_blocks_eres_content_block_cats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_eres_content_block_order_idx" ON "pages_blocks_eres_content_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_eres_content_block_parent_id_idx" ON "pages_blocks_eres_content_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_eres_content_block_path_idx" ON "pages_blocks_eres_content_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_block_order_idx" ON "pages_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_block_parent_id_idx" ON "pages_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_block_path_idx" ON "pages_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_table_block_columns_order_idx" ON "pages_blocks_table_block_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_block_columns_parent_id_idx" ON "pages_blocks_table_block_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_block_rows_cells_order_idx" ON "pages_blocks_table_block_rows_cells" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_block_rows_cells_parent_id_idx" ON "pages_blocks_table_block_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_block_rows_order_idx" ON "pages_blocks_table_block_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_block_rows_parent_id_idx" ON "pages_blocks_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_block_order_idx" ON "pages_blocks_table_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_block_parent_id_idx" ON "pages_blocks_table_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_block_path_idx" ON "pages_blocks_table_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_service_cards_block_cards_order_idx" ON "_pages_v_blocks_service_cards_block_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_cards_block_cards_parent_id_idx" ON "_pages_v_blocks_service_cards_block_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_cards_block_order_idx" ON "_pages_v_blocks_service_cards_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_cards_block_parent_id_idx" ON "_pages_v_blocks_service_cards_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_cards_block_path_idx" ON "_pages_v_blocks_service_cards_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_formation_content_block_quick_links_order_idx" ON "_pages_v_blocks_formation_content_block_quick_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_formation_content_block_quick_links_parent_id_idx" ON "_pages_v_blocks_formation_content_block_quick_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_formation_content_block_order_idx" ON "_pages_v_blocks_formation_content_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_formation_content_block_parent_id_idx" ON "_pages_v_blocks_formation_content_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_formation_content_block_path_idx" ON "_pages_v_blocks_formation_content_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_investigation_content_block_quick_order_idx" ON "_pages_v_blocks_investigation_content_block_quick" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_investigation_content_block_quick_parent_id_idx" ON "_pages_v_blocks_investigation_content_block_quick" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_investigation_content_block_cards_order_idx" ON "_pages_v_blocks_investigation_content_block_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_investigation_content_block_cards_parent_id_idx" ON "_pages_v_blocks_investigation_content_block_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_investigation_content_block_order_idx" ON "_pages_v_blocks_investigation_content_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_investigation_content_block_parent_id_idx" ON "_pages_v_blocks_investigation_content_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_investigation_content_block_path_idx" ON "_pages_v_blocks_investigation_content_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_eres_content_block_featured_order_idx" ON "_pages_v_blocks_eres_content_block_featured" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_eres_content_block_featured_parent_id_idx" ON "_pages_v_blocks_eres_content_block_featured" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_eres_content_block_remote_points_order_idx" ON "_pages_v_blocks_eres_content_block_remote_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_eres_content_block_remote_points_parent_id_idx" ON "_pages_v_blocks_eres_content_block_remote_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_eres_content_block_cats_items_order_idx" ON "_pages_v_blocks_eres_content_block_cats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_eres_content_block_cats_items_parent_id_idx" ON "_pages_v_blocks_eres_content_block_cats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_eres_content_block_cats_order_idx" ON "_pages_v_blocks_eres_content_block_cats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_eres_content_block_cats_parent_id_idx" ON "_pages_v_blocks_eres_content_block_cats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_eres_content_block_order_idx" ON "_pages_v_blocks_eres_content_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_eres_content_block_parent_id_idx" ON "_pages_v_blocks_eres_content_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_eres_content_block_path_idx" ON "_pages_v_blocks_eres_content_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_block_order_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_block_parent_id_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_block_path_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_table_block_columns_order_idx" ON "_pages_v_blocks_table_block_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_block_columns_parent_id_idx" ON "_pages_v_blocks_table_block_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_block_rows_cells_order_idx" ON "_pages_v_blocks_table_block_rows_cells" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_block_rows_cells_parent_id_idx" ON "_pages_v_blocks_table_block_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_block_rows_order_idx" ON "_pages_v_blocks_table_block_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_block_rows_parent_id_idx" ON "_pages_v_blocks_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_block_order_idx" ON "_pages_v_blocks_table_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_block_parent_id_idx" ON "_pages_v_blocks_table_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_block_path_idx" ON "_pages_v_blocks_table_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_service_cards_block_cards" CASCADE;
  DROP TABLE "pages_blocks_service_cards_block" CASCADE;
  DROP TABLE "pages_blocks_formation_content_block_quick_links" CASCADE;
  DROP TABLE "pages_blocks_formation_content_block" CASCADE;
  DROP TABLE "pages_blocks_investigation_content_block_quick" CASCADE;
  DROP TABLE "pages_blocks_investigation_content_block_cards" CASCADE;
  DROP TABLE "pages_blocks_investigation_content_block" CASCADE;
  DROP TABLE "pages_blocks_eres_content_block_featured" CASCADE;
  DROP TABLE "pages_blocks_eres_content_block_remote_points" CASCADE;
  DROP TABLE "pages_blocks_eres_content_block_cats_items" CASCADE;
  DROP TABLE "pages_blocks_eres_content_block_cats" CASCADE;
  DROP TABLE "pages_blocks_eres_content_block" CASCADE;
  DROP TABLE "pages_blocks_rich_text_block" CASCADE;
  DROP TABLE "pages_blocks_table_block_columns" CASCADE;
  DROP TABLE "pages_blocks_table_block_rows_cells" CASCADE;
  DROP TABLE "pages_blocks_table_block_rows" CASCADE;
  DROP TABLE "pages_blocks_table_block" CASCADE;
  DROP TABLE "_pages_v_blocks_service_cards_block_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_service_cards_block" CASCADE;
  DROP TABLE "_pages_v_blocks_formation_content_block_quick_links" CASCADE;
  DROP TABLE "_pages_v_blocks_formation_content_block" CASCADE;
  DROP TABLE "_pages_v_blocks_investigation_content_block_quick" CASCADE;
  DROP TABLE "_pages_v_blocks_investigation_content_block_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_investigation_content_block" CASCADE;
  DROP TABLE "_pages_v_blocks_eres_content_block_featured" CASCADE;
  DROP TABLE "_pages_v_blocks_eres_content_block_remote_points" CASCADE;
  DROP TABLE "_pages_v_blocks_eres_content_block_cats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_eres_content_block_cats" CASCADE;
  DROP TABLE "_pages_v_blocks_eres_content_block" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_block" CASCADE;
  DROP TABLE "_pages_v_blocks_table_block_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_table_block_rows_cells" CASCADE;
  DROP TABLE "_pages_v_blocks_table_block_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_table_block" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_service_cards_block_cards_icon";
  DROP TYPE "public"."enum_pages_blocks_investigation_content_block_quick_icon";
  DROP TYPE "public"."enum_pages_blocks_investigation_content_block_cards_icon";
  DROP TYPE "public"."enum_pages_blocks_eres_content_block_featured_icon";
  DROP TYPE "public"."enum_pages_blocks_eres_content_block_cats_items_access";
  DROP TYPE "public"."enum_pages_blocks_eres_content_block_problem_tipo";
  DROP TYPE "public"."enum_pages_blocks_eres_content_block_problem_ancla";
  DROP TYPE "public"."enum_pages_blocks_eres_content_block_problem_enlace_key";
  DROP TYPE "public"."enum__pages_v_blocks_service_cards_block_cards_icon";
  DROP TYPE "public"."enum__pages_v_blocks_investigation_content_block_quick_icon";
  DROP TYPE "public"."enum__pages_v_blocks_investigation_content_block_cards_icon";
  DROP TYPE "public"."enum__pages_v_blocks_eres_content_block_featured_icon";
  DROP TYPE "public"."enum__pages_v_blocks_eres_content_block_cats_items_access";
  DROP TYPE "public"."enum__pages_v_blocks_eres_content_block_problem_tipo";
  DROP TYPE "public"."enum__pages_v_blocks_eres_content_block_problem_ancla";
  DROP TYPE "public"."enum__pages_v_blocks_eres_content_block_problem_enlace_key";`)
}

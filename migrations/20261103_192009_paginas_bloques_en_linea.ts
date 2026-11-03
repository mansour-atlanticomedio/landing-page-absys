import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_stats_inline_block_stats_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum_pages_blocks_features_inline_block_feature_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum_pages_blocks_news_inline_block_style" AS ENUM('0', '1', '2', '3');
  CREATE TYPE "public"."enum_pages_blocks_speakers_inline_block_people_socials_icon" AS ENUM('FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube', 'Globe');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_inline_block_stats_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum__pages_v_blocks_features_inline_block_feature_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar', 'Search', 'Megaphone', 'Lock', 'Fingerprint', 'BarChart3', 'HeartHandshake', 'BookOpenCheck', 'Landmark', 'Users', 'FileText', 'Library', 'Monitor', 'AlertTriangle');
  CREATE TYPE "public"."enum__pages_v_blocks_news_inline_block_style" AS ENUM('0', '1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_speakers_inline_block_people_socials_icon" AS ENUM('FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube', 'Globe');
  ALTER TYPE "public"."enum_pages_hero_variant" ADD VALUE IF NOT EXISTS 'banner';
  ALTER TYPE "public"."enum__pages_v_version_hero_variant" ADD VALUE IF NOT EXISTS 'banner';
  CREATE TABLE "pages_blocks_hero_carousel_inline_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_hero_carousel_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_inline_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_stats_inline_block_stats_icon",
  	"value" numeric,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"article" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_inline_block_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_features_inline_block_feature_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_features_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_news_inline_block_news_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"link" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_news_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"visible_cards" numeric,
  	"style" "enum_pages_blocks_news_inline_block_style",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_blogs_inline_block_blog_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"blog" varchar,
  	"date" varchar
  );
  
  CREATE TABLE "pages_blocks_blogs_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_inline_block_calendar_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "pages_blocks_timeline_inline_block_calendar" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_speakers_inline_block_people_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_speakers_inline_block_people_socials_icon",
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_speakers_inline_block_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"entity" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "pages_blocks_speakers_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partners_inline_block_partners_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_partners_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"button_cta" varchar,
  	"button_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_inline_block_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_input_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"placeholder" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_carousel_inline_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_carousel_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_inline_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_stats_inline_block_stats_icon",
  	"value" numeric,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"article" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_inline_block_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_features_inline_block_feature_icon",
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_news_inline_block_news_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"link" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_news_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"visible_cards" numeric,
  	"style" "enum__pages_v_blocks_news_inline_block_style",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_blogs_inline_block_blog_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"blog" varchar,
  	"date" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_blogs_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_inline_block_calendar_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_inline_block_calendar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_speakers_inline_block_people_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_speakers_inline_block_people_socials_icon",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_speakers_inline_block_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"entity" varchar,
  	"description" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_speakers_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partners_inline_block_partners_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partners_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"button_cta" varchar,
  	"button_link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_inline_block_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_input_inline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"placeholder" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_hero_carousel_inline_block_items" ADD CONSTRAINT "pages_blocks_hero_carousel_inline_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_carousel_inline_block_items" ADD CONSTRAINT "pages_blocks_hero_carousel_inline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_carousel_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_carousel_inline_block" ADD CONSTRAINT "pages_blocks_hero_carousel_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_inline_block_stats" ADD CONSTRAINT "pages_blocks_stats_inline_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_inline_block" ADD CONSTRAINT "pages_blocks_stats_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_inline_block" ADD CONSTRAINT "pages_blocks_about_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_inline_block_feature" ADD CONSTRAINT "pages_blocks_features_inline_block_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_inline_block" ADD CONSTRAINT "pages_blocks_features_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_news_inline_block_news_items" ADD CONSTRAINT "pages_blocks_news_inline_block_news_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_news_inline_block_news_items" ADD CONSTRAINT "pages_blocks_news_inline_block_news_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_news_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_news_inline_block" ADD CONSTRAINT "pages_blocks_news_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blogs_inline_block_blog_items" ADD CONSTRAINT "pages_blocks_blogs_inline_block_blog_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_blogs_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blogs_inline_block" ADD CONSTRAINT "pages_blocks_blogs_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_inline_block_calendar_events" ADD CONSTRAINT "pages_blocks_timeline_inline_block_calendar_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline_inline_block_calendar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_inline_block_calendar" ADD CONSTRAINT "pages_blocks_timeline_inline_block_calendar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_inline_block" ADD CONSTRAINT "pages_blocks_timeline_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_speakers_inline_block_people_socials" ADD CONSTRAINT "pages_blocks_speakers_inline_block_people_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_speakers_inline_block_people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_speakers_inline_block_people" ADD CONSTRAINT "pages_blocks_speakers_inline_block_people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_speakers_inline_block_people" ADD CONSTRAINT "pages_blocks_speakers_inline_block_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_speakers_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_speakers_inline_block" ADD CONSTRAINT "pages_blocks_speakers_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_inline_block_partners_item" ADD CONSTRAINT "pages_blocks_partners_inline_block_partners_item_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_inline_block_partners_item" ADD CONSTRAINT "pages_blocks_partners_inline_block_partners_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partners_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_inline_block" ADD CONSTRAINT "pages_blocks_partners_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_inline_block" ADD CONSTRAINT "pages_blocks_cta_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_inline_block_faqs" ADD CONSTRAINT "pages_blocks_faq_inline_block_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_inline_block" ADD CONSTRAINT "pages_blocks_faq_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_input_inline_block" ADD CONSTRAINT "pages_blocks_input_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel_inline_block_items" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_inline_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel_inline_block_items" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_inline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_carousel_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel_inline_block" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_inline_block_stats" ADD CONSTRAINT "_pages_v_blocks_stats_inline_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_inline_block" ADD CONSTRAINT "_pages_v_blocks_stats_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_inline_block" ADD CONSTRAINT "_pages_v_blocks_about_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_inline_block_feature" ADD CONSTRAINT "_pages_v_blocks_features_inline_block_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_inline_block" ADD CONSTRAINT "_pages_v_blocks_features_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_news_inline_block_news_items" ADD CONSTRAINT "_pages_v_blocks_news_inline_block_news_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_news_inline_block_news_items" ADD CONSTRAINT "_pages_v_blocks_news_inline_block_news_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_news_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_news_inline_block" ADD CONSTRAINT "_pages_v_blocks_news_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blogs_inline_block_blog_items" ADD CONSTRAINT "_pages_v_blocks_blogs_inline_block_blog_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_blogs_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blogs_inline_block" ADD CONSTRAINT "_pages_v_blocks_blogs_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_inline_block_calendar_events" ADD CONSTRAINT "_pages_v_blocks_timeline_inline_block_calendar_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline_inline_block_calendar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_inline_block_calendar" ADD CONSTRAINT "_pages_v_blocks_timeline_inline_block_calendar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_inline_block" ADD CONSTRAINT "_pages_v_blocks_timeline_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_speakers_inline_block_people_socials" ADD CONSTRAINT "_pages_v_blocks_speakers_inline_block_people_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_speakers_inline_block_people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_speakers_inline_block_people" ADD CONSTRAINT "_pages_v_blocks_speakers_inline_block_people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_speakers_inline_block_people" ADD CONSTRAINT "_pages_v_blocks_speakers_inline_block_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_speakers_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_speakers_inline_block" ADD CONSTRAINT "_pages_v_blocks_speakers_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_inline_block_partners_item" ADD CONSTRAINT "_pages_v_blocks_partners_inline_block_partners_item_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_inline_block_partners_item" ADD CONSTRAINT "_pages_v_blocks_partners_inline_block_partners_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partners_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_inline_block" ADD CONSTRAINT "_pages_v_blocks_partners_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_inline_block" ADD CONSTRAINT "_pages_v_blocks_cta_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_inline_block_faqs" ADD CONSTRAINT "_pages_v_blocks_faq_inline_block_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_inline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_inline_block" ADD CONSTRAINT "_pages_v_blocks_faq_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_input_inline_block" ADD CONSTRAINT "_pages_v_blocks_input_inline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_carousel_inline_block_items_order_idx" ON "pages_blocks_hero_carousel_inline_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_carousel_inline_block_items_parent_id_idx" ON "pages_blocks_hero_carousel_inline_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_carousel_inline_block_items_image_idx" ON "pages_blocks_hero_carousel_inline_block_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_carousel_inline_block_order_idx" ON "pages_blocks_hero_carousel_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_carousel_inline_block_parent_id_idx" ON "pages_blocks_hero_carousel_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_carousel_inline_block_path_idx" ON "pages_blocks_hero_carousel_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_inline_block_stats_order_idx" ON "pages_blocks_stats_inline_block_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_inline_block_stats_parent_id_idx" ON "pages_blocks_stats_inline_block_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_inline_block_order_idx" ON "pages_blocks_stats_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_inline_block_parent_id_idx" ON "pages_blocks_stats_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_inline_block_path_idx" ON "pages_blocks_stats_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_inline_block_order_idx" ON "pages_blocks_about_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_inline_block_parent_id_idx" ON "pages_blocks_about_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_inline_block_path_idx" ON "pages_blocks_about_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_inline_block_feature_order_idx" ON "pages_blocks_features_inline_block_feature" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_inline_block_feature_parent_id_idx" ON "pages_blocks_features_inline_block_feature" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_inline_block_order_idx" ON "pages_blocks_features_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_inline_block_parent_id_idx" ON "pages_blocks_features_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_inline_block_path_idx" ON "pages_blocks_features_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_news_inline_block_news_items_order_idx" ON "pages_blocks_news_inline_block_news_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_news_inline_block_news_items_parent_id_idx" ON "pages_blocks_news_inline_block_news_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_news_inline_block_news_items_image_idx" ON "pages_blocks_news_inline_block_news_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_news_inline_block_order_idx" ON "pages_blocks_news_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_news_inline_block_parent_id_idx" ON "pages_blocks_news_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_news_inline_block_path_idx" ON "pages_blocks_news_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_blogs_inline_block_blog_items_order_idx" ON "pages_blocks_blogs_inline_block_blog_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_blogs_inline_block_blog_items_parent_id_idx" ON "pages_blocks_blogs_inline_block_blog_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_blogs_inline_block_order_idx" ON "pages_blocks_blogs_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_blogs_inline_block_parent_id_idx" ON "pages_blocks_blogs_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_blogs_inline_block_path_idx" ON "pages_blocks_blogs_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_inline_block_calendar_events_order_idx" ON "pages_blocks_timeline_inline_block_calendar_events" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_inline_block_calendar_events_parent_id_idx" ON "pages_blocks_timeline_inline_block_calendar_events" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_inline_block_calendar_order_idx" ON "pages_blocks_timeline_inline_block_calendar" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_inline_block_calendar_parent_id_idx" ON "pages_blocks_timeline_inline_block_calendar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_inline_block_order_idx" ON "pages_blocks_timeline_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_inline_block_parent_id_idx" ON "pages_blocks_timeline_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_inline_block_path_idx" ON "pages_blocks_timeline_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_speakers_inline_block_people_socials_order_idx" ON "pages_blocks_speakers_inline_block_people_socials" USING btree ("_order");
  CREATE INDEX "pages_blocks_speakers_inline_block_people_socials_parent_id_idx" ON "pages_blocks_speakers_inline_block_people_socials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_speakers_inline_block_people_order_idx" ON "pages_blocks_speakers_inline_block_people" USING btree ("_order");
  CREATE INDEX "pages_blocks_speakers_inline_block_people_parent_id_idx" ON "pages_blocks_speakers_inline_block_people" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_speakers_inline_block_people_photo_idx" ON "pages_blocks_speakers_inline_block_people" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_speakers_inline_block_order_idx" ON "pages_blocks_speakers_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_speakers_inline_block_parent_id_idx" ON "pages_blocks_speakers_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_speakers_inline_block_path_idx" ON "pages_blocks_speakers_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_partners_inline_block_partners_item_order_idx" ON "pages_blocks_partners_inline_block_partners_item" USING btree ("_order");
  CREATE INDEX "pages_blocks_partners_inline_block_partners_item_parent_id_idx" ON "pages_blocks_partners_inline_block_partners_item" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partners_inline_block_partners_item_image_idx" ON "pages_blocks_partners_inline_block_partners_item" USING btree ("image_id");
  CREATE INDEX "pages_blocks_partners_inline_block_order_idx" ON "pages_blocks_partners_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_partners_inline_block_parent_id_idx" ON "pages_blocks_partners_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partners_inline_block_path_idx" ON "pages_blocks_partners_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_inline_block_order_idx" ON "pages_blocks_cta_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_inline_block_parent_id_idx" ON "pages_blocks_cta_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_inline_block_path_idx" ON "pages_blocks_cta_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_inline_block_faqs_order_idx" ON "pages_blocks_faq_inline_block_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_inline_block_faqs_parent_id_idx" ON "pages_blocks_faq_inline_block_faqs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_inline_block_order_idx" ON "pages_blocks_faq_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_inline_block_parent_id_idx" ON "pages_blocks_faq_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_inline_block_path_idx" ON "pages_blocks_faq_inline_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_input_inline_block_order_idx" ON "pages_blocks_input_inline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_input_inline_block_parent_id_idx" ON "pages_blocks_input_inline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_input_inline_block_path_idx" ON "pages_blocks_input_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_carousel_inline_block_items_order_idx" ON "_pages_v_blocks_hero_carousel_inline_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_carousel_inline_block_items_parent_id_idx" ON "_pages_v_blocks_hero_carousel_inline_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_inline_block_items_image_idx" ON "_pages_v_blocks_hero_carousel_inline_block_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_inline_block_order_idx" ON "_pages_v_blocks_hero_carousel_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_carousel_inline_block_parent_id_idx" ON "_pages_v_blocks_hero_carousel_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_inline_block_path_idx" ON "_pages_v_blocks_hero_carousel_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_inline_block_stats_order_idx" ON "_pages_v_blocks_stats_inline_block_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_inline_block_stats_parent_id_idx" ON "_pages_v_blocks_stats_inline_block_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_inline_block_order_idx" ON "_pages_v_blocks_stats_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_inline_block_parent_id_idx" ON "_pages_v_blocks_stats_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_inline_block_path_idx" ON "_pages_v_blocks_stats_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_inline_block_order_idx" ON "_pages_v_blocks_about_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_inline_block_parent_id_idx" ON "_pages_v_blocks_about_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_inline_block_path_idx" ON "_pages_v_blocks_about_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_inline_block_feature_order_idx" ON "_pages_v_blocks_features_inline_block_feature" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_inline_block_feature_parent_id_idx" ON "_pages_v_blocks_features_inline_block_feature" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_inline_block_order_idx" ON "_pages_v_blocks_features_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_inline_block_parent_id_idx" ON "_pages_v_blocks_features_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_inline_block_path_idx" ON "_pages_v_blocks_features_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_news_inline_block_news_items_order_idx" ON "_pages_v_blocks_news_inline_block_news_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_news_inline_block_news_items_parent_id_idx" ON "_pages_v_blocks_news_inline_block_news_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_news_inline_block_news_items_image_idx" ON "_pages_v_blocks_news_inline_block_news_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_news_inline_block_order_idx" ON "_pages_v_blocks_news_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_news_inline_block_parent_id_idx" ON "_pages_v_blocks_news_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_news_inline_block_path_idx" ON "_pages_v_blocks_news_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_blogs_inline_block_blog_items_order_idx" ON "_pages_v_blocks_blogs_inline_block_blog_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_blogs_inline_block_blog_items_parent_id_idx" ON "_pages_v_blocks_blogs_inline_block_blog_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_blogs_inline_block_order_idx" ON "_pages_v_blocks_blogs_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_blogs_inline_block_parent_id_idx" ON "_pages_v_blocks_blogs_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_blogs_inline_block_path_idx" ON "_pages_v_blocks_blogs_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_inline_block_calendar_events_order_idx" ON "_pages_v_blocks_timeline_inline_block_calendar_events" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_inline_block_calendar_events_parent_id_idx" ON "_pages_v_blocks_timeline_inline_block_calendar_events" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_inline_block_calendar_order_idx" ON "_pages_v_blocks_timeline_inline_block_calendar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_inline_block_calendar_parent_id_idx" ON "_pages_v_blocks_timeline_inline_block_calendar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_inline_block_order_idx" ON "_pages_v_blocks_timeline_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_inline_block_parent_id_idx" ON "_pages_v_blocks_timeline_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_inline_block_path_idx" ON "_pages_v_blocks_timeline_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_speakers_inline_block_people_socials_order_idx" ON "_pages_v_blocks_speakers_inline_block_people_socials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_speakers_inline_block_people_socials_parent_id_idx" ON "_pages_v_blocks_speakers_inline_block_people_socials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_speakers_inline_block_people_order_idx" ON "_pages_v_blocks_speakers_inline_block_people" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_speakers_inline_block_people_parent_id_idx" ON "_pages_v_blocks_speakers_inline_block_people" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_speakers_inline_block_people_photo_idx" ON "_pages_v_blocks_speakers_inline_block_people" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_speakers_inline_block_order_idx" ON "_pages_v_blocks_speakers_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_speakers_inline_block_parent_id_idx" ON "_pages_v_blocks_speakers_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_speakers_inline_block_path_idx" ON "_pages_v_blocks_speakers_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_partners_inline_block_partners_item_order_idx" ON "_pages_v_blocks_partners_inline_block_partners_item" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partners_inline_block_partners_item_parent_id_idx" ON "_pages_v_blocks_partners_inline_block_partners_item" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_inline_block_partners_item_imag_idx" ON "_pages_v_blocks_partners_inline_block_partners_item" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_partners_inline_block_order_idx" ON "_pages_v_blocks_partners_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partners_inline_block_parent_id_idx" ON "_pages_v_blocks_partners_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_inline_block_path_idx" ON "_pages_v_blocks_partners_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_inline_block_order_idx" ON "_pages_v_blocks_cta_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_inline_block_parent_id_idx" ON "_pages_v_blocks_cta_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_inline_block_path_idx" ON "_pages_v_blocks_cta_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_inline_block_faqs_order_idx" ON "_pages_v_blocks_faq_inline_block_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_inline_block_faqs_parent_id_idx" ON "_pages_v_blocks_faq_inline_block_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_inline_block_order_idx" ON "_pages_v_blocks_faq_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_inline_block_parent_id_idx" ON "_pages_v_blocks_faq_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_inline_block_path_idx" ON "_pages_v_blocks_faq_inline_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_input_inline_block_order_idx" ON "_pages_v_blocks_input_inline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_input_inline_block_parent_id_idx" ON "_pages_v_blocks_input_inline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_input_inline_block_path_idx" ON "_pages_v_blocks_input_inline_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_carousel_inline_block_items" CASCADE;
  DROP TABLE "pages_blocks_hero_carousel_inline_block" CASCADE;
  DROP TABLE "pages_blocks_stats_inline_block_stats" CASCADE;
  DROP TABLE "pages_blocks_stats_inline_block" CASCADE;
  DROP TABLE "pages_blocks_about_inline_block" CASCADE;
  DROP TABLE "pages_blocks_features_inline_block_feature" CASCADE;
  DROP TABLE "pages_blocks_features_inline_block" CASCADE;
  DROP TABLE "pages_blocks_news_inline_block_news_items" CASCADE;
  DROP TABLE "pages_blocks_news_inline_block" CASCADE;
  DROP TABLE "pages_blocks_blogs_inline_block_blog_items" CASCADE;
  DROP TABLE "pages_blocks_blogs_inline_block" CASCADE;
  DROP TABLE "pages_blocks_timeline_inline_block_calendar_events" CASCADE;
  DROP TABLE "pages_blocks_timeline_inline_block_calendar" CASCADE;
  DROP TABLE "pages_blocks_timeline_inline_block" CASCADE;
  DROP TABLE "pages_blocks_speakers_inline_block_people_socials" CASCADE;
  DROP TABLE "pages_blocks_speakers_inline_block_people" CASCADE;
  DROP TABLE "pages_blocks_speakers_inline_block" CASCADE;
  DROP TABLE "pages_blocks_partners_inline_block_partners_item" CASCADE;
  DROP TABLE "pages_blocks_partners_inline_block" CASCADE;
  DROP TABLE "pages_blocks_cta_inline_block" CASCADE;
  DROP TABLE "pages_blocks_faq_inline_block_faqs" CASCADE;
  DROP TABLE "pages_blocks_faq_inline_block" CASCADE;
  DROP TABLE "pages_blocks_input_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_carousel_inline_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_carousel_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_inline_block_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_about_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_features_inline_block_feature" CASCADE;
  DROP TABLE "_pages_v_blocks_features_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_news_inline_block_news_items" CASCADE;
  DROP TABLE "_pages_v_blocks_news_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_blogs_inline_block_blog_items" CASCADE;
  DROP TABLE "_pages_v_blocks_blogs_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_inline_block_calendar_events" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_inline_block_calendar" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_speakers_inline_block_people_socials" CASCADE;
  DROP TABLE "_pages_v_blocks_speakers_inline_block_people" CASCADE;
  DROP TABLE "_pages_v_blocks_speakers_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_partners_inline_block_partners_item" CASCADE;
  DROP TABLE "_pages_v_blocks_partners_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_inline_block_faqs" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_inline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_input_inline_block" CASCADE;
  ALTER TABLE "pages" ALTER COLUMN "hero_variant" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_variant" SET DEFAULT 'simple'::text;
  DROP TYPE "public"."enum_pages_hero_variant";
  CREATE TYPE "public"."enum_pages_hero_variant" AS ENUM('simple', 'split');
  ALTER TABLE "pages" ALTER COLUMN "hero_variant" SET DEFAULT 'simple'::"public"."enum_pages_hero_variant";
  ALTER TABLE "pages" ALTER COLUMN "hero_variant" SET DATA TYPE "public"."enum_pages_hero_variant" USING "hero_variant"::"public"."enum_pages_hero_variant";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_variant" SET DEFAULT 'simple'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_variant";
  CREATE TYPE "public"."enum__pages_v_version_hero_variant" AS ENUM('simple', 'split');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_variant" SET DEFAULT 'simple'::"public"."enum__pages_v_version_hero_variant";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_variant" SET DATA TYPE "public"."enum__pages_v_version_hero_variant" USING "version_hero_variant"::"public"."enum__pages_v_version_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_stats_inline_block_stats_icon";
  DROP TYPE "public"."enum_pages_blocks_features_inline_block_feature_icon";
  DROP TYPE "public"."enum_pages_blocks_news_inline_block_style";
  DROP TYPE "public"."enum_pages_blocks_speakers_inline_block_people_socials_icon";
  DROP TYPE "public"."enum__pages_v_blocks_stats_inline_block_stats_icon";
  DROP TYPE "public"."enum__pages_v_blocks_features_inline_block_feature_icon";
  DROP TYPE "public"."enum__pages_v_blocks_news_inline_block_style";
  DROP TYPE "public"."enum__pages_v_blocks_speakers_inline_block_people_socials_icon";`)
}

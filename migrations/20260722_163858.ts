import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_type" AS ENUM('0', '1', '2');
  CREATE TYPE "public"."enum_speakers_people_socials_icon" AS ENUM('FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube', 'Globe');
  CREATE TYPE "public"."enum_statistics_stats_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar');
  CREATE TYPE "public"."enum_features_feature_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar');
  CREATE TYPE "public"."enum_news_style" AS ENUM('0', '1', '2', '3');
  CREATE TYPE "public"."enum_footer_social_medias_icon" AS ENUM('FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube', 'Globe');
  CREATE TYPE "public"."enum_footer_seccion_info_information_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar');
  CREATE TYPE "public"."enum_footer_type" AS ENUM('0', '1', '2');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer NOT NULL,
  	"pretitle" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"button_cta" varchar,
  	"input_placeholder" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_navbar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"to" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "header_navbar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"to" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_header_type" DEFAULT '0',
  	"phone" varchar,
  	"email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "hero_carrusel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "hero_carrusel" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "speakers_people_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_speakers_people_socials_icon",
  	"url" varchar
  );
  
  CREATE TABLE "speakers_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"entity" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "speakers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "statistics_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_statistics_stats_icon" NOT NULL,
  	"value" numeric,
  	"description" varchar
  );
  
  CREATE TABLE "statistics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"article" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "features_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_features_feature_icon" NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "features" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "timeline_calendar_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "timeline_calendar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "timeline" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "input" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"placeholder" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cta" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"button_cta" varchar,
  	"button_link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "send_email" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar,
  	"about" varchar,
  	"message" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blogs_blog_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"blog" varchar NOT NULL,
  	"date" varchar NOT NULL
  );
  
  CREATE TABLE "blogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners_partners_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer NOT NULL,
  	"link" varchar
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_news_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"link" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"visible_cards" numeric,
  	"style" "enum_news_style",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_footer_type" DEFAULT '0',
  	"logo_id" integer,
  	"legal_advice" varchar,
  	"privacy_policie" varchar,
  	"privacy_cookies" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "absys_service" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"isbn" varchar,
  	"title" varchar,
  	"author" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "book_cover_service" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "author_service" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"hero_id" integer,
  	"header_id" integer,
  	"hero_carrusel_id" integer,
  	"speakers_id" integer,
  	"statistics_id" integer,
  	"about_id" integer,
  	"features_id" integer,
  	"timeline_id" integer,
  	"input_id" integer,
  	"cta_id" integer,
  	"faq_id" integer,
  	"send_email_id" integer,
  	"blogs_id" integer,
  	"partners_id" integer,
  	"news_id" integer,
  	"footer_id" integer,
  	"absys_service_id" integer,
  	"book_cover_service_id" integer,
  	"author_service_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_speakers_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_about_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_input_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_features_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_news_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_blogs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_partners_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"hero_carrusel_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"statistics_id" integer,
  	"speakers_id" integer,
  	"about_id" integer,
  	"input_id" integer,
  	"features_id" integer,
  	"news_id" integer,
  	"blogs_id" integer,
  	"timeline_id" integer,
  	"partners_id" integer,
  	"cta_id" integer,
  	"faq_id" integer
  );
  
  CREATE TABLE "library" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "layout" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_id" integer,
  	"footer_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_speakers_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_about_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_input_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_features_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_news_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_blogs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_partners_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"hero_carrusel_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"statistics_id" integer,
  	"speakers_id" integer,
  	"about_id" integer,
  	"input_id" integer,
  	"features_id" integer,
  	"news_id" integer,
  	"blogs_id" integer,
  	"timeline_id" integer,
  	"partners_id" integer,
  	"cta_id" integer,
  	"faq_id" integer
  );
  
  CREATE TABLE "investigation_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation_blocks_speakers_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation_blocks_about_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation_blocks_input_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation_blocks_features_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation_blocks_news_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation_blocks_blogs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation_blocks_partners_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"hero_carrusel_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "investigation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"statistics_id" integer,
  	"speakers_id" integer,
  	"about_id" integer,
  	"input_id" integer,
  	"features_id" integer,
  	"news_id" integer,
  	"blogs_id" integer,
  	"timeline_id" integer,
  	"partners_id" integer,
  	"cta_id" integer,
  	"faq_id" integer
  );
  
  CREATE TABLE "repository_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository_blocks_speakers_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository_blocks_about_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository_blocks_input_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository_blocks_features_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository_blocks_news_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository_blocks_blogs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository_blocks_partners_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "repository" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "repository_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"statistics_id" integer,
  	"speakers_id" integer,
  	"about_id" integer,
  	"input_id" integer,
  	"features_id" integer,
  	"news_id" integer,
  	"blogs_id" integer,
  	"timeline_id" integer,
  	"partners_id" integer,
  	"cta_id" integer,
  	"faq_id" integer
  );
  
  CREATE TABLE "formation_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation_blocks_speakers_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation_blocks_about_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation_blocks_input_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation_blocks_features_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation_blocks_news_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation_blocks_blogs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation_blocks_partners_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "formation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"hero_carrusel_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "formation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"statistics_id" integer,
  	"speakers_id" integer,
  	"about_id" integer,
  	"input_id" integer,
  	"features_id" integer,
  	"news_id" integer,
  	"blogs_id" integer,
  	"timeline_id" integer,
  	"partners_id" integer,
  	"cta_id" integer,
  	"faq_id" integer
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_us_quienes_somos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"images_id" integer
  );
  
  CREATE TABLE "about_us_horarios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"images_id" integer
  );
  
  CREATE TABLE "about_us_normativa" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"images_id" integer
  );
  
  CREATE TABLE "about_us" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_navbar_items" ADD CONSTRAINT "header_navbar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navbar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navbar" ADD CONSTRAINT "header_navbar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_carrusel_items" ADD CONSTRAINT "hero_carrusel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_carrusel_items" ADD CONSTRAINT "hero_carrusel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "speakers_people_socials" ADD CONSTRAINT "speakers_people_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."speakers_people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "speakers_people" ADD CONSTRAINT "speakers_people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "speakers_people" ADD CONSTRAINT "speakers_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "statistics_stats" ADD CONSTRAINT "statistics_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "features_feature" ADD CONSTRAINT "features_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "timeline_calendar_events" ADD CONSTRAINT "timeline_calendar_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."timeline_calendar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "timeline_calendar" ADD CONSTRAINT "timeline_calendar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_faqs" ADD CONSTRAINT "faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blog_items" ADD CONSTRAINT "blogs_blog_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_partners_item" ADD CONSTRAINT "partners_partners_item_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_partners_item" ADD CONSTRAINT "partners_partners_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_news_items" ADD CONSTRAINT "news_news_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_news_items" ADD CONSTRAINT "news_news_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_medias" ADD CONSTRAINT "footer_social_medias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_seccion_info_information" ADD CONSTRAINT "footer_seccion_info_information_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_seccion_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_seccion_info" ADD CONSTRAINT "footer_seccion_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_header_fk" FOREIGN KEY ("header_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_carrusel_fk" FOREIGN KEY ("hero_carrusel_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_statistics_fk" FOREIGN KEY ("statistics_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_timeline_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_input_fk" FOREIGN KEY ("input_id") REFERENCES "public"."input"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cta_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_send_email_fk" FOREIGN KEY ("send_email_id") REFERENCES "public"."send_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_absys_service_fk" FOREIGN KEY ("absys_service_id") REFERENCES "public"."absys_service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_book_cover_service_fk" FOREIGN KEY ("book_cover_service_id") REFERENCES "public"."book_cover_service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_author_service_fk" FOREIGN KEY ("author_service_id") REFERENCES "public"."author_service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stats_block" ADD CONSTRAINT "home_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_speakers_block" ADD CONSTRAINT "home_blocks_speakers_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_about_block" ADD CONSTRAINT "home_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_input_block" ADD CONSTRAINT "home_blocks_input_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_features_block" ADD CONSTRAINT "home_blocks_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_news_block" ADD CONSTRAINT "home_blocks_news_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_blogs_block" ADD CONSTRAINT "home_blocks_blogs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_timeline_block" ADD CONSTRAINT "home_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_partners_block" ADD CONSTRAINT "home_blocks_partners_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_cta_block" ADD CONSTRAINT "home_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_faq_block" ADD CONSTRAINT "home_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_carrusel_id_hero_carrusel_id_fk" FOREIGN KEY ("hero_carrusel_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_statistics_fk" FOREIGN KEY ("statistics_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_input_fk" FOREIGN KEY ("input_id") REFERENCES "public"."input"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_timeline_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_cta_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "library" ADD CONSTRAINT "library_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layout" ADD CONSTRAINT "layout_header_id_header_id_fk" FOREIGN KEY ("header_id") REFERENCES "public"."header"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layout" ADD CONSTRAINT "layout_footer_id_footer_id_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."footer"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_stats_block" ADD CONSTRAINT "services_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_speakers_block" ADD CONSTRAINT "services_blocks_speakers_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_about_block" ADD CONSTRAINT "services_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_input_block" ADD CONSTRAINT "services_blocks_input_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_features_block" ADD CONSTRAINT "services_blocks_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_news_block" ADD CONSTRAINT "services_blocks_news_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_blogs_block" ADD CONSTRAINT "services_blocks_blogs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_timeline_block" ADD CONSTRAINT "services_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_partners_block" ADD CONSTRAINT "services_blocks_partners_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_cta_block" ADD CONSTRAINT "services_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_faq_block" ADD CONSTRAINT "services_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_carrusel_id_hero_carrusel_id_fk" FOREIGN KEY ("hero_carrusel_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_statistics_fk" FOREIGN KEY ("statistics_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_input_fk" FOREIGN KEY ("input_id") REFERENCES "public"."input"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_timeline_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_cta_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_stats_block" ADD CONSTRAINT "investigation_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_speakers_block" ADD CONSTRAINT "investigation_blocks_speakers_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_about_block" ADD CONSTRAINT "investigation_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_input_block" ADD CONSTRAINT "investigation_blocks_input_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_features_block" ADD CONSTRAINT "investigation_blocks_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_news_block" ADD CONSTRAINT "investigation_blocks_news_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_blogs_block" ADD CONSTRAINT "investigation_blocks_blogs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_timeline_block" ADD CONSTRAINT "investigation_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_partners_block" ADD CONSTRAINT "investigation_blocks_partners_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_cta_block" ADD CONSTRAINT "investigation_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_blocks_faq_block" ADD CONSTRAINT "investigation_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation" ADD CONSTRAINT "investigation_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investigation" ADD CONSTRAINT "investigation_hero_carrusel_id_hero_carrusel_id_fk" FOREIGN KEY ("hero_carrusel_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_statistics_fk" FOREIGN KEY ("statistics_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_input_fk" FOREIGN KEY ("input_id") REFERENCES "public"."input"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_timeline_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_cta_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investigation_rels" ADD CONSTRAINT "investigation_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_stats_block" ADD CONSTRAINT "repository_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_speakers_block" ADD CONSTRAINT "repository_blocks_speakers_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_about_block" ADD CONSTRAINT "repository_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_input_block" ADD CONSTRAINT "repository_blocks_input_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_features_block" ADD CONSTRAINT "repository_blocks_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_news_block" ADD CONSTRAINT "repository_blocks_news_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_blogs_block" ADD CONSTRAINT "repository_blocks_blogs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_timeline_block" ADD CONSTRAINT "repository_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_partners_block" ADD CONSTRAINT "repository_blocks_partners_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_cta_block" ADD CONSTRAINT "repository_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_faq_block" ADD CONSTRAINT "repository_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository" ADD CONSTRAINT "repository_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_statistics_fk" FOREIGN KEY ("statistics_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_input_fk" FOREIGN KEY ("input_id") REFERENCES "public"."input"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_timeline_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_cta_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_stats_block" ADD CONSTRAINT "formation_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_speakers_block" ADD CONSTRAINT "formation_blocks_speakers_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_about_block" ADD CONSTRAINT "formation_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_input_block" ADD CONSTRAINT "formation_blocks_input_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_features_block" ADD CONSTRAINT "formation_blocks_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_news_block" ADD CONSTRAINT "formation_blocks_news_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_blogs_block" ADD CONSTRAINT "formation_blocks_blogs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_timeline_block" ADD CONSTRAINT "formation_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_partners_block" ADD CONSTRAINT "formation_blocks_partners_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_cta_block" ADD CONSTRAINT "formation_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_blocks_faq_block" ADD CONSTRAINT "formation_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation" ADD CONSTRAINT "formation_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "formation" ADD CONSTRAINT "formation_hero_carrusel_id_hero_carrusel_id_fk" FOREIGN KEY ("hero_carrusel_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."formation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_statistics_fk" FOREIGN KEY ("statistics_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_input_fk" FOREIGN KEY ("input_id") REFERENCES "public"."input"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_timeline_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_cta_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formation_rels" ADD CONSTRAINT "formation_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact" ADD CONSTRAINT "contact_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_quienes_somos" ADD CONSTRAINT "about_us_quienes_somos_images_id_media_id_fk" FOREIGN KEY ("images_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_quienes_somos" ADD CONSTRAINT "about_us_quienes_somos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_horarios" ADD CONSTRAINT "about_us_horarios_images_id_media_id_fk" FOREIGN KEY ("images_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_horarios" ADD CONSTRAINT "about_us_horarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_normativa" ADD CONSTRAINT "about_us_normativa_images_id_media_id_fk" FOREIGN KEY ("images_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_normativa" ADD CONSTRAINT "about_us_normativa_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "hero_background_image_idx" ON "hero" USING btree ("background_image_id");
  CREATE INDEX "hero_updated_at_idx" ON "hero" USING btree ("updated_at");
  CREATE INDEX "hero_created_at_idx" ON "hero" USING btree ("created_at");
  CREATE INDEX "header_navbar_items_order_idx" ON "header_navbar_items" USING btree ("_order");
  CREATE INDEX "header_navbar_items_parent_id_idx" ON "header_navbar_items" USING btree ("_parent_id");
  CREATE INDEX "header_navbar_order_idx" ON "header_navbar" USING btree ("_order");
  CREATE INDEX "header_navbar_parent_id_idx" ON "header_navbar" USING btree ("_parent_id");
  CREATE INDEX "header_updated_at_idx" ON "header" USING btree ("updated_at");
  CREATE INDEX "header_created_at_idx" ON "header" USING btree ("created_at");
  CREATE INDEX "hero_carrusel_items_order_idx" ON "hero_carrusel_items" USING btree ("_order");
  CREATE INDEX "hero_carrusel_items_parent_id_idx" ON "hero_carrusel_items" USING btree ("_parent_id");
  CREATE INDEX "hero_carrusel_items_image_idx" ON "hero_carrusel_items" USING btree ("image_id");
  CREATE INDEX "hero_carrusel_updated_at_idx" ON "hero_carrusel" USING btree ("updated_at");
  CREATE INDEX "hero_carrusel_created_at_idx" ON "hero_carrusel" USING btree ("created_at");
  CREATE INDEX "speakers_people_socials_order_idx" ON "speakers_people_socials" USING btree ("_order");
  CREATE INDEX "speakers_people_socials_parent_id_idx" ON "speakers_people_socials" USING btree ("_parent_id");
  CREATE INDEX "speakers_people_order_idx" ON "speakers_people" USING btree ("_order");
  CREATE INDEX "speakers_people_parent_id_idx" ON "speakers_people" USING btree ("_parent_id");
  CREATE INDEX "speakers_people_photo_idx" ON "speakers_people" USING btree ("photo_id");
  CREATE INDEX "speakers_updated_at_idx" ON "speakers" USING btree ("updated_at");
  CREATE INDEX "speakers_created_at_idx" ON "speakers" USING btree ("created_at");
  CREATE INDEX "statistics_stats_order_idx" ON "statistics_stats" USING btree ("_order");
  CREATE INDEX "statistics_stats_parent_id_idx" ON "statistics_stats" USING btree ("_parent_id");
  CREATE INDEX "statistics_updated_at_idx" ON "statistics" USING btree ("updated_at");
  CREATE INDEX "statistics_created_at_idx" ON "statistics" USING btree ("created_at");
  CREATE INDEX "about_updated_at_idx" ON "about" USING btree ("updated_at");
  CREATE INDEX "about_created_at_idx" ON "about" USING btree ("created_at");
  CREATE INDEX "features_feature_order_idx" ON "features_feature" USING btree ("_order");
  CREATE INDEX "features_feature_parent_id_idx" ON "features_feature" USING btree ("_parent_id");
  CREATE INDEX "features_updated_at_idx" ON "features" USING btree ("updated_at");
  CREATE INDEX "features_created_at_idx" ON "features" USING btree ("created_at");
  CREATE INDEX "timeline_calendar_events_order_idx" ON "timeline_calendar_events" USING btree ("_order");
  CREATE INDEX "timeline_calendar_events_parent_id_idx" ON "timeline_calendar_events" USING btree ("_parent_id");
  CREATE INDEX "timeline_calendar_order_idx" ON "timeline_calendar" USING btree ("_order");
  CREATE INDEX "timeline_calendar_parent_id_idx" ON "timeline_calendar" USING btree ("_parent_id");
  CREATE INDEX "timeline_updated_at_idx" ON "timeline" USING btree ("updated_at");
  CREATE INDEX "timeline_created_at_idx" ON "timeline" USING btree ("created_at");
  CREATE INDEX "input_updated_at_idx" ON "input" USING btree ("updated_at");
  CREATE INDEX "input_created_at_idx" ON "input" USING btree ("created_at");
  CREATE INDEX "cta_updated_at_idx" ON "cta" USING btree ("updated_at");
  CREATE INDEX "cta_created_at_idx" ON "cta" USING btree ("created_at");
  CREATE INDEX "faq_faqs_order_idx" ON "faq_faqs" USING btree ("_order");
  CREATE INDEX "faq_faqs_parent_id_idx" ON "faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE INDEX "send_email_updated_at_idx" ON "send_email" USING btree ("updated_at");
  CREATE INDEX "send_email_created_at_idx" ON "send_email" USING btree ("created_at");
  CREATE INDEX "blogs_blog_items_order_idx" ON "blogs_blog_items" USING btree ("_order");
  CREATE INDEX "blogs_blog_items_parent_id_idx" ON "blogs_blog_items" USING btree ("_parent_id");
  CREATE INDEX "blogs_updated_at_idx" ON "blogs" USING btree ("updated_at");
  CREATE INDEX "blogs_created_at_idx" ON "blogs" USING btree ("created_at");
  CREATE INDEX "partners_partners_item_order_idx" ON "partners_partners_item" USING btree ("_order");
  CREATE INDEX "partners_partners_item_parent_id_idx" ON "partners_partners_item" USING btree ("_parent_id");
  CREATE INDEX "partners_partners_item_image_idx" ON "partners_partners_item" USING btree ("image_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "news_news_items_order_idx" ON "news_news_items" USING btree ("_order");
  CREATE INDEX "news_news_items_parent_id_idx" ON "news_news_items" USING btree ("_parent_id");
  CREATE INDEX "news_news_items_image_idx" ON "news_news_items" USING btree ("image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "footer_social_medias_order_idx" ON "footer_social_medias" USING btree ("_order");
  CREATE INDEX "footer_social_medias_parent_id_idx" ON "footer_social_medias" USING btree ("_parent_id");
  CREATE INDEX "footer_seccion_info_information_order_idx" ON "footer_seccion_info_information" USING btree ("_order");
  CREATE INDEX "footer_seccion_info_information_parent_id_idx" ON "footer_seccion_info_information" USING btree ("_parent_id");
  CREATE INDEX "footer_seccion_info_order_idx" ON "footer_seccion_info" USING btree ("_order");
  CREATE INDEX "footer_seccion_info_parent_id_idx" ON "footer_seccion_info" USING btree ("_parent_id");
  CREATE INDEX "footer_logo_idx" ON "footer" USING btree ("logo_id");
  CREATE INDEX "footer_updated_at_idx" ON "footer" USING btree ("updated_at");
  CREATE INDEX "footer_created_at_idx" ON "footer" USING btree ("created_at");
  CREATE INDEX "absys_service_updated_at_idx" ON "absys_service" USING btree ("updated_at");
  CREATE INDEX "absys_service_created_at_idx" ON "absys_service" USING btree ("created_at");
  CREATE INDEX "book_cover_service_updated_at_idx" ON "book_cover_service" USING btree ("updated_at");
  CREATE INDEX "book_cover_service_created_at_idx" ON "book_cover_service" USING btree ("created_at");
  CREATE INDEX "author_service_updated_at_idx" ON "author_service" USING btree ("updated_at");
  CREATE INDEX "author_service_created_at_idx" ON "author_service" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_hero_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_id");
  CREATE INDEX "payload_locked_documents_rels_header_id_idx" ON "payload_locked_documents_rels" USING btree ("header_id");
  CREATE INDEX "payload_locked_documents_rels_hero_carrusel_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_carrusel_id");
  CREATE INDEX "payload_locked_documents_rels_speakers_id_idx" ON "payload_locked_documents_rels" USING btree ("speakers_id");
  CREATE INDEX "payload_locked_documents_rels_statistics_id_idx" ON "payload_locked_documents_rels" USING btree ("statistics_id");
  CREATE INDEX "payload_locked_documents_rels_about_id_idx" ON "payload_locked_documents_rels" USING btree ("about_id");
  CREATE INDEX "payload_locked_documents_rels_features_id_idx" ON "payload_locked_documents_rels" USING btree ("features_id");
  CREATE INDEX "payload_locked_documents_rels_timeline_id_idx" ON "payload_locked_documents_rels" USING btree ("timeline_id");
  CREATE INDEX "payload_locked_documents_rels_input_id_idx" ON "payload_locked_documents_rels" USING btree ("input_id");
  CREATE INDEX "payload_locked_documents_rels_cta_id_idx" ON "payload_locked_documents_rels" USING btree ("cta_id");
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
  CREATE INDEX "payload_locked_documents_rels_send_email_id_idx" ON "payload_locked_documents_rels" USING btree ("send_email_id");
  CREATE INDEX "payload_locked_documents_rels_blogs_id_idx" ON "payload_locked_documents_rels" USING btree ("blogs_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_footer_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_id");
  CREATE INDEX "payload_locked_documents_rels_absys_service_id_idx" ON "payload_locked_documents_rels" USING btree ("absys_service_id");
  CREATE INDEX "payload_locked_documents_rels_book_cover_service_id_idx" ON "payload_locked_documents_rels" USING btree ("book_cover_service_id");
  CREATE INDEX "payload_locked_documents_rels_author_service_id_idx" ON "payload_locked_documents_rels" USING btree ("author_service_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_blocks_stats_block_order_idx" ON "home_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "home_blocks_stats_block_parent_id_idx" ON "home_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_stats_block_path_idx" ON "home_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "home_blocks_speakers_block_order_idx" ON "home_blocks_speakers_block" USING btree ("_order");
  CREATE INDEX "home_blocks_speakers_block_parent_id_idx" ON "home_blocks_speakers_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_speakers_block_path_idx" ON "home_blocks_speakers_block" USING btree ("_path");
  CREATE INDEX "home_blocks_about_block_order_idx" ON "home_blocks_about_block" USING btree ("_order");
  CREATE INDEX "home_blocks_about_block_parent_id_idx" ON "home_blocks_about_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_about_block_path_idx" ON "home_blocks_about_block" USING btree ("_path");
  CREATE INDEX "home_blocks_input_block_order_idx" ON "home_blocks_input_block" USING btree ("_order");
  CREATE INDEX "home_blocks_input_block_parent_id_idx" ON "home_blocks_input_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_input_block_path_idx" ON "home_blocks_input_block" USING btree ("_path");
  CREATE INDEX "home_blocks_features_block_order_idx" ON "home_blocks_features_block" USING btree ("_order");
  CREATE INDEX "home_blocks_features_block_parent_id_idx" ON "home_blocks_features_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_features_block_path_idx" ON "home_blocks_features_block" USING btree ("_path");
  CREATE INDEX "home_blocks_news_block_order_idx" ON "home_blocks_news_block" USING btree ("_order");
  CREATE INDEX "home_blocks_news_block_parent_id_idx" ON "home_blocks_news_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_news_block_path_idx" ON "home_blocks_news_block" USING btree ("_path");
  CREATE INDEX "home_blocks_blogs_block_order_idx" ON "home_blocks_blogs_block" USING btree ("_order");
  CREATE INDEX "home_blocks_blogs_block_parent_id_idx" ON "home_blocks_blogs_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_blogs_block_path_idx" ON "home_blocks_blogs_block" USING btree ("_path");
  CREATE INDEX "home_blocks_timeline_block_order_idx" ON "home_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX "home_blocks_timeline_block_parent_id_idx" ON "home_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_timeline_block_path_idx" ON "home_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX "home_blocks_partners_block_order_idx" ON "home_blocks_partners_block" USING btree ("_order");
  CREATE INDEX "home_blocks_partners_block_parent_id_idx" ON "home_blocks_partners_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_partners_block_path_idx" ON "home_blocks_partners_block" USING btree ("_path");
  CREATE INDEX "home_blocks_cta_block_order_idx" ON "home_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "home_blocks_cta_block_parent_id_idx" ON "home_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_cta_block_path_idx" ON "home_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "home_blocks_faq_block_order_idx" ON "home_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "home_blocks_faq_block_parent_id_idx" ON "home_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_faq_block_path_idx" ON "home_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "home_hero_idx" ON "home" USING btree ("hero_id");
  CREATE INDEX "home_hero_carrusel_idx" ON "home" USING btree ("hero_carrusel_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_statistics_id_idx" ON "home_rels" USING btree ("statistics_id");
  CREATE INDEX "home_rels_speakers_id_idx" ON "home_rels" USING btree ("speakers_id");
  CREATE INDEX "home_rels_about_id_idx" ON "home_rels" USING btree ("about_id");
  CREATE INDEX "home_rels_input_id_idx" ON "home_rels" USING btree ("input_id");
  CREATE INDEX "home_rels_features_id_idx" ON "home_rels" USING btree ("features_id");
  CREATE INDEX "home_rels_news_id_idx" ON "home_rels" USING btree ("news_id");
  CREATE INDEX "home_rels_blogs_id_idx" ON "home_rels" USING btree ("blogs_id");
  CREATE INDEX "home_rels_timeline_id_idx" ON "home_rels" USING btree ("timeline_id");
  CREATE INDEX "home_rels_partners_id_idx" ON "home_rels" USING btree ("partners_id");
  CREATE INDEX "home_rels_cta_id_idx" ON "home_rels" USING btree ("cta_id");
  CREATE INDEX "home_rels_faq_id_idx" ON "home_rels" USING btree ("faq_id");
  CREATE INDEX "library_hero_idx" ON "library" USING btree ("hero_id");
  CREATE INDEX "layout_header_idx" ON "layout" USING btree ("header_id");
  CREATE INDEX "layout_footer_idx" ON "layout" USING btree ("footer_id");
  CREATE INDEX "services_blocks_stats_block_order_idx" ON "services_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "services_blocks_stats_block_parent_id_idx" ON "services_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_stats_block_path_idx" ON "services_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "services_blocks_speakers_block_order_idx" ON "services_blocks_speakers_block" USING btree ("_order");
  CREATE INDEX "services_blocks_speakers_block_parent_id_idx" ON "services_blocks_speakers_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_speakers_block_path_idx" ON "services_blocks_speakers_block" USING btree ("_path");
  CREATE INDEX "services_blocks_about_block_order_idx" ON "services_blocks_about_block" USING btree ("_order");
  CREATE INDEX "services_blocks_about_block_parent_id_idx" ON "services_blocks_about_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_about_block_path_idx" ON "services_blocks_about_block" USING btree ("_path");
  CREATE INDEX "services_blocks_input_block_order_idx" ON "services_blocks_input_block" USING btree ("_order");
  CREATE INDEX "services_blocks_input_block_parent_id_idx" ON "services_blocks_input_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_input_block_path_idx" ON "services_blocks_input_block" USING btree ("_path");
  CREATE INDEX "services_blocks_features_block_order_idx" ON "services_blocks_features_block" USING btree ("_order");
  CREATE INDEX "services_blocks_features_block_parent_id_idx" ON "services_blocks_features_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_features_block_path_idx" ON "services_blocks_features_block" USING btree ("_path");
  CREATE INDEX "services_blocks_news_block_order_idx" ON "services_blocks_news_block" USING btree ("_order");
  CREATE INDEX "services_blocks_news_block_parent_id_idx" ON "services_blocks_news_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_news_block_path_idx" ON "services_blocks_news_block" USING btree ("_path");
  CREATE INDEX "services_blocks_blogs_block_order_idx" ON "services_blocks_blogs_block" USING btree ("_order");
  CREATE INDEX "services_blocks_blogs_block_parent_id_idx" ON "services_blocks_blogs_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_blogs_block_path_idx" ON "services_blocks_blogs_block" USING btree ("_path");
  CREATE INDEX "services_blocks_timeline_block_order_idx" ON "services_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX "services_blocks_timeline_block_parent_id_idx" ON "services_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_timeline_block_path_idx" ON "services_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX "services_blocks_partners_block_order_idx" ON "services_blocks_partners_block" USING btree ("_order");
  CREATE INDEX "services_blocks_partners_block_parent_id_idx" ON "services_blocks_partners_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_partners_block_path_idx" ON "services_blocks_partners_block" USING btree ("_path");
  CREATE INDEX "services_blocks_cta_block_order_idx" ON "services_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "services_blocks_cta_block_parent_id_idx" ON "services_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_cta_block_path_idx" ON "services_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "services_blocks_faq_block_order_idx" ON "services_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "services_blocks_faq_block_parent_id_idx" ON "services_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_faq_block_path_idx" ON "services_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "services_hero_idx" ON "services" USING btree ("hero_id");
  CREATE INDEX "services_hero_carrusel_idx" ON "services" USING btree ("hero_carrusel_id");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_statistics_id_idx" ON "services_rels" USING btree ("statistics_id");
  CREATE INDEX "services_rels_speakers_id_idx" ON "services_rels" USING btree ("speakers_id");
  CREATE INDEX "services_rels_about_id_idx" ON "services_rels" USING btree ("about_id");
  CREATE INDEX "services_rels_input_id_idx" ON "services_rels" USING btree ("input_id");
  CREATE INDEX "services_rels_features_id_idx" ON "services_rels" USING btree ("features_id");
  CREATE INDEX "services_rels_news_id_idx" ON "services_rels" USING btree ("news_id");
  CREATE INDEX "services_rels_blogs_id_idx" ON "services_rels" USING btree ("blogs_id");
  CREATE INDEX "services_rels_timeline_id_idx" ON "services_rels" USING btree ("timeline_id");
  CREATE INDEX "services_rels_partners_id_idx" ON "services_rels" USING btree ("partners_id");
  CREATE INDEX "services_rels_cta_id_idx" ON "services_rels" USING btree ("cta_id");
  CREATE INDEX "services_rels_faq_id_idx" ON "services_rels" USING btree ("faq_id");
  CREATE INDEX "investigation_blocks_stats_block_order_idx" ON "investigation_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_stats_block_parent_id_idx" ON "investigation_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_stats_block_path_idx" ON "investigation_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "investigation_blocks_speakers_block_order_idx" ON "investigation_blocks_speakers_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_speakers_block_parent_id_idx" ON "investigation_blocks_speakers_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_speakers_block_path_idx" ON "investigation_blocks_speakers_block" USING btree ("_path");
  CREATE INDEX "investigation_blocks_about_block_order_idx" ON "investigation_blocks_about_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_about_block_parent_id_idx" ON "investigation_blocks_about_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_about_block_path_idx" ON "investigation_blocks_about_block" USING btree ("_path");
  CREATE INDEX "investigation_blocks_input_block_order_idx" ON "investigation_blocks_input_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_input_block_parent_id_idx" ON "investigation_blocks_input_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_input_block_path_idx" ON "investigation_blocks_input_block" USING btree ("_path");
  CREATE INDEX "investigation_blocks_features_block_order_idx" ON "investigation_blocks_features_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_features_block_parent_id_idx" ON "investigation_blocks_features_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_features_block_path_idx" ON "investigation_blocks_features_block" USING btree ("_path");
  CREATE INDEX "investigation_blocks_news_block_order_idx" ON "investigation_blocks_news_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_news_block_parent_id_idx" ON "investigation_blocks_news_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_news_block_path_idx" ON "investigation_blocks_news_block" USING btree ("_path");
  CREATE INDEX "investigation_blocks_blogs_block_order_idx" ON "investigation_blocks_blogs_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_blogs_block_parent_id_idx" ON "investigation_blocks_blogs_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_blogs_block_path_idx" ON "investigation_blocks_blogs_block" USING btree ("_path");
  CREATE INDEX "investigation_blocks_timeline_block_order_idx" ON "investigation_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_timeline_block_parent_id_idx" ON "investigation_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_timeline_block_path_idx" ON "investigation_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX "investigation_blocks_partners_block_order_idx" ON "investigation_blocks_partners_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_partners_block_parent_id_idx" ON "investigation_blocks_partners_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_partners_block_path_idx" ON "investigation_blocks_partners_block" USING btree ("_path");
  CREATE INDEX "investigation_blocks_cta_block_order_idx" ON "investigation_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_cta_block_parent_id_idx" ON "investigation_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_cta_block_path_idx" ON "investigation_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "investigation_blocks_faq_block_order_idx" ON "investigation_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "investigation_blocks_faq_block_parent_id_idx" ON "investigation_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "investigation_blocks_faq_block_path_idx" ON "investigation_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "investigation_hero_idx" ON "investigation" USING btree ("hero_id");
  CREATE INDEX "investigation_hero_carrusel_idx" ON "investigation" USING btree ("hero_carrusel_id");
  CREATE INDEX "investigation_rels_order_idx" ON "investigation_rels" USING btree ("order");
  CREATE INDEX "investigation_rels_parent_idx" ON "investigation_rels" USING btree ("parent_id");
  CREATE INDEX "investigation_rels_path_idx" ON "investigation_rels" USING btree ("path");
  CREATE INDEX "investigation_rels_statistics_id_idx" ON "investigation_rels" USING btree ("statistics_id");
  CREATE INDEX "investigation_rels_speakers_id_idx" ON "investigation_rels" USING btree ("speakers_id");
  CREATE INDEX "investigation_rels_about_id_idx" ON "investigation_rels" USING btree ("about_id");
  CREATE INDEX "investigation_rels_input_id_idx" ON "investigation_rels" USING btree ("input_id");
  CREATE INDEX "investigation_rels_features_id_idx" ON "investigation_rels" USING btree ("features_id");
  CREATE INDEX "investigation_rels_news_id_idx" ON "investigation_rels" USING btree ("news_id");
  CREATE INDEX "investigation_rels_blogs_id_idx" ON "investigation_rels" USING btree ("blogs_id");
  CREATE INDEX "investigation_rels_timeline_id_idx" ON "investigation_rels" USING btree ("timeline_id");
  CREATE INDEX "investigation_rels_partners_id_idx" ON "investigation_rels" USING btree ("partners_id");
  CREATE INDEX "investigation_rels_cta_id_idx" ON "investigation_rels" USING btree ("cta_id");
  CREATE INDEX "investigation_rels_faq_id_idx" ON "investigation_rels" USING btree ("faq_id");
  CREATE INDEX "repository_blocks_stats_block_order_idx" ON "repository_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_stats_block_parent_id_idx" ON "repository_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_stats_block_path_idx" ON "repository_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "repository_blocks_speakers_block_order_idx" ON "repository_blocks_speakers_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_speakers_block_parent_id_idx" ON "repository_blocks_speakers_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_speakers_block_path_idx" ON "repository_blocks_speakers_block" USING btree ("_path");
  CREATE INDEX "repository_blocks_about_block_order_idx" ON "repository_blocks_about_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_about_block_parent_id_idx" ON "repository_blocks_about_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_about_block_path_idx" ON "repository_blocks_about_block" USING btree ("_path");
  CREATE INDEX "repository_blocks_input_block_order_idx" ON "repository_blocks_input_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_input_block_parent_id_idx" ON "repository_blocks_input_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_input_block_path_idx" ON "repository_blocks_input_block" USING btree ("_path");
  CREATE INDEX "repository_blocks_features_block_order_idx" ON "repository_blocks_features_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_features_block_parent_id_idx" ON "repository_blocks_features_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_features_block_path_idx" ON "repository_blocks_features_block" USING btree ("_path");
  CREATE INDEX "repository_blocks_news_block_order_idx" ON "repository_blocks_news_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_news_block_parent_id_idx" ON "repository_blocks_news_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_news_block_path_idx" ON "repository_blocks_news_block" USING btree ("_path");
  CREATE INDEX "repository_blocks_blogs_block_order_idx" ON "repository_blocks_blogs_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_blogs_block_parent_id_idx" ON "repository_blocks_blogs_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_blogs_block_path_idx" ON "repository_blocks_blogs_block" USING btree ("_path");
  CREATE INDEX "repository_blocks_timeline_block_order_idx" ON "repository_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_timeline_block_parent_id_idx" ON "repository_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_timeline_block_path_idx" ON "repository_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX "repository_blocks_partners_block_order_idx" ON "repository_blocks_partners_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_partners_block_parent_id_idx" ON "repository_blocks_partners_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_partners_block_path_idx" ON "repository_blocks_partners_block" USING btree ("_path");
  CREATE INDEX "repository_blocks_cta_block_order_idx" ON "repository_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_cta_block_parent_id_idx" ON "repository_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_cta_block_path_idx" ON "repository_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "repository_blocks_faq_block_order_idx" ON "repository_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_faq_block_parent_id_idx" ON "repository_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_faq_block_path_idx" ON "repository_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "repository_hero_idx" ON "repository" USING btree ("hero_id");
  CREATE INDEX "repository_rels_order_idx" ON "repository_rels" USING btree ("order");
  CREATE INDEX "repository_rels_parent_idx" ON "repository_rels" USING btree ("parent_id");
  CREATE INDEX "repository_rels_path_idx" ON "repository_rels" USING btree ("path");
  CREATE INDEX "repository_rels_statistics_id_idx" ON "repository_rels" USING btree ("statistics_id");
  CREATE INDEX "repository_rels_speakers_id_idx" ON "repository_rels" USING btree ("speakers_id");
  CREATE INDEX "repository_rels_about_id_idx" ON "repository_rels" USING btree ("about_id");
  CREATE INDEX "repository_rels_input_id_idx" ON "repository_rels" USING btree ("input_id");
  CREATE INDEX "repository_rels_features_id_idx" ON "repository_rels" USING btree ("features_id");
  CREATE INDEX "repository_rels_news_id_idx" ON "repository_rels" USING btree ("news_id");
  CREATE INDEX "repository_rels_blogs_id_idx" ON "repository_rels" USING btree ("blogs_id");
  CREATE INDEX "repository_rels_timeline_id_idx" ON "repository_rels" USING btree ("timeline_id");
  CREATE INDEX "repository_rels_partners_id_idx" ON "repository_rels" USING btree ("partners_id");
  CREATE INDEX "repository_rels_cta_id_idx" ON "repository_rels" USING btree ("cta_id");
  CREATE INDEX "repository_rels_faq_id_idx" ON "repository_rels" USING btree ("faq_id");
  CREATE INDEX "formation_blocks_stats_block_order_idx" ON "formation_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_stats_block_parent_id_idx" ON "formation_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_stats_block_path_idx" ON "formation_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "formation_blocks_speakers_block_order_idx" ON "formation_blocks_speakers_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_speakers_block_parent_id_idx" ON "formation_blocks_speakers_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_speakers_block_path_idx" ON "formation_blocks_speakers_block" USING btree ("_path");
  CREATE INDEX "formation_blocks_about_block_order_idx" ON "formation_blocks_about_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_about_block_parent_id_idx" ON "formation_blocks_about_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_about_block_path_idx" ON "formation_blocks_about_block" USING btree ("_path");
  CREATE INDEX "formation_blocks_input_block_order_idx" ON "formation_blocks_input_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_input_block_parent_id_idx" ON "formation_blocks_input_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_input_block_path_idx" ON "formation_blocks_input_block" USING btree ("_path");
  CREATE INDEX "formation_blocks_features_block_order_idx" ON "formation_blocks_features_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_features_block_parent_id_idx" ON "formation_blocks_features_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_features_block_path_idx" ON "formation_blocks_features_block" USING btree ("_path");
  CREATE INDEX "formation_blocks_news_block_order_idx" ON "formation_blocks_news_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_news_block_parent_id_idx" ON "formation_blocks_news_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_news_block_path_idx" ON "formation_blocks_news_block" USING btree ("_path");
  CREATE INDEX "formation_blocks_blogs_block_order_idx" ON "formation_blocks_blogs_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_blogs_block_parent_id_idx" ON "formation_blocks_blogs_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_blogs_block_path_idx" ON "formation_blocks_blogs_block" USING btree ("_path");
  CREATE INDEX "formation_blocks_timeline_block_order_idx" ON "formation_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_timeline_block_parent_id_idx" ON "formation_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_timeline_block_path_idx" ON "formation_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX "formation_blocks_partners_block_order_idx" ON "formation_blocks_partners_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_partners_block_parent_id_idx" ON "formation_blocks_partners_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_partners_block_path_idx" ON "formation_blocks_partners_block" USING btree ("_path");
  CREATE INDEX "formation_blocks_cta_block_order_idx" ON "formation_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_cta_block_parent_id_idx" ON "formation_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_cta_block_path_idx" ON "formation_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "formation_blocks_faq_block_order_idx" ON "formation_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "formation_blocks_faq_block_parent_id_idx" ON "formation_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "formation_blocks_faq_block_path_idx" ON "formation_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "formation_hero_idx" ON "formation" USING btree ("hero_id");
  CREATE INDEX "formation_hero_carrusel_idx" ON "formation" USING btree ("hero_carrusel_id");
  CREATE INDEX "formation_rels_order_idx" ON "formation_rels" USING btree ("order");
  CREATE INDEX "formation_rels_parent_idx" ON "formation_rels" USING btree ("parent_id");
  CREATE INDEX "formation_rels_path_idx" ON "formation_rels" USING btree ("path");
  CREATE INDEX "formation_rels_statistics_id_idx" ON "formation_rels" USING btree ("statistics_id");
  CREATE INDEX "formation_rels_speakers_id_idx" ON "formation_rels" USING btree ("speakers_id");
  CREATE INDEX "formation_rels_about_id_idx" ON "formation_rels" USING btree ("about_id");
  CREATE INDEX "formation_rels_input_id_idx" ON "formation_rels" USING btree ("input_id");
  CREATE INDEX "formation_rels_features_id_idx" ON "formation_rels" USING btree ("features_id");
  CREATE INDEX "formation_rels_news_id_idx" ON "formation_rels" USING btree ("news_id");
  CREATE INDEX "formation_rels_blogs_id_idx" ON "formation_rels" USING btree ("blogs_id");
  CREATE INDEX "formation_rels_timeline_id_idx" ON "formation_rels" USING btree ("timeline_id");
  CREATE INDEX "formation_rels_partners_id_idx" ON "formation_rels" USING btree ("partners_id");
  CREATE INDEX "formation_rels_cta_id_idx" ON "formation_rels" USING btree ("cta_id");
  CREATE INDEX "formation_rels_faq_id_idx" ON "formation_rels" USING btree ("faq_id");
  CREATE INDEX "contact_hero_idx" ON "contact" USING btree ("hero_id");
  CREATE INDEX "about_us_quienes_somos_order_idx" ON "about_us_quienes_somos" USING btree ("_order");
  CREATE INDEX "about_us_quienes_somos_parent_id_idx" ON "about_us_quienes_somos" USING btree ("_parent_id");
  CREATE INDEX "about_us_quienes_somos_images_idx" ON "about_us_quienes_somos" USING btree ("images_id");
  CREATE INDEX "about_us_horarios_order_idx" ON "about_us_horarios" USING btree ("_order");
  CREATE INDEX "about_us_horarios_parent_id_idx" ON "about_us_horarios" USING btree ("_parent_id");
  CREATE INDEX "about_us_horarios_images_idx" ON "about_us_horarios" USING btree ("images_id");
  CREATE INDEX "about_us_normativa_order_idx" ON "about_us_normativa" USING btree ("_order");
  CREATE INDEX "about_us_normativa_parent_id_idx" ON "about_us_normativa" USING btree ("_parent_id");
  CREATE INDEX "about_us_normativa_images_idx" ON "about_us_normativa" USING btree ("images_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "hero" CASCADE;
  DROP TABLE "header_navbar_items" CASCADE;
  DROP TABLE "header_navbar" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "hero_carrusel_items" CASCADE;
  DROP TABLE "hero_carrusel" CASCADE;
  DROP TABLE "speakers_people_socials" CASCADE;
  DROP TABLE "speakers_people" CASCADE;
  DROP TABLE "speakers" CASCADE;
  DROP TABLE "statistics_stats" CASCADE;
  DROP TABLE "statistics" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "features_feature" CASCADE;
  DROP TABLE "features" CASCADE;
  DROP TABLE "timeline_calendar_events" CASCADE;
  DROP TABLE "timeline_calendar" CASCADE;
  DROP TABLE "timeline" CASCADE;
  DROP TABLE "input" CASCADE;
  DROP TABLE "cta" CASCADE;
  DROP TABLE "faq_faqs" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "send_email" CASCADE;
  DROP TABLE "blogs_blog_items" CASCADE;
  DROP TABLE "blogs" CASCADE;
  DROP TABLE "partners_partners_item" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "news_news_items" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "footer_social_medias" CASCADE;
  DROP TABLE "footer_seccion_info_information" CASCADE;
  DROP TABLE "footer_seccion_info" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "absys_service" CASCADE;
  DROP TABLE "book_cover_service" CASCADE;
  DROP TABLE "author_service" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_blocks_stats_block" CASCADE;
  DROP TABLE "home_blocks_speakers_block" CASCADE;
  DROP TABLE "home_blocks_about_block" CASCADE;
  DROP TABLE "home_blocks_input_block" CASCADE;
  DROP TABLE "home_blocks_features_block" CASCADE;
  DROP TABLE "home_blocks_news_block" CASCADE;
  DROP TABLE "home_blocks_blogs_block" CASCADE;
  DROP TABLE "home_blocks_timeline_block" CASCADE;
  DROP TABLE "home_blocks_partners_block" CASCADE;
  DROP TABLE "home_blocks_cta_block" CASCADE;
  DROP TABLE "home_blocks_faq_block" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "library" CASCADE;
  DROP TABLE "layout" CASCADE;
  DROP TABLE "services_blocks_stats_block" CASCADE;
  DROP TABLE "services_blocks_speakers_block" CASCADE;
  DROP TABLE "services_blocks_about_block" CASCADE;
  DROP TABLE "services_blocks_input_block" CASCADE;
  DROP TABLE "services_blocks_features_block" CASCADE;
  DROP TABLE "services_blocks_news_block" CASCADE;
  DROP TABLE "services_blocks_blogs_block" CASCADE;
  DROP TABLE "services_blocks_timeline_block" CASCADE;
  DROP TABLE "services_blocks_partners_block" CASCADE;
  DROP TABLE "services_blocks_cta_block" CASCADE;
  DROP TABLE "services_blocks_faq_block" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "investigation_blocks_stats_block" CASCADE;
  DROP TABLE "investigation_blocks_speakers_block" CASCADE;
  DROP TABLE "investigation_blocks_about_block" CASCADE;
  DROP TABLE "investigation_blocks_input_block" CASCADE;
  DROP TABLE "investigation_blocks_features_block" CASCADE;
  DROP TABLE "investigation_blocks_news_block" CASCADE;
  DROP TABLE "investigation_blocks_blogs_block" CASCADE;
  DROP TABLE "investigation_blocks_timeline_block" CASCADE;
  DROP TABLE "investigation_blocks_partners_block" CASCADE;
  DROP TABLE "investigation_blocks_cta_block" CASCADE;
  DROP TABLE "investigation_blocks_faq_block" CASCADE;
  DROP TABLE "investigation" CASCADE;
  DROP TABLE "investigation_rels" CASCADE;
  DROP TABLE "repository_blocks_stats_block" CASCADE;
  DROP TABLE "repository_blocks_speakers_block" CASCADE;
  DROP TABLE "repository_blocks_about_block" CASCADE;
  DROP TABLE "repository_blocks_input_block" CASCADE;
  DROP TABLE "repository_blocks_features_block" CASCADE;
  DROP TABLE "repository_blocks_news_block" CASCADE;
  DROP TABLE "repository_blocks_blogs_block" CASCADE;
  DROP TABLE "repository_blocks_timeline_block" CASCADE;
  DROP TABLE "repository_blocks_partners_block" CASCADE;
  DROP TABLE "repository_blocks_cta_block" CASCADE;
  DROP TABLE "repository_blocks_faq_block" CASCADE;
  DROP TABLE "repository" CASCADE;
  DROP TABLE "repository_rels" CASCADE;
  DROP TABLE "formation_blocks_stats_block" CASCADE;
  DROP TABLE "formation_blocks_speakers_block" CASCADE;
  DROP TABLE "formation_blocks_about_block" CASCADE;
  DROP TABLE "formation_blocks_input_block" CASCADE;
  DROP TABLE "formation_blocks_features_block" CASCADE;
  DROP TABLE "formation_blocks_news_block" CASCADE;
  DROP TABLE "formation_blocks_blogs_block" CASCADE;
  DROP TABLE "formation_blocks_timeline_block" CASCADE;
  DROP TABLE "formation_blocks_partners_block" CASCADE;
  DROP TABLE "formation_blocks_cta_block" CASCADE;
  DROP TABLE "formation_blocks_faq_block" CASCADE;
  DROP TABLE "formation" CASCADE;
  DROP TABLE "formation_rels" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TABLE "about_us_quienes_somos" CASCADE;
  DROP TABLE "about_us_horarios" CASCADE;
  DROP TABLE "about_us_normativa" CASCADE;
  DROP TABLE "about_us" CASCADE;
  DROP TYPE "public"."enum_header_type";
  DROP TYPE "public"."enum_speakers_people_socials_icon";
  DROP TYPE "public"."enum_statistics_stats_icon";
  DROP TYPE "public"."enum_features_feature_icon";
  DROP TYPE "public"."enum_news_style";
  DROP TYPE "public"."enum_footer_social_medias_icon";
  DROP TYPE "public"."enum_footer_seccion_info_information_icon";
  DROP TYPE "public"."enum_footer_type";`)
}

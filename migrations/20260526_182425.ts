import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_speakers_people_socials_icon" AS ENUM('FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube', 'Globe');
  CREATE TYPE "public"."enum_statistics_stats_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar');
  CREATE TYPE "public"."enum_features_feature_icon" AS ENUM('Lightbulb', 'BookOpen', 'Microscope', 'Star', 'User', 'Briefcase', 'Phone', 'Mail', 'MapPin', 'Calendar');
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
  
  CREATE TABLE "library" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
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
  	"speakers_id" integer,
  	"statistics_id" integer,
  	"about_id" integer,
  	"features_id" integer,
  	"timeline_id" integer,
  	"cta_id" integer,
  	"faq_id" integer,
  	"send_email_id" integer,
  	"library_id" integer
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
  
  CREATE TABLE "home_blocks_features_block" (
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
  	"features_id" integer,
  	"timeline_id" integer,
  	"cta_id" integer,
  	"faq_id" integer
  );
  
  CREATE TABLE "repository_blocks_cta_block" (
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
  	"cta_id" integer
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "speakers_people_socials" ADD CONSTRAINT "speakers_people_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."speakers_people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "speakers_people" ADD CONSTRAINT "speakers_people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "speakers_people" ADD CONSTRAINT "speakers_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "statistics_stats" ADD CONSTRAINT "statistics_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "features_feature" ADD CONSTRAINT "features_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "timeline_calendar_events" ADD CONSTRAINT "timeline_calendar_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."timeline_calendar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "timeline_calendar" ADD CONSTRAINT "timeline_calendar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_faqs" ADD CONSTRAINT "faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "library" ADD CONSTRAINT "library_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_statistics_fk" FOREIGN KEY ("statistics_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_timeline_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cta_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_send_email_fk" FOREIGN KEY ("send_email_id") REFERENCES "public"."send_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_library_fk" FOREIGN KEY ("library_id") REFERENCES "public"."library"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stats_block" ADD CONSTRAINT "home_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_speakers_block" ADD CONSTRAINT "home_blocks_speakers_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_about_block" ADD CONSTRAINT "home_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_features_block" ADD CONSTRAINT "home_blocks_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_timeline_block" ADD CONSTRAINT "home_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_cta_block" ADD CONSTRAINT "home_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_faq_block" ADD CONSTRAINT "home_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_statistics_fk" FOREIGN KEY ("statistics_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_timeline_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_cta_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_cta_block" ADD CONSTRAINT "repository_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository" ADD CONSTRAINT "repository_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_cta_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact" ADD CONSTRAINT "contact_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
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
  CREATE INDEX "cta_updated_at_idx" ON "cta" USING btree ("updated_at");
  CREATE INDEX "cta_created_at_idx" ON "cta" USING btree ("created_at");
  CREATE INDEX "faq_faqs_order_idx" ON "faq_faqs" USING btree ("_order");
  CREATE INDEX "faq_faqs_parent_id_idx" ON "faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE INDEX "send_email_updated_at_idx" ON "send_email" USING btree ("updated_at");
  CREATE INDEX "send_email_created_at_idx" ON "send_email" USING btree ("created_at");
  CREATE INDEX "library_hero_idx" ON "library" USING btree ("hero_id");
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
  CREATE INDEX "payload_locked_documents_rels_speakers_id_idx" ON "payload_locked_documents_rels" USING btree ("speakers_id");
  CREATE INDEX "payload_locked_documents_rels_statistics_id_idx" ON "payload_locked_documents_rels" USING btree ("statistics_id");
  CREATE INDEX "payload_locked_documents_rels_about_id_idx" ON "payload_locked_documents_rels" USING btree ("about_id");
  CREATE INDEX "payload_locked_documents_rels_features_id_idx" ON "payload_locked_documents_rels" USING btree ("features_id");
  CREATE INDEX "payload_locked_documents_rels_timeline_id_idx" ON "payload_locked_documents_rels" USING btree ("timeline_id");
  CREATE INDEX "payload_locked_documents_rels_cta_id_idx" ON "payload_locked_documents_rels" USING btree ("cta_id");
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
  CREATE INDEX "payload_locked_documents_rels_send_email_id_idx" ON "payload_locked_documents_rels" USING btree ("send_email_id");
  CREATE INDEX "payload_locked_documents_rels_library_id_idx" ON "payload_locked_documents_rels" USING btree ("library_id");
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
  CREATE INDEX "home_blocks_features_block_order_idx" ON "home_blocks_features_block" USING btree ("_order");
  CREATE INDEX "home_blocks_features_block_parent_id_idx" ON "home_blocks_features_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_features_block_path_idx" ON "home_blocks_features_block" USING btree ("_path");
  CREATE INDEX "home_blocks_timeline_block_order_idx" ON "home_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX "home_blocks_timeline_block_parent_id_idx" ON "home_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_timeline_block_path_idx" ON "home_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX "home_blocks_cta_block_order_idx" ON "home_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "home_blocks_cta_block_parent_id_idx" ON "home_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_cta_block_path_idx" ON "home_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "home_blocks_faq_block_order_idx" ON "home_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "home_blocks_faq_block_parent_id_idx" ON "home_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_faq_block_path_idx" ON "home_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "home_hero_idx" ON "home" USING btree ("hero_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_statistics_id_idx" ON "home_rels" USING btree ("statistics_id");
  CREATE INDEX "home_rels_speakers_id_idx" ON "home_rels" USING btree ("speakers_id");
  CREATE INDEX "home_rels_about_id_idx" ON "home_rels" USING btree ("about_id");
  CREATE INDEX "home_rels_features_id_idx" ON "home_rels" USING btree ("features_id");
  CREATE INDEX "home_rels_timeline_id_idx" ON "home_rels" USING btree ("timeline_id");
  CREATE INDEX "home_rels_cta_id_idx" ON "home_rels" USING btree ("cta_id");
  CREATE INDEX "home_rels_faq_id_idx" ON "home_rels" USING btree ("faq_id");
  CREATE INDEX "repository_blocks_cta_block_order_idx" ON "repository_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_cta_block_parent_id_idx" ON "repository_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_cta_block_path_idx" ON "repository_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "repository_hero_idx" ON "repository" USING btree ("hero_id");
  CREATE INDEX "repository_rels_order_idx" ON "repository_rels" USING btree ("order");
  CREATE INDEX "repository_rels_parent_idx" ON "repository_rels" USING btree ("parent_id");
  CREATE INDEX "repository_rels_path_idx" ON "repository_rels" USING btree ("path");
  CREATE INDEX "repository_rels_cta_id_idx" ON "repository_rels" USING btree ("cta_id");
  CREATE INDEX "contact_hero_idx" ON "contact" USING btree ("hero_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "hero" CASCADE;
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
  DROP TABLE "cta" CASCADE;
  DROP TABLE "faq_faqs" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "send_email" CASCADE;
  DROP TABLE "library" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_blocks_stats_block" CASCADE;
  DROP TABLE "home_blocks_speakers_block" CASCADE;
  DROP TABLE "home_blocks_about_block" CASCADE;
  DROP TABLE "home_blocks_features_block" CASCADE;
  DROP TABLE "home_blocks_timeline_block" CASCADE;
  DROP TABLE "home_blocks_cta_block" CASCADE;
  DROP TABLE "home_blocks_faq_block" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "repository_blocks_cta_block" CASCADE;
  DROP TABLE "repository" CASCADE;
  DROP TABLE "repository_rels" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TYPE "public"."enum_speakers_people_socials_icon";
  DROP TYPE "public"."enum_statistics_stats_icon";
  DROP TYPE "public"."enum_features_feature_icon";`)
}

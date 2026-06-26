import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  CREATE INDEX "services_rels_faq_id_idx" ON "services_rels" USING btree ("faq_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
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
  DROP TABLE "services_rels" CASCADE;`)
}

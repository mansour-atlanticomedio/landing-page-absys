import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "input" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"placeholder" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_blocks_input_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
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
  
  CREATE TABLE "repository_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "input_id" integer;
  ALTER TABLE "home_rels" ADD COLUMN "input_id" integer;
  ALTER TABLE "repository_rels" ADD COLUMN "statistics_id" integer;
  ALTER TABLE "repository_rels" ADD COLUMN "speakers_id" integer;
  ALTER TABLE "repository_rels" ADD COLUMN "about_id" integer;
  ALTER TABLE "repository_rels" ADD COLUMN "input_id" integer;
  ALTER TABLE "repository_rels" ADD COLUMN "features_id" integer;
  ALTER TABLE "repository_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "repository_rels" ADD COLUMN "blogs_id" integer;
  ALTER TABLE "repository_rels" ADD COLUMN "timeline_id" integer;
  ALTER TABLE "repository_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "repository_rels" ADD COLUMN "faq_id" integer;
  ALTER TABLE "home_blocks_input_block" ADD CONSTRAINT "home_blocks_input_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_stats_block" ADD CONSTRAINT "repository_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_speakers_block" ADD CONSTRAINT "repository_blocks_speakers_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_about_block" ADD CONSTRAINT "repository_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_input_block" ADD CONSTRAINT "repository_blocks_input_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_features_block" ADD CONSTRAINT "repository_blocks_features_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_news_block" ADD CONSTRAINT "repository_blocks_news_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_blogs_block" ADD CONSTRAINT "repository_blocks_blogs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_timeline_block" ADD CONSTRAINT "repository_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_partners_block" ADD CONSTRAINT "repository_blocks_partners_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_blocks_faq_block" ADD CONSTRAINT "repository_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "input_updated_at_idx" ON "input" USING btree ("updated_at");
  CREATE INDEX "input_created_at_idx" ON "input" USING btree ("created_at");
  CREATE INDEX "home_blocks_input_block_order_idx" ON "home_blocks_input_block" USING btree ("_order");
  CREATE INDEX "home_blocks_input_block_parent_id_idx" ON "home_blocks_input_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_input_block_path_idx" ON "home_blocks_input_block" USING btree ("_path");
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
  CREATE INDEX "repository_blocks_faq_block_order_idx" ON "repository_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "repository_blocks_faq_block_parent_id_idx" ON "repository_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "repository_blocks_faq_block_path_idx" ON "repository_blocks_faq_block" USING btree ("_path");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_input_fk" FOREIGN KEY ("input_id") REFERENCES "public"."input"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_input_fk" FOREIGN KEY ("input_id") REFERENCES "public"."input"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_statistics_fk" FOREIGN KEY ("statistics_id") REFERENCES "public"."statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_input_fk" FOREIGN KEY ("input_id") REFERENCES "public"."input"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_timeline_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_rels" ADD CONSTRAINT "repository_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_input_id_idx" ON "payload_locked_documents_rels" USING btree ("input_id");
  CREATE INDEX "home_rels_input_id_idx" ON "home_rels" USING btree ("input_id");
  CREATE INDEX "repository_rels_statistics_id_idx" ON "repository_rels" USING btree ("statistics_id");
  CREATE INDEX "repository_rels_speakers_id_idx" ON "repository_rels" USING btree ("speakers_id");
  CREATE INDEX "repository_rels_about_id_idx" ON "repository_rels" USING btree ("about_id");
  CREATE INDEX "repository_rels_input_id_idx" ON "repository_rels" USING btree ("input_id");
  CREATE INDEX "repository_rels_features_id_idx" ON "repository_rels" USING btree ("features_id");
  CREATE INDEX "repository_rels_news_id_idx" ON "repository_rels" USING btree ("news_id");
  CREATE INDEX "repository_rels_blogs_id_idx" ON "repository_rels" USING btree ("blogs_id");
  CREATE INDEX "repository_rels_timeline_id_idx" ON "repository_rels" USING btree ("timeline_id");
  CREATE INDEX "repository_rels_partners_id_idx" ON "repository_rels" USING btree ("partners_id");
  CREATE INDEX "repository_rels_faq_id_idx" ON "repository_rels" USING btree ("faq_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "input" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_input_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_blocks_speakers_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_blocks_about_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_blocks_input_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_blocks_features_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_blocks_news_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_blocks_blogs_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_blocks_timeline_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_blocks_partners_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "input" CASCADE;
  DROP TABLE "home_blocks_input_block" CASCADE;
  DROP TABLE "repository_blocks_stats_block" CASCADE;
  DROP TABLE "repository_blocks_speakers_block" CASCADE;
  DROP TABLE "repository_blocks_about_block" CASCADE;
  DROP TABLE "repository_blocks_input_block" CASCADE;
  DROP TABLE "repository_blocks_features_block" CASCADE;
  DROP TABLE "repository_blocks_news_block" CASCADE;
  DROP TABLE "repository_blocks_blogs_block" CASCADE;
  DROP TABLE "repository_blocks_timeline_block" CASCADE;
  DROP TABLE "repository_blocks_partners_block" CASCADE;
  DROP TABLE "repository_blocks_faq_block" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_input_fk";
  
  ALTER TABLE "home_rels" DROP CONSTRAINT "home_rels_input_fk";
  
  ALTER TABLE "repository_rels" DROP CONSTRAINT "repository_rels_statistics_fk";
  
  ALTER TABLE "repository_rels" DROP CONSTRAINT "repository_rels_speakers_fk";
  
  ALTER TABLE "repository_rels" DROP CONSTRAINT "repository_rels_about_fk";
  
  ALTER TABLE "repository_rels" DROP CONSTRAINT "repository_rels_input_fk";
  
  ALTER TABLE "repository_rels" DROP CONSTRAINT "repository_rels_features_fk";
  
  ALTER TABLE "repository_rels" DROP CONSTRAINT "repository_rels_news_fk";
  
  ALTER TABLE "repository_rels" DROP CONSTRAINT "repository_rels_blogs_fk";
  
  ALTER TABLE "repository_rels" DROP CONSTRAINT "repository_rels_timeline_fk";
  
  ALTER TABLE "repository_rels" DROP CONSTRAINT "repository_rels_partners_fk";
  
  ALTER TABLE "repository_rels" DROP CONSTRAINT "repository_rels_faq_fk";
  
  DROP INDEX "payload_locked_documents_rels_input_id_idx";
  DROP INDEX "home_rels_input_id_idx";
  DROP INDEX "repository_rels_statistics_id_idx";
  DROP INDEX "repository_rels_speakers_id_idx";
  DROP INDEX "repository_rels_about_id_idx";
  DROP INDEX "repository_rels_input_id_idx";
  DROP INDEX "repository_rels_features_id_idx";
  DROP INDEX "repository_rels_news_id_idx";
  DROP INDEX "repository_rels_blogs_id_idx";
  DROP INDEX "repository_rels_timeline_id_idx";
  DROP INDEX "repository_rels_partners_id_idx";
  DROP INDEX "repository_rels_faq_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "input_id";
  ALTER TABLE "home_rels" DROP COLUMN "input_id";
  ALTER TABLE "repository_rels" DROP COLUMN "statistics_id";
  ALTER TABLE "repository_rels" DROP COLUMN "speakers_id";
  ALTER TABLE "repository_rels" DROP COLUMN "about_id";
  ALTER TABLE "repository_rels" DROP COLUMN "input_id";
  ALTER TABLE "repository_rels" DROP COLUMN "features_id";
  ALTER TABLE "repository_rels" DROP COLUMN "news_id";
  ALTER TABLE "repository_rels" DROP COLUMN "blogs_id";
  ALTER TABLE "repository_rels" DROP COLUMN "timeline_id";
  ALTER TABLE "repository_rels" DROP COLUMN "partners_id";
  ALTER TABLE "repository_rels" DROP COLUMN "faq_id";`)
}

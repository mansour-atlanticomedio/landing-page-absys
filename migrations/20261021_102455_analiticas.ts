import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_analytics_events_device" AS ENUM('desktop', 'mobile', 'tablet', 'other');
  CREATE TYPE "public"."enum_analytics_events_browser" AS ENUM('chrome', 'safari', 'firefox', 'edge', 'other');
  CREATE TABLE "analytics_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar NOT NULL,
  	"referrer" varchar,
  	"visitor" varchar NOT NULL,
  	"device" "enum_analytics_events_device",
  	"browser" "enum_analytics_events_browser",
  	"is_reader" boolean DEFAULT false,
  	"is_entry" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "analytics_presence" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visitor" varchar NOT NULL,
  	"path" varchar,
  	"last_seen" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "analytics_events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "analytics_presence_id" integer;
  CREATE INDEX "analytics_events_path_idx" ON "analytics_events" USING btree ("path");
  CREATE INDEX "analytics_events_visitor_idx" ON "analytics_events" USING btree ("visitor");
  CREATE INDEX "analytics_events_updated_at_idx" ON "analytics_events" USING btree ("updated_at");
  CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");
  CREATE UNIQUE INDEX "analytics_presence_visitor_idx" ON "analytics_presence" USING btree ("visitor");
  CREATE INDEX "analytics_presence_last_seen_idx" ON "analytics_presence" USING btree ("last_seen");
  CREATE INDEX "analytics_presence_updated_at_idx" ON "analytics_presence" USING btree ("updated_at");
  CREATE INDEX "analytics_presence_created_at_idx" ON "analytics_presence" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_events_fk" FOREIGN KEY ("analytics_events_id") REFERENCES "public"."analytics_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_presence_fk" FOREIGN KEY ("analytics_presence_id") REFERENCES "public"."analytics_presence"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_analytics_events_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_events_id");
  CREATE INDEX "payload_locked_documents_rels_analytics_presence_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_presence_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "analytics_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "analytics_presence" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_analytics_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_analytics_presence_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_analytics_events_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_analytics_presence_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "analytics_events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "analytics_presence_id";
  DROP TABLE IF EXISTS "analytics_events" CASCADE;
  DROP TABLE IF EXISTS "analytics_presence" CASCADE;
  DROP TYPE "public"."enum_analytics_events_device";
  DROP TYPE "public"."enum_analytics_events_browser";`)
}

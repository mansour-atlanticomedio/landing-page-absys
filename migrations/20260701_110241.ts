import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "header_navbar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"to" varchar
  );
  
  CREATE TABLE "header_navbar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"to" varchar,
  	"inicio" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer_social_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"sublogo" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer_simple_social_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "footer_simple" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" numeric,
  	"title" varchar,
  	"schedule" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "layout" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_id" integer,
  	"footer_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "header_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "footer_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "footer_simple_id" integer;
  ALTER TABLE "header_navbar_items" ADD CONSTRAINT "header_navbar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navbar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navbar" ADD CONSTRAINT "header_navbar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_media" ADD CONSTRAINT "footer_social_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_simple_social_media" ADD CONSTRAINT "footer_simple_social_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_simple"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "layout" ADD CONSTRAINT "layout_header_id_header_id_fk" FOREIGN KEY ("header_id") REFERENCES "public"."header"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layout" ADD CONSTRAINT "layout_footer_id_footer_id_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."footer"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "header_navbar_items_order_idx" ON "header_navbar_items" USING btree ("_order");
  CREATE INDEX "header_navbar_items_parent_id_idx" ON "header_navbar_items" USING btree ("_parent_id");
  CREATE INDEX "header_navbar_order_idx" ON "header_navbar" USING btree ("_order");
  CREATE INDEX "header_navbar_parent_id_idx" ON "header_navbar" USING btree ("_parent_id");
  CREATE INDEX "header_updated_at_idx" ON "header" USING btree ("updated_at");
  CREATE INDEX "header_created_at_idx" ON "header" USING btree ("created_at");
  CREATE INDEX "footer_social_media_order_idx" ON "footer_social_media" USING btree ("_order");
  CREATE INDEX "footer_social_media_parent_id_idx" ON "footer_social_media" USING btree ("_parent_id");
  CREATE INDEX "footer_logo_idx" ON "footer" USING btree ("logo_id");
  CREATE INDEX "footer_updated_at_idx" ON "footer" USING btree ("updated_at");
  CREATE INDEX "footer_created_at_idx" ON "footer" USING btree ("created_at");
  CREATE INDEX "footer_simple_social_media_order_idx" ON "footer_simple_social_media" USING btree ("_order");
  CREATE INDEX "footer_simple_social_media_parent_id_idx" ON "footer_simple_social_media" USING btree ("_parent_id");
  CREATE INDEX "footer_simple_updated_at_idx" ON "footer_simple" USING btree ("updated_at");
  CREATE INDEX "footer_simple_created_at_idx" ON "footer_simple" USING btree ("created_at");
  CREATE INDEX "layout_header_idx" ON "layout" USING btree ("header_id");
  CREATE INDEX "layout_footer_idx" ON "layout" USING btree ("footer_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_header_fk" FOREIGN KEY ("header_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_simple_fk" FOREIGN KEY ("footer_simple_id") REFERENCES "public"."footer_simple"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_header_id_idx" ON "payload_locked_documents_rels" USING btree ("header_id");
  CREATE INDEX "payload_locked_documents_rels_footer_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_id");
  CREATE INDEX "payload_locked_documents_rels_footer_simple_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_simple_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_navbar_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_navbar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_social_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_simple_social_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_simple" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "layout" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "header_navbar_items" CASCADE;
  DROP TABLE "header_navbar" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_social_media" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_simple_social_media" CASCADE;
  DROP TABLE "footer_simple" CASCADE;
  DROP TABLE "layout" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_header_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_footer_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_footer_simple_fk";
  
  DROP INDEX "payload_locked_documents_rels_header_id_idx";
  DROP INDEX "payload_locked_documents_rels_footer_id_idx";
  DROP INDEX "payload_locked_documents_rels_footer_simple_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "header_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "footer_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "footer_simple_id";`)
}

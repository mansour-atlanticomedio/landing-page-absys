import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  
  CREATE TABLE "home_blocks_blogs_block" (
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blogs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "home_rels" ADD COLUMN "blogs_id" integer;
  ALTER TABLE "home_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "blogs_blog_items" ADD CONSTRAINT "blogs_blog_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_partners_item" ADD CONSTRAINT "partners_partners_item_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_partners_item" ADD CONSTRAINT "partners_partners_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_blogs_block" ADD CONSTRAINT "home_blocks_blogs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_partners_block" ADD CONSTRAINT "home_blocks_partners_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "blogs_blog_items_order_idx" ON "blogs_blog_items" USING btree ("_order");
  CREATE INDEX "blogs_blog_items_parent_id_idx" ON "blogs_blog_items" USING btree ("_parent_id");
  CREATE INDEX "blogs_updated_at_idx" ON "blogs" USING btree ("updated_at");
  CREATE INDEX "blogs_created_at_idx" ON "blogs" USING btree ("created_at");
  CREATE INDEX "partners_partners_item_order_idx" ON "partners_partners_item" USING btree ("_order");
  CREATE INDEX "partners_partners_item_parent_id_idx" ON "partners_partners_item" USING btree ("_parent_id");
  CREATE INDEX "partners_partners_item_image_idx" ON "partners_partners_item" USING btree ("image_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "home_blocks_blogs_block_order_idx" ON "home_blocks_blogs_block" USING btree ("_order");
  CREATE INDEX "home_blocks_blogs_block_parent_id_idx" ON "home_blocks_blogs_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_blogs_block_path_idx" ON "home_blocks_blogs_block" USING btree ("_path");
  CREATE INDEX "home_blocks_partners_block_order_idx" ON "home_blocks_partners_block" USING btree ("_order");
  CREATE INDEX "home_blocks_partners_block_parent_id_idx" ON "home_blocks_partners_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_partners_block_path_idx" ON "home_blocks_partners_block" USING btree ("_path");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_blogs_id_idx" ON "payload_locked_documents_rels" USING btree ("blogs_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "home_rels_blogs_id_idx" ON "home_rels" USING btree ("blogs_id");
  CREATE INDEX "home_rels_partners_id_idx" ON "home_rels" USING btree ("partners_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blogs_blog_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blogs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners_partners_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_blogs_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_partners_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blogs_blog_items" CASCADE;
  DROP TABLE "blogs" CASCADE;
  DROP TABLE "partners_partners_item" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "home_blocks_blogs_block" CASCADE;
  DROP TABLE "home_blocks_partners_block" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blogs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partners_fk";
  
  ALTER TABLE "home_rels" DROP CONSTRAINT "home_rels_blogs_fk";
  
  ALTER TABLE "home_rels" DROP CONSTRAINT "home_rels_partners_fk";
  
  DROP INDEX "payload_locked_documents_rels_blogs_id_idx";
  DROP INDEX "payload_locked_documents_rels_partners_id_idx";
  DROP INDEX "home_rels_blogs_id_idx";
  DROP INDEX "home_rels_partners_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blogs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "partners_id";
  ALTER TABLE "home_rels" DROP COLUMN "blogs_id";
  ALTER TABLE "home_rels" DROP COLUMN "partners_id";`)
}

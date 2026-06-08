import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "hero_carrusel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "hero_carrusel" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hero_relation_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_hero_carrusel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hero_carrusel_relation_id" integer,
  	"block_name" varchar
  );
  
  ALTER TABLE "home" DROP CONSTRAINT "home_hero_id_hero_id_fk";
  
  DROP INDEX "home_hero_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "hero_carrusel_id" integer;
  ALTER TABLE "hero_carrusel_items" ADD CONSTRAINT "hero_carrusel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_carrusel_items" ADD CONSTRAINT "hero_carrusel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_block" ADD CONSTRAINT "home_blocks_hero_block_hero_relation_id_hero_id_fk" FOREIGN KEY ("hero_relation_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_block" ADD CONSTRAINT "home_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_carrusel_block" ADD CONSTRAINT "home_blocks_hero_carrusel_block_hero_carrusel_relation_id_hero_carrusel_id_fk" FOREIGN KEY ("hero_carrusel_relation_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_carrusel_block" ADD CONSTRAINT "home_blocks_hero_carrusel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "hero_carrusel_items_order_idx" ON "hero_carrusel_items" USING btree ("_order");
  CREATE INDEX "hero_carrusel_items_parent_id_idx" ON "hero_carrusel_items" USING btree ("_parent_id");
  CREATE INDEX "hero_carrusel_items_image_idx" ON "hero_carrusel_items" USING btree ("image_id");
  CREATE INDEX "hero_carrusel_updated_at_idx" ON "hero_carrusel" USING btree ("updated_at");
  CREATE INDEX "hero_carrusel_created_at_idx" ON "hero_carrusel" USING btree ("created_at");
  CREATE INDEX "home_blocks_hero_block_order_idx" ON "home_blocks_hero_block" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_block_parent_id_idx" ON "home_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_block_path_idx" ON "home_blocks_hero_block" USING btree ("_path");
  CREATE INDEX "home_blocks_hero_block_hero_relation_idx" ON "home_blocks_hero_block" USING btree ("hero_relation_id");
  CREATE INDEX "home_blocks_hero_carrusel_block_order_idx" ON "home_blocks_hero_carrusel_block" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_carrusel_block_parent_id_idx" ON "home_blocks_hero_carrusel_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_carrusel_block_path_idx" ON "home_blocks_hero_carrusel_block" USING btree ("_path");
  CREATE INDEX "home_blocks_hero_carrusel_block_hero_carrusel_relation_idx" ON "home_blocks_hero_carrusel_block" USING btree ("hero_carrusel_relation_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_carrusel_fk" FOREIGN KEY ("hero_carrusel_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_hero_carrusel_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_carrusel_id");
  ALTER TABLE "home" DROP COLUMN "hero_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero_carrusel_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hero_carrusel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_hero_carrusel_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "hero_carrusel_items" CASCADE;
  DROP TABLE "hero_carrusel" CASCADE;
  DROP TABLE "home_blocks_hero_block" CASCADE;
  DROP TABLE "home_blocks_hero_carrusel_block" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_hero_carrusel_fk";
  
  DROP INDEX "payload_locked_documents_rels_hero_carrusel_id_idx";
  ALTER TABLE "home" ADD COLUMN "hero_id" integer;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_hero_idx" ON "home" USING btree ("hero_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "hero_carrusel_id";`)
}

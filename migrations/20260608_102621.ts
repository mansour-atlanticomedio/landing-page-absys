import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_hero_carrusel_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_blocks_hero_block" CASCADE;
  DROP TABLE "home_blocks_hero_carrusel_block" CASCADE;
  ALTER TABLE "home" ADD COLUMN "hero_id" integer;
  ALTER TABLE "home" ADD COLUMN "hero_carrusel_id" integer;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_carrusel_id_hero_carrusel_id_fk" FOREIGN KEY ("hero_carrusel_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_hero_idx" ON "home" USING btree ("hero_id");
  CREATE INDEX "home_hero_carrusel_idx" ON "home" USING btree ("hero_carrusel_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "home" DROP CONSTRAINT "home_hero_carrusel_id_hero_carrusel_id_fk";
  
  DROP INDEX "home_hero_idx";
  DROP INDEX "home_hero_carrusel_idx";
  ALTER TABLE "home_blocks_hero_block" ADD CONSTRAINT "home_blocks_hero_block_hero_relation_id_hero_id_fk" FOREIGN KEY ("hero_relation_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_block" ADD CONSTRAINT "home_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_carrusel_block" ADD CONSTRAINT "home_blocks_hero_carrusel_block_hero_carrusel_relation_id_hero_carrusel_id_fk" FOREIGN KEY ("hero_carrusel_relation_id") REFERENCES "public"."hero_carrusel"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_carrusel_block" ADD CONSTRAINT "home_blocks_hero_carrusel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_blocks_hero_block_order_idx" ON "home_blocks_hero_block" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_block_parent_id_idx" ON "home_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_block_path_idx" ON "home_blocks_hero_block" USING btree ("_path");
  CREATE INDEX "home_blocks_hero_block_hero_relation_idx" ON "home_blocks_hero_block" USING btree ("hero_relation_id");
  CREATE INDEX "home_blocks_hero_carrusel_block_order_idx" ON "home_blocks_hero_carrusel_block" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_carrusel_block_parent_id_idx" ON "home_blocks_hero_carrusel_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_carrusel_block_path_idx" ON "home_blocks_hero_carrusel_block" USING btree ("_path");
  CREATE INDEX "home_blocks_hero_carrusel_block_hero_carrusel_relation_idx" ON "home_blocks_hero_carrusel_block" USING btree ("hero_carrusel_relation_id");
  ALTER TABLE "home" DROP COLUMN "hero_id";
  ALTER TABLE "home" DROP COLUMN "hero_carrusel_id";`)
}

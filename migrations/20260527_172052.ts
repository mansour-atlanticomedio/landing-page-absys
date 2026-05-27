import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_blocks_news_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  ALTER TABLE "home_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "home_blocks_news_block" ADD CONSTRAINT "home_blocks_news_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_blocks_news_block_order_idx" ON "home_blocks_news_block" USING btree ("_order");
  CREATE INDEX "home_blocks_news_block_parent_id_idx" ON "home_blocks_news_block" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_news_block_path_idx" ON "home_blocks_news_block" USING btree ("_path");
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_rels_news_id_idx" ON "home_rels" USING btree ("news_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_news_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_blocks_news_block" CASCADE;
  ALTER TABLE "home_rels" DROP CONSTRAINT "home_rels_news_fk";
  
  DROP INDEX "home_rels_news_id_idx";
  ALTER TABLE "home_rels" DROP COLUMN "news_id";`)
}

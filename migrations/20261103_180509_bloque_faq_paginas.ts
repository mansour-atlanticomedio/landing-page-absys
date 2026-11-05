import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_faq_section_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"faq_id" integer,
  	"show_search" boolean DEFAULT false,
  	"open_first" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_section_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"faq_id" integer,
  	"show_search" boolean DEFAULT false,
  	"open_first" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_faq_section_block" ADD CONSTRAINT "pages_blocks_faq_section_block_faq_id_faq_id_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section_block" ADD CONSTRAINT "pages_blocks_faq_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_section_block" ADD CONSTRAINT "_pages_v_blocks_faq_section_block_faq_id_faq_id_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_section_block" ADD CONSTRAINT "_pages_v_blocks_faq_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_faq_section_block_order_idx" ON "pages_blocks_faq_section_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_section_block_parent_id_idx" ON "pages_blocks_faq_section_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_section_block_path_idx" ON "pages_blocks_faq_section_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_section_block_faq_idx" ON "pages_blocks_faq_section_block" USING btree ("faq_id");
  CREATE INDEX "_pages_v_blocks_faq_section_block_order_idx" ON "_pages_v_blocks_faq_section_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_section_block_parent_id_idx" ON "_pages_v_blocks_faq_section_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_section_block_path_idx" ON "_pages_v_blocks_faq_section_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_section_block_faq_idx" ON "_pages_v_blocks_faq_section_block" USING btree ("faq_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_faq_section_block" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section_block" CASCADE;`)
}

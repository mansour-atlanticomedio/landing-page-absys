import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function createLocationBlockTables(db: MigrateUpArgs['db']): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_location_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"schedule_title" varchar,
  	"schedule_id" integer,
  	"location_title" varchar,
  	"address_line1" varchar,
  	"address_line2" varchar,
  	"directions_button_label" varchar,
  	"contact_title" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"contact_button_label" varchar,
  	"image_id" integer,
  	"building_name" varchar,
  	"building_subtitle" varchar,
  	"map_url" varchar,
  	"map_embed_url" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_location_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"schedule_title" varchar,
  	"schedule_id" integer,
  	"location_title" varchar,
  	"address_line1" varchar,
  	"address_line2" varchar,
  	"directions_button_label" varchar,
  	"contact_title" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"contact_button_label" varchar,
  	"image_id" integer,
  	"building_name" varchar,
  	"building_subtitle" varchar,
  	"map_url" varchar,
  	"map_embed_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_location_block" ADD CONSTRAINT "pages_blocks_location_block_schedule_id_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_location_block" ADD CONSTRAINT "pages_blocks_location_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_location_block" ADD CONSTRAINT "pages_blocks_location_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_location_block" ADD CONSTRAINT "_pages_v_blocks_location_block_schedule_id_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_location_block" ADD CONSTRAINT "_pages_v_blocks_location_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_location_block" ADD CONSTRAINT "_pages_v_blocks_location_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_location_block_order_idx" ON "pages_blocks_location_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_location_block_parent_id_idx" ON "pages_blocks_location_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_location_block_path_idx" ON "pages_blocks_location_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_location_block_schedule_idx" ON "pages_blocks_location_block" USING btree ("schedule_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_location_block_image_idx" ON "pages_blocks_location_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_location_block_order_idx" ON "_pages_v_blocks_location_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_location_block_parent_id_idx" ON "_pages_v_blocks_location_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_location_block_path_idx" ON "_pages_v_blocks_location_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_location_block_schedule_idx" ON "_pages_v_blocks_location_block" USING btree ("schedule_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_location_block_image_idx" ON "_pages_v_blocks_location_block" USING btree ("image_id");`)
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await createLocationBlockTables(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_location_block" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_location_block" CASCADE;`)
}
